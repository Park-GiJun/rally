import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { loginApi, getMeApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { extractErrorMessage } from './useAuthError';
import { validateEmail, validatePassword } from './validation';
import styles from './AuthForm.module.css';

interface LocationState {
  from?: string;
  signupCompleted?: boolean;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const state = location.state as LocationState | null;
  const redirectTo = state?.from ?? '/';
  const signupCompleted = state?.signupCompleted ?? false;

  function validate(): boolean {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { accessToken } = await loginApi({ email: email.trim(), password });
      setAuth(accessToken);
      try {
        setUser(await getMeApi());
      } catch {
        setUser(null);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(
        extractErrorMessage(
          err,
          '로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card} padding="lg" as="section">
        <div className={styles.header}>
          <Link to="/" className={styles.brand}>
            rally
          </Link>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>함께 기록하려면 로그인이 필요해요.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {signupCompleted && !formError && (
            <div className={styles.notice} role="status">
              <span>회원가입이 완료됐어요. 로그인해 주세요.</span>
            </div>
          )}

          {formError && (
            <div className={styles.formError} role="alert">
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="이메일"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            error={errors.email}
            disabled={submitting}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
          />

          <Input
            label="비밀번호"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            error={errors.password}
            disabled={submitting}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            className={styles.submit}
          >
            로그인
          </Button>
        </form>

        <p className={styles.footer}>
          아직 계정이 없으신가요?
          <Link to="/signup" className={styles.link}>
            회원가입
          </Link>
        </p>
      </Card>
    </div>
  );
}
