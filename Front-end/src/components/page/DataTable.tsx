import { cn } from "@/lib/utils";
import { EmptyState, LoadingState } from "./States";

export interface DataTableColumn<T> {
  /** Stable identifier, also used as the React key for cells. */
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Falls back to `row[key]` when omitted. */
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  /** Applied to both the header and body cells. */
  className?: string;
  /** Hides the column below the `sm` breakpoint to keep mobile tables readable. */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/**
 * Standard list table with consistent header, row height, hover state and
 * loading/empty handling. Replaces the hand-rolled tables scattered across pages.
 */
function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyTitle,
  emptyDescription,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (loading) return <LoadingState />;
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-card-border">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary",
                  alignClass[column.align ?? "left"],
                  column.hideOnMobile && "hidden sm:table-cell",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-card-border/70 last:border-0",
                onRowClick && "cursor-pointer transition-colors hover:bg-background-secondary/60",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-4 py-3 align-middle text-text-primary",
                    alignClass[column.align ?? "left"],
                    column.hideOnMobile && "hidden sm:table-cell",
                    column.className,
                  )}
                >
                  {column.render ? column.render(row, index) : String((row as Record<string, unknown>)[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
DataTable.displayName = "DataTable";

export { DataTable };
