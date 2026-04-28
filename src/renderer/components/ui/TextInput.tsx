import type { InputHTMLAttributes, ReactElement, ReactNode } from "react";
import { classNames } from "../../lib/classNames";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  icon?: ReactNode;
  label: string;
};

export function TextInput({
  className,
  error,
  icon,
  id,
  label,
  ...props
}: TextInputProps): ReactElement {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className={classNames("field", className)}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className={classNames("input-shell", error && "input-shell--error")}>
        {icon ? <span className="input-shell__icon">{icon}</span> : null}
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className="input"
          id={inputId}
          {...props}
        />
      </div>
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
