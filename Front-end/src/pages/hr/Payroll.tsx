import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle, FileText, Loader2, Printer, X } from "lucide-react";
import { createPayroll, approvePayroll, getPayroll, getPayslip, getPayslips, postPayroll, payPayroll } from "@/services/hr.service";
import PayslipPrintModal from "@/components/forms/PayslipPrintModal";

type PayrollRun = { id: string; payrollNo: string; month: string; year: string; grossAmount: number; totalDeduction: number; netPayable: number; paidAmount: number; status: string };
type Payslip = { id: string; payslipNo: string; employeeName: string; employeeCode: string; department: string; designation: string; month: string; year: string; basicSalary: number; houseRent: number; medicalAllowance: number; siteAllowance: number; allowances: number; grossAmount: number; providentFund: number; otherDeduction: number; totalDeduction: number; netPayable: number; payrollStatus: string };

const money = (value: number) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

export default function PayrollPage() {
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [month, setMonth] = useState(new Date().toLocaleString("en-US", { month: "long" }));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [pfPercent, setPfPercent] = useState("10");
  const [otherDeduction, setOtherDeduction] = useState("0");
  const [activeTab, setActiveTab] = useState<"PAYROLL" | "PAYSLIPS">("PAYROLL");
  const [payslipSearch, setPayslipSearch] = useState("");
  const [paymentRun, setPaymentRun] = useState<PayrollRun | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const load = async () => {
    setLoading(true);
    try {
      const [payrollRows, payslipRows] = await Promise.all([getPayroll(), getPayslips()]);
      setRuns(payrollRows);
      setPayslips(payslipRows);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load payroll.");
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const create = async () => {
    setBusy(true);
    try {
      await createPayroll({ month, year, providentFundPercent: Number(pfPercent), otherDeduction: Number(otherDeduction) });
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to generate payroll."); }
    finally { setBusy(false); }
  };

  const action = async (type: "approve" | "post", id: string) => {
    setBusy(true);
    try { if (type === "approve") await approvePayroll(id); else await postPayroll(id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update payroll."); }
    finally { setBusy(false); }
  };

  const submitPayment = async () => {
    if (!paymentRun || Number(paymentAmount) <= 0) return;
    setBusy(true);
    try {
      await payPayroll(paymentRun.id, { amount: Number(paymentAmount), paymentDate: new Date().toISOString().slice(0, 10), paymentMethod });
      setPaymentRun(null); setPaymentAmount(""); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to record salary payment."); }
    finally { setBusy(false); }
  };

  const visiblePayslips = useMemo(() => payslips.filter((slip) => `${slip.employeeName} ${slip.employeeCode} ${slip.payslipNo}`.toLowerCase().includes(payslipSearch.toLowerCase())), [payslips, payslipSearch]);
  const printData = selectedPayslip ? { employeeName: selectedPayslip.employeeName, employeeId: selectedPayslip.employeeCode, designation: selectedPayslip.designation, department: selectedPayslip.department, location: "-", bankAccount: "-", month: selectedPayslip.month, year: selectedPayslip.year, basicSalary: Number(selectedPayslip.basicSalary), houseRent: Number(selectedPayslip.houseRent), medicalAllowance: Number(selectedPayslip.medicalAllowance), siteAllowance: Number(selectedPayslip.siteAllowance), totalGross: Number(selectedPayslip.grossAmount), providentFund: Number(selectedPayslip.providentFund), incomeTax: 0, salaryAdvance: Number(selectedPayslip.otherDeduction), unpaidLeavePenalty: 0, totalDeduction: Number(selectedPayslip.totalDeduction), netPayable: Number(selectedPayslip.netPayable) } : null;

  return <div className="w-full space-y-6 text-[#E2E8F0]">
    <div className="flex items-center justify-between border-b border-[#1E3E37] pb-4"><div><h1 className="text-2xl font-bold text-white">Payroll & Payslips</h1><p className="mt-1 text-xs text-[#829B96]">Live salary processing from employee master data</p></div>{activeTab === "PAYROLL" && <button disabled={busy} onClick={() => void create()} className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"><ArrowRight className="h-4 w-4" />{busy ? "Processing..." : "Run Payroll"}</button>}</div>
    <div className="flex gap-1 rounded-xl border border-[#1E3E37] bg-[#112421] p-1"><button onClick={() => setActiveTab("PAYROLL")} className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold ${activeTab === "PAYROLL" ? "bg-[#10B981] text-slate-950" : "text-[#829B96]"}`}>Payroll runs ({runs.length})</button><button onClick={() => setActiveTab("PAYSLIPS")} className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold ${activeTab === "PAYSLIPS" ? "bg-[#10B981] text-slate-950" : "text-[#829B96]"}`}><FileText className="mr-1 inline h-3.5 w-3.5" />Payslips ({payslips.length})</button></div>
    {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>}
    {activeTab === "PAYROLL" ? <><div className="grid gap-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4 md:grid-cols-4"><label className="text-xs text-[#829B96]">Month<select value={month} onChange={(event) => setMonth(event.target.value)} className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white">{["January","February","March","April","May","June","July","August","September","October","November","December"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs text-[#829B96]">Year<input type="number" value={year} onChange={(event) => setYear(event.target.value)} className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">Provident fund %<input type="number" min="0" value={pfPercent} onChange={(event) => setPfPercent(event.target.value)} className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">Other deduction<input type="number" min="0" value={otherDeduction} onChange={(event) => setOtherDeduction(event.target.value)} className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label></div>
      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Payroll","Period","Gross","Deductions","Net payable","Paid","Status","Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#1E3E37]">{loading ? <tr><td colSpan={8} className="p-10 text-center text-[#829B96]"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading payroll...</td></tr> : runs.map((run) => <tr key={run.id}><td className="p-3 font-mono text-[#10B981]">{run.payrollNo}</td><td className="p-3 text-white">{run.month}/{run.year}</td><td className="p-3 text-white">{money(run.grossAmount)}</td><td className="p-3 text-rose-400">{money(run.totalDeduction)}</td><td className="p-3 text-emerald-400">{money(run.netPayable)}</td><td className="p-3 text-white">{money(run.paidAmount)}</td><td className="p-3 text-white">{run.status}</td><td className="p-3">{run.status === "DRAFT" && <button disabled={busy} onClick={() => void action("approve", run.id)} className="mr-2 text-emerald-400"><CheckCircle className="inline h-4 w-4" /> Approve</button>}{run.status === "APPROVED" && <button disabled={busy} onClick={() => void action("post", run.id)} className="text-sky-400">Post to ledger</button>}{(run.status === "POSTED" || run.status === "PARTIAL") && <button disabled={busy} onClick={() => { setPaymentRun(run); setPaymentAmount(String(Number(run.netPayable) - Number(run.paidAmount))); }} className="text-amber-400">Record payment</button>}</td></tr>)}{!loading && !runs.length && <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">No payroll runs found.</td></tr>}</tbody></table></div>
    </> : <div className="space-y-4"><input value={payslipSearch} onChange={(event) => setPayslipSearch(event.target.value)} placeholder="Search payslip, employee or ID..." className="w-full rounded-lg border border-[#1E3E37] bg-[#112421] p-3 text-xs text-white" /><div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Payslip","Employee","Period","Gross","Deduction","Net payable","Status","Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#1E3E37]">{visiblePayslips.map((slip) => <tr key={slip.id}><td className="p-3 font-mono text-[#10B981]">{slip.payslipNo}</td><td className="p-3 text-white">{slip.employeeName}<span className="block text-[#829B96]">{slip.employeeCode}</span></td><td className="p-3 text-[#829B96]">{slip.month}/{slip.year}</td><td className="p-3 text-white">{money(slip.grossAmount)}</td><td className="p-3 text-rose-400">{money(slip.totalDeduction)}</td><td className="p-3 text-emerald-400">{money(slip.netPayable)}</td><td className="p-3 text-white">{slip.payrollStatus}</td><td className="p-3"><button onClick={async () => { try { setSelectedPayslip(await getPayslip(slip.id)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load payslip."); } }} className="text-sky-400"><Printer className="mr-1 inline h-3.5 w-3.5" />View / Print</button></td></tr>)}{!visiblePayslips.length && <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">No payslips available.</td></tr>}</tbody></table></div></div>}
    {paymentRun && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-md space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-6"><div className="flex items-center justify-between"><h2 className="font-bold text-white">Record salary payment</h2><button onClick={() => setPaymentRun(null)}><X className="h-4 w-4 text-[#829B96]" /></button></div><p className="text-xs text-[#829B96]">{paymentRun.payrollNo} outstanding: <span className="text-white">{money(Number(paymentRun.netPayable) - Number(paymentRun.paidAmount))}</span></p><input type="number" min="0.01" value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white" placeholder="Payment amount" /><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-xs text-white"><option>Bank Transfer</option><option>Cash</option><option>Mobile Banking</option></select><button disabled={busy} onClick={() => void submitPayment()} className="w-full rounded bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950">Confirm payment</button></div></div>}
    <PayslipPrintModal isOpen={Boolean(selectedPayslip && printData)} onClose={() => setSelectedPayslip(null)} salaryData={printData} />
  </div>;
}
