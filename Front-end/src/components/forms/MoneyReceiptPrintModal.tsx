import { Printer, Building2, User, FileText } from "lucide-react";

export interface MoneyReceiptData {
  mrNo: string;
  date: string;
  // Company Details
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyBinTin?: string;
  // Client Details
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  clientNid?: string;
  // Project & Unit Details
  projectName: string;
  projectLocation?: string;
  unitCode: string;
  unitType: string;
  unitSize: number; // SFT
  // Payment Details
  amount: number;
  paymentMode: string;
  referenceNo?: string;
  bankName?: string;
  collectedBy: string;
  particulars?: string;
  amountInWords: string;
}

interface MoneyReceiptPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MoneyReceiptData;
}

export default function MoneyReceiptPrintModal({ isOpen, onClose, data }: MoneyReceiptPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="money-receipt-print" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:static print:block print:bg-white print:p-0">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body > * { visibility: hidden !important; }
          #money-receipt-print, #money-receipt-print * { visibility: visible !important; }
          #money-receipt-print {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            background: #fff !important;
          }
          #money-receipt-print > div {
            max-width: none !important;
            max-height: none !important;
            width: 100% !important;
            overflow: visible !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      {/* Modal Container - Print safe styles added */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-w-none print:w-full print:h-auto print:shadow-none print:rounded-none">
        
        {/* Header & Actions Bar - Hidden during actual print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-bold">Money Receipt Print Preview</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Printer className="h-4 w-4" /> Print Receipt
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto flex-1 font-sans text-xs leading-relaxed print:p-0 print:overflow-visible">
          
          {/* Company Header */}
          <div className="border-b-2 border-emerald-600 pb-5 mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {data.companyName || "SARDAR LANDMARK & BUILDERS LTD."}
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {data.companyAddress || "Bepary Market, Pallabi, Mirpur, Dhaka-1216"}
              </p>
              <p className="text-[11px] text-slate-600">
                Phone: {data.companyPhone || "+880 2-966XXXX"} | Email: {data.companyEmail || "info@sobhagya.com"}
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                {data.companyBinTin || "BIN: 123456789-0123 | TIN: 9876543210"}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded text-[11px] uppercase tracking-wider mb-2">
                OFFICIAL MONEY RECEIPT
              </span>
              <p className="text-xs font-bold text-slate-800">
                MR No: <span className="font-mono text-emerald-700">{data.mrNo}</span>
              </p>
              <p className="text-xs text-slate-600">Date: {data.date}</p>
            </div>
          </div>

          {/* 2-Column Section: Client Info & Property Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            
            {/* Client Details Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-600" /> Received From
              </h3>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr>
                    <td className="py-1 text-slate-500 w-28 font-medium">Client Name:</td>
                    <td className="py-1 font-bold text-slate-800">{data.clientName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-500 font-medium">Contact Phone:</td>
                    <td className="py-1 font-mono font-semibold text-slate-800">{data.clientPhone}</td>
                  </tr>
                  {data.clientEmail && (
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">Email:</td>
                      <td className="py-1 text-slate-800">{data.clientEmail}</td>
                    </tr>
                  )}
                  {data.clientNid && (
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">NID / Passport:</td>
                      <td className="py-1 font-mono text-slate-800">{data.clientNid}</td>
                    </tr>
                  )}
                  {data.clientAddress && (
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">Address:</td>
                      <td className="py-1 text-slate-800">{data.clientAddress}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Property Details Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Property Details
              </h3>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr>
                    <td className="py-1 text-slate-500 w-28 font-medium">Project Name:</td>
                    <td className="py-1 font-bold text-emerald-800">{data.projectName}</td>
                  </tr>
                  {data.projectLocation && (
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">Location:</td>
                      <td className="py-1 text-slate-800">{data.projectLocation}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-1 text-slate-500 font-medium">Unit Code / Type:</td>
                    <td className="py-1 font-bold text-slate-900">{data.unitCode} ({data.unitType})</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-500 font-medium">Unit Size:</td>
                    <td className="py-1 font-semibold text-slate-800">{data.unitSize.toLocaleString("en-BD")} SFT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Details Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
              Payment Details
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 p-2 text-left">Description</th>
                  <th className="border border-slate-300 p-2 text-center w-28">Payment Mode</th>
                  <th className="border border-slate-300 p-2 text-center w-32">Reference No.</th>
                  <th className="border border-slate-300 p-2 text-right w-36">Amount (৳)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 text-slate-800">
                    {data.particulars || `Payment for ${data.projectName} - ${data.unitCode}`}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-semibold text-slate-700">
                    {data.paymentMode}
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-slate-700">
                    {data.referenceNo || "—"}
                  </td>
                  <td className="border border-slate-300 p-2 text-right font-bold text-emerald-700">
                    ৳ {data.amount.toLocaleString("en-BD")}
                  </td>
                </tr>
                {data.bankName && (
                  <tr>
                    <td className="border border-slate-300 p-2 text-slate-600 text-[10px]" colSpan={3}>
                      Bank: {data.bankName}
                    </td>
                    <td className="border border-slate-300 p-2 text-right"></td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold">
                  <td className="border border-slate-300 p-2 text-right" colSpan={3}>
                    TOTAL RECEIVED:
                  </td>
                  <td className="border border-slate-300 p-2 text-right text-emerald-700 text-sm">
                    ৳ {data.amount.toLocaleString("en-BD")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in Words */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-600 mb-1 font-semibold">Amount in Words:</p>
            <p className="text-sm font-bold text-emerald-800 uppercase">{data.amountInWords}</p>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-300">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 mb-1">Received By</p>
              <p className="text-xs font-semibold text-slate-800">{data.collectedBy}</p>
              <div className="mt-8 border-t border-slate-400 pt-1">
                <p className="text-[10px] text-slate-500">Signature</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 mb-1">Accountant</p>
              <div className="mt-8 border-t border-slate-400 pt-1">
                <p className="text-[10px] text-slate-500">Signature</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 mb-1">Authorized Signatory</p>
              <div className="mt-8 border-t border-slate-400 pt-1">
                <p className="text-[10px] text-slate-500">Signature & Stamp</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-center">
            <p>This is a computer-generated money receipt. No signature required for validity.</p>
            <p className="mt-1">For any queries, please contact our accounts department.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
