import { cn } from "@/lib/utils";

interface StatusDotProps {
  color: string;
  className?: string;
}

const StatusDot = ({ color, className }: StatusDotProps) => {
  return (
    <div
      className={cn("w-2 h-2 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
};

export { StatusDot };
