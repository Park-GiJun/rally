/** Activity 의 확장점 — 백엔드 ActivityType 과 일치. 새 도메인 = type 추가. */
export type ActivityType =
  | 'CHECKIN' // 습관 인증
  | 'SCORE' // 일반 게임/경쟁 스코어
  | 'MESSAGE' // SNS 소통/게시
  | 'PRICE_ALERT' // 주식 관심종목 알림
  | 'SCHEDULE' // 캘린더 일정
  | 'LEDGER' // 가계부 거래
  | 'TODO' // 할 일 완료
  | 'LOL_MATCH'; // LoL 전적

export interface Activity {
  id: number;
  actorId: number;
  /** 표시용 작성자 이름(서버가 내려주면 사용, 없으면 actorId 로 표기). */
  actorName?: string;
  groupId: number | null;
  type: ActivityType;
  payload: Record<string, unknown>;
  occurredAt: string;
  schemaVersion: number;
}

/** POST /api/activities 요청(actorId 는 게이트웨이가 헤더로 주입 — 본문에 안 보냄). */
export interface RecordActivityBody {
  type: ActivityType;
  groupId?: number | null;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}
