import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, ArrowLeftRight, Building2, Calendar, 
  DollarSign, FileText, CheckCircle2
} from "lucide-react";

interface FundTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: TransferData) => void;
  availableAccounts?: Array<{
    id: string;
    name: string;
    accountNo: string;
    balance: number;
    type: "BANK" | "CASH" | "PETTY_CASH";
  }>;
}

interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transferDate: string;
  reference: string;
  remarks: string;
}

export default function FundTransferModal({ 
  isOpen, 
  onClose, 
  onTransfer,
  availableAccounts = []
}: FundTransferModalProps) {
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  const fromAccount = availableAccounts.find(a => a.id === fromAccountId);
  const toAccount = availableAccounts.find(a => a.id === toAccountId);

  const handleTransfer = () => {
    const data: TransferData = {
      fromAccountId,
      toAccountId,
      amount: parseFloat(amount),
      transferDate,
      reference,
      remarks
    };
    onTransfer(data);
    onClose();
  };

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fund Transfer</h2>
              <p className="text-xs text-[#829B96]">Transfer funds between accounts</p>
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
          
          {/* From Account */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> From Account <span className="text-rose-400">*</span>
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select source account</option>
              {availableAccounts.map((account) => (
                <option key={account.id} value={account.id} className="bg-[#0B1816]">
                  {account.name} ({account.accountNo}) - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
            {fromAccount && (
              <p className="text-[10px] text-[#10B981]">Available Balance: {formatCurrency(fromAccount.balance)}</p>
            )}
          </div>

          {/* To Account */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> To Account <span className="text-rose-400">*</span>
            </label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            >
              <option value="">Select destination account</option>
              {availableAccounts
                .filter(a => a.id !== fromAccountId)
                .map((account) => (
                  <option key={account.id} value={account.id} className="bg-[#0B1816]">
                    {account.name} ({account.accountNo})
                  </option>
                ))}
            </select>
          </div>

          {/* Transfer Amount */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Transfer Amount (৳) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
            {fromAccount && amount && parseFloat(amount) > fromAccount.balance && (
              <p className="text-[10px] text-rose-400">Insufficient balance</p>
            )}
          </div>

          {/* Transfer Date */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Transfer Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Reference */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Reference / Voucher No
            </label>
            <input
              type="text"
              placeholder="e.g. CN-2026-0045"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Remarks / Particulars
            </label>
            <textarea
              rows={2}
              placeholder="Enter purpose of transfer..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              onClick={handleTransfer}
              disabled={!fromAccountId || !toAccountId || !amount || (fromAccount && parseFloat(amount) > fromAccount.balance)}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Transfer Funds
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
