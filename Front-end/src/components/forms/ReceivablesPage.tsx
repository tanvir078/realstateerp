import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Search, Filter, Download, ChevronRight, 
  Send, Building2, AlertCircle, Clock, CheckCircle2, 
  Receipt, FileText, DollarSign, UserCheck
} from "lucide-react";

interface ReceivableRecord {
  id: string;
  demandNo: string;
  clientName: string;
  projectName: string;
  unitNo: string;
  installmentName: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  status: "PAID" | "PARTIAL" | "OVERDUE" | "PENDING";
  overdueDays: number;
}

export default function ReceivablesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Mock Receivables Data
  const [receivables] = useState<ReceivableRecord[]>([
    {
      id: "REC-2001",
      demandNo: "DEM-2026-081",
      clientName: "Dr. Kazi Mahfuz",
      projectName: "Sardar Grand Heights",
      unitNo: "Flat #B-12",
      installmentName: "3rd Installment (Roof Slab)",
      dueDate: "01 Sep 2026",
      totalAmount: 1800000,
      paidAmount: 0,
      dueBalance: 1800000,
      status: "OVERDUE",
      overdueDays: 7,
    },
    {
      id: "REC-2002",
      demandNo: "DEM-2026-092",
      clientName: "Anisur Rahman",
      projectName: "Sardar Green Valley",
      unitNo: "Flat #A-4",
      installmentName: "4th Installment (Brickwork)",
      dueDate: "20 Sep 2026",
      totalAmount: 2500000,
      paidAmount: 1000000,
      dueBalance: 1500000,
      status: "PARTIAL",
      overdueDays: 0,
    },
    {
      id: "REC-2003",
      demandNo: "DEM-2026-074",
      clientName: "Nadia Sultana",
      projectName: "Sardar Green Valley",
      unitNo: "Flat #C-2",
      installmentName: "2nd Installment (Piling Complete)",
      dueDate: "25 Sep 2026",
      totalAmount: 3200000,
      paidAmount: 0,
      dueBalance: 3200000,
      status: "PENDING",
      overdueDays: 0,
    },
    {
      id: "REC-2004",
      demandNo: "DEM-2026-060",
      clientName: "Tariqul Islam",
      projectName: "Sobhagya Plaza",
      unitNo: "Shop #G-08",
      installmentName: "Down Payment (2nd Tranche)",
      dueDate: "15 Aug 2026",
      totalAmount: 750000,
      paidAmount: 750000,
      dueBalance: 0,
      status: "PAID",
      overdueDays: 0,
    },
  ]);

  const formatCurrency = (amt: number) => "৳ " + amt.toLocaleString("en-BD");

  // Calculations
  const totalReceivables = receivables.reduce((sum, item) => sum + item.dueBalance, 0);
  const totalOverdue = receivables.filter(p => p.status === "OVERDUE").reduce((sum, item) => sum + item.dueBalance, 0);
  const totalCollectedThisMonth = receivables.reduce((sum, item) => sum + item.paidAmount, 0);

  const filteredReceivables = receivables.filter((item) => {
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.demandNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitNo.toLowerCase().includes(searchTerm.toLowerCase());
    
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
          <span className="text-white font-medium">Receivables</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Accounts Receivable & Client Dues</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Track client installment demands, overdue collections, and payment schedules
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export Schedule
            </Button>
            <Button size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Send Demand Notices
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Outstanding Dues</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-white">{formatCurrency(totalReceivables)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">Uncollected client installment balance</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Overdue Dues</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalOverdue)}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-rose-400/90">Requires immediate reminder SMS / Call</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Collected This Month</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-[#10B981]">{formatCurrency(totalCollectedThisMonth)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#10B981]">Total received in Sep 2026</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Collection Efficiency</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-sky-400">84.5%</p>
            <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <UserCheck className="h-5 w-5" />
            </span>
          </div>
          <p className="text-[11px] text-[#829B96]">Against targeted monthly demand</p>
        </div>
      </div>

      {/* 3. Aging Analysis Breakdown */}
      <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Accounts Receivable Aging Schedule</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">Current (1-30 Days)</p>
            <p className="text-base font-bold text-emerald-400 mt-1">{formatCurrency(4700000)}</p>
          </div>
          <div className="bg-[#0B1816] border border-[#1E3E37] p-3 rounded-lg">
            <p className="text-[11px] text-[#829B96]">31-60 Days</p>
            <p className="text-base font-bold text-amber-400 mt-1">{formatCurrency(1800000)}</p>
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
            placeholder="Search client, demand #, project or unit..."
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
            <option value="OVERDUE">Overdue Dues</option>
            <option value="PARTIAL">Partially Paid</option>
            <option value="PENDING">Pending Payment</option>
            <option value="PAID">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* 5. Receivables Table */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2E8F0]">
            <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
              <tr>
                <th className="p-3.5">Client & Unit</th>
                <th className="p-3.5">Demand Ref / Milestone</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 text-right">Total Demand (৳)</th>
                <th className="p-3.5 text-right">Collected (৳)</th>
                <th className="p-3.5 text-right">Balance Due (৳)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3E37]">
              {filteredReceivables.length > 0 ? (
                filteredReceivables.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-bold text-white">{item.clientName}</p>
                      <p className="text-[11px] text-[#10B981] font-medium">{item.projectName} — {item.unitNo}</p>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-mono text-[11px] text-[#829B96] font-semibold">{item.demandNo}</p>
                      <p className="text-white font-medium">{item.installmentName}</p>
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
                          title="Record Money Receipt"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Send Demand SMS/Notification"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-sky-400 hover:border-sky-500 transition-all"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#829B96] text-xs">
                    No receivable records found matching your filter.
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