import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Search, Filter, Download, ChevronRight,
  FileText, Calendar, Printer, TrendingUp, ArrowUpRight, ArrowDownLeft,
  DollarSign, CheckCircle2, AlertCircle,
  Loader2, RefreshCw
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import { useAccounting } from "@/context/AccountingContext";
import { exportProfitLoss } from "@/services/accounting/accounting.service";
import StatementPrintModal from "@/components/forms/StatementPrintModal";

interface PnLItem {
  id: string;
  itemName: string;
  category: string;
  currentAmount: number;
  previousAmount: number;
  budgetAmount: number;
  categoryType: "INCOME" | "EXPENSE";
}

export default function ProfitLossPage() {
  const {
    profitLoss,
    profitLossLoading,
    profitLossError,
    fetchProfitLoss,
  } = useAccounting();

  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-30");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportError, setExportError] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch profit loss on mount or when period changes
  useEffect(() => {
    fetchProfitLoss({ period: 'custom', fromDate, toDate });
  }, [fromDate, toDate]);

  // Use profit loss data from context
  const pnlItems = profitLoss?.items || [];

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  const handleExport = async (config: any) => {
    try {
      await exportProfitLoss({ period: 'custom', fromDate, toDate });
      setIsExportModalOpen(false);
    } catch (error: any) {
      console.error("Failed to export profit loss:", error);
      setExportError(error.message || "Failed to export profit loss");
    }
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  // Filter logic
  const filteredItems = pnlItems.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "ALL" || item.categoryType === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totalIncome = filteredItems
    .filter(item => item.categoryType === "INCOME")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const totalExpense = filteredItems
    .filter(item => item.categoryType === "EXPENSE")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const grossProfit = totalIncome - filteredItems
    .filter(item => item.categoryType === "EXPENSE" && 
             (item.category === "Direct Expenses" || item.category === "Operating Expenses"))
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const netProfit = totalIncome - totalExpense;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

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
          <span className="text-white font-medium">Profit & Loss Statement</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Profit & Loss Statement</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Statement of comprehensive income and expenses for the period {fromDate} to {toDate}
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

      {/* 2. Profit Summary */}
      <div className={`p-4 rounded-xl border ${
        netProfit >= 0 
          ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]" 
          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {netProfit >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-bold">
              {netProfit >= 0 ? "Net Profit Generated" : "Net Loss Incurred"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Total Income: <span className="font-bold text-[#10B981]">{formatCurrency(totalIncome)}</span></span>
            <span>Total Expense: <span className="font-bold text-rose-400">{formatCurrency(totalExpense)}</span></span>
            <span>Net: <span className={`font-bold ${netProfit >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(netProfit))}
            </span></span>
          </div>
        </div>
      </div>

      {/* 3. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Income</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#10B981]">{formatCurrency(totalIncome)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><ArrowDownLeft className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Revenue and other income</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Expense</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-rose-400">{formatCurrency(totalExpense)}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><ArrowUpRight className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-rose-400/90">All operational costs</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Gross Profit</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{formatCurrency(grossProfit)}</p>
            <span className="p-2 rounded-lg bg-sky-400/10 text-sky-400"><DollarSign className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px text-[#829B96]">Before operating expenses</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Profit Margin</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{profitMargin}%</p>
            <span className="p-2 rounded-lg bg-purple-400/10 text-purple-400"><TrendingUp className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px text-[#829B96]">Net profit / Total income</p>
        </div>
      </div>

      {/* 4. Date Range & Filter Bar */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-[#829B96]" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#829B96]">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px text-[#829B96]">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
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

        {/* Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {["ALL", "INCOME", "EXPENSE"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === type
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {type === "ALL" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      {/* 5. P&L Table */}
      {profitLossLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading profit & loss...</p>
        </div>
      ) : profitLossError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{profitLossError}</p>
          <Button
            onClick={() => fetchProfitLoss({ period: 'custom', fromDate, toDate })}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1E3E37]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-white">Income & Expense Details</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 text-right">Current</th>
                  <th className="p-3.5 text-right">Previous</th>
                  <th className="p-3.5 text-right">Budget</th>
                  <th className="p-3.5 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      <td className="p-3.5 text-white">{item.itemName}</td>
                      <td className="p-3.5 text-[#829B96]">{item.category}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                          item.categoryType === "INCOME"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {item.categoryType}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-white">{formatCurrency(item.currentAmount)}</td>
                      <td className="p-3.5 text-right font-mono text-[#829B96]">{formatCurrency(item.previousAmount)}</td>
                      <td className="p-3.5 text-right font-mono text-white">{formatCurrency(item.budgetAmount)}</td>
                      <td className="p-3.5 text-right font-mono">
                        <span className={
                          item.currentAmount > item.budgetAmount ? "text-rose-400" : 
                          item.currentAmount < item.budgetAmount ? "text-[#10B981]" : "text-white"
                        }>
                          {formatCurrency(item.currentAmount - item.budgetAmount)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                      No items found matching your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-[#0B1816]/80 border-t border-[#1E3E37]">
                <tr>
                  <td colSpan={3} className="p-3.5 text-right font-bold text-white">TOTAL</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(totalIncome + totalExpense)}</td>
                  <td className="p-3.5 text-right font-mono text-[#829B96]">{formatCurrency(
                    filteredItems.reduce((sum, item) => sum + item.previousAmount, 0)
                  )}</td>
                  <td className="p-3.5 text-right font-mono text-white">{formatCurrency(
                    filteredItems.reduce((sum, item) => sum + item.budgetAmount, 0)
                  )}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(
                    (totalIncome + totalExpense) - filteredItems.reduce((sum, item) => sum + item.budgetAmount, 0)
                  )}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 6. Budget vs Actual Analysis */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white">Budget vs Actual Analysis</h3>
          <p className="text-xs text-[#829B96]">Period comparison with budget targets</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3">
            <p className="text-[10px] text-[#829B96] font-medium uppercase">Total Budget</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(filteredItems.reduce((sum, item) => sum + item.budgetAmount, 0))}
            </p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3">
            <p className="text-[10px] text-[#829B96] font-medium uppercase">Actual Spent</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(totalIncome + totalExpense)}
            </p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3">
            <p className="text-[10px] text-[#829B96] font-medium uppercase">Variance</p>
            <p className={`text-lg font-bold ${
              (totalIncome + totalExpense) > filteredItems.reduce((sum, item) => sum + item.budgetAmount, 0)
                ? "text-rose-400"
                : "text-[#10B981]"
            }`}>
              {formatCurrency(Math.abs((totalIncome + totalExpense) - filteredItems.reduce((sum, item) => sum + item.budgetAmount, 0)))}
            </p>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Item Name", "Category", "Type", "Current Amount", "Previous Amount", "Budget", "Variance"]}
        defaultColumns={["Item Name", "Category", "Type", "Current Amount", "Budget", "Variance"]}
        title="Export P&L Statement"
      />
      <StatementPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Profit & Loss Statement"
        subtitle={`${fromDate} to ${toDate}`}
      >
        <table className="w-full border-collapse text-xs">
          <thead><tr className="border-b-2 border-gray-300 text-left"><th className="p-2">Item</th><th className="p-2">Category</th><th className="p-2">Type</th><th className="p-2 text-right">Current</th><th className="p-2 text-right">Previous</th></tr></thead>
          <tbody>{filteredItems.map((item) => <tr key={item.id} className="border-b border-gray-200"><td className="p-2">{item.itemName}</td><td className="p-2">{item.category}</td><td className="p-2">{item.categoryType}</td><td className="p-2 text-right">{formatCurrency(item.currentAmount)}</td><td className="p-2 text-right">{formatCurrency(item.previousAmount)}</td></tr>)}</tbody>
        </table>
      </StatementPrintModal>

    </div>
  );
}
