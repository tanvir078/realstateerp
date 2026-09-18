import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Plus, Save } from "lucide-react";
import { getProjectOptions } from "@/services/projects.service";

interface ProjectOption {
  id: string;
  projectName: string;
  projectCode?: string;
}

interface CreateContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultData?: any;
}

const CreateContractorModal = ({ isOpen, onClose, onSave, defaultData }: CreateContractorModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"GENERAL" | "SPECIALIZED" | "SUBCONTRACTOR">("GENERAL");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [project, setProject] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [contractBasis, setContractBasis] = useState("FIXED_AMOUNT");
  const [measurementUnit, setMeasurementUnit] = useState("sqft");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultData) {
      setName(defaultData.name || "");
      setType(defaultData.type || "GENERAL");
      setContact(defaultData.contact || "");
      setEmail(defaultData.email || "");
      setAddress(defaultData.address || "");
      setProject(defaultData.projectId || defaultData.project || "");
      setContractValue(defaultData.contractValue?.toString() || "");
      setContractBasis(defaultData.contractBasis || "FIXED_AMOUNT");
      setMeasurementUnit(defaultData.measurementUnit || "sqft");
      setQuantity(defaultData.quantity?.toString() || "");
      setRate(defaultData.rate?.toString() || "");
      setStartDate(defaultData.startDate || "");
      setEndDate(defaultData.endDate || "");
      setNotes(defaultData.notes || "");
    }
  }, [defaultData]);

  useEffect(() => {
    if (!isOpen) return;

    setProjectsLoading(true);
    setProjectsError(null);
    getProjectOptions()
      .then((projectData) => setProjects(Array.isArray(projectData) ? projectData : []))
      .catch((reason: Error) => setProjectsError(reason.message || "Failed to load projects"))
      .finally(() => setProjectsLoading(false));
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      type,
      contact,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      project,
      contractValue: contractBasis === "UNIT_RATE" ? undefined : (contractValue.trim() ? Number(contractValue) : undefined),
      contractBasis,
      measurementUnit: contractBasis === "UNIT_RATE" ? measurementUnit : undefined,
      quantity: contractBasis === "UNIT_RATE" ? Number(quantity) : undefined,
      rate: contractBasis === "UNIT_RATE" ? Number(rate) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {defaultData ? "Edit Contractor" : "Add New Contractor"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Contractor Type */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Contractor Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="GENERAL">General Contractor</option>
              <option value="SPECIALIZED">Specialized Contractor</option>
              <option value="SUBCONTRACTOR">Subcontractor</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Company/Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter contractor name"
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Contact & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#829B96] mb-1">Contact Number *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter contact number"
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#829B96] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Project & Contract Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#829B96] mb-1">Project *</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select Project</option>
                {projects.map((projectOption) => (
                  <option key={projectOption.id} value={projectOption.id}>
                    {projectOption.projectName}
                    {projectOption.projectCode ? ` (${projectOption.projectCode})` : ""}
                  </option>
                ))}
              </select>
              {projectsLoading && <p className="mt-1 text-[11px] text-[#829B96]">Loading projects...</p>}
              {projectsError && <p className="mt-1 text-[11px] text-red-300">{projectsError}</p>}
              {!projectsLoading && !projectsError && projects.length === 0 && (
                <p className="mt-1 text-[11px] text-amber-300">No projects available. Create a project first.</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-[#829B96] mb-1">Contract Basis</label>
              <select value={contractBasis} onChange={(e) => setContractBasis(e.target.value)} className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white">
                <option value="FIXED_AMOUNT">Fixed amount</option>
                <option value="UNIT_RATE">Unit / sqft rate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#829B96] mb-1">Contract Value (৳)</label>
              <input
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                placeholder={contractBasis === "UNIT_RATE" ? "Calculated from quantity × rate" : "Optional fixed amount"}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                disabled={contractBasis === "UNIT_RATE"}
              /> 
            </div>
          </div>
          {contractBasis === "UNIT_RATE" && <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block text-xs text-[#829B96] mb-1">Quantity *</label><input type="number" min="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 12000" required className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white" /></div>
            <div><label className="block text-xs text-[#829B96] mb-1">Unit *</label><input value={measurementUnit} onChange={(e) => setMeasurementUnit(e.target.value)} placeholder="sqft / sft / unit" required className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white" /></div>
            <div><label className="block text-xs text-[#829B96] mb-1">Rate per unit (৳) *</label><input type="number" min="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 85" required className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white" /></div>
          </div>}

          {/* Contract Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#829B96] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#829B96] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981] resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1E3E37]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Save Contractor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContractorModal;
