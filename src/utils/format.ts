const invalid = "—";

export const exchangeRateFormat: Intl.NumberFormatOptions = {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
};

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions & { locale?: string } = {}
): string {
  if (!Number.isFinite(value)) return invalid;

  const { locale = "en-US", ...intlOptions } = options;

  return new Intl.NumberFormat(locale, intlOptions).format(value);
}

// API sends "2026-06-25" (date only). Split and format as "June 25, 2026".
export function formatLastUpdated(value: string): string {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return invalid;

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(date.getTime())) return invalid;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function parseNumber(value: string): number {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed) || parsed < 0) return 0;

  return parsed;
}
