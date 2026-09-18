import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createLeave, createLoan, createPerformance, getEmployees, getLeaves, getLoans, getPerformance, approveLeave, rejectLeave, repayLoan } from "@/services/hr.service";

export default function LoansPerformance() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ employeeId: "", leaveType: "CASUAL", startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10), reason: "", loanType: "SALARY_ADVANCE", principal: "", installmentAmount: "", period: "", rating: "3", reviewer: "", comments: "" });

  const load = async () => {
    try {
      const [staff, leaveRows, loanRows, performanceRows] = await Promise.all([getEmployees(), getLeaves(), getLoans(), getPerformance()]);
      setEmployees(staff); setLeaves(leaveRows); setLoans(loanRows); setReviews(performanceRows);
      if (!form.employeeId && staff[0]) setForm((current) => ({ ...current, employeeId: staff[0].id }));
    } catch (reason: any) { setError(reason.message); }
  };
  useEffect(() => { load(); }, []);
  const employeeName = (id: string) => employees.find((employee) => employee.id === id)?.fullName ?? id;
  const change = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submitLeave = async () => { await createLeave({ employeeId: form.employeeId, leaveType: form.leaveType, startDate: form.startDate, endDate: form.endDate, reason: form.reason }); await load(); };
  const submitLoan = async () => { await createLoan({ employeeId: form.employeeId, loanType: form.loanType, principal: Number(form.principal), installmentAmount: Number(form.installmentAmount), startDate: form.startDate }); await load(); };
  const submitReview = async () => { await createPerformance({ employeeId: form.employeeId, period: form.period, rating: Number(form.rating), reviewer: form.reviewer, comments: form.comments }); await load(); };
  const run = (operation: () => Promise<unknown>) => operation().catch((reason: any) => setError(reason.message));

  return <div className="w-full space-y-6 text-[#E2E8F0]">
    <header className="border-b border-[#1E3E37] pb-4"><h1 className="text-2xl font-bold text-white">Leave, Loans & Performance</h1><p className="mt-1 text-xs text-[#829B96]">Live HR workflows backed by the API</p></header>
    {error && <p className="text-sm text-rose-400">{error}</p>}
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="font-semibold text-white">Leave request</h2><select value={form.employeeId} onChange={(event) => change("employeeId", event.target.value)} className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white">{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employeeId} - {employee.fullName}</option>)}</select><select value={form.leaveType} onChange={(event) => change("leaveType", event.target.value)} className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white"><option>CASUAL</option><option>SICK</option><option>EARNED</option><option>UNPAID</option></select><div className="grid grid-cols-2 gap-2"><input type="date" value={form.startDate} onChange={(event) => change("startDate", event.target.value)} className="rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><input type="date" value={form.endDate} onChange={(event) => change("endDate", event.target.value)} className="rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /></div><textarea value={form.reason} onChange={(event) => change("reason", event.target.value)} placeholder="Reason" className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><button onClick={() => run(submitLeave)} className="rounded bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950">Submit leave</button></div>
      <div className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="font-semibold text-white">Employee loan</h2><select value={form.employeeId} onChange={(event) => change("employeeId", event.target.value)} className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white">{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employeeId} - {employee.fullName}</option>)}</select><input value={form.loanType} onChange={(event) => change("loanType", event.target.value)} placeholder="Loan type" className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><div className="grid grid-cols-2 gap-2"><input type="number" value={form.principal} onChange={(event) => change("principal", event.target.value)} placeholder="Principal" className="rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><input type="number" value={form.installmentAmount} onChange={(event) => change("installmentAmount", event.target.value)} placeholder="Installment" className="rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /></div><button onClick={() => run(submitLoan)} className="rounded bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950">Create loan</button></div>
      <div className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="font-semibold text-white">Performance review</h2><select value={form.employeeId} onChange={(event) => change("employeeId", event.target.value)} className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white">{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.employeeId} - {employee.fullName}</option>)}</select><input value={form.period} onChange={(event) => change("period", event.target.value)} placeholder="Period e.g. 2026-Q3" className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><div className="grid grid-cols-2 gap-2"><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => change("rating", event.target.value)} placeholder="Rating / 5" className="rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><input value={form.reviewer} onChange={(event) => change("reviewer", event.target.value)} placeholder="Reviewer" className="rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /></div><textarea value={form.comments} onChange={(event) => change("comments", event.target.value)} placeholder="Comments" className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" /><button onClick={() => run(submitReview)} className="rounded bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950">Submit review</button></div>
    </section>
    <section className="grid gap-4 lg:grid-cols-3">
      <List title="Leave requests">{leaves.map((leave) => <div key={leave.id} className="border-b border-[#1E3E37] py-3 text-xs"><p className="text-white">{employeeName(leave.employeeId)} · {leave.leaveType}</p><p className="text-[#829B96]">{leave.startDate} to {leave.endDate} · {leave.status}</p>{leave.status === "PENDING" && <div className="mt-2 flex gap-2"><button onClick={() => run(async () => { await approveLeave(leave.id); await load(); })} className="text-emerald-400">Approve</button><button onClick={() => run(async () => { await rejectLeave(leave.id); await load(); })} className="text-rose-400">Reject</button></div>}</div>)}</List>
      <List title="Loans">{loans.map((loan) => <div key={loan.id} className="border-b border-[#1E3E37] py-3 text-xs"><p className="text-white">{employeeName(loan.employeeId)} · {loan.loanType}</p><p className="text-[#829B96]">Outstanding: ৳ {Number(loan.outstanding).toLocaleString("en-BD")}</p>{loan.status === "ACTIVE" && <button onClick={() => run(async () => { await repayLoan(loan.id, { amount: Math.min(Number(loan.installmentAmount), Number(loan.outstanding)), paymentDate: new Date().toISOString().slice(0, 10) }); await load(); })} className="mt-2 text-amber-400">Record installment</button>}</div>)}</List>
      <List title="Performance reviews">{reviews.map((review) => <div key={review.id} className="border-b border-[#1E3E37] py-3 text-xs"><p className="text-white">{employeeName(review.employeeId)} · {review.period}</p><p className="text-[#829B96]">Rating: {review.rating}/5 · {review.status}</p><p className="mt-1 text-[#829B96]">{review.comments}</p></div>)}</List>
    </section>
  </div>;
}

function List({ title, children }: { title: string; children: ReactNode }) {
  return <div className="min-h-40 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="mb-2 font-semibold text-white">{title}</h2>{children || <p className="py-6 text-xs text-[#829B96]">No records found.</p>}</div>;
}
