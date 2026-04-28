import type { ReactElement } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div className="state-card state-card--error" role="alert">
      <AlertTriangle size={34} aria-hidden="true" />
      <h2>بارگذاری ناموفق بود</h2>
      <p>{message}</p>
      <Button onClick={onRetry} variant="primary">
        تلاش دوباره
      </Button>
    </div>
  );
}
