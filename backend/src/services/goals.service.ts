import { Prisma } from '@prisma/client';
import { prisma } from '../db/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import type { CreateGoalInput, UpdateGoalInput } from '../api/validators/goals.schema';

export async function createGoal(userId: string, input: CreateGoalInput) {
  return prisma.goal.create({
    data: {
      userId,
      name: input.name,
      targetAmount: new Prisma.Decimal(input.targetAmount),
      currentAmount: new Prisma.Decimal(input.currentAmount ?? 0),
      deadline: input.deadline ? new Date(input.deadline) : null,
    },
  });
}

export async function listGoals(userId: string) {
  return prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

export async function getGoal(userId: string, id: string) {
  const goal = await prisma.goal.findUnique({ where: { id } });
  if (!goal) throw new NotFoundError('Goal not found');
  if (goal.userId !== userId) throw new ForbiddenError();
  return goal;
}

export async function updateGoal(userId: string, id: string, input: UpdateGoalInput) {
  await getGoal(userId, id);

  const data: Prisma.GoalUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.targetAmount !== undefined) data.targetAmount = new Prisma.Decimal(input.targetAmount);
  if (input.currentAmount !== undefined) data.currentAmount = new Prisma.Decimal(input.currentAmount);
  if ('deadline' in input) data.deadline = input.deadline ? new Date(input.deadline) : null;

  return prisma.goal.update({ where: { id }, data });
}

export async function deleteGoal(userId: string, id: string) {
  await getGoal(userId, id);
  await prisma.goal.delete({ where: { id } });
}
