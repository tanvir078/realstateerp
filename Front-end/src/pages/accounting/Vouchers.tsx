import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Plus, Search, Filter, Download,
  FileCheck2, Clock, Printer, Eye, AlertCircle,
  ArrowUpRight, ArrowDownLeft, CheckCircle2,
  Loader2, RefreshCw, FileText
} from "lucide-react";
import NewVoucherModal from "@/components/forms/NewVoucherModal";
import ExportModal from "@/components/forms/ExportModal";
import PrintPreviewModal from "@/components/forms/PrintPreviewModal";
import { useAccounting } from "@/context/AccountingContext";
import { approveVoucher, createVoucher, rejectVoucher, reverseManualVoucher } from "@/services/accounting/accounting.service";

interface VoucherItem {
  id: string;
  voucherNo: string;
  voucherType: "DEBIT" | "CREDIT" | "JOURNAL" | "CONTRA";
  accountHead: string;
  particulars: string;
  amount: number;
  entryDate: string;
  preparedBy: string;
  approvedBy?: string;
  status: "APPROVED" | "PENDING_APPROVAL" | "REJECTED" | "REVERSED";
}

export default function VouchersPage() {
  const {
    vouchers,
    vouchersLoading,
    vouchersError,
    fetchVouchers,
  } = useAccounting();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isNewVoucherModalOpen, setIsNewVoucherModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch vouchers on mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  const approvedCount = vouchers.filter((voucher) => voucher.status === "APPROVED").length;
  const pendingCount = vouchers.filter((voucher) => voucher.status !== "APPROVED").length;
  const totalAmount = vouchers.reduce((sum, voucher) => sum + Number(voucher.amount || 0), 0);
  const totalReceipts = vouchers
    .filter((voucher) => voucher.voucherType === "CREDIT" || voucher.referenceType?.includes("COLLECTION"))
    .reduce((sum, voucher) => sum + Number(voucher.amount || 0), 0);

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  // Handlers
  const handleExport = (config: any) => {
    const rows = (config.dataScope === "FILTERED" ? filteredVouchers : vouchers).map((voucher) => ({
      voucherNo: voucher.voucherNo,
      type: voucher.voucherType,
      accountHead: voucher.accountHead,
      particulars: voucher.particulars,
      amount: voucher.amount,
      entryDate: voucher.entryDate,
      status: voucher.status,
    }));
    const header = Object.keys(rows[0] ?? { voucherNo: "", type: "", accountHead: "", particulars: "", amount: "", entryDate: "", status: "" });
    const csv = [header, ...rows.map((row) => header.map((key) => JSON.stringify((row as Record<string, unknown>)[key] ?? "")))]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `accounting-vouchers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (voucher: VoucherItem) => {
    setSelectedVoucher(voucher);
    setIsPrintModalOpen(true);
  };

  const handleVoucherAction = async (action: "approve" | "reject" | "reverse", voucher: VoucherItem) => {
    setActionError("");
    setActionLoading(true);
    try {
      if (action === "approve") await approveVoucher(voucher.id);
      if (action === "reject") {
        const reason = window.prompt("Enter rejection reason");
        if (!reason?.trim()) return;
        await rejectVoucher(voucher.id, reason);
      }
      if (action === "reverse") {
        if (!window.confirm(`Reverse voucher ${voucher.voucherNo}?`)) return;
        await reverseManualVoucher(voucher.id);
      }
      await fetchVouchers();
    } catch (error: any) {
      setActionError(error.message || "Voucher action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const formatAmountInWords = (amount: number) => {
    // Simple implementation - in production use a proper number-to-words library
    return `Taka ${amount.toLocaleString("en-BD")} Only`;
  };

  // Filtering Logic
  const filteredVouchers = vouchers.filter((item) => {
    const matchesSearch = 
      item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.particulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preparedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "ALL" || item.voucherType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {actionError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{actionError}</p>}
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="p-4 space-y-3 pb-2 border-b border-[#1E3E37]">
   

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Accounting Vouchers</h1>
          
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export Register
            </Button>
            <Button 
              onClick={() => setIsNewVoucherModalOpen(true)}
              size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
            >
              <Plus className="h-4 w-4" />
              New Voucher Entry
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Vouchers (MTD)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{vouchers.length} Entries</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><FileCheck2 className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">{approvedCount} Approved, {pendingCount} Pending</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Payments (Debit)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-rose-400">৳ {totalAmount.toLocaleString("en-BD")}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><ArrowUpRight className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Posted debit and journal entries</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Receipts (Credit)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#10B981]">৳ {totalReceipts.toLocaleString("en-BD")}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><ArrowDownLeft className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#10B981]">Credit entries are included in the live register</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Pending Audit Clearance</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-amber-400">{pendingCount} Entries</p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><Clock className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-amber-400/90">Live approval status</p>
        </div>
      </div>

      {/* 3. Search & Filter Controls */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search voucher no, account head, text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Voucher Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {[
            { key: "ALL", label: "All" },
            { key: "DEBIT", label: "Debit (Payment)" },
            { key: "CREDIT", label: "Credit (Receipt)" },
            { key: "JOURNAL", label: "Journal" },
            { key: "CONTRA", label: "Contra" },
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === type.key
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Vouchers Data Table */}
      {vouchersLoading ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
          <p className="text-sm text-[#829B96]">Loading vouchers...</p>
        </div>
      ) : vouchersError ? (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-12 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
          <p className="text-sm text-rose-400 mb-3">{vouchersError}</p>
          <Button
            onClick={() => fetchVouchers()}
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
                  <th className="p-3.5">Voucher No</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Account Head & Particulars</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Date & Prepared By</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                      {/* Voucher Number */}
                      <td className="p-3.5 font-mono text-[#10B981] font-semibold">
                        {item.voucherNo}
                      </td>

                      {/* Voucher Type Badge */}
                      <td className="p-3.5">
                        {item.voucherType === "DEBIT" && (
                          <span className="text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            Debit
                          </span>
                        )}
                        {item.voucherType === "CREDIT" && (
                          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Credit
                          </span>
                        )}
                        {item.voucherType === "JOURNAL" && (
                          <span className="text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            Journal
                          </span>
                        )}
                        {item.voucherType === "CONTRA" && (
                          <span className="text-[11px] font-medium text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                            Contra
                          </span>
                        )}
                      </td>

                      {/* Account Head & Description */}
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-white">{item.accountHead}</p>
                        <p className="text-[11px] text-[#829B96] truncate">{item.particulars}</p>
                      </td>

                      {/* Amount */}
                      <td className="p-3.5 font-bold text-white text-sm">
                        {formatCurrency(item.amount)}
                      </td>

                      {/* Entry Date & User */}
                      <td className="p-3.5">
                        <p className="font-mono text-[#829B96]">{item.entryDate}</p>
                        <p className="text-[11px] text-[#829B96]/80">By: {item.preparedBy}</p>
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5">
                        {item.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        )}
                        {item.status === "PENDING_APPROVAL" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            <Clock className="h-3 w-3" /> Pending Audit
                          </span>
                        )}
                        {item.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            aria-label={`View voucher ${item.voucherNo}`}
                            title="View Voucher Details"
                            onClick={() => handlePrint(item)}
                            className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            aria-label={`Print voucher ${item.voucherNo}`}
                            title="Print Official Voucher"
                            className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                            onClick={() => handlePrint(item)}
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                          {item.status === "PENDING_APPROVAL" && (
                            <>
                              <button disabled={actionLoading} onClick={() => handleVoucherAction("approve", item)} className="rounded px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50">Approve</button>
                              <button disabled={actionLoading} onClick={() => handleVoucherAction("reject", item)} className="rounded px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-500/10 disabled:opacity-50">Reject</button>
                            </>
                          )}
                          {item.status === "APPROVED" && item.referenceType?.startsWith("MANUAL_") && (
                            <button disabled={actionLoading} onClick={() => handleVoucherAction("reverse", item)} className="rounded px-2 py-1 text-[11px] text-amber-300 hover:bg-amber-500/10 disabled:opacity-50">Reverse</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                      No voucher records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Voucher Modal */}
      <NewVoucherModal
        isOpen={isNewVoucherModalOpen}
        onClose={() => setIsNewVoucherModalOpen(false)}
        onSave={async (voucherData) => {
          try {
            await createVoucher(voucherData);
            await fetchVouchers();
            setIsNewVoucherModalOpen(false);
          } catch (error: any) {
            console.error("Failed to create voucher:", error);
            setActionError(error.message || "Failed to create voucher");
          }
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Voucher No", "Type", "Account Head", "Particulars", "Amount", "Date", "Prepared By", "Status"]}
        defaultColumns={["Voucher No", "Type", "Account Head", "Particulars", "Amount", "Date", "Status"]}
        title="Export Voucher Register"
      />

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedVoucher(null);
        }}
        documentData={selectedVoucher ? {
          title: "OFFICIAL VOUCHER",
          refNo: selectedVoucher.voucherNo,
          date: selectedVoucher.entryDate,
          projectName: selectedVoucher.accountHead,
          items: [{
            description: selectedVoucher.particulars,
            amount: selectedVoucher.amount
          }],
          totalAmount: selectedVoucher.amount,
          inWords: formatAmountInWords(selectedVoucher.amount)
        } : {
          title: "OFFICIAL VOUCHER",
          refNo: "",
          date: "",
          items: [],
          totalAmount: 0,
          inWords: ""
        }}
      />

    </div>
  );
}