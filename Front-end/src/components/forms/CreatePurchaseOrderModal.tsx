import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, Plus, Save } from "lucide-react";

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultData?: any;
}

interface POItem {
  material: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  total: string;
}

const CreatePurchaseOrderModal = ({ isOpen, onClose, onSave, defaultData }: CreatePurchaseOrderModalProps) => {
  const [vendor, setVendor] = useState("");
  const [project, setProject] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [items, setItems] = useState<POItem[]>([
    { material: "", quantity: "", unit: "pcs", unitPrice: "", total: "" }
  ]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (defaultData) {
      setVendor(defaultData.vendor || "");
      setProject(defaultData.project || "");
      setDeliveryDate(defaultData.deliveryDate || "");
      setRequestedBy(defaultData.requestedBy || "");
      setNotes(defaultData.notes || "");
    }
  }, [defaultData]);

  const handleAddItem = () => {
    setItems([...items, { material: "", quantity: "", unit: "pcs", unitPrice: "", total: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof POItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-calculate total if quantity and unit price are provided
    if (field === "quantity" || field === "unitPrice") {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = (qty * price).toString();
    }
    
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      vendor,
      project,
      deliveryDate,
      requestedBy,
      items,
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
            {defaultData ? "Edit Purchase Order" : "Create New Purchase Order"}
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
          {/* Vendor Selection */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Vendor *</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select Vendor</option>
              <option value="Shah Cement Ltd">Shah Cement Ltd</option>
              <option value="Steel Corporation">Steel Corporation</option>
              <option value="Brick Factory">Brick Factory</option>
              <option value="Sand Supplier">Sand Supplier</option>
              <option value="Interior Design Pro">Interior Design Pro</option>
            </select>
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Project *</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select Project</option>
              <option value="Sardar Green Valley">Sardar Green Valley</option>
              <option value="Sardar Grand Heights">Sardar Grand Heights</option>
              <option value="City Vista Plaza">City Vista Plaza</option>
              <option value="Blue Orchid Residences">Blue Orchid Residences</option>
            </select>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Expected Delivery Date *</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Requested By */}
          <div>
            <label className="block text-xs text-[#829B96] mb-1">Requested By *</label>
            <input
              type="text"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Enter requester name"
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs text-[#829B96]">Order Items *</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[10px] text-[#10B981] hover:text-white flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Item
              </button>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#829B96]">Item {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-[10px] text-rose-400 hover:text-white"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#829B96] mb-1">Material</label>
                    <input
                      type="text"
                      value={item.material}
                      onChange={(e) => handleItemChange(index, "material", e.target.value)}
                      placeholder="Enter material name"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-[#829B96] mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      placeholder="Enter quantity"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-[#829B96] mb-1">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#10B981]"
                    >
                      <option value="pcs">Pieces</option>
                      <option value="tons">Tons</option>
                      <option value="bags">Bags</option>
                      <option value="cubic ft">Cubic Feet</option>
                      <option value="sq ft">Square Feet</option>
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-[#829B96] mb-1">Unit Price (৳)</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                      placeholder="Enter unit price"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-[#829B96] mb-1">Total (৳)</label>
                    <input
                      type="text"
                      value={item.total}
                      readOnly
                      className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-2 py-1.5 text-[10px] text-[#829B96] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
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
              Save PO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;
