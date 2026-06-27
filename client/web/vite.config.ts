import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 웹은 rally 대역(13100), API 는 게이트웨이 단일 진입점(18800)으로 프록시한다.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 13100,
    proxy: {
      '/api': {
        target: 'http://localhost:18800',
        changeOrigin: true,
      },
    },
  },
});
