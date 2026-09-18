import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getBookings } from "@/services/bookings.service";

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: unknown) => Promise<void>; }

export default function CreateInstallmentModal({ isOpen, onClose, onSave }: Props) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setLoading(true);
    getBookings().then(setBookings).catch((reason: any) => setError(reason?.message ?? "Unable to load bookings.")).finally(() => setLoading(false));
  }, [isOpen]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!bookingId || !title.trim() || !dueDate || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Booking, title, amount and due date are required.");
      return;
    }
    setSaving(true);
    try { await onSave({ bookingId, title: title.trim(), amount: Number(amount), dueDate }); onClose(); }
    catch (reason: any) { setError(reason?.response?.data?.message ?? reason?.message ?? "Unable to create installment."); }
    finally { setSaving(false); }
  };
  const selectedBooking = bookings.find((booking) => booking.id === bookingId);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-6 text-[#E2E8F0]"><div className="flex items-center justify-between border-b border-[#1E3E37] pb-3"><div><h2 className="font-bold text-white">Add Installment</h2><p className="text-xs text-[#829B96]">Create a receivable schedule item for an active booking</p></div><button type="button" aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></button></div>{error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}<label className="block text-xs text-[#829B96]">Active booking<select required disabled={loading || saving} value={bookingId} onChange={(event) => setBookingId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">{loading ? "Loading bookings…" : "Select booking"}</option>{bookings.filter((booking) => ["confirmed", "in_progress"].includes(String(booking.status).toLowerCase())).map((booking) => <option key={booking.id} value={booking.id}>{booking.saleId || booking.id} · {booking.projectName || "Project"} · {booking.unitNo || "Unit"}</option>)}</select></label>{selectedBooking && <div className="rounded-lg bg-[#0B1816] p-3 text-xs text-[#C7D9D4]">Client: {selectedBooking.clientName || selectedBooking.clientId || "—"} · Booking balance: ৳ {Number(selectedBooking.balanceDue || 0).toLocaleString("en-BD")}</div>}<label className="block text-xs text-[#829B96]">Installment title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. 1st slab casting" className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-[#829B96]">Amount<input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">Due date<input required type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label></div><div className="flex justify-end gap-2 border-t border-[#1E3E37] pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button disabled={saving || loading} type="submit" className="bg-[#10B981] text-slate-950">{saving ? "Saving…" : "Save Installment"}</Button></div></form></div>;
}
