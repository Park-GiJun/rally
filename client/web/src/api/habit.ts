import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { Habit, CreateHabitBody } from '../types/habit';
import { DEMO_MODE } from '../config';
import {
  listDemoHabits,
  createDemoHabit,
  checkInDemoHabit,
  removeDemoHabit,
} from '../demo/demoHabit';

/** 실 API 전환: DEMO_MODE=false 면 아래 /api 경로로 그대로 붙는다(백엔드 habit-service 계약). */
export async function listHabitsApi(): Promise<Habit[]> {
  if (DEMO_MODE) return listDemoHabits();
  const res = await api.get<ApiResponse<Habit[]>>('/habits');
  return unwrap(res);
}

export async function createHabitApi(body: CreateHabitBody): Promise<Habit> {
  if (DEMO_MODE) return createDemoHabit(body);
  const res = await api.post<ApiResponse<Habit>>('/habits', body);
  return unwrap(res);
}

export async function checkInHabitApi(id: number): Promise<Habit> {
  if (DEMO_MODE) return checkInDemoHabit(id);
  const res = await api.post<ApiResponse<Habit>>(`/habits/${id}/checkin`, {});
  return unwrap(res);
}

export async function removeHabitApi(id: number): Promise<void> {
  if (DEMO_MODE) return removeDemoHabit(id);
  await api.delete<ApiResponse<void>>(`/habits/${id}`);
}
