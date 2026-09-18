import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Calendar, User, FileText, CheckCircle2
} from "lucide-react";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LeaveData) => void;
  employees: Array<{ id: string; employeeId: string; fullName: string }>;
}

export interface LeaveData {
  employeeId: string;
  leaveType: "CASUAL" | "SICK" | "EARNED" | "UNPAID";
  startDate: string;
  endDate: string;
  reason: string;
  reliever: string;
}

export default function ApplyLeaveModal({ 
  isOpen, 
  onClose, 
  onSave,
  employees,
}: ApplyLeaveModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState<"CASUAL" | "SICK" | "EARNED" | "UNPAID">("CASUAL");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState("");
  const [reliever, setReliever] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) setValidationError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!employeeId || !reason.trim() || endDate < startDate) {
      setValidationError(!employeeId ? "Employee is required." : endDate < startDate ? "End date cannot be before start date." : "Reason is required.");
      return;
    }
    const data: LeaveData = {
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      reliever
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Apply for Leave</h2>
              <p className="text-xs text-[#829B96]">Submit leave request for approval</p>
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
          
          {/* Employee Selection */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#10B981]" /> Employee <span className="text-rose-400">*</span>
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employeeId} - {employee.fullName}</option>)}
            </select>
          </div>

          {/* Leave Type */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Leave Type <span className="text-rose-400">*</span>
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as any)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="EARNED">Earned Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Start Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> End Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Reason for Leave <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Enter reason for leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Reliever / Handover To */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#10B981]" /> Reliever / Handover To (Optional)
            </label>
            <select
              value={reliever}
              onChange={(e) => setReliever(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
            >
              <option value="">Select Staff (Optional)</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employeeId} - {employee.fullName}</option>)}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3E37]">
            {validationError && <p className="mr-auto text-xs text-rose-400">{validationError}</p>}
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
              Submit Request
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
