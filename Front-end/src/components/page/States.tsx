import { AlertCircle, CheckCircle2, Inbox, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

/** Inline loading indicator for panels and tables. */
const LoadingState = ({ message = "Loading…", className }: LoadingStateProps) => (
  <div role="status" aria-live="polite" className={cn("flex items-center justify-center gap-2 py-10 text-sm text-text-secondary", className)}>
    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
    <span>{message}</span>
  </div>
);
LoadingState.displayName = "LoadingState";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

/** Neutral placeholder shown when a collection has no records. */
const EmptyState = ({
  title = "No records found",
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", className)}>
    <span className="rounded-full border border-card-border bg-background-secondary p-3 text-text-secondary">
      <Icon aria-hidden="true" className="h-5 w-5" />
    </span>
    <p className="text-sm font-medium text-text-primary">{title}</p>
    {description && <p className="max-w-md text-xs leading-relaxed text-text-secondary">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
EmptyState.displayName = "EmptyState";

type AlertTone = "error" | "success" | "warning" | "info";

const alertTone: Record<AlertTone, { wrapper: string; icon: LucideIcon }> = {
  error: { wrapper: "border-status-danger/30 bg-status-danger/10 text-status-danger", icon: AlertCircle },
  success: { wrapper: "border-status-success/30 bg-status-success/10 text-status-success", icon: CheckCircle2 },
  warning: { wrapper: "border-status-warning/30 bg-status-warning/10 text-status-warning", icon: AlertCircle },
  info: { wrapper: "border-secondary/30 bg-secondary/10 text-secondary", icon: AlertCircle },
};

interface InlineAlertProps {
  children: React.ReactNode;
  tone?: AlertTone;
  className?: string;
}

/** Compact status banner used for API errors and confirmations. */
const InlineAlert = ({ children, tone = "error", className }: InlineAlertProps) => {
  const { wrapper, icon: Icon } = alertTone[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm", wrapper, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="min-w-0 leading-relaxed">{children}</span>
    </div>
  );
};
InlineAlert.displayName = "InlineAlert";

export { LoadingState, EmptyState, InlineAlert };
