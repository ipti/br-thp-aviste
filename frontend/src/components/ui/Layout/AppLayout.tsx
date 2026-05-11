import { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { toastService } from '../../../lib/toast';
import './styles.scss';

export const AppLayout = () => {
  const toastRef = useRef<Toast>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (toastRef.current) toastService.init(toastRef.current);
  }, []);

  return (
    <div className="app-layout">
      <Toast ref={toastRef} position="top-right" />
      <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="app-layout__body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
