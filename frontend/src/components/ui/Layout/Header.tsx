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
        <div className="app-header__user" title={`Sair (${user?.name})`}>
          <button type="button" className="app-header__avatar" onClick={handleLogout} aria-label="Perfil / Sair">
            <i className="pi pi-user" />
          </button>
        </div>
      </div>
    </header>
  );
};
