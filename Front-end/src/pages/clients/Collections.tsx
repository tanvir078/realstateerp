import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Search, Filter, Download, ChevronRight, 
  CreditCard, CheckCircle2, Clock, FileText, 
  Printer, AlertCircle, Wallet
} from "lucide-react";
import CollectPaymentModal from "@/components/forms/CollectPaymentModal";
import ExportModal from "@/components/forms/ExportModal";
import MoneyReceiptPrintModal from "@/components/forms/MoneyReceiptPrintModal";
import { collectPayment, getCollections } from "@/services/collections.service";

interface CollectionItem {
  id: string;
  mrNo: string; // Money Receipt Number
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  clientNid?: string;
  projectName: string;
  unitNo: string;
  unitType?: string;
  unitSize?: number;
  amount: number;
  paymentMode: "CASH" | "CHEQUE" | "PAY_ORDER" | "BANK_TRANSFER" | "ONLINE";
  bankName?: string;
  chequeOrTxnNo?: string;
  collectionDate: string;
  collectedBy: string;
  status: "CLEARED" | "PENDING_CLEARANCE" | "BOUNCED";
}

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await getCollections();
      setCollections(data.map((item: any) => ({
        id: item.id,
        mrNo: item.receiptNo,
        clientName: item.clientName || item.clientId,
        clientPhone: item.clientPhone || "",
        clientEmail: item.clientEmail || "",
        clientAddress: item.clientAddress || "",
        clientNid: item.clientNid || "",
        projectName: item.projectName || "",
        unitNo: item.unitNo || "",
        unitType: item.unitType || "",
        unitSize: Number(item.unitSize || 0),
        amount: Number(item.amount),
        paymentMode: String(item.paymentMethod).toUpperCase() as CollectionItem["paymentMode"],
        chequeOrTxnNo: item.referenceNo,
        collectionDate: item.paymentDate,
        collectedBy: item.collectedBy || "System",
        status: item.status || "CLEARED",
      })));
      setError(null);
    } catch (reason: any) {
      setError(reason.message || "Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  // Handlers
  const handleNewCollection = () => {
    setSelectedCollection(null);
    setIsCollectionModalOpen(true);
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportData = (_config: any) => {
    const rows = filteredCollections.map((item) => [item.mrNo, item.clientName, item.amount, item.paymentMode, item.collectionDate, item.status].join(","));
    const blob = new Blob([["Receipt,Client,Amount,Method,Date,Status", ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "collections.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReceipt = (collection: CollectionItem) => {
    setSelectedCollection(collection);
    setIsPrintModalOpen(true);
  };

  const handleViewVoucher = (collection: CollectionItem) => {
    setSelectedCollection(collection);
  };

  const handleCollectionSave = async (data: any) => {
    try {
      await collectPayment(data);
      await loadCollections();
    } catch (reason: any) {
      setError(reason.message || "Failed to record collection");
      throw reason;
    }
  };

  // Filtering Logic
  const filteredCollections = collections.filter((item) => {
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mrNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.chequeOrTxnNo && item.chequeOrTxnNo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = selectedMethod === "ALL" || item.paymentMode === selectedMethod;
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;

    return matchesSearch && matchesMethod && matchesStatus;
  });
  const totalCollection = collections.reduce((sum, item) => sum + item.amount, 0);
  const pendingClearance = collections.filter((item) => item.status === "PENDING_CLEARANCE").reduce((sum, item) => sum + item.amount, 0);
  const cashInHand = collections.filter((item) => item.paymentMode === "CASH").reduce((sum, item) => sum + item.amount, 0);
  const bounced = collections.filter((item) => item.status === "BOUNCED").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Clients & Sales</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Collections</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Payment Collections</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Manage money receipts, cheque/bank clearances, and customer collection history
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={handleExport}
            >
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export Receipts
            </Button>
            <Button 
              size="sm" 
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
              onClick={handleNewCollection}
            >
              <Plus className="h-4 w-4" />
              New Collection (MR)
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Collection (MTD)</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#10B981]">{formatCurrency(totalCollection)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><Wallet className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Live receipts in the register</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Pending Bank Clearance</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-amber-400">{formatCurrency(pendingClearance)}</p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><Clock className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-amber-400/90">{collections.filter((item) => item.status === "PENDING_CLEARANCE").length} receipts in transit</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Cash In Hand</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{formatCurrency(cashInHand)}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><CreditCard className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Live cash-method collections</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Bounced / Dishonored</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-rose-400">{formatCurrency(bounced)}</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><AlertCircle className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-rose-400/90">{collections.filter((item) => item.status === "BOUNCED").length} receipts require action</p>
        </div>
      </div>

      {/* 3. Search & Filter Controls */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search MR No, client, cheque or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Mode:
          </span>
          {["ALL", "CASH", "CHEQUE", "PAY_ORDER", "BANK_TRANSFER"].map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedMethod === method
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {method === "ALL" ? "All" : method.replace("_", " ")}
            </button>
          ))}
          <select aria-label="Filter collection status" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-2 py-1 text-xs text-[#829B96]">
            <option value="ALL">All statuses</option>
            <option value="CLEARED">Cleared</option>
            <option value="PENDING_CLEARANCE">Pending</option>
            <option value="BOUNCED">Bounced</option>
          </select>
        </div>
      </div>

      {/* 4. Collections Data Table */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2E8F0]">
            <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
              <tr>
                <th className="p-3.5">MR Number</th>
                <th className="p-3.5">Client & Unit</th>
                <th className="p-3.5">Payment Details</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Date & Collector</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3E37]">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-[#829B96]">Loading collections…</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="p-8 text-center text-rose-400">{error}</td></tr>
              ) : filteredCollections.length > 0 ? (
                filteredCollections.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                    {/* Money Receipt Code */}
                    <td className="p-3.5 font-mono text-[#10B981] font-semibold">
                      {item.mrNo}
                    </td>

                    {/* Client & Unit */}
                    <td className="p-3.5">
                      <p className="font-semibold text-white">{item.clientName}</p>
                      <p className="text-[11px] text-[#829B96]">{item.projectName} • <span className="text-white">{item.unitNo}</span></p>
                    </td>

                    {/* Payment Details */}
                    <td className="p-3.5">
                      <span className="font-medium text-white px-2 py-0.5 bg-[#0B1816] rounded border border-[#1E3E37] text-[11px]">
                        {item.paymentMode.replace("_", " ")}
                      </span>
                      {item.bankName && (
                        <p className="text-[11px] text-[#829B96] mt-1">
                          {item.bankName} {item.chequeOrTxnNo ? `(${item.chequeOrTxnNo})` : ""}
                        </p>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-3.5 font-bold text-[#10B981] text-sm">
                      {formatCurrency(item.amount)}
                    </td>

                    {/* Date & Collector */}
                    <td className="p-3.5">
                      <p className="font-mono text-[#829B96]">{item.collectionDate}</p>
                      <p className="text-[11px] text-[#829B96]/80">By: {item.collectedBy}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      {item.status === "CLEARED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                          <CheckCircle2 className="h-3 w-3" /> Cleared
                        </span>
                      )}
                      {item.status === "PENDING_CLEARANCE" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                      {item.status === "BOUNCED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <AlertCircle className="h-3 w-3" /> Dishonored
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          title="Print Money Receipt"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                          onClick={() => handlePrintReceipt(item)}
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          title="View Voucher Details"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                          onClick={() => handleViewVoucher(item)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                    No collection records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      <CollectPaymentModal
        isOpen={isCollectionModalOpen}
        onClose={() => {
          setIsCollectionModalOpen(false);
          setSelectedCollection(null);
        }}
        onSave={handleCollectionSave}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportData}
        availableColumns={["MR Number", "Client Name", "Project", "Unit", "Amount", "Payment Mode", "Bank Name", "Reference No", "Collection Date", "Status", "Collected By"]}
        defaultColumns={["MR Number", "Client Name", "Project", "Unit", "Amount", "Payment Mode", "Collection Date", "Status"]}
        title="Export Collections"
      />

      {/* Money Receipt Print Modal */}
      <MoneyReceiptPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedCollection(null);
        }}
        data={selectedCollection ? {
          mrNo: selectedCollection.mrNo,
          date: selectedCollection.collectionDate,
          clientName: selectedCollection.clientName,
          clientPhone: selectedCollection.clientPhone,
          projectName: selectedCollection.projectName,
          unitCode: selectedCollection.unitNo,
          unitType: selectedCollection.unitType || "PROPERTY UNIT",
          unitSize: selectedCollection.unitSize || 0,
          amount: selectedCollection.amount,
          paymentMode: selectedCollection.paymentMode,
          referenceNo: selectedCollection.chequeOrTxnNo,
          bankName: selectedCollection.bankName,
          collectedBy: selectedCollection.collectedBy,
          clientEmail: selectedCollection.clientEmail,
          clientAddress: selectedCollection.clientAddress,
          clientNid: selectedCollection.clientNid,
          particulars: `Money receipt for ${selectedCollection.projectName} - ${selectedCollection.unitNo}`,
          amountInWords: `Taka ${selectedCollection.amount.toLocaleString("en-BD")} Only`
        } : {
          mrNo: "",
          date: "",
          clientName: "",
          clientPhone: "",
          projectName: "",
          unitCode: "",
          unitType: "",
          unitSize: 0,
          amount: 0,
          paymentMode: "",
          collectedBy: "",
          amountInWords: ""
        }}
      />

    </div>
  );
}