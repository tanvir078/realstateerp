import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Search, Filter, Download, ChevronRight,
  FileText, Calendar, Printer, TrendingUp,
  ArrowUpRight, ArrowDownLeft, Wallet, Building2, CheckCircle2,
  Loader2, RefreshCw, AlertCircle
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import { useAccounting } from "@/context/AccountingContext";
import { exportCashFlow } from "@/services/accounting/accounting.service";
import StatementPrintModal from "@/components/forms/StatementPrintModal";

interface CashFlowItem {
  id: string;
  itemName: string;
  category: string;
  currentAmount: number;
  previousAmount: number;
  activityType: "OPERATING" | "INVESTING" | "FINANCING";
}

export default function CashFlowPage() {
  const {
    cashFlow,
    cashFlowLoading,
    cashFlowError,
    fetchCashFlow,
  } = useAccounting();

  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-30");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string>("ALL");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportError, setExportError] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch cash flow on mount or when period changes
  useEffect(() => {
    void fetchCashFlow({ period: 'custom', fromDate, toDate });
  }, [fromDate, toDate]);

  // Use cash flow data from context
  const cashFlowItems = cashFlow?.items || [];

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  const handleExport = async (config: any) => {
    try {
      await exportCashFlow({ period: 'custom', fromDate, toDate });
      setIsExportModalOpen(false);
    } catch (error: any) {
      console.error("Failed to export cash flow:", error);
      setExportError(error.message || "Failed to export cash flow");
    }
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  // Filter logic
  const filteredItems = cashFlowItems.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivity = selectedActivity === "ALL" || item.activityType === selectedActivity;
    
    return matchesSearch && matchesActivity;
  });

  // Calculate net cash flow by activity type
  const operatingCashFlow = filteredItems
    .filter(item => item.activityType === "OPERATING")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const investingCashFlow = filteredItems
    .filter(item => item.activityType === "INVESTING")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const financingCashFlow = filteredItems
    .filter(item => item.activityType === "FINANCING")
    .reduce((sum, item) => sum + item.currentAmount, 0);
  
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

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
          <span className="text-white font-medium">Cash Flow Statement</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Cash Flow Statement</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Statement of cash flows for the period {fromDate} to {toDate}
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

      {/* 2. Cash Flow Summary */}
      <div className={`p-4 rounded-xl border ${
        netCashFlow >= 0 
          ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]" 
          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {netCashFlow >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <ArrowUpRight className="h-5 w-5" />
            )}
            <span className="text-sm font-bold">
              {netCashFlow >= 0 ? "Positive Cash Flow" : "Negative Cash Flow"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Operating: <span className="font-bold">{formatCurrency(operatingCashFlow)}</span></span>
            <span>Investing: <span className="font-bold">{formatCurrency(investingCashFlow)}</span></span>
            <span>Financing: <span className="font-bold">{formatCurrency(financingCashFlow)}</span></span>
            <span>Net: <span className={`font-bold ${netCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(netCashFlow))}
            </span></span>
          </div>
        </div>
      </div>

      {/* 3. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Operating Cash Flow</p>
          <div className="flex items-center justify-between">
            <p className={`text-xl font-bold ${operatingCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(operatingCashFlow))}
            </p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><Wallet className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Business operations</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Investing Cash Flow</p>
          <div className="flex items-center justify-between">
            <p className={`text-xl font-bold ${investingCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(investingCashFlow))}
            </p>
            <span className="p-2 rounded-lg bg-sky-400/10 text-sky-400"><Building2 className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Asset investments</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Financing Cash Flow</p>
          <div className="flex items-center justify-between">
            <p className={`text-xl font-bold ${financingCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(financingCashFlow))}
            </p>
            <span className="p-2 rounded-lg bg-purple-400/10 text-purple-400"><TrendingUp className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px text-[#829B96]">Debt & equity</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Net Cash Flow</p>
          <div className="flex items-center justify-between">
            <p className={`text-xl font-bold ${netCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(netCashFlow))}
            </p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><CheckCircle2 className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px text-[#829B96]">Total position</p>
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

        {/* Activity Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Activity:
          </span>
          {["ALL", "OPERATING", "INVESTING", "FINANCING"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedActivity(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedActivity === type
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {type === "ALL" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Cash Flow Table */}
      {cashFlowLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading cash flow...</p>
        </div>
      ) : cashFlowError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{cashFlowError}</p>
          <Button
            onClick={() => fetchCashFlow({ period: 'custom', fromDate, toDate })}
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
              <h3 className="text-sm font-bold text-white">Cash Flow Details</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Activity Type</th>
                  <th className="p-3.5 text-right">Current Period</th>
                  <th className="p-3.5 text-right">Previous Period</th>
                  <th className="p-3.5 text-right">Change</th>
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
                          item.activityType === "OPERATING"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : item.activityType === "INVESTING"
                            ? "bg-sky-400/10 text-sky-400 border-sky-400/20"
                            : "bg-purple-400/10 text-purple-400 border-purple-400/20"
                        }`}>
                          {item.activityType}
                        </span>
                      </td>
                      <td className={`p-3.5 text-right font-mono ${
                        item.currentAmount >= 0 ? "text-[#10B981]" : "text-rose-400"
                      }`}>
                        {formatCurrency(Math.abs(item.currentAmount))}
                      </td>
                      <td className="p-3.5 text-right font-mono text-[#829B96]">
                        {formatCurrency(Math.abs(item.previousAmount))}
                      </td>
                      <td className="p-3.5 text-right font-mono">
                        <span className={
                          (item.currentAmount - item.previousAmount) > 0 ? "text-[#10B981]" : 
                          (item.currentAmount - item.previousAmount) < 0 ? "text-rose-400" : "text-white"
                        }>
                          {formatCurrency(Math.abs(item.currentAmount - item.previousAmount))}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#829B96] text-xs">
                      No items found matching your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Cash Flow Summary by Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-white">Operating Activities</h3>
          </div>
          <div className="space-y-2">
            {filteredItems.filter(item => item.activityType === "OPERATING").map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="text-[#829B96]">{item.itemName}</span>
                <span className={`font-mono ${item.currentAmount >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
                  {formatCurrency(Math.abs(item.currentAmount))}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[#1E3E37]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Net Operating</span>
              <span className={`text-sm font-bold font-mono ${operatingCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
                {formatCurrency(Math.abs(operatingCashFlow))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Investing Activities</h3>
          </div>
          <div className="space-y-2">
            {filteredItems.filter(item => item.activityType === "INVESTING").map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="text-[#829B96]">{item.itemName}</span>
                <span className={`font-mono ${item.currentAmount >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
                  {formatCurrency(Math.abs(item.currentAmount))}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[#1E3E37]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Net Investing</span>
              <span className={`text-sm font-bold font-mono ${investingCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
                {formatCurrency(Math.abs(investingCashFlow))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Financing Activities</h3>
          </div>
          <div className="space-y-2">
            {filteredItems.filter(item => item.activityType === "FINANCING").map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="text-[#829B96]">{item.itemName}</span>
                <span className={`font-mono ${item.currentAmount >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
                  {formatCurrency(Math.abs(item.currentAmount))}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[#1E3E37]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Net Financing</span>
              <span className={`text-sm font-bold font-mono ${financingCashFlow >= 0 ? "text-[#10B981]" : "text-rose-400"}`}>
                {formatCurrency(Math.abs(financingCashFlow))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Item Name", "Category", "Activity Type", "Current Period", "Previous Period", "Change"]}
        defaultColumns={["Item Name", "Category", "Activity Type", "Current Period", "Change"]}
        title="Export Cash Flow Statement"
      />
      <StatementPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Cash Flow Statement"
        subtitle={`${fromDate} to ${toDate}`}
      >
        <table className="w-full border-collapse text-xs">
          <thead><tr className="border-b-2 border-gray-300 text-left"><th className="p-2">Item</th><th className="p-2">Category</th><th className="p-2">Activity</th><th className="p-2 text-right">Current</th><th className="p-2 text-right">Previous</th></tr></thead>
          <tbody>{filteredItems.map((item) => <tr key={item.id} className="border-b border-gray-200"><td className="p-2">{item.itemName}</td><td className="p-2">{item.category}</td><td className="p-2">{item.activityType}</td><td className="p-2 text-right">{formatCurrency(item.currentAmount)}</td><td className="p-2 text-right">{formatCurrency(item.previousAmount)}</td></tr>)}</tbody>
        </table>
      </StatementPrintModal>

    </div>
  );
}
