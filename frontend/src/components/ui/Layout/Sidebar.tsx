import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './styles.scss';

interface NavItem {
  to: string;
  icon: string;
  label: string;
  adminOnly?: boolean;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/escolas',    icon: 'pi-calendar',   label: 'Escola' },
  { to: '/turmas',     icon: 'pi-file',       label: 'Turma' },
  { to: '/consultas',  icon: 'pi-heart',      label: 'Consultas',  roles: ['ADMIN', 'MEDICO'] },
  { to: '/relatorios', icon: 'pi-chart-bar',  label: 'Relatórios', adminOnly: true },
  { to: '/usuarios',   icon: 'pi-users',      label: 'Usuários',   adminOnly: true },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const { isAdmin, user } = useAuth();
  const location = useLocation();

  // Close sidebar on route change (mobile nav)
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const visible = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.roles && !item.roles.includes(user?.role ?? '')) return false;
    return true;
  });

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={['app-sidebar__backdrop', isOpen ? 'app-sidebar__backdrop--visible' : ''].filter(Boolean).join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={['app-sidebar', isOpen ? 'app-sidebar--open' : ''].filter(Boolean).join(' ')}>
        <nav className="app-sidebar__nav">
          {visible.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                ['app-sidebar__item', isActive ? 'app-sidebar__item--active' : ''].filter(Boolean).join(' ')
              }
            >
              <i className={`pi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
