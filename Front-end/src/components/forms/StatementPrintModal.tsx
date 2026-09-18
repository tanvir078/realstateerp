import { ReactNode } from "react";
import { X, Printer, FileText } from "lucide-react";

interface StatementPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function StatementPrintModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: StatementPrintModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #statement-print-content, #statement-print-content * { visibility: visible !important; }
          #statement-print-content {
            position: absolute;
            inset: 0;
            width: 100%;
            background: white !important;
            color: #111827 !important;
          }
          .statement-print-no-print { display: none !important; }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4">
        <div className="my-8 w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="statement-print-no-print flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{title} Print Preview</h2>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-xs text-gray-700">
                <X className="h-3.5 w-3.5" /> Close
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
            </div>
          </div>
          <div id="statement-print-content" className="bg-white p-8 text-gray-900">
            <div className="mb-6 flex items-start justify-between border-b-2 border-emerald-700 pb-4">
              <div>
                <h1 className="text-xl font-bold tracking-wide">SARDAR LANDMARK &amp; BUILDERS LTD.</h1>
                <p className="mt-1 text-xs text-gray-500">BEPARY MARKET, PALLABI, MIRPUR, DHAKA-1216</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            </div>
            {children}
            <p className="mt-8 border-t border-gray-200 pt-3 text-[10px] text-gray-500">
              Printed from SLBL ERP
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
