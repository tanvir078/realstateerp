import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, MapPin, Users, DollarSign, CheckCircle2, Calculator
} from "lucide-react";

interface RecordDailyLaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LaborData) => void;
}

interface LaborData {
  projectSite: string;
  contractor: string;
  masonsCount: number;
  masonsRate: number;
  helpersCount: number;
  helpersRate: number;
  electriciansCount: number;
  electriciansRate: number;
  carpentersCount: number;
  carpentersRate: number;
  overtimeHours: number;
  overtimeRate: number;
}

export default function RecordDailyLaborModal({ 
  isOpen, 
  onClose, 
  onSave 
}: RecordDailyLaborModalProps) {
  const [projectSite, setProjectSite] = useState("GREEN_VALLEY_SITE");
  const [contractor, setContractor] = useState("Direct Daily Labor");
  const [masonsCount, setMasonsCount] = useState("0");
  const [masonsRate, setMasonsRate] = useState("1200");
  const [helpersCount, setHelpersCount] = useState("0");
  const [helpersRate, setHelpersRate] = useState("700");
  const [electriciansCount, setElectriciansCount] = useState("0");
  const [electriciansRate, setElectriciansRate] = useState("1000");
  const [carpentersCount, setCarpentersCount] = useState("0");
  const [carpentersRate, setCarpentersRate] = useState("1100");
  const [overtimeHours, setOvertimeHours] = useState("0");
  const [overtimeRate, setOvertimeRate] = useState("150");

  if (!isOpen) return null;

  const calculateTotal = () => {
    const masonsTotal = parseInt(masonsCount) * parseInt(masonsRate);
    const helpersTotal = parseInt(helpersCount) * parseInt(helpersRate);
    const electriciansTotal = parseInt(electriciansCount) * parseInt(electriciansRate);
    const carpentersTotal = parseInt(carpentersCount) * parseInt(carpentersRate);
    const overtimeTotal = parseInt(overtimeHours) * parseInt(overtimeRate);
    return masonsTotal + helpersTotal + electriciansTotal + carpentersTotal + overtimeTotal;
  };

  const handleSave = () => {
    const data: LaborData = {
      projectSite,
      contractor,
      masonsCount: parseInt(masonsCount),
      masonsRate: parseInt(masonsRate),
      helpersCount: parseInt(helpersCount),
      helpersRate: parseInt(helpersRate),
      electriciansCount: parseInt(electriciansCount),
      electriciansRate: parseInt(electriciansRate),
      carpentersCount: parseInt(carpentersCount),
      carpentersRate: parseInt(carpentersRate),
      overtimeHours: parseInt(overtimeHours),
      overtimeRate: parseInt(overtimeRate)
    };
    onSave(data);
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
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Daily Muster Roll</h2>
              <p className="text-xs text-[#829B96]">Enter daily labor count and rates</p>
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
          
          {/* Project Site & Contractor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#10B981]" /> Project Site <span className="text-rose-400">*</span>
              </label>
              <select
                value={projectSite}
                onChange={(e) => setProjectSite(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="GREEN_VALLEY_SITE">Sardar Green Valley Site</option>
                <option value="GRAND_HEIGHTS_SITE">Sardar Grand Heights Site</option>
                <option value="CITY_VISTA_SITE">City Vista Plaza Site</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#10B981]" /> Contractor / Group Leader <span className="text-rose-400">*</span>
              </label>
              <select
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="Direct Daily Labor">Direct Daily Labor</option>
                <option value="ABC Construction Group">ABC Construction Group</option>
                <option value="XYZ Builders">XYZ Builders</option>
              </select>
            </div>
          </div>

          {/* Worker Category & Rate Matrix */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white border-b border-[#1E3E37] pb-2">Worker Category & Rate Matrix</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Masons */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
                <p className="text-[10px] text-[#829B96] font-medium uppercase">Masons</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#829B96]">Count</label>
                    <input
                      type="number"
                      value={masonsCount}
                      onChange={(e) => setMasonsCount(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#829B96]">Rate/Day (৳)</label>
                    <input
                      type="number"
                      value={masonsRate}
                      onChange={(e) => setMasonsRate(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#10B981] font-semibold text-right">
                  {formatCurrency(parseInt(masonsCount) * parseInt(masonsRate))}
                </p>
              </div>

              {/* Helpers */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
                <p className="text-[10px] text-[#829B96] font-medium uppercase">Helpers</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#829B96]">Count</label>
                    <input
                      type="number"
                      value={helpersCount}
                      onChange={(e) => setHelpersCount(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#829B96]">Rate/Day (৳)</label>
                    <input
                      type="number"
                      value={helpersRate}
                      onChange={(e) => setHelpersRate(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#10B981] font-semibold text-right">
                  {formatCurrency(parseInt(helpersCount) * parseInt(helpersRate))}
                </p>
              </div>

              {/* Electricians */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
                <p className="text-[10px] text-[#829B96] font-medium uppercase">Electricians</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#829B96]">Count</label>
                    <input
                      type="number"
                      value={electriciansCount}
                      onChange={(e) => setElectriciansCount(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#829B96]">Rate/Day (৳)</label>
                    <input
                      type="number"
                      value={electriciansRate}
                      onChange={(e) => setElectriciansRate(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#10B981] font-semibold text-right">
                  {formatCurrency(parseInt(electriciansCount) * parseInt(electriciansRate))}
                </p>
              </div>

              {/* Carpenters */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 space-y-2">
                <p className="text-[10px] text-[#829B96] font-medium uppercase">Carpenters</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#829B96]">Count</label>
                    <input
                      type="number"
                      value={carpentersCount}
                      onChange={(e) => setCarpentersCount(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#829B96]">Rate/Day (৳)</label>
                    <input
                      type="number"
                      value={carpentersRate}
                      onChange={(e) => setCarpentersRate(e.target.value)}
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#10B981] font-semibold text-right">
                  {formatCurrency(parseInt(carpentersCount) * parseInt(carpentersRate))}
                </p>
              </div>
            </div>
          </div>

          {/* Overtime */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-[#10B981]" /> Overtime Hours
              </label>
              <input
                type="number"
                placeholder="Total OT hours"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> OT Rate/Hour (৳)
              </label>
              <input
                type="number"
                placeholder="Rate per hour"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Total Payable Preview */}
          <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 flex items-center justify-between">
            <p className="text-[10px] text-[#829B96] font-medium uppercase tracking-wider">Total Payable Today</p>
            <p className="text-lg font-bold text-[#10B981]">{formatCurrency(calculateTotal())}</p>
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
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Record Muster
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
