import type {
  Activity,
  ActivityType,
  RecordActivityBody,
} from '../types/activity';
import type { Group } from '../types/group';
import { PERSONAL_GROUP } from '../types/group';
import { useAuthStore } from '../store/authStore';
import { DEMO_USER } from './demoSession';
import type { FeedParams } from '../api/activities';

/**
 * 데모 피드 저장소 — 백엔드 없이 localStorage 로 활동을 읽고 쓴다.
 * 첫 방문 시 여러 사용자/모든 활동 타입의 시드를 깔아 피드를 풍성하게 보여준다.
 * 각 도메인 페이지(캘린더·가계부·…)는 `appendDemoActivity()` 로 이 피드에 이벤트를 흘려보낸다.
 */

const STORAGE_KEY = 'rally-demo-feed';
const LATENCY_MS = 160; // 로딩 스피너가 자연스럽게 보이도록 약간의 지연

interface DemoActor {
  id: number;
  name: string;
}

const ACTORS: Record<string, DemoActor> = {
  me: { id: DEMO_USER.id, name: DEMO_USER.nickname },
  jimin: { id: 2, name: '지민' },
  dohyun: { id: 3, name: '도현' },
  seoyun: { id: 4, name: '서윤' },
  hajun: { id: 5, name: '하준' },
};

/** 데모 그룹(개인 + 데모 그룹들). 실제로는 group-service 가 내려준다. */
export const DEMO_GROUPS: Group[] = [
  PERSONAL_GROUP,
  { id: 1, name: '러닝 크루' },
  { id: 2, name: '주식 스터디' },
  { id: 3, name: '롤 친구들' },
];

/** n분 전 ISO 문자열. */
function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}

function seed(): Activity[] {
  let id = 1000;
  const make = (
    actor: DemoActor,
    type: ActivityType,
    payload: Record<string, unknown>,
    minsAgo: number,
    groupId: number | null = 1
  ): Activity => ({
    id: id++,
    actorId: actor.id,
    actorName: actor.name,
    groupId,
    type,
    payload,
    occurredAt: minutesAgo(minsAgo),
    schemaVersion: 1,
  });

  return [
    make(ACTORS.jimin, 'CHECKIN', { habit: '아침 러닝', note: '5km 완료. 3일 연속!' }, 4, 1),
    make(ACTORS.me, 'TODO', { title: '주간 회고 작성' }, 12, null),
    make(ACTORS.dohyun, 'LOL_MATCH', { champion: '아트록스', result: '승', kda: '7/2/9' }, 22, 3),
    make(ACTORS.me, 'LEDGER', { memo: '점심', category: '식비', amount: -9000 }, 38, null),
    make(ACTORS.seoyun, 'MESSAGE', { text: '이번 주 토요일 같이 등산 갈 사람?' }, 51, 1),
    make(ACTORS.me, 'SCHEDULE', { title: '치과 예약', note: '오후 3시' }, 70, null),
    make(ACTORS.hajun, 'PRICE_ALERT', { symbol: 'NVDA', note: '목표가 도달', changePct: 2.4 }, 95, 2),
    make(ACTORS.me, 'CHECKIN', { habit: '물 2L', note: '성공' }, 140, null),
    make(ACTORS.jimin, 'TODO', { title: '독서 30분' }, 200, 1),
    make(ACTORS.dohyun, 'MESSAGE', { text: '오늘 다들 인증 잊지 마세요!' }, 320, 1),
    make(ACTORS.seoyun, 'LOL_MATCH', { champion: '럭스', result: '패', kda: '3/5/12' }, 1440, 3),
  ];
}

function load(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Activity[];
  } catch {
    /* 손상된 데이터는 무시하고 다시 시드 */
  }
  const seeded = seed();
  save(seeded);
  return seeded;
}

function save(list: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* 용량 초과 등은 무시 */
  }
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

/** GET /api/activities/feed 데모 구현 — 그룹/타입 필터 + 최신순 + limit. */
export async function getDemoFeed(params: FeedParams = {}): Promise<Activity[]> {
  let list = [...load()];
  if (params.groupId !== undefined) {
    list = list.filter((a) => a.groupId === params.groupId);
  }
  if (params.types && params.types.length > 0) {
    const set = new Set(params.types);
    list = list.filter((a) => set.has(a.type));
  }
  list.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const limited = params.limit ? list.slice(0, params.limit) : list;
  return delay(limited);
}

/** 현재 게스트 명의로 Activity 를 만들어 피드 앞에 추가한다(저장만, 지연 없음). */
export function appendDemoActivity(body: RecordActivityBody): Activity {
  const list = load();
  const nickname = useAuthStore.getState().user?.nickname ?? DEMO_USER.nickname;
  const nextId = list.reduce((max, a) => Math.max(max, a.id), 0) + 1;

  const activity: Activity = {
    id: nextId,
    actorId: DEMO_USER.id,
    actorName: nickname,
    groupId: body.groupId ?? null,
    type: body.type,
    payload: body.payload ?? {},
    occurredAt: body.occurredAt ?? new Date().toISOString(),
    schemaVersion: 1,
  };

  save([activity, ...list]);
  return activity;
}

/** POST /api/activities 데모 구현. */
export async function recordDemoActivity(
  body: RecordActivityBody
): Promise<Activity> {
  return delay(appendDemoActivity(body));
}
