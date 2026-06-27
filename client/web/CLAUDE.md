# CLAUDE.md — rally-web (프론트엔드 규약)

`rally` 의 웹 프론트엔드(React 19 + Vite + TS). **FE 는 백엔드(MSA) 쇼케이스용 보조 클라이언트**이고
백엔드가 주체다(과하게 공들이지 말고 실용적으로). 전체 아키텍처는 저장소 루트
[`../../CLAUDE.md`](../../CLAUDE.md), FE 설계 정본은 [`../../docs/frontend.md`](../../docs/frontend.md) 를 따른다.

## 앱 셸 / 섹션
- **대시보드 앱**: 좌측 **Sidebar** + Topbar(`components/layout`). 메인 `/`=**대시보드**(활동 피드를
  **그룹 × 섹션**으로 필터 + 도메인별 요약 카드). `client/mobile` 과 같은 앱(거긴 하단 BottomNav).
- **섹션 레지스트리 `src/lib/sections.ts`** 가 단일 소스: 한 줄 = 사이드바 메뉴 1 = 도메인 페이지 1 = 피드
  필터 1, 각 섹션이 `Activity.type` 에 매핑(7 도메인: 캘린더`SCHEDULE`·가계부`LEDGER`·SNS`MESSAGE`·
  LoL`LOL_MATCH`·할일`TODO`·습관`CHECKIN`·주식`PRICE_ALERT`). **새 도메인 = `ActivityType` 한 줄 + `SECTIONS` 한 줄.**

## 데이터 심 (DEMO_MODE) / API
- 기본 **`DEMO_MODE=on`**(`src/config.ts`) — 백엔드 없이 localStorage(`src/demo/*`)로 전 페이지 동작. 각
  도메인 `api/<d>.ts` 가 `if (DEMO_MODE) return demo<D>(...)` 로 분기, 끄면(`VITE_DEMO_MODE=false`) 동일
  함수가 `/api` 로 그대로 붙는다. 도메인 mutation 은 `appendDemoActivity()` 로 대시보드 피드에 이벤트를 흘림.
- dev 서버 **13100**, `/api` 는 게이트웨이 **18800** 으로 프록시(`vite.config.ts`).
- 백엔드는 **`ApiResponse<T>` 봉투**(`success`/`data`/`error{code,message}`)로 응답. `api/client.ts` 인터셉터가
  `data` 를 언랩하고 `error.message` 를 토스트로 띄운다. 도메인별 기대 API 계약표는 `docs/frontend.md` §5.

## 코드 구조 규약 (핵심)
백엔드의 "1 책임 = 1 파일" 성향을 프론트에도 적용한다. **뷰·로직·스타일을 파일로 분리한다.**
- `Xxx.tsx`(뷰만) + `useXxx.ts`(로직: react-query·파생값·핸들러) + `Xxx.module.css`(스타일) + `index.ts`(배럴).
- 재사용 UI 조각은 각자 폴더로 분리하고 합성으로 화면을 만든다. 페이지도 `pages/<x>/X.tsx` + `useX.ts`.

## 스타일 / 디자인 규약 (사람이 만든 듯, 절제)
- **CSS Modules** + 디자인 토큰은 `src/styles/theme.css` 전역 CSS 변수로만(`var(--token)`). 하드코딩 색/픽셀 금지.
- 한글 폰트 **Pretendard**(`index.html`), 절제된 팔레트 + 단일 강조색(`--color-primary` teal, `--color-live` orange).
- **이모지 금지**, 아이콘은 stroke SVG(`components/ui/icons/`). 반응형 기본(`auto-fill`/`minmax`/`clamp()`).

## 빌드·실행
```powershell
npm install
npm run dev        # Vite (13100)
npm run build      # tsc --noEmit + vite build
npm run typecheck
```
