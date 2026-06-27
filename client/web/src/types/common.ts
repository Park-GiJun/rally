/** 백엔드 공통 응답 봉투(shared 의 ApiResponse 와 일치). */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
}
