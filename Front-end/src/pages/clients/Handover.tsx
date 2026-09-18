import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Search, Filter, Download, ChevronRight, 
  CheckCircle2, Clock, 
  FileText, Printer, AlertCircle, Home
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import PrintPreviewModal from "@/components/forms/PrintPreviewModal";
import ConfirmDialog from "@/components/forms/ConfirmDialog";
import apiClient from "@/services/api/axios";

interface HandoverItem {
  id: string;
  handoverCode: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  unitNo: string;
  scheduledDate: string;
  actualDate?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  completionPercentage: number;
  checklistItems: number;
  checklistCompleted: number;
}

interface SaleOption {
  id: string;
  saleId?: string;
  clientName?: string;
  projectName: string;
  unitNo: string;
  status: string;
  balanceDue: number;
}

export default function HandoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  
  // Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [sales, setSales] = useState<SaleOption[]>([]);
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedHandover, setSelectedHandover] = useState<HandoverItem | null>(null);

  const [handovers, setHandovers] = useState<HandoverItem[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadHandovers = async () => {
    try {
      const response = await apiClient.get("/sales/handovers");
      setHandovers(response.data);
    } catch (reason: any) {
      setHandovers([]);
      setError(reason?.response?.data?.message ?? "Unable to load handover records");
    }
  };

  useEffect(() => { loadHandovers(); }, []);

  // Handlers
  const handleExport = () => {
    const headers = ["Handover ID", "Client", "Project", "Unit", "Scheduled Date", "Actual Date", "Completion", "Status"];
    const rows = filteredHandovers.map((item) => [
      item.handoverCode, item.clientName || item.clientId, item.projectName, item.unitNo,
      item.scheduledDate, item.actualDate || "", `${item.completionPercentage}%`, item.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `handover-list-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

  const openInitiateModal = async () => {
    setError("");
    try {
      const response = await apiClient.get("/sales");
      setSales(response.data.filter((sale: SaleOption) => sale.status === "completed" && Number(sale.balanceDue || 0) <= 0));
      setSelectedSaleId("");
      setScheduledDate(new Date().toISOString().slice(0, 10));
      setIsInitiateModalOpen(true);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to load completed bookings");
    }
  };

  const initiateHandover = async () => {
    if (!selectedSaleId || !scheduledDate) {
      setError("Select a fully paid booking and scheduled date.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiClient.post("/sales/handovers", { saleId: selectedSaleId, scheduledDate });
      setIsInitiateModalOpen(false);
      await loadHandovers();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to initiate handover");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = (handover: HandoverItem) => {
    setSelectedHandover(handover);
    setIsPrintModalOpen(true);
  };

  const handleCompleteHandover = (handover: HandoverItem) => {
    setSelectedHandover(handover);
    setIsCompleteDialogOpen(true);
  };

  const handleStartHandover = async (handover: HandoverItem) => {
    setSaving(true);
    setError("");
    try {
      await apiClient.post(`/sales/handovers/${handover.id}/start`);
      await loadHandovers();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to start handover verification");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteConfirmed = async () => {
    if (selectedHandover) {
      try {
        await apiClient.post(`/sales/handovers/${selectedHandover.id}/complete`);
        await loadHandovers();
        setIsCompleteDialogOpen(false);
        setSelectedHandover(null);
      } catch (reason: any) {
        setError(reason?.response?.data?.message ?? "Unable to complete handover");
      }
    }
  };

  // Filtering Logic
  const filteredHandovers = handovers.filter((item) => {
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.handoverCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Clients & Sales</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Handover</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Property Handover</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Manage unit handover process, checklist verification, and document generation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export List
            </Button>
            <Button size="sm" onClick={() => void openInitiateModal()} className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5">
              <Home className="h-3.5 w-3.5" />
              Initiate Handover
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Handovers</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{handovers.length} Units</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><Home className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Live records</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Completed</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#10B981]">{handovers.filter((item) => item.status === "COMPLETED").length} Units</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><CheckCircle2 className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#10B981]">{handovers.length ? Math.round((handovers.filter((item) => item.status === "COMPLETED").length / handovers.length) * 100) : 0}% Completion Rate</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">In Progress</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-amber-400">{handovers.filter((item) => item.status === "IN_PROGRESS").length} Units</p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><Clock className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-amber-400/90">Active verification process</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">On Hold</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-rose-400">{handovers.filter((item) => item.status === "ON_HOLD").length} Units</p>
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><AlertCircle className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-rose-400/90">Pending client response</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search client, handover ID, project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === status
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {status === "ALL" ? "All" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Handover Data Table */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2E8F0]">
            <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
              <tr>
                <th className="p-3.5">Handover ID</th>
                <th className="p-3.5">Client Info</th>
                <th className="p-3.5">Project & Unit</th>
                <th className="p-3.5">Scheduled Date</th>
                <th className="p-3.5">Completion</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3E37]">
              {filteredHandovers.length > 0 ? (
                filteredHandovers.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                    {/* Handover Code */}
                    <td className="p-3.5 font-mono text-[#10B981] font-medium">
                      {item.handoverCode}
                    </td>

                    {/* Client Name & Phone */}
                    <td className="p-3.5">
                      <p className="font-semibold text-white">{item.clientName || item.clientId}</p>
                      <p className="text-[11px] text-[#829B96] font-mono">{item.clientPhone || "—"}</p>
                    </td>

                    {/* Project & Unit */}
                    <td className="p-3.5">
                      <p className="font-medium text-white">{item.projectName}</p>
                      <p className="text-[11px] text-[#829B96]">{item.unitNo}</p>
                    </td>

                    {/* Scheduled Date */}
                    <td className="p-3.5 text-[#829B96] font-mono">
                      {item.scheduledDate}
                    </td>

                    {/* Completion Progress */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#0B1816] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#10B981] transition-all"
                            style={{ width: `${item.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-white">
                          {item.checklistCompleted}/{item.checklistItems}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      {item.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      )}
                      {item.status === "IN_PROGRESS" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          <Clock className="h-3 w-3" /> In Progress
                        </span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="inline-flex items-center text-[11px] font-medium text-[#829B96] bg-[#0B1816] px-2 py-0.5 rounded border border-[#1E3E37]">
                          Pending
                        </span>
                      )}
                      {item.status === "ON_HOLD" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <AlertCircle className="h-3 w-3" /> On Hold
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          title="View Details"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          title="Print Handover Documents"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                          onClick={() => handlePrint(item)}
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        {(item.status === "PENDING" || item.status === "ON_HOLD") && (
                          <Button
                            size="sm"
                            disabled={saving}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs h-7 px-2.5"
                            onClick={() => void handleStartHandover(item)}
                          >
                            {item.status === "ON_HOLD" ? "Resume" : "Start"}
                          </Button>
                        )}
                        {item.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs h-7 px-2.5"
                            onClick={() => handleCompleteHandover(item)}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#829B96] text-xs">
                    No handover records found matching your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Handover ID", "Client Name", "Client Phone", "Project", "Unit", "Scheduled Date", "Actual Date", "Completion %", "Checklist Status", "Status"]}
        defaultColumns={["Handover ID", "Client Name", "Project", "Unit", "Scheduled Date", "Actual Date", "Completion %", "Status"]}
        title="Export Handover List"
      />

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedHandover(null);
        }}
        documentData={selectedHandover ? {
          title: "PROPERTY HANDOVER CERTIFICATE",
          refNo: selectedHandover.handoverCode,
          date: selectedHandover.actualDate || selectedHandover.scheduledDate,
          clientName: selectedHandover.clientName,
          projectName: selectedHandover.projectName,
          unitNo: selectedHandover.unitNo,
          items: [{
            description: `Handover of ${selectedHandover.projectName} - ${selectedHandover.unitNo}`,
            amount: 0
          }],
          totalAmount: 0,
          inWords: "Property handover completed"
        } : {
          title: "PROPERTY HANDOVER CERTIFICATE",
          refNo: "",
          date: "",
          items: [],
          totalAmount: 0,
          inWords: ""
        }}
      />

      {/* Complete Handover Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCompleteDialogOpen}
        onClose={() => {
          setIsCompleteDialogOpen(false);
          setSelectedHandover(null);
        }}
        onConfirm={handleCompleteConfirmed}
        title="Complete Handover?"
        description={`Are you sure you want to mark handover ${selectedHandover?.handoverCode} for ${selectedHandover?.clientName} as completed? This will generate the handover certificate and update the status.`}
        variant="SUCCESS"
        confirmText="Complete Handover"
      />

      {isInitiateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="initiate-handover-title" className="w-full max-w-lg rounded-xl border border-[#1E3E37] bg-[#112421] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="initiate-handover-title" className="text-lg font-semibold text-white">Initiate Property Handover</h2><p className="mt-1 text-xs text-[#829B96]">Only fully paid completed bookings are eligible.</p></div>
              <button type="button" onClick={() => setIsInitiateModalOpen(false)} className="text-[#829B96] hover:text-white" aria-label="Close initiate handover dialog">×</button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-sm text-[#CBD5E1]">Completed booking
                <select value={selectedSaleId} onChange={(event) => setSelectedSaleId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white">
                  <option value="">Select booking</option>
                  {sales.map((sale) => <option key={sale.id} value={sale.id}>{sale.saleId || sale.id.slice(0, 8)} · {sale.clientName || "Client"} · {sale.projectName} / {sale.unitNo}</option>)}
                </select>
              </label>
              <label className="block text-sm text-[#CBD5E1]">Scheduled handover date
                <input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white" />
              </label>
              {!sales.length && <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">No fully paid completed bookings are currently available.</p>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInitiateModalOpen(false)}>Cancel</Button>
                <Button disabled={saving || !sales.length} onClick={() => void initiateHandover()} className="bg-[#10B981] text-slate-950">{saving ? "Initiating…" : "Initiate Handover"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
