import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, TrendingUp, CheckCircle2, Image, FileText
} from "lucide-react";

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProgressData) => void;
}

interface ProgressData {
  milestoneStage: string;
  completionStatus: number;
  engineersNote: string;
  sitePhotos?: File[];
}

export default function UpdateProgressModal({ 
  isOpen, 
  onClose, 
  onSave 
}: UpdateProgressModalProps) {
  const [milestoneStage, setMilestoneStage] = useState("BASEMENT_SLAB");
  const [completionStatus, setCompletionStatus] = useState("0");
  const [engineersNote, setEngineersNote] = useState("");
  const [sitePhotos, setSitePhotos] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleSave = () => {
    const data: ProgressData = {
      milestoneStage,
      completionStatus: parseInt(completionStatus),
      engineersNote,
      sitePhotos
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Update Construction Progress</h2>
              <p className="text-xs text-[#829B96]">Record milestone and completion status</p>
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
          
          {/* Milestone Stage */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" /> Milestone Stage <span className="text-rose-400">*</span>
            </label>
            <select
              value={milestoneStage}
              onChange={(e) => setMilestoneStage(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="PILING">Piling</option>
              <option value="BASEMENT_SLAB">Basement Slab</option>
              <option value="COLUMN_CASTING">Column Casting</option>
              <option value="BRICK_WORK">Brick Work</option>
              <option value="PLASTER_FINISHING">Plaster & Finishing</option>
              <option value="HANDOVER_READY">Handover Ready</option>
            </select>
          </div>

          {/* Completion Status */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> Completion Status (%) <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                value={completionStatus}
                onChange={(e) => setCompletionStatus(e.target.value)}
                className="flex-1 h-2 bg-[#0B1816] rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={completionStatus}
                onChange={(e) => setCompletionStatus(e.target.value)}
                className="w-20 bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Engineers Note */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Engineer's Note
            </label>
            <textarea
              rows={3}
              placeholder="Enter progress notes and observations..."
              value={engineersNote}
              onChange={(e) => setEngineersNote(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Site Photos */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Image className="h-3.5 w-3.5 text-[#10B981]" /> Site Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSitePhotos(Array.from(e.target.files || []))}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
            />
            {sitePhotos.length > 0 && (
              <p className="text-[11px] text-[#10B981]">
                {sitePhotos.length} file(s) selected
              </p>
            )}
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
              Update Progress
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
