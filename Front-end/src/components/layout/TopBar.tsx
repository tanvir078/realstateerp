import { Search, Bell, LogOut, Globe } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const TopBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleSearch = () => {
    setSearchOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-card-border bg-card-surface flex items-center justify-between px-4 lg:px-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-emerald flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-semibold text-sm">SLBL ERP</h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-4 lg:mx-8">
        <div 
          className="relative"
          onClick={handleSearch}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder={t("topbar.search")}
            className="pl-10 pr-4 cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Language Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguageOpen(!languageOpen)}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === "bn" ? "BN" : "EN"}</span>
          </Button>
          
          {languageOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-card-surface border border-card-border rounded-md shadow-lg z-50">
              <div className="p-1">
                <button
                  onClick={() => { setLanguage("en"); setLanguageOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-background-secondary rounded"
                >
                  {t("topbar.english")}
                </button>
                <button
                  onClick={() => { setLanguage("bn"); setLanguageOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-background-secondary rounded"
                >
                  {t("topbar.bangla")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 rounded-full"
          >
            3
          </Badge>
        </Button>

        {/* Profile */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background-secondary rounded-full border border-card-border">
          <div className="w-6 h-6 rounded-full bg-accent-emerald flex items-center justify-center">
            <span className="text-white text-xs font-medium">TA</span>
          </div>
          <span className="text-sm text-text-primary">Test Admin</span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("current_user");
            window.location.href = "/login";
          }}
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl mx-4 bg-card-surface border border-card-border rounded-lg shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search vouchers, clients, projects..."
                className="pl-10"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                  }
                }}
              />
            </div>
            <div className="text-sm text-text-secondary">
                <p className="mb-2 font-medium">{t("topbar.recentSearches")}</p>
              <ul className="space-y-1">
                <li className="px-3 py-2 hover:bg-background-secondary rounded cursor-pointer">
                  PV-0001 - Test expense
                </li>
                <li className="px-3 py-2 hover:bg-background-secondary rounded cursor-pointer">
                  Green Valley Tower
                </li>
                <li className="px-3 py-2 hover:bg-background-secondary rounded cursor-pointer">
                  Client: John Doe
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;