import { InputText } from 'primereact/inputtext';
import './styles.scss';

export type InputMask = 'cpf' | 'date' | 'crm' | 'phone';

function applyMask(raw: string, mask: InputMask): string {
  const digits = raw.replace(/\D/g, '');
  if (mask === 'cpf') {
    return digits
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }
  if (mask === 'date') {
    return digits
      .slice(0, 8)
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
  }
  if (mask === 'phone') {
    const d = digits.slice(0, 11);
    if (d.length <= 2)  return d.length ? `(${d}` : d;
    if (d.length <= 6)  return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  if (mask === 'crm') {
    const normalized = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const numberPart = normalized.replace(/[A-Z]/g, '').slice(0, 6);
    const statePart = normalized.replace(/[0-9]/g, '').slice(0, 2);
    return statePart ? `${numberPart}-${statePart}` : numberPart;
  }
  return raw;
}

export interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  mask?: InputMask;
}

export const Input = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  disabled,
  required,
  mask,
}: InputProps) => (
  <div className="ui-input">
    <label htmlFor={id} className="ui-input__label">
      {label}
      {required && <span className="ui-input__required">*</span>}
    </label>
    <InputText
      id={id}
      value={value}
      onChange={(e) => onChange(mask ? applyMask(e.target.value, mask) : e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={error ? 'p-invalid' : ''}
    />
    {error && <small className="ui-input__error">{error}</small>}
  </div>
);
