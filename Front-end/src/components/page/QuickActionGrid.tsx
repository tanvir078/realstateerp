import { useNavigate } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatTone } from "./StatCard";

const toneClass: Record<StatTone, string> = {
  default: "bg-background-secondary text-text-secondary",
  success: "bg-status-success/10 text-status-success",
  warning: "bg-status-warning/10 text-status-warning",
  danger: "bg-status-danger/10 text-status-danger",
  info: "bg-secondary/10 text-secondary",
};

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  tone?: StatTone;
}

interface QuickActionGridProps {
  actions: QuickAction[];
  className?: string;
}

/**
 * Navigation tiles shown on every module landing page. Centralising this keeps
 * card height, icon treatment and hover state identical across modules.
 */
const QuickActionGrid = ({ actions, className }: QuickActionGridProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.route}
            type="button"
            onClick={() => navigate(action.route)}
            className="flex flex-col gap-3 rounded-xl border border-card-border bg-card-surface p-4 text-left transition-colors hover:border-accent-emerald/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald"
          >
            <span className={cn("w-fit rounded-lg p-2", toneClass[action.tone ?? "success"])}>
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-text-primary">{action.title}</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-text-secondary">{action.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
QuickActionGrid.displayName = "QuickActionGrid";

export { QuickActionGrid };
