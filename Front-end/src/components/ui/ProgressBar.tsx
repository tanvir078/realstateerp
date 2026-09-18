import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar = ({ value, max = 100, className, showLabel = false }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm text-text-secondary">
            {value} / {max}
          </span>
        )}
        <span className="text-sm text-text-primary font-medium">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-emerald transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { ProgressBar };
