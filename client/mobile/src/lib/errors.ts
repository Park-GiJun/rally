import axios from 'axios';
import type { ApiError } from '../types/common';

/** 네트워크(서버 연결 불가) 시 공통 메시지 */
export const NETWORK_ERROR_MESSAGE =
  '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';

/** 미구현 API(404) 호출 시 공통 메시지 */
export const NOT_IMPLEMENTED_MESSAGE =
  '아직 개발되지 않은 기능입니다. (개발 예정)';

/**
 * 임의의 에러에서 사람이 읽을 메시지를 추출하는 단일 진입점.
 * rally 백엔드는 ApiResponse 봉투(`error.message`)로 실패를 내려준다.
 */
export function getErrorMessage(
  error: unknown,
  fallback = '요청 처리 중 오류가 발생했어요.'
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === undefined) return NETWORK_ERROR_MESSAGE;
    if (status === 404) return NOT_IMPLEMENTED_MESSAGE;
    const data = error.response?.data as { error?: ApiError } | undefined;
    if (data?.error?.message) return data.error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
