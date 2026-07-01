import { Request, Response } from 'express';
import * as notifService from '../../services/notifications.service';

export async function list(req: Request, res: Response): Promise<void> {
  const notifications = await notifService.listNotifications(req.user!.sub);
  res.status(200).json({ success: true, data: notifications });
}

export async function markRead(req: Request<{ id: string }>, res: Response): Promise<void> {
  const notification = await notifService.markAsRead(req.user!.sub, req.params.id);
  res.status(200).json({ success: true, data: notification });
}

export async function markAllRead(req: Request, res: Response): Promise<void> {
  const result = await notifService.markAllAsRead(req.user!.sub);
  res.status(200).json({ success: true, data: result });
}
