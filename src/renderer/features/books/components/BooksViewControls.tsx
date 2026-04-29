import type { ReactElement } from "react";
import { Grid2X2, List } from "lucide-react";

export function BooksViewControls(): ReactElement {
  return (
    <section className="books-view-controls" aria-label="نمایش و مرتب‌سازی">
      <div className="books-view-toggle">
        <button aria-label="نمای فهرستی" type="button">
          <List size={22} aria-hidden="true" />
        </button>
        <button aria-label="نمای شبکه‌ای" className="is-active" type="button">
          <Grid2X2 size={22} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
