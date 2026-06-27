import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { Activity, ActivityType, RecordActivityBody } from '../types/activity';
import { DEMO_MODE } from '../config';
import { getDemoFeed, recordDemoActivity } from '../demo/demoFeed';

export interface FeedParams {
  /** 특정 그룹으로 필터(undefined=전체, null=개인). */
  groupId?: number | null;
  /** 섹션(타입) 필터 — 빈 배열/미지정이면 전체 타입. */
  types?: ActivityType[];
  limit?: number;
}

/** GET /api/activities/feed — groupId 없으면 전체, types 로 섹션 필터. */
export async function getFeedApi(params: FeedParams = {}): Promise<Activity[]> {
  if (DEMO_MODE) return getDemoFeed(params);
  const res = await api.get<ApiResponse<Activity[]>>('/activities/feed', {
    params,
  });
  return unwrap(res);
}

/** POST /api/activities — 활동 기록(actorId 는 게이트웨이가 헤더로 주입). */
export async function recordActivityApi(
  body: RecordActivityBody
): Promise<Activity> {
  if (DEMO_MODE) return recordDemoActivity(body);
  const res = await api.post<ApiResponse<Activity>>('/activities', body);
  return unwrap(res);
}
