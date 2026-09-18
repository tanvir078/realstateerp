import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CreateBookingModal from "@/components/forms/CreateBookingModal";
import { cancelBooking, confirmBooking, createBooking, getBookings, refundBooking } from "@/services/bookings.service";
import { PageContainer, PageHeader } from "@/components/page";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const load = () => getBookings().then(setBookings).catch((reason) => setError(reason.message));
  useEffect(() => { load(); }, []);
  const visible = bookings.filter((booking) => `${booking.saleId} ${booking.projectName} ${booking.unitNo} ${booking.parkingUnitNo || ""} ${booking.clientName || ""} ${booking.clientId}`.toLowerCase().includes(search.toLowerCase()));
  const create = async (data: unknown) => { try { await createBooking(data); await load(); } catch (reason: any) { setError(reason.message || "Failed to create booking"); throw reason; } };
  const confirm = async (id: string) => { try { await confirmBooking(id); await load(); } catch (reason: any) { setError(reason.message); } };
  const cancel = async (id: string) => { if (!window.confirm("Cancel this booking and release the unit?")) return; try { await cancelBooking(id); await load(); } catch (reason: any) { setError(reason.message); } };
  const refund = async (booking: any) => {
    const amount = Number(window.prompt("Refund amount", String(Number(booking.downPayment || 0))));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const paymentMethod = window.prompt("Refund payment method: cash, bank_transfer, or cheque", booking.bookingPaymentMethod || "cash");
    if (!paymentMethod) return;
    const referenceNo = window.prompt("Refund reference number (optional)") || undefined;
    try {
      await refundBooking(booking.id, { amount, paymentMethod, refundDate: new Date().toISOString().slice(0, 10), referenceNo });
      await load();
    } catch (reason: any) { setError(reason.message); }
  };

  return <PageContainer><PageHeader title="Property Bookings" actions={<Button onClick={() => setIsCreateOpen(true)} className="gap-1.5 bg-[#10B981] text-slate-950"><Plus className="h-4 w-4" /> New Booking</Button>} /><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" /><input aria-label="Search bookings" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search booking, project, unit or client…" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white" /></div>{error && <p className="text-sm text-rose-400">{error}</p>}<div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Booking", "Client", "Project / Unit", "Value", "Booking money", "Status", "Actions"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#1E3E37]">{visible.map((booking) => <tr key={booking.id}><td className="p-3 font-mono text-[#10B981]">{booking.saleId}</td><td className="p-3 text-white">{booking.clientId}</td><td className="p-3 text-[#829B96]">{booking.projectName}<br />{booking.unitNo}</td><td className="p-3 text-white">৳ {Number(booking.totalPrice).toLocaleString("en-BD")}</td><td className="p-3 text-white">৳ {Number(booking.downPayment).toLocaleString("en-BD")}</td><td className="p-3 text-white">{booking.status}</td><td className="p-3"><div className="flex gap-2">{booking.status === "pending" && <button onClick={() => confirm(booking.id)} className="text-emerald-400">Confirm</button>}{booking.status !== "cancelled" && booking.status !== "completed" && <button onClick={() => cancel(booking.id)} className="text-rose-400">Cancel</button>}{booking.status === "cancelled" && Number(booking.downPayment) > 0 && <button onClick={() => refund(booking)} className="text-amber-400">Refund</button>}</div></td></tr>)}{!visible.length && <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">No bookings found.</td></tr>}</tbody></table></div><CreateBookingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={create} /></PageContainer>;
}
