import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type { Group } from '../types/group';
import { DEMO_MODE } from '../config';
import { DEMO_GROUPS } from '../demo/demoFeed';

/** GET /api/groups — 내가 속한 그룹(개인 포함). 데모는 시드 그룹. */
export async function getGroupsApi(): Promise<Group[]> {
  if (DEMO_MODE) return DEMO_GROUPS;
  const res = await api.get<ApiResponse<Group[]>>('/groups');
  return unwrap(res);
}
