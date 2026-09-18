import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Building2, Calendar, DollarSign, 
  CheckCircle2, Percent, FileText
} from "lucide-react";
import CreditVoucherPrintModal from "./CreditVoucherPrintModal";

interface BankInterestIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const BANK_ACCOUNTS = [
  { id: "BA-001", name: "DBBL Current Account", accountNo: "DBBL-88392011" },
  { id: "BA-002", name: "City Bank Current Account", accountNo: "CBL-72389012" },
  { id: "BA-003", name: "Brac Bank Current Account", accountNo: "BRAC-62389013" },
  { id: "BA-004", name: "Sonali Bank Current Account", accountNo: "SON-52389014" },
];

export default function BankInterestIncomeModal({ isOpen, onClose, onSave }: BankInterestIncomeModalProps) {
  const voucherNo = `CV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const [bankAccountId, setBankAccountId] = useState<string>("");
  const [interestPeriod, setInterestPeriod] = useState<string>("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [principalAmount, setPrincipalAmount] = useState<number | "">("");
  const [interestAmount, setInterestAmount] = useState<number | "">("");
  const [creditDate, setCreditDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bankReferenceNo, setBankReferenceNo] = useState<string>("");
  const [particulars, setParticulars] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [lastCreatedVoucher, setLastCreatedVoucher] = useState<any>(null);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  // Auto-calculate interest when rate and principal are entered
  const handleRateOrPrincipalChange = () => {
    if (interestRate && principalAmount) {
      const calculatedInterest = (Number(interestRate) / 100) * Number(principalAmount);
      setInterestAmount(Math.round(calculatedInterest));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!bankAccountId) return setError("Select a bank account.");
    if (!interestPeriod) return setError("Select the interest period.");
    if (!interestAmount || Number(interestAmount) <= 0) return setError("Interest amount must be greater than zero.");

    const bankAccount = BANK_ACCOUNTS.find(acc => acc.id === bankAccountId);

    const voucherData = {
      voucherNo,
      voucherDate: creditDate,
      bankAccountId,
      bankAccountName: bankAccount?.name,
      bankAccountNo: bankAccount?.accountNo,
      interestPeriod,
      interestRate,
      principalAmount,
      interestAmount: Number(interestAmount),
      bankReferenceNo,
      particulars,
      creditAccount: "Interest Income",
      debitAccount: bankAccount?.name,
      paymentMode: "Bank Transfer",
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
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bank Interest Income</h2>
              <p className="text-xs text-[#829B96]">Record bank interest credit voucher</p>
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
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Credit Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={creditDate}
                onChange={(e) => setCreditDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Bank Account & Interest Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Bank Account <span className="text-rose-400">*</span>
              </label>
              <select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select Bank Account</option>
                {BANK_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[#0B1816]">
                    {acc.name} ({acc.accountNo})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Interest Period <span className="text-rose-400">*</span>
              </label>
              <input
                type="month"
                value={interestPeriod}
                onChange={(e) => setInterestPeriod(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Interest Rate & Principal Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-[#10B981]" /> Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 5.5"
                value={interestRate}
                onChange={(e) => {
                  setInterestRate(e.target.value === "" ? "" : Number(e.target.value));
                  handleRateOrPrincipalChange();
                }}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Principal Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 50000000"
                value={principalAmount}
                onChange={(e) => {
                  setPrincipalAmount(e.target.value === "" ? "" : Number(e.target.value));
                  handleRateOrPrincipalChange();
                }}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Interest Amount & Bank Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Interest Amount (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 275000"
                value={interestAmount}
                onChange={(e) => setInterestAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Bank Reference No.</label>
              <input
                type="text"
                placeholder="e.g. INT-SEP-2026-001"
                value={bankReferenceNo}
                onChange={(e) => setBankReferenceNo(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Particulars / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Monthly interest credit for September 2026..."
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Accounting Entry Preview */}
          {bankAccountId && interestAmount && (
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
              <p className="text-[11px] font-semibold text-[#829B96] uppercase tracking-wider">Accounting Entry Preview</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400">Credit: Interest Income</span>
                <span className="font-mono text-white">৳ {Number(interestAmount).toLocaleString("en-BD")}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-rose-400">Debit: {BANK_ACCOUNTS.find(a => a.id === bankAccountId)?.name}</span>
                <span className="font-mono text-white">৳ {Number(interestAmount).toLocaleString("en-BD")}</span>
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
