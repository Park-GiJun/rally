import type { LedgerEntry, CreateLedgerBody } from '../types/ledger';
import { loadList, saveList, nextId, delay, daysFromNow } from './demoStore';
import { appendDemoActivity } from './demoFeed';

const KEY = 'ledger';

/** n일 전/후 날짜를 YYYY-MM-DD 로. */
function dayString(n: number): string {
  return daysFromNow(n).slice(0, 10);
}

function seed(): LedgerEntry[] {
  return [
    { id: 1, kind: 'income', amount: 2_800_000, category: '급여', memo: '6월 월급', date: dayString(-12) },
    { id: 2, kind: 'expense', amount: 9_000, category: '식비', memo: '점심', date: dayString(-3) },
    { id: 3, kind: 'expense', amount: 4_500, category: '카페', memo: '아메리카노', date: dayString(-2) },
    { id: 4, kind: 'expense', amount: 1_250, category: '교통', memo: '지하철', date: dayString(-1) },
    { id: 5, kind: 'income', amount: 50_000, category: '용돈', date: dayString(0) },
  ];
}

export async function listDemoEntries(): Promise<LedgerEntry[]> {
  return delay(loadList(KEY, seed));
}

export async function createDemoEntry(body: CreateLedgerBody): Promise<LedgerEntry> {
  const list = loadList(KEY, seed);
  const entry: LedgerEntry = {
    id: nextId(list),
    kind: body.kind,
    amount: body.amount,
    category: body.category,
    memo: body.memo,
    date: body.date,
  };
  saveList(KEY, [entry, ...list]);
  // 기록할 때마다 대시보드 피드로 활동을 흘려보낸다.
  appendDemoActivity({
    type: 'LEDGER',
    payload: {
      memo: body.memo ?? body.category,
      category: body.category,
      amount: body.kind === 'expense' ? -body.amount : body.amount,
    },
  });
  return delay(entry);
}

export async function removeDemoEntry(id: number): Promise<void> {
  const list = loadList(KEY, seed);
  saveList(KEY, list.filter((e) => e.id !== id));
  return delay(undefined);
}
