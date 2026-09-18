import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  ArrowLeft, Building2, MapPin, Calendar, DollarSign, 
  TrendingUp, Users, FileText, Edit, Download, Plus,
  ChevronRight, Clock, CheckCircle2, AlertCircle, Layers, Trash2
} from "lucide-react";
import { deleteProjectDocument, downloadProjectDocument, getProject, getProjectDocuments, getProjectFinancialSummary, getProjectMilestones, getProjectSales, uploadProjectDocument } from "@/services/projects.service";

interface ProjectMilestone {
  id: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  progress: number;
}

interface ProjectUnit {
  id: string;
  unitNumber: string;
  type: string;
  size: string;
  price: number;
  status: "AVAILABLE" | "BOOKED" | "SOLD";
  client?: string;
}

interface ProjectDocument {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function ProjectsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<any | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [financialSummary, setFinancialSummary] = useState<any | null>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState("OTHER");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Project ID is missing");
      return;
    }
    Promise.all([getProject(id), getProjectMilestones(id), getProjectDocuments(id), getProjectFinancialSummary(id), getProjectSales(id)])
      .then(([loadedProject, loadedMilestones, loadedDocuments, loadedFinancialSummary, loadedSales]) => {
        setProject(loadedProject);
        setMilestones(loadedMilestones || []);
        setDocuments(loadedDocuments || []);
        setFinancialSummary(loadedFinancialSummary);
        setSales(loadedSales || []);
      })
      .catch((reason: any) => setError(reason.message || "Failed to load project"));
  }, [id]);

  const handleUpload = async () => {
    if (!id || !uploadFile || !uploadTitle.trim()) return;
    setUploading(true);
    try {
      const document = await uploadProjectDocument(id, uploadTitle.trim(), uploadType, uploadFile);
      setDocuments((current) => [document, ...current]);
      setUploadOpen(false);
      setUploadTitle("");
      setUploadFile(null);
    } catch (reason: any) {
      setError(reason.message || "Failed to upload project document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!id || !window.confirm("Delete this project document?")) return;
    try {
      await deleteProjectDocument(id, documentId);
      setDocuments((current) => current.filter((document) => document.id !== documentId));
    } catch (reason: any) {
      setError(reason.message || "Failed to delete project document");
    }
  };

  if (error) return <div className="p-8 text-sm text-rose-400">{error}</div>;
  if (!project) return <div className="p-8 text-sm text-[#829B96]">Loading project...</div>;

  const projectView = {
    id: project.id,
    name: project.projectName,
    location: project.location,
    startDate: project.targetLaunchDate,
    targetCompletion: project.expectedHandover,
    currentProgress: Number(project.constructionProgress || 0),
    status: project.status,
    totalUnits: Number(project.totalUnits || project.units?.length || 0),
    availableUnits: (project.units || []).filter((unit: any) => unit.status === "AVAILABLE").length,
    bookedUnits: (project.units || []).filter((unit: any) => unit.status === "BOOKED").length,
    soldUnits: (project.units || []).filter((unit: any) => unit.status === "SOLD").length,
    totalInvestment: Number(financialSummary?.totalCost || 0),
    totalRevenue: (project.units || []).filter((unit: any) => unit.status === "SOLD").reduce((sum: number, unit: any) => sum + Number(unit.totalPrice || 0), 0),
    description: `${project.projectCode} • ${project.projectType}`,
  };

  const units: ProjectUnit[] = (project.units || []).map((unit: any) => ({
    id: unit.id,
    unitNumber: unit.unitCode,
    type: unit.unitType,
    size: `${Number(unit.size).toLocaleString()} sqft`,
    price: Number(unit.totalPrice || 0),
    status: unit.status,
  }));

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "milestones", label: "Milestones", icon: TrendingUp },
    { id: "units", label: "Units", icon: Layers },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "allocations", label: "Allocations", icon: Users }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-[#10B981]/10 text-[#10B981]";
      case "IN_PROGRESS": return "bg-amber-400/10 text-amber-400";
      case "PENDING": return "bg-[#829B96]/10 text-[#829B96]";
      case "SOLD": return "bg-[#10B981]/10 text-[#10B981]";
      case "BOOKED": return "bg-sky-400/10 text-sky-400";
      case "AVAILABLE": return "bg-purple-400/10 text-purple-400";
      default: return "bg-[#829B96]/10 text-[#829B96]";
    }
  };

  return (
    <div className="bg-[#0B1816] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#1E3E37] bg-[#112421]">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530]"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-[#829B96] mb-1">
                <span>Projects</span>
                <span>/</span>
                <span className="text-white">{projectView.name}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{projectView.name}</h1>
              <p className="text-sm text-[#829B96] mt-1">{projectView.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              <Button 
                size="sm" 
                className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[#10B981]" />
                <span className="text-xs text-[#829B96]">Total Investment</span>
              </div>
              <p className="text-lg font-bold text-white">৳ {projectView.totalInvestment.toLocaleString()}</p>
            </div>
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[#10B981]" />
                <span className="text-xs text-[#829B96]">Total Revenue</span>
              </div>
              <p className="text-lg font-bold text-white">৳ {Number(financialSummary?.revenue ?? projectView.totalRevenue).toLocaleString()}</p>
            </div>
            {financialSummary && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  ["Collected", financialSummary.collected],
                  ["Receivable", financialSummary.receivable],
                  ["Total Cost", financialSummary.totalCost],
                  ["Gross Profit", financialSummary.grossProfit],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-3">
                    <p className="text-xs text-[#829B96]">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">৳ {Number(value).toLocaleString("en-BD")}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-[#829B96]">Progress</span>
              </div>
              <p className="text-lg font-bold text-white">{projectView.currentProgress}%</p>
            </div>
            <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-sky-400" />
                <span className="text-xs text-[#829B96]">Units</span>
              </div>
              <p className="text-lg font-bold text-white">{projectView.soldUnits}/{projectView.totalUnits} Sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1E3E37] bg-[#112421]">
        <div className="px-4 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[#10B981]/10 text-[#10B981] border-b-2 border-[#10B981]"
                      : "text-[#829B96] hover:text-white hover:bg-[#1A3530]/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 lg:px-8 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[#1E3E37] bg-[#112421]">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Project Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#829B96]">Location</span>
                      <span className="text-xs text-white flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {projectView.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#829B96]">Start Date</span>
                      <span className="text-xs text-white flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {projectView.startDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#829B96]">Target Completion</span>
                      <span className="text-xs text-white flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {projectView.targetCompletion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#829B96]">Status</span>
                      <Badge className={getStatusColor(projectView.status)}>{projectView.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#1E3E37] bg-[#112421]">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Financial Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">Recorded Project Cost</span>
                    <span className="text-xs text-white">৳ {Number(financialSummary?.totalCost ?? 0).toLocaleString("en-BD")}</span>
                    </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#829B96]">Paid Vendor Cost</span>
                        <span className="text-xs text-white">৳ {Number(financialSummary?.paidVendorCost ?? 0).toLocaleString("en-BD")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#829B96]">Construction Cost</span>
                        <span className="text-xs text-white">৳ {Number(financialSummary?.postedConstructionCost ?? 0).toLocaleString("en-BD")}</span>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Unit Summary */}
            <Card className="border-[#1E3E37] bg-[#112421]">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Unit Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#10B981]">{projectView.availableUnits}</p>
                    <p className="text-xs text-[#829B96]">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sky-400">{projectView.bookedUnits}</p>
                    <p className="text-xs text-[#829B96]">Booked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">{projectView.soldUnits}</p>
                    <p className="text-xs text-[#829B96]">Sold</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "milestones" && (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card key={milestone.id} className="border-[#1E3E37] bg-[#112421]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0B1816] border border-[#1E3E37] flex items-center justify-center text-xs text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{milestone.title}</p>
                        <p className="text-xs text-[#829B96]">Target: {milestone.targetDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                        <p className="text-xs text-[#829B96] mt-1">{milestone.progress}% Complete</p>
                      </div>
                      <div className="w-24 bg-[#1E3E37] rounded-full h-2">
                        <div 
                          className="bg-[#10B981] h-2 rounded-full" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "units" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">All Units</h3>
              <Button 
                size="sm" 
                className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map((unit) => (
                <Card key={unit.id} className="border-[#1E3E37] bg-[#112421] cursor-pointer hover:border-[#10B981] transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white">{unit.unitNumber}</span>
                      <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#829B96]">Type</span>
                        <span className="text-xs text-white">{unit.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#829B96]">Size</span>
                        <span className="text-xs text-white">{unit.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#829B96]">Price</span>
                        <span className="text-xs text-white">৳ {unit.price.toLocaleString()}</span>
                      </div>
                      {unit.client && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#829B96]">Client</span>
                          <span className="text-xs text-white">{unit.client}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Project Documents</h3>
              <Button 
                size="sm" 
                className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold"
                onClick={() => setUploadOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="border-[#1E3E37] bg-[#112421]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0B1816] border border-[#1E3E37] flex items-center justify-center">
                          <FileText className="h-5 w-5 text-[#829B96]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{doc.title}</p>
                          <p className="text-xs text-[#829B96]">{doc.documentType} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530]"
                          onClick={async () => {
                            if (!id) return;
                            const blob = await downloadProjectDocument(id, doc.id);
                            const url = URL.createObjectURL(blob);
                            const anchor = document.createElement("a");
                            anchor.href = url;
                            anchor.download = doc.title;
                            anchor.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-[#0B1816] border border-[#1E3E37] text-red-300 hover:bg-red-950/40"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {uploadOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-md space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-5">
                  <h3 className="font-semibold text-white">Upload Project Document</h3>
                  <input required value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} placeholder="Document title" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" />
                  <select value={uploadType} onChange={(event) => setUploadType(event.target.value)} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white">
                    <option value="AGREEMENT">Agreement</option>
                    <option value="ALLOTMENT_LETTER">Allotment Letter</option>
                    <option value="NID_KYC">NID / KYC</option>
                    <option value="COMPLIANCE_CERTIFICATE">Compliance Certificate</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input required type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(event) => setUploadFile(event.target.files?.[0] || null)} className="w-full text-sm text-white" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                    <Button disabled={uploading || !uploadFile || !uploadTitle.trim()} onClick={handleUpload} className="bg-[#10B981] text-slate-950">{uploading ? "Uploading..." : "Upload"}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "allocations" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Unit Allocations</h3>
              <p className="text-xs text-[#829B96]">{sales.length} allocation(s) found</p>
            </div>
            {sales.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#1E3E37] text-[#829B96]">
                    <tr>{["Booking", "Client", "Unit", "Total Price", "Paid", "Balance", "Status"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3E37]">
                    {sales.map((sale) => {
                      const totalPrice = Number(sale.totalPrice || 0);
                      const amountPaid = Number(sale.amountPaid || 0);
                      const balanceDue = Math.max(totalPrice - amountPaid, 0);
                      const getSaleStatusColor = (status: string) => {
                        switch (status?.toLowerCase()) {
                          case 'completed': return 'bg-[#10B981]/10 text-[#10B981]';
                          case 'confirmed': return 'bg-sky-400/10 text-sky-400';
                          case 'in_progress': return 'bg-amber-400/10 text-amber-400';
                          case 'pending': return 'bg-[#829B96]/10 text-[#829B96]';
                          case 'cancelled': return 'bg-rose-400/10 text-rose-400';
                          default: return 'bg-[#829B96]/10 text-[#829B96]';
                        }
                      };
                      return (
                        <tr key={sale.id}>
                          <td className="p-3 font-mono text-[#10B981]">{sale.saleId}</td>
                          <td className="p-3 text-white">{sale.clientId}</td>
                          <td className="p-3 text-[#829B96]">{sale.unitNo}</td>
                          <td className="p-3 text-white">৳ {totalPrice.toLocaleString("en-BD")}</td>
                          <td className="p-3 text-white">৳ {amountPaid.toLocaleString("en-BD")}</td>
                          <td className="p-3 text-white">৳ {balanceDue.toLocaleString("en-BD")}</td>
                          <td className="p-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getSaleStatusColor(sale.status)}`}>{sale.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-[#1E3E37] p-10 text-center text-sm text-[#829B96]">No allocations found for this project.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}