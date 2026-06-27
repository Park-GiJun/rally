/** LoL 전적 대시보드 도메인 타입 — 백엔드 lol-service(Riot 연동) 계약과 일치 예정. */

export interface SummonerProfile {
  name: string;
  tagLine: string;
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
}

export interface LolMatch {
  id: number;
  champion: string;
  result: '승' | '패';
  kills: number;
  deaths: number;
  assists: number;
  playedAt: string;
}

export interface GroupRankRow {
  rank: number;
  summonerName: string;
  tier: string;
  lp: number;
  todayWins: number;
  todayLosses: number;
}

/** POST /lol/link 요청 본문 — 소환사(라이엇 ID) 연동. */
export interface LinkSummonerBody {
  name: string;
  tagLine: string;
}
