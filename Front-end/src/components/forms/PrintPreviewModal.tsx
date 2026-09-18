import React from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Printer, FileText, Building2, User, 
  Calendar, DollarSign, Phone, Mail, MapPin
} from "lucide-react";
import Vendors from "@/pages/procurement/Vendors";
import Projects from "@/pages/Projects";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: {
    title: string;
    refNo: string;
    date: string;
    projectName?: string;
    clientName?: string;
    vendorName?: string;
    accountHead?: string;
    unitNo?: string;
    paymentMethod?: string;
    items: Array<{
      description: string;
      quantity?: number;
      unitPrice?: number;
      amount: number;
    }>;
    totalAmount: number;
    inWords: string;
  };
}

export default function PrintPreviewModal({ 
  isOpen, 
  onClose, 
  documentData 
}: PrintPreviewModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-8">
          
          {/* Modal Header (No Print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 no-print">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Print Preview</h2>
                <p className="text-xs text-gray-500">Review document before printing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 text-xs h-9 px-4"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Close
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-5 gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Document
              </Button>
            </div>
          </div>

          {/* Print Content */}
          <div id="print-content" className="space-y p-4 bg-white">
            
            {/* Document Header */}
            <div className="flex items-center justify-between bg-slate-900 px-4 py-4 text-white border-b-2 border-emerald-600">

                  <div className="flex items-center gap-2">
            {/* Logo */}
                <img 
                  src="/slblerp-logo.svg" 
                   className="h-20 w-20 object-contain" 
                     />
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h1 className="text-[16px] font-black tracking-wider text-white leading-tight uppercase font-serif">
                       SARDAR LANDMARK & BUILDERS LTD.
      </h1>                  <div className="flex items-center gap-1 text-sm text-white mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-200 font-serif">
                      BEPARY MARKET, PALLABI, MIRPUR, DHAKA-1216
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white mb-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>+880 2-966XXXX</span>
                    <span className="mx-2">|</span>
                    <Mail className="h-3.5 w-3.5" />
                    <span>info@sobhagya.com</span>
                  </div>
                  <div className="text-xs text-white">
                    BIN: 123456789-0123 | TIN: 9876543210
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">{documentData.projectName || 'N/A'}</div>
                 
                </div>
              </div>
            </div>


            {/* Document Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {documentData.title}
              </h2>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Reference No:</span>
                <span className="font-semibold text-gray-900">{documentData.refNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-900">{documentData.date}</span>
              </div>
              {documentData.projectName && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Project:</span>
                  <span className="font-semibold text-gray-900">{documentData.projectName}</span>
                </div>
              )}
              {documentData.unitNo && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Unit:</span>
                  <span className="font-semibold text-gray-900">{documentData.unitNo}</span>
                </div>
              )}
              {documentData.clientName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Client:</span>
                  <span className="font-semibold text-gray-900">{documentData.clientName}</span>
                </div>
              )}
              {documentData.vendorName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Vendor:</span>
                  <span className="font-semibold text-gray-900">{documentData.vendorName}</span>
                </div>
              )}
              {documentData.accountHead && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Account Head:</span>
                  <span className="font-semibold text-gray-900">{documentData.accountHead}</span>
                </div>
              )}
              {documentData.paymentMethod && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900">{documentData.paymentMethod}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Description</th>
                    {documentData.items.some(item => item.quantity !== undefined) && (
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Qty</th>
                    )}
                    {documentData.items.some(item => item.unitPrice !== undefined) && (
                      <th className="text-right py-2 px-3 font-semibold text-gray-900">Unit Price</th>
                    )}
                    <th className="text-right py-2 px-3 font-semibold text-gray-900">Amount (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-900">{item.description}</td>
                      {item.quantity !== undefined && (
                        <td className="text-center py-2 px-3 text-gray-900">{item.quantity}</td>
                      )}
                      {item.unitPrice !== undefined && (
                        <td className="text-right py-2 px-3 text-gray-900">{formatCurrency(item.unitPrice)}</td>
                      )}
                      <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-900">
                    <td 
                      colSpan={
                        1 + 
                        (documentData.items.some(item => item.quantity !== undefined) ? 1 : 0) +
                        (documentData.items.some(item => item.unitPrice !== undefined) ? 1 : 0)
                      }
                      className="py-3 px-3 text-right font-bold text-gray-900"
                    >
                      Total:
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900 text-lg">
                      {formatCurrency(documentData.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Amount in Words */}
            <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Amount in Words:</span> {documentData.inWords}
              </p>
            </div>

            {/* Signature Boxes */}
            <div className="grid grid-cols-4 gap-4 mt-12 pt-8">
              <div className="text-center">
                <div className="border-t-2 border-gray-900 pt-2">
                  <p className="text-sm font-semibold text-gray-900">Prepared By</p>
                  <p className="text-xs text-gray-500 mt-1">Signature & Date</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-900 pt-2">
                  <p className="text-sm font-semibold text-gray-900">Checked By</p>
                  <p className="text-xs text-gray-500 mt-1">Signature & Date</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-900 pt-2">
                  <p className="text-sm font-semibold text-gray-900">Approved By</p>
                  <p className="text-xs text-gray-500 mt-1">Signature & Date</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-900 pt-2">
                  <p className="text-sm font-semibold text-gray-900">Received By</p>
                  <p className="text-xs text-gray-500 mt-1">Signature & Date</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
