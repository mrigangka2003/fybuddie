import { Request, Response } from 'express';
import * as goalService from '../../services/goals.service';
import type { CreateGoalInput, UpdateGoalInput } from '../validators/goals.schema';

export async function create(
  req: Request<object, object, CreateGoalInput>,
  res: Response,
): Promise<void> {
  const goal = await goalService.createGoal(req.user!.sub, req.body);
  res.status(201).json({ success: true, data: goal });
}

export async function list(req: Request, res: Response): Promise<void> {
  const goals = await goalService.listGoals(req.user!.sub);
  res.status(200).json({ success: true, data: goals });
}

export async function getOne(req: Request<{ id: string }>, res: Response): Promise<void> {
  const goal = await goalService.getGoal(req.user!.sub, req.params.id);
  res.status(200).json({ success: true, data: goal });
}

export async function update(
  req: Request<{ id: string }, object, UpdateGoalInput>,
  res: Response,
): Promise<void> {
  const goal = await goalService.updateGoal(req.user!.sub, req.params.id, req.body);
  res.status(200).json({ success: true, data: goal });
}

export async function remove(req: Request<{ id: string }>, res: Response): Promise<void> {
  await goalService.deleteGoal(req.user!.sub, req.params.id);
  res.status(204).send();
}
