import type { ReactElement } from "react";
import { Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { useAddBookForm } from "../hooks/useAddBookForm";

type AddBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function AddBookModal({
  isOpen,
  onClose,
  onCreated
}: AddBookModalProps): ReactElement | null {
  const { errors, fields, formError, handleSubmit, isSubmitting, updateField } = useAddBookForm({
    isOpen,
    onClose,
    onCreated
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="افزودن کتاب">
      <form className="book-form" onSubmit={handleSubmit}>
        {formError ? <p className="form-alert" role="alert">{formError}</p> : null}

        <TextInput
          autoComplete="off"
          error={errors.title}
          label="عنوان کتاب"
          name="title"
          onChange={updateField("title")}
          value={fields.title}
        />

        <TextInput
          autoComplete="off"
          error={errors.author}
          label="نویسنده"
          name="author"
          onChange={updateField("author")}
          value={fields.author}
        />

        <div className="form-grid">
          <TextInput
            label="دسته‌بندی"
            name="category"
            onChange={updateField("category")}
            value={fields.category}
          />
          <TextInput
            error={errors.publish_year}
            inputMode="numeric"
            label="سال انتشار"
            name="publish_year"
            onChange={updateField("publish_year")}
            value={fields.publish_year}
          />
        </div>

        <TextInput
          label="ناشر"
          name="publisher"
          onChange={updateField("publisher")}
          value={fields.publisher}
        />

        <label className="field" htmlFor="description">
          <span className="field__label">توضیحات</span>
          <textarea
            className="textarea"
            id="description"
            name="description"
            onChange={updateField("description")}
            rows={3}
            value={fields.description}
          />
        </label>

        <footer className="modal__footer">
          <Button onClick={onClose}>انصراف</Button>
          <Button
            icon={<Save size={18} aria-hidden="true" />}
            isLoading={isSubmitting}
            type="submit"
            variant="primary"
          >
            ذخیره کتاب
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
