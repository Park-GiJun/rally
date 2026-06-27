import type { ComponentType, SVGProps } from 'react';
import type { ActivityType } from '../types/activity';
import {
  DashboardIcon,
  CalendarIcon,
  WalletIcon,
  ChatIcon,
  GamepadIcon,
  CheckSquareIcon,
  FlameIcon,
  ChartIcon,
} from '../components/ui/icons';

/**
 * 섹션 = 사이드바 메뉴 1개 = 도메인 1개. 새 도메인을 켜려면 여기에 한 줄 추가하면
 * 사이드바·대시보드 필터·라우팅(경로 규약)이 함께 확장된다. (Activity 척추 위의 뷰 분류)
 *
 * `activityTypes` 가 대시보드 피드의 "섹션 필터" 기준이다(빈 배열 = 전체).
 * `scope` 는 개인/소셜 성격 표시(뱃지·문서용).
 */
export type SectionScope = 'personal' | 'social';

export interface Section {
  key: string;
  label: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** 이 섹션이 다루는 Activity 타입(피드 필터 기준). 대시보드는 []=전체. */
  activityTypes: ActivityType[];
  scope: SectionScope;
  /** theme.css 섹션 강조색 토큰 */
  accentVar: string;
}

export const DASHBOARD_SECTION: Section = {
  key: 'dashboard',
  label: '대시보드',
  path: '/',
  icon: DashboardIcon,
  activityTypes: [],
  scope: 'social',
  accentVar: 'var(--color-primary)',
};

/** 사이드바 도메인 섹션(대시보드 제외). 순서가 곧 메뉴 순서. */
export const SECTIONS: Section[] = [
  {
    key: 'calendar',
    label: '캘린더',
    path: '/calendar',
    icon: CalendarIcon,
    activityTypes: ['SCHEDULE'],
    scope: 'personal',
    accentVar: 'var(--color-schedule)',
  },
  {
    key: 'ledger',
    label: '가계부',
    path: '/ledger',
    icon: WalletIcon,
    activityTypes: ['LEDGER'],
    scope: 'personal',
    accentVar: 'var(--color-ledger)',
  },
  {
    key: 'sns',
    label: 'SNS',
    path: '/sns',
    icon: ChatIcon,
    activityTypes: ['MESSAGE'],
    scope: 'social',
    accentVar: 'var(--color-message)',
  },
  {
    key: 'lol',
    label: 'LoL 전적',
    path: '/lol',
    icon: GamepadIcon,
    activityTypes: ['LOL_MATCH', 'SCORE'],
    scope: 'social',
    accentVar: 'var(--color-score)',
  },
  {
    key: 'todo',
    label: '할 일',
    path: '/todo',
    icon: CheckSquareIcon,
    activityTypes: ['TODO'],
    scope: 'personal',
    accentVar: 'var(--color-todo)',
  },
  {
    key: 'habit',
    label: '습관',
    path: '/habit',
    icon: FlameIcon,
    activityTypes: ['CHECKIN'],
    scope: 'personal',
    accentVar: 'var(--color-checkin)',
  },
  {
    key: 'stock',
    label: '주식',
    path: '/stock',
    icon: ChartIcon,
    activityTypes: ['PRICE_ALERT'],
    scope: 'personal',
    accentVar: 'var(--color-price-alert)',
  },
];

/** 대시보드 + 도메인 섹션 전체(사이드바 렌더 순서). */
export const ALL_SECTIONS: Section[] = [DASHBOARD_SECTION, ...SECTIONS];

/** 대시보드 피드의 "섹션 필터" 칩 목록(전체 + 각 도메인). */
export const FEED_FILTERS: Section[] = ALL_SECTIONS;
