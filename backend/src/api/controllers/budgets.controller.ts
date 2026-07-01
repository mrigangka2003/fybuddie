import { Request, Response } from 'express';
import * as budgetService from '../../services/budgets.service';
import type { CreateBudgetInput, UpdateBudgetInput } from '../validators/budgets.schema';

export async function create(
  req: Request<object, object, CreateBudgetInput>,
  res: Response,
): Promise<void> {
  const budget = await budgetService.createBudget(req.user!.sub, req.body);
  res.status(201).json({ success: true, data: budget });
}

export async function list(req: Request, res: Response): Promise<void> {
  const budgets = await budgetService.listBudgets(req.user!.sub);
  res.status(200).json({ success: true, data: budgets });
}

export async function getOne(req: Request<{ id: string }>, res: Response): Promise<void> {
  const budget = await budgetService.getBudget(req.user!.sub, req.params.id);
  res.status(200).json({ success: true, data: budget });
}

export async function update(
  req: Request<{ id: string }, object, UpdateBudgetInput>,
  res: Response,
): Promise<void> {
  const budget = await budgetService.updateBudget(req.user!.sub, req.params.id, req.body);
  res.status(200).json({ success: true, data: budget });
}

export async function remove(req: Request<{ id: string }>, res: Response): Promise<void> {
  await budgetService.deleteBudget(req.user!.sub, req.params.id);
  res.status(204).send();
}
