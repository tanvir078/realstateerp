import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { X, Wallet } from "lucide-react";

interface AddCashBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { code: string; name: string; type: string; openingBalance: number }) => Promise<void>;
}

export default function AddCashBankAccountModal({ isOpen, onClose, onSubmit }: AddCashBankAccountModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("BANK");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(openingBalance);
    if (!code.trim() || !name.trim() || !Number.isFinite(amount) || amount < 0) return;
    setSaving(true);
    try {
      await onSubmit({ code: code.trim(), name: name.trim(), type, openingBalance: amount });
      setCode("");
      setName("");
      setType("BANK");
      setOpeningBalance("0");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-[#1E3E37] bg-[#112421] text-[#E2E8F0] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E3E37] bg-[#0B1816] px-6 py-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-[#10B981]" />
            <div>
              <h2 className="font-bold text-white">Add Cash / Bank Account</h2>
              <p className="text-xs text-[#829B96]">Create a live posting account</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#829B96] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 p-6 text-xs">
          <label className="block space-y-1">
            <span className="text-[#829B96]">Account code *</span>
            <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 1101" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white" />
          </label>
          <label className="block space-y-1">
            <span className="text-[#829B96]">Account name *</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Project Bank Account" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white" />
          </label>
          <label className="block space-y-1">
            <span className="text-[#829B96]">Account type *</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white">
              <option value="BANK">Bank</option>
              <option value="CASH">Cash</option>
              <option value="PETTY_CASH">Petty cash</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-[#829B96]">Opening balance (BDT)</span>
            <input type="number" step="0.01" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-white" />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#1E3E37] px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} className="border-[#1E3E37] bg-[#0B1816] text-xs text-[#829B96]">Cancel</Button>
          <Button type="submit" disabled={saving} className="bg-[#10B981] text-xs font-semibold text-slate-950">{saving ? "Saving..." : "Create account"}</Button>
        </div>
      </form>
    </div>
  );
}
