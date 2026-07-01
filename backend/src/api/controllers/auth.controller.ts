import { Request, Response } from 'express';
import * as authService from '../../services/auth.service';
import { COOKIE_REFRESH_TOKEN, COOKIE_OPTIONS } from '../../config/constants';
import type { SignupInput, LoginInput } from '../validators/auth.schema';

export async function signup(req: Request<object, object, SignupInput>, res: Response): Promise<void> {
  const { user, accessToken, refreshToken } = await authService.signup(req.body);
  res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ success: true, data: { user, accessToken } });
}

export async function login(req: Request<object, object, LoginInput>, res: Response): Promise<void> {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, data: { user, accessToken } });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token: string | undefined = req.cookies[COOKIE_REFRESH_TOKEN];
  if (!token) {
    res.status(401).json({ success: false, message: 'No refresh token provided' });
    return;
  }
  const { accessToken, refreshToken } = await authService.refreshTokens(token);
  res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ success: true, data: { accessToken } });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(COOKIE_REFRESH_TOKEN, { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}
