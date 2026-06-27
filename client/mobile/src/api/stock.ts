import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { Holding, AddHoldingBody } from '../types/stock';
import { DEMO_MODE } from '../config';
import {
  listDemoHoldings,
  addDemoHolding,
  removeDemoHolding,
  tickDemoPrices,
} from '../demo/demoStock';

/** 실 API 전환: DEMO_MODE=false 면 아래 /api 경로로 그대로 붙는다(백엔드 market-service 계약). */
export async function listHoldingsApi(): Promise<Holding[]> {
  if (DEMO_MODE) return listDemoHoldings();
  const res = await api.get<ApiResponse<Holding[]>>('/stocks/watchlist');
  return unwrap(res);
}

export async function addHoldingApi(body: AddHoldingBody): Promise<Holding> {
  if (DEMO_MODE) return addDemoHolding(body);
  const res = await api.post<ApiResponse<Holding>>('/stocks/watchlist', body);
  return unwrap(res);
}

export async function removeHoldingApi(id: number): Promise<void> {
  if (DEMO_MODE) return removeDemoHolding(id);
  await api.delete<ApiResponse<void>>(`/stocks/watchlist/${id}`);
}

export async function refreshPricesApi(): Promise<Holding[]> {
  if (DEMO_MODE) return tickDemoPrices();
  const res = await api.get<ApiResponse<Holding[]>>('/stocks/quotes');
  return unwrap(res);
}
