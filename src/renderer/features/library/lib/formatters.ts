const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianNumber(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => persianDigits[Number(digit)] ?? digit);
}

export function getOptionalText(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "ثبت نشده";
  }

  return String(value);
}
