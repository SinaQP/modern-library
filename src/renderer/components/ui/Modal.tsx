import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const focusableSelector = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export function Modal({ children, isOpen, onClose, title }: ModalProps): ReactElement | null {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    window.setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstInput?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="modal"
        ref={dialogRef}
        role="dialog"
      >
        <header className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <Button aria-label="بستن پنجره" onClick={onClose} size="sm" variant="ghost">
            <X size={18} aria-hidden="true" />
          </Button>
        </header>
        {children}
      </section>
    </div>
  );
}
