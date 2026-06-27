export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
}

/** POST /api/auth/login 응답(data). */
export interface TokenResponse {
  accessToken: string;
  tokenType: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
