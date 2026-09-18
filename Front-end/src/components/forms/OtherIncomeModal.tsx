import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, DollarSign, Calendar, CheckCircle2, 
  FileText, CreditCard, TrendingUp
} from "lucide-react";
import CreditVoucherPrintModal from "./CreditVoucherPrintModal";

interface OtherIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const INCOME_CATEGORIES = [
  { id: "IC-001", name: "Rent Income", description: "Property rental income" },
  { id: "IC-002", name: "Commission Income", description: "Sales/agent commission" },
  { id: "IC-003", name: "Service Fee", description: "Professional service charges" },
  { id: "IC-004", name: "Penalty Received", description: "Late payment penalties" },
  { id: "IC-005", name: "Royalty Income", description: "License/royalty payments" },
  { id: "IC-006", name: "Other Income", description: "Miscellaneous income" },
];

const PAYMENT_MODES = [
  { id: "PM-001", name: "Cash" },
  { id: "PM-002", name: "Bank Transfer / EFT" },
  { id: "PM-003", name: "Cheque / DD" },
  { id: "PM-004", name: "bKash / Nagad / Online" },
];

export default function OtherIncomeModal({ isOpen, onClose, onSave }: OtherIncomeModalProps) {
  const voucherNo = `CV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const [incomeCategoryId, setIncomeCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [incomeDate, setIncomeDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paymentModeId, setPaymentModeId] = useState<string>("");
  const [referenceNo, setReferenceNo] = useState<string>("");
  const [particulars, setParticulars] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [lastCreatedVoucher, setLastCreatedVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!incomeCategoryId) return setError("Select an income category.");
    if (!description.trim()) return setError("Enter a description.");
    if (!amount || Number(amount) <= 0) return setError("Amount must be greater than zero.");
    if (!paymentModeId) return setError("Select a payment mode.");

    const incomeCategory = INCOME_CATEGORIES.find(cat => cat.id === incomeCategoryId);
    const paymentMode = PAYMENT_MODES.find(pm => pm.id === paymentModeId);

    const voucherData = {
      voucherNo,
      voucherDate: incomeDate,
      incomeCategoryId,
      incomeCategoryName: incomeCategory?.name,
      description,
      amount: Number(amount),
      paymentModeId,
      paymentModeName: paymentMode?.name,
      referenceNo,
      particulars,
      creditAccount: incomeCategory?.name,
      debitAccount: "Cash / Bank",
      paymentMode: paymentMode?.name,
      approvalStatus: "APPROVED",
    };

    setLastCreatedVoucher(voucherData);
    if (onSave) onSave(voucherData);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Other Income</h2>
              <p className="text-xs text-[#829B96]">Record rent, commission, service fees, and other income</p>
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
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Income Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Income Category & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" /> Income Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={incomeCategoryId}
                onChange={(e) => setIncomeCategoryId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select Income Category</option>
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0B1816]">
                    {cat.name} - {cat.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Description <span className="text-rose-400">*</span></label>
              <input
                type="text"
                placeholder="e.g. Office rent for September 2026"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
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
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#10B981]" /> Payment Mode <span className="text-rose-400">*</span>
              </label>
              <select
                value={paymentModeId}
                onChange={(e) => setPaymentModeId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select Payment Mode</option>
                {PAYMENT_MODES.map((pm) => (
                  <option key={pm.id} value={pm.id} className="bg-[#0B1816]">
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reference No */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium">Reference / Instrument No.</label>
            <input
              type="text"
              placeholder="e.g. RENT-SEP-2026-001 or EFT-883920"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Particulars / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Monthly office rent payment received from tenant..."
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Accounting Entry Preview */}
          {incomeCategoryId && amount && (
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
              <p className="text-[11px] font-semibold text-[#829B96] uppercase tracking-wider">Accounting Entry Preview</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400">Credit: {INCOME_CATEGORIES.find(c => c.id === incomeCategoryId)?.name}</span>
                <span className="font-mono text-white">৳ {Number(amount).toLocaleString("en-BD")}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-rose-400">Debit: Cash / Bank</span>
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
