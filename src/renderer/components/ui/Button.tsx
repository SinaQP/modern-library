import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { classNames } from "../../lib/classNames";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  disabled,
  icon,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps): ReactElement {
  return (
    <button
      className={classNames("button", `button--${variant}`, `button--${size}`, className)}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <LoaderCircle className="button__spinner" size={18} aria-hidden="true" /> : icon}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
