import { Printer, X } from "lucide-react";
import { AttendanceData } from "./ManualAttendanceModal";

type AttendancePrintRecord = AttendanceData & {
  id: string;
  employeeName: string;
  employeeCode: string;
  siteLocation?: string;
};

interface AttendancePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  records: AttendancePrintRecord[];
}

export default function AttendancePrintModal({ isOpen, onClose, date, records }: AttendancePrintModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
        <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white print:hidden">
          <h2 className="text-sm font-bold">Attendance Print Preview</h2>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800">Close</button>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950"><Printer className="h-3.5 w-3.5" />Print Attendance</button>
          </div>
        </div>
        <div className="p-8 print:p-5">
          <div className="mb-6 flex items-start justify-between border-b-2 border-emerald-600 pb-4">
            <div><h1 className="text-xl font-black uppercase">SLBL ERP</h1><p className="text-xs text-slate-500">HR & Payroll - Attendance Register</p></div>
            <div className="text-right text-xs"><p className="font-bold">Attendance Report</p><p className="text-slate-500">Period: {date}</p><p className="text-slate-500">Records: {records.length}</p></div>
          </div>
          <table className="w-full border-collapse text-xs">
            <thead><tr className="border-b-2 border-slate-300 text-left"><th className="p-2">#</th><th className="p-2">Employee</th><th className="p-2">Employee ID</th><th className="p-2">Check in</th><th className="p-2">Check out</th><th className="p-2">Status</th><th className="p-2">Location</th></tr></thead>
            <tbody>{records.map((record, index) => <tr key={record.id} className="border-b border-slate-200"><td className="p-2">{index + 1}</td><td className="p-2 font-semibold">{record.employeeName}</td><td className="p-2">{record.employeeCode}</td><td className="p-2">{record.checkIn || "-"}</td><td className="p-2">{record.checkOut || "-"}</td><td className="p-2 font-semibold">{record.status}</td><td className="p-2">{record.siteLocation || "-"}</td></tr>)}</tbody>
          </table>
          {!records.length && <p className="py-10 text-center text-sm text-slate-500">No attendance records found for this date.</p>}
          <div className="mt-12 flex justify-between text-xs text-slate-500"><span>Prepared from live attendance records</span><span>Authorized signature: __________________</span></div>
        </div>
      </div>
    </div>
  );
}
