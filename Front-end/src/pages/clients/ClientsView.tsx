import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Building, 
  FileText, Wallet, Bell, Download, Edit, CheckCircle2, 
  AlertCircle, Calendar, ShieldCheck, FileCheck, ChevronRight
} from "lucide-react";
import apiClient from "@/services/api/axios";
import { getUnits } from "@/services/projects.service";

interface Installment {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paidDate?: string;
  receiptNo?: string;
  status: "PAID" | "OVERDUE" | "UPCOMING";
}

interface ClientDocument {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function ClientsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"schedule" | "overview" | "unit" | "documents">("schedule");
  const [clientData, setClientData] = useState<any | null>(null);
  const [schedule, setSchedule] = useState<Installment[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiClient.get(`/clients/${id}`),
      apiClient.get(`/sales/client/${id}`),
      apiClient.get("/sales/installments"),
      apiClient.get("/sales/collections"),
    ]).then(async ([clientResponse, salesResponse, installmentsResponse, collectionsResponse]) => {
      const client = clientResponse.data;
      const sale = salesResponse.data[0];
      const projectUnits = sale?.projectId ? await getUnits(sale.projectId) : [];
      const parkingUnit = sale?.parkingUnitId ? projectUnits.find((unit: any) => unit.id === sale.parkingUnitId) : null;
      const collections = collectionsResponse.data.filter((item: any) => item.clientId === id);
      const installments = installmentsResponse.data.filter((item: any) => (item.clientRecordId || item.clientId) === id);
      const receiptByInstallment = new Map(collections.map((item: any) => [item.installmentId, item]));
      setClientData({
        ...client,
        projectName: sale?.projectName || client.project || "Not allocated",
        unitNo: sale?.unitNo || client.unitNo || "—",
        totalPrice: Number(sale?.totalPrice ?? client.totalPrice ?? 0),
        totalPaid: Number(sale?.amountPaid ?? client.totalPaid ?? 0),
        dueAmount: Number(sale?.balanceDue ?? client.dueAmount ?? 0),
        bookingDate: sale?.saleDate || client.createdAt,
        expectedHandover: sale?.expectedCompletionDate || "—",
        carParking: parkingUnit?.unitCode || "Not allocated",
        paymentStatus: client.paymentStatus || "PENDING",
        salesRep: sale?.salesRep || client.salesRep || "—",
      });
      setSchedule(installments.map((item: any) => {
        const receipt = receiptByInstallment.get(item.id) as any;
        return {
          ...item,
          amount: Number(item.amount),
          paidAmount: Number(item.paidAmount),
          status: Number(item.paidAmount) >= Number(item.amount)
            ? "PAID"
            : new Date(item.dueDate) < new Date() ? "OVERDUE" : "UPCOMING",
          paidDate: receipt?.paymentDate,
          receiptNo: receipt?.receiptNo,
        };
      }));
    }).catch((reason: any) => setLoadError(reason.message || "Failed to load client details"));
  }, [id]);

  const documents: ClientDocument[] = [
    { id: "d1", title: "Signed Booking Form", type: "PDF", uploadDate: "15 Jan 2025", size: "2.4 MB" },
    { id: "d2", title: "Client NID Card Copy", type: "PNG", uploadDate: "15 Jan 2025", size: "1.1 MB" },
    { id: "d3", title: "Deed of Agreement (Deed No: 4021)", type: "PDF", uploadDate: "20 Feb 2025", size: "5.8 MB" },
    { id: "d4", title: "Allotment Letter", type: "PDF", uploadDate: "22 Feb 2025", size: "1.5 MB" },
  ];

  const formatCurrency = (amount: number) => {
    return "৳ " + amount.toLocaleString("en-BD");
  };

  if (loadError) return <div className="p-6 text-rose-400">{loadError}</div>;
  if (!clientData) return <div className="p-6 text-[#829B96]">Loading client details…</div>;
  const paidPercentage = clientData.totalPrice ? Math.round((clientData.totalPaid / clientData.totalPrice) * 100) : 0;

  return (
    <div className="w-full bg-[#0B1816] min-h-screen text-[#E2E8F0] p-6 space-y-6">
      
      {/* 1. Breadcrumb & Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <span>Sales</span>
          <ChevronRight className="h-3 w-3" />
          <button onClick={() => navigate("/clients/list")} className="hover:text-[#10B981] transition-colors">Clients List</button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#E2E8F0] font-medium">{clientData.clientName}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E3E37]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/clients/list")}
              className="p-2 rounded-lg bg-[#112421] border border-[#1E3E37] text-[#829B96] hover:text-white hover:border-[#10B981] transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">{clientData.clientName}</h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  {clientData.clientId}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {clientData.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-[#829B96] mt-0.5">
                {clientData.projectName} • {clientData.unitNo} ({clientData.unitSize})
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-2">
              <Bell className="h-3.5 w-3.5 text-amber-400" />
              Send Reminder
            </Button>
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-2">
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              Passbook
            </Button>
            <Button size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-2">
              <Wallet className="h-3.5 w-3.5" />
              Receive Payment
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4">
          <p className="text-xs text-[#829B96] font-medium tracking-wide uppercase">Total Contract Value</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(clientData.totalPrice)}</p>
          <p className="text-xs text-[#829B96] mt-1">Booked: {clientData.bookingDate}</p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#829B96] font-medium tracking-wide uppercase">Total Paid</p>
            <span className="text-xs font-semibold text-[#10B981]">{paidPercentage}% Paid</span>
          </div>
          <p className="text-xl font-bold text-[#10B981] mt-1">{formatCurrency(clientData.totalPaid)}</p>
          <div className="w-full bg-[#0B1816] h-1.5 rounded-full mt-2 overflow-hidden border border-[#1E3E37]">
            <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${paidPercentage}%` }} />
          </div>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4">
          <p className="text-xs text-[#829B96] font-medium tracking-wide uppercase">Outstanding Due</p>
          <p className="text-xl font-bold text-rose-500 mt-1">{formatCurrency(clientData.dueAmount)}</p>
          <p className="text-xs text-rose-400/90 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> 1 Overdue Installment
          </p>
        </div>

        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-4">
          <p className="text-xs text-[#829B96] font-medium tracking-wide uppercase">Sales Representative</p>
          <p className="text-base font-semibold text-white mt-1">{clientData.salesRep}</p>
          <p className="text-xs text-[#829B96] mt-1">Phone: {clientData.phone}</p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="border-b border-[#1E3E37] flex space-x-6 text-sm">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-3 font-medium transition-all relative flex items-center gap-2 ${
            activeTab === "schedule" ? "text-[#10B981]" : "text-[#829B96] hover:text-white"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Payment Schedule & Ledger
          {activeTab === "schedule" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />}
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 font-medium transition-all relative flex items-center gap-2 ${
            activeTab === "overview" ? "text-[#10B981]" : "text-[#829B96] hover:text-white"
          }`}
        >
          <User className="h-4 w-4" />
          Client Profile & Nominee
          {activeTab === "overview" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />}
        </button>

        <button
          onClick={() => setActiveTab("unit")}
          className={`pb-3 font-medium transition-all relative flex items-center gap-2 ${
            activeTab === "unit" ? "text-[#10B981]" : "text-[#829B96] hover:text-white"
          }`}
        >
          <Building className="h-4 w-4" />
          Unit Details
          {activeTab === "unit" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />}
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 font-medium transition-all relative flex items-center gap-2 ${
            activeTab === "documents" ? "text-[#10B981]" : "text-[#829B96] hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          Documents ({documents.length})
          {activeTab === "documents" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />}
        </button>
      </div>

      {/* 4. Tab Contents */}
      {/* TAB: PAYMENT SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1E3E37] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Payment Installment Schedule</h3>
              <p className="text-xs text-[#829B96]">Milestones and transaction records for this client</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/60 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Installment Title</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Paid Date</th>
                  <th className="p-3.5">Receipt No</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {schedule.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#1A3530]/40 transition-colors">
                    <td className="p-3.5 font-mono text-[#829B96]">{index + 1}</td>
                    <td className="p-3.5 font-medium text-white">{item.title}</td>
                    <td className="p-3.5 font-mono text-[#829B96]">{item.dueDate}</td>
                    <td className="p-3.5 font-semibold text-white">{formatCurrency(item.amount)}</td>
                    <td className="p-3.5 font-mono text-[#829B96]">{item.paidDate || "—"}</td>
                    <td className="p-3.5 font-mono text-[#10B981]">{item.receiptNo || "—"}</td>
                    <td className="p-3.5">
                      {item.status === "PAID" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                          <CheckCircle2 className="h-3 w-3" /> PAID
                        </span>
                      )}
                      {item.status === "OVERDUE" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <AlertCircle className="h-3 w-3" /> OVERDUE
                        </span>
                      )}
                      {item.status === "UPCOMING" && (
                        <span className="inline-flex items-center text-[11px] font-medium text-[#829B96] bg-[#0B1816] px-2 py-0.5 rounded border border-[#1E3E37]">
                          UPCOMING
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {item.status === "PAID" ? (
                        <button className="text-xs text-[#10B981] hover:underline">Print Slip</button>
                      ) : (
                        <Button size="sm" className="h-7 text-xs bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold px-2.5">
                          Receive
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CLIENT PROFILE & NOMINEE */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#1E3E37] pb-3">
              <User className="h-4 w-4 text-[#10B981]" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><p className="text-[#829B96]">Full Name</p><p className="font-medium text-white mt-0.5">{clientData.clientName}</p></div>
              <div><p className="text-[#829B96]">Phone</p><p className="font-mono text-white mt-0.5">{clientData.phone}</p></div>
              <div><p className="text-[#829B96]">Father's Name</p><p className="font-medium text-white mt-0.5">{clientData.fatherName}</p></div>
              <div><p className="text-[#829B96]">Mother's Name</p><p className="font-medium text-white mt-0.5">{clientData.motherName}</p></div>
              <div><p className="text-[#829B96]">NID</p><p className="font-mono text-white mt-0.5">{clientData.nid}</p></div>
              <div><p className="text-[#829B96]">Email</p><p className="font-mono text-white mt-0.5">{clientData.email}</p></div>
            </div>
            <div className="text-xs pt-2">
              <p className="text-[#829B96]">Address</p>
              <p className="font-medium text-white mt-0.5">{clientData.address}</p>
            </div>
          </div>

          <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-[#1E3E37] pb-3">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" /> Nominee Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><p className="text-[#829B96]">Nominee Name</p><p className="font-medium text-white mt-0.5">{clientData.nomineeName}</p></div>
              <div><p className="text-[#829B96]">Relation</p><p className="font-medium text-white mt-0.5">{clientData.nomineeRelation}</p></div>
              <div><p className="text-[#829B96]">Phone</p><p className="font-mono text-white mt-0.5">{clientData.nomineePhone}</p></div>
              <div><p className="text-[#829B96]">NID</p><p className="font-mono text-white mt-0.5">{clientData.nomineeNid}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: UNIT DETAILS */}
      {activeTab === "unit" && (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-[#1E3E37] pb-3">Allocated Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div><p className="text-[#829B96]">Project</p><p className="text-sm font-semibold text-[#10B981] mt-0.5">{clientData.projectName}</p><p className="text-[#829B96]">{clientData.projectLocation}</p></div>
            <div><p className="text-[#829B96]">Unit No</p><p className="text-sm font-semibold text-white mt-0.5">{clientData.unitNo}</p><p className="text-[#829B96]">{clientData.unitSize}</p></div>
            <div><p className="text-[#829B96]">Parking Space</p><p className="text-sm font-semibold text-white mt-0.5">{clientData.carParking}</p></div>
            <div><p className="text-[#829B96]">Booking Date</p><p className="font-medium text-white mt-0.5">{clientData.bookingDate}</p></div>
            <div><p className="text-[#829B96]">Expected Handover</p><p className="font-medium text-[#10B981] mt-0.5">{clientData.expectedHandover}</p></div>
          </div>
        </div>
      )}

      {/* TAB: DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="bg-[#112421] border border-[#1E3E37] rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E3E37] pb-3">
            <h3 className="text-sm font-semibold text-white">Client Documents</h3>
            <Button size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs">
              Upload Document
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-lg bg-[#0B1816] border border-[#1E3E37]">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-[#10B981]" />
                  <div>
                    <p className="font-medium text-xs text-white">{doc.title}</p>
                    <p className="text-[11px] text-[#829B96]">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                  </div>
                </div>
                <button className="text-[#10B981] hover:underline text-xs flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}