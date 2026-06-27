import type {
  SummonerProfile,
  LolMatch,
  GroupRankRow,
  LinkSummonerBody,
} from '../types/lol';
import { loadList, saveList, nextId, delay } from './demoStore';
import { appendDemoActivity } from './demoFeed';

const PROFILE_KEY = 'lol-profile';
const MATCHES_KEY = 'lol-matches';

/** 동기화 시 순환 사용할 챔피언 풀(데모). */
const CHAMPIONS = ['아트록스', '리신', '럭스', '진', '카이사'];

/** n분 전 ISO. */
function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}

/** 프로필은 단일 객체지만 공용 리스트 헬퍼를 재사용하려고 1-원소 리스트로 보관한다. */
function seedProfile(): SummonerProfile[] {
  return [
    {
      name: 'Faker',
      tagLine: 'KR1',
      tier: 'GOLD',
      rank: 'II',
      lp: 47,
      wins: 132,
      losses: 120,
    },
  ];
}

function seedMatches(): LolMatch[] {
  return [
    { id: 1, champion: '아트록스', result: '승', kills: 7, deaths: 2, assists: 9, playedAt: minutesAgo(25) },
    { id: 2, champion: '리신', result: '패', kills: 3, deaths: 6, assists: 4, playedAt: minutesAgo(80) },
    { id: 3, champion: '카이사', result: '승', kills: 11, deaths: 4, assists: 7, playedAt: minutesAgo(190) },
    { id: 4, champion: '럭스', result: '승', kills: 5, deaths: 3, assists: 14, playedAt: minutesAgo(330) },
    { id: 5, champion: '진', result: '패', kills: 4, deaths: 5, assists: 6, playedAt: minutesAgo(1500) },
  ];
}

function loadProfile(): SummonerProfile {
  return loadList(PROFILE_KEY, seedProfile)[0];
}

function saveProfile(profile: SummonerProfile): void {
  saveList(PROFILE_KEY, [profile]);
}

export async function getDemoProfile(): Promise<SummonerProfile> {
  return delay(loadProfile());
}

export async function listDemoMatches(): Promise<LolMatch[]> {
  return delay(loadList(MATCHES_KEY, seedMatches));
}

/** 그룹 랭킹표 — 정적 데모 데이터(LP 내림차순). */
export async function getDemoGroupRanking(): Promise<GroupRankRow[]> {
  const rows: GroupRankRow[] = [
    { rank: 1, summonerName: '미드갓현우', tier: 'PLATINUM', lp: 76, todayWins: 4, todayLosses: 1 },
    { rank: 2, summonerName: 'Faker', tier: 'GOLD', lp: 47, todayWins: 2, todayLosses: 2 },
    { rank: 3, summonerName: '정글러도현', tier: 'GOLD', lp: 31, todayWins: 1, todayLosses: 0 },
    { rank: 4, summonerName: '서폿장인서윤', tier: 'SILVER', lp: 28, todayWins: 0, todayLosses: 3 },
    { rank: 5, summonerName: '원딜린이', tier: 'SILVER', lp: 12, todayWins: 1, todayLosses: 2 },
  ];
  return delay(rows);
}

/** 소환사(라이엇 ID) 연동 — 이름/태그라인을 갱신하고 프로필을 돌려준다. */
export async function linkDemoSummoner(body: LinkSummonerBody): Promise<SummonerProfile> {
  const profile = loadProfile();
  const updated: SummonerProfile = {
    ...profile,
    name: body.name,
    tagLine: body.tagLine,
  };
  saveProfile(updated);
  return delay(updated);
}

/**
 * 전적 갱신 — 새 매치 한 건을 앞에 추가한다.
 * Math.random 없이 현재 매치 수로 결과/챔피언/KDA 를 결정해 변주를 만든다.
 */
export async function syncDemoMatch(): Promise<LolMatch> {
  const list = loadList(MATCHES_KEY, seedMatches);
  const count = list.length;
  const champion = CHAMPIONS[count % CHAMPIONS.length];
  const result: '승' | '패' = count % 2 === 0 ? '승' : '패';
  const kills = (count * 3) % 12 + 2;
  const deaths = (count * 2) % 7 + 1;
  const assists = (count * 5) % 15 + 3;

  const match: LolMatch = {
    id: nextId(list),
    champion,
    result,
    kills,
    deaths,
    assists,
    playedAt: new Date().toISOString(),
  };
  saveList(MATCHES_KEY, [match, ...list]);

  appendDemoActivity({
    type: 'LOL_MATCH',
    payload: { champion, result, note: 'KDA ' + kills + '/' + deaths + '/' + assists },
  });

  return delay(match);
}
