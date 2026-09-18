import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Search, Filter, Download, ChevronRight,
  Scale, Calendar, Printer, CheckCircle2, AlertCircle,
  Loader2, RefreshCw
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import { useAccounting } from "@/context/AccountingContext";
import { exportTrialBalance } from "@/services/accounting/accounting.service";
import StatementPrintModal from "@/components/forms/StatementPrintModal";

interface GLAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
  debitBalance: number;
  creditBalance: number;
}

export default function TrialBalancePage() {
  const {
    trialBalance,
    trialBalanceLoading,
    trialBalanceError,
    fetchTrialBalance,
  } = useAccounting();

  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-30");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportError, setExportError] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch trial balance on mount or when date range changes
  useEffect(() => {
    fetchTrialBalance({ fromDate, toDate });
  }, [fromDate, toDate]);

  // Use trial balance data from context
  const glAccounts = trialBalance?.accounts || [];

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  const handleExport = async (config: any) => {
    try {
      await exportTrialBalance({ fromDate, toDate });
      setIsExportModalOpen(false);
    } catch (error: any) {
      console.error("Failed to export trial balance:", error);
      setExportError(error.message || "Failed to export trial balance");
    }
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  // Filter logic
  const filteredAccounts = glAccounts.filter((account) => {
    const matchesSearch = 
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "ALL" || account.accountType === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totalDebit = filteredAccounts.reduce((sum, account) => sum + account.debitBalance, 0);
  const totalCredit = filteredAccounts.reduce((sum, account) => sum + account.creditBalance, 0);
  const isBalanced = totalDebit === totalCredit;

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
          <span className="text-white font-medium">Trial Balance</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Trial Balance</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              General ledger account balances as of {toDate}
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
              {isBalanced ? "Trial Balance is Balanced" : "Trial Balance is NOT Balanced"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Total Debit: <span className="font-bold">{formatCurrency(totalDebit)}</span></span>
            <span>Total Credit: <span className="font-bold">{formatCurrency(totalCredit)}</span></span>
            <span>Difference: <span className={`font-bold ${isBalanced ? "text-[#10B981]" : "text-rose-400"}`}>
              {formatCurrency(Math.abs(totalDebit - totalCredit))}
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
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
            />
            <span className="text-[#829B96] text-xs">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search account code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Account Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {["ALL", "ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"].map((type) => (
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

      {/* 4. Trial Balance Table */}
      {trialBalanceLoading && !trialBalance ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading trial balance...</p>
        </div>
      ) : trialBalanceError && !trialBalance ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{trialBalanceError}</p>
          <Button
            onClick={() => fetchTrialBalance({ fromDate, toDate })}
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
              <Scale className="h-4 w-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-white">Account Balances</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">Account Code</th>
                  <th className="p-3.5">Account Name</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 text-right">Debit Balance</th>
                  <th className="p-3.5 text-right">Credit Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      <td className="p-3.5 font-mono text-[#10B981] font-medium">{account.accountCode}</td>
                      <td className="p-3.5 text-white">{account.accountName}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                          account.accountType === "ASSET"
                            ? "bg-sky-400/10 text-sky-400 border-sky-400/20"
                            : account.accountType === "LIABILITY"
                            ? "bg-rose-400/10 text-rose-400 border-rose-400/20"
                            : account.accountType === "EQUITY"
                            ? "bg-purple-400/10 text-purple-400 border-purple-400/20"
                            : account.accountType === "INCOME"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                        }`}>
                          {account.accountType}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-white">
                        {account.debitBalance > 0 ? formatCurrency(account.debitBalance) : "-"}
                      </td>
                      <td className="p-3.5 text-right font-mono text-white">
                        {account.creditBalance > 0 ? formatCurrency(account.creditBalance) : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#829B96] text-xs">
                      No accounts found matching your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-[#0B1816]/80 border-t border-[#1E3E37]">
                <tr>
                  <td colSpan={3} className="p-3.5 text-right font-bold text-white">TOTAL</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(totalDebit)}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(totalCredit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 5. Summary by Account Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"].map((type) => {
          const typeAccounts = filteredAccounts.filter(a => a.accountType === type);
          const typeDebit = typeAccounts.reduce((sum, a) => sum + a.debitBalance, 0);
          const typeCredit = typeAccounts.reduce((sum, a) => sum + a.creditBalance, 0);
          const netBalance = typeDebit - typeCredit;
          
          return (
            <div key={type} className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
              <p className="text-[10px] text-[#829B96] font-medium uppercase tracking-wider">{type}</p>
              <p className={`text-lg font-bold ${
                netBalance >= 0 ? "text-white" : "text-rose-400"
              }`}>
                {formatCurrency(Math.abs(netBalance))}
              </p>
              <p className="text-[11px] text-[#829B96]">
                {netBalance >= 0 ? "Net Debit" : "Net Credit"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Account Code", "Account Name", "Type", "Debit Balance", "Credit Balance"]}
        defaultColumns={["Account Code", "Account Name", "Type", "Debit Balance", "Credit Balance"]}
        title="Export Trial Balance"
      />
      <StatementPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Trial Balance"
        subtitle={`${fromDate} to ${toDate}`}
      >
        <table className="w-full border-collapse text-xs">
          <thead><tr className="border-b-2 border-gray-300 text-left"><th className="p-2">Code</th><th className="p-2">Account</th><th className="p-2">Type</th><th className="p-2 text-right">Debit</th><th className="p-2 text-right">Credit</th></tr></thead>
          <tbody>{filteredAccounts.map((account) => <tr key={account.id} className="border-b border-gray-200"><td className="p-2">{account.accountCode}</td><td className="p-2">{account.accountName}</td><td className="p-2">{account.accountType}</td><td className="p-2 text-right">{formatCurrency(account.debitBalance)}</td><td className="p-2 text-right">{formatCurrency(account.creditBalance)}</td></tr>)}</tbody>
        </table>
      </StatementPrintModal>

    </div>
  );
}
