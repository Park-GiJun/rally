import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../types/common';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';
import { getErrorMessage } from '../lib/errors';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청: 인증 토큰 부착(게이트웨이가 검증).
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답: 401 처리 + 실패 토스트.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error?.response?.status;
    if (status === 401) {
      useAuthStore.getState().clearAuth();
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        toast.error('로그인이 필요해요.');
        window.location.href = '/login';
      }
    } else {
      toast.error(getErrorMessage(error));
    }
    return Promise.reject(error);
  }
);

/**
 * ApiResponse 봉투를 벗겨 data 만 돌려준다. 모든 도메인 api 모듈은 이걸 거친다.
 * `success === false` 거나 data 가 없으면 error.message 로 throw.
 */
export function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
  const body = res.data;
  if (!body.success || body.data === undefined || body.data === null) {
    throw new Error(body.error?.message ?? '요청이 실패했어요.');
  }
  return body.data;
}

export default api;
