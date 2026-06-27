# rally — 프론트엔드 (대시보드 앱)

> FE 설계 정본. 작업 기록이라 코드와 어긋날 수 있다 — **코드가 정답이다.**
> 단일 소스: `client/web/src/lib/sections.ts`(섹션 레지스트리) · `src/types/activity.ts`(ActivityType).

## 1. 정체성 / 역할

- **백엔드(MSA) 쇼케이스용 보조 클라이언트.** 주체는 백엔드다 — FE 는 "Activity 척추 + 실시간 피드"
  추상화가 실제로 어떻게 보이는지를 **데모 우선(demo-first)** 으로 증명한다(과하게 공들이지 않는다).
- **데모 우선:** 기본 `DEMO_MODE=on`. 백엔드 없이 localStorage 만으로 **모든 페이지가 완전 동작**한다.
  플래그 하나(`VITE_DEMO_MODE=false`)와 계약대로 구현된 백엔드만 있으면 동일 코드가 게이트웨이에 붙는다.
- 3-way 중 둘: `client/web`(React, 13100) · `client/mobile`(모바일웹 React+Vite, 13101). **같은 앱·같은
  계약·같은 로직**, **뷰 레이어(앱 셸)만** 데스크탑 사이드바 ↔ 모바일 하단탭으로 갈린다.

## 2. 앱 셸 (web / mobile)

| | web (13100) | mobile (13101) |
|---|---|---|
| 1차 내비 | 좌측 **Sidebar** (`components/layout/Sidebar`) | 하단 **BottomNav** (`components/layout/BottomNav`) |
| 상단 | **Topbar** (메뉴 토글·세션) | **Topbar** (컴팩트) |
| 셸 | `Layout` = Sidebar + Topbar + `<Outlet/>` | `Layout` = Topbar + `<Outlet/>` + BottomNav |
| 내비 항목 | `ALL_SECTIONS` (대시보드 + 7 도메인) | 동일 (`ALL_SECTIONS`) |

**메인 페이지 `/` = 대시보드** (`pages/dashboard`): 실시간 활동 피드를 **그룹 × 섹션**으로 필터(`useDashboard`)
+ 도메인별 요약 카드(섹션별 활동 수). 그룹 필터는 `undefined`=전체 · `null`=개인 · `number`=특정 그룹.

## 3. 섹션 ↔ ActivityType 매핑 (Activity 척추 확장)

`SECTIONS` 한 줄 = 사이드바 메뉴 1 = 도메인 페이지 1 = 대시보드 피드 필터 1. `activityTypes` 가 피드 필터 기준
(대시보드는 `[]`=전체).

| 섹션 | 경로 | ActivityType | scope | 백엔드 producer(타깃) |
|------|------|--------------|-------|------------------------|
| 대시보드 | `/` | `[]` (전체 피드) | social | feed-service (consumer) |
| 캘린더 | `/calendar` | `SCHEDULE` | personal | (schedule) |
| 가계부 | `/ledger` | `LEDGER` | personal | (ledger) |
| SNS | `/sns` | `MESSAGE` | social | user/MESSAGE |
| LoL 전적 | `/lol` | `LOL_MATCH` (+`SCORE`) | social | lol-service (Riot) |
| 할 일 | `/todo` | `TODO` | personal | (todo) |
| 습관 | `/habit` | `CHECKIN` | personal | habit-service |
| 주식 | `/stock` | `PRICE_ALERT` | personal | market-service |

> `ActivityType` 유니온(`src/types/activity.ts`): `CHECKIN · SCORE · MESSAGE · PRICE_ALERT · SCHEDULE ·
> LEDGER · TODO · LOL_MATCH`. **새 도메인 = `ActivityType` 한 줄 + `SECTIONS` 한 줄** → 사이드바·하단탭·
> 대시보드 필터·라우팅이 함께 켜진다(백엔드의 "`Activity.type` 추가 + producer 1개"와 1:1).

## 4. 데이터 심 (DEMO_MODE — 가장 중요)

`src/config.ts`: `export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';` (기본 켜짐).

**도메인마다 동일 패턴**:
```
api/<d>.ts        export async function fooApi(...) {
                    if (DEMO_MODE) return demoFoo(...);      // localStorage 데모
                    const res = await api.get('/<path>');     // 끄면 게이트웨이(18800)로 그대로
                    return unwrap(res);
                  }
demo/<d>.ts       localStorage 기반 구현 (demoStore 헬퍼: loadList/saveList/nextId/delay)
```

- `demo/demoStore.ts`: `rally-demo:<key>` 네임스페이스 + 140ms 지연(로딩 UI 흉내) 공용 헬퍼.
- `demo/demoFeed.ts`: 대시보드 피드 저장소(`rally-demo-feed`). 첫 방문 시 여러 actor·전 타입 시드를 깐다.
  `getDemoFeed`(그룹/타입/limit 필터·최신순) + `recordDemoActivity`.
- **`appendDemoActivity({type, payload, groupId?})`**: 도메인 페이지의 mutation 이 **의미 있는 동작**일 때
  (할 일 완료·습관 체크인·SNS 게시·일정 추가 등) 대시보드 피드에 Activity 이벤트를 흘려보낸다 →
  데모에서도 "기록 → 피드에 뜸"이 실시간처럼 보인다. (실 API 에선 백엔드가 `activity.recorded` 로 처리.)
