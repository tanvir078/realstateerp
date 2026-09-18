import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Calendar, User, CheckCircle2, Clock
} from "lucide-react";

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AttendanceData) => void;
  employees: Array<{ id: string; employeeId: string; fullName: string }>;
  initialRecord?: AttendanceData & { id: string };
}

export interface AttendanceData {
  id?: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE";
  notes: string;
}

export default function ManualAttendanceModal({ 
  isOpen, 
  onClose, 
  onSave,
  employees,
  initialRecord,
}: ManualAttendanceModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState<"PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE">("PRESENT");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setEmployeeId(initialRecord?.employeeId ?? "");
    setDate(initialRecord?.date ?? new Date().toISOString().split("T")[0]);
    setCheckIn(initialRecord?.checkIn ?? "");
    setCheckOut(initialRecord?.checkOut ?? "");
    setStatus(initialRecord?.status ?? "PRESENT");
    setNotes(initialRecord?.notes ?? "");
    setValidationError("");
  }, [isOpen, initialRecord]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!employeeId || !date) {
      setValidationError("Employee and date are required.");
      return;
    }
    const data: AttendanceData = {
      id: initialRecord?.id,
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      notes
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
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Manual Attendance Entry</h2>
              <p className="text-xs text-[#829B96]">Record attendance for site staff manually</p>
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
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.employeeId} - {employee.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Check In / Check Out */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#10B981]" /> Check In
              </label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#10B981]" /> Check Out
              </label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#10B981]" /> Status <span className="text-rose-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="ABSENT">Absent</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
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
            {validationError && <p className="mr-auto text-xs text-rose-400">{validationError}</p>}
            <Button
              onClick={handleSave}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {initialRecord ? "Save Correction" : "Record Attendance"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
