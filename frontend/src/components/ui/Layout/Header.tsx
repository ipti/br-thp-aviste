import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';
import './styles.scss';
import image from '../../../assets/Logo.png';

interface Props {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: Props) => {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openPopover, setOpenPopover] = useState(false);
  const userAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openPopover) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!userAreaRef.current) return;
      if (!userAreaRef.current.contains(event.target as Node)) {
        setOpenPopover(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenPopover(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openPopover]);

  const handleLogout = () => {
    queryClient.clear();
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button
          type="button"
          className="app-header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Abrir menu"
        >
          <i className="pi pi-bars" />
        </button>
        <div className="app-header__logo">
          <img src={image} alt="Lupa" className="app-header__logo-img" />
        </div>
      </div>

      <div className="app-header__right">
        <div className="app-header__user" ref={userAreaRef}>
          <button
            type="button"
            className="app-header__avatar"
            onClick={() => setOpenPopover((prev) => !prev)}
            aria-label="Abrir perfil do usuário"
            aria-expanded={openPopover}
            aria-haspopup="dialog"
          >
            <i className="pi pi-user" />
          </button>

          {openPopover && (
            <div className="app-header__popover" role="dialog" aria-label="Informações do usuário">
              <p className="app-header__popover-name">{user?.name ?? 'Usuário'}</p>
              <p className="app-header__popover-line">
                <span>Usuário:</span> {user?.username ?? '-'}
              </p>
              <p className="app-header__popover-line">
                <span>Perfil:</span> {user?.role ?? '-'}
              </p>
              <button
                type="button"
                className="app-header__popover-logout"
                onClick={handleLogout}
              >
                <i className="pi pi-sign-out" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
