import type { CalendarEvent, CreateEventBody } from '../types/calendar';
import { loadList, saveList, nextId, delay } from './demoStore';
import { appendDemoActivity } from './demoFeed';

const KEY = 'calendar';

/** n일 전/후의 YYYY-MM-DD (로컬 기준). */
function ymd(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function seed(): CalendarEvent[] {
  return [
    { id: 1, title: '치과 예약', date: ymd(0), time: '15:00', note: '스케일링' },
    { id: 2, title: '팀 회의', date: ymd(1), time: '10:30' },
    { id: 3, title: '러닝 크루 모임', date: ymd(2), time: '19:00', note: '한강 집결' },
    { id: 4, title: '부모님 생신', date: ymd(5) },
  ];
}

export async function listDemoEvents(): Promise<CalendarEvent[]> {
  return delay(loadList(KEY, seed));
}

export async function createDemoEvent(body: CreateEventBody): Promise<CalendarEvent> {
  const list = loadList(KEY, seed);
  const event: CalendarEvent = {
    id: nextId(list),
    title: body.title,
    date: body.date,
    time: body.time,
    note: body.note,
  };
  saveList(KEY, [event, ...list]);
  // 일정 추가를 대시보드 피드에 흘려보낸다.
  appendDemoActivity({ type: 'SCHEDULE', payload: { title: body.title, note: body.date } });
  return delay(event);
}

export async function removeDemoEvent(id: number): Promise<void> {
  const list = loadList(KEY, seed);
  saveList(KEY, list.filter((e) => e.id !== id));
  return delay(undefined);
}
