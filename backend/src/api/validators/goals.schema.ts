import { z } from 'zod';

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a date string YYYY-MM-DD');

export const createGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    targetAmount: z.number().positive('Target amount must be positive'),
    currentAmount: z.number().min(0).default(0),
    deadline: dateString.optional().nullable(),
  }),
});

export const updateGoalSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().min(0).optional(),
    deadline: dateString.optional().nullable(),
  }),
});

export const goalIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>['body'];
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>['body'];
