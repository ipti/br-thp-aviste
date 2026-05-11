import './styles.scss';

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  loading,
  disabled,
  fullWidth,
  icon,
  size = 'md',
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={[
      'ui-btn',
      `ui-btn--${variant}`,
      `ui-btn--${size}`,
      fullWidth ? 'ui-btn--full' : '',
      loading ? 'ui-btn--loading' : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {loading ? (
      <i className="pi pi-spin pi-spinner ui-btn__icon" />
    ) : icon ? (
      <i className={`${icon} ui-btn__icon`} />
    ) : null}
    <span>{label}</span>
  </button>
);
