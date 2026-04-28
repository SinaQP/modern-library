import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { createBook } from "../services/libraryService";
import type { CreateBookPayload } from "../types";

export type BookFormFields = {
  author: string;
  category: string;
  description: string;
  publish_year: string;
  publisher: string;
  title: string;
};

export type BookFormErrors = Partial<Record<keyof BookFormFields, string>>;

type UseAddBookFormOptions = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

type UseAddBookFormResult = {
  errors: BookFormErrors;
  fields: BookFormFields;
  formError: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  updateField: (
    field: keyof BookFormFields
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const initialForm: BookFormFields = {
  author: "",
  category: "",
  description: "",
  publish_year: "",
  publisher: "",
  title: ""
};

function validateForm(fields: BookFormFields): BookFormErrors {
  const errors: BookFormErrors = {};
  const publishYear = fields.publish_year.trim();

  if (!fields.title.trim()) {
    errors.title = "عنوان کتاب الزامی است.";
  }

  if (!fields.author.trim()) {
    errors.author = "نام نویسنده الزامی است.";
  }

  if (publishYear) {
    const parsedYear = Number(publishYear);
    if (!Number.isInteger(parsedYear) || parsedYear < 1000 || parsedYear > 2100) {
      errors.publish_year = "سال انتشار باید عددی بین ۱۰۰۰ تا ۲۱۰۰ باشد.";
    }
  }

  return errors;
}

function toPayload(fields: BookFormFields): CreateBookPayload {
  const publishYear = fields.publish_year.trim();

  return {
    title: fields.title.trim(),
    author: fields.author.trim(),
    category: fields.category.trim(),
    publish_year: publishYear ? Number(publishYear) : null,
    publisher: fields.publisher.trim(),
    description: fields.description.trim()
  };
}

export function useAddBookForm({
  isOpen,
  onClose,
  onCreated
}: UseAddBookFormOptions): UseAddBookFormResult {
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [fields, setFields] = useState<BookFormFields>(initialForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFields(initialForm);
      setErrors({});
      setFormError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  function updateField(field: keyof BookFormFields) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((currentFields) => ({
        ...currentFields,
        [field]: event.target.value
      }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(fields);
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createBook(toPayload(fields));
      await onCreated();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "ثبت کتاب ناموفق بود.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errors,
    fields,
    formError,
    handleSubmit,
    isSubmitting,
    updateField
  };
}
