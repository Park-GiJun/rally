import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { LedgerEntry, CreateLedgerBody } from '../types/ledger';
import { DEMO_MODE } from '../config';
import {
  listDemoEntries,
  createDemoEntry,
  removeDemoEntry,
} from '../demo/demoLedger';

/** 실 API 전환: DEMO_MODE=false 면 아래 /api 경로로 그대로 붙는다(백엔드 ledger 계약). */
export async function listEntriesApi(): Promise<LedgerEntry[]> {
  if (DEMO_MODE) return listDemoEntries();
  const res = await api.get<ApiResponse<LedgerEntry[]>>('/ledger');
  return unwrap(res);
}

export async function createEntryApi(body: CreateLedgerBody): Promise<LedgerEntry> {
  if (DEMO_MODE) return createDemoEntry(body);
  const res = await api.post<ApiResponse<LedgerEntry>>('/ledger', body);
  return unwrap(res);
}

export async function removeEntryApi(id: number): Promise<void> {
  if (DEMO_MODE) return removeDemoEntry(id);
  await api.delete<ApiResponse<void>>(`/ledger/${id}`);
}
