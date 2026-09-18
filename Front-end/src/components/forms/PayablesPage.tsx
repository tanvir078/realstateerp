import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Search, Filter, Download, ChevronRight, 
  Send, Building2, AlertCircle, Clock, CheckCircle2, 
  Receipt, FileText, DollarSign, CreditCard
} from "lucide-react";

interface PayableRecord {
  id: string;
  billNo: string;
  vendorName: string;
  category: string;
  projectName: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  status: "PAID" | "PARTIAL" | "OVERDUE" | "PENDING";
  overdueDays: number;
}

export default function PayablesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Mock Payables Data
  const [payables] = useState<PayableRecord[]>([
    {
      id: "PAY-3001",
      billNo: "INV-SC-9082",
      vendorName: "Shah Cement Industries",
      category: "Raw Material Supplier",
      projectName: "Sardar Green Valley",
      dueDate: "05 Sep 2026",
      totalAmount: 3500000,
      paidAmount: 1500000,
      dueBalance: 2000000,
      status: "OVERDUE",
      overdueDays: 3,
    },
    {
      id: "PAY-3002",
      billNo: "BILL-CON-104",
      vendorName: "Bismillah Construction & Labour",
      category: "Civil Works Sub-Contractor",
      projectName: "Sardar Grand Heights",
      dueDate: "18 Sep 2026",
      totalAmount: 1200000,
      paidAmount: 400000,
      dueBalance: 800000,
      status: "PARTIAL",
      overdueDays: 0,
    },
    {
      id: "PAY-3003",
      billNo: "INV-BS-552",
      vendorName: "BSRM Steels Ltd.",
      category: "Steel & Rebar Supplier",
      projectName: "Sobhagya Plaza",
      dueDate: "28 Sep 2026",
      totalAmount: 4800000,
      paidAmount: 0,
      dueBalance: 4800000,
      status: "PENDING",
      overdueDays: 0,
    },
    {
      id: "PAY-3004",
      billNo: "BILL-ELEV-09",
      vendorName: "Otis Elevator Bangladesh",
      category: "Equipment & Mechanical",
      projectName: "Sardar Green Valley",
      dueDate: "10 Aug 2026",
      totalAmount: 2200000,
      paidAmount: 2200000,
      dueBalance: 0,
      status: "PAID",
      overdueDays: 0,
    },
  ]);

  const formatCurrency = (amt: number) => "৳ " + amt.toLocaleString("en-BD");

  // Calculations
  const totalPayables = payables.reduce((sum, item) => sum + item.dueBalance, 0);
  const totalOverdue = payables.filter(p => p.status === "OVERDUE").reduce((sum, item) => sum + item.dueBalance, 0);
  const totalPaidThisMonth = payables.reduce((sum, item) => sum + item.paidAmount, 0);

  const filteredPayables = payables.filter((item) => {
    const matchesSearch = 
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {/* 1. Header & Breadcrumb */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Accounting & Finance</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Payables</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Accounts Payable & Vendor Dues</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Manage vendor bills, contractor payables, payment schedules, and cash outflows
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export Payables
            </Button>
            <Button size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              + Process Payment
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
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Overdue Bills</p>
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
          <p className="text-[11px] text-[#10B981]">Paid in Sep 2026</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Avg Payment Term</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-sky-400">22 Days</p>
            <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">Vendor credit period compliance</p>
        </div>
      </div>

      {/* 3. Aging Analysis Breakdown */}
      <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Accounts Payable Aging Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">Current (1-30 Days)</p>
            <p className="text-base font-bold text-emerald-400 mt-1">{formatCurrency(5600000)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">31-60 Days</p>
            <p className="text-base font-bold text-amber-400 mt-1">{formatCurrency(2000000)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">61-90 Days</p>
            <p className="text-base font-bold text-orange-400 mt-1">{formatCurrency(0)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">90+ Days Overdue</p>
            <p className="text-base font-bold text-rose-400 mt-1">{formatCurrency(0)}</p>
          </div>
        </div>
      </div>

      {/* 4. Filters & Search */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search vendor, bill #, project or category..."
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
            <option value="OVERDUE">Overdue Bills</option>
            <option value="PARTIAL">Partially Paid</option>
            <option value="PENDING">Pending Payment</option>
            <option value="PAID">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* 5. Payables Table */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2E8F0]">
            <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
              <tr>
                <th className="p-3.5">Vendor / Contractor</th>
                <th className="p-3.5">Bill Ref & Project</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 text-right">Bill Total (৳)</th>
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
                      <p className="text-[11px] text-[#829B96] font-medium">{item.category}</p>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-mono text-[11px] text-[#10B981] font-semibold">{item.billNo}</p>
                      <p className="text-white font-medium">{item.projectName}</p>
                    </td>
                    <td className="p-3.5 font-mono text-[#829B96]">
                      {item.dueDate}
                      {item.overdueDays > 0 && (
                        <p className="text-[10px] text-rose-400 font-sans font-semibold">
                          {item.overdueDays} days overdue
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
                          title="Make Payment / Issue Voucher"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="View Bill Details"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white hover:border-slate-500 transition-all"
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
                    No payable records found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}