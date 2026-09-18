import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Plus, Hash, FolderTree, Layers, 
  DollarSign, FileText
} from "lucide-react";

interface AddAccountHeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  parentAccounts?: Array<{ id: string; code: string; name: string }>;
  initialAccount?: any | null;
}

export default function AddAccountHeadModal({ isOpen, onClose, onSave, parentAccounts = [], initialAccount = null }: AddAccountHeadModalProps) {
  const [formData, setFormData] = useState({
    parentId: "",
    code: "",
    name: "",
    type: "ASSET",
    isHeader: false,
    isPostable: true,
    openingBalance: "",
    description: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      parentId: initialAccount?.parentId ?? "",
      code: initialAccount?.code ?? "",
      name: initialAccount?.name ?? "",
      type: initialAccount?.type ?? "ASSET",
      isHeader: initialAccount?.isHeader ?? false,
      isPostable: initialAccount?.isPostable ?? true,
      openingBalance: initialAccount?.openingBalance?.toString() ?? "",
      description: initialAccount?.description ?? "",
    });
  }, [initialAccount, isOpen]);

  const isEditing = Boolean(initialAccount?.code);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave({ ...formData, openingBalance: Number(formData.openingBalance || 0) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{isEditing ? "Edit Account Head" : "Add New Account Head"}</h2>
              <p className="text-xs text-[#829B96]">{isEditing ? "Update this chart of accounts entry" : "Create a multi-tier ledger or parent head in Chart of Accounts"}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close account form"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Parent Account Selection */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#10B981]" /> Parent Account Head <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
            >
              <option value="">No parent (top-level account)</option>
              {parentAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Code & Account Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-[#10B981]" /> Account Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1110"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Account Type <span className="text-rose-400">*</span></label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="ASSET">Asset</option>
                <option value="LIABILITY">Liability</option>
                <option value="EQUITY">Equity</option>
                <option value="REVENUE">Revenue</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
          </div>

          {/* Account Head Name */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium">Account Head Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. Petty Cash - Site Office #1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Account Category & Opening Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Category / Node Type</label>
              <select
                value={formData.isHeader ? "Header" : "Ledger"}
                onChange={(e) => {
                  const isHeader = e.target.value === "Header";
                  setFormData({ ...formData, isHeader, isPostable: !isHeader });
                }}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="Ledger">General Ledger (Posting Account)</option>
                <option value="Header">Group Header (Non-Posting Summary)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Opening Balance (৳)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white font-mono placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Description / Remarks */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Remarks / Purpose
            </label>
            <textarea
              rows={2}
              placeholder="Specify the operational purpose of this ledger head..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <Plus className="h-3.5 w-3.5" />
              {isEditing ? "Update Account Head" : "Save Account Head"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}