import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppRouter } from './router/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from './components/ui/Toast/Toaster';
import { DEMO_MODE } from './config';
import { ensureDemoSession } from './demo/demoSession';
import './styles/theme.css';
import './styles/global.css';

// 데모 모드: 렌더 전에 게스트 세션을 심어 로그인 없이 바로 둘러보게 한다.
if (DEMO_MODE) {
  ensureDemoSession();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
