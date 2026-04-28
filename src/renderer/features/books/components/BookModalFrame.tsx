import type { ReactElement, ReactNode } from "react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BookModalFrameProps = {
  children: ReactNode;
  icon: LucideIcon;
  onClose: () => void;
  title: string;
  width?: "md" | "lg";
};

export function BookModalFrame({
  children,
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
        {children}
      </section>
    </div>
  );
}
