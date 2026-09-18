import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Plus, Search, ChevronRight,
  Wallet, Building2, ArrowUpRight, ArrowDownLeft,
  ArrowLeftRight, CreditCard, ExternalLink, MoreVertical,
  Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import FundTransferModal from "@/components/forms/FundTransferModal";
import AddCashBankAccountModal from "@/components/forms/AddCashBankAccountModal";
import { useAccounting } from "@/context/AccountingContext";
import { createCashBankAccount, createCashBankTransfer, getCashBankTransactions } from "@/services/accounting/accounting.service";

interface AccountSummary {
  id: string;
  name: string;
  accountNo: string;
  type: "BANK" | "CASH" | "PETTY_CASH";
  bankName?: string;
  branch?: string;
  balance: number;
  currency: string;
  status: "ACTIVE" | "INACTIVE";
}

interface BankTransaction {
  id: string;
  date: string;
  accountName: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  reference: string;
  particulars: string;
  amount: number;
  status: "COMPLETED" | "PENDING";
}

export default function CashBankPage() {
  const {
    cashBankAccounts,
    cashBankLoading,
    cashBankError,
    fetchCashBankAccounts,
  } = useAccounting();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [isFundTransferModalOpen, setIsFundTransferModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [actionError, setActionError] = useState("");

  // Fetch cash & bank accounts on mount
  useEffect(() => {
    fetchCashBankAccounts();
    getCashBankTransactions().then(setTransactions).catch(() => setTransactions([]));
  }, []);

  const formatCurrency = (amt: number) => "৳ " + amt.toLocaleString("en-BD");

  const totalBankBalance = cashBankAccounts.filter(a => a.type === "BANK").reduce((sum, a) => sum + a.balance, 0);
  const totalCashBalance = cashBankAccounts.filter(a => a.type !== "BANK").reduce((sum, a) => sum + a.balance, 0);
  const grandTotal = totalBankBalance + totalCashBalance;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.particulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFundTransfer = async (data: any) => {
    setActionError("");
    if (!data.fromAccountId || !data.toAccountId || !Number.isFinite(data.amount) || data.amount <= 0) {
      setActionError("Select two accounts and enter a valid transfer amount.");
      return;
    }
    try {
      await createCashBankTransfer(data);
      await Promise.all([fetchCashBankAccounts(), getCashBankTransactions().then(setTransactions)]);
      setIsFundTransferModalOpen(false);
    } catch (error: any) {
      setActionError(error.message || "Failed to transfer funds");
    }
  };

  const handleAddAccount = async (data: any) => {
    try {
      await createCashBankAccount(data);
      await fetchCashBankAccounts();
    } catch (error: any) {
      setActionError(error.message || "Failed to create account");
    }
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {actionError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{actionError}</p>}
      {/* 1. Header & Breadcrumb */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Accounting & Finance</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Cash & Bank</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Cash & Bank Accounts</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Monitor real-time bank account balances, cash vaults, inter-account transfers, and cashflow movements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={() => setIsFundTransferModalOpen(true)}
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-[#10B981]" />
              Fund Transfer
            </Button>
            <Button
              size="sm"
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
              onClick={() => setIsAddAccountModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Account
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Liquid Funds</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-white">{formatCurrency(grandTotal)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">Bank + Cash Vaults combined</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Bank Balance</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalBankBalance)}</p>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Building2 className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">Across {cashBankAccounts.filter((account) => account.type === "BANK" && account.status === "ACTIVE").length} active bank accounts</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Cash Balance</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalCashBalance)}</p>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CreditCard className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">In-hand cash & site petty cash</p>
        </div>
      </div>

      {/* 3. Accounts Grid */}
      {cashBankLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading cash & bank accounts...</p>
        </div>
      ) : cashBankError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{cashBankError}</p>
          <Button
            onClick={() => fetchCashBankAccounts()}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#10B981]" /> Active Accounts & Vaults
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cashBankAccounts.map((acc) => (
            <div 
              key={acc.id} 
              className="bg-[#112421] border border-[#1E3E37] hover:border-[#10B981]/50 p-4 rounded-xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    acc.type === "BANK" 
                      ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-950/60 border-amber-500/30 text-amber-400"
                  }`}>
                    {acc.type === "BANK" ? "BANK ACCOUNT" : acc.type === "CASH" ? "CASH VAULT" : "PETTY CASH"}
                  </span>
                  <button className="text-[#829B96] hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{acc.name}</h3>
                  <p className="text-xs font-mono text-[#829B96]">{acc.accountNo}</p>
                </div>

                {acc.bankName && (
                  <p className="text-[11px] text-[#829B96]">
                    {acc.bankName} • <span className="text-[#E2E8F0]/70">{acc.branch}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#1E3E37]/80 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-[#829B96] uppercase">Current Balance</p>
                  <p className="text-lg font-bold font-mono text-white">{formatCurrency(acc.balance)}</p>
                </div>

                <button 
                  title="View Ledger" 
                  className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {/* 4. Transactions Log */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-[#10B981]" /> Recent Cash & Bank Movements
          </h2>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
              <input
                type="text"
                placeholder="Search description, voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#112421] border border-[#1E3E37] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
            >
              <option value="ALL">All Types</option>
              <option value="DEPOSIT">Deposits</option>
              <option value="WITHDRAWAL">Withdrawals</option>
              <option value="TRANSFER">Transfers</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Voucher Ref</th>
                  <th className="p-3.5">Account</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Particulars / Description</th>
                  <th className="p-3.5 text-right">Amount (৳)</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      <td className="p-3.5 font-mono text-[#829B96]">{trx.date}</td>
                      <td className="p-3.5 font-mono text-[#10B981] font-semibold">{trx.reference}</td>
                      <td className="p-3.5 text-white font-medium">{trx.accountName}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          trx.type === "DEPOSIT"
                            ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/30"
                            : trx.type === "WITHDRAWAL"
                            ? "bg-rose-950/70 text-rose-400 border border-rose-500/30"
                            : "bg-sky-950/70 text-sky-400 border border-sky-500/30"
                        }`}>
                          {trx.type === "DEPOSIT" && <ArrowDownLeft className="h-3 w-3" />}
                          {trx.type === "WITHDRAWAL" && <ArrowUpRight className="h-3 w-3" />}
                          {trx.type === "TRANSFER" && <ArrowLeftRight className="h-3 w-3" />}
                          {trx.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-white font-medium max-w-xs truncate">{trx.particulars}</td>
                      <td className={`p-3.5 text-right font-bold font-mono ${
                        trx.type === "DEPOSIT" ? "text-[#10B981]" : trx.type === "WITHDRAWAL" ? "text-rose-400" : "text-sky-400"
                      }`}>
                        {trx.type === "WITHDRAWAL" ? "-" : "+"}{formatCurrency(trx.amount)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                      No bank or cash transactions match your search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fund Transfer Modal */}
      <FundTransferModal
        isOpen={isFundTransferModalOpen}
        onClose={() => setIsFundTransferModalOpen(false)}
        onTransfer={handleFundTransfer}
        availableAccounts={cashBankAccounts}
      />
      <AddCashBankAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleAddAccount}
      />
    </div>
  );
}