import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, FileText, Calendar, DollarSign, Building2, 
  User, CheckCircle2, Receipt
} from "lucide-react";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvoiceData) => void | Promise<void>;
  clients?: Array<{ id: string; name: string }>;
  projects?: Array<{ id: string; name: string }>;
}

interface InvoiceData {
  clientId: string;
  projectId: string;
  unitId: string;
  demandCategory: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  discount: number;
  lateFinePolicy: string;
  particulars: string;
}

export default function CreateInvoiceModal({ 
  isOpen, 
  onClose, 
  onSave,
  clients = [],
  projects = []
}: CreateInvoiceModalProps) {
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [demandCategory, setDemandCategory] = useState("INSTALLMENT");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [discount, setDiscount] = useState("0");
  const [lateFinePolicy, setLateFinePolicy] = useState("PER_MONTH_2_PERCENT");
  const [particulars, setParticulars] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError("");
    const numericAmount = Number(amount);
    const numericDiscount = Number(discount || 0);
    if (!clientId || !projectId) return setError("Client and project are required.");
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError("Amount must be greater than zero.");
    if (!Number.isFinite(numericDiscount) || numericDiscount < 0 || numericDiscount >= numericAmount) return setError("Discount must be zero or less than the invoice amount.");
    if (dueDate && dueDate < issueDate) return setError("Due date cannot be before the issue date.");
    setSaving(true);
    const data: InvoiceData = {
      clientId,
      projectId,
      unitId,
      demandCategory,
      amount: numericAmount,
      issueDate,
      dueDate,
      discount: numericDiscount,
      lateFinePolicy,
      particulars
    };
    try {
      await onSave(data);
      onClose();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? reason?.message ?? "Unable to create invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New Invoice</h2>
              <p className="text-xs text-[#829B96]">Issue client demand invoice</p>
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
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
          
          {/* Client Selection */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#10B981]" /> Client Name <span className="text-rose-400">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id} className="bg-[#0B1816]">
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Project <span className="text-rose-400">*</span>
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
              <label className="text-[#829B96] font-medium">Unit/Apartment</label>
              <input
                type="text"
                placeholder="e.g. Apt #8A"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Demand Category */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-[#10B981]" /> Demand Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={demandCategory}
              onChange={(e) => setDemandCategory(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="BOOKING_MONEY">Booking Money</option>
              <option value="INSTALLMENT">Installment</option>
              <option value="UTILITY">Utility Charge</option>
              <option value="REGISTRATION">Registration Fee</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Amount & Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Amount (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Issue Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          {/* Due Date & Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Discount/Adjustment (৳)
              </label>
              <input
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Late Fine Policy */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium">Late Fine Policy</label>
            <select
              value={lateFinePolicy}
              onChange={(e) => setLateFinePolicy(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
            >
              <option value="NO_FINE">No Late Fine</option>
              <option value="PER_MONTH_2_PERCENT">2% Per Month</option>
              <option value="PER_MONTH_3_PERCENT">3% Per Month</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </select>
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Particulars
            </label>
            <textarea
              rows={2}
              placeholder="Enter invoice description..."
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
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
              onClick={handleSave}
              disabled={saving}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {saving ? "Creating..." : "Create Invoice"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
