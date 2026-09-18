import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Search, FileText, CheckCircle2, AlertCircle,
  Link2, DollarSign, Calendar
} from "lucide-react";

interface ManualMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatch: (data: MatchData) => void;
  bankEntry?: {
    id: string;
    date: string;
    description: string;
    amount: number;
    reference: string;
  };
  availableVouchers?: Array<{
    id: string;
    voucherNo: string;
    date: string;
    particulars: string;
    amount: number;
  }>;
}

interface MatchData {
  bankEntryId: string;
  voucherId: string;
  matchNote: string;
}

export default function ManualMatchModal({ 
  isOpen, 
  onClose, 
  onMatch,
  bankEntry,
  availableVouchers = []
}: ManualMatchModalProps) {
  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  const [matchNote, setMatchNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredVouchers = availableVouchers.filter(v =>
    v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.particulars.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVoucher = availableVouchers.find(v => v.id === selectedVoucherId);

  const handleMatch = () => {
    if (!selectedVoucherId) {
      return;
    }
    const data: MatchData = {
      bankEntryId: bankEntry?.id || "",
      voucherId: selectedVoucherId,
      matchNote
    };
    onMatch(data);
    onClose();
  };

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Manual Match Transaction</h2>
              <p className="text-xs text-[#829B96]">Match bank entry with ledger voucher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Bank Entry Details (Readonly) */}
          {bankEntry && (
            <div className="p-4 bg-[#0B1816] border border-[#1E3E37] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-[#829B96] font-medium mb-2">
                <FileText className="h-3.5 w-3.5" />
                <span>Selected Bank Entry</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-[#829B96]">Date</p>
                  <p className="text-white font-medium">{bankEntry.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#829B96]">Reference</p>
                  <p className="text-white font-mono">{bankEntry.reference}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-[#829B96]">Description</p>
                  <p className="text-white">{bankEntry.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-[#829B96]">Amount</p>
                  <p className="text-lg font-bold text-[#10B981]">{formatCurrency(bankEntry.amount)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Voucher Selection */}
          <div className="space-y-2">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-[#10B981]" /> Select System Ledger Voucher <span className="text-rose-400">*</span>
            </label>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
              <input
                type="text"
                placeholder="Search voucher no or particulars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            {/* Voucher List */}
            <div className="max-h-48 overflow-y-auto bg-[#0B1816] border border-[#1E3E37] rounded-lg">
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map((voucher) => (
                  <button
                    key={voucher.id}
                    onClick={() => setSelectedVoucherId(voucher.id)}
                    className={`w-full p-3 border-b border-[#1E3E37] last:border-b-0 text-left transition-all ${
                      selectedVoucherId === voucher.id
                        ? "bg-[#10B981]/10 border-l-2 border-l-[#10B981]"
                        : "hover:bg-[#1A3530]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[#10B981] font-medium">{voucher.voucherNo}</span>
                      <span className="font-bold text-white">{formatCurrency(voucher.amount)}</span>
                    </div>
                    <p className="text-[11px] text-[#829B96]">{voucher.particulars}</p>
                    <p className="text-[10px] text-[#829B96]">{voucher.date}</p>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-[#829B96]">
                  No vouchers found matching your search
                </div>
              )}
            </div>
          </div>

          {/* Selected Voucher Details */}
          {selectedVoucher && (
            <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
              <div className="flex items-center gap-2 text-[#10B981] font-medium mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Selected Voucher</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-[#829B96]">Voucher No:</span> {selectedVoucher.voucherNo}
                </div>
                <div>
                  <span className="text-[#829B96]">Date:</span> {selectedVoucher.date}
                </div>
                <div className="col-span-2">
                  <span className="text-[#829B96]">Particulars:</span> {selectedVoucher.particulars}
                </div>
              </div>
            </div>
          )}

          {/* Match Note */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Match Note
            </label>
            <textarea
              rows={2}
              placeholder="Add any notes about this match..."
              value={matchNote}
              onChange={(e) => setMatchNote(e.target.value)}
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
              onClick={handleMatch}
              disabled={!selectedVoucherId}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link2 className="h-3.5 w-3.5" />
              Match Voucher
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
