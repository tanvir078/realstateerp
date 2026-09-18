import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createLandParcel, createUtilityBill, createUtilityConnection, getLandParcels, getProjects, getUtilityBills, getUtilityConnections, payUtilityBill } from "@/services/projects.service";

const inputClass = "w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-sm text-white";

export default function PropertyAssets({ initialTab = "land" }: { initialTab?: "land" | "utilities" }) {
  const [tab, setTab] = useState<"land" | "utilities">(initialTab);
  const [projects, setProjects] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [land, setLand] = useState({ parcelCode: "", description: "", location: "", area: "", areaUnit: "SQFT", ownerName: "", acquisitionCost: "", projectId: "" });
  const [utility, setUtility] = useState({ projectId: "", utilityType: "ELECTRICITY", connectionCode: "", meterNumber: "", monthlyRate: "", unitId: "" });
  const [bill, setBill] = useState({ connectionId: "", billingMonth: new Date().toISOString().slice(0, 7), amount: "" });
  const [paymentBill, setPaymentBill] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const load = async () => {
    try {
      const [p, loadedProjects, c, b] = await Promise.all([getLandParcels(), getProjects(), getUtilityConnections(), getUtilityBills()]);
      setParcels(p); setProjects(loadedProjects); setConnections(c); setBills(b);
    } catch (reason: any) { setError(reason.message || "Failed to load property assets"); }
  };
  useEffect(() => { load(); }, []);

  const saveLand = async (event: React.FormEvent) => {
    event.preventDefault();
    try { await createLandParcel({ ...land, area: Number(land.area), acquisitionCost: Number(land.acquisitionCost || 0), projectId: land.projectId || undefined }); setLand({ parcelCode: "", description: "", location: "", area: "", areaUnit: "SQFT", ownerName: "", acquisitionCost: "", projectId: "" }); await load(); } catch (reason: any) { setError(reason.message || "Failed to create land parcel"); }
  };
  const saveUtility = async (event: React.FormEvent) => {
    event.preventDefault();
    try { await createUtilityConnection({ ...utility, monthlyRate: Number(utility.monthlyRate || 0), unitId: utility.unitId || undefined }); setUtility({ projectId: "", utilityType: "ELECTRICITY", connectionCode: "", meterNumber: "", monthlyRate: "", unitId: "" }); await load(); } catch (reason: any) { setError(reason.message || "Failed to create utility connection"); }
  };
  const saveBill = async (event: React.FormEvent) => {
    event.preventDefault();
    try { await createUtilityBill({ ...bill, amount: Number(bill.amount) }); setBill({ ...bill, amount: "" }); await load(); } catch (reason: any) { setError(reason.message || "Failed to create utility bill"); }
  };
  const payBill = async (item: any) => {
    const outstanding = Number(item.amount) - Number(item.paidAmount || 0);
    setPaymentBill(item);
    setPaymentAmount(String(outstanding));
  };
  const submitBillPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!paymentBill) return;
    const outstanding = Number(paymentBill.amount) - Number(paymentBill.paidAmount || 0);
    const value = Number(paymentAmount);
    if (!Number.isFinite(value) || value <= 0 || value > outstanding) {
      setError(`Payment must be greater than 0 and no more than ৳${outstanding.toLocaleString("en-BD")}.`);
      return;
    }
    try {
      await payUtilityBill(paymentBill.id, value);
      setPaymentBill(null);
      await load();
    } catch (reason: any) { setError(reason.message || "Failed to record utility payment"); }
  };

  return <div className="w-full space-y-6 text-[#E2E8F0]">
    <div className="border-b border-[#1E3E37] pb-4"><h1 className="text-2xl font-bold text-white">{tab === "land" ? "Land Parcels" : "Utilities & Bills"}</h1><p className="mt-1 text-xs text-[#829B96]">{tab === "land" ? "Manage land ownership, parcels and acquisition costs" : "Manage utility connections, recurring bills and payments"}</p></div>
    {error && <p className="text-sm text-rose-400">{error}</p>}
    <div className="flex gap-2"><Button variant={tab === "land" ? "default" : "outline"} onClick={() => setTab("land")}>Land Parcels</Button><Button variant={tab === "utilities" ? "default" : "outline"} onClick={() => setTab("utilities")}>Utilities & Bills</Button></div>
    {tab === "land" ? <section className="grid gap-6 lg:grid-cols-[360px_1fr]"><form onSubmit={saveLand} className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="font-semibold text-white">Add Land Parcel</h2><input required placeholder="Parcel code" className={inputClass} value={land.parcelCode} onChange={e => setLand({ ...land, parcelCode: e.target.value })} /><input required placeholder="Description" className={inputClass} value={land.description} onChange={e => setLand({ ...land, description: e.target.value })} /><input required placeholder="Location" className={inputClass} value={land.location} onChange={e => setLand({ ...land, location: e.target.value })} /><div className="grid grid-cols-2 gap-2"><input required type="number" min="0" placeholder="Area" className={inputClass} value={land.area} onChange={e => setLand({ ...land, area: e.target.value })} /><select className={inputClass} value={land.areaUnit} onChange={e => setLand({ ...land, areaUnit: e.target.value })}><option>SQFT</option><option>KATHA</option>    <option>BIGHA</option><option>DECIMAL</option></select></div><input required placeholder="Owner name" className={inputClass} value={land.ownerName} onChange={e => setLand({ ...land, ownerName: e.target.value })} /><input type="number" min="0" placeholder="Acquisition cost" className={inputClass} value={land.acquisitionCost} onChange={e => setLand({ ...land, acquisitionCost: e.target.value })} /><select className={inputClass} value={land.projectId} onChange={e => setLand({ ...land, projectId: e.target.value })}><option value="">Unallocated land</option>{projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}</select><Button type="submit" className="w-full bg-[#10B981] text-slate-950">Add Parcel</Button></form><div className="space-y-3">{parcels.map(p => <article key={p.id} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><div className="flex justify-between"><div><p className="font-mono text-xs text-[#10B981]">{p.parcelCode}</p><h3 className="font-semibold text-white">{p.description}</h3><p className="text-xs text-[#829B96]">{p.location} · {p.ownerName}</p></div><span className="text-xs text-[#10B981]">{p.status}</span></div><p className="mt-3 text-sm text-white">{Number(p.area).toLocaleString()} {p.areaUnit} · ৳ {Number(p.acquisitionCost).toLocaleString("en-BD")}</p></article>)}{!parcels.length && <p className="rounded-xl border border-[#1E3E37] p-8 text-center text-sm text-[#829B96]">No land parcels recorded.</p>}</div></section> : <section className="space-y-6"><div className="grid gap-6 lg:grid-cols-2"><form onSubmit={saveUtility} className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="font-semibold text-white">Add Utility Connection</h2><select required className={inputClass} value={utility.projectId} onChange={e => setUtility({ ...utility, projectId: e.target.value })}><option value="">Select project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}</select><select className={inputClass} value={utility.utilityType} onChange={e => setUtility({ ...utility, utilityType: e.target.value })}><option>ELECTRICITY</option><option>WATER</option><option>GAS</option><option>SERVICE_CHARGE</option><option>OTHER</option></select><input required placeholder="Connection code" className={inputClass} value={utility.connectionCode} onChange={e => setUtility({ ...utility, connectionCode: e.target.value })} /><input required placeholder="Meter number" className={inputClass} value={utility.meterNumber} onChange={e => setUtility({ ...utility, meterNumber: e.target.value })} /><input type="number" min="0" placeholder="Monthly rate" className={inputClass} value={utility.monthlyRate} onChange={e => setUtility({ ...utility, monthlyRate: e.target.value })} /><Button type="submit" className="bg-[#10B981] text-slate-950">Add Connection</Button></form><form onSubmit={saveBill} className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h2 className="font-semibold text-white">Generate Utility Bill</h2><select required className={inputClass} value={bill.connectionId} onChange={e => setBill({ ...bill, connectionId: e.target.value })}><option value="">Select connection</option>{connections.map(c => <option key={c.id} value={c.id}>{c.connectionCode} · {c.utilityType}</option>)}</select><input required type="month" className={inputClass} value={bill.billingMonth} onChange={e => setBill({ ...bill, billingMonth: e.target.value })} /><input required type="number" min="0" placeholder="Amount" className={inputClass} value={bill.amount} onChange={e => setBill({ ...bill, amount: e.target.value })} /><Button type="submit" className="bg-[#10B981] text-slate-950">Create Bill</Button></form></div><div className="grid gap-3 md:grid-cols-2">{connections.map(c => <article key={c.id} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="font-mono text-xs text-[#10B981]">{c.connectionCode}</p><p className="font-semibold text-white">{c.utilityType} · {c.meterNumber}</p><p className="text-xs text-[#829B96]">Monthly rate: ৳ {Number(c.monthlyRate).toLocaleString("en-BD")} · {c.status}</p></article>)}</div><div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr><th className="p-3">Month</th><th className="p-3">Connection</th><th className="p-3">Amount</th><th className="p-3">Status</th></tr></thead><tbody>{bills.map(b => <tr key={b.id} className="border-b border-[#1E3E37]"><td className="p-3">{b.billingMonth}</td><td className="p-3">{b.connection?.connectionCode}</td><td className="p-3">৳ {Number(b.amount).toLocaleString("en-BD")}</td>    <td className="p-3 text-amber-400">{b.status}</td><td className="p-3"><Button size="sm" variant="outline" disabled={b.status === "PAID"} onClick={() => payBill(b)}>Record payment</Button></td></tr>)}</tbody></table></div></section>}
    {paymentBill && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><form onSubmit={submitBillPayment} className="w-full max-w-md space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-5"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Record Utility Payment</h2><button type="button" onClick={() => setPaymentBill(null)} className="text-[#829B96]">Close</button></div><p className="text-sm text-[#829B96]">Outstanding: <span className="text-white">৳{(Number(paymentBill.amount) - Number(paymentBill.paidAmount || 0)).toLocaleString("en-BD")}</span></p><input required min="0.01" type="number" className={inputClass} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="Payment amount" /><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setPaymentBill(null)}>Cancel</Button><Button type="submit" className="bg-[#10B981] text-slate-950">Post payment</Button></div></form></div>}
  </div>;
}
