import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClass: Record<StatusTone, string> = {
  success: "border-status-success/30 bg-status-success/10 text-status-success",
  warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
  danger: "border-status-danger/30 bg-status-danger/10 text-status-danger",
  info: "border-secondary/30 bg-secondary/10 text-secondary",
  neutral: "border-card-border bg-background-secondary text-text-secondary",
};

/**
 * Canonical status → tone mapping for the whole application.
 * Keys are normalised to lower case so backend enums that use either
 * `completed` (sales) or `COMPLETED` (handover) resolve identically.
 */
const statusTones: Record<string, StatusTone> = {
  // Positive / terminal-good
  active: "success",
  approved: "success",
  cleared: "success",
  completed: "success",
  delivered: "success",
  paid: "success",
  posted: "success",
  received: "success",
  sold: "success",
  up_to_date: "success",

  // In-flight
  confirmed: "info",
  booked: "info",
  in_progress: "info",
  issued: "info",
  ongoing: "info",
  partial: "info",
  partially_paid: "info",
  processing: "info",
  scheduled: "info",
  submitted: "info",
  upcoming: "info",

  // Needs attention
  draft: "warning",
  due: "warning",
  due_soon: "warning",
  on_hold: "warning",
  pending: "warning",
  pending_clearance: "warning",
  unpaid: "warning",

  // Negative
  blocked: "danger",
  cancelled: "danger",
  expired: "danger",
  failed: "danger",
  overdue: "danger",
  rejected: "danger",

  // Neutral
  available: "neutral",
  closed: "neutral",
  inactive: "neutral",
  unallocated: "neutral",
};

/** Resolves a raw backend status string to a display tone. */
export const resolveStatusTone = (status?: string | null): StatusTone => {
  if (!status) return "neutral";
  return statusTones[status.trim().toLowerCase().replace(/[\s-]+/g, "_")] ?? "neutral";
};

/** Converts `IN_PROGRESS` / `in_progress` into `In Progress` for display. */
export const formatStatusLabel = (status?: string | null): string => {
  if (!status) return "—";
  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

interface StatusBadgeProps {
  status?: string | null;
  /** Override the automatic tone resolution. */
  tone?: StatusTone;
  /** Show the raw backend value instead of the humanised label. */
  raw?: boolean;
  className?: string;
}

/** Case-insensitive, consistently coloured status pill. */
const StatusBadge = ({ status, tone, raw = false, className }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-medium",
      toneClass[tone ?? resolveStatusTone(status)],
      className,
    )}
  >
    {raw ? (status ?? "—") : formatStatusLabel(status)}
  </span>
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
