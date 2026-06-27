import type {
  LoginBody,
  RegisterBody,
  TokenResponse,
  User,
} from '../types/auth';
import { useAuthStore } from '../store/authStore';

/**
 * 데모 모드 세션 — 백엔드 없이 "이미 로그인된 게스트"처럼 동작시킨다.
 * 로그인 없이 모든 컨텐츠를 둘러볼 수 있도록, 토큰이 비어 있으면 게스트 세션을 심는다.
 */

export const DEMO_TOKEN = 'demo-token';

export const DEMO_USER: User = {
  id: 1,
  email: 'guest@rally.local',
  nickname: '나',
  role: 'USER',
};

/** 토큰이 없으면 게스트 세션을 주입한다(앱 부팅 시 1회). */
export function ensureDemoSession(): void {
  const { token, setAuth, setUser } = useAuthStore.getState();
  if (!token) {
    setAuth(DEMO_TOKEN);
    setUser(DEMO_USER);
  }
}

/** 현재 세션 유저(없으면 게스트). */
function currentUser(): User {
  return useAuthStore.getState().user ?? DEMO_USER;
}

// --- 데모용 auth API 구현 (로그인/회원가입 페이지가 그대로 동작하도록) ---

export async function demoLogin(body: LoginBody): Promise<TokenResponse> {
  // 어떤 입력이든 통과 — 이메일을 닉네임 대용으로 반영한다.
  const nickname = body.email.split('@')[0] || DEMO_USER.nickname;
  useAuthStore.getState().setUser({ ...DEMO_USER, email: body.email, nickname });
  return { accessToken: DEMO_TOKEN, tokenType: 'Bearer' };
}

export async function demoRegister(body: RegisterBody): Promise<User> {
  return { ...DEMO_USER, email: body.email, nickname: body.nickname };
}

export async function demoMe(): Promise<User> {
  return currentUser();
}
