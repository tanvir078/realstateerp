import { useEffect, useState } from "react";
import { Building2, Edit, Eye, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AddProjectModal from "@/components/forms/AddProjectModal";
import { createProject, deleteProject, getProjects, updateProject } from "@/services/projects.service";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";

interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  projectType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "MIXED";
  location: string;
  totalFloors: number;
  totalUnits: number;
  expectedHandover: string;
  targetLaunchDate: string;
  landSize: string;
  developerRatio: number;
  landownerRatio: number;
  constructionProgress: number;
  status: "ONGOING" | "UPCOMING" | "COMPLETED" | "ON_HOLD";
}

export default function AllProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const loadProjects = () => {
    setLoading(true);
    getProjects().then(setProjects).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  };

  useEffect(loadProjects, []);

  const visibleProjects = projects.filter((project) =>
    `${project.projectCode} ${project.projectName} ${project.location}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete ${project.projectName}? Projects with units cannot be deleted.`)) return;
    try {
      await deleteProject(project.id);
      loadProjects();
    } catch (reason: any) {
      setError(reason.message || "Failed to delete project");
    }
  };

  const handleSaveProject = async (data: unknown) => {
    try {
      if (editingProject) await updateProject(editingProject.id, data);
      else await createProject(data);
      setIsCreateOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch (reason: any) {
      setError(reason.message || "Failed to save project");
    }
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <PageHeader
        title="All Projects"
        actions={<Button onClick={() => setIsCreateOpen(true)} className="gap-1.5 bg-[#10B981] text-slate-950"><Plus className="h-4 w-4" /> Add Project</Button>}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Total", projects.length], ["Ongoing", projects.filter((project) => project.status === "ONGOING").length], ["Upcoming", projects.filter((project) => project.status === "UPCOMING").length], ["Completed", projects.filter((project) => project.status === "COMPLETED").length]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></div>)}
      </div>
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" /><input aria-label="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search project, code, location…" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white" /></div>
      {loading && <p className="text-sm text-[#829B96]">Loading projects…</p>}
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {!loading && visibleProjects.length === 0 && <p className="rounded-xl border border-[#1E3E37] p-10 text-center text-sm text-[#829B96]">No projects found.</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => <article key={project.id} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs text-[#10B981]">{project.projectCode}</p><h2 className="mt-1 font-semibold text-white">{project.projectName}</h2><p className="mt-1 flex items-center gap-1 text-xs text-[#829B96]"><MapPin className="h-3 w-3" />{project.location}</p></div><Building2 className="h-5 w-5 text-[#10B981]" /></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><span className="rounded bg-[#0B1816] p-2 text-[#829B96]">Units <b className="block text-white">{project.totalUnits}</b></span><span className="rounded bg-[#0B1816] p-2 text-[#829B96]">Floors <b className="block text-white">{project.totalFloors}</b></span><span className="rounded bg-[#0B1816] p-2 text-[#829B96]">Progress <b className="block text-white">{project.constructionProgress}%</b></span><span className="rounded bg-[#0B1816] p-2 text-[#829B96]">Status <b className="block text-white">{project.status}</b></span></div><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" onClick={() => navigate(`/projects/view/${project.id}`)} className="gap-1.5"><Eye className="h-3.5 w-3.5" /> View</Button><Button variant="outline" size="sm" onClick={() => { setEditingProject(project); setIsCreateOpen(true); }} className="gap-1.5"><Edit className="h-3.5 w-3.5" /> Edit</Button><Button variant="outline" size="sm" onClick={() => handleDelete(project)} className="gap-1.5"><Trash2 className="h-3.5 w-3.5 text-rose-400" /> Delete</Button></div></article>)}
      </div>
      <AddProjectModal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setEditingProject(null); }} onSave={handleSaveProject} mode={editingProject ? "edit" : "create"} initialData={editingProject || undefined} />
    </div>
  );
}
