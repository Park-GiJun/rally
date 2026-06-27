import { Outlet } from 'react-router-dom';
import { Topbar } from '../Topbar/Topbar';
import { BottomNav } from '../BottomNav/BottomNav';
import { useSessionBootstrap } from './useSessionBootstrap';
import styles from './Layout.module.css';

export function Layout() {
  useSessionBootstrap();

  return (
    <div className={styles.shell}>
      <Topbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout;
