import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, DollarSign, CheckCircle2, AlertCircle
} from "lucide-react";

interface DisburseLaborWageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DisbursementData) => void;
  record?: { id: string; contractor: string; projectSite: string; totalPayable: number };
}

interface DisbursementData {
  recordId: string;
  disbursementDate: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "MOBILE_BANKING";
  referenceNumber: string;
  notes: string;
}

export default function DisburseLaborWageModal({ 
  isOpen, 
  onClose, 
  onSave,
  record
}: DisburseLaborWageModalProps) {
  const [disbursementDate, setDisbursementDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK_TRANSFER" | "MOBILE_BANKING">("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    const data: DisbursementData = {
      recordId: record?.id ?? "",
      disbursementDate,
      paymentMethod,
      referenceNumber,
      notes
    };
    onSave(data);
    onClose();
  };

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Disburse Labor Wages</h2>
              <p className="text-xs text-[#829B96]">Process wage payment to contractor</p>
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
        <div className="p-6 space-y-4 text-xs">
          
          {/* Payment Summary */}
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
            <p className="text-[10px] text-[#829B96] font-medium uppercase tracking-wider">Payment Summary</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#829B96]">Record ID:</span>
                <span className="text-white font-mono">{record?.id ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Contractor:</span>
                <span className="text-white">{record?.contractor ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Site:</span>
                <span className="text-white">{record?.projectSite ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Amount:</span>
                <span className="text-[#10B981] font-bold">{formatCurrency(record?.totalPayable ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Disbursement Date */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              Disbursement Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={disbursementDate}
              onChange={(e) => setDisbursementDate(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              Payment Method <span className="text-rose-400">*</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="CASH">Cash Payment</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="MOBILE_BANKING">Mobile Banking (bKash/Nagad)</option>
            </select>
          </div>

          {/* Reference Number */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              Reference Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Voucher / Transaction ID"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
            <p className="text-[10px] text-[#829B96]">For bank transfer or mobile banking</p>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="Optional payment notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-400">
              This action will mark the labor record as PAID. Please verify the amount before confirming.
            </p>
          </div>

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
              onClick={handleSave}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirm Disbursement
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
