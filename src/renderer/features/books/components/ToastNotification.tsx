import type { ReactElement } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ToastMessage } from "../types";

type ToastNotificationProps = {
  onClose: (id: number) => void;
  toasts: ToastMessage[];
};

const toastIcon = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
};

export function ToastNotification({ onClose, toasts }: ToastNotificationProps): ReactElement | null {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack">
      {toasts.map((toast) => {
        const Icon = toastIcon[toast.variant];
        return (
          <section className={`toast toast--${toast.variant}`} key={toast.id} role="status">
            <Icon size={38} aria-hidden="true" />
            <div>
              <h3>{toast.title}</h3>
              <p>{toast.text}</p>
            </div>
            <button aria-label="بستن اعلان" onClick={() => onClose(toast.id)} type="button">
              <X size={20} />
            </button>
          </section>
        );
      })}
    </div>
  );
}
