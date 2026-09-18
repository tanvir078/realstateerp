import { Printer } from "lucide-react";

type LeaveRecord = { id: string; employeeName: string; leaveType: string; startDate: string; endDate: string; reason: string; status: string };

export default function LeavePrintModal({ isOpen, onClose, records }: { isOpen: boolean; onClose: () => void; records: LeaveRecord[] }) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div className="w-full max-w-5xl overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
      <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white print:hidden"><h2 className="text-sm font-bold">Leave Register Print Preview</h2><div className="flex gap-2"><button onClick={onClose} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800">Close</button><button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950"><Printer className="h-3.5 w-3.5" />Print Leave Register</button></div></div>
      <div className="p-8 print:p-5"><div className="mb-6 flex justify-between border-b-2 border-emerald-600 pb-4"><div><h1 className="text-xl font-black uppercase">SLBL ERP</h1><p className="text-xs text-slate-500">HR & Payroll - Leave Register</p></div><div className="text-right text-xs"><p className="font-bold">Leave Report</p><p className="text-slate-500">Records: {records.length}</p></div></div>
        <table className="w-full border-collapse text-xs"><thead><tr className="border-b-2 border-slate-300 text-left">{["#","Employee","Type","Start date","End date","Status","Reason"].map((heading) => <th key={heading} className="p-2">{heading}</th>)}</tr></thead><tbody>{records.map((record, index) => <tr key={record.id} className="border-b border-slate-200"><td className="p-2">{index + 1}</td><td className="p-2 font-semibold">{record.employeeName}</td><td className="p-2">{record.leaveType}</td><td className="p-2">{record.startDate}</td><td className="p-2">{record.endDate}</td><td className="p-2 font-semibold">{record.status}</td><td className="p-2">{record.reason}</td></tr>)}</tbody></table>
        {!records.length && <p className="py-10 text-center text-sm text-slate-500">No leave requests found.</p>}<div className="mt-12 flex justify-between text-xs text-slate-500"><span>Prepared from live leave requests</span><span>Authorized signature: __________________</span></div>
      </div>
    </div>
  </div>;
}
