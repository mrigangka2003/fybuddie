import { Request, Response } from 'express';
import * as txService from '../../services/transactions.service';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsQuery,
} from '../validators/transactions.schema';

export async function create(
  req: Request<object, object, CreateTransactionInput>,
  res: Response,
): Promise<void> {
  const tx = await txService.createTransaction(req.user!.sub, req.body);
  res.status(201).json({ success: true, data: tx });
}

export async function list(
  req: Request<object, object, object, ListTransactionsQuery>,
  res: Response,
): Promise<void> {
  const result = await txService.listTransactions(req.user!.sub, req.query as ListTransactionsQuery);
  res.status(200).json({ success: true, ...result });
}

export async function getOne(req: Request<{ id: string }>, res: Response): Promise<void> {
  const tx = await txService.getTransaction(req.user!.sub, req.params.id);
  res.status(200).json({ success: true, data: tx });
}

export async function update(
  req: Request<{ id: string }, object, UpdateTransactionInput>,
  res: Response,
): Promise<void> {
  const tx = await txService.updateTransaction(req.user!.sub, req.params.id, req.body);
  res.status(200).json({ success: true, data: tx });
}

export async function remove(req: Request<{ id: string }>, res: Response): Promise<void> {
  await txService.deleteTransaction(req.user!.sub, req.params.id);
  res.status(204).send();
}
