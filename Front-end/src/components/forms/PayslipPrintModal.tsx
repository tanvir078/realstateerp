import { Button } from "@/components/ui/Button";
import { 
  X, Printer
} from "lucide-react";

interface PayslipPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryData: SalaryData | null;
}

interface SalaryData {
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  location: string;
  bankAccount: string;
  month: string;
  year: string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  siteAllowance: number;
  totalGross: number;
  providentFund: number;
  incomeTax: number;
  salaryAdvance: number;
  unpaidLeavePenalty: number;
  totalDeduction: number;
  netPayable: number;
}

export default function PayslipPrintModal({ 
  isOpen, 
  onClose, 
  salaryData 
}: PayslipPrintModalProps) {
  if (!isOpen || !salaryData) return null;

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  const handlePrint = () => {
    window.print();
  };

  const convertToWords = (amount: number) => {
    // Simple conversion for display
    return `Amount in words would be displayed here for ${formatCurrency(amount)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Salary Payslip</h2>
              <p className="text-xs text-gray-600">Official salary statement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Payslip Content */}
        <div className="p-6 space-y-4 text-xs text-gray-900">
          
          {/* Company Header */}
          <div className="flex items-center justify-between bg-slate-900 px-6 py-5 text-white border-b-4 border-emerald-600 rounded-t-lg">
            {/* Left Side: Logo & Company Info */}
            <div className="flex items-center gap-3">
              {/* Logo */}
              <img 
                src="/slblerp-logo.svg" 
                alt="Sardar Landmark Logo" 
                className="h-24 w-24 object-contain" 
              />

              {/* Company Text Details */}
              <div className="space-y-1.5">
                <h1 className="text-[18px] font-black tracking-wider text-white leading-tight uppercase font-serif">
                  SARDAR LANDMARK & BUILDERS LTD.
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-200 font-serif">
                  BEPARY MARKET, PALLABI, MIRPUR, DHAKA-1216
                </p>

                {/* Contact Info Row */}
                <div className="pt-1 space-y-0.5 text-[11px] font-medium text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
                      ✉
                    </span>
                    <span>E-mail: sardarbuilders21@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                      📞
                    </span>
                    <span>Phone: 01643-010263, 01405-857553</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: PAYSLIP Title & Date */}
            <div className="flex flex-col items-center justify-center text-center pl-6 border-l border-emerald-400">
              <h2 className="text-3xl font-black tracking-widest text-white uppercase leading-none font-sans">
                PAYSLIP
              </h2>
              <span className="text-sm font-bold tracking-widest text-gray-200 mt-2 uppercase font-mono">
                {salaryData.month} {salaryData.year}
              </span>
            </div>
          </div>

          {/* Employee Details */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Employee Name</p>
                <p className="text-sm font-bold text-gray-900">{salaryData.employeeName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Employee ID</p>
                <p className="text-sm font-mono font-bold text-gray-900">{salaryData.employeeId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Designation</p>
                <p className="text-sm font-bold text-gray-900">{salaryData.designation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Department</p>
                <p className="text-sm font-bold text-gray-900">{salaryData.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Location</p>
                <p className="text-sm font-bold text-gray-900">{salaryData.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Bank A/C No</p>
                <p className="text-sm font-mono font-bold text-gray-900">{salaryData.bankAccount}</p>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border-2 border-emerald-500 rounded-lg overflow-hidden">
              <div className="bg-emerald-500 px-4 py-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">EARNINGS (৳)</h3>
              </div>
              <div className="p-4 space-y-2 bg-emerald-50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Basic Salary</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.basicSalary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">House Rent Allowance</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.houseRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Medical Allowance</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.medicalAllowance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Site Hardship Allowance</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.siteAllowance)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-emerald-300">
                  <span className="text-gray-900 font-bold uppercase tracking-wider">TOTAL GROSS</span>
                  <span className="font-mono font-bold text-emerald-600 text-base">{formatCurrency(salaryData.totalGross)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border-2 border-rose-500 rounded-lg overflow-hidden">
              <div className="bg-rose-500 px-4 py-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">DEDUCTIONS (৳)</h3>
              </div>
              <div className="p-4 space-y-2 bg-rose-50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Provident Fund (PF)</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.providentFund)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Income Tax Deducted</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.incomeTax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Salary Advance Adjustment</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.salaryAdvance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Unpaid Leave Penalty</span>
                  <span className="font-mono font-bold text-gray-900">{formatCurrency(salaryData.unpaidLeavePenalty)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-rose-300">
                  <span className="text-gray-900 font-bold uppercase tracking-wider">TOTAL DEDUCTION</span>
                  <span className="font-mono font-bold text-rose-600 text-base">{formatCurrency(salaryData.totalDeduction)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Payable */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 border-4 border-emerald-600 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-white uppercase tracking-wider">NET PAYABLE AMOUNT</span>
                <p className="text-xs text-gray-300 mt-1">In Words: {convertToWords(salaryData.netPayable)}</p>
              </div>
              <span className="text-3xl font-black text-white">{formatCurrency(salaryData.netPayable)}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t-2 border-gray-300">
            <div className="text-center">
              <div className="h-16 border-b-2 border-gray-400 mb-2"></div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Prepared By</p>
              <p className="text-[10px] text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <div className="h-16 border-b-2 border-gray-400 mb-2"></div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Checked By</p>
              <p className="text-[10px] text-gray-400 mt-1">Accounts Dept.</p>
            </div>
            <div className="text-center">
              <div className="h-16 border-b-2 border-gray-400 mb-2"></div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Approved</p>
              <p className="text-[10px] text-gray-400 mt-1">Managing Director</p>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 text-xs h-9 px-4"
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-[#10B981] hover:bg-[#0D9668] text-white font-bold text-xs h-9 px-5 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Payslip
          </Button>
        </div>

      </div>
    </div>
  );
}
