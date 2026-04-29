import type { CSSProperties, MouseEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bookmark,
  Eye,
  Info,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
  UserPlus,
  UserRound
} from "lucide-react";
import type { BookRecord } from "../types";

type BookListRowProps = {
  book: BookRecord;
  isSaved: boolean;
  onDelete: (book: BookRecord) => void;
  onEdit: (book: BookRecord) => void;
  onLoan: (book: BookRecord) => void;
  onOpenDetails: (book: BookRecord) => void;
  onReturn: (book: BookRecord) => void;
  onToggleSaved: (book: BookRecord) => void;
};

type MenuPosition = {
  left: number;
  top: number;
};

const moreMenuWidth = 194;
const moreMenuGap = 8;
const viewportPadding = 12;
const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => persianDigits[Number(digit)]);
}

function getMenuPosition(trigger: HTMLButtonElement): MenuPosition {
  const triggerRect = trigger.getBoundingClientRect();
  const menuHeight = 238;
  const left = Math.min(
    Math.max(triggerRect.right - moreMenuWidth, viewportPadding),
    window.innerWidth - moreMenuWidth - viewportPadding
  );
  const hasRoomBelow = triggerRect.bottom + moreMenuGap + menuHeight < window.innerHeight - viewportPadding;
  const top = hasRoomBelow
    ? triggerRect.bottom + moreMenuGap
    : Math.max(viewportPadding, triggerRect.top - moreMenuGap - menuHeight);

  return { left, top };
}

export function BookListRow({
  book,
  isSaved,
  onDelete,
  onEdit,
  onLoan,
  onOpenDetails,
  onReturn,
  onToggleSaved
}: BookListRowProps): ReactElement {
  const isLoaned = book.status === "loaned";
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const statusText = isLoaned ? "امانت داده شده" : "در دسترس";
  const loanText = isLoaned ? (book.borrower ?? "امانت‌گیرنده") : "آماده امانت";

  useEffect(() => {
    if (!menuPosition) {
      return undefined;
    }

    function closeMenu() {
      setMenuPosition(null);
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (menuRef.current?.contains(target) || moreButtonRef.current?.contains(target)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [menuPosition]);

  function openMoreMenu(event: MouseEvent<HTMLButtonElement>) {
    const nextPosition = getMenuPosition(event.currentTarget);
    setMenuPosition((currentPosition) => (currentPosition ? null : nextPosition));
  }

  function selectMenuOption(action: () => void) {
    setMenuPosition(null);
    action();
  }

  const menuStyle: CSSProperties | undefined = menuPosition
    ? { left: `${menuPosition.left}px`, top: `${menuPosition.top}px`, width: `${moreMenuWidth}px` }
    : undefined;

  return (
    <article className="book-list-row">
      <div className="book-list-row__book" data-label="کتاب">
        <div className={`book-cover book-list-row__cover ${book.coverClass}`}>
          <span>{book.title}</span>
        </div>
        <div className="book-list-row__title">
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      </div>

      <div className="book-list-row__cell" data-label="دسته‌بندی">
        <span>{book.category}</span>
      </div>

      <div className="book-list-row__cell book-list-row__isbn" data-label="شابک">
        <span>{toPersianDigits(book.isbn)}</span>
      </div>

      <div className="book-list-row__cell" data-label="وضعیت">
        <strong className={isLoaned ? "book-status book-status--loaned" : "book-status"}>
          {statusText}
        </strong>
      </div>

      <div className="book-list-row__loan" data-label="امانت">
        <span>
          {isLoaned ? <UserRound size={16} aria-hidden="true" /> : null}
          {loanText}
        </span>
        {isLoaned && book.dueDate ? <small>موعد بازگشت: {toPersianDigits(book.dueDate)}</small> : null}
      </div>

      <div className="book-list-actions" data-label="اقدام‌ها">
        <button
          aria-expanded={Boolean(menuPosition)}
          aria-label="گزینه‌های بیشتر"
          onClick={openMoreMenu}
          ref={moreButtonRef}
          title="گزینه‌های بیشتر"
          type="button"
        >
          <MoreHorizontal size={22} aria-hidden="true" />
        </button>
        <button
          aria-label="مشاهده جزئیات"
          onClick={() => onOpenDetails(book)}
          title="مشاهده جزئیات"
          type="button"
        >
          <Info size={22} aria-hidden="true" />
        </button>
        <button aria-label="ویرایش کتاب" onClick={() => onEdit(book)} title="ویرایش کتاب" type="button">
          <Pencil size={22} aria-hidden="true" />
        </button>
        <button
          aria-label="حذف کتاب"
          className="book-list-action--danger"
          onClick={() => onDelete(book)}
          title="حذف کتاب"
          type="button"
        >
          <Trash2 size={22} aria-hidden="true" />
        </button>
        <button
          aria-label="ذخیره کتاب"
          className={isSaved ? "book-list-action--saved is-active" : "book-list-action--saved"}
          onClick={() => onToggleSaved(book)}
          title="ذخیره کتاب"
          type="button"
        >
          <Bookmark fill={isSaved ? "currentColor" : "none"} size={22} aria-hidden="true" />
        </button>
        <button
          aria-label={isLoaned ? "بازگردانی کتاب" : "ثبت امانت"}
          className="book-list-action--loan"
          onClick={() => (isLoaned ? onReturn(book) : onLoan(book))}
          title={isLoaned ? "بازگردانی کتاب" : "ثبت امانت"}
          type="button"
        >
          {isLoaned ? <RotateCcw size={22} aria-hidden="true" /> : <UserPlus size={22} aria-hidden="true" />}
        </button>
      </div>

      {menuPosition
        ? createPortal(
          <div className="book-card-menu" ref={menuRef} role="menu" style={menuStyle}>
            <button onClick={() => selectMenuOption(() => onOpenDetails(book))} role="menuitem" type="button">
              <Eye size={18} aria-hidden="true" />
              مشاهده جزئیات
            </button>
            <button onClick={() => selectMenuOption(() => onEdit(book))} role="menuitem" type="button">
              <Pencil size={18} aria-hidden="true" />
              ویرایش
            </button>
            <button
              onClick={() => selectMenuOption(() => (isLoaned ? onReturn(book) : onLoan(book)))}
              role="menuitem"
              type="button"
            >
              {isLoaned ? <RotateCcw size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
              {isLoaned ? "بازگردانی" : "ثبت امانت"}
            </button>
            <button
              className="book-card-menu__danger"
              onClick={() => selectMenuOption(() => onDelete(book))}
              role="menuitem"
              type="button"
            >
              <Trash2 size={18} aria-hidden="true" />
              حذف
            </button>
          </div>,
          document.body
        )
        : null}
    </article>
  );
}
