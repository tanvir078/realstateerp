import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CreateInstallmentModal from "@/components/forms/CreateInstallmentModal";
import { createInstallment, getInstallments } from "@/services/installments.service";

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const load = () => getInstallments().then(setInstallments).catch((reason) => setError(reason.message));
  useEffect(() => { load(); }, []);
  const visible = installments.filter((item) => `${item.installmentNo} ${item.title} ${item.bookingCode || item.bookingId} ${item.clientName || item.clientId} ${item.projectName || ""} ${item.unitNo || ""} ${item.parkingUnitNo || ""}`.toLowerCase().includes(search.toLowerCase()));
  const save = async (data: unknown) => { try { await createInstallment(data); await load(); } catch (reason: any) { setError(reason.message || "Failed to create installment"); throw reason; } };
  const outstanding = installments.reduce((sum, item) => sum + Number(item.dueAmount || 0), 0);
  const overdue = installments.filter((item) => item.status === "OVERDUE").reduce((sum, item) => sum + Number(item.dueAmount || 0), 0);
  return <div className="w-full space-y-6 text-[#E2E8F0]"><div className="flex items-center justify-between border-b border-[#1E3E37] pb-4"><div><h1 className="text-2xl font-bold text-white">Installment Schedule</h1>
  <p className="mt-1 text-xs text-[#829B96]">Live customer receivable schedule</p>
  
  </div><Button onClick={() => setIsCreateOpen(true)} className="gap-1.5 bg-[#10B981] text-slate-950">
    <Plus className="h-4 w-4" /> Add Installment</Button></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4">
        <p className="text-xs uppercase text-[#829B96]">Schedule items</p>
        <p className="mt-2 text-2xl font-bold text-white">{installments.length}</p>
        </div><div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4">
          <p className="text-xs uppercase text-[#829B96]">Outstanding</p>
          <p className="mt-2 text-2xl font-bold text-white">৳ {outstanding.toLocaleString("en-BD")}</p>
          
          </div><div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Overdue</p><p className="mt-2 text-2xl font-bold text-rose-400">৳ {overdue.toLocaleString("en-BD")}</p>
          
          </div><div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4">
            <p className="text-xs uppercase text-[#829B96]">Paid</p><p className="mt-2 text-2xl font-bold text-emerald-400">{installments.filter((item) => item.status === "PAID").length}</p>
            
            </div>
            
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" />
              <input aria-label="Search installments" value={search} 
              onChange={(event) => setSearch(event.target.value)} 
              placeholder="Search installment, booking or client…" 
              className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white" />
              
              </div>{error && <p className="text-sm text-rose-400">{error}</p>}
              <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
                <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1E3E37] text-[#829B96]">
                  <tr>{["Installment", "Booking / Client", "Title", "Due date", "Amount", "Due", "Status"].map((heading) => 
                    <th key={heading} className="p-3">{heading}</th>)}
                    </tr>
                    </thead><tbody className="divide-y divide-[#1E3E37]">{visible.map((item) => 
                      <tr key={item.id}><td className="p-3 font-mono text-[#10B981]">{item.installmentNo}</td>
                      <td className="p-3 text-white">{item.bookingId}<br />{item.clientId}</td><td className="p-3 text-[#829B96]">{item.title}</td><td className="p-3 text-[#829B96]">{item.dueDate}</td><td className="p-3 text-white">৳ {Number(item.amount).toLocaleString("en-BD")}</td><td className="p-3 text-rose-400">৳ {Number(item.dueAmount).toLocaleString("en-BD")}</td><td className="p-3 text-white">{item.status}</td></tr>)}{!visible.length && <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">No installments found.</td></tr>}</tbody></table></div><CreateInstallmentModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={save} /></div>;
}
