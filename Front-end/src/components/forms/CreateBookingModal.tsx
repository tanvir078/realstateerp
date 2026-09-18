import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getClients } from "@/services/clients.service";
import { getAvailableParking, getProjects, getUnits } from "@/services/projects.service";

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: unknown) => Promise<void>; }

export default function CreateBookingModal({ isOpen, onClose, onSave }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [parkingUnits, setParkingUnits] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [parkingUnitId, setParkingUnitId] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("installment");
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState("cash");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([getClients(), getProjects()]).then(([loadedClients, loadedProjects]) => {
      setClients(loadedClients);
      setProjects(loadedProjects);
    });
  }, [isOpen]);

  useEffect(() => {
    if (!projectId) { setUnits([]); setParkingUnits([]); return; }
    Promise.all([getUnits(projectId), getAvailableParking(projectId)])
      .then(([loadedUnits, loadedParking]) => {
        setUnits(loadedUnits);
        setParkingUnits(loadedParking);
      });
  }, [projectId]);

  const selectedUnit = units.find((unit) => unit.id === unitId);
  const selectedParking = parkingUnits.find((unit) => unit.id === parkingUnitId);
  const propertyPrice = selectedUnit ? Number(selectedUnit.totalPrice) - Number(selectedUnit.parkingPrice || 0) : 0;
  const agreementTotal = propertyPrice + Number(selectedParking?.totalPrice || 0);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!clientId || !unitId || !selectedUnit) return;
    setSaving(true);
    try {
      await onSave({
        clientId,
        projectId,
        projectName: selectedUnit.project?.projectName || "",
        unitId,
        unitNo: selectedUnit.unitCode,
        unitPrice: Number(selectedUnit.basePricePerSft),
        totalPrice: agreementTotal,
        parkingUnitId: parkingUnitId || undefined,
        includesParking: Boolean(parkingUnitId),
        downPayment: Number(downPayment || 0),
        paymentMethod,
        bookingPaymentMethod,
        saleDate: new Date().toISOString().slice(0, 10),
      });
      onClose();
    } finally { setSaving(false); }
  };

  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><form onSubmit={submit} className="w-full max-w-xl space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-6 text-[#E2E8F0]"><div className="flex items-center justify-between border-b border-[#1E3E37] pb-3"><div><h2 className="font-bold text-white">New Booking</h2><p className="text-xs text-[#829B96]">Reserve a property with optional parking</p></div><button type="button" aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></button></div><label className="block text-xs text-[#829B96]">Client<select required value={clientId} onChange={(event) => setClientId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">Select client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.clientName} ({client.clientId})</option>)}</select></label><label className="block text-xs text-[#829B96]">Project<select required value={projectId} onChange={(event) => { setProjectId(event.target.value); setUnitId(""); setParkingUnitId(""); }} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">Select project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}</select></label><label className="block text-xs text-[#829B96]">Available property<select required value={unitId} onChange={(event) => setUnitId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">Select available property</option>{units.filter((unit) => unit.status === "AVAILABLE" && unit.unitType !== "PARKING").map((unit) => <option key={unit.id} value={unit.id}>{unit.unitCode} · ৳ {Number(Number(unit.totalPrice) - Number(unit.parkingPrice || 0)).toLocaleString("en-BD")}</option>)}</select></label><label className="block text-xs text-[#829B96]">Parking (optional)<select value={parkingUnitId} onChange={(event) => setParkingUnitId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white">  <option value="">No parking</option>{parkingUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit.unitCode} · ৳ {Number(unit.totalPrice).toLocaleString("en-BD")}</option>)}</select></label>{selectedUnit && <p className="rounded-lg bg-[#0B1816] p-3 text-sm text-white">Property: ৳ {propertyPrice.toLocaleString("en-BD")} {selectedParking ? `+ Parking: ৳ ${Number(selectedParking.totalPrice).toLocaleString("en-BD")}` : "· No parking"}<br /><strong>Agreement value: ৳ {agreementTotal.toLocaleString("en-BD")}</strong></p>}  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><label className="text-xs text-[#829B96]">Booking money  <input required type="number" min="0" step="0.01" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">Payment schedule<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="installment">Installment</option></select></label><label className="text-xs text-[#829B96]">Booking money channel<select value={bookingPaymentMethod} onChange={(event) => setBookingPaymentMethod(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="cash">Cash</option><option value="bank_transfer">Bank transfer</option><option value="cheque">Cheque</option></select></label></div><div className="flex justify-end gap-2 border-t border-[#1E3E37] pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button disabled={saving} type="submit" className="bg-[#10B981] text-slate-950">{saving ? "Saving…" : "Create Booking"}</Button></div></form></div>;
}
