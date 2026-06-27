/**
 * 데모(오프라인) 모드 — 백엔드(MSA) 없이 웹만으로 모든 컨텐츠를 둘러볼 수 있다.
 * 기본값은 켜짐. 실제 게이트웨이에 붙이려면 `VITE_DEMO_MODE=false` 로 빌드/실행한다.
 */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';
