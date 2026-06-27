import type { Habit, CreateHabitBody } from '../types/habit';
import { loadList, saveList, nextId, delay } from './demoStore';
import { appendDemoActivity } from './demoFeed';

const KEY = 'habit';

/** 오늘 날짜(YYYY-MM-DD). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function seed(): Habit[] {
  return [
    { id: 1, name: '아침 러닝', streak: 3, checkedToday: false, lastCheckedDate: null },
    { id: 2, name: '독서 30분', streak: 7, checkedToday: true, lastCheckedDate: today() },
    { id: 3, name: '물 2L', streak: 1, checkedToday: false, lastCheckedDate: null },
  ];
}

export async function listDemoHabits(): Promise<Habit[]> {
  return delay(loadList(KEY, seed));
}

export async function createDemoHabit(body: CreateHabitBody): Promise<Habit> {
  const list = loadList(KEY, seed);
  const habit: Habit = {
    id: nextId(list),
    name: body.name,
    streak: 0,
    checkedToday: false,
    lastCheckedDate: null,
  };
  saveList(KEY, [habit, ...list]);
  return delay(habit);
}

export async function checkInDemoHabit(id: number): Promise<Habit> {
  const list = loadList(KEY, seed);
  const target = list.find((h) => h.id === id);
  if (!target) throw new Error('습관을 찾을 수 없어요.');
  // 이미 오늘 인증했다면 멱등하게 그대로 반환한다.
  if (target.checkedToday) return delay(target);
  const updated: Habit = {
    ...target,
    checkedToday: true,
    streak: target.streak + 1,
    lastCheckedDate: today(),
  };
  saveList(KEY, list.map((h) => (h.id === id ? updated : h)));
  // 인증 성공 시 피드에 CHECKIN 활동을 흘려보낸다.
  appendDemoActivity({
    type: 'CHECKIN',
    payload: { habit: updated.name, note: `${updated.streak}일 연속` },
  });
  return delay(updated);
}

export async function removeDemoHabit(id: number): Promise<void> {
  const list = loadList(KEY, seed);
  saveList(KEY, list.filter((h) => h.id !== id));
  return delay(undefined);
}
