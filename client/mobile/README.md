# rally-mobile

`rally` 모바일 웹 프론트엔드 — **React 19 + Vite + TypeScript**. `client/web` 과 **같은 앱**(같은 백엔드
계약 = `ApiResponse` 봉투, 같은 기능)을 **모바일 퍼스트 UI**로 다시 그렸다. 설치형 네이티브 앱이 아니라
브라우저 웹 앱이다(React Native / Expo 안 씀). 네이티브 Kotlin 앱은 별도(`../android`). 규약은
[`CLAUDE.md`](./CLAUDE.md) 참고.

## 빠른 시작

```powershell
pnpm install
pnpm run dev        # http://localhost:13101
```

`/api` 요청은 게이트웨이(**18800**)로 프록시된다(`vite.config.ts`). 백엔드 스택을 먼저 띄운다
(discovery → gateway → user/activity).

```powershell
pnpm run build      # tsc --noEmit + vite build → dist/
pnpm run typecheck
pnpm run lint
```

## 구조 (web 과 동일 골격)

```
src/
├─ api/          client(ApiResponse 언랩) · auth · activities
├─ components/   ui(Button/Input/Card/Spinner/Toast/EmptyState/icons) · layout(Layout/Header/ProtectedRoute) · ErrorBoundary
├─ lib/          queryClient · errors · format
├─ pages/        auth(Login/Signup) · feed(FeedPage + CheckinComposer + ActivityItem) · NotFoundPage
├─ router/       AppRouter
├─ store/        authStore(zustand persist, localStorage) · toastStore
├─ styles/       theme.css(디자인 토큰, --container-max 480px) · global.css
└─ types/        common(ApiResponse) · auth · activity
```

- **뷰(`Xxx.tsx`) · 로직(`useXxx.ts`) · 스타일(`Xxx.module.css`)** 분리.
- `api`·`types`·`lib`·`store`·도메인 로직 훅은 web 과 동일. **뷰 레이어만 모바일 퍼스트**(좁은 단일
  컬럼 480px, 큰 탭 타깃, 컴팩트 헤더, safe-area 대응). CSS Modules, 이모지 금지, stroke SVG 아이콘.

## 구현 범위 (P0 수직 슬라이스)

회원가입 · 로그인(JWT) · 내 정보 · **활동 기록(CHECKIN) + 개인 피드**. 그룹/랭킹/실시간(WebSocket)은
백엔드 P1 진행에 맞춰 확장한다(Jira RP-10 워크스트림).

## web 과의 차이

- dev 포트 **13101**(web 13100 과 분리). 토큰 저장은 web 과 동일하게 localStorage(zustand persist).
- UI 가 모바일 퍼스트: 컨테이너 480px 단일 컬럼, 인증 폼은 화면을 채워 세로 중앙 정렬, CHECKIN 작성
  박스는 터치 우선(데스크톱 단축키 힌트 대신 글자 수 표시).
