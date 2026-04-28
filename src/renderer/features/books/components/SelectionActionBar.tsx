import type { ReactElement } from "react";
import { CheckCircle2, Pencil, RotateCcw, Trash2, UserPlus, X } from "lucide-react";

type SelectionActionBarProps = {
  count: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onLoan: () => void;
  onReturn: () => void;
};

export function SelectionActionBar({
  count,
  onClearSelection,
  onDelete,
  onEdit,
  onLoan,
  onReturn
}: SelectionActionBarProps): ReactElement | null {
  if (count === 0) {
    return null;
  }

  return (
    <section className="selection-action-bar" aria-label="اقدام‌های انتخاب">
      <button className="selection-clear" onClick={onClearSelection} type="button">
        <X size={22} aria-hidden="true" />
        <span>لغو انتخاب</span>
      </button>
      <div className="selection-actions">
        <button onClick={onReturn} type="button"><RotateCcw size={20} aria-hidden="true" />بازگردانی</button>
        <button onClick={onLoan} type="button"><UserPlus size={20} aria-hidden="true" />ثبت امانت</button>
        <button onClick={onDelete} type="button"><Trash2 size={20} aria-hidden="true" />حذف</button>
        <button onClick={onEdit} type="button"><Pencil size={20} aria-hidden="true" />ویرایش</button>
      </div>
      <strong>
        <CheckCircle2 size={24} aria-hidden="true" />
        {count.toLocaleString("fa-IR")} کتاب انتخاب شده‌اند
      </strong>
    </section>
  );
}
