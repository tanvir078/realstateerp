import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, FileText, Calendar, DollarSign, 
  CreditCard, CheckCircle2, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import CreditVoucherPrintModal from "./CreditVoucherPrintModal";

interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
}

interface CreditVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

// Mock GL Accounts
const GL_ACCOUNTS: GLAccount[] = [
  // Asset Accounts (Debit side)
  { id: "ACC-001", code: "1001", name: "Cash", type: "ASSET" },
  { id: "ACC-002", code: "1002", name: "DBBL Current Account", type: "ASSET" },
  { id: "ACC-003", code: "1003", name: "City Bank Current Account", type: "ASSET" },
  { id: "ACC-004", code: "1004", name: "Brac Bank Current Account", type: "ASSET" },
  { id: "ACC-005", code: "1005", name: "Sonali Bank Current Account", type: "ASSET" },
  
  // Income Accounts (Credit side)
  { id: "ACC-101", code: "4001", name: "Sales Revenue", type: "INCOME" },
  { id: "ACC-102", code: "4002", name: "Interest Income", type: "INCOME" },
  { id: "ACC-103", code: "4003", name: "Other Income", type: "INCOME" },
  { id: "ACC-104", code: "4004", name: "Rent Income", type: "INCOME" },
  { id: "ACC-105", code: "4005", name: "Commission Income", type: "INCOME" },
  { id: "ACC-106", code: "4006", name: "Asset Sale Income", type: "INCOME" },
];

export default function CreditVoucherModal({ isOpen, onClose, onSave }: CreditVoucherModalProps) {
  const voucherNo = `CV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const [voucherDate, setVoucherDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [creditAccountId, setCreditAccountId] = useState<string>("");
  const [debitAccountId, setDebitAccountId] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentMode, setPaymentMode] = useState<string>("Bank Transfer");
  const [referenceNo, setReferenceNo] = useState<string>("");
  const [particulars, setParticulars] = useState<string>("");
  const [approvalStatus, setApprovalStatus] = useState<string>("PENDING");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [lastCreatedVoucher, setLastCreatedVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!creditAccountId) return setError("Select a credit income account.");
    if (!debitAccountId) return setError("Select a debit cash or bank account.");
    if (creditAccountId === debitAccountId) return setError("Debit and credit accounts must be different.");
    if (!amount || Number(amount) <= 0) return setError("Amount must be greater than zero.");

    const creditAccount = GL_ACCOUNTS.find(acc => acc.id === creditAccountId);
    const debitAccount = GL_ACCOUNTS.find(acc => acc.id === debitAccountId);

    const voucherData = {
      voucherNo,
      voucherDate,
      creditAccountId,
      creditAccountCode: creditAccount?.code,
      creditAccountName: creditAccount?.name,
      debitAccountId,
      debitAccountCode: debitAccount?.code,
      debitAccountName: debitAccount?.name,
      amount: Number(amount),
      paymentMode,
      referenceNo,
      particulars,
      approvalStatus,
    };

    setLastCreatedVoucher(voucherData);
    if (onSave) onSave(voucherData);
    setIsPrintModalOpen(true);
  };

  const incomeAccounts = GL_ACCOUNTS.filter(acc => acc.type === "INCOME");
  const assetAccounts = GL_ACCOUNTS.filter(acc => acc.type === "ASSET");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Credit Voucher</h2>
              <p className="text-xs text-[#829B96]">Manual accounting entry for income/revenue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
          
          {/* Voucher No & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Voucher No.
              </label>
              <input
                type="text"
                value={voucherNo}
                readOnly
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono opacity-60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Voucher Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Credit & Debit Accounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" /> Credit Account (Income) <span className="text-rose-400">*</span>
              </label>
              <select
                value={creditAccountId}
                onChange={(e) => setCreditAccountId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select Credit Account</option>
                {incomeAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[#0B1816]">
                    {acc.code} - {acc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" /> Debit Account (Asset) <span className="text-rose-400">*</span>
              </label>
              <select
                value={debitAccountId}
                onChange={(e) => setDebitAccountId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select Debit Account</option>
                {assetAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[#0B1816]">
                    {acc.code} - {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Payment Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Amount (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#10B981]" /> Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="Bank Transfer">Bank Transfer / EFT</option>
                <option value="Cheque">Cheque / DD</option>
                <option value="Cash">Cash Collection</option>
                <option value="Online">bKash / Nagad / Online</option>
              </select>
            </div>
          </div>

          {/* Reference No & Approval Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Reference / Instrument No.</label>
              <input
                type="text"
                placeholder="e.g. CQ-90021 or EFT-883920"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Approval Status</label>
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="PENDING">Pending Approval</option>
                <option value="APPROVED">Approved</option>
              </select>
            </div>
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Particulars / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Interest income from DBBL for September 2026..."
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Accounting Entry Preview */}
          {creditAccountId && debitAccountId && amount && (
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
              <p className="text-[11px] font-semibold text-[#829B96] uppercase tracking-wider">Accounting Entry Preview</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400">Credit: {GL_ACCOUNTS.find(a => a.id === creditAccountId)?.name}</span>
                <span className="font-mono text-white">৳ {Number(amount).toLocaleString("en-BD")}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-rose-400">Debit: {GL_ACCOUNTS.find(a => a.id === debitAccountId)?.name}</span>
                <span className="font-mono text-white">৳ {Number(amount).toLocaleString("en-BD")}</span>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3E37]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:bg-[#1A3530] hover:text-white text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Create Voucher
            </Button>
          </div>

        </form>
      </div>

      {/* Credit Voucher Print Modal */}
      <CreditVoucherPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          onClose();
        }}
        voucherData={lastCreatedVoucher}
      />
    </div>
  );
}
