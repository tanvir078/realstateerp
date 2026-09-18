import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Building2, MapPin, Calendar, Layers, 
  Home, TrendingUp, PieChart, Image, CheckCircle2
} from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectData) => void;
  initialData?: Partial<ProjectData>;
  mode?: "create" | "edit";
}

interface ProjectData {
  projectName: string;
  projectType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "MIXED";
  location: string;
  landSize: string;
  totalFloors: number;
  totalUnits: number;
  developerRatio: number;
  landownerRatio: number;
  targetLaunchDate: string;
  expectedHandover: string;
  projectBannerImage?: File;
}

export default function AddProjectModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialData,
  mode = "create",
}: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<"RESIDENTIAL" | "COMMERCIAL" | "LAND" | "MIXED">("RESIDENTIAL");
  const [location, setLocation] = useState("");
  const [landSize, setLandSize] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [developerRatio, setDeveloperRatio] = useState("50");
  const [landownerRatio, setLandownerRatio] = useState("50");
  const [targetLaunchDate, setTargetLaunchDate] = useState("");
  const [expectedHandover, setExpectedHandover] = useState("");
  const [projectBannerImage, setProjectBannerImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setProjectName(initialData?.projectName || "");
    setProjectType(initialData?.projectType || "RESIDENTIAL");
    setLocation(initialData?.location || "");
    setLandSize(initialData?.landSize || "");
    setTotalFloors(initialData?.totalFloors?.toString() || "");
    setTotalUnits(initialData?.totalUnits?.toString() || "");
    setDeveloperRatio(initialData?.developerRatio?.toString() || "50");
    setLandownerRatio(initialData?.landownerRatio?.toString() || "50");
    setTargetLaunchDate(initialData?.targetLaunchDate || "");
    setExpectedHandover(initialData?.expectedHandover || "");
    setError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    const developer = Number(developerRatio);
    const landowner = Number(landownerRatio);
    if (!projectName.trim() || !location.trim() || !landSize.trim() || !totalFloors || !totalUnits || !targetLaunchDate || !expectedHandover) {
      setError("Please complete all required project fields.");
      return;
    }
    if (developer < 0 || landowner < 0 || developer + landowner !== 100) {
      setError("Developer and landowner ratios must total 100%.");
      return;
    }
    const data: ProjectData = {
      projectName,
      projectType,
      location,
      landSize,
      totalFloors: parseInt(totalFloors),
      totalUnits: parseInt(totalUnits),
      developerRatio: parseInt(developerRatio),
      landownerRatio: parseInt(landownerRatio),
      targetLaunchDate,
      expectedHandover,
      projectBannerImage: projectBannerImage || undefined
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
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{mode === "edit" ? "Edit Project" : "Add New Project"}</h2>
              <p className="text-xs text-[#829B96]">{mode === "edit" ? "Update live project master data" : "Create a new real estate project"}</p>
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
          
          {/* Project Name & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sardar Green Valley"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#10B981]" /> Project Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as any)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LAND">Land</option>
                <option value="MIXED">Mixed-Use</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#10B981]" /> Location / Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Plot, Road, Block, Area (e.g. Pallabi, Mirpur)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Land Size & Total Floors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Land Size <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 8.5 Katha / 6,120 Sft"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Total Floors <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 10 (B + G + 9)"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Total Units */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-[#10B981]" /> Total Units <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              placeholder="Total flats/shops count"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Ratios */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" /> Developer Ratio (%) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={developerRatio}
                onChange={(e) => setDeveloperRatio(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5 text-[#10B981]" /> Landowner Ratio (%) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={landownerRatio}
                onChange={(e) => setLandownerRatio(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Target Launch Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={targetLaunchDate}
                onChange={(e) => setTargetLaunchDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Expected Handover <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={expectedHandover}
                onChange={(e) => setExpectedHandover(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Project Banner Image */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Image className="h-3.5 w-3.5 text-[#10B981]" /> Project Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProjectBannerImage(e.target.files?.[0] || null)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
            />
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
              {mode === "edit" ? "Save Changes" : "Create Project"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
