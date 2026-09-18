import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock3, Edit3, Plus, Printer, Search, Users } from "lucide-react";
import ManualAttendanceModal, { AttendanceData } from "@/components/forms/ManualAttendanceModal";
import AttendancePrintModal from "@/components/forms/AttendancePrintModal";
import ApplyLeaveModal, { LeaveData } from "@/components/forms/ApplyLeaveModal";
import LeavePrintModal from "@/components/forms/LeavePrintModal";
import { approveLeave, createLeave, getAttendance, getEmployees, getLeaves, recordAttendance, rejectLeave, updateAttendance } from "@/services/hr.service";

type Employee = { id: string; employeeId: string; fullName: string; department: string };
type Attendance = AttendanceData & { id: string; siteLocation?: string };
type Leave = LeaveData & { id: string; status: string; decisionNote?: string };

const statusStyles: Record<string, string> = {
  PRESENT: "text-emerald-400",
  LATE: "text-amber-400",
  ABSENT: "text-rose-400",
  ON_LEAVE: "text-sky-400",
};

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reportMode, setReportMode] = useState<"DAILY" | "MONTHLY" | "RANGE">("DAILY");
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Attendance | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [printOpen, setPrintOpen] = useState(false);
  const [tab, setTab] = useState<"attendance" | "leave">("attendance");
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leavePrintOpen, setLeavePrintOpen] = useState(false);
  const [leaveStatus, setLeaveStatus] = useState("ALL");
  const reportPeriod = reportMode === "DAILY" ? date : reportMode === "MONTHLY" ? date.slice(0, 7) : `${fromDate} to ${toDate}`;

  const load = async () => {
    setLoading(true);
    try {
      const [staff, attendance, leaveRows] = await Promise.all([getEmployees(), getAttendance(), getLeaves()]);
      setEmployees(staff);
      setRecords(attendance);
      setLeaves(leaveRows);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const names = useMemo(() => new Map(employees.map((employee) => [employee.id, employee])), [employees]);
  const filtered = useMemo(() => records.filter((record) => {
    const employee = names.get(record.employeeId);
    const matchesSearch = `${employee?.fullName ?? ""} ${employee?.employeeId ?? ""}`.toLowerCase().includes(search.toLowerCase());
    const inPeriod = reportMode === "DAILY" ? record.date === date : reportMode === "MONTHLY" ? record.date.startsWith(date.slice(0, 7)) : record.date >= fromDate && record.date <= toDate;
    return inPeriod && matchesSearch && (statusFilter === "ALL" || record.status === statusFilter);
  }), [records, names, date, search, statusFilter, reportMode, fromDate, toDate]);

  const summary = useMemo(() => ({
    total: filtered.length,
    present: filtered.filter((record) => record.status === "PRESENT").length,
    late: filtered.filter((record) => record.status === "LATE").length,
    absent: filtered.filter((record) => record.status === "ABSENT").length,
  }), [filtered]);

  const save = async (data: AttendanceData) => {
    try {
      if (data.id) await updateAttendance(data.id, data);
      else await recordAttendance(data);
      setOpen(false);
      setEditing(undefined);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save attendance.");
    }
  };

  const openCreate = () => { setEditing(undefined); setOpen(true); };
  const openEdit = (record: Attendance) => { setEditing(record); setOpen(true); };
  const leaveName = (id: string) => names.get(id)?.fullName ?? id;
  const filteredLeaves = useMemo(() => leaves.filter((leave) => leaveStatus === "ALL" || leave.status === leaveStatus), [leaves, leaveStatus]);
  const saveLeave = async (data: LeaveData) => {
    try { await createLeave(data); setLeaveOpen(false); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to submit leave."); }
  };
  const decideLeave = async (leave: Leave, action: "approve" | "reject") => {
    try { if (action === "approve") await approveLeave(leave.id); else await rejectLeave(leave.id); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update leave."); }
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <header className="flex items-center justify-between border-b border-[#1E3E37] pb-4">
        <div><h1 className="text-2xl font-bold text-white">Attendance</h1><p className="text-xs text-[#829B96]">Live attendance records and daily corrections</p></div>
        <div className="flex items-center gap-2">
          {tab === "attendance" ? <><button onClick={() => setPrintOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-[#1E3E37] bg-[#112421] px-3 py-2 text-xs font-semibold text-white hover:border-[#10B981]"><Printer className="h-4 w-4" />Print</button><button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950"><Plus className="h-4 w-4" />Record Attendance</button></> : <><button onClick={() => setLeavePrintOpen(true)} className="flex items-center gap-1.5 rounded-lg border border-[#1E3E37] bg-[#112421] px-3 py-2 text-xs font-semibold text-white hover:border-[#10B981]"><Printer className="h-4 w-4" />Print</button><button onClick={() => setLeaveOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950"><Plus className="h-4 w-4" />Apply Leave</button></>}
        </div>
      </header>
      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>}
      <div className="flex gap-1 rounded-lg border border-[#1E3E37] bg-[#112421] p-1"><button onClick={() => setTab("attendance")} className={`rounded-md px-4 py-2 text-xs font-semibold ${tab === "attendance" ? "bg-[#10B981] text-slate-950" : "text-[#829B96]"}`}>Attendance</button><button onClick={() => setTab("leave")} className={`rounded-md px-4 py-2 text-xs font-semibold ${tab === "leave" ? "bg-[#10B981] text-slate-950" : "text-[#829B96]"}`}>Leave</button></div>
      {tab === "leave" ? <><div className="flex items-center justify-between rounded-xl border border-[#1E3E37] bg-[#112421] p-3"><p className="text-xs text-[#829B96]">Live leave requests: <span className="font-semibold text-white">{leaves.length}</span></p><select value={leaveStatus} onChange={(event) => setLeaveStatus(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></div><div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Employee","Type","Start date","End date","Reason","Status","Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#1E3E37]">{filteredLeaves.map((leave) => <tr key={leave.id}><td className="p-3 text-white">{leaveName(leave.employeeId)}</td><td className="p-3 text-[#829B96]">{leave.leaveType}</td><td className="p-3 text-[#829B96]">{leave.startDate}</td><td className="p-3 text-[#829B96]">{leave.endDate}</td><td className="max-w-xs p-3 text-[#829B96]">{leave.reason}</td><td className="p-3 font-semibold text-emerald-400">{leave.status}</td><td className="p-3">{leave.status === "PENDING" && <div className="flex gap-2"><button onClick={() => void decideLeave(leave, "approve")} className="text-emerald-400 hover:text-white">Approve</button><button onClick={() => void decideLeave(leave, "reject")} className="text-rose-400 hover:text-white">Reject</button></div>}</td></tr>)}{!filteredLeaves.length && <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">No leave requests found.</td></tr>}</tbody></table></div></> : <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Total records", summary.total, Users], ["Present", summary.present, CheckCircle2], ["Late", summary.late, Clock3], ["Absent", summary.absent, Calendar]].map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><Icon className="mb-2 h-4 w-4 text-[#10B981]" /><p className="text-xs text-[#829B96]">{label as string}</p><p className="text-xl font-bold text-white">{value as number}</p></div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-3 md:flex-row md:flex-wrap">
        <select value={reportMode} onChange={(event) => setReportMode(event.target.value as "DAILY" | "MONTHLY" | "RANGE")} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white"><option value="DAILY">Daily</option><option value="MONTHLY">Monthly</option><option value="RANGE">Date range</option></select>
        {reportMode === "RANGE" ? <><label className="flex items-center gap-2 text-xs text-[#829B96]">From <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="flex items-center gap-2 text-xs text-[#829B96]">To <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label></> : <label className="flex items-center gap-2 text-xs text-[#829B96]"><Calendar className="h-3.5 w-3.5" /><input type={reportMode === "MONTHLY" ? "month" : "date"} value={reportMode === "MONTHLY" ? date.slice(0, 7) : date} onChange={(event) => setDate(reportMode === "MONTHLY" ? `${event.target.value}-01` : event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label>}
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#829B96]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee..." className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-xs text-white" /></div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white"><option value="ALL">All statuses</option><option value="PRESENT">Present</option><option value="LATE">Late</option><option value="ABSENT">Absent</option><option value="ON_LEAVE">On leave</option></select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
        <table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Employee", "Date", "Check in", "Check out", "Status", "Location", "Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#1E3E37]">{loading ? <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">Loading attendance...</td></tr> : filtered.map((record) => { const employee = names.get(record.employeeId); return <tr key={record.id}><td className="p-3 text-white">{employee?.fullName ?? record.employeeId}<span className="block text-[#829B96]">{employee?.employeeId}</span></td><td className="p-3 text-[#829B96]">{record.date}</td><td className="p-3 text-white">{record.checkIn || "-"}</td><td className="p-3 text-white">{record.checkOut || "-"}</td><td className={`p-3 font-semibold ${statusStyles[record.status] ?? "text-[#829B96]"}`}>{record.status}</td><td className="p-3 text-[#829B96]">{record.siteLocation || "-"}</td><td className="p-3"><button onClick={() => openEdit(record)} className="inline-flex items-center gap-1 text-[#10B981] hover:text-white"><Edit3 className="h-3.5 w-3.5" />Correct</button></td></tr>; })}{!loading && !filtered.length && <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">No attendance records found for this date.</td></tr>}</tbody>
        </table>
      </div>
      </>}
      <ManualAttendanceModal isOpen={open} onClose={() => { setOpen(false); setEditing(undefined); }} onSave={save} employees={employees} initialRecord={editing} />
      <ApplyLeaveModal isOpen={leaveOpen} onClose={() => setLeaveOpen(false)} onSave={saveLeave} employees={employees} />
      <AttendancePrintModal isOpen={printOpen} onClose={() => setPrintOpen(false)} date={reportPeriod} records={filtered.map((record) => ({ ...record, employeeName: names.get(record.employeeId)?.fullName ?? record.employeeId, employeeCode: names.get(record.employeeId)?.employeeId ?? record.employeeId }))} />
      <LeavePrintModal isOpen={leavePrintOpen} onClose={() => setLeavePrintOpen(false)} records={filteredLeaves.map((leave) => ({ ...leave, employeeName: leaveName(leave.employeeId) }))} />
    </div>
  );
}
