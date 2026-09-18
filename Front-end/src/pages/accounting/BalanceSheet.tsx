import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Search, Filter, Download, ChevronRight,
  FileText, Calendar, Printer, CheckCircle2, AlertCircle,
  Building2, DollarSign, Wallet, TrendingUp,
  Loader2, RefreshCw
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import { useAccounting } from "@/context/AccountingContext";
import { exportBalanceSheet } from "@/services/accounting/accounting.service";
import StatementPrintModal from "@/components/forms/StatementPrintModal";

interface BalanceSheetItem {
  id: string;
  itemName: string;
  category: string;
  currentAmount: number;
  previousAmount: number;
  categoryType: "ASSET" | "LIABILITY" | "EQUITY";
}

export default function BalanceSheetPage() {
  const {
    balanceSheet,
    balanceSheetLoading,
    balanceSheetError,
    fetchBalanceSheet,
  } = useAccounting();

  const [asOfDate, setAsOfDate] = useState("2026-09-30");
  const [previousDate, setPreviousDate] = useState("2026-08-31");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportError, setExportError] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch balance sheet on mount or when date changes
  useEffect(() => {
    fetchBalanceSheet({ asOfDate });
  }, [asOfDate]);

  // Use balance sheet data from context
  const balanceSheetItems = balanceSheet?.items || [];

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  const handleExport = async (config: any) => {
    try {
      await exportBalanceSheet({ asOfDate });
      setIsExportModalOpen(false);
    } catch (error: any) {
      console.error("Failed to export balance sheet:", error);
      setExportError(error.message || "Failed to export balance sheet");
    }
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  // Filter logic
  const filteredItems = balanceSheetItems.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "ALL" || item.categoryType === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate totals by category type
  const totalAssets = filteredItems
    .filter(item => item.categoryType === "ASSET")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const totalLiabilities = filteredItems
    .filter(item => item.categoryType === "LIABILITY")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const totalEquity = filteredItems
    .filter(item => item.categoryType === "EQUITY")
    .reduce((sum, item) => sum + item.currentAmount, 0);

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const isBalanced = totalAssets === totalLiabilitiesAndEquity;

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {exportError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{exportError}</p>}
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Accounting & Finance</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Balance Sheet</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Balance Sheet</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Statement of financial position as of {asOfDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={handlePrint}
            >
              <Printer className="h-3.5 w-3.5 text-[#10B981]" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Balance Status */}
      <div className={`p-4 rounded-xl border ${
        isBalanced 
          ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]" 
          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-bold">
              {isBalanced ? "Balance Sheet is Balanced" : "Balance Sheet is NOT Balanced"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Assets: <span className="font-bold">{formatCurrency(totalAssets)}</span></span>
            <span>Liabilities + Equity: <span className="font-bold">{formatCurrency(totalLiabilitiesAndEquity)}</span></span>
            <span>Difference: <span className={`font-bold ${isBalanced ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(totalAssets - totalLiabilitiesAndEquity))}
            </span></span>
          </div>
        </div>
      </div>

      {/* 3. Date Range & Filter Bar */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-[#829B96]" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#829B96]">As of:</span>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#829B96]">Previous:</span>
              <input
                type="date"
                value={previousDate}
                onChange={(e) => setPreviousDate(e.target.value)}
                className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search item or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Category Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Section:
          </span>
          {["ALL", "ASSET", "LIABILITY", "EQUITY"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedCategory(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === type
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {type === "ALL" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Balance Sheet Table */}
      {balanceSheetLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading balance sheet...</p>
        </div>
      ) : balanceSheetError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{balanceSheetError}</p>
          <Button
            onClick={() => fetchBalanceSheet({ asOfDate })}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Assets Section */}
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1E3E37] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Assets</h3>
          </div>
          <div className="divide-y divide-[#1E3E37]">
            {filteredItems.filter(item => item.categoryType === "ASSET").map((item) => (
              <div key={item.id} className="p-3 hover:bg-[#1A3530]/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#829B96]">{item.category}</span>
                  <span className="text-[10px] text-amber-400">
                    {item.currentAmount > item.previousAmount ? "+" : ""}
                    {formatCurrency(Math.abs(item.currentAmount - item.previousAmount))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{item.itemName}</span>
                  <span className="text-sm font-mono text-white">{formatCurrency(item.currentAmount)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-[#0B1816]/50 border-t border-[#1E3E37]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">TOTAL ASSETS</span>
              <span className="text-sm font-bold text-white font-mono">{formatCurrency(totalAssets)}</span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity Section */}
        <div className="space-y-4">
          {/* Liabilities */}
          <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#1E3E37] flex items-center gap-2">
              <Wallet className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Liabilities</h3>
            </div>
            <div className="divide-y divide-[#1E3E37]">
              {filteredItems.filter(item => item.categoryType === "LIABILITY").map((item) => (
                <div key={item.id} className="p-3 hover:bg-[#1A3530]/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#829B96]">{item.category}</span>
                    <span className="text-[10px] text-amber-400">
                      {item.currentAmount > item.previousAmount ? "+" : ""}
                      {formatCurrency(Math.abs(item.currentAmount - item.previousAmount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{item.itemName}</span>
                    <span className="text-sm font-mono text-white">{formatCurrency(item.currentAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[#0B1816]/50 border-t border-[#1E3E37]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">TOTAL LIABILITIES</span>
                <span className="text-sm font-bold text-white font-mono">{formatCurrency(totalLiabilities)}</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#1E3E37] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Equity</h3>
            </div>
            <div className="divide-y divide-[#1E3E37]">
              {filteredItems.filter(item => item.categoryType === "EQUITY").map((item) => (
                <div key={item.id} className="p-3 hover:bg-[#1A3530]/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#829B96]">{item.category}</span>
                    <span className="text-[10px text-[#10B981]">
                      {item.currentAmount > item.previousAmount ? "+" : ""}
                      {formatCurrency(Math.abs(item.currentAmount - item.previousAmount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{item.itemName}</span>
                    <span className="text-sm font-mono text-white">{formatCurrency(item.currentAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[#0B1816]/50 border-t border-[#1E3E37]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">TOTAL EQUITY</span>
                <span className="text-sm font-bold text-white font-mono">{formatCurrency(totalEquity)}</span>
              </div>
            </div>
          </div>

          {/* Total Liabilities + Equity */}
          <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">TOTAL LIABILITIES + EQUITY</span>
              <span className="text-sm font-bold text-white font-mono">{formatCurrency(totalLiabilitiesAndEquity)}</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 5. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Assets</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-sky-400">{formatCurrency(totalAssets)}</p>
            <span className="p-2 rounded-lg bg-sky-400/10 text-sky-400"><Building2 className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Net worth</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-winger">Working Capital</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{formatCurrency(totalAssets - totalLiabilities)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><DollarSign className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Current assets - Current liabilities</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Debt Ratio</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">
              {((totalLiabilities / totalAssets) * 100).toFixed(1)}%
            </p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><AlertCircle className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px text-[#829B96]">Liabilities / Assets</p>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Item Name", "Category", "Current Amount", "Previous Amount", "Change"]}
        defaultColumns={["Item Name", "Category", "Current Amount", "Previous Amount", "Change"]}
        title="Export Balance Sheet"
      />
      <StatementPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Balance Sheet"
        subtitle={`As of ${asOfDate}`}
      >
        <table className="w-full border-collapse text-xs">
          <thead><tr className="border-b-2 border-gray-300 text-left"><th className="p-2">Item</th><th className="p-2">Category</th><th className="p-2 text-right">Current</th><th className="p-2 text-right">Previous</th></tr></thead>
          <tbody>{filteredItems.map((item) => <tr key={item.id} className="border-b border-gray-200"><td className="p-2">{item.itemName}</td><td className="p-2">{item.category}</td><td className="p-2 text-right">{formatCurrency(item.currentAmount)}</td><td className="p-2 text-right">{formatCurrency(item.previousAmount)}</td></tr>)}</tbody>
        </table>
      </StatementPrintModal>

    </div>
  );
}
