import type { ReactElement, ReactNode } from "react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BookModalFrameProps = {
  children: ReactNode;
  footer?: ReactNode;
  icon: LucideIcon;
  onClose: () => void;
  title: string;
  width?: "md" | "lg";
};

export function BookModalFrame({
  children,
  footer,
  icon,
  onClose,
  title,
  width = "lg"
}: BookModalFrameProps): ReactElement {
  const Icon = icon;

  return (
    <div className="book-modal-backdrop">
      <section className={`book-modal book-modal--${width}`} aria-modal="true" role="dialog">
        <header className="book-modal__header">
          <button aria-label="بستن" onClick={onClose} type="button">
            <X size={22} aria-hidden="true" />
          </button>
          <h2>{title}</h2>
          <Icon size={28} aria-hidden="true" />
        </header>
        <div className="book-modal__body">
          {children}
        </div>
        {footer ? <footer className="book-modal__footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
