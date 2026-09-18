import React from "react";
import { Printer, X, Building2, User, FileText } from "lucide-react";

export interface BookingPrintData {
  bookingRef: string;
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
  // Financial Breakdown
  pricePerSft: number;
  parkingCharge: number;
  utilityCharge: number;
  grandTotal: number;
  bookingMoney: number;
  dueAmount: number;
  // Payment Details
  paymentMethod: string;
  depositAccount: string;
  salesExecutive?: string;
  amountInWords: string;
}

interface BookingPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BookingPrintData;
}

export default function BookingPrintModal({ isOpen, onClose, data }: BookingPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Container - Print safe styles added */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-w-none print:w-full print:h-auto print:shadow-none print:rounded-none">
        
        {/* Header & Actions Bar - Hidden during actual print */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-bold">Booking Money Receipt Print Preview</h2>
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
              <Printer className="h-4 w-4" /> Print Document
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
                Booking Money Receipt
              </span>
              <p className="text-xs font-bold text-slate-800">
                Ref: <span className="font-mono text-emerald-700">{data.bookingRef}</span>
              </p>
              <p className="text-xs text-slate-600">Date: {data.date}</p>
            </div>
          </div>

          {/* 2-Column Section: Client Info & Property Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            
            {/* Client Details Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-600" /> Client Details
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
                <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Project & Unit Details
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
                  {data.salesExecutive && (
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">Sales Executive:</td>
                      <td className="py-1 text-slate-800">{data.salesExecutive}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Pricing Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
              Property Pricing Breakdown
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 p-2 text-left">Description / Particulars</th>
                  <th className="border border-slate-300 p-2 text-center w-28">Rate (৳/SFT)</th>
                  <th className="border border-slate-300 p-2 text-center w-24">Size (SFT)</th>
                  <th className="border border-slate-300 p-2 text-right w-36">Total Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border border-slate-300 font-medium text-slate-800">
                    Base Unit Price ({data.unitCode})
                  </td>
                  <td className="p-2 border border-slate-300 text-center font-mono">৳{data.pricePerSft.toLocaleString("en-BD")}</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">{data.unitSize}</td>
                  <td className="p-2 border border-slate-300 text-right font-mono font-semibold">
                    ৳{(data.unitSize * data.pricePerSft).toLocaleString("en-BD")}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-slate-700" colSpan={3}>
                    Reserved Parking Space Charge
                  </td>
                  <td className="p-2 border border-slate-300 text-right font-mono">
                    ৳{data.parkingCharge.toLocaleString("en-BD")}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 text-slate-700" colSpan={3}>
                    Utility Connection & Legal Charges
                  </td>
                  <td className="p-2 border border-slate-300 text-right font-mono">
                    ৳{data.utilityCharge.toLocaleString("en-BD")}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="p-2.5 border border-slate-300 uppercase" colSpan={3}>
                    Grand Total Agreement Price
                  </td>
                  <td className="p-2.5 border border-slate-300 text-right font-mono text-sm text-emerald-800">
                    ৳{data.grandTotal.toLocaleString("en-BD")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Booking Collection & Payment Summary */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Booking Money Received</p>
                <p className="text-base font-extrabold text-emerald-700 font-mono">
                  ৳{data.bookingMoney.toLocaleString("en-BD")}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Payment Method</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{data.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Deposit Account</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{data.depositAccount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Agreement Balance Due</p>
                <p className="text-sm font-bold text-rose-600 font-mono mt-0.5">
                  ৳{data.dueAmount.toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            <div className="border-t border-emerald-200 pt-2.5 mt-2">
              <p className="text-[11px] text-slate-700 font-medium">
                <span className="font-bold text-slate-900">Amount in Words:</span> {data.amountInWords}
              </p>
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="text-[10px] text-slate-500 mb-12 space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. This receipt confirms the booking money deposit. Final allotment is subject to deed schedule signing.</p>
            <p>2. Cheque/Pay-Order payments are subject to actual bank realization.</p>
          </div>

          {/* Standard 4-Block Signatures */}
          <div className="grid grid-cols-4 gap-4 text-center mt-12 pt-4 page-break-inside-avoid">
            <div>
              <div className="border-b border-slate-400 mb-1 h-8"></div>
              <p className="font-bold text-slate-800 text-[11px]">Prepared By</p>
              <p className="text-[9px] text-slate-500">Signature & Date</p>
            </div>
            <div>
              <div className="border-b border-slate-400 mb-1 h-8"></div>
              <p className="font-bold text-slate-800 text-[11px]">Checked By</p>
              <p className="text-[9px] text-slate-500">Signature & Date</p>
            </div>
            <div>
              <div className="border-b border-slate-400 mb-1 h-8"></div>
              <p className="font-bold text-slate-800 text-[11px]">Approved By</p>
              <p className="text-[9px] text-slate-500">Authorized Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-400 mb-1 h-8"></div>
              <p className="font-bold text-slate-800 text-[11px]">Client Signature</p>
              <p className="text-[9px] text-slate-500">Received Copy</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}