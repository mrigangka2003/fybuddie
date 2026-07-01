/**
 * Dev seed — creates a test user + some sample data.
 * Run: npx tsx src/db/seed.ts
 */
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';

  // Upsert the test user so re-running is safe
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Test User',
    },
  });

  console.log(`Seeded user: ${user.email} (id: ${user.id})`);

  // Budgets
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: 'Food', limitAmount: new Prisma.Decimal(500), period: 'monthly' },
      { userId: user.id, category: 'Transport', limitAmount: new Prisma.Decimal(200), period: 'monthly' },
      { userId: user.id, category: 'Entertainment', limitAmount: new Prisma.Decimal(150), period: 'monthly' },
    ],
  });
  console.log('Seeded 3 budgets');

  // Goals
  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        name: 'Emergency Fund',
        targetAmount: new Prisma.Decimal(10000),
        currentAmount: new Prisma.Decimal(2500),
        deadline: new Date('2025-12-31'),
      },
      {
        userId: user.id,
        name: 'Vacation',
        targetAmount: new Prisma.Decimal(3000),
        currentAmount: new Prisma.Decimal(800),
        deadline: new Date('2025-07-01'),
      },
    ],
  });
  console.log('Seeded 2 goals');

  // Transactions
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  const now = new Date();
  const transactions: Prisma.TransactionCreateManyInput[] = [
    { userId: user.id, amount: new Prisma.Decimal(3500), type: 'income', category: 'Salary', date: new Date(now.getFullYear(), now.getMonth(), 1) },
    { userId: user.id, amount: new Prisma.Decimal(120), type: 'expense', category: 'Food', description: 'Groceries', date: new Date(now.getFullYear(), now.getMonth(), 3) },
    { userId: user.id, amount: new Prisma.Decimal(45), type: 'expense', category: 'Transport', description: 'Uber', date: new Date(now.getFullYear(), now.getMonth(), 5) },
    { userId: user.id, amount: new Prisma.Decimal(60), type: 'expense', category: 'Entertainment', description: 'Cinema & dinner', date: new Date(now.getFullYear(), now.getMonth(), 8) },
    { userId: user.id, amount: new Prisma.Decimal(200), type: 'expense', category: 'Food', description: 'Restaurant', date: new Date(now.getFullYear(), now.getMonth(), 10) },
    { userId: user.id, amount: new Prisma.Decimal(500), type: 'income', category: 'Freelance', description: 'Side project', date: new Date(now.getFullYear(), now.getMonth(), 12) },
  ];
  await prisma.transaction.createMany({ data: transactions });
  console.log(`Seeded ${transactions.length} transactions`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
