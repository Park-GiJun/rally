import type { Activity, ActivityType } from '../../types/activity';

interface TypeMeta {
  label: string;
  /** theme.css 에 정의된 타입별 점 색 토큰 */
  colorVar: string;
}

const META: Record<ActivityType, TypeMeta> = {
  CHECKIN: { label: '인증', colorVar: 'var(--color-checkin)' },
  SCORE: { label: '스코어', colorVar: 'var(--color-score)' },
  MESSAGE: { label: '메시지', colorVar: 'var(--color-message)' },
  PRICE_ALERT: { label: '종목 알림', colorVar: 'var(--color-price-alert)' },
  SCHEDULE: { label: '일정', colorVar: 'var(--color-schedule)' },
  LEDGER: { label: '가계부', colorVar: 'var(--color-ledger)' },
  TODO: { label: '할 일', colorVar: 'var(--color-todo)' },
  LOL_MATCH: { label: 'LoL', colorVar: 'var(--color-score)' },
};

export function typeMeta(type: ActivityType): TypeMeta {
  return META[type];
}

/** payload 에서 한 줄 본문을 뽑는다. 타입별 관용 키 → 없으면 빈 문자열. */
export function activitySummary(activity: Activity): string {
  const p = activity.payload ?? {};
  const pick = (...keys: string[]): string => {
    for (const k of keys) {
      const v = p[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
      if (typeof v === 'number') return String(v);
    }
    return '';
  };

  switch (activity.type) {
    case 'CHECKIN':
      return pick('note', 'habit', 'title') || '오늘의 인증을 남겼어요.';
    case 'MESSAGE':
      return pick('text', 'message', 'content');
    case 'SCORE':
      return pick('note', 'game') || `스코어 ${pick('score') || '기록'}`;
    case 'PRICE_ALERT':
      return pick('note', 'symbol') || '관심종목 알림이 도착했어요.';
    case 'SCHEDULE':
      return pick('title', 'note') || '일정을 추가했어요.';
    case 'LEDGER': {
      const amount = pick('amount');
      const memo = pick('memo', 'category', 'title');
      if (amount) return memo ? `${memo} ${amount}원` : `${amount}원`;
      return memo || '가계부에 기록했어요.';
    }
    case 'TODO':
      return pick('title', 'note') || '할 일을 완료했어요.';
    case 'LOL_MATCH':
      return pick('note', 'champion', 'result') || 'LoL 전적이 갱신됐어요.';
    default:
      return '';
  }
}
