import { useEffect, useId, useRef, useState, type ReactElement } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { BookSortOption } from "../types";

const sortOptions: Array<{ label: string; value: BookSortOption }> = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
  { value: "title-asc", label: "عنوان کتاب: الف تا ی" },
  { value: "title-desc", label: "عنوان کتاب: ی تا الف" },
  { value: "author-asc", label: "نویسنده: الف تا ی" },
  { value: "author-desc", label: "نویسنده: ی تا الف" },
  { value: "publish-year-desc", label: "سال انتشار: جدیدترین" },
  { value: "publish-year-asc", label: "سال انتشار: قدیمی‌ترین" },
  { value: "status-available-first", label: "وضعیت: در دسترس اول" },
  { value: "status-loaned-first", label: "وضعیت: امانت داده شده اول" }
];

type BooksSortDropdownProps = {
  onChange: (value: BookSortOption) => void;
  value: BookSortOption;
};

export function BooksSortDropdown({ onChange, value }: BooksSortDropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = sortOptions.find((option) => option.value === value) ?? sortOptions[0];

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectOption(nextValue: BookSortOption) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className="books-sort-control" ref={rootRef}>
      <button
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="books-tool-button books-sort-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <SlidersHorizontal size={20} aria-hidden="true" />
        <span>مرتب‌سازی: {selectedOption.label}</span>
        <ChevronDown className={isOpen ? "is-open" : undefined} size={18} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="books-sort-menu" id={menuId} role="menu">
          {sortOptions.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                className={isSelected ? "books-sort-option is-active" : "books-sort-option"}
                key={option.value}
                onClick={() => selectOption(option.value)}
                role="menuitem"
                type="button"
              >
                <span>{option.label}</span>
                {isSelected ? <Check size={18} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
