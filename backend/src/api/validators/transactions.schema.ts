import { z } from 'zod';

// ISO date string YYYY-MM-DD — zod 3.22 doesn't have .date() on ZodString
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a date string YYYY-MM-DD');

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    date: z.string().datetime({ offset: true }).or(dateString),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    date: z.string().datetime({ offset: true }).or(dateString).optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const listTransactionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>['body'];
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>['body'];
export type ListTransactionsQuery = z.infer<typeof listTransactionsSchema>['query'];
