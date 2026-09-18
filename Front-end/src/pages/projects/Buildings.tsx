import { useEffect, useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createBuilding, deleteBuilding, getBuildings, getProjects, updateBuilding } from "@/services/projects.service";

type Building = { id: string; projectId: string; buildingCode: string; name: string; totalFloors: number; status: string; project?: { projectName: string }; units?: unknown[] };
type Project = { id: string; projectName: string };

export default function Buildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [editing, setEditing] = useState<Building | null>(null);
  const [form, setForm] = useState({ buildingCode: "", name: "", totalFloors: 0, status: "ACTIVE" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [nextBuildings, nextProjects] = await Promise.all([getBuildings(projectId || undefined), getProjects()]);
      setBuildings(nextBuildings);
      setProjects(nextProjects);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to load buildings");
    }
  };
  useEffect(() => { void load(); }, [projectId]);

  const save = async () => {
    if (!projectId && !editing) return setError("Select a project first");
    try {
      if (editing) await updateBuilding(editing.id, { ...form, projectId: editing.projectId });
      else await createBuilding({ ...form, projectId });
      setEditing(null);
      setForm({ buildingCode: "", name: "", totalFloors: 0, status: "ACTIVE" });
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to save building");
    }
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3E37] pb-4">
        <div><h1 className="text-2xl font-bold text-white">Buildings / Blocks</h1><p className="mt-1 text-xs text-[#829B96]">Manage project blocks and floor capacity.</p></div>
        <Button onClick={() => setEditing({ id: "", projectId, buildingCode: "", name: "", totalFloors: 0, status: "ACTIVE" })} className="gap-2 bg-[#10B981] text-slate-950"><Plus className="h-4 w-4" /> Add Building</Button>
      </header>
      {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
      <div className="grid gap-3 md:grid-cols-[280px_1fr]">
        <select aria-label="Filter by project" value={projectId} onChange={(event) => setProjectId(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white">
          <option value="">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
        </select>
        {editing && <div className="grid gap-2 rounded-xl border border-[#1E3E37] bg-[#112421] p-4 md:grid-cols-4">
          <input aria-label="Building code" value={form.buildingCode} onChange={(event) => setForm({ ...form, buildingCode: event.target.value })} placeholder="Building code…" className="rounded border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white" />
          <input aria-label="Building name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Building name…" className="rounded border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white" />
          <input aria-label="Total floors" type="number" min="0" value={form.totalFloors} onChange={(event) => setForm({ ...form, totalFloors: Number(event.target.value) })} className="rounded border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white" />
          <Button onClick={() => void save()} className="bg-[#10B981] text-slate-950">{editing.id ? "Save Changes" : "Create Building"}</Button>
        </div>}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building) => <article key={building.id} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4">
          <div className="flex items-start justify-between"><div><p className="font-mono text-xs text-[#10B981]">{building.buildingCode}</p><h2 className="mt-1 font-semibold text-white">{building.name}</h2><p className="mt-1 text-xs text-[#829B96]">{building.project?.projectName || "Project"}</p></div><Building2 className="h-5 w-5 text-[#10B981]" /></div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><span className="rounded bg-[#0B1816] p-2 text-[#829B96]">Floors <b className="block text-white">{building.totalFloors}</b></span><span className="rounded bg-[#0B1816] p-2 text-[#829B96]">Units <b className="block text-white">{building.units?.length || 0}</b></span></div>
          <div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(building); setForm({ buildingCode: building.buildingCode, name: building.name, totalFloors: building.totalFloors, status: building.status }); }}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button><Button size="sm" variant="outline" onClick={() => void deleteBuilding(building.id).then(load)}><Trash2 className="mr-1 h-3.5 w-3.5 text-rose-400" /> Delete</Button></div>
        </article>)}
        {!buildings.length && <p className="col-span-full rounded-xl border border-[#1E3E37] p-10 text-center text-sm text-[#829B96]">No buildings found.</p>}
      </div>
    </div>
  );
}
