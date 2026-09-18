import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Search, Download, ChevronRight, Upload,
  CheckCircle2, AlertCircle, RefreshCw, ArrowUpRight,
  ArrowDownLeft, Building2, Calendar, FileCheck, HelpCircle,
  Loader2
} from "lucide-react";
import UploadStatementModal from "@/components/forms/UploadStatementModal";
import AutoMatchModal from "@/components/forms/AutoMatchModal";
import ManualMatchModal from "@/components/forms/ManualMatchModal";
import ConfirmDialog from "@/components/forms/ConfirmDialog";
import { useAccounting } from "@/context/AccountingContext";
import { createReconciliation, getCashBankTransactions, matchTransaction, unmatchTransaction } from "@/services/accounting/accounting.service";
import * as XLSX from "xlsx";

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  chequeOrRef: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  matchedVoucherNo?: string;
  status: "MATCHED" | "UNMATCHED" | "PENDING";
}

export default function BankReconciliationPage() {
  const {
    bankReconciliations,
    bankReconciliationLoading,
    bankReconciliationError,
    fetchBankReconciliations,
    cashBankAccounts,
    vouchers,
    fetchCashBankAccounts,
  } = useAccounting();

  const [selectedAccount, setSelectedAccount] = useState("1100");
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [activeTab, setActiveTab] = useState<"ALL" | "UNMATCHED" | "MATCHED">("UNMATCHED");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAutoMatchModalOpen, setIsAutoMatchModalOpen] = useState(false);
  const [isManualMatchModalOpen, setIsManualMatchModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
  const [isUnmatchDialogOpen, setIsUnmatchDialogOpen] = useState(false);
  const [selectedForUnmatch, setSelectedForUnmatch] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [bookTransactions, setBookTransactions] = useState<any[]>([]);

  // Fetch bank reconciliations on mount
  useEffect(() => {
    void fetchCashBankAccounts();
    fetchBankReconciliations({ account: selectedAccount, month: selectedMonth });
    const monthStart = `${selectedMonth}-01`;
    const monthEnd = new Date(Number(selectedMonth.slice(0, 4)), Number(selectedMonth.slice(5, 7)), 0)
      .toISOString()
      .slice(0, 10);
    void getCashBankTransactions({ account: selectedAccount, fromDate: monthStart, toDate: monthEnd })
      .then(setBookTransactions)
      .catch((error: any) => setActionError(error.message || "Failed to load ERP book transactions"));
  }, [selectedAccount, selectedMonth]);

  const transactions = bankReconciliations as any[] || [];

  const formatCurrency = (amt: number) => "৳ " + amt.toLocaleString("en-BD");

  const bankAccounts = cashBankAccounts.filter((account) => account.type === "BANK");
  const availableVouchers = vouchers.map((voucher: any) => ({
    id: voucher.id,
    voucherNo: voucher.voucherNo,
    date: voucher.entryDate,
    particulars: voucher.particulars,
    amount: Number(voucher.amount),
  }));

  // Handlers
  const handleUploadStatement = async (data: any) => {
    setActionError("");
    try {
      const workbook = XLSX.read(await data.file.arrayBuffer(), { type: "array", cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!firstSheet) throw new Error("The statement file does not contain a worksheet");

      const rows = XLSX.utils.sheet_to_json<(string | number | Date)[]>(firstSheet, {
        header: 1,
        raw: false,
        defval: "",
      })
        .slice(data.skipHeaderRows)
        .map((values) => {
          const [date, description, reference, type, amount] = values.map((value) => String(value).trim());
          const normalizedType = type.toUpperCase();
          return {
            date,
            description,
            reference,
            type: ["WITHDRAWAL", "DEBIT", "DR", "WITHDRAW"].includes(normalizedType) ? "WITHDRAWAL" : "DEPOSIT",
            amount: Math.abs(Number(amount.replace(/,/g, ""))),
          };
        })
        .filter((row) => row.date && row.description && Number.isFinite(row.amount) && row.amount > 0);

      await createReconciliation({ bankAccountId: data.bankAccountId, transactions: rows });
      await fetchBankReconciliations({ account: selectedAccount, month: selectedMonth });
      setIsUploadModalOpen(false);
    } catch (error: any) {
      setActionError(error.message || "Failed to upload statement");
    }
  };

  const handleAutoMatch = async (config: any) => {
    setActionError("");
    try {
      const candidates = transactions.filter((item) => item.status !== "MATCHED");
      for (const item of candidates) {
        const voucher = availableVouchers.find((entry) => Math.abs(entry.amount - item.amount) <= config.amountTolerance);
        if (voucher) await matchTransaction(item.id, item.id, voucher.voucherNo);
      }
      await fetchBankReconciliations({ account: selectedAccount, month: selectedMonth });
      setIsAutoMatchModalOpen(false);
    } catch (error: any) {
      setActionError(error.message || "Failed to auto-match");
    }
  };

  const handleManualMatch = async (data: any) => {
    setActionError("");
    try {
      const voucher = availableVouchers.find((entry) => entry.id === data.voucherId);
      await matchTransaction(data.bankEntryId, data.bankEntryId, voucher?.voucherNo);
      await fetchBankReconciliations({ account: selectedAccount, month: selectedMonth });
      setIsManualMatchModalOpen(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      setActionError(error.message || "Failed to manual match");
    }
  };

  const handleUnmatch = () => {
    setActionError("");
    if (selectedForUnmatch) {
      void unmatchTransaction(selectedForUnmatch, selectedForUnmatch)
        .then(() => fetchBankReconciliations({ account: selectedAccount, month: selectedMonth }))
        .catch((error: any) => setActionError(error.message || "Failed to unmatch transaction"));
    }
    setIsUnmatchDialogOpen(false);
    setSelectedForUnmatch(null);
  };

  const handleCreateVoucher = (transaction: BankTransaction) => {
    setActionError(`Create a voucher for ${transaction.chequeOrRef} from the Vouchers page.`);
  };

  // Summary Metrics
  const bankStatementBalance = transactions.reduce((sum, item) => sum + (item.type === "DEPOSIT" ? item.amount : -item.amount), 0);
  const erpBookBalance = bookTransactions.reduce((sum, item) => sum + (item.type === "DEPOSIT" ? Number(item.amount) : -Number(item.amount)), 0);
  const unreconciledDifference = bankStatementBalance - erpBookBalance;

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chequeOrRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.matchedVoucherNo && item.matchedVoucherNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "UNMATCHED" && item.status !== "MATCHED") ||
      (activeTab === "MATCHED" && item.status === "MATCHED");

    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {actionError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{actionError}</p>}
      {/* 1. Header & Navigation */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Accounting & Finance</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Bank Reconciliation</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Bank Reconciliation</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Reconcile bank statements with ERP cashbook vouchers and resolve discrepancies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="h-3.5 w-3.5 text-[#10B981]" />
              Import Statement (.CSV/.XLS)
            </Button>
            <Button 
              size="sm" 
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
              onClick={() => setIsAutoMatchModalOpen(true)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Auto-Match Rules
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Bank Account & Period Selection */}
      <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0B1816] border border-[#1E3E37] px-3 py-1.5 rounded-lg">
            <Building2 className="h-4 w-4 text-[#10B981]" />
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              {bankAccounts.map((account) => (
                <option key={account.accountNo} value={account.accountNo} className="bg-[#0B1816]">{account.name} - A/C {account.accountNo}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0B1816] border border-[#1E3E37] px-3 py-1.5 rounded-lg">
            <Calendar className="h-4 w-4 text-[#10B981]" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="text-xs text-[#829B96] flex items-center gap-2">
          <span>Last Reconciled: <strong className="text-white">31 Jul 2026</strong></span>
          <span className="text-[#1E3E37]">|</span>
          <span className="text-emerald-400 font-medium">Statement Status: Ready</span>
        </div>
      </div>

      {/* 3. Reconciliation Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Bank Statement Balance</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(bankStatementBalance)}</p>
          <p className="text-[11px] text-[#829B96]">As per uploaded bank statement</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">ERP General Ledger Balance</p>
          <p className="text-2xl font-bold text-sky-400">{formatCurrency(erpBookBalance)}</p>
          <p className="text-[11px] text-[#829B96]">As per internal Cash & Bank ledger</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Unreconciled Difference</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-amber-400">{formatCurrency(unreconciledDifference)}</p>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-amber-400/90">2 pending items requiring match</p>
        </div>
      </div>

      {/* 4. Action Bar & Tabs */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#0B1816] p-1 rounded-lg border border-[#1E3E37]">
          <button
            onClick={() => setActiveTab("UNMATCHED")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "UNMATCHED"
                ? "bg-[#10B981] text-slate-950"
                : "text-[#829B96] hover:text-white"
            }`}
          >
            Unmatched Items (3)
          </button>
          <button
            onClick={() => setActiveTab("MATCHED")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "MATCHED"
                ? "bg-[#10B981] text-slate-950"
                : "text-[#829B96] hover:text-white"
            }`}
          >
            Matched (2)
          </button>
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === "ALL"
                ? "bg-[#10B981] text-slate-950"
                : "text-[#829B96] hover:text-white"
            }`}
          >
            All Transactions
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search statement ref, voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 5. Statement Matching Table */}
      {bankReconciliationLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading bank reconciliations...</p>
        </div>
      ) : bankReconciliationError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{bankReconciliationError}</p>
          <Button
            onClick={() => fetchBankReconciliations({ account: selectedAccount, month: selectedMonth })}
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
                  <th className="p-3.5">Txn Date</th>
                  <th className="p-3.5">Statement Particulars & Ref</th>
                  <th className="p-3.5 text-right">Deposit (৳)</th>
                  <th className="p-3.5 text-right">Withdrawal (৳)</th>
                  <th className="p-3.5">Matched ERP Voucher</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      <td className="p-3.5 font-mono text-[#829B96]">{item.date}</td>
                      <td className="p-3.5 space-y-0.5">
                        <p className="font-semibold text-white">{item.description}</p>
                        <p className="font-mono text-[11px] text-[#829B96]">{item.chequeOrRef}</p>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                        {item.type === "DEPOSIT" ? formatCurrency(item.amount) : "—"}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-rose-400">
                        {item.type === "WITHDRAWAL" ? formatCurrency(item.amount) : "—"}
                      </td>
                      <td className="p-3.5">
                        {item.matchedVoucherNo ? (
                          <span className="font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                            {item.matchedVoucherNo}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#829B96] italic">No match selected</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          item.status === "MATCHED"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                            : item.status === "UNMATCHED"
                            ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                            : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.status === "UNMATCHED" ? (
                            <Button
                              size="sm"
                              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-[11px] h-7 px-2.5"
                              onClick={() => {
                                setSelectedTransaction(item);
                                setIsManualMatchModalOpen(true);
                              }}
                            >
                              Match Voucher
                            </Button>
                          ) : item.status === "MATCHED" ? (
                            <button
                              title="Unlink Match"
                              className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-rose-400 hover:bg-rose-950/40 transition-all text-[11px]"
                              onClick={() => {
                                setSelectedForUnmatch(item.id);
                                setIsUnmatchDialogOpen(true);
                              }}
                            >
                              Unmatch
                            </button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-[#0B1816] border-[#1E3E37] text-white hover:bg-[#1A3530] text-[11px] h-7"
                              onClick={() => handleCreateVoucher(item)}
                            >
                              Create Voucher
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                      No transactions found in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadStatementModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadStatement}
        bankAccounts={bankAccounts}
      />

      <AutoMatchModal
        isOpen={isAutoMatchModalOpen}
        onClose={() => setIsAutoMatchModalOpen(false)}
        onRunMatch={handleAutoMatch}
      />

      <ManualMatchModal
        isOpen={isManualMatchModalOpen}
        onClose={() => {
          setIsManualMatchModalOpen(false);
          setSelectedTransaction(null);
        }}
        onMatch={handleManualMatch}
        bankEntry={selectedTransaction ? {
          id: selectedTransaction.id,
          date: selectedTransaction.date,
          description: selectedTransaction.description,
          amount: selectedTransaction.amount,
          reference: selectedTransaction.chequeOrRef
        } : undefined}
        availableVouchers={availableVouchers}
      />

      <ConfirmDialog
        isOpen={isUnmatchDialogOpen}
        onClose={() => {
          setIsUnmatchDialogOpen(false);
          setSelectedForUnmatch(null);
        }}
        onConfirm={handleUnmatch}
        title="Unlink Matched Transaction?"
        description="Are you sure you want to unlink this transaction from its matched voucher? This will revert the status to unmatched."
        variant="WARNING"
        confirmText="Unlink Match"
      />
    </div>
  );
}