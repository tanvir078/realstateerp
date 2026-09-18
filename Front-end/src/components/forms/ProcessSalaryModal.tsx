import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Calendar, DollarSign, CheckCircle2, AlertCircle
} from "lucide-react";

interface ProcessSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SalaryData) => void;
}

interface SalaryData {
  month: string;
  year: string;
  workingDays: number;
  overtimeAmount: number;
  salaryAdvanceDeduction: number;
  providentFundDeduction: number;
}

export default function ProcessSalaryModal({ 
  isOpen, 
  onClose, 
  onSave 
}: ProcessSalaryModalProps) {
  const [month, setMonth] = useState("September");
  const [year, setYear] = useState("2026");
  const [workingDays, setWorkingDays] = useState("30");
  const [overtimeAmount, setOvertimeAmount] = useState("0");
  const [salaryAdvanceDeduction, setSalaryAdvanceDeduction] = useState("0");
  const [providentFundDeduction, setProvidentFundDeduction] = useState("10");

  if (!isOpen) return null;

  const handleSave = () => {
    const data: SalaryData = {
      month,
      year,
      workingDays: parseInt(workingDays),
      overtimeAmount: parseFloat(overtimeAmount),
      salaryAdvanceDeduction: parseFloat(salaryAdvanceDeduction),
      providentFundDeduction: parseFloat(providentFundDeduction)
    };
    onSave(data);
    onClose();
  };

  const calculateNetPayable = () => {
    // This would calculate based on employee data
    return "৳ 2,10,000";
  };

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
              <h2 className="text-base font-bold text-white">Run Monthly Payroll</h2>
              <p className="text-xs text-[#829B96]">Generate salary sheet for selected month</p>
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
          
          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Month <span className="text-rose-400">*</span>
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Year <span className="text-rose-400">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>

          {/* Working Days */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Working Days <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 30"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
            <p className="text-[10px] text-[#829B96]">Auto-calculated from calendar (excluding weekends & holidays)</p>
          </div>

          {/* Overtime / Bonus */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Overtime / Bonus Amount (৳)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={overtimeAmount}
              onChange={(e) => setOvertimeAmount(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Salary Advance / Loan Deduction */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-[#10B981]" /> Salary Advance / Loan Deduction (৳)
            </label>
            <input
              type="number"
              placeholder="Auto-fetched from active loans"
              value={salaryAdvanceDeduction}
              onChange={(e) => setSalaryAdvanceDeduction(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
            <p className="text-[10px] text-[#829B96]">Auto-fetched from active loan records</p>
          </div>

          {/* Provident Fund Deduction */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Provident Fund Deduction (%)
            </label>
            <input
              type="number"
              placeholder="Standard 10%"
              value={providentFundDeduction}
              onChange={(e) => setProvidentFundDeduction(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
            <p className="text-[10px] text-[#829B96]">Standard 10% of basic salary (customizable)</p>
          </div>

          {/* Preview Summary */}
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
            <p className="text-[10px] text-[#829B96] font-medium uppercase tracking-wider">Preview Summary</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#829B96]">Total Employees:</span>
                <span className="text-white">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Total Payable:</span>
                <span className="text-[#10B981] font-semibold">{calculateNetPayable()}</span>
              </div>
            </div>
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
              Generate & Approve
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
