import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Horizontal control strip for search inputs, filters and inline actions. */
const Toolbar = ({ className, ...props }: ToolbarProps) => (
  <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)} {...props} />
);
Toolbar.displayName = "Toolbar";

interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  containerClassName?: string;
}

/** Search input with a consistent icon, height and focus ring. */
const SearchField = ({ label, containerClassName, className, ...props }: SearchFieldProps) => (
  <div className={cn("relative min-w-0 flex-1", containerClassName)}>
    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
    <input
      type="search"
      aria-label={label}
      className={cn(
        "h-9 w-full rounded-md border border-card-border bg-input-bg pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-emerald",
        className,
      )}
      {...props}
    />
  </div>
);
SearchField.displayName = "SearchField";

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

/** Select control matched to SearchField metrics for toolbar alignment. */
const FilterSelect = ({ label, className, children, ...props }: FilterSelectProps) => (
  <select
    aria-label={label}
    className={cn(
      "h-9 rounded-md border border-card-border bg-input-bg px-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-emerald",
      className,
    )}
    {...props}
  >
    {children}
  </select>
);
FilterSelect.displayName = "FilterSelect";

export { Toolbar, SearchField, FilterSelect };
