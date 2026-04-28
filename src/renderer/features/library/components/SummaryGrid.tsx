import type { ReactElement } from "react";
import { BookOpen, CheckCircle2, UserRound } from "lucide-react";
import type { LibrarySummary } from "../types";
import { Card } from "../../../components/ui/Card";
import { toPersianNumber } from "../lib/formatters";

type SummaryGridProps = {
  summary: LibrarySummary;
};

const summaryCards = [
  {
    key: "total_books",
    label: "کل کتاب‌ها",
    tone: "blue",
    icon: BookOpen
  },
  {
    key: "available_books",
    label: "کتاب‌های موجود",
    tone: "green",
    icon: CheckCircle2
  },
  {
    key: "borrowed_books",
    label: "امانت‌های فعال",
    tone: "amber",
    icon: UserRound
  }
] as const;

export function SummaryGrid({ summary }: SummaryGridProps): ReactElement {
  return (
    <section className="summary-grid" aria-label="آمار کتابخانه">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card className={`summary-card summary-card--${card.tone}`} key={card.key}>
            <div>
              <p>{card.label}</p>
              <strong>{toPersianNumber(summary[card.key])}</strong>
            </div>
            <span className="summary-card__icon" aria-hidden="true">
              <Icon size={28} />
            </span>
          </Card>
        );
      })}
    </section>
  );
}
