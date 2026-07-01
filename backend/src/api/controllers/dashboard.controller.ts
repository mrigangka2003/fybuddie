import { Request, Response } from 'express';
import * as dashboardService from '../../services/dashboard.service';

export async function summary(req: Request, res: Response): Promise<void> {
  const data = await dashboardService.getDashboardSummary(req.user!.sub);
  res.status(200).json({ success: true, data });
}

export async function spendingByCategory(req: Request, res: Response): Promise<void> {
  const data = await dashboardService.getSpendingByCategory(req.user!.sub);
  res.status(200).json({ success: true, data });
}
