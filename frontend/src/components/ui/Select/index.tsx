import './styles.scss';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Select = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione',
  error,
  disabled,
  required,
}: SelectProps) => (
  <div className="ui-select">
    <label htmlFor={id} className="ui-select__label">
      {label}
      {required && <span className="ui-select__required"> *</span>}
    </label>
    <select
      id={id}
      className={['ui-select__input', error ? 'ui-select__input--error' : ''].filter(Boolean).join(' ')}
      value={value ?? ''}
      disabled={disabled}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') { onChange(null); return; }
        const matched = options.find((o) => String(o.value) === raw);
        onChange(matched ? matched.value : raw);
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <small className="ui-select__error">{error}</small>}
  </div>
);
