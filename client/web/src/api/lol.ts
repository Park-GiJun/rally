import { api, unwrap } from './client';
import type { ApiResponse } from '../types/common';
import type {
  SummonerProfile,
  LolMatch,
  GroupRankRow,
  LinkSummonerBody,
} from '../types/lol';
import { DEMO_MODE } from '../config';
import {
  getDemoProfile,
  listDemoMatches,
  getDemoGroupRanking,
  linkDemoSummoner,
  syncDemoMatch,
} from '../demo/demoLol';

/** 실 API 전환: DEMO_MODE=false 면 아래 /lol 경로로 그대로 붙는다(백엔드 lol-service 계약). */
export async function getProfileApi(): Promise<SummonerProfile> {
  if (DEMO_MODE) return getDemoProfile();
  const res = await api.get<ApiResponse<SummonerProfile>>('/lol/profile');
  return unwrap(res);
}

export async function listMatchesApi(): Promise<LolMatch[]> {
  if (DEMO_MODE) return listDemoMatches();
  const res = await api.get<ApiResponse<LolMatch[]>>('/lol/matches');
  return unwrap(res);
}

export async function getGroupRankingApi(): Promise<GroupRankRow[]> {
  if (DEMO_MODE) return getDemoGroupRanking();
  const res = await api.get<ApiResponse<GroupRankRow[]>>('/lol/group-ranking');
  return unwrap(res);
}

export async function linkSummonerApi(body: LinkSummonerBody): Promise<SummonerProfile> {
  if (DEMO_MODE) return linkDemoSummoner(body);
  const res = await api.post<ApiResponse<SummonerProfile>>('/lol/link', body);
  return unwrap(res);
}

export async function syncMatchesApi(): Promise<LolMatch> {
  if (DEMO_MODE) return syncDemoMatch();
  const res = await api.post<ApiResponse<LolMatch>>('/lol/sync', {});
  return unwrap(res);
}
