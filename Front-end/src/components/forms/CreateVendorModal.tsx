import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Plus, Save } from "lucide-react";
import { createVendorType, getVendorTypes } from "@/services/procurement.service";

interface CreateVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultData?: any;
}

const CreateVendorModal = ({ isOpen, onClose, onSave, defaultData }: CreateVendorModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Materials");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Due on receipt");
  const [customPaymentTerms, setCustomPaymentTerms] = useState("");
  const [vendorTypes, setVendorTypes] = useState<any[]>([]);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [typeError, setTypeError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultData) {
      setName(defaultData.name || "");
      setType(defaultData.type || "Materials");
      setContact(defaultData.contact || "");
      setEmail(defaultData.email || "");
      setAddress(defaultData.address || "");
      const savedTerms = defaultData.paymentTerms || "Due on receipt";
      setPaymentTerms(["Advance payment", "Due on receipt", "Cash on delivery", "15 days", "30 days", "45 days", "60 days", "90 days"].includes(savedTerms) ? savedTerms : "Custom");
      setCustomPaymentTerms(["Advance payment", "Due on receipt", "Cash on delivery", "15 days", "30 days", "45 days", "60 days", "90 days"].includes(savedTerms) ? "" : savedTerms);
    }
  }, [defaultData]);

  useEffect(() => {
    if (!isOpen) return;
    getVendorTypes().then(setVendorTypes).catch(() => setVendorTypes([]));
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      type: type.trim(),
      contact,
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(address.trim() ? { address: address.trim() } : {}),
      paymentTerms: paymentTerms === "Custom" ? customPaymentTerms.trim() : paymentTerms,
    };
    void onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {defaultData ? "Edit Vendor" : "Add New Vendor"}
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
          {/* Vendor Type */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Vendor Type *</label>
            <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              {vendorTypes.map((vendorType) => <option key={vendorType.id} value={vendorType.name}>{vendorType.name}</option>)}
            </select>
            <Button type="button" size="sm" variant="outline" onClick={() => setTypeModalOpen(true)} title="Create vendor type"><Plus className="h-4 w-4" /></Button>
            </div>
            {typeError && <p className="mt-1 text-xs text-red-300">{typeError}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Company/Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter vendor name"
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

          {/* Payment Terms */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Payment Terms</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
            >
              <option value="Advance payment">Advance payment</option>
              <option value="Due on receipt">Due on receipt</option>
              <option value="Cash on delivery">Cash on delivery</option>
              <option value="15 days">15 days</option>
              <option value="30 days">30 days</option>
              <option value="45 days">45 days</option>
              <option value="60 days">60 days</option>
              <option value="90 days">90 days</option>
              <option value="Custom">Custom</option>
            </select>
            {paymentTerms === "Custom" && <input value={customPaymentTerms} onChange={(e) => setCustomPaymentTerms(e.target.value)} placeholder="e.g. 40% advance, balance after delivery" className="mt-2 w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96]" required />}
          </div>
          {typeModalOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-sm rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><h3 className="mb-3 text-sm font-semibold text-white">Create Vendor Type</h3><input autoFocus value={newType} onChange={(e) => setNewType(e.target.value)} placeholder="e.g. Legal & Professional" className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96]" /><div className="mt-4 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setTypeModalOpen(false)}>Cancel</Button><Button type="button" onClick={async () => { try { const created = await createVendorType({ name: newType }); setVendorTypes((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name))); setType(created.name); setNewType(""); setTypeModalOpen(false); setTypeError(null); } catch (error: any) { setTypeError(error.message || "Failed to create vendor type"); } }}>Save Type</Button></div></div></div>}

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
              Save Vendor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVendorModal;
