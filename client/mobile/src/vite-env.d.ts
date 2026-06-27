/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'false' 면 데모 모드를 끄고 실제 백엔드(/api 프록시)에 붙는다. */
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
