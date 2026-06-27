import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/layout/Layout/Layout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute/ProtectedRoute';
import { Spinner } from '../components/ui';
import styles from './AppRouter.module.css';

const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const CalendarPage = lazy(() => import('../pages/calendar/CalendarPage'));
const LedgerPage = lazy(() => import('../pages/ledger/LedgerPage'));
const SnsPage = lazy(() => import('../pages/sns/SnsPage'));
const LolPage = lazy(() => import('../pages/lol/LolPage'));
const TodoPage = lazy(() => import('../pages/todo/TodoPage'));
const HabitPage = lazy(() => import('../pages/habit/HabitPage'));
const StockPage = lazy(() => import('../pages/stock/StockPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function RouteFallback() {
  return (
    <div className={styles.fallback}>
      <Spinner size={36} />
    </div>
  );
}

/** 보호 라우트 1줄 헬퍼. 데모 모드면 ProtectedRoute 가 게스트 세션으로 통과시킨다. */
function protect(node: ReactNode) {
  return <ProtectedRoute>{node}</ProtectedRoute>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={protect(<DashboardPage />)} />
            <Route path="/calendar" element={protect(<CalendarPage />)} />
            <Route path="/ledger" element={protect(<LedgerPage />)} />
            <Route path="/sns" element={protect(<SnsPage />)} />
            <Route path="/lol" element={protect(<LolPage />)} />
            <Route path="/todo" element={protect(<TodoPage />)} />
            <Route path="/habit" element={protect(<HabitPage />)} />
            <Route path="/stock" element={protect(<StockPage />)} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
