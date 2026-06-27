import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Topbar } from '../Topbar/Topbar';
import { useSessionBootstrap } from './useSessionBootstrap';
import styles from './Layout.module.css';

export function Layout() {
  useSessionBootstrap();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar open={drawerOpen} onNavigate={() => setDrawerOpen(false)} />
      <div className={styles.content}>
        <Topbar onMenu={() => setDrawerOpen((v) => !v)} />
        <main className={styles.main}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
