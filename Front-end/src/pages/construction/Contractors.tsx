import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Filter, Search, Users, Building2,
  ChevronRight, Eye, Edit, Trash2, Download, Printer
} from "lucide-react";
import ExportModal from "@/components/forms/ExportModal";
import ConfirmDialog from "@/components/forms/ConfirmDialog";
import CreateContractorModal from "@/components/forms/CreateContractorModal";
import { createContractor, deleteContractor, getContractors, updateContractor } from "@/services/construction.service";

interface Contractor {
  id: string;
  backendId?: string;
  name: string;
  type: "GENERAL" | "SPECIALIZED" | "SUBCONTRACTOR";
  contact: string;
  email: string;
  address: string;
  project: string;
  contractValue: number;
  status: "ACTIVE" | "PENDING" | "COMPLETED" | "TERMINATED";
  startDate: string;
  endDate: string;
}

const Contractors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [error, setError] = useState<string | null>(null);
  /* Live contractor records are loaded from the construction API. */
  const loadContractors = () => getContractors().then((contractorData) => {
    setContractors(contractorData.map((item: any) => ({ ...item, id: item.contractorCode || item.id, backendId: item.id, project: item.projectId || "Unassigned" })));
  }).catch((reason: any) => setError(reason.message || "Failed to load contractors"));
  useEffect(() => { loadContractors(); }, []);

  const formatCurrency = (amount: number) => "৳ " + amount.toLocaleString("en-BD");

  const handleCreateContractor = () => {
    setSelectedContractor(null);
    setIsCreateModalOpen(true);
  };

  const handleContractorSave = (data: any) => {
    const { project, ...contractorData } = data;
    const payload = { ...contractorData, projectId: project || undefined };
    const operation = selectedContractor ? updateContractor(selectedContractor.backendId || selectedContractor.id, payload) : createContractor(payload);
    operation.then(() => { setIsCreateModalOpen(false); setSelectedContractor(null); loadContractors(); }).catch((reason: any) => setError(reason.message || "Failed to save contractor"));
  };

  const handleEditContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsCreateModalOpen(true);
  };

  const handleDeleteContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsDeleteDialogOpen(true);
  };

  const handleExport = (config: any) => {
    const headers = ["Code", "Name", "Type", "Contact", "Email", "Project", "Contract Value", "Status"];
    const rows = filteredContractors.map((contractor) => [contractor.id, contractor.name, contractor.type, contractor.contact, contractor.email, contractor.project, contractor.contractValue, contractor.status]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.download = config?.fileName || "contractors.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    setIsExportModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteConfirmed = () => {
    if (selectedContractor) {
      deleteContractor(selectedContractor.backendId || selectedContractor.id).then(() => { setIsDeleteDialogOpen(false); setSelectedContractor(null); loadContractors(); }).catch((reason: any) => setError(reason.message || "Failed to delete contractor"));
    }
  };

  // Filter logic
  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch = 
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.contact.includes(searchTerm);
    
    const matchesType = selectedType === "ALL" || contractor.type === selectedType;
    const matchesStatus = selectedStatus === "ALL" || contractor.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {error && <div className="mx-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}<button className="ml-3 underline" onClick={() => setError(null)}>Dismiss</button></div>}
      
      {/* Page Header */}
      <div className="p-4 space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Construction & Engineering</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium">Contractors</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Contractors</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Manage contractor profiles, contracts and contacts
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
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={handlePrint}
            >
              <Printer className="h-3.5 w-3.5 text-[#10B981]" />
              Print
            </Button>
            <Button 
              size="sm" 
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
              onClick={handleCreateContractor}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Contractor
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Contractors</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">{contractors.length}</p>
            <span className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]"><Users className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Active: {contractors.filter(c => c.status === "ACTIVE").length}</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-1">
          <p className="text-xs text-[#829B96] font-medium uppercase tracking-wider">Total Contract Value</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">৳ {(contractors.reduce((sum, c) => sum + Number(c.contractValue || 0), 0) / 10000000).toFixed(1)}Cr</p>
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400"><Building2 className="h-4 w-4" /></span>
          </div>
          <p className="text-[11px] text-[#829B96]">Active contracts</p>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#112421] border border-[#1E3E37] p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#829B96]" />
          <input
            type="text"
            placeholder="Search contractor, project, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {["ALL", "GENERAL", "SPECIALIZED", "SUBCONTRACTOR"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === type
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {type === "ALL" ? "All" : type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[#829B96] flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Status:
          </span>
          {["ALL", "ACTIVE", "PENDING", "COMPLETED", "TERMINATED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === status
                  ? "bg-[#10B981] text-slate-950 font-semibold"
                  : "bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-white"
              }`}
            >
              {status === "ALL" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Contractors Table */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1E3E37]">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-white">Contractors</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E2E8F0]">
            <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
              <tr>
                <th className="p-3.5">Contractor ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Contract Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3E37]">
              {filteredContractors.length > 0 ? (
                filteredContractors.map((contractor) => (
                  <tr key={contractor.id} className="hover:bg-[#1A3530]/40 transition-colors">
                    <td className="p-3.5 font-mono text-[#10B981] font-medium">{contractor.id}</td>
                    <td className="p-3.5 text-white">{contractor.name}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        contractor.type === "GENERAL"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : contractor.type === "SPECIALIZED"
                          ? "bg-sky-400/10 text-sky-400 border-sky-400/20"
                          : "bg-purple-400/10 text-purple-400 border-purple-400/20"
                      }`}>
                        {contractor.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-white">{contractor.project}</td>
                    <td className="p-3.5 text-white">{contractor.contractValue == null ? "Not set" : formatCurrency(Number(contractor.contractValue))}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        contractor.status === "ACTIVE"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          : contractor.status === "PENDING"
                          ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                          : contractor.status === "COMPLETED"
                          ? "bg-sky-400/10 text-sky-400 border-sky-400/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {contractor.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#829B96]">{contractor.contact}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          title="View Details"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                          onClick={() => handleEditContractor(contractor)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          title="Edit"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-[#10B981] hover:border-[#10B981] transition-all"
                          onClick={() => handleEditContractor(contractor)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          title="Delete"
                          className="p-1.5 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-[#829B96] hover:text-rose-400 hover:border-rose-500 transition-all"
                          onClick={() => handleDeleteContractor(contractor)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-[#829B96] text-xs">
                    No contractors found matching your search filters.
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
        availableColumns={["Contractor ID", "Name", "Type", "Project", "Contract Value", "Status", "Contact", "Email", "Address"]}
        defaultColumns={["Contractor ID", "Name", "Type", "Project", "Contract Value", "Status", "Contact"]}
        title="Export Contractors"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedContractor(null);
        }}
        onConfirm={handleDeleteConfirmed}
        title="Delete Contractor?"
        description={`Are you sure you want to delete contractor ${selectedContractor?.name}? This action cannot be undone.`}
        variant="DANGER"
        confirmText="Delete Contractor"
      />

      {/* Create/Edit Contractor Modal */}
      <CreateContractorModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedContractor(null);
        }}
        onSave={handleContractorSave}
        defaultData={selectedContractor}
      />
    </div>
  );
};

export default Contractors;
