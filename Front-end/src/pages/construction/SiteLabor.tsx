import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Search, Download, ChevronRight, Plus, 
  MapPin, DollarSign, CheckCircle2, Clock, Users
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import RecordDailyLaborModal from "@/components/forms/RecordDailyLaborModal";
import DisburseLaborWageModal from "@/components/forms/DisburseLaborWageModal";
import { approveLabor, createLabor, disburseLabor, getLabor } from "@/services/construction.service";

interface LaborRecord {
  id: string;
  date: string;
  projectSite: string;
  contractor: string;
  masonsCount: number;
  masonsRate: number;
  masonsTotal: number;
  helpersCount: number;
  helpersRate: number;
  helpersTotal: number;
  electriciansCount: number;
  electriciansRate: number;
  electriciansTotal: number;
  carpentersCount: number;
  carpentersRate: number;
  carpentersTotal: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimeTotal: number;
  totalPayable: number;
  status: "PENDING" | "PAID";
}

export default function SiteLaborPage() {
  const [selectedSite, setSelectedSite] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRecordLaborModalOpen, setIsRecordLaborModalOpen] = useState(false);
  const [isDisburseWageModalOpen, setIsDisburseWageModalOpen] = useState(false);

  const [laborRecords, setLaborRecords] = useState<LaborRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<LaborRecord | null>(null);
  const loadLabor = () => getLabor().then((response: any) => setLaborRecords(response));
  useEffect(() => { void loadLabor(); }, []);

  const handleExport = (config: any) => {
    const rows = laborRecords.map((record) => `${record.date},${record.projectSite},${record.contractor},${record.totalPayable},${record.status}`);
    const blob = new Blob([`Date,Project Site,Contractor,Total Payable,Status\n${rows.join("\n")}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `site-labor-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  };

  const handleRecordLabor = (data: any) => {
    createLabor({ ...data, date: new Date().toISOString().slice(0, 10) }).then((response: any) => {
      const record = response;
      setLaborRecords((current) => [record, ...current]);
      setIsRecordLaborModalOpen(false);
    });
  };

  const handleApprove = async (record: LaborRecord) => {
    const response: any = await approveLabor(record.id);
    setLaborRecords((current) => current.map((item) => item.id === record.id ? response : item));
  };

  const handleDisburseWage = (data: any) => {
    if (!selectedRecord) return;
    disburseLabor(selectedRecord.id, data).then((response: any) => {
      const record = response.record;
      setLaborRecords((current) => current.map((item) => item.id === record.id ? record : item));
      setSelectedRecord(null);
    });
  };

  const formatCurrency = (amount: number) => "৳ " + Number(amount || 0).toLocaleString("en-BD");
  const categoryTotal = (count: number, rate: number) => Number(count || 0) * Number(rate || 0);

  // Filtered Records
  const filteredRecords = laborRecords.filter((item) => {
    const matchesSearch = 
      item.projectSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = selectedSite === "ALL" || item.projectSite.includes(selectedSite.replace("_", " "));
    return matchesSearch && matchesSite;
  });

  // KPI Calculations
  const totalWorkers = laborRecords.reduce((sum, item) => 
    sum + item.masonsCount + item.helpersCount + item.electriciansCount + item.carpentersCount, 0);
  const totalPayable = laborRecords.reduce((sum, item) => sum + item.totalPayable, 0);
  const totalPaid = laborRecords.filter(e => e.status === "PAID").reduce((sum, item) => sum + item.totalPayable, 0);
  const pendingPayment = totalPayable - totalPaid;

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>HR & Payroll</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Site Labor & Daily Wages</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Site Labor & Daily Wages</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Daily muster roll and wage disbursement for construction sites
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Export
            </Button>
            <Button size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
              onClick={() => setIsRecordLaborModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Record Daily Muster
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Site Selector & KPI */}
      <div className="space-y-4">
        {/* Site Selector */}
        <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex items-center gap-3">
          <label className="text-[11px] text-[#829B96] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#10B981]" /> SELECT PROJECT SITE:
          </label>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Sites</option>
            <option value="GREEN_VALLEY_SITE">Sardar Green Valley Site</option>
            <option value="GRAND_HEIGHTS_SITE">Sardar Grand Heights Site</option>
            <option value="CITY_VISTA_SITE">City Vista Plaza Site</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
            <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Workers</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-white">{totalWorkers}</p>
              <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><Users className="h-4 w-4" /></span>
            </div>
            <p className="text-[11px] text-[#829B96]">All categories</p>
          </div>

          <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
            <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Payable</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-white">{formatCurrency(totalPayable)}</p>
              <span className="p-2 rounded-lg bg-sky-400/10 text-sky-400"><DollarSign className="h-4 w-4" /></span>
            </div>
            <p className="text-[11px] text-sky-400/90">Accumulated wages</p>
          </div>

          <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
            <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Paid</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-[#10B981]">{formatCurrency(totalPaid)}</p>
              <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><CheckCircle2 className="h-4 w-4" /></span>
            </div>
            <p className="text-[11px] text-[#10B981]/90">Disbursed</p>
          </div>

          <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
            <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Pending Payment</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-amber-400">{formatCurrency(pendingPayment)}</p>
              <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><Clock className="h-4 w-4" /></span>
            </div>
            <p className="text-[11px] text-amber-400/90">Awaiting disbursement</p>
          </div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search site, contractor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 4. Daily Muster Roll Table */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2E8F0]">
            <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Project Site</th>
                <th className="p-3.5">Contractor</th>
                <th className="p-3.5">Masons</th>
                <th className="p-3.5">Helpers</th>
                <th className="p-3.5">Electricians</th>
                <th className="p-3.5">Carpenters</th>
                <th className="p-3.5">OT Hours</th>
                <th className="p-3.5">Total Payable</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3E37]">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#1A3530]/40 transition-colors">
                    <td className="p-3.5 font-mono text-white">{record.date}</td>
                    <td className="p-3.5 text-[#829B96]">{record.projectSite}</td>
                    <td className="p-3.5 text-white">{record.contractor}</td>
                    <td className="p-3.5 text-white">
                      <p className="font-semibold">{record.masonsCount}</p>
                      <p className="text-[10px] text-[#829B96]">{formatCurrency(categoryTotal(record.masonsCount, record.masonsRate))}</p>
                    </td>
                    <td className="p-3.5 text-white">
                      <p className="font-semibold">{record.helpersCount}</p>
                      <p className="text-[10px] text-[#829B96]">{formatCurrency(categoryTotal(record.helpersCount, record.helpersRate))}</p>
                    </td>
                    <td className="p-3.5 text-white">
                      <p className="font-semibold">{record.electriciansCount}</p>
                      <p className="text-[10px] text-[#829B96]">{formatCurrency(categoryTotal(record.electriciansCount, record.electriciansRate))}</p>
                    </td>
                    <td className="p-3.5 text-white">
                      <p className="font-semibold">{record.carpentersCount}</p>
                      <p className="text-[10px] text-[#829B96]">{formatCurrency(categoryTotal(record.carpentersCount, record.carpentersRate))}</p>
                    </td>
                    <td className="p-3.5 text-white">
                      <p className="font-semibold">{record.overtimeHours}h</p>
                      <p className="text-[10px] text-[#829B96]">{formatCurrency(categoryTotal(record.overtimeHours, record.overtimeRate))}</p>
                    </td>
                    <td className="p-3.5 font-bold text-[#10B981]">{formatCurrency(record.totalPayable)}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border ${
                        record.status === "PAID" 
                          ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20"
                          : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {record.status === "PENDING" && (
                        <button
                          className="p-1.5 rounded-lg bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 text-[10px]"
                          onClick={() => void handleApprove(record)}
                        >
                          Approve
                        </button>
                      )}
                      {record.status === "APPROVED" && (
                        <button
                          className="p-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/20 text-[10px]"
                          onClick={() => { setSelectedRecord(record); setIsDisburseWageModalOpen(true); }}
                        >
                          Disburse
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-[#829B96] text-xs">
                    No labor records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        availableColumns={["Date", "Project Site", "Contractor", "Masons Count", "Masons Total", "Helpers Count", "Helpers Total", "Electricians Count", "Electricians Total", "Carpenters Count", "Carpenters Total", "OT Hours", "OT Total", "Total Payable", "Status"]}
        defaultColumns={["Date", "Project Site", "Contractor", "Total Payable", "Status"]}
        title="Export Labor Records"
      />

      {/* Record Daily Labor Modal */}
      <RecordDailyLaborModal
        isOpen={isRecordLaborModalOpen}
        onClose={() => setIsRecordLaborModalOpen(false)}
        onSave={handleRecordLabor}
      />

      {/* Disburse Labor Wage Modal */}
      <DisburseLaborWageModal
        isOpen={isDisburseWageModalOpen}
        onClose={() => { setIsDisburseWageModalOpen(false); setSelectedRecord(null); }}
        onSave={(data) => { handleDisburseWage(data); setIsDisburseWageModalOpen(false); }}
        record={selectedRecord ?? undefined}
      />

    </div>
  );
}