- **실 API 전환** = ① `VITE_DEMO_MODE=false` 로 빌드/실행 + ② 백엔드가 아래 §5 계약대로 구현. FE 코드 무수정.
- 응답 봉투: 백엔드는 `ApiResponse<T>`(`success`/`data`/`error{code,message}`). `api/client.ts` 인터셉터가
  `data` 를 언랩하고 `error.message` 를 토스트로 띄운다. 표의 "응답"은 언랩 후 타입.

## 5. 도메인별 기대 API 계약 (BE 구현 가이드)

모든 경로는 게이트웨이(`/api` → 18800) 프록시 기준. `actorId` 등 신원은 게이트웨이가 `X-User-*` 헤더로 주입
(본문에 안 보냄). 경로는 `client/web/src/api/*.ts` 의 실제 문자열 그대로다.

### 인증 / 세션 (`api/auth.ts`, user-service)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| POST | `/api/auth/register` | `{ nickname }` | `User` |
| POST | `/api/auth/login` | `LoginBody` | `TokenResponse { accessToken }` |
| GET | `/api/users/me` | — | `User` |

### 그룹 (`api/groups.ts`, group-service)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/groups` | — | `Group[]` (내가 속한 그룹, 개인 포함) |

### 활동 / 피드 (`api/activities.ts`, activity·feed-service)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/activities/feed` | query `groupId? · types?[] · limit?` | `Activity[]` (최신순) |
| POST | `/api/activities` | `{ type, groupId?, payload?, occurredAt? }` | `Activity` |

### 캘린더 (`api/calendar.ts`, `SCHEDULE`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/schedules` | — | `CalendarEvent[]` |
| POST | `/api/schedules` | `{ title, date, time?, note? }` | `CalendarEvent` |
| DELETE | `/api/schedules/{id}` | — | — |

### 가계부 (`api/ledger.ts`, `LEDGER`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/ledger` | — | `LedgerEntry[]` |
| POST | `/api/ledger` | `{ kind, amount, category, memo?, date }` | `LedgerEntry` |
| DELETE | `/api/ledger/{id}` | — | — |

### SNS (`api/sns.ts`, `MESSAGE`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/posts` | — | `Post[]` |
| POST | `/api/posts` | `{ text }` | `Post` |
| POST | `/api/posts/{id}/like` | — | `Post` (토글) |

### LoL 전적 (`api/lol.ts`, `LOL_MATCH`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/lol/profile` | — | `SummonerProfile` |
| GET | `/api/lol/matches` | — | `LolMatch[]` |
| GET | `/api/lol/group-ranking` | — | `GroupRankRow[]` |
| POST | `/api/lol/link` | `{ name, tagLine }` | `SummonerProfile` |
| POST | `/api/lol/sync` | — | `LolMatch` (최신 동기화) |

### 할 일 (`api/todo.ts`, `TODO`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/todos` | — | `Todo[]` |
| POST | `/api/todos` | `{ title }` | `Todo` |
| PATCH | `/api/todos/{id}/toggle` | — | `Todo` |
| DELETE | `/api/todos/{id}` | — | — |

### 습관 (`api/habit.ts`, `CHECKIN`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/habits` | — | `Habit[]` |
| POST | `/api/habits` | `{ name }` | `Habit` |
| POST | `/api/habits/{id}/checkin` | — | `Habit` (streak 갱신) |
| DELETE | `/api/habits/{id}` | — | — |

### 주식 (`api/stock.ts`, `PRICE_ALERT`)
| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/stocks/watchlist` | — | `Holding[]` |
| POST | `/api/stocks/watchlist` | `{ symbol, name, shares, avgCost }` | `Holding` |
| DELETE | `/api/stocks/watchlist/{id}` | — | — |
| GET | `/api/stocks/quotes` | — | `Holding[]` (시세 갱신) |

## 6. 새 도메인 켜기 (확장 절차)

1. `src/types/activity.ts` 의 `ActivityType` 유니온에 타입 한 줄 추가.
2. `src/lib/sections.ts` 의 `SECTIONS` 에 섹션 한 줄 추가(label·path·icon·activityTypes·scope·accentVar).
3. `src/types/<d>.ts`(모델) + `src/demo/<d>.ts`(localStorage 구현) + `src/api/<d>.ts`(`if (DEMO_MODE)` 분기) 추가.
4. `pages/<d>/<D>Page.tsx`(뷰) + `use<D>.ts`(로직). mutation 시 `appendDemoActivity()` 로 피드 연동.
5. `theme.css` 에 `--color-<d>` 강조색 토큰 추가. 라우터(`router/AppRouter`)는 섹션 경로 규약을 따른다.

> web/mobile 양쪽 동일 — `api`/`types`/`demo`/`lib`/`store`/로직 훅은 공유 규약, **뷰만** 미러링.

## 7. 구조 규약

- **뷰·로직·스타일 분리**: `Xxx.tsx`(뷰만) + `useXxx.ts`(react-query·파생값·핸들러) +
  `Xxx.module.css` + `index.ts`(배럴). "1 책임 = 1 파일"(백엔드 성향을 FE 에도).
- **CSS Modules** 만. 디자인 토큰은 `src/styles/theme.css` 전역 CSS 변수(`var(--token)`)로만 — 하드코딩
  색/픽셀 금지. 섹션 강조색은 `accentVar`(`--color-<도메인>`).
- 한글 폰트 **Pretendard**, 단일 강조색(`--color-primary` teal, `--color-live` orange). 반응형 기본.
- **이모지 금지.** 아이콘은 stroke SVG(`components/ui/icons`). 상태표시는 `EmptyState`/`Spinner`/`Toast`.
