import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Building2, Layers, Home, 
  DollarSign, CheckCircle2, Zap
} from "lucide-react";

interface BulkCreateUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BulkUnitData) => void;
  projects?: Array<{ id: string; name: string }>;
}

interface BulkUnitData {
  projectId: string;
  fromFloor: number;
  toFloor: number;
  unitsPerFloor: number;
  defaultSize: number;
  defaultPricePerSft: number;
  defaultParkingPrice: number;
  defaultUtilityCharges: number;
  defaultOwnership: "DEVELOPER_SHARE" | "LANDOWNER_SHARE";
  defaultStatus: "AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED";
}

export default function BulkCreateUnitsModal({ 
  isOpen, 
  onClose, 
  onSave,
  projects = []
}: BulkCreateUnitsModalProps) {
  const [projectId, setProjectId] = useState("");
  const [fromFloor, setFromFloor] = useState("1");
  const [toFloor, setToFloor] = useState("5");
  const [unitsPerFloor, setUnitsPerFloor] = useState("4");
  const [defaultSize, setDefaultSize] = useState("1450");
  const [defaultPricePerSft, setDefaultPricePerSft] = useState("6500");
  const [defaultParkingPrice, setDefaultParkingPrice] = useState("400000");
  const [defaultUtilityCharges, setDefaultUtilityCharges] = useState("200000");
  const [defaultOwnership, setDefaultOwnership] = useState<"DEVELOPER_SHARE" | "LANDOWNER_SHARE">("DEVELOPER_SHARE");
  const [defaultStatus, setDefaultStatus] = useState<"AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED">("AVAILABLE");

  // Calculate preview
  const totalFloors = parseInt(toFloor) - parseInt(fromFloor) + 1;
  const totalUnits = totalFloors * parseInt(unitsPerFloor);
  const previewTotalPrice = totalUnits * (parseFloat(defaultSize) * parseFloat(defaultPricePerSft) + parseFloat(defaultParkingPrice) + parseFloat(defaultUtilityCharges));

  if (!isOpen) return null;

  const handleSave = () => {
    const data: BulkUnitData = {
      projectId,
      fromFloor: parseInt(fromFloor),
      toFloor: parseInt(toFloor),
      unitsPerFloor: parseInt(unitsPerFloor),
      defaultSize: parseFloat(defaultSize),
      defaultPricePerSft: parseFloat(defaultPricePerSft),
      defaultParkingPrice: parseFloat(defaultParkingPrice),
      defaultUtilityCharges: parseFloat(defaultUtilityCharges),
      defaultOwnership,
      defaultStatus
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bulk Create Units</h2>
              <p className="text-xs text-[#829B96]">Fast batch unit generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Project Selection */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Select Project <span className="text-rose-400">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id} className="bg-[#0B1816]">
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Range */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> From Floor <span className="text-rose-400">*</span>
              </label>
              <select
                value={fromFloor}
                onChange={(e) => setFromFloor(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i} value={i} className="bg-[#0B1816]">
                    {i === 0 ? "Ground" : `${i}th`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> To Floor <span className="text-rose-400">*</span>
              </label>
              <select
                value={toFloor}
                onChange={(e) => setToFloor(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i} value={i} className="bg-[#0B1816]">
                    {i === 0 ? "Ground" : `${i}th`}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#10B981]" /> Units/Floor <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 4 (A, B, C, D)"
                value={unitsPerFloor}
                onChange={(e) => setUnitsPerFloor(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Default Size & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Default Size (Sft) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1,450"
                value={defaultSize}
                onChange={(e) => setDefaultSize(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Default Rate/Sft (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 6,500"
                value={defaultPricePerSft}
                onChange={(e) => setDefaultPricePerSft(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Parking & Utility */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#10B981]" /> Parking Price (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 400,000"
                value={defaultParkingPrice}
                onChange={(e) => setDefaultParkingPrice(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#10B981]" /> Utility Charges (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 200,000"
                value={defaultUtilityCharges}
                onChange={(e) => setDefaultUtilityCharges(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Ownership & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Default Ownership <span className="text-rose-400">*</span>
              </label>
              <select
                value={defaultOwnership}
                onChange={(e) => setDefaultOwnership(e.target.value as any)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="DEVELOPER_SHARE">Developer Share</option>
                <option value="LANDOWNER_SHARE">Landowner Share</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Default Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value as any)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="SOLD">Sold</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>

          {/* Preview Summary */}
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-white mb-2">Generation Preview</h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#829B96]">Total Floors:</span>
                <span className="font-semibold text-white">{totalFloors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Units Per Floor:</span>
                <span className="font-semibold text-white">{unitsPerFloor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Total Units:</span>
                <span className="font-semibold text-[#10B981]">{totalUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#829B96]">Total Value:</span>
                <span className="font-semibold text-white">৳ {previewTotalPrice.toLocaleString("en-BD")}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3E37]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:bg-[#1A3530] hover:text-white text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Generate {totalUnits} Units
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
