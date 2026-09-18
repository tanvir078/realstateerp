import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Building2, Car, DollarSign, Ruler, X } from "lucide-react";

type ParkingStatus = "AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED";

interface ParkingData {
  projectId: string;
  unitCode: string;
  size: number;
  price?: number;
  pricePerSft?: number;
  priceMode: "SFT" | "MANUAL";
  status: ParkingStatus;
}

interface AddParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ParkingData) => void;
  projects: Array<{ id: string; name: string }>;
  initialData?: Partial<ParkingData>;
  mode?: "create" | "edit";
}

export default function AddParkingModal({ isOpen, onClose, onSave, projects, initialData, mode = "create" }: AddParkingModalProps) {
  const [projectId, setProjectId] = useState("");
  const [parking, setParking] = useState("");
  const [size, setSize] = useState("");
  const [priceMode, setPriceMode] = useState<"SFT" | "MANUAL">("SFT");
  const [pricePerSft, setPricePerSft] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [status, setStatus] = useState<ParkingStatus>("AVAILABLE");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setProjectId(initialData?.projectId || "");
    setParking(initialData?.unitCode || "");
    setSize(initialData?.size?.toString() || "");
    const initialPricePerSft = initialData?.pricePerSft || 0;
    const initialManualPrice = initialData?.price || 0;
    setPriceMode(initialPricePerSft > 0 ? "SFT" : "MANUAL");
    setPricePerSft(initialPricePerSft ? initialPricePerSft.toString() : "");
    setManualPrice(initialManualPrice ? initialManualPrice.toString() : "");
    setStatus(initialData?.status || "AVAILABLE");
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const calculatedPrice = Number(size) * Number(pricePerSft);
    const finalPrice = priceMode === "SFT" ? calculatedPrice : Number(manualPrice);
    if (!projectId || !parking.trim() || Number(size) <= 0 || finalPrice < 0 || (priceMode === "SFT" ? Number(pricePerSft) <= 0 : manualPrice === "")) {
      setError("Please select a project and enter parking number, size, and valid pricing.");
      return;
    }
    onSave({
      projectId,
      unitCode: parking.trim(),
      size: Number(size),
      price: priceMode === "MANUAL" ? finalPrice : undefined,
      pricePerSft: priceMode === "SFT" ? Number(pricePerSft) : undefined,
      priceMode,
      status,
    });
  };

  const calculatedPrice = Number(size) * Number(pricePerSft);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[#1E3E37] bg-[#112421] text-[#E2E8F0] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E3E37] bg-[#0B1816] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#10B981]/10 p-2 text-[#10B981]"><Car className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-white">{mode === "edit" ? "Edit Parking" : "Add Parking"}</h2>
              <p className="text-xs text-[#829B96]">Manage project parking inventory</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close parking modal" className="rounded-lg p-1.5 text-[#829B96] hover:bg-[#1A3530] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 p-6 text-xs">
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300">{error}</p>}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 font-medium text-[#829B96]"><Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Project <span className="text-rose-400">*</span></label>
            <select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white" required>
              <option value="">Select project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-medium text-[#829B96]"><Car className="h-3.5 w-3.5 text-[#10B981]" /> Parking <span className="text-rose-400">*</span></label>
              <input value={parking} onChange={(event) => setParking(event.target.value)} placeholder="e.g. P-01" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white placeholder-[#829B96]" />
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-medium text-[#829B96]"><Ruler className="h-3.5 w-3.5 text-[#10B981]" /> Size (sq ft) <span className="text-rose-400">*</span></label>
              <input type="number" step="0.01" value={size} onChange={(event) => setSize(event.target.value)} placeholder="e.g. 150" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white placeholder-[#829B96]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-medium text-[#829B96]">Price Method <span className="text-rose-400">*</span></label>
            <select value={priceMode} onChange={(event) => setPriceMode(event.target.value as "SFT" | "MANUAL")} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white">
              <option value="SFT">Per SFT (Size × Rate)</option>
              <option value="MANUAL">Manual Total Price</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-medium text-[#829B96]"><DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> {priceMode === "SFT" ? "Price per SFT (৳)" : "Manual Price (৳)"} <span className="text-rose-400">*</span></label>
              {priceMode === "SFT" ? (
                <input type="number" step="0.01" value={pricePerSft} onChange={(event) => setPricePerSft(event.target.value)} placeholder="e.g. 2500" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white placeholder-[#829B96]" />
              ) : (
                <input type="number" step="0.01" value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} placeholder="e.g. 400000" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white placeholder-[#829B96]" />
              )}
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 font-medium text-[#829B96]"><DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Total Price (৳)</label>
              <input type="text" readOnly value={(priceMode === "SFT" ? calculatedPrice : Number(manualPrice)).toLocaleString("en-BD")} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white" />
            </div>
          </div>
          <div className="space-y-1">
              <label className="font-medium text-[#829B96]">Status <span className="text-rose-400">*</span></label>
              <select value={status} onChange={(event) => setStatus(event.target.value as ParkingStatus)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white">
                <option value="AVAILABLE">Available</option><option value="BOOKED">Booked</option><option value="SOLD">Sold</option><option value="BLOCKED">Blocked</option>
              </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#1E3E37] pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="button" onClick={handleSave} className="bg-[#10B981] text-slate-950">{mode === "edit" ? "Update Parking" : "Save Parking"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
