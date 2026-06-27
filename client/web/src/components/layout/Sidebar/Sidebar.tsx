import { NavLink } from 'react-router-dom';
import { ALL_SECTIONS } from '../../../lib/sections';
import { useAuthStore } from '../../../store/authStore';
import { LogoutIcon } from '../../ui/icons';
import { DEMO_MODE } from '../../../config';
import { toast } from '../../../store/toastStore';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
  /** 모바일 폭에서 드로어 열림 상태. */
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    toast.info('로그아웃했어요.');
    navigate('/login', { replace: true });
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        onClick={onNavigate}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>rally</div>

        <nav className={styles.nav}>
          {ALL_SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <NavLink
                key={s.key}
                to={s.path}
                end={s.path === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `${styles.item} ${isActive ? styles.itemActive : ''}`
                }
                style={{ ['--accent' as string]: s.accentVar }}
              >
                <span className={styles.dot} aria-hidden="true" />
                <Icon className={styles.icon} width={18} height={18} />
                <span className={styles.label}>{s.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">
              {(user?.nickname ?? '나').slice(0, 1)}
            </span>
            <span className={styles.userName}>
              {user?.nickname ?? '게스트'}
              {DEMO_MODE && <span className={styles.demoTag}>데모</span>}
            </span>
          </div>
          {!DEMO_MODE && (
            <button
              type="button"
              className={styles.logout}
              onClick={handleLogout}
              aria-label="로그아웃"
            >
              <LogoutIcon width={16} height={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
