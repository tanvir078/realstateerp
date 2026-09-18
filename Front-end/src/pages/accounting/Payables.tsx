import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  Search, Download,
  Plus, AlertCircle, Clock, CheckCircle2,
  CreditCard, FileText, DollarSign, Truck, Users, TrendingUp,
  Loader2, RefreshCw
} from "lucide-react";
import AddPayableModal from "@/components/forms/AddPayableModal";
import DebitVoucherModal from "@/components/forms/DebitVoucherModal";
import VendorPaymentModal from "@/components/forms/VendorPaymentModal";
import { useAccounting } from "@/context/AccountingContext";
import { createVendorBill, getVendorBills, getVendors, payVendorBill, postVendorBill } from "@/services/procurement.service";

interface PayableRecord {
  id: string;
  billNo: string;
  vendorName: string;
  category: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  status: "PAID" | "PARTIAL" | "OVERDUE" | "PENDING" | "POSTED";
  agingDays: number;
}

export default function PayablesPage() {
  const {
    payables,
    payablesLoading,
    payablesError,
    fetchPayables,
  } = useAccounting();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPayableModalOpen, setPayableModalOpen] = useState(false);
  const [isDebitVoucherModalOpen, setIsDebitVoucherModalOpen] = useState(false);
  const [isVendorPaymentModalOpen, setIsVendorPaymentModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<PayableRecord | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorBills, setVendorBills] = useState<any[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  // Fetch payables on mount
  useEffect(() => {
    Promise.all([getVendorBills(), getVendors()])
      .then(([bills, loadedVendors]) => {
        setVendorBills(bills);
        setVendors(loadedVendors);
      })
      .catch(() => fetchPayables());
  }, [fetchPayables]);

  const loadLivePayables = async () => {
    const [bills, loadedVendors] = await Promise.all([getVendorBills(), getVendors()]);
    setVendorBills(bills);
    setVendors(loadedVendors);
  };

  const livePayables: PayableRecord[] = vendorBills.map((bill) => {
    const vendor = vendors.find((item) => item.id === bill.vendorId);
    const totalAmount = Number(bill.amount || 0);
    const paidAmount = Number(bill.paidAmount || 0);
    const dueBalance = Math.max(totalAmount - paidAmount, 0);
    const agingDays = dueBalance > 0 && new Date(bill.dueDate) < new Date()
      ? Math.floor((Date.now() - new Date(bill.dueDate).getTime()) / 86400000)
      : 0;
    return {
      id: bill.id,
      billNo: bill.billNo,
      vendorName: vendor?.name || bill.vendorId,
      category: vendor?.type || "Supplier",
      projectName: bill.projectName || (bill.projectId ? "Project unavailable" : "Unassigned"),
      issueDate: bill.issueDate,
      dueDate: bill.dueDate,
      totalAmount,
      paidAmount,
      dueBalance,
      agingDays,
      status: dueBalance === 0 ? "PAID" : bill.status === "POSTED" ? "POSTED" : agingDays > 0 ? "OVERDUE" : paidAmount > 0 ? "PARTIAL" : "PENDING",
    };
  });
  const displayedPayables = vendorBills.length ? livePayables : payables;

  const formatCurrency = (amt: number) => "৳ " + amt.toLocaleString("en-BD");

  // Calculations
  const totalPayables = displayedPayables.reduce((sum, item) => sum + (item.dueBalance || 0), 0);
  const totalOverdue = displayedPayables.filter(p => p.status === "OVERDUE").reduce((sum, item) => sum + (item.dueBalance || 0), 0);
  const totalPaidThisMonth = displayedPayables.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const agingBuckets = displayedPayables.reduce(
    (buckets, item) => {
      const balance = Number(item.dueBalance || 0);
      const days = Number(item.agingDays || 0);
      if (balance <= 0) return buckets;
      if (days <= 30) buckets.current += balance;
      else if (days <= 60) buckets.days31to60 += balance;
      else if (days <= 90) buckets.days61to90 += balance;
      else buckets.over90 += balance;
      return buckets;
    },
    { current: 0, days31to60: 0, days61to90: 0, over90: 0 },
  );
  const averagePaymentPeriod = displayedPayables.length
    ? Math.round(
        displayedPayables.reduce((sum, item) => {
          const issueDate = new Date(item.issueDate).getTime();
          const dueDate = new Date(item.dueDate).getTime();
          return sum + (Number.isFinite(issueDate) && Number.isFinite(dueDate) ? Math.max((dueDate - issueDate) / 86400000, 0) : 0);
        }, 0) / displayedPayables.length,
      )
    : 0;
  const currentMonthLabel = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date());

  const filteredPayables = displayedPayables.filter((item) => {
    const matchesSearch =
      item.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.billNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDebitVoucherSave = async (data: any) => {
    setActionError("");
    try {
      throw new Error("Manual debit voucher workflow is not connected to a live payable bill.");
    } catch (error: any) {
      console.error("Failed to create debit voucher:", error);
      setActionError(error.message || "Failed to create debit voucher");
    }
  };

  const handleVendorPaymentSave = async (data: any) => {
    setActionError("");
    try {
      await payVendorBill(data);
      await loadLivePayables();
      setIsVendorPaymentModalOpen(false);
      setSelectedPayable(null);
    } catch (error: any) {
      console.error("Failed to process vendor payment:", error);
      setActionError(error.message || "Failed to process vendor payment");
    }
  };

  const handlePostBill = async (billId: string) => {
    setActionError("");
    try {
      await postVendorBill(billId);
      await loadLivePayables();
    } catch (error: any) {
      setActionError(error.message || "Bill requires a valid PO and GRN before posting");
    }
  };

  const handleMakePayment = (payable: PayableRecord) => {
    setSelectedPayable(payable);
    // Pass billNo for vendor matching in modal
    setIsVendorPaymentModalOpen(true);
  };

  const handleViewBill = (payable: PayableRecord) => {
    setSelectedPayable(payable);
    setDetailsOpen(true);
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {actionError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{actionError}</p>}
      {/* 1. Header & Breadcrumb */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <span className="text-white">/</span>
          <span>Accounting & Finance</span>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Payables</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Accounts Payable & Supplier Dues</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Track vendor bills, supplier payments, and disbursement history
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export Report
            </Button>
            <Button onClick={() => setPayableModalOpen(true)} size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Supplier Bill
            </Button>
            <Button 
              onClick={() => setIsVendorPaymentModalOpen(true)}
              size="sm" className="bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-900 font-semibold text-xs gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Vendor Payment
            </Button>
            <Button 
              onClick={() => setIsDebitVoucherModalOpen(true)}
              size="sm" className="bg-slate-800 border border-slate-500/40 text-slate-300 hover:bg-slate-700 font-semibold text-xs gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Debit Voucher
            </Button>
            <Button 
              onClick={() => navigate("/hr/payroll")}
              size="sm" className="bg-amber-950 border border-amber-500/40 text-amber-400 hover:bg-amber-900 font-semibold text-xs gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Salary Payment
            </Button>
            <Button 
              onClick={() => navigate("/investors/payout-schedule")}
              size="sm" className="bg-purple-950 border border-purple-500/40 text-purple-400 hover:bg-purple-900 font-semibold text-xs gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Investor Return
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Outstanding Payables</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-white">{formatCurrency(totalPayables)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">Pending vendor & contractor bills</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Overdue Dues</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalOverdue)}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-rose-400/90">Passed agreed credit terms</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Disbursed This Month</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-[#10B981]">{formatCurrency(totalPaidThisMonth)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#10B981]">Payments recorded in {currentMonthLabel}</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Avg Payment Period (DPO)</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-sky-400">{averagePaymentPeriod ? `${averagePaymentPeriod} Days` : "—"}</p>
            <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">
            {averagePaymentPeriod ? (averagePaymentPeriod <= 30 ? "Within 30-day vendor limit" : "Above 30-day vendor limit") : "No payment terms available"}
          </p>
        </div>
      </div>

      {/* 3. Aging Breakdown Cards */}
      <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Accounts Payable Aging Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">Current (1-30 Days)</p>
            <p className="text-base font-bold text-emerald-400 mt-1">{formatCurrency(agingBuckets.current)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">31-60 Days</p>
            <p className="text-base font-bold text-amber-400 mt-1">{formatCurrency(agingBuckets.days31to60)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">61-90 Days</p>
            <p className="text-base font-bold text-orange-400 mt-1">{formatCurrency(agingBuckets.days61to90)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">90+ Days Overdue</p>
            <p className="text-base font-bold text-rose-400 mt-1">{formatCurrency(agingBuckets.over90)}</p>
          </div>
        </div>
      </div>

      {/* 4. Search & Filters */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search vendor, bill #, category or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Statuses</option>
            <option value="OVERDUE">Overdue Payables</option>
            <option value="PARTIAL">Partially Paid</option>
            <option value="PENDING">Pending Payment</option>
            <option value="PAID">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* 5. Payables Table */}
      {payablesLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading payables...</p>
        </div>
      ) : payablesError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{payablesError}</p>
          <Button
            onClick={() => fetchPayables()}
            size="sm"
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">Vendor & Category</th>
                  <th className="p-3.5">Bill Ref / Project</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5 text-right">Total Bill (৳)</th>
                  <th className="p-3.5 text-right">Paid (৳)</th>
                  <th className="p-3.5 text-right">Balance Due (৳)</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {filteredPayables.length > 0 ? (
                  filteredPayables.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      <td className="p-3.5 space-y-0.5">
                        <p className="font-bold text-white">{item.vendorName}</p>
                        <p className="text-[11px] text-[#829B96]">{item.category}</p>
                      </td>
                      <td className="p-3.5 space-y-0.5">
                        <p className="font-mono text-[11px] text-[#10B981] font-semibold">{item.billNo}</p>
                        <p className="text-white font-medium">{item.projectName}</p>
                      </td>
                      <td className="p-3.5 font-mono text-[#829B96]">
                        {item.dueDate}
                        {item.agingDays > 0 && (
                          <p className="text-[10px] text-rose-400 font-sans font-semibold">
                            {item.agingDays} days overdue
                          </p>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-mono text-white font-medium">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="p-3.5 text-right font-mono text-[#10B981] font-medium">
                        {formatCurrency(item.paidAmount)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-rose-400">
                        {formatCurrency(item.dueBalance)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          item.status === "PAID"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                            : item.status === "OVERDUE"
                            ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                            : item.status === "PARTIAL"
                            ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                            : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            title="Make Payment / Create Debit Voucher"
                            className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-rose-400 hover:border-rose-400 transition-all"
                            onClick={() => handleMakePayment(item)}
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                          </button>
                          {item.status === "PENDING" && (
                            <button
                              title="Post Bill"
                              className="rounded-lg border border-sky-500/30 bg-[#0B1816] px-2 py-1 text-[10px] font-semibold text-sky-400 hover:border-sky-400"
                              onClick={() => handlePostBill(item.id)}
                            >
                              Post
                            </button>
                          )}
                          <button
                            title="View Bill Details"
                            className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white hover:border-[#10B981] transition-all"
                            onClick={() => handleViewBill(item)}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#829B96] text-xs">
                      No payable bills found matching your search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payable Modal */}
      <AddPayableModal
        isOpen={isPayableModalOpen}
        onClose={() => setPayableModalOpen(false)}
        vendors={vendors}
        onSave={async (data) => {
          try {
            const vendor = vendors.find((item) => item.name === data.vendorName);
            if (!vendor && !data.vendorId) throw new Error("Select a valid vendor");
            await createVendorBill({
              vendorId: data.vendorId || vendor.id,
              billNo: data.billNo,
              issueDate: data.issueDate,
              dueDate: data.dueDate,
              amount: Number(data.totalAmount),
              projectId: data.projectName,
              particulars: data.particulars,
            });
            await loadLivePayables();
            setPayableModalOpen(false);
          } catch (error: any) {
            console.error("Failed to create payable:", error);
            setActionError(error.message || "Failed to create payable");
          }
        }}
      />

      {/* Debit Voucher Modal */}
      <DebitVoucherModal
        isOpen={isDebitVoucherModalOpen}
        onClose={() => setIsDebitVoucherModalOpen(false)}
        onSave={handleDebitVoucherSave}
      />

      {/* Vendor Payment Modal */}
      <VendorPaymentModal
        isOpen={isVendorPaymentModalOpen}
        onClose={() => {
          setIsVendorPaymentModalOpen(false);
          setSelectedPayable(null);
        }}
        onSave={handleVendorPaymentSave}
        bills={vendorBills}
        vendors={vendors}
        defaultBillNo={selectedPayable?.billNo}
      />

      {detailsOpen && selectedPayable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#1E3E37] bg-[#112421] p-6 text-sm text-white">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold">Bill Details · {selectedPayable.billNo}</h2>
              <button className="text-[#829B96] hover:text-white" onClick={() => setDetailsOpen(false)}>Close</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <span className="text-[#829B96]">Vendor</span><span>{selectedPayable.vendorName}</span>
              <span className="text-[#829B96]">Issue date</span><span>{selectedPayable.issueDate}</span>
              <span className="text-[#829B96]">Due date</span><span>{selectedPayable.dueDate}</span>
              <span className="text-[#829B96]">Total</span><span>৳ {selectedPayable.totalAmount.toLocaleString("en-BD")}</span>
              <span className="text-[#829B96]">Paid</span><span>৳ {selectedPayable.paidAmount.toLocaleString("en-BD")}</span>
              <span className="text-[#829B96]">Balance</span><span className="text-rose-400">৳ {selectedPayable.dueBalance.toLocaleString("en-BD")}</span>
              <span className="text-[#829B96]">Status</span><span>{selectedPayable.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}