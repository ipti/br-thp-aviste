import './styles.scss';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge = ({ label, variant = 'primary' }: BadgeProps) => (
  <span className={`ui-badge ui-badge--${variant}`}>{label}</span>
);
