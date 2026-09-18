import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Plus, Calendar, DollarSign, FileText, 
  Building2, CreditCard, AlertCircle, CheckCircle2 
} from "lucide-react";

interface AddPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void | Promise<void>;
  vendors?: Array<{ id: string; name: string; type?: string }>;
  projects?: Array<{ id: string; projectName: string }>;
}

export default function AddPayableModal({ isOpen, onClose, onSave, vendors = [], projects = [] }: AddPayableModalProps) {
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorId: "",
    category: "Steel & Rebar",
    billNo: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    projectId: projects[0]?.id || "",
    totalAmount: "",
    paymentTerms: "30 Days",
    particulars: "",
  });
  useEffect(() => {
    if (projects.length > 0 && !formData.projectId) setFormData((current) => ({ ...current, projectId: projects[0].id }));
  }, [projects, formData.projectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Supplier Bill</h2>
              <p className="text-xs text-[#829B96]">Record vendor/contractor payable entry</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Vendor Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Vendor Name <span className="text-rose-400">*</span></label>
              {vendors.length > 0 ? (
                <select
                  value={formData.vendorId}
                  onChange={(e) => {
                    const vendor = vendors.find((item) => item.id === e.target.value);
                    setFormData({ ...formData, vendorId: e.target.value, vendorName: vendor?.name || "" });
                  }}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                  required
                >
                  <option value="">Select vendor</option>
                  {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. BSRM Steels Ltd"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="Steel & Rebar">Steel & Rebar</option>
                <option value="Cement Supplier">Cement Supplier</option>
                <option value="Civil Contractor">Civil Contractor</option>
                <option value="Ready Mix Concrete">Ready Mix Concrete</option>
                <option value="Equipment & Mechanical">Equipment & Mechanical</option>
              </select>
            </div>
          </div>

          {/* Bill Number & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Bill / Invoice No. <span className="text-rose-400">*</span></label>
              <input
                type="text"
                placeholder="e.g. INV-BSRM-8821"
                value={formData.billNo}
                onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
              </select>
            </div>
          </div>

          {/* Issue Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Issue Date
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> Due Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Total Amount & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Total Amount (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1720000"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#10B981]" /> Payment Terms
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="45 Days">45 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="Immediate">Immediate</option>
              </select>
            </div>
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Particulars / Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe the goods/services, quantity, and any terms..."
              value={formData.particulars}
              onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
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
              type="submit"
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save Payable
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
