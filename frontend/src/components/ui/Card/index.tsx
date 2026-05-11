import type { ReactNode } from 'react';
import './styles.scss';

export interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Card = ({ children, onClick, className = '' }: CardProps) => (
  <div
    className={['ui-card', onClick ? 'ui-card--clickable' : '', className].filter(Boolean).join(' ')}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
  >
    {children}
  </div>
);
