import type { ReactElement } from "react";
import { Bookmark } from "lucide-react";
import { newBooks } from "../dashboardData";

export function NewBooks(): ReactElement {
  return (
    <section className="panel new-books">
      <header className="panel__header">
        <h2>جدیدترین کتاب‌ها</h2>
        <button className="pill-button" type="button">همه</button>
      </header>
      <div className="new-books__track">
        {newBooks.map((book) => (
          <article className="new-book-tile" key={book.title}>
            <div className={`book-cover new-book-tile__cover ${book.coverClass}`}>
              <span>{book.title}</span>
              <small>{book.author}</small>
            </div>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <time>{book.date}</time>
            <Bookmark className="new-book-tile__bookmark" size={18} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
