import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Search, Filter, Download, ChevronRight, ChevronDown,
  Folder, FolderOpen, FileText, DollarSign, Scale, 
  TrendingUp, TrendingDown, Edit3, MoreVertical, ShieldCheck,
  Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import AddAccountHeadModal from "@/components/forms/AddAccountHeadModal";
import { useAccounting } from "@/context/AccountingContext";
import { createAccount, updateAccount } from "@/services/accounting/accounting.service";
import { useLanguage } from "@/context/LanguageContext";

interface AccountNode {
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
  category: "Header" | "Account";
  balance: number;
  status: "ACTIVE" | "INACTIVE";
  children?: AccountNode[];
}

export default function ChartOfAccountsPage() {
  const {
    chartOfAccounts,
    chartOfAccountsLoading,
    chartOfAccountsError,
    fetchChartOfAccounts,
    accountSummary,
    fetchAccountSummary,
  } = useAccounting();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});
  const [isAddAccountHeadModalOpen, setIsAddAccountHeadModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const { t } = useLanguage();

  // Fetch chart of accounts on mount
  useEffect(() => {
    fetchChartOfAccounts();
    fetchAccountSummary();
  }, []);

  const flattenAccounts = (accounts: any[]): any[] => accounts.flatMap((account) => [account, ...flattenAccounts(account.children || [])]);
  const parentAccounts = flattenAccounts(chartOfAccounts)
    .filter((account) => account.isHeader)
    .map((account) => ({ id: account.id, code: account.code, name: account.name }));

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const openCreateModal = (parentAccount: any | null = null) => {
    setSelectedAccount(parentAccount ? { parentId: parentAccount.id } : null);
    setIsAddAccountHeadModalOpen(true);
  };

  const openEditModal = (account: AccountNode & { id?: string; parentId?: string; isHeader?: boolean; isPostable?: boolean }) => {
    setSelectedAccount(account);
    setIsAddAccountHeadModalOpen(true);
  };

  const formatCurrency = (amount: number | string | null | undefined) =>
    "৳ " + Number(amount ?? 0).toLocaleString("en-BD");

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ASSET":
          return <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t("coa.assets").replace(/s$/, "")}</span>;
      case "LIABILITY":
          return <span className="text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{t("coa.liabilities").replace(/s$/, "")}</span>;
      case "EQUITY":
          return <span className="text-[11px] font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">Equity</span>;
      case "REVENUE":
          return <span className="text-[11px] font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Revenue</span>;
      case "EXPENSE":
        return <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Expense</span>;
      default:
        return null;
    }
  };

  const renderTree = (nodes: AccountNode[], depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedCodes[node.code];
      const hasChildren = node.children && node.children.length > 0;

      // Filter check
      if (selectedType !== "ALL" && node.type !== selectedType) {
        return null;
      }

      return (
        <React.Fragment key={node.code}>
          <tr className="hover:bg-[#1A3530]/40 transition-colors border-b border-[#1E3E37]/60">
            {/* Account Code & Expand Arrow */}
            <td className="p-3.5 font-mono text-[#10B981] font-semibold">
              <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
                {hasChildren ? (
                  <button
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.name}`}
                    onClick={() => toggleExpand(node.code)}
                    className="p-1 rounded text-[#829B96] hover:text-white hover:bg-[#1E3E37]"
                  >
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                ) : (
                  <span className="w-5" />
                )}
                <span>{node.code}</span>
              </div>
            </td>

            {/* Account Name */}
            <td className="p-3.5">
              <div className="flex items-center gap-2">
                {node.category === "Header" ? (
                  isExpanded ? <FolderOpen className="h-4 w-4 text-amber-400" /> : <Folder className="h-4 w-4 text-amber-400" />
                ) : (
                  <FileText className="h-4 w-4 text-[#829B96]" />
                )}
                <span className={`font-medium ${node.category === "Header" ? "text-white font-bold" : "text-[#E2E8F0]"}`}>
                  {node.name}
                </span>
              </div>
            </td>

            {/* Account Type */}
            <td className="p-3.5">
              {getTypeBadge(node.type)}
            </td>

            {/* Category Level */}
            <td className="p-3.5 text-[#829B96] text-[11px]">
              {node.category}
            </td>

            {/* Balance */}
            <td className={`p-3.5 font-semibold text-right ${node.category === "Header" ? "text-white" : "text-[#10B981]"}`}>
              {formatCurrency(node.balance)}
            </td>

            {/* Status */}
            <td className="p-3.5 text-center">
              <span className="inline-flex items-center gap-1 text-[11px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                <ShieldCheck className="h-3 w-3" /> {t("coa.active")}
              </span>
            </td>

            {/* Actions */}
            <td className="p-3.5 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <button
                  aria-label={`Edit ${node.name}`}
                  onClick={() => openEditModal(node)}
                  title={`Edit ${node.name}`}
                  className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  aria-label={`Add child account under ${node.name}`}
                  onClick={() => openCreateModal(node)}
                  title={`Add child account under ${node.name}`}
                  className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>

          {/* Recursive Render Children */}
          {hasChildren && isExpanded && renderTree(node.children!, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="p-4 space-y-3 pb-2 border-b border-[#1E3E37]">
    
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{t("coa.title")}</h1>
           
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              {t("coa.export")}
            </Button>
            <Button 
            onClick={() => openCreateModal()}
            size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5">
              <Plus className="h-4 w-4" />
              {t("coa.addHead")}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">{t("coa.totalAssets")}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-emerald-400">৳ {Number(accountSummary.ASSET || 0).toLocaleString("en-BD")}</p>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Scale className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Cash, Land, Construction WIP</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">{t("coa.totalLiabilities")}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-amber-400">৳ {Number(accountSummary.LIABILITY || 0).toLocaleString("en-BD")}</p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><DollarSign className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Suppliers & Bank Loans</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">{t("coa.ytdRevenue")}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-sky-400">৳ {Number(accountSummary.REVENUE || 0).toLocaleString("en-BD")}</p>
            <span className="p-2 rounded-lg bg-sky-400/10 text-sky-400"><TrendingUp className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Apartment & Shop Sales</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">{t("coa.ytdExpense")}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-rose-400">৳ {Number(accountSummary.EXPENSE || 0).toLocaleString("en-BD")}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><TrendingDown className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Material, Labor & Admin</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder={t("coa.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Account Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> {t("coa.type")}
          </span>
          {[
            { key: "ALL", label: t("coa.allHeads") },
            { key: "ASSET", label: t("coa.assets") },
            { key: "LIABILITY", label: t("coa.liabilities") },
            { key: "REVENUE", label: t("coa.revenue") },
            { key: "EXPENSE", label: t("coa.expenses") },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedType(item.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === item.key
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chart of Accounts Tree Table */}
      {chartOfAccountsLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">{t("coa.loading")}</p>
        </div>
      ) : chartOfAccountsError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{chartOfAccountsError}</p>
          <Button
            onClick={() => fetchChartOfAccounts()}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("coa.retry")}
          </Button>
        </div>
      ) : chartOfAccounts.length === 0 ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <FolderOpen className="h-8 w-8 text-[#829B96] mb-3" />
          <p className="text-sm text-[#829B96] mb-3">{t("coa.empty")}</p>
          <Button
            onClick={() => openCreateModal()}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("coa.addFirst")}
          </Button>
        </div>
      ) : (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">{t("coa.accountCode")}</th>
                  <th className="p-3.5">{t("coa.accountName")}</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">{t("coa.category")}</th>
                  <th className="p-3.5 text-right">{t("coa.balance")}</th>
                  <th className="p-3.5 text-center">{t("coa.status")}</th>
                  <th className="p-3.5 text-right">{t("coa.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {renderTree(chartOfAccounts)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Account Head Modal */}
      <AddAccountHeadModal
        isOpen={isAddAccountHeadModalOpen}
        onClose={() => { setIsAddAccountHeadModalOpen(false); setSelectedAccount(null); }}
        parentAccounts={parentAccounts}
        initialAccount={selectedAccount}
        onSave={async (data) => {
          try {
            if (selectedAccount?.code) {
              await updateAccount(selectedAccount.id, data);
            } else {
              await createAccount(data);
            }
            await fetchChartOfAccounts();
            setIsAddAccountHeadModalOpen(false);
            setSelectedAccount(null);
          } catch (error: any) {
            console.error("Failed to create account:", error);
          }
        }}
      />

    </div>
  );
}