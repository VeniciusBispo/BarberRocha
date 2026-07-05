import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error = null,
  containerClassName = '',
  disabled = false,
  id,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`form-group ${containerClassName}`}>
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      
      <input
        id={inputId}
        disabled={disabled}
        className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      
      {error && (
        <span id={errorId} className="form-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
export default Input;
