/**
 * 도메인 데모 저장소 공용 헬퍼 — 각 도메인 demo 모듈이 재사용한다.
 * localStorage 네임스페이스 + 약간의 지연(로딩 UI)으로 "진짜 API 같은" 데모를 만든다.
 */

const PREFIX = 'rally-demo:';
const LATENCY_MS = 140;

export function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

/** 키의 리스트를 읽는다. 없으면 seed 를 깔고 반환. */
export function loadList<T>(key: string, seed: () => T[]): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    /* 손상 데이터 무시 → 다시 시드 */
  }
  const seeded = seed();
  saveList(key, seeded);
  return seeded;
}

export function saveList<T>(key: string, list: T[]): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(list));
  } catch {
    /* 용량 초과 등 무시 */
  }
}

/** 숫자 id 리스트의 다음 id. */
export function nextId(list: { id: number }[]): number {
  return list.reduce((max, x) => Math.max(max, x.id), 0) + 1;
}

/** n일 전/후 ISO. */
export function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86_400_000).toISOString();
}
