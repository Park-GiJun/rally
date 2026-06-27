# rally-web

`rally` 웹 프론트엔드 — **React 19 + Vite + TypeScript**. 그룹 활동 피드의 웹 클라이언트.
컨벤션은 ticket-server-fe 에서 승계하고 rally 도메인(인증 + 활동 피드)으로 교체했다. 규약은
[`CLAUDE.md`](./CLAUDE.md) 참고.

## 빠른 시작

```powershell
npm install
npm run dev        # http://localhost:13100
```

기본값은 **데모 모드**라 백엔드 없이 바로 동작한다 — 로그인 없이 게스트로 진입해 피드를 둘러보고
인증(CHECKIN)을 남길 수 있다(데이터는 `localStorage` 에 저장). 실제 백엔드에 붙이려면
`VITE_DEMO_MODE=false` 로 띄운다. 이때 `/api` 요청은 게이트웨이(**18800**)로 프록시되므로
(`vite.config.ts`) 백엔드 스택을 먼저 띄운다(discovery → gateway → user/activity).

```powershell
npm run build      # tsc --noEmit + vite build → dist/
npm run typecheck
npm run lint
```

## 구조

```
src/
├─ api/          client(ApiResponse 언랩) · auth · activities
├─ components/   ui(Button/Input/Card/Spinner/Toast/EmptyState/icons) · layout(Layout/Header/ProtectedRoute) · ErrorBoundary
├─ lib/          queryClient · errors · format
├─ pages/        auth(Login/Signup) · feed(FeedPage + CheckinComposer + ActivityItem) · NotFoundPage
├─ router/       AppRouter
├─ store/        authStore(zustand persist) · toastStore
├─ styles/       theme.css(디자인 토큰) · global.css
└─ types/        common(ApiResponse) · auth · activity
```

- **뷰(`Xxx.tsx`) · 로직(`useXxx.ts`) · 스타일(`Xxx.module.css`)** 분리.
- 디자인 토큰은 `styles/theme.css` 한 곳(teal 단일 강조). CSS Modules, 이모지 금지, stroke SVG 아이콘.

## 구현 범위 (P0 수직 슬라이스)

회원가입 · 로그인(JWT) · 내 정보 · **활동 기록(CHECKIN) + 개인 피드**. 그룹/랭킹/실시간(WebSocket)은
백엔드 P1 진행에 맞춰 확장한다(Jira RP-10 워크스트림).

## 배포

멀티스테이지 `Dockerfile`(node build → nginx). `nginx.conf` 는 SPA fallback + `/api` → `rally-gateway:18800`
프록시. 호스트엔 web·gateway 만 노출(서브도메인 `rally.gijun.net`).
