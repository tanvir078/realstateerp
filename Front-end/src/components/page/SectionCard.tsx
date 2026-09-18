import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** Set false when the child already manages its own padding (e.g. a full-bleed table). */
  padded?: boolean;
  className?: string;
  bodyClassName?: string;
}

/**
 * Standard content panel. Use for every table, form and chart block so that
 * borders, radii and header spacing stay identical across modules.
 */
const SectionCard = ({
  title,
  description,
  actions,
  children,
  padded = true,
  className,
  bodyClassName,
}: SectionCardProps) => {
  const hasHeader = Boolean(title || description || actions);

  return (
    <section className={cn("overflow-hidden rounded-xl border border-card-border bg-card-surface", className)}>
      {hasHeader && (
        <div className="flex flex-col gap-3 border-b border-card-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-text-primary">{title}</h2>}
            {description && <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn(padded && "px-4 py-4 sm:px-5", bodyClassName)}>{children}</div>
    </section>
  );
};
SectionCard.displayName = "SectionCard";

export { SectionCard };
