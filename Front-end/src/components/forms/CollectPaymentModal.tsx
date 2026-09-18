import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInstallments } from "@/services/installments.service";

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: unknown) => Promise<void>; }

export default function CollectPaymentModal({ isOpen, onClose, onSave }: Props) {
  const [installments, setInstallments] = useState<any[]>([]);
  const [installmentId, setInstallmentId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [referenceNo, setReferenceNo] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setLoading(true);
    setPaymentDate(new Date().toISOString().slice(0, 10));
    getInstallments().then(setInstallments).catch((reason: any) => setError(reason?.message ?? "Unable to load installments.")).finally(() => setLoading(false));
  }, [isOpen]);
  const selected = installments.find((item) => item.id === installmentId);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const value = Number(amount);
    if (!installmentId || !selected) return setError("Select an outstanding installment.");
    if (!Number.isFinite(value) || value <= 0 || value > Number(selected.dueAmount)) return setError(`Amount must be between 0 and ৳${Number(selected.dueAmount).toLocaleString("en-BD")}.`);
    setSaving(true);
    try {
      await onSave({ installmentId, amount: value, paymentMethod, referenceNo: referenceNo.trim() || undefined, paymentDate, remarks: remarks.trim() || undefined });
      onClose();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? reason?.message ?? "Unable to post collection.");
    } finally { setSaving(false); }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-6 text-[#E2E8F0]"><div className="flex items-center justify-between border-b border-[#1E3E37] pb-3"><div><h2 className="font-bold text-white">Collect Payment</h2><p className="text-xs text-[#829B96]">Issue a money receipt and post customer collection</p></div><button type="button" aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></button></div>{error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}<label className="block text-xs text-[#829B96]">Outstanding installment<select required disabled={loading || saving} value={installmentId} onChange={(event) => { setInstallmentId(event.target.value); const item = installments.find((entry) => entry.id === event.target.value); setAmount(item ? String(item.dueAmount) : ""); }} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">{loading ? "Loading installments…" : "Select outstanding installment"}</option>{installments.filter((item) => Number(item.dueAmount) > 0).map((item) => <option key={item.id} value={item.id}>{item.installmentNo} · {item.title} · Due ৳ {Number(item.dueAmount).toLocaleString("en-BD")}</option>)}</select></label>{selected && <p className="rounded-lg bg-[#0B1816] p-3 text-xs text-white">Client: {selected.clientName || selected.clientId || "—"} · Outstanding: ৳ {Number(selected.dueAmount).toLocaleString("en-BD")}</p>}<div className="grid grid-cols-2 gap-3"><label className="text-xs text-[#829B96]">Collection amount<input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">Payment method<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="bank_transfer">Bank transfer</option><option value="cash">Cash</option><option value="cheque">Cheque</option></select></label></div><div className="grid grid-cols-2 gap-3"><label className="text-xs text-[#829B96]">Collection date<input required type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">Reference / instrument<input value={referenceNo} onChange={(event) => setReferenceNo(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label></div><label className="block text-xs text-[#829B96]">Remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional collection note" className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><div className="flex justify-end gap-2 border-t border-[#1E3E37] pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button disabled={saving || loading} type="submit" className="bg-[#10B981] text-slate-950">{saving ? "Posting…" : "Issue Money Receipt"}</Button></div></form></div>;
}
