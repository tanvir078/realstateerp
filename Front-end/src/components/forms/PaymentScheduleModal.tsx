import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Calendar, DollarSign, Calculator, FileText, Printer, Plus, Trash2
} from "lucide-react";

interface Installment {
  installmentNo: number;
  dueDate: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE";
}

interface PaymentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  defaultTotalAmount?: number;
  defaultClientId?: string;
  defaultProjectId?: string;
}

export default function PaymentScheduleModal({ 
  isOpen, 
  onClose, 
  onSave, 
  defaultTotalAmount,
  defaultClientId,
  defaultProjectId 
}: PaymentScheduleModalProps) {
  const [totalAmount, setTotalAmount] = useState<number>(defaultTotalAmount || 0);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [paymentTerm, setPaymentTerm] = useState<string>("months");
  const [paymentPeriod, setPaymentPeriod] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [error, setError] = useState("");
  // Auto-calculate down payment amount
  useEffect(() => {
    if (totalAmount > 0) {
      setDownPaymentAmount(Math.round(totalAmount * (downPaymentPercent / 100)));
    }
  }, [totalAmount, downPaymentPercent]);

  // Generate installments
  useEffect(() => {
    if (totalAmount > 0 && paymentPeriod > 0) {
      const balanceAmount = totalAmount - downPaymentAmount;
      const installmentAmount = Math.round(balanceAmount / paymentPeriod);
      
      const newInstallments: Installment[] = [];
      const start = new Date(startDate);
      
      for (let i = 1; i <= paymentPeriod; i++) {
        const dueDate = new Date(start);
        if (paymentTerm === "months") {
          dueDate.setMonth(dueDate.getMonth() + i);
        } else {
          dueDate.setFullYear(dueDate.getFullYear() + i);
        }
        
        newInstallments.push({
          installmentNo: i,
          dueDate: dueDate.toISOString().split("T")[0],
          amount: installmentAmount,
          status: "PENDING"
        });
      }
      
      setInstallments(newInstallments);
    }
  }, [totalAmount, downPaymentAmount, paymentTerm, paymentPeriod, startDate]);

  if (!isOpen) return null;

  const handleAddInstallment = () => {
    const lastInstallment = installments[installments.length - 1];
    const newInstallmentNo = lastInstallment ? lastInstallment.installmentNo + 1 : 1;
    const lastDueDate = lastInstallment ? new Date(lastInstallment.dueDate) : new Date(startDate);
    
    if (paymentTerm === "months") {
      lastDueDate.setMonth(lastDueDate.getMonth() + 1);
    } else {
      lastDueDate.setFullYear(lastDueDate.getFullYear() + 1);
    }
    
    setInstallments([
      ...installments,
      {
        installmentNo: newInstallmentNo,
        dueDate: lastDueDate.toISOString().split("T")[0],
        amount: Math.round((totalAmount - downPaymentAmount) / (installments.length + 1)),
        status: "PENDING"
      }
    ]);
  };

  const handleRemoveInstallment = (index: number) => {
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const handleInstallmentAmountChange = (index: number, amount: number) => {
    setInstallments(installments.map((item, i) => 
      i === index ? { ...item, amount } : item
    ));
  };

  const totalInstallmentAmount = installments.reduce((sum, item) => sum + item.amount, 0);
  const balanceDue = totalAmount - downPaymentAmount - totalInstallmentAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!totalAmount || totalAmount <= 0) return setError("Total amount must be greater than zero.");
    if (downPaymentAmount < 0 || downPaymentAmount >= totalAmount) return setError("Down payment must be less than the total amount.");
    if (installments.length === 0) return setError("Add at least one installment.");
    if (balanceDue < 0) return setError("Installments and down payment cannot exceed the total amount.");

    const scheduleData = {
      totalAmount,
      downPaymentPercent,
      downPaymentAmount,
      paymentTerm,
      paymentPeriod,
      startDate,
      installments,
      balanceDue,
      clientId: defaultClientId,
      projectId: defaultProjectId
    };

    if (onSave) onSave(scheduleData);
    setIsPrintModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b1715] border border-[#1e3e37] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl text-[#e2e8f0] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3e37] bg-[#081210] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center">
              <Calculator className="h-4 w-4 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Payment Schedule Generator
              </h2>
              <p className="text-[11px] text-[#829b96]">
                Auto-generate installment plan for client payments
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-[#112421] border border-[#1e3e37] text-[#829b96] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
          
          {/* Section 1: Payment Configuration */}
          <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3e37] pb-2.5">
              <DollarSign className="h-4 w-4 text-[#10b981]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Payment Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Total Agreement Amount (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={totalAmount || ""}
                  onChange={(e) => setTotalAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                  required
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Down Payment Amount (৳)
                </label>
                <input
                  type="number"
                  value={downPaymentAmount}
                  readOnly
                  className="w-full h-10 bg-[#081210] border border-[#1e3e37] rounded-lg px-3 text-xs text-[#10b981] font-mono cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Balance Due (৳)
                </label>
                <input
                  type="number"
                  value={totalAmount - downPaymentAmount}
                  readOnly
                  className="w-full h-10 bg-[#081210] border border-[#1e3e37] rounded-lg px-3 text-xs text-amber-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Payment Term
                </label>
                <select
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                >
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Payment Period ({paymentTerm === "months" ? "Months" : "Years"})
                </label>
                <input
                  type="number"
                  value={paymentPeriod}
                  onChange={(e) => setPaymentPeriod(Number(e.target.value))}
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Installment Schedule */}
          <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3e37] pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#10b981]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Installment Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddInstallment}
                className="text-[11px] text-[#10b981] hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="h-3 w-3" /> Add Installment
              </button>
            </div>

            {installments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#e2e8f0]">
                  <thead className="bg-[#0b1715]/80 uppercase text-[#829b96] border-b border-[#1e3e37]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Amount (৳)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3e37]">
                    {installments.map((item, index) => (
                      <tr key={index} className="hover:bg-[#1a3530]/40 transition-colors">
                        <td className="p-3 font-mono text-[#10b981] font-medium">{item.installmentNo}</td>
                        <td className="p-3 text-white">{item.dueDate}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleInstallmentAmountChange(index, Number(e.target.value))}
                            className="w-32 bg-[#0b1715] border border-[#1e3e37] rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                          />
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border ${
                            item.status === "PAID"
                              ? "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20"
                              : item.status === "OVERDUE"
                              ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                              : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveInstallment(index)}
                            className="p-1.5 rounded-lg bg-[#0b1715] border border-[#1e3e37] text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-[#1e3e37] rounded-xl bg-[#0b1715]">
                <p className="text-xs text-[#829b96]">
                  Installments will be auto-generated based on payment configuration.
                </p>
              </div>
            )}

            {/* Summary */}
            {installments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1e3e37]">
                <div className="bg-[#0b1715] border border-[#1e3e37] rounded-lg p-3">
                  <p className="text-[10px] text-[#829b96] font-medium uppercase">Total Installments</p>
                  <p className="text-lg font-bold text-white">{installments.length}</p>
                </div>
                <div className="bg-[#0b1715] border border-[#1e3e37] rounded-lg p-3">
                  <p className="text-[10px] text-[#829b96] font-medium uppercase">Total Installment Amount</p>
                  <p className="text-lg font-bold text-[#10b981] font-mono">৳ {totalInstallmentAmount.toLocaleString("en-BD")}</p>
                </div>
                <div className="bg-[#0b1715] border border-[#1e3e37] rounded-lg p-3">
                  <p className="text-[10px] text-[#829b96] font-medium uppercase">Balance Due</p>
                  <p className={`text-lg font-bold font-mono ${balanceDue >= 0 ? "text-[#10b981]" : "text-rose-400"}`}>
                    ৳ {balanceDue.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e3e37]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#112421] border border-[#1e3e37] text-white hover:bg-[#1a3530] text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#10b981] hover:bg-[#0d9668] text-slate-950 font-semibold text-xs gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Schedule
            </Button>
          </div>
        </form>
      </div>

      {/* Print Preview Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-300 w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-gray-50 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Payment Schedule</h3>
                <p className="text-xs text-gray-600">Print preview</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-xs text-gray-700 space-y-4">
                <div className="border-b border-gray-300 pb-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">PAYMENT SCHEDULE</h2>
                  <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Total Amount: ৳ {totalAmount.toLocaleString("en-BD")}</p>
                    <p className="text-gray-600">Down Payment: ৳ {downPaymentAmount.toLocaleString("en-BD")} ({downPaymentPercent}%)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Balance Due: ৳ {(totalAmount - downPaymentAmount).toLocaleString("en-BD")}</p>
                    <p className="text-gray-600">Payment Period: {paymentPeriod} {paymentTerm}</p>
                  </div>
                </div>

                <table className="w-full text-left border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border-b border-gray-300">#</th>
                      <th className="p-2 border-b border-gray-300">Due Date</th>
                      <th className="p-2 border-b border-gray-300">Amount</th>
                      <th className="p-2 border-b border-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2 border-b border-gray-300">{item.installmentNo}</td>
                        <td className="p-2 border-b border-gray-300">{item.dueDate}</td>
                        <td className="p-2 border-b border-gray-300">৳ {item.amount.toLocaleString("en-BD")}</td>
                        <td className="p-2 border-b border-gray-300">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-4 border-t border-gray-300 mt-4">
                  <p className="font-semibold text-gray-900">Total Installments: {installments.length}</p>
                  <p className="text-gray-600">Total Installment Amount: ৳ {totalInstallmentAmount.toLocaleString("en-BD")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
