import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Truck, Calendar, DollarSign, 
  CheckCircle2, FileText, CreditCard
} from "lucide-react";
import DebitVoucherPrintModal from "./DebitVoucherPrintModal";

interface VendorData {
  id: string;
  name: string;
  billNo: string;
  projectName: string;
  category: string;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  dueDate: string;
}

interface VendorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  defaultVendorId?: string;
  defaultBillNo?: string;
  bills?: Array<{ id: string; billNo: string; vendorId: string; amount: number; paidAmount: number; dueDate: string; status: string }>;
  vendors?: Array<{ id: string; name: string }>;
}

export default function VendorPaymentModal({ isOpen, onClose, onSave, defaultVendorId, defaultBillNo, bills = [], vendors = [] }: VendorPaymentModalProps) {
  const voucherNo = `DV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentMode, setPaymentMode] = useState<string>("Bank Transfer");
  const [referenceNo, setReferenceNo] = useState<string>("");
  const [particulars, setParticulars] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [lastCreatedVoucher, setLastCreatedVoucher] = useState<any>(null);
  const [error, setError] = useState("");

  const selectedBill = bills.find((bill) => bill.id === selectedVendorId);
  const selectedVendor = selectedBill
    ? {
        id: selectedBill.id,
        name: vendors.find((vendor) => vendor.id === selectedBill.vendorId)?.name || selectedBill.vendorId,
        billNo: selectedBill.billNo,
        projectName: "",
        category: "",
        totalAmount: Number(selectedBill.amount),
        paidAmount: Number(selectedBill.paidAmount),
        dueBalance: Number(selectedBill.amount) - Number(selectedBill.paidAmount),
        dueDate: selectedBill.dueDate,
      }
    : undefined;

  // Auto-fill payment amount when vendor is selected
  useEffect(() => {
    let vendor = null;
    if (defaultBillNo) {
      vendor = bills.find(v => v.billNo === defaultBillNo);
    } else if (defaultVendorId) {
      vendor = bills.find(v => v.id === defaultVendorId);
    }
    
    if (vendor) {
      setSelectedVendorId(vendor.id);
      setPaymentAmount(Number(vendor.amount) - Number(vendor.paidAmount));
    }
  }, [defaultBillNo, defaultVendorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedVendorId) return setError("Select an outstanding vendor bill.");
    const selectedBill = pendingVendors.find((bill) => bill.id === selectedVendorId);
    if (!paymentAmount || Number(paymentAmount) <= 0) return setError("Payment amount must be greater than zero.");
    if (selectedBill && Number(paymentAmount) > selectedBill.dueBalance) return setError(`Payment cannot exceed the outstanding balance of ৳${selectedBill.dueBalance.toLocaleString("en-BD")}.`);

    const voucherData = {
      billId: selectedVendorId,
      amount: Number(paymentAmount),
      paymentDate,
      paymentMethod: paymentMode,
    };

    setLastCreatedVoucher(voucherData);
    if (onSave) onSave(voucherData);
    setIsPrintModalOpen(true);
    onClose();
  };

  const pendingVendors = bills
    .filter((bill) => bill.status !== "PAID" && Number(bill.amount) > Number(bill.paidAmount))
    .map((bill) => ({
      id: bill.id,
      name: vendors.find((vendor) => vendor.id === bill.vendorId)?.name || bill.vendorId,
      billNo: bill.billNo,
      projectName: "",
      category: "",
      totalAmount: Number(bill.amount),
      paidAmount: Number(bill.paidAmount),
      dueBalance: Number(bill.amount) - Number(bill.paidAmount),
      dueDate: bill.dueDate,
    }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Vendor Payment</h2>
              <p className="text-xs text-[#829B96]">Make payment against supplier/contractor bills</p>
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
                <FileText className="h-3.5 w-3.5 text-rose-400" /> Voucher No.
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
                <Calendar className="h-3.5 w-3.5 text-rose-400" /> Payment Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
          </div>

          {/* Vendor/Bill Selection */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-rose-400" /> Select Vendor / Bill <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedVendorId}
              onChange={(e) => {
                setSelectedVendorId(e.target.value);
                const vendor = pendingVendors.find(v => v.id === e.target.value);
                if (vendor) {
                  setPaymentAmount(vendor.dueBalance);
                }
              }}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-400"
              required
            >
              <option value="">Select Vendor Bill</option>
              {pendingVendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id} className="bg-[#0B1816]">
                  {vendor.name} - {vendor.billNo} (Due: ৳{vendor.dueBalance.toLocaleString("en-BD")})
                </option>
              ))}
            </select>
          </div>

          {/* Vendor Bill Details (Auto-filled) */}
          {selectedVendor && (
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
              <p className="text-[11px] font-semibold text-[#829B96] uppercase tracking-wider">Bill Details</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#829B96]">Bill No:</span>
                  <span className="ml-2 font-mono text-white">{selectedVendor.billNo}</span>
                </div>
                <div>
                  <span className="text-[#829B96]">Project:</span>
                  <span className="ml-2 text-white">{selectedVendor.projectName}</span>
                </div>
                <div>
                  <span className="text-[#829B96]">Category:</span>
                  <span className="ml-2 text-white">{selectedVendor.category}</span>
                </div>
                <div>
                  <span className="text-[#829B96]">Due Date:</span>
                  <span className="ml-2 font-mono text-white">{selectedVendor.dueDate}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-[#1E3E37]">
                <div>
                  <span className="text-[#829B96]">Total:</span>
                  <span className="ml-2 font-mono text-white">৳{selectedVendor.totalAmount.toLocaleString("en-BD")}</span>
                </div>
                <div>
                  <span className="text-[#829B96]">Paid:</span>
                  <span className="ml-2 font-mono text-emerald-400">৳{selectedVendor.paidAmount.toLocaleString("en-BD")}</span>
                </div>
                <div>
                  <span className="text-[#829B96]">Due:</span>
                  <span className="ml-2 font-mono text-rose-400">৳{selectedVendor.dueBalance.toLocaleString("en-BD")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Amount & Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-rose-400" /> Payment Amount (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1500000"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-rose-400" /> Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-400"
              >
                <option value="Bank Transfer">Bank Transfer / EFT</option>
                <option value="Cheque">Cheque / DD</option>
                <option value="Cash">Cash Collection</option>
                <option value="Online">bKash / Nagad / Online</option>
              </select>
            </div>
          </div>

          {/* Reference No */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium">Reference / Instrument No.</label>
            <input
              type="text"
              placeholder="e.g. CQ-90021 or EFT-883920"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-rose-400" /> Particulars / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Partial payment against steel supply bill..."
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Accounting Entry Preview */}
          {selectedVendor && paymentAmount && (
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
              <p className="text-[11px] font-semibold text-[#829B96] uppercase tracking-wider">Accounting Entry Preview</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-rose-400">Debit: {selectedVendor.category}</span>
                <span className="font-mono text-white">৳ {Number(paymentAmount).toLocaleString("en-BD")}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400">Credit: Cash / Bank</span>
                <span className="font-mono text-white">৳ {Number(paymentAmount).toLocaleString("en-BD")}</span>
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
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Process Payment
            </Button>
          </div>

        </form>
      </div>

      {/* Debit Voucher Print Modal */}
      <DebitVoucherPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
        }}
        voucherData={lastCreatedVoucher}
      />
    </div>
  );
}
