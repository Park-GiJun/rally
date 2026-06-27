import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type {
  LoginBody,
  RegisterBody,
  TokenResponse,
  User,
} from '../types/auth';
import { DEMO_MODE } from '../config';
import { demoLogin, demoMe, demoRegister } from '../demo/demoSession';

export async function registerApi(body: RegisterBody): Promise<User> {
  if (DEMO_MODE) return demoRegister(body);
  const res = await api.post<ApiResponse<User>>('/auth/register', body);
  return unwrap(res);
}

export async function loginApi(body: LoginBody): Promise<TokenResponse> {
  if (DEMO_MODE) return demoLogin(body);
  const res = await api.post<ApiResponse<TokenResponse>>('/auth/login', body);
  return unwrap(res);
}

export async function getMeApi(): Promise<User> {
  if (DEMO_MODE) return demoMe();
  const res = await api.get<ApiResponse<User>>('/users/me');
  return unwrap(res);
}
