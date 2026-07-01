import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    category: z.string().min(1).max(100),
    limitAmount: z.number().positive('Limit must be positive'),
    period: z.enum(['monthly', 'weekly']),
  }),
});

export const updateBudgetSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    category: z.string().min(1).max(100).optional(),
    limitAmount: z.number().positive().optional(),
    period: z.enum(['monthly', 'weekly']).optional(),
  }),
});

export const budgetIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>['body'];
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>['body'];
