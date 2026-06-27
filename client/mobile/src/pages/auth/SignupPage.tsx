import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { registerApi } from '../../api/auth';
import { extractErrorMessage } from './useAuthError';
import {
  validateEmail,
  validateNickname,
  validatePassword,
} from './validation';
import styles from './AuthForm.module.css';

interface FieldErrors {
  email?: string;
  password?: string;
  nickname?: string;
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      nickname: validateNickname(nickname),
    };
    setErrors(next);
    return !next.email && !next.password && !next.nickname;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerApi({
        email: email.trim(),
        password,
        nickname: nickname.trim(),
      });
      navigate('/login', { replace: true, state: { signupCompleted: true } });
    } catch (err) {
      setFormError(extractErrorMessage(err, '회원가입에 실패했어요.'));
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
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>그룹 활동을 함께 기록해 보세요.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
            label="닉네임"
            name="nickname"
            autoComplete="nickname"
            placeholder="2~20자"
            value={nickname}
            error={errors.nickname}
            disabled={submitting}
            onChange={(e) => {
              setNickname(e.target.value);
              if (errors.nickname)
                setErrors((p) => ({ ...p, nickname: undefined }));
            }}
          />

          <Input
            label="비밀번호"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="8자 이상"
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
            회원가입
          </Button>
        </form>

        <p className={styles.footer}>
          이미 계정이 있으신가요?
          <Link to="/login" className={styles.link}>
            로그인
          </Link>
        </p>
      </Card>
    </div>
  );
}
