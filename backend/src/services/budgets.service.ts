import { Prisma } from '@prisma/client';
import { prisma } from '../db/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import type { CreateBudgetInput, UpdateBudgetInput } from '../api/validators/budgets.schema';

export async function createBudget(userId: string, input: CreateBudgetInput) {
  return prisma.budget.create({
    data: {
      userId,
      category: input.category,
      limitAmount: new Prisma.Decimal(input.limitAmount),
      period: input.period,
    },
  });
}

export async function listBudgets(userId: string) {
  return prisma.budget.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

export async function getBudget(userId: string, id: string) {
  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget) throw new NotFoundError('Budget not found');
  if (budget.userId !== userId) throw new ForbiddenError();
  return budget;
}

export async function updateBudget(userId: string, id: string, input: UpdateBudgetInput) {
  await getBudget(userId, id); // ownership check

  const data: Prisma.BudgetUpdateInput = {};
  if (input.category !== undefined) data.category = input.category;
  if (input.limitAmount !== undefined) data.limitAmount = new Prisma.Decimal(input.limitAmount);
  if (input.period !== undefined) data.period = input.period;

  return prisma.budget.update({ where: { id }, data });
}

export async function deleteBudget(userId: string, id: string) {
  await getBudget(userId, id);
  await prisma.budget.delete({ where: { id } });
}
