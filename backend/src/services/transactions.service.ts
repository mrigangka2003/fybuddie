import { Prisma, Transaction } from '@prisma/client';
import { prisma } from '../db/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsQuery,
} from '../api/validators/transactions.schema';
import type { PaginatedResult } from '../types';

export async function createTransaction(userId: string, input: CreateTransactionInput) {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount: new Prisma.Decimal(input.amount),
      type: input.type,
      category: input.category,
      description: input.description,
      date: new Date(input.date),
    },
  });
  return transaction;
}

export async function listTransactions(
  userId: string,
  query: ListTransactionsQuery,
): Promise<PaginatedResult<Prisma.TransactionGetPayload<Record<string, never>>>> {
  const { type, category, startDate, endDate } = query;
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.TransactionWhereInput = { userId };
  if (type) where.type = type;
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [data, total] = await prisma.$transaction([
    prisma.transaction.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
    prisma.transaction.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getTransaction(userId: string, id: string) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction) throw new NotFoundError('Transaction not found');
  if (transaction.userId !== userId) throw new ForbiddenError();
  return transaction;
}

export async function updateTransaction(
  userId: string,
  id: string,
  input: UpdateTransactionInput,
) {
  await getTransaction(userId, id); // ownership check

  const data: Prisma.TransactionUpdateInput = {};
  if (input.amount !== undefined) data.amount = new Prisma.Decimal(input.amount);
  if (input.type !== undefined) data.type = input.type;
  if (input.category !== undefined) data.category = input.category;
  if ('description' in input) data.description = input.description;
  if (input.date !== undefined) data.date = new Date(input.date);

  return prisma.transaction.update({ where: { id }, data });
}

export async function deleteTransaction(userId: string, id: string) {
  await getTransaction(userId, id); // ownership check
  await prisma.transaction.delete({ where: { id } });
}
