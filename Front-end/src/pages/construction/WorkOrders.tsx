import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Edit, Filter, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  approveWorkOrder,
  createWorkOrder,
  deleteWorkOrder,
  getContractors,
  getWorkOrders,
  updateWorkOrder,
} from "@/services/construction.service";
import { getProjects } from "@/services/projects.service";

type WorkOrderStatus = "PENDING" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type WorkOrder = {
  id: string;
  workOrderNo: string;
  projectId: string;
  contractorId: string;
  description: string;
  amount: number;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
};

type Option = { id: string; name: string };

const emptyForm = {
  projectId: "",
  contractorId: "",
  description: "",
  amount: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
};

const statusStyles: Record<WorkOrderStatus, string> = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  APPROVED: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  IN_PROGRESS: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  COMPLETED: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  CANCELLED: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

const WorkOrders = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [contractors, setContractors] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | WorkOrderStatus>("ALL");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<WorkOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const contractorNames = useMemo(() => new Map(contractors.map((item) => [item.id, item.name])), [contractors]);
  const projectNames = useMemo(() => new Map(projects.map((item) => [item.id, item.name])), [projects]);

  const load = async () => {
    try {
      const [orderRows, contractorRows, projectRows] = await Promise.all([getWorkOrders(), getContractors(), getProjects()]);
      setOrders(orderRows);
      setContractors(contractorRows.map((item: any) => ({ id: item.id, name: item.name })));
      setProjects(projectRows.map((item: any) => ({ id: item.id, name: item.projectName || item.name })));
    } catch (reason: any) {
      setError(reason.message || "Failed to load work orders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const text = `${order.workOrderNo} ${order.description} ${contractorNames.get(order.contractorId) || ""} ${projectNames.get(order.projectId) || ""}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (status === "ALL" || order.status === status);
  });

  const activeOrders = orders.filter((order) => order.status === "APPROVED" || order.status === "IN_PROGRESS");
  const totalValue = activeOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const pendingCount = orders.filter((order) => order.status === "PENDING").length;
  const activeCount = orders.filter((order) => order.status === "IN_PROGRESS" || order.status === "APPROVED").length;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (order: WorkOrder) => {
    setEditing(order);
    setForm({
      projectId: order.projectId,
      contractorId: order.contractorId,
      description: order.description,
      amount: String(order.amount),
      startDate: order.startDate,
      endDate: order.endDate,
    });
    setError(null);
    setModalOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.projectId || !form.contractorId || !form.description.trim() || Number(form.amount) <= 0) {
      setError("Project, contractor, description and a positive amount are required.");
      return;
    }
    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editing) {
        await updateWorkOrder(editing.id, payload);
      } else {
        await createWorkOrder(payload);
      }
      setModalOpen(false);
      await load();
    } catch (reason: any) {
      setError(reason.message || "Failed to save work order");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (order: WorkOrder, nextStatus: WorkOrderStatus) => {
    try {
      await updateWorkOrder(order.id, { status: nextStatus });
      await load();
    } catch (reason: any) {
      setError(reason.message || "Failed to update work order status");
    }
  };

  const remove = async (order: WorkOrder) => {
    if (!window.confirm(`Delete ${order.workOrderNo}?`)) return;
    try {
      await deleteWorkOrder(order.id);
      await load();
    } catch (reason: any) {
      setError(reason.message || "Failed to delete work order");
    }
  };

  return (
    <div className="w-full space-y-6 p-4 text-[#E2E8F0] lg:p-6">
      <div className="flex flex-col gap-4 border-b border-[#1E3E37] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-[#829B96]">Dashboard / Construction & Engineering</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Work Orders</h1>
          <p className="mt-1 text-xs text-[#829B96]">Create, approve and track contractor work orders.</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5 bg-[#10B981] font-semibold text-slate-950 hover:bg-[#0D9668]">
          <Plus className="h-4 w-4" /> New Work Order
        </Button>
      </div>

      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}<button className="ml-3 underline" onClick={() => setError(null)}>Dismiss</button></div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Total Orders</p><p className="mt-1 text-2xl font-bold text-white">{orders.length}</p></div>
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Pending Approval</p><p className="mt-1 text-2xl font-bold text-amber-300">{pendingCount}</p></div>
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Active Value</p><p className="mt-1 text-2xl font-bold text-emerald-300">৳ {totalValue.toLocaleString("en-BD")}</p><p className="mt-1 text-xs text-[#829B96]">{activeCount} approved or in progress</p></div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#829B96]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search work order, contractor or project" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-[#10B981]" /></div>
        <div className="flex items-center gap-2 overflow-x-auto text-xs"><Filter className="h-4 w-4 text-[#829B96]" />{(["ALL", "PENDING", "APPROVED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const).map((item) => <button key={item} onClick={() => setStatus(item)} className={`whitespace-nowrap rounded-lg border px-3 py-1.5 ${status === item ? "border-[#10B981] bg-[#10B981] text-slate-950" : "border-[#1E3E37] bg-[#0B1816] text-[#829B96] hover:text-white"}`}>{item === "ALL" ? "All" : item.replace("_", " ")}</button>)}</div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#1E3E37] bg-[#112421]">
        <div className="flex items-center gap-2 border-b border-[#1E3E37] p-4"><ClipboardCheck className="h-4 w-4 text-[#10B981]" /><h2 className="text-sm font-bold text-white">Work Order Register</h2></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-xs"><thead className="border-b border-[#1E3E37] bg-[#0B1816]/80 uppercase text-[#829B96]"><tr><th className="p-3.5">WO No.</th><th className="p-3.5">Project</th><th className="p-3.5">Contractor</th><th className="p-3.5">Description</th><th className="p-3.5">Amount</th><th className="p-3.5">Period</th><th className="p-3.5">Status</th><th className="p-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#1E3E37]">{filteredOrders.map((order) => <tr key={order.id} className="hover:bg-[#1A3530]/40"><td className="p-3.5 font-mono font-semibold text-[#10B981]">{order.workOrderNo}</td><td className="p-3.5 text-white">{projectNames.get(order.projectId) || order.projectId}</td><td className="p-3.5 text-white">{contractorNames.get(order.contractorId) || order.contractorId}</td><td className="max-w-xs p-3.5 text-[#E2E8F0]">{order.description}</td><td className="p-3.5 font-semibold text-white">৳ {Number(order.amount).toLocaleString("en-BD")}</td><td className="p-3.5 text-[#829B96]">{order.startDate} - {order.endDate}</td><td className="p-3.5"><span className={`rounded border px-2 py-1 text-[10px] font-semibold ${statusStyles[order.status]}`}>{order.status.replace("_", " ")}</span></td><td className="p-3.5"><div className="flex justify-end gap-1">{order.status === "PENDING" && <button title="Approve" onClick={() => approveWorkOrder(order.id).then(load).catch((reason: any) => setError(reason.message || "Failed to approve work order"))} className="rounded-lg border border-emerald-400/30 p-1.5 text-emerald-300 hover:bg-emerald-400/10"><ClipboardCheck className="h-3.5 w-3.5" /></button>}<button title="Change status" onClick={() => changeStatus(order, order.status === "APPROVED" ? "IN_PROGRESS" : order.status === "IN_PROGRESS" ? "COMPLETED" : "APPROVED")} className="rounded-lg border border-[#1E3E37] p-1.5 text-[#829B96] hover:text-white"><ClipboardCheck className="h-3.5 w-3.5" /></button><button title="Edit" onClick={() => openEdit(order)} className="rounded-lg border border-[#1E3E37] p-1.5 text-[#829B96] hover:text-[#10B981]"><Edit className="h-3.5 w-3.5" /></button><button title="Delete" onClick={() => remove(order)} className="rounded-lg border border-[#1E3E37] p-1.5 text-[#829B96] hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}{!filteredOrders.length && <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">No work orders found.</td></tr>}</tbody></table></div>
      </div>

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"><form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-white">{editing ? "Edit Work Order" : "New Work Order"}</h2><p className="text-xs text-[#829B96]">Assign work to a project and contractor.</p></div><button type="button" onClick={() => setModalOpen(false)} className="text-[#829B96] hover:text-white"><X className="h-5 w-5" /></button></div><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-[#829B96]">Project<select required value={form.projectId} onChange={(event) => setForm({ ...form, projectId: event.target.value })} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">Select project</option>{projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-xs text-[#829B96]">Contractor<select required value={form.contractorId} onChange={(event) => setForm({ ...form, contractorId: event.target.value })} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">Select contractor</option>{contractors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div><label className="block text-xs text-[#829B96]">Description<textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="block text-xs text-[#829B96]">Amount<input required min="0.01" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-[#829B96]">Start date<input required type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label><label className="text-xs text-[#829B96]">End date<input required type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></label></div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" disabled={saving} className="bg-[#10B981] text-slate-950">{saving ? "Saving..." : editing ? "Save Changes" : "Create Work Order"}</Button></div></form></div>}
    </div>
  );
};

export default WorkOrders;
