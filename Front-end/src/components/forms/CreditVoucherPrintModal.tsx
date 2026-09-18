import { Button } from "@/components/ui/Button";
import { X, Printer } from "lucide-react";

interface CreditVoucherPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherData?: {
    voucherNo: string;
    voucherDate: string;
    creditAccountName: string;
    debitAccountName: string;
    amount: number;
    paymentMode: string;
    referenceNo: string;
    particulars: string;
    approvalStatus: string;
  };
}

export default function CreditVoucherPrintModal({ isOpen, onClose, voucherData }: CreditVoucherPrintModalProps) {
  if (!isOpen) return null;
  if (!voucherData) {
    return <div role="alert" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 text-rose-300">Voucher data is unavailable. <button className="ml-2 underline" onClick={onClose}>Close</button></div>;
  }
  const mockVoucher = voucherData;

  const numberToWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
                  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if (num === 0) return "Zero";
    
    const convertGroup = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertGroup(n % 100) : "");
      return "";
    };
    
    let result = "";
    let remaining = num;
    
    if (remaining >= 10000000) {
      result += convertGroup(Math.floor(remaining / 10000000)) + " Crore ";
      remaining %= 10000000;
    }
    if (remaining >= 100000) {
      result += convertGroup(Math.floor(remaining / 100000)) + " Lakh ";
      remaining %= 100000;
    }
    if (remaining >= 1000) {
      result += convertGroup(Math.floor(remaining / 1000)) + " Thousand ";
      remaining %= 1000;
    }
    if (remaining > 0) {
      result += convertGroup(remaining);
    }
    
    return result.trim() + " Taka Only";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Credit Voucher Print Preview</h2>
              <p className="text-xs text-slate-600">Review and print credit voucher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Print Content */}
        <div className="p-8 bg-white">
          
          {/* Company Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider">SARDAR LANDMARK &amp; BUILDERS LTD.</h1>
            <p className="text-sm text-slate-600 mt-1">Head Office: Dhanmondi, Dhaka, Bangladesh</p>
            <p className="text-xs text-slate-500 mt-0.5">BIN: 123456789 | TIN: 987654321</p>
          </div>

          {/* Voucher Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase border-2 border-slate-800 py-2 px-4 inline-block">
              CREDIT VOUCHER
            </h2>
          </div>

          {/* Voucher Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 w-32">Voucher No:</span>
              <span className="font-mono font-bold text-slate-900">{mockVoucher.voucherNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 w-32">Voucher Date:</span>
              <span className="font-mono text-slate-900">{mockVoucher.voucherDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 w-32">Payment Mode:</span>
              <span className="text-slate-900">{mockVoucher.paymentMode}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 w-32">Reference No:</span>
              <span className="font-mono text-slate-900">{mockVoucher.referenceNo || "N/A"}</span>
            </div>
          </div>

          {/* Accounting Entry Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-slate-800">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-800 px-4 py-2 text-left text-sm font-bold text-slate-900">Account</th>
                  <th className="border border-slate-800 px-4 py-2 text-right text-sm font-bold text-slate-900">Debit (৳)</th>
                  <th className="border border-slate-800 px-4 py-2 text-right text-sm font-bold text-slate-900">Credit (৳)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-800 px-4 py-3 text-sm text-slate-900">{mockVoucher.debitAccountName}</td>
                  <td className="border border-slate-800 px-4 py-3 text-right font-mono font-bold text-slate-900">{mockVoucher.amount.toLocaleString("en-BD")}</td>
                  <td className="border border-slate-800 px-4 py-3 text-right text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="border border-slate-800 px-4 py-3 text-sm text-slate-900">{mockVoucher.creditAccountName}</td>
                  <td className="border border-slate-800 px-4 py-3 text-right text-slate-400">-</td>
                  <td className="border border-slate-800 px-4 py-3 text-right font-mono font-bold text-slate-900">{mockVoucher.amount.toLocaleString("en-BD")}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-800 px-4 py-2 text-sm font-bold text-slate-900">Total</td>
                  <td className="border border-slate-800 px-4 py-2 text-right font-mono font-bold text-slate-900">{mockVoucher.amount.toLocaleString("en-BD")}</td>
                  <td className="border border-slate-800 px-4 py-2 text-right font-mono font-bold text-slate-900">{mockVoucher.amount.toLocaleString("en-BD")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Amount in Words:</span> {numberToWords(mockVoucher.amount)}
            </p>
          </div>

          {/* Particulars */}
          <div className="mb-6">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Particulars:</span> {mockVoucher.particulars}
            </p>
          </div>

          {/* Approval Status */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border-2">
              <span className="font-semibold">Status:</span>
              <span className={mockVoucher.approvalStatus === "APPROVED" ? "text-emerald-600" : "text-amber-600"}>
                {mockVoucher.approvalStatus}
              </span>
            </div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-300">
            <div className="text-center">
              <div className="border-b border-slate-400 mb-2 pb-8">
                <p className="text-xs text-slate-600">Prepared By</p>
              </div>
              <p className="text-xs text-slate-500 font-semibold">Accounts Officer</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 mb-2 pb-8">
                <p className="text-xs text-slate-600">Checked & Approved By</p>
              </div>
              <p className="text-xs text-slate-500 font-semibold">Chief Accountant</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 mb-2 pb-8">
                <p className="text-xs text-slate-600">Authorized Signatory</p>
              </div>
              <p className="text-xs text-slate-500 font-semibold">Managing Director</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-center">
            <p className="text-xs text-slate-500">
              This is a computer-generated document. No signature required for electronic records.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Generated on: {new Date().toLocaleString("en-BD")}
            </p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 text-xs h-9 px-4"
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-[#10B981] hover:bg-[#0D9668] text-white font-bold text-xs h-9 px-5 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Voucher
          </Button>
        </div>

      </div>
    </div>
  );
}
