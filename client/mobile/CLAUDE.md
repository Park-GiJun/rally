# CLAUDE.md — rally-mobile (모바일 웹 규약)

`rally` 의 **모바일 최적화 웹 앱**(React 19 + Vite + TS). `client/web` 과 **같은 대시보드 앱**(같은 백엔드
계약·같은 기능·같은 로직)을 **모바일 퍼스트 UI**(좁은 단일 컬럼)로 다시 그린 것이다. 설치형 네이티브 앱이
아니라 브라우저 웹 앱이다(React Native / Expo 안 씀). 네이티브 Kotlin 앱은 별도(`client/android`). 전체 아키텍처는
저장소 루트 [`../../CLAUDE.md`](../../CLAUDE.md), FE 설계 정본 [`../../docs/frontend.md`](../../docs/frontend.md),
컨벤션은 `client/web` 을 그대로 승계한다.

## 앱 셸 / 섹션
- **대시보드 앱**: 하단 **BottomNav** + Topbar(`components/layout`) — web 의 좌측 Sidebar 를 모바일 하단탭으로
  교체한 것만 다르다. 메인 `/`=**대시보드**(활동 피드를 **그룹 × 섹션**으로 필터 + 도메인별 요약 카드).
- **섹션 레지스트리 `src/lib/sections.ts`** 가 단일 소스(web 과 동일): 한 줄 = 하단탭 항목 1 = 도메인 페이지 1 =
  피드 필터 1, 각 섹션이 `Activity.type` 에 매핑(7 도메인). **새 도메인 = `ActivityType` 한 줄 + `SECTIONS` 한 줄.**

## 데이터 심 (DEMO_MODE) / API
- 기본 **`DEMO_MODE=on`**(`src/config.ts`) — 백엔드 없이 localStorage(`src/demo/*`)로 전 페이지 동작. 각
  도메인 `api/<d>.ts` 가 `if (DEMO_MODE) return demo<D>(...)` 로 분기, 끄면(`VITE_DEMO_MODE=false`) 동일
  함수가 `/api` 로 그대로 붙는다(코드 무수정). `src/api`·`src/types`·`src/demo`·`src/lib`·로직 훅은 web 과 동일.
- dev 서버 **13101**(web 은 13100 — 충돌 금지), `/api` 는 게이트웨이 **18800** 으로 프록시(`vite.config.ts`).
- 백엔드는 **`ApiResponse<T>` 봉투**(`success`/`data`/`error{code,message}`)로 응답. `api/client.ts` 인터셉터가
  `data` 를 언랩하고 `error.message` 를 토스트로 띄운다. 토큰은 localStorage 영속(zustand persist).
  도메인별 기대 API 계약표는 `docs/frontend.md` §5.

## 코드 구조 규약 (web 과 동일)
`Xxx.tsx`(뷰만) + `useXxx.ts`(로직) + `Xxx.module.css`(스타일) + `index.ts`(배럴). `src/api`·`src/types`·
`src/lib`·`src/store`·도메인 로직 훅은 web 과 **동일**(백엔드 계약 동일). 뷰 레이어만 모바일 퍼스트로 교체.

## 스타일 / 디자인 규약
- **CSS Modules** + 디자인 토큰은 `src/styles/theme.css` 전역 CSS 변수로만(`var(--token)`). 하드코딩 색/픽셀 금지.
- web 의 토큰을 그대로 쓰되 **모바일 퍼스트**: `--container-max` 480px(좁은 단일 컬럼), 큰 탭 타깃, 컴팩트 헤더,
  `safe-area-inset` 대응. 한글 폰트 **Pretendard**(`index.html`), 단일 강조색(teal). **이모지 금지**, 아이콘은 stroke SVG.

## 빌드·실행
```powershell
pnpm install
pnpm run dev        # Vite (13101)
pnpm run build      # tsc --noEmit + vite build
pnpm run typecheck
```
