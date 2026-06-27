import { isAxiosError } from 'axios';
import type { ApiError } from '../../types/common';

/**
 * axios 에러(혹은 임의의 throw 값)에서 사용자에게 보여줄 메시지를 추출한다.
 * rally 백엔드는 ApiResponse 봉투(`error.message`)로 실패를 내려준다.
 */
export function extractErrorMessage(
  err: unknown,
  fallback = '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'
): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: ApiError } | undefined;
    if (data?.error?.message?.trim()) {
      return data.error.message;
    }
    if (err.message) {
      return err.message;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
