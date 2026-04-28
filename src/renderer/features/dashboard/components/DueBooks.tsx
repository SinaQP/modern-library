import type { ReactElement } from "react";
import { CalendarDays, UserRound } from "lucide-react";
import { dueBooks } from "../dashboardData";

export function DueBooks(): ReactElement {
  return (
    <section className="panel due-books">
      <header className="panel__header">
        <h2>کتاب‌های در حال سررسید</h2>
        <button className="pill-button" type="button">همه</button>
      </header>
      <div className="due-books__grid">
        {dueBooks.map((book) => (
          <article className="due-book-card" key={book.title}>
            <div className={`book-cover due-book-card__cover ${book.coverClass}`}>
              <span>{book.title}</span>
              <small>{book.author}</small>
            </div>
            <div className="due-book-card__copy">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <span className="borrower-line">
                <UserRound size={16} aria-hidden="true" />
                {book.borrower}
              </span>
              <span className="date-badge">
                <CalendarDays size={16} aria-hidden="true" />
                {book.dueDate}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
