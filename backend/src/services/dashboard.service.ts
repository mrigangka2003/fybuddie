import { Prisma } from '@prisma/client';
import { prisma } from '../db/client';

export async function getDashboardSummary(userId: string) {
  // Current month bounds
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [incomeAgg, expenseAgg, budgets, goals, recentTransactions] = await Promise.all([
    // Total income this month
    prisma.transaction.aggregate({
      where: { userId, type: 'income', date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    // Total expenses this month
    prisma.transaction.aggregate({
      where: { userId, type: 'expense', date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    // All budgets with current spend
    prisma.budget.findMany({ where: { userId } }),
    // All goals
    prisma.goal.findMany({ where: { userId } }),
    // Last 5 transactions
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
  const netBalance = totalIncome - totalExpenses;

  // For each budget, calculate how much has been spent in the current period
  const budgetsWithSpend = await Promise.all(
    budgets.map(async (budget) => {
      const periodStart =
        budget.period === 'monthly'
          ? startOfMonth
          : // weekly: start of current week (Monday)
            (() => {
              const d = new Date();
              const day = d.getDay(); // 0 = Sun
              const diff = day === 0 ? -6 : 1 - day;
              d.setDate(d.getDate() + diff);
              d.setHours(0, 0, 0, 0);
              return d;
            })();

      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          type: 'expense',
          category: budget.category,
          date: { gte: periodStart },
        },
        _sum: { amount: true },
      });

      const spentAmount = Number(spent._sum.amount ?? 0);
      const limitAmount = Number(budget.limitAmount);

      return {
        ...budget,
        limitAmount: budget.limitAmount.toString(),
        spentAmount,
        remainingAmount: limitAmount - spentAmount,
        percentUsed: limitAmount > 0 ? Math.round((spentAmount / limitAmount) * 100) : 0,
      };
    }),
  );

  return {
    period: {
      start: startOfMonth.toISOString(),
      end: endOfMonth.toISOString(),
    },
    summary: {
      totalIncome,
      totalExpenses,
      netBalance,
    },
    budgets: budgetsWithSpend,
    goals: goals.map((g) => ({
      ...g,
      targetAmount: g.targetAmount.toString(),
      currentAmount: g.currentAmount.toString(),
      progressPercent:
        Number(g.targetAmount) > 0
          ? Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100)
          : 0,
    })),
    recentTransactions: recentTransactions.map((t) => ({
      ...t,
      amount: t.amount.toString(),
    })),
  };
}

export async function getSpendingByCategory(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await prisma.transaction.groupBy({
    by: ['category'],
    where: { userId, type: 'expense', date: { gte: startOfMonth } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
  });

  return result.map((r) => ({
    category: r.category,
    total: Number(r._sum.amount ?? new Prisma.Decimal(0)),
  }));
}
