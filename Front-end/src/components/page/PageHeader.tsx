import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Standard page header: page title and an optional right-aligned action cluster.
 * Supporting copy and breadcrumbs remain accepted for backwards compatibility,
 * but are intentionally not rendered so every route has the same compact header.
 */
const PageHeader = ({
  title,
  description,
  actions,
  icon: Icon,
  className,
}: PageHeaderProps) => (
  <header className={cn("flex min-h-14 w-full items-center justify-between gap-4 border-b border-card-border pb-5", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 hidden shrink-0 rounded-lg border border-card-border bg-background-secondary p-2 text-accent-emerald sm:inline-flex">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">{title}</h1>
        </div>
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>}
  </header>
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
