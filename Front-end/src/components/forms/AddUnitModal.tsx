import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Building2, Layers, Home, Compass, 
  Bed, Bath, Zap, DollarSign, CheckCircle2
} from "lucide-react";

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UnitData) => void;
  projects?: Array<{ id: string; name: string }>;
  initialData?: Partial<UnitData>;
  mode?: "create" | "edit";
}

interface UnitData {
  projectId: string;
  floorLevel: string;
  unitCode: string;
  unitType: "APARTMENT" | "COMMERCIAL_SHOP" | "OFFICE_SPACE";
  size: number;
  facing: string;
  bedrooms: number;
  bathrooms: number;
  basePricePerSft: number;
  parkingPrice: number;
  price?: number;
  priceMode: "SFT" | "MANUAL";
  utilityCharges: number;
  totalPrice: number;
  ownership: "DEVELOPER_SHARE" | "LANDOWNER_SHARE";
  status: "AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED";
}

export default function AddUnitModal({ 
  isOpen, 
  onClose, 
  onSave,
  projects = [],
  initialData,
  mode = "create",
}: AddUnitModalProps) {
  const [projectId, setProjectId] = useState("");
  const [floorLevel, setFloorLevel] = useState("");
  const [unitCode, setUnitCode] = useState("");
  const [unitType, setUnitType] = useState<"APARTMENT" | "COMMERCIAL_SHOP" | "OFFICE_SPACE">("APARTMENT");
  const [size, setSize] = useState("");
  const [facing, setFacing] = useState("NORTH");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("3");
  const [basePricePerSft, setBasePricePerSft] = useState("");
  const [priceMode, setPriceMode] = useState<"SFT" | "MANUAL">("SFT");
  const [manualPrice, setManualPrice] = useState("");
  const [utilityCharges, setUtilityCharges] = useState("");
  const [ownership, setOwnership] = useState<"DEVELOPER_SHARE" | "LANDOWNER_SHARE">("DEVELOPER_SHARE");
  const [status, setStatus] = useState<"AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED">("AVAILABLE");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setProjectId(initialData?.projectId || "");
    setFloorLevel(initialData?.floorLevel || "");
    setUnitCode(initialData?.unitCode || "");
    setUnitType(initialData?.unitType || "APARTMENT");
    setSize(initialData?.size?.toString() || "");
    setFacing(initialData?.facing || "NORTH");
    setBedrooms(initialData?.bedrooms?.toString() || "3");
    setBathrooms(initialData?.bathrooms?.toString() || "3");
    setBasePricePerSft(initialData?.basePricePerSft?.toString() || "");
    setPriceMode(initialData?.price ? "MANUAL" : "SFT");
    setManualPrice(initialData?.price?.toString() || "");
    setUtilityCharges(initialData?.utilityCharges?.toString() || "");
    setOwnership(initialData?.ownership || "DEVELOPER_SHARE");
    setStatus(initialData?.status || "AVAILABLE");
    setError("");
  }, [isOpen, initialData]);

  // Calculate total price
  const totalPrice = priceMode === "MANUAL"
    ? Number(manualPrice || "0") + Number(utilityCharges || "0")
    : size && basePricePerSft
      ? parseFloat(size) * parseFloat(basePricePerSft) + parseFloat(utilityCharges || "0")
      : 0;

  if (!isOpen) return null;

  const handleSave = () => {
    if (!projectId || !floorLevel.trim() || !unitCode.trim() || size === "" || !Number.isFinite(Number(size)) || (priceMode === "SFT" ? basePricePerSft === "" || !Number.isFinite(Number(basePricePerSft)) : manualPrice === "" || !Number.isFinite(Number(manualPrice)))) {
      setError("Please complete project, floor, unit code, size, and valid pricing.");
      return;
    }
    const data: UnitData = {
      projectId,
      floorLevel,
      unitCode,
      unitType,
      size: parseFloat(size),
      facing,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      basePricePerSft: priceMode === "SFT" ? parseFloat(basePricePerSft) : 0,
      parkingPrice: 0,
      price: priceMode === "MANUAL" ? Number(manualPrice) : undefined,
      utilityCharges: utilityCharges === "" ? 0 : Number(utilityCharges),
      ownership,
      status
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{mode === "edit" ? "Edit Unit" : "Add New Unit"}</h2>
              <p className="text-xs text-[#829B96]">{mode === "edit" ? "Update live property unit data" : "Create a new property unit"}</p>
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
          {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300">{error}</p>}
          
          {/* Project & Floor */}
          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Floor Level <span className="text-rose-400">*</span>
              </label>
              <select
                value={floorLevel}
                onChange={(e) => setFloorLevel(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select floor</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
                <option value="4th Floor">4th Floor</option>
                <option value="5th Floor">5th Floor</option>
                <option value="6th Floor">6th Floor</option>
                <option value="7th Floor">7th Floor</option>
                <option value="8th Floor">8th Floor</option>
                <option value="9th Floor">9th Floor</option>
                <option value="10th Floor">10th Floor</option>
              </select>
            </div>
          </div>

          {/* Unit Code & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#10B981]" /> Unit Code / Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apt #4-A, Shop #G-12"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#10B981]" /> Unit Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value as any)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="APARTMENT">Apartment</option>
                <option value="COMMERCIAL_SHOP">Commercial Shop</option>
                <option value="OFFICE_SPACE">Office Space</option>
              </select>
            </div>
          </div>

          {/* Size & Facing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Size (Square Feet) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1,450"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#10B981]" /> Facing Direction <span className="text-rose-400">*</span>
              </label>
              <select
                value={facing}
                onChange={(e) => setFacing(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="NORTH">North</option>
                <option value="SOUTH">South</option>
                <option value="EAST">East</option>
                <option value="WEST">West</option>
                <option value="NORTH_EAST">North-East</option>
                <option value="SOUTH_EAST">South-East</option>
                <option value="NORTH_WEST">North-West</option>
                <option value="SOUTH_WEST">South-West</option>
                <option value="ROAD_FACING">Road Facing</option>
              </select>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Bed className="h-3.5 w-3.5 text-[#10B981]" /> Bedrooms
              </label>
              <input
                type="number"
                placeholder="e.g. 3"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Bath className="h-3.5 w-3.5 text-[#10B981]" /> Bathrooms
              </label>
              <input
                type="number"
                placeholder="e.g. 3"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium">Price Method <span className="text-rose-400">*</span></label>
            <select
              value={priceMode}
              onChange={(e) => setPriceMode(e.target.value as "SFT" | "MANUAL")}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
            >
              <option value="SFT">Per SFT (Size × Rate)</option>
              <option value="MANUAL">Manual Total Price</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> {priceMode === "SFT" ? "Price per SFT (৳)" : "Manual Price (৳)"} <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder={priceMode === "SFT" ? "e.g. 6,500" : "e.g. 400000"}
                value={priceMode === "SFT" ? basePricePerSft : manualPrice}
                onChange={(e) => priceMode === "SFT" ? setBasePricePerSft(e.target.value) : setManualPrice(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Total Unit Price (৳)
              </label>
              <input
                type="text"
                value={totalPrice > 0 ? totalPrice.toLocaleString("en-BD") : ""}
                readOnly
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Utility Charges & Total */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#10B981]" /> Utility Charges (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 200,000"
                value={utilityCharges}
                onChange={(e) => setUtilityCharges(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Ownership & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Ownership / Share <span className="text-rose-400">*</span>
              </label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value as any)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="DEVELOPER_SHARE">Developer Share</option>
                <option value="LANDOWNER_SHARE">Landowner Share</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Unit Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
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
              {mode === "edit" ? "Save Changes" : "Create Unit"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
