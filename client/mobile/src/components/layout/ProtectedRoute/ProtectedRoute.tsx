import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '../../../store/authStore';
import { DEMO_MODE } from '../../../config';

export interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authed = useIsAuthenticated();
  const location = useLocation();

  // 데모 모드는 로그인 없이 모든 컨텐츠를 공개한다.
  if (!authed && !DEMO_MODE) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
