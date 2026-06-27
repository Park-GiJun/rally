/** 인증 폼 공통 클라이언트 검증 유틸(백엔드 제약과 동일하게 맞춤). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return '이메일을 입력해 주세요.';
  if (!EMAIL_RE.test(value)) return '올바른 이메일 형식이 아니에요.';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return '비밀번호를 입력해 주세요.';
  if (password.length < 8 || password.length > 64)
    return '비밀번호는 8자 이상 64자 이하로 입력해 주세요.';
  return undefined;
}

/** 백엔드 nickname 제약: 2~20자. */
export function validateNickname(nickname: string): string | undefined {
  const value = nickname.trim();
  if (!value) return '닉네임을 입력해 주세요.';
  if (value.length < 2 || value.length > 20)
    return '닉네임은 2자 이상 20자 이하로 입력해 주세요.';
  return undefined;
}
