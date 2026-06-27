import { useLocation, Link } from 'react-router-dom';
import { ALL_SECTIONS } from '../../../lib/sections';
import { MenuIcon } from '../../ui/icons';
import { DEMO_MODE } from '../../../config';
import { useIsAuthenticated } from '../../../store/authStore';
import styles from './Topbar.module.css';

interface TopbarProps {
  onMenu: () => void;
}

export function Topbar({ onMenu }: TopbarProps) {
  const { pathname } = useLocation();
  const authed = useIsAuthenticated();

  const section =
    ALL_SECTIONS.find((s) =>
      s.path === '/' ? pathname === '/' : pathname.startsWith(s.path)
    ) ?? ALL_SECTIONS[0];

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menu}
        onClick={onMenu}
        aria-label="메뉴 열기"
      >
        <MenuIcon width={20} height={20} />
      </button>
      <h1 className={styles.title}>{section.label}</h1>
      <div className={styles.spacer} />
      {!DEMO_MODE && !authed && (
        <Link to="/login" className={styles.login}>
          로그인
        </Link>
      )}
    </header>
  );
}

export default Topbar;
