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

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions & { locale?: string } = {}
): string {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return invalid;

  const { locale = "en-US", ...intlOptions } = options;

  return new Intl.DateTimeFormat(locale, intlOptions).format(date);
}

export function parseNumber(value: string): number {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed) || parsed < 0) return 0;

  return parsed;
}
