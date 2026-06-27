import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated } from '../../../store/authStore';
import { LogoutIcon } from '../../ui/icons';
import { toast } from '../../../store/toastStore';
import { DEMO_MODE } from '../../../config';
import styles from './Header.module.css';

export function Header() {
  const navigate = useNavigate();
  const authed = useIsAuthenticated();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    toast.info('로그아웃했어요.');
    navigate('/login', { replace: true });
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          rally
        </Link>

        <nav className={styles.nav}>
          {DEMO_MODE ? (
            <span className={styles.greeting}>데모 둘러보기</span>
          ) : authed ? (
            <>
              {user && (
                <span className={styles.greeting}>{user.nickname}님</span>
              )}
              <button
                type="button"
                className={styles.iconButton}
                onClick={handleLogout}
                aria-label="로그아웃"
              >
                <LogoutIcon width={18} height={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.loginLink}>
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
