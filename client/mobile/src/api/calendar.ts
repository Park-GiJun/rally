import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { CalendarEvent, CreateEventBody } from '../types/calendar';
import { DEMO_MODE } from '../config';
import {
  listDemoEvents,
  createDemoEvent,
  removeDemoEvent,
} from '../demo/demoCalendar';

/** 실 API 전환: DEMO_MODE=false 면 아래 /api 경로로 그대로 붙는다(백엔드 schedule 계약). */
export async function listEventsApi(): Promise<CalendarEvent[]> {
  if (DEMO_MODE) return listDemoEvents();
  const res = await api.get<ApiResponse<CalendarEvent[]>>('/schedules');
  return unwrap(res);
}

export async function createEventApi(body: CreateEventBody): Promise<CalendarEvent> {
  if (DEMO_MODE) return createDemoEvent(body);
  const res = await api.post<ApiResponse<CalendarEvent>>('/schedules', body);
  return unwrap(res);
}

export async function removeEventApi(id: number): Promise<void> {
  if (DEMO_MODE) return removeDemoEvent(id);
  await api.delete<ApiResponse<void>>(`/schedules/${id}`);
}
