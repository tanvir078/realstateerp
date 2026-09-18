import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTone = "default" | "success" | "warning" | "danger" | "info";

const toneAccent: Record<StatTone, string> = {
  default: "border-l-card-border",
  success: "border-l-status-success",
  warning: "border-l-status-warning",
  danger: "border-l-status-danger",
  info: "border-l-secondary",
};

const toneIcon: Record<StatTone, string> = {
  default: "bg-background-secondary text-text-secondary",
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  danger: "bg-status-danger/10 text-status-danger",
  info: "bg-secondary/10 text-secondary",
};

const toneValue: Record<StatTone, string> = {
  default: "text-text-primary",
  success: "text-status-success",
  warning: "text-status-warning",
  danger: "text-status-danger",
  info: "text-secondary",
};

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  tone?: StatTone;
  /** Highlights the numeric value using the tone colour instead of the default text colour. */
  emphasiseValue?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Compact KPI tile used across every module dashboard. */
const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  emphasiseValue = false,
  onClick,
  className,
}: StatCardProps) => {
  const interactive = typeof onClick === "function";
  const Element = interactive ? "button" : "div";

  return (
    <Element
      {...(interactive ? { type: "button" as const, onClick } : {})}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-l-2 border-card-border bg-card-surface p-4 text-left",
        toneAccent[tone],
        interactive &&
          "transition-colors hover:border-accent-emerald/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
        {Icon && (
          <span className={cn("shrink-0 rounded-md p-1.5", toneIcon[tone])}>
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
        )}
      </div>

      <p className={cn("truncate text-xl font-semibold tracking-tight", emphasiseValue ? toneValue[tone] : "text-text-primary")}>
        {value}
      </p>

      {hint && <p className="border-t border-card-border pt-2 text-[11px] leading-relaxed text-text-secondary">{hint}</p>}
    </Element>
  );
};
StatCard.displayName = "StatCard";

interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column count at the largest breakpoint. Defaults to four. */
  columns?: 2 | 3 | 4 | 5;
}

const columnClass: Record<NonNullable<StatGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

/** Responsive grid wrapper that keeps KPI tiles aligned on every page. */
const StatGrid = ({ className, columns = 4, ...props }: StatGridProps) => (
  <div className={cn("grid grid-cols-1 gap-4", columnClass[columns], className)} {...props} />
);
StatGrid.displayName = "StatGrid";

export { StatCard, StatGrid };
