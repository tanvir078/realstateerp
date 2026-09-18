import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X,
  LayoutDashboard,
  Calculator,
  Building2,
  Users,
  User,
  ShoppingCart,
  TrendingUp,
  FileText,
  Settings,
  HardHat
} from "lucide-react";
import { navigationItems } from "../../data/mockData";
import { cn } from "@/lib/utils";
import { canAccessPath, getStoredUser } from "@/lib/access";
import { useLanguage } from "@/context/LanguageContext";

// Icon mapping
const iconMap: Record<string, any> = {
  LayoutDashboard,
  Calculator,
  Building2,
  Users,
  User,
  ShoppingCart,
  TrendingUp,
  FileText,
  Settings,
  HardHat,
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const user = getStoredUser();
  const { t } = useLanguage();

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isItemActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-5 left-4 z-50 p-2 bg-card-surface border border-card-border rounded-md text-text-primary"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card-surface border-r border-card-border transition-all duration-300 z-40",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="sidebar-scroll h-full overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigationItems.filter((item) => canAccessPath(user?.role, item.path)).map((item) => {
              const Icon = iconMap[item.icon];
              const isExpanded = expandedItems.has(item.title);
              const hasChildren = item.children && item.children.length > 0;
              const isActive = isItemActive(item.path);

              return (
                <div key={item.title}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpand(item.title);
                      } else {
                        handleNavigate(item.path);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent-emerald/10 text-accent-emerald"
                        : "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{t(`nav.${item.title}`)}</span>
                        {hasChildren && (
                          isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )
                        )}
                      </>
                    )}
                  </button>

                  {/* Sub-menu */}
                  {hasChildren && isExpanded && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.filter((child) => canAccessPath(user?.role, child.path)).map((child) => (
                        <button
                          key={child.path}
                          onClick={() => handleNavigate(child.path)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2 rounded-md text-sm leading-5 transition-colors",
                            isItemActive(child.path)
                              ? "bg-accent-emerald/10 text-accent-emerald"
                              : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                          )}
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-card-border" />
                          <span className="min-w-0 flex-1 text-left">{t(`nav.${child.title}`)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute bottom-4  p-2 rounded-md bg-[#ffffff] hover:bg-card-border transition-colors",
              isCollapsed && "right-3"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
