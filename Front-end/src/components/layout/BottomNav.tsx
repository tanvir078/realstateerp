import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calculator,
  Building2,
  Users,
  Settings,
} from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calculator, label: "Accounting", path: "/accounting" },
    { icon: Building2, label: "Projects", path: "/projects" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-card-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              type="button"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald",
                active
                  ? "bg-accent-emerald/10 text-accent-emerald"
                  : "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
              )}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
