import type { ReactNode } from 'react';
import './styles.scss';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export const FormField = ({ label, htmlFor, hint, error, required, children }: FormFieldProps) => (
  <div className="ui-form-field">
    <label className="ui-form-field__label" htmlFor={htmlFor}>
      {label}
      {required && <span className="ui-form-field__required">*</span>}
    </label>
    <div className="ui-form-field__control">{children}</div>
    {hint && !error && <small className="ui-form-field__hint">{hint}</small>}
    {error && <small className="ui-form-field__error">{error}</small>}
  </div>
);
