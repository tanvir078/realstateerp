const BDT_LOCALE = "en-BD";

/** `1234567` → `৳ 12,34,567` — the single currency formatter for the whole UI. */
export const formatMoney = (value: unknown, options?: { compact?: boolean }): string => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "৳ 0";

  if (options?.compact) {
    const absolute = Math.abs(amount);
    if (absolute >= 10_000_000) return `৳ ${(amount / 10_000_000).toFixed(2)} Cr`;
    if (absolute >= 100_000) return `৳ ${(amount / 100_000).toFixed(2)} L`;
  }

  return `৳ ${amount.toLocaleString(BDT_LOCALE, { maximumFractionDigits: 2 })}`;
};

/** Plain number with thousands separators and no currency symbol. */
export const formatNumber = (value: unknown): string => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount.toLocaleString(BDT_LOCALE) : "0";
};

/** `0.4212` or `42.12` → `42.12%` depending on `alreadyPercent`. */
export const formatPercent = (value: unknown, options?: { alreadyPercent?: boolean }): string => {
  const raw = Number(value ?? 0);
  if (!Number.isFinite(raw)) return "0%";
  const percent = options?.alreadyPercent === false ? raw * 100 : raw;
  return `${Number(percent.toFixed(2))}%`;
};

/** ISO timestamp or date string → `12 Sep 2026`. Returns an em dash when unset. */
export const formatDate = (value?: string | Date | null): string => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(BDT_LOCALE, { day: "2-digit", month: "short", year: "numeric" });
};

/** Trims an ISO timestamp down to `YYYY-MM-DD` for date inputs. */
export const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
