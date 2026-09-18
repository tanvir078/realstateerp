import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, RefreshCw, Calendar, DollarSign, CheckCircle2,
  AlertCircle, Settings, Zap
} from "lucide-react";

interface AutoMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunMatch: (config: MatchConfig) => void;
}

interface MatchConfig {
  dateVarianceDays: number;
  amountTolerance: number;
  matchReferenceText: boolean;
}

export default function AutoMatchModal({ 
  isOpen, 
  onClose, 
  onRunMatch 
}: AutoMatchModalProps) {
  const [dateVarianceDays, setDateVarianceDays] = useState("3");
  const [amountTolerance, setAmountTolerance] = useState("0");
  const [matchReferenceText, setMatchReferenceText] = useState(true);

  if (!isOpen) return null;

  const handleRunMatch = () => {
    const config: MatchConfig = {
      dateVarianceDays: parseInt(dateVarianceDays),
      amountTolerance: parseFloat(amountTolerance),
      matchReferenceText
    };
    onRunMatch(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Auto-Match Rules</h2>
              <p className="text-xs text-[#829B96]">Configure automatic transaction matching</p>
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
          
          {/* Date Variance Tolerance */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Date Variance Tolerance (Days)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={dateVarianceDays}
                onChange={(e) => setDateVarianceDays(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
              <div className="text-[10px] text-[#829B96] whitespace-nowrap">
                ± {dateVarianceDays} days allowed
              </div>
            </div>
            <p className="text-[10px] text-[#829B96]">
              Transactions within this date range will be considered for matching
            </p>
          </div>

          {/* Amount Tolerance */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Amount Tolerance (৳)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.01"
                value={amountTolerance}
                onChange={(e) => setAmountTolerance(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
              <div className="text-[10px] text-[#829B96] whitespace-nowrap">
                ± ৳ {parseFloat(amountTolerance).toLocaleString("en-BD")}
              </div>
            </div>
            <p className="text-[10px] text-[#829B96]">
              Set to 0 for exact amount matching only
            </p>
          </div>

          {/* Match Reference Text Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0B1816] border border-[#1E3E37] rounded-lg">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#829B96]" />
              <div>
                <span className="text-[#829B96] font-medium">Match Reference Text</span>
                <p className="text-[10px] text-[#829B96]">Match cheque/ref numbers</p>
              </div>
            </div>
            <button
              onClick={() => setMatchReferenceText(!matchReferenceText)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                matchReferenceText ? "bg-[#10B981]" : "bg-[#1E3E37]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  matchReferenceText ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-[#10B981] mt-0.5 flex-shrink-0" />
            <div className="text-[10px] text-[#10B981]/90">
              <p className="font-medium mb-1">Auto-Match will:</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>Match bank entries with ledger vouchers</li>
                <li>Apply configured tolerance rules</li>
                <li>Mark matched transactions automatically</li>
                <li>Flag unmatched items for manual review</li>
              </ul>
            </div>
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
              onClick={handleRunMatch}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Run Auto-Match
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
