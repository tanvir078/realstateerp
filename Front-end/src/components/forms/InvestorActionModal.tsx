import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Mode = "investor" | "allocation" | "payout" | "process";

export default function InvestorActionModal({ mode, investors, projects, payout, onClose, onSave }: {
  mode: Mode;
  investors?: any[];
  projects?: Array<{ id: string; projectName: string; projectCode?: string }>;
  payout?: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [data, setData] = useState<any>({ investorId: payout?.investorId ?? "", project: payout?.project ?? "", type: payout?.type ?? (mode === "investor" ? "INDIVIDUAL" : "QUARTERLY_ROI"), scheduledDate: payout?.scheduledDate ?? new Date().toISOString().slice(0, 10), paymentMethod: "BANK_TRANSFER", paidDate: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState("");
  const update = (key: string, value: string) => setData((current: any) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { ...data, amount: data.amount === "" ? undefined : Number(data.amount), equityPercent: data.equityPercent === "" ? undefined : Number(data.equityPercent), investment: data.investment === "" ? undefined : Number(data.investment), currentValue: data.currentValue === "" ? undefined : Number(data.currentValue) };
    if (!payload.joined) delete payload.joined;
    try { setError(""); await onSave(payload); } catch (requestError: any) { setError(requestError?.response?.data?.message ?? "Unable to save this record."); }
  };
  const title = mode === "investor" ? "Add Investor" : mode === "allocation" ? "Allocate Equity" : mode === "payout" ? "Schedule Payout" : "Process Payout";
  const field = (label: string, key: string, type = "text", required = true) => <label className="space-y-1 text-xs"><span className="text-[#829B96]">{label}</span><input type={type} value={data[key] ?? ""} required={required} onChange={(e) => update(key, e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white" /></label>;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-6 text-white">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button type="button" onClick={onClose}><X className="h-4 w-4" /></button></div>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      {mode === "investor" && <><div className="grid grid-cols-2 gap-3">{field("Name", "name")}{field("Contact", "contact")}</div>{field("Email", "email", "email")}<div className="grid grid-cols-2 gap-3"><label className="space-y-1 text-xs"><span className="text-[#829B96]">Type</span><select required value={data.type} onChange={(e) => update("type", e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white"><option value="INDIVIDUAL">Individual</option><option value="CORPORATE">Corporate</option><option value="INSTITUTIONAL">Institutional</option></select></label>{field("Joined", "joined", "date", false)}</div>{field("Address", "address", "text", false)}</>}
      {mode === "allocation" && <><label className="space-y-1 text-xs"><span className="text-[#829B96]">Investor</span><select required value={data.investorId} onChange={(e) => update("investorId", e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white"><option value="">Select investor</option>{investors?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="space-y-1 text-xs"><span className="text-[#829B96]">Project</span><select required value={data.project} onChange={(e) => update("project", e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white"><option value="">Select project</option>{projects?.map((item) => <option key={item.id} value={item.projectName}>{item.projectName}{item.projectCode ? ` (${item.projectCode})` : ""}</option>)}</select></label><div className="grid grid-cols-3 gap-3">{field("Equity %", "equityPercent", "number")}{field("Investment", "investment", "number")}{field("Current Value", "currentValue", "number", false)}</div></>}
      {mode === "payout" && <><label className="space-y-1 text-xs"><span className="text-[#829B96]">Investor</span><select required value={data.investorId} onChange={(e) => update("investorId", e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white"><option value="">Select investor</option>{investors?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="space-y-1 text-xs"><span className="text-[#829B96]">Project</span><select required value={data.project} onChange={(e) => update("project", e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white"><option value="">Select project</option>{projects?.map((item) => <option key={item.id} value={item.projectName}>{item.projectName}{item.projectCode ? ` (${item.projectCode})` : ""}</option>)}</select></label><div className="grid grid-cols-3 gap-3">{field("Amount", "amount", "number")}{field("Type", "type")}{field("Scheduled Date", "scheduledDate", "date")}</div></>}
      {mode === "process" && <div className="grid grid-cols-2 gap-3">{field("Payment Date", "paidDate", "date")}{field("Payment Method", "paymentMethod")}</div>}
      {mode === "process" && field("Reference Number", "referenceNumber")}
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Save</Button></div>
    </form>
  </div>;
}
