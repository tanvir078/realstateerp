import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Removes the max-width constraint for full-bleed pages such as wide ledgers. */
  wide?: boolean;
}

/**
 * The single source of truth for page padding, max width and vertical rhythm.
 * Every routed page should render exactly one PageContainer as its root node.
 */
const PageContainer = ({ className, wide = false, ...props }: PageContainerProps) => (
  <div
    className={cn(
      "mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8",
      wide ? "max-w-none" : "max-w-[1600px]",
      className,
    )}
    {...props}
  />
);
PageContainer.displayName = "PageContainer";

export { PageContainer };
