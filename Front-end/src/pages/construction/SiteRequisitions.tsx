import { useEffect, useState } from "react";
import { CheckCircle, Plus, Search } from "lucide-react";
import { createMRN, getMRNs, approveMRN } from "@/services/construction.service";
import { getProjects } from "@/services/projects.service";

interface ProjectOption {
  id: string;
  projectName: string;
  projectCode?: string;
}

interface RequisitionForm {
  projectId: string;
  requestedBy: string;
  material: string;
  quantity: string;
  unit: string;
  requiredDate: string;
}

const emptyForm: RequisitionForm = {
  projectId: "",
  requestedBy: "",
  material: "",
  quantity: "",
  unit: "",
  requiredDate: "",
};

export default function SiteRequisitions() {
  const [items, setItems] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RequisitionForm>(emptyForm);

  const load = () => getMRNs().then(setItems).catch((reason) => setError(reason.message));

  useEffect(() => {
    Promise.all([load(), getProjects()])
      .then(([, loadedProjects]) => setProjects(loadedProjects))
      .catch((reason) => setError(reason.message || "Project list could not be loaded."));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createMRN(form);
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  };

  const approve = async (id: string) => {
    try {
      await approveMRN(id);
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  };

  const projectName = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    return project
      ? `${project.projectName}${project.projectCode ? ` (${project.projectCode})` : ""}`
      : projectId;
  };

  const visible = items.filter((item) =>
    `${item.mrnNo} ${projectName(item.projectId)} ${item.material}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <div className="flex items-center justify-between border-b border-[#1E3E37] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Requisitions</h1>
          <p className="mt-1 text-xs text-[#829B96]">Live material requisition and approval workflow</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950"
        >
          <Plus className="h-4 w-4" /> New MRN
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" />
        <input
          aria-label="Search requisitions"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search MRN, material or project…"
          className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white"
        />
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#1E3E37] text-[#829B96]">
            <tr>
              {["MRN", "Project", "Material", "Quantity", "Required", "Requester", "Status", "Action"].map((heading) => (
                <th key={heading} className="p-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E3E37]">
            {visible.map((item) => (
              <tr key={item.id}>
                <td className="p-3 font-mono text-[#10B981]">{item.mrnNo}</td>
                <td className="p-3 text-white">{projectName(item.projectId)}</td>
                <td className="p-3 text-[#829B96]">{item.material}</td>
                <td className="p-3 text-white">{item.quantity} {item.unit}</td>
                <td className="p-3 text-[#829B96]">{item.requiredDate}</td>
                <td className="p-3 text-[#829B96]">{item.requestedBy}</td>
                <td className="p-3 text-white">{item.status}</td>
                <td className="p-3">
                  {item.status === "PENDING" && (
                    <button onClick={() => approve(item.id)} className="inline-flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">No requisitions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <form onSubmit={save} className="w-full max-w-lg space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-6">
            <h2 className="font-bold text-white">New MRN</h2>
            <label className="block text-xs text-[#829B96]">
              Project *
              <select
                required
                value={form.projectId}
                onChange={(event) => setForm({ ...form, projectId: event.target.value })}
                className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white"
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}{project.projectCode ? ` (${project.projectCode})` : ""}
                  </option>
                ))}
              </select>
            </label>
            {(["requestedBy", "material", "quantity", "unit"] as const).map((key) => (
              <label key={key} className="block text-xs text-[#829B96]">
                {key}
                <input
                  required
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white"
                />
              </label>
            ))}
            <label className="block text-xs text-[#829B96]">
              Required date
              <input
                required
                type="date"
                value={form.requiredDate}
                onChange={(event) => setForm({ ...form, requiredDate: event.target.value })}
                className="mt-1 w-full rounded border border-[#1E3E37] bg-[#0B1816] p-2 text-white"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded border border-[#1E3E37] px-3 py-2 text-xs text-white">Cancel</button>
              <button className="rounded bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950">Save MRN</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
