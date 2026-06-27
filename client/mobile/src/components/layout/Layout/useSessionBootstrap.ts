import { useEffect } from 'react';
import { getMeApi } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';

/**
 * 토큰은 있으나 user 정보가 비어 있으면(새로고침·복원 직후) /me 로 한 번 채운다.
 * 실패해도 조용히 무시 — 401 은 client 인터셉터가 처리.
 */
export function useSessionBootstrap() {
  useEffect(() => {
    const { token, user, setUser } = useAuthStore.getState();
    if (token && !user) {
      getMeApi()
        .then(setUser)
        .catch(() => {
          /* 인터셉터가 처리 */
        });
    }
  }, []);
}
