import type { ReactElement } from "react";
import { Grid2X2, List } from "lucide-react";
import type { BookViewMode } from "../types";

type BooksViewControlsProps = {
  onViewModeChange: (viewMode: BookViewMode) => void;
  viewMode: BookViewMode;
};

export function BooksViewControls({
  onViewModeChange,
  viewMode
}: BooksViewControlsProps): ReactElement {
  return (
    <section className="books-view-controls" aria-label="نمایش و مرتب‌سازی">
      <div className="books-view-toggle">
        <button
          aria-label="نمایش فهرستی"
          aria-pressed={viewMode === "list"}
          className={viewMode === "list" ? "is-active" : undefined}
          onClick={() => onViewModeChange("list")}
          type="button"
        >
          <List size={22} aria-hidden="true" />
        </button>
        <button
          aria-label="نمایش شبکه‌ای"
          aria-pressed={viewMode === "grid"}
          className={viewMode === "grid" ? "is-active" : undefined}
          onClick={() => onViewModeChange("grid")}
          type="button"
        >
          <Grid2X2 size={22} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
