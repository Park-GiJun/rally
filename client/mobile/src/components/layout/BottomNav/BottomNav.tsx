import { NavLink } from 'react-router-dom';
import { ALL_SECTIONS } from '../../../lib/sections';
import styles from './BottomNav.module.css';

/**
 * 모바일 하단 탭바 — web 의 사이드바를 대체한다. ALL_SECTIONS(대시보드 + 7 도메인)를
 * 가로 스크롤 탭으로 펼치고, 각 탭은 아이콘 위 짧은 라벨. 활성 시 섹션 강조색(accentVar).
 */
export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="주요 메뉴">
      <div className={styles.scroller}>
        {ALL_SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <NavLink
              key={s.key}
              to={s.path}
              end={s.path === '/'}
              className={({ isActive }) =>
                `${styles.tab} ${isActive ? styles.tabActive : ''}`
              }
              style={{ ['--accent' as string]: s.accentVar }}
            >
              <Icon className={styles.icon} width={22} height={22} />
              <span className={styles.label}>{s.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
