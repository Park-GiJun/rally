import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 모바일 웹은 rally 대역(13101, web 13100 과 분리), API 는 게이트웨이 단일 진입점(18800)으로 프록시한다.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 13101,
    proxy: {
      '/api': {
        target: 'http://localhost:18800',
        changeOrigin: true,
      },
    },
  },
});
