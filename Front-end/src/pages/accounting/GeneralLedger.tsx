import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Search, Filter, Download, ChevronRight,
  BookOpen, Calendar, Printer, FileText,
  ArrowUpRight, ArrowDownLeft, Scale, Building2,
  Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { useAccounting } from "@/context/AccountingContext";
import { getProjects } from "@/services/projects.service";
import StatementPrintModal from "@/components/forms/StatementPrintModal";

interface LedgerEntry {
  id: string;
  date: string;
  voucherNo: string;
  voucherType: "DEBIT" | "CREDIT" | "JOURNAL" | "CONTRA";
  particulars: string;
  debit: number;
  credit: number;
  runningBalance: number;
  projectId?: string | null;
  projectName?: string | null;
}

export default function GeneralLedgerPage() {
  const {
    generalLedger,
    generalLedgerLoading,
    generalLedgerError,
    fetchGeneralLedger,
    chartOfAccounts,
    fetchChartOfAccounts,
  } = useAccounting();

  const [selectedAccount, setSelectedAccount] = useState("");
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-30");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Array<{ id: string; projectName: string }>>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const flattenAccounts = (accounts: any[]): any[] =>
    accounts.flatMap((account) => [account, ...flattenAccounts(account.children ?? [])]);

  // Opening Balance for selected account
  const openingBalance = Number(generalLedger[0]?.openingBalance ?? 0);
  const normalBalance = generalLedger[0]?.normalBalance ?? "DEBIT";
  const openingDateLabel = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fromDate}T00:00:00`));

  // Fetch ledger on mount or when filters change
  useEffect(() => {
    void fetchChartOfAccounts();
    void getProjects().then(setProjects);
    // The accounting context exposes action functions without stable identities.
    // Loading the account tree should happen once when the page mounts.
  }, []);

  useEffect(() => {
    const postableAccounts = flattenAccounts(chartOfAccounts).filter((account: any) => account.isPostable);
    if (!selectedAccount && postableAccounts[0]?.code) {
      setSelectedAccount(postableAccounts[0].code);
    }
  }, [chartOfAccounts, selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      void fetchGeneralLedger({ account: selectedAccount, fromDate, toDate, ...(selectedProject ? { projectId: selectedProject } : {}) });
    }
  }, [selectedAccount, fromDate, toDate, selectedProject]);

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  // Calculate Totals
  const totalDebit = generalLedger.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredit = generalLedger.reduce((sum, item) => sum + (item.credit || 0), 0);
  const closingBalance = normalBalance === "DEBIT"
    ? openingBalance + totalDebit - totalCredit
    : openingBalance + totalCredit - totalDebit;

  // Filtered Entries
  const filteredEntries = generalLedger.filter(
    (item) =>
      item.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.particulars?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Accounting & Finance</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">General Ledger</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">General Ledger Statement</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              View debit/credit transaction history, voucher logs, and running balance for account heads
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPrintModalOpen(true)} className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5">
              <Printer className="h-3.5 w-3.5 text-[#10B981]" />
              Print Ledger
            </Button>
            <Button size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export Statement
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Account Head & Date Range Selector */}
      <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Account Selector */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs text-[#829B96] font-medium">Select Account Head</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
          >
            {flattenAccounts(chartOfAccounts).filter((account: any) => account.isPostable).map((account: any) => (
              <option key={account.id} value={account.code}>{account.code} - {account.name}</option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div className="space-y-1">
          <label className="text-xs text-[#829B96] font-medium">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs text-[#829B96] font-medium">Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.projectName}</option>
            ))}
          </select>
        </div>

        {/* To Date */}
        <div className="space-y-1">
          <label className="text-xs text-[#829B96] font-medium">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 3. Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Opening Balance</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{formatCurrency(openingBalance)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><BookOpen className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Opening balance as of {openingDateLabel}</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Debit (Outflow)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-rose-400">{formatCurrency(totalDebit)}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><ArrowUpRight className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">{filteredEntries.filter(e => e.debit > 0).length} Debit transactions</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Credit (Inflow)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#10B981]">{formatCurrency(totalCredit)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><ArrowDownLeft className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#10B981]">{filteredEntries.filter(e => e.credit > 0).length} Credit transactions</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Closing Balance</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(closingBalance)}</p>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Scale className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-emerald-400/90">Net balance available</p>
        </div>
      </div>

      {/* 4. Search Filter */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search voucher or transaction details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>
        <p className="text-xs text-[#829B96] hidden sm:block">
          Showing {filteredEntries.length} statement entries
        </p>
      </div>

      {/* 5. General Ledger Table */}
      {generalLedgerLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading general ledger...</p>
        </div>
      ) : generalLedgerError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{generalLedgerError}</p>
          <Button
            onClick={() => fetchGeneralLedger({ account: selectedAccount, fromDate, toDate })}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Voucher No</th>
                  <th className="p-3.5">Project</th>
                  <th className="p-3.5">Particulars / Description</th>
                  <th className="p-3.5 text-right">Debit (৳)</th>
                  <th className="p-3.5 text-right">Credit (৳)</th>
                  <th className="p-3.5 text-right">Running Balance (৳)</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {/* Opening Balance Row */}
                <tr className="bg-[#0B1816]/40 font-semibold text-white">
                  <td className="p-3.5 font-mono text-[#829B96]">{openingDateLabel}</td>
                  <td className="p-3.5 font-mono text-[#829B96]">-</td>
                  <td className="p-3.5 text-[#829B96]">-</td>
                  <td className="p-3.5 text-amber-400 font-bold">Opening Balance Carried Forward</td>
                  <td className="p-3.5 text-right text-[#829B96]">-</td>
                  <td className="p-3.5 text-right text-[#829B96]">-</td>
                  <td className="p-3.5 text-right text-white font-mono">{formatCurrency(openingBalance)}</td>
                  <td className="p-3.5 text-center text-[#829B96]">-</td>
                </tr>

                {/* Entries */}
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      <td className="p-3.5 font-mono text-[#829B96]">{item.date}</td>
                      <td className="p-3.5 font-mono text-[#10B981] font-semibold">{item.voucherNo}</td>
                      <td className="p-3.5 text-[#B8D8CE]">
                        {item.projectName ?? projects.find((project) => project.id === item.projectId)?.projectName ?? (item.projectId ? "Project unavailable" : "General / Unassigned")}
                      </td>
                      <td className="p-3.5 text-white font-medium max-w-sm">{item.particulars}</td>
                      <td className="p-3.5 text-right font-semibold text-rose-400 font-mono">
                        {item.debit > 0 ? formatCurrency(item.debit) : "-"}
                      </td>
                      <td className="p-3.5 text-right font-semibold text-[#10B981] font-mono">
                        {item.credit > 0 ? formatCurrency(item.credit) : "-"}
                      </td>
                      <td className="p-3.5 text-right font-bold text-white font-mono">
                        {formatCurrency(item.runningBalance)}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          title="View Voucher"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                      No ledger entries found for the selected account and date range.
                    </td>
                  </tr>
                )}

                {/* Summary Total Row */}
                <tr className="bg-[#0B1816] font-bold text-white border-t-2 border-[#1E3E37]">
                  <td colSpan={3} className="p-3.5 text-right uppercase tracking-wider text-[#829B96]">Total Transaction Period:</td>
                  <td className="p-3.5 text-right text-rose-400 font-mono text-sm">{formatCurrency(totalDebit)}</td>
                  <td className="p-3.5 text-right text-[#10B981] font-mono text-sm">{formatCurrency(totalCredit)}</td>
                  <td className="p-3.5 text-right text-emerald-400 font-mono text-sm">{formatCurrency(closingBalance)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <StatementPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="General Ledger Statement"
        subtitle={`${selectedAccount || "Account"} | ${fromDate} to ${toDate}`}
      >
        <div className="mb-4 grid grid-cols-3 gap-3 text-xs">
          <div className="rounded border border-gray-200 p-3"><span className="text-gray-500">Opening</span><strong className="mt-1 block">{formatCurrency(openingBalance)}</strong></div>
          <div className="rounded border border-gray-200 p-3"><span className="text-gray-500">Total Debit</span><strong className="mt-1 block">{formatCurrency(totalDebit)}</strong></div>
          <div className="rounded border border-gray-200 p-3"><span className="text-gray-500">Total Credit</span><strong className="mt-1 block">{formatCurrency(totalCredit)}</strong></div>
        </div>
        <table className="w-full border-collapse text-xs">
          <thead><tr className="border-b-2 border-gray-300 text-left"><th className="p-2">Date</th><th className="p-2">Voucher</th><th className="p-2">Project</th><th className="p-2">Particulars</th><th className="p-2 text-right">Debit</th><th className="p-2 text-right">Credit</th><th className="p-2 text-right">Balance</th></tr></thead>
          <tbody>
            {filteredEntries.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-2">{item.date}</td><td className="p-2">{item.voucherNo}</td>
                <td className="p-2">{item.projectName ?? projects.find((project) => project.id === item.projectId)?.projectName ?? (item.projectId ? "Project unavailable" : "General / Unassigned")}</td>
                <td className="p-2">{item.particulars}</td><td className="p-2 text-right">{item.debit ? formatCurrency(item.debit) : "-"}</td><td className="p-2 text-right">{item.credit ? formatCurrency(item.credit) : "-"}</td><td className="p-2 text-right">{formatCurrency(item.runningBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StatementPrintModal>
    </div>
  );
}