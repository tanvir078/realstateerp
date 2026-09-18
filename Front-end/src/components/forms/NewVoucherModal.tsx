import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Plus, Calendar, DollarSign, FileText, Layers, Building2, CheckCircle2, Loader2 } from "lucide-react";

interface NewVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (voucherData: any) => Promise<void>;
  projects?: Array<{ id: string; projectName: string; projectCode?: string }>;
  accounts?: Array<{ code: string; name: string; isPostable?: boolean }>;
}

export default function NewVoucherModal({ isOpen, onClose, onSave, projects = [], accounts = [] }: NewVoucherModalProps) {
  const [voucherType, setVoucherType] = useState<"DEBIT" | "CREDIT" | "JOURNAL" | "CONTRA">("JOURNAL");
  const [formData, setFormData] = useState({
    voucherDate: new Date().toISOString().slice(0, 10),
    debitAccountCode: "",
    creditAccountCode: "",
    projectId: "",
    amount: "",
    referenceNo: "",
    particulars: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [openAccount, setOpenAccount] = useState<"debit" | "credit" | null>(null);

  if (!isOpen) return null;

  const update = (field: string, value: string) => setFormData((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.debitAccountCode || !formData.creditAccountCode || formData.debitAccountCode === formData.creditAccountCode) {
      setError("Select two different posting accounts.");
      return;
    }
    if (!formData.particulars.trim() || Number(formData.amount) <= 0) {
      setError("Enter a positive amount and a clear narration.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave?.({
        voucherType,
        postingDate: formData.voucherDate,
        debitAccountCode: formData.debitAccountCode,
        creditAccountCode: formData.creditAccountCode,
        projectId: formData.projectId || undefined,
        amount: Number(formData.amount),
        referenceNo: formData.referenceNo || undefined,
        description: formData.particulars.trim(),
      });
      onClose();
    } catch (saveError: any) {
      setError(saveError?.message || "Voucher could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const types = [
    ["DEBIT", "Debit voucher", "Payment / expense"],
    ["CREDIT", "Credit voucher", "Receipt / income"],
    ["JOURNAL", "Journal voucher", "Adjustment / accrual"],
    ["CONTRA", "Contra voucher", "Cash / bank transfer"],
  ] as const;
  const accountPicker = (kind: "debit" | "credit", label: string, value: string) => {
    const selected = accounts.find((account) => account.code === value);
    return (
      <div className="relative space-y-1">
        <span className="text-[#829B96] flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-[#10B981]" /> {label} *</span>
        <button type="button" onClick={() => setOpenAccount(openAccount === kind ? null : kind)} className="w-full min-w-0 rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-left text-white">
          {selected ? `${selected.code} - ${selected.name}` : `Select ${kind} account`}
        </button>
        {openAccount === kind && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-[#2B554B] bg-[#0B1816] p-1 shadow-2xl">
            {accounts.map((account) => (
              <button key={account.code} type="button" onClick={() => { update(kind === "debit" ? "debitAccountCode" : "creditAccountCode", account.code); setOpenAccount(null); }} className="block w-full rounded-md px-3 py-2 text-left text-xs text-white hover:bg-[#1A3530]">
                {account.code} - {account.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]"><Plus className="h-5 w-5" /></div>
            <div><h2 className="text-base font-bold text-white">Create New Voucher Entry</h2><p className="text-xs text-[#829B96]">Post a balanced double-entry transaction</p></div>
          </div>
          <button type="button" aria-label="Close voucher form" onClick={onClose} className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530]"><X aria-hidden="true" className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#829B96] font-medium">Voucher type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {types.map(([type, label, hint]) => (
                <button key={type} type="button" onClick={() => setVoucherType(type)} className={`p-2.5 rounded-lg border text-left ${voucherType === type ? "bg-[#10B981]/15 border-[#10B981] text-white" : "bg-[#0B1816] border-[#1E3E37] text-[#829B96]"}`}>
                  <p className="font-bold">{label}</p><p className="text-[10px] mt-0.5">{hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1"><span className="text-[#829B96] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Posting date *</span><input type="date" value={formData.voucherDate} onChange={(e) => update("voucherDate", e.target.value)} className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white" required /></label>
            <label className="space-y-1"><span className="text-[#829B96] flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Project / cost center</span><select value={formData.projectId} onChange={(e) => update("projectId", e.target.value)} className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white"><option value="">Head office / no project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}{project.projectCode ? ` (${project.projectCode})` : ""}</option>)}</select></label>
          </div>

          <div className="space-y-4">
            {accountPicker("debit", "Debit account", formData.debitAccountCode)}
            {accountPicker("credit", "Credit account", formData.creditAccountCode)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1"><span className="text-[#829B96] flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Amount (৳) *</span><input type="number" min="0.01" step="0.01" value={formData.amount} onChange={(e) => update("amount", e.target.value)} className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono" required /></label>
            <label className="space-y-1"><span className="text-[#829B96]">Reference / instrument no.</span><input value={formData.referenceNo} onChange={(e) => update("referenceNo", e.target.value)} placeholder="Optional" className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white" /></label>
          </div>

          <label className="space-y-1 block"><span className="text-[#829B96] flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-[#10B981]" /> Narration / business purpose *</span><textarea rows={3} value={formData.particulars} onChange={(e) => update("particulars", e.target.value)} placeholder="Explain why this transaction is being posted" className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white" required /></label>
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300">{error}</p>}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#1E3E37]"><Button type="button" variant="outline" onClick={onClose} className="bg-[#0B1816] border-[#1E3E37] text-[#829B96]">Cancel</Button><Button type="submit" disabled={saving} className="bg-[#10B981] text-slate-950 font-bold gap-1.5">{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{saving ? "Posting..." : "Post Voucher"}</Button></div>
        </form>
      </div>
    </div>
  );
}
