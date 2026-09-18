import { useEffect, useState } from "react";
import { Download, FileText, Search, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/page/PageHeader";
import {
  deleteProjectDocument,
  downloadProjectDocument,
  getProjectDocuments,
  getProjects,
  uploadProjectDocument,
} from "@/services/projects.service";

type Project = { id: string; projectName: string; projectCode?: string };
type ProjectDocument = { id: string; title: string; documentType?: string; fileName?: string; createdAt?: string; uploadedAt?: string };

export default function ProjectDocuments() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("OTHER");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then((loadedProjects) => {
        setProjects(loadedProjects);
        if (loadedProjects[0]) setProjectId(loadedProjects[0].id);
      })
      .catch((reason) => setError(reason.message || "Projects could not be loaded."));
  }, []);

  useEffect(() => {
    if (!projectId) {
      setDocuments([]);
      return;
    }
    setLoading(true);
    getProjectDocuments(projectId)
      .then((loadedDocuments) => setDocuments(loadedDocuments || []))
      .catch((reason) => setError(reason.message || "Documents could not be loaded."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId || !file || !title.trim()) return;
    setUploading(true);
    try {
      const created = await uploadProjectDocument(projectId, title.trim(), documentType, file);
      setDocuments((current) => [created, ...current]);
      setTitle("");
      setDocumentType("OTHER");
      setFile(null);
      const input = document.getElementById("project-document-file") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (reason: any) {
      setError(reason.message || "Document upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (documentId: string) => {
    if (!projectId || !window.confirm("Delete this project document?")) return;
    try {
      await deleteProjectDocument(projectId, documentId);
      setDocuments((current) => current.filter((document) => document.id !== documentId));
    } catch (reason: any) {
      setError(reason.message || "Document deletion failed.");
    }
  };

  const download = async (document: ProjectDocument) => {
    if (!projectId) return;
    try {
      const blob = await downloadProjectDocument(projectId, document.id);
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = document.fileName || `${document.title}.download`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason: any) {
      setError(reason.message || "Document download failed.");
    }
  };

  const visibleDocuments = documents.filter((document) =>
    `${document.title} ${document.documentType || ""} ${document.fileName || ""}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <PageHeader title="Project Documents" />
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={upload} className="space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-5">
          <h2 className="font-semibold text-white">Upload document</h2>
          <label className="block text-xs text-[#829B96]">Project
            <select required value={projectId} onChange={(event) => setProjectId(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-sm text-white">
              <option value="">Select project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}{project.projectCode ? ` (${project.projectCode})` : ""}</option>)}
            </select>
          </label>
          <label className="block text-xs text-[#829B96]">Title
            <input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-sm text-white" />
          </label>
          <label className="block text-xs text-[#829B96]">Document type
            <select value={documentType} onChange={(event) => setDocumentType(event.target.value)} className="mt-1 w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-sm text-white">
              {["OTHER", "APPROVAL", "CONTRACT", "PLAN", "REPORT", "LEGAL"].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="block text-xs text-[#829B96]">File
            <input id="project-document-file" required type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-1 w-full text-xs text-[#829B96]" />
          </label>
          <button disabled={uploading || !projectId} className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50">
            <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload document"}
          </button>
        </form>
        <section className="rounded-xl border border-[#1E3E37] bg-[#112421] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">Documents</h2>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#829B96]" />
              <input aria-label="Search project documents" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search documents" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-2 text-xs text-white" />
            </div>
          </div>
          {loading ? <p className="py-10 text-center text-sm text-[#829B96]">Loading documents...</p> : !visibleDocuments.length ? <p className="py-10 text-center text-sm text-[#829B96]">No documents found for this project.</p> : <div className="space-y-2">{visibleDocuments.map((document) => <div key={document.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#1E3E37] bg-[#0B1816] p-3"><div className="flex min-w-0 items-center gap-3"><FileText className="h-5 w-5 shrink-0 text-[#10B981]" /><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{document.title}</p><p className="text-xs text-[#829B96]">{document.documentType || "OTHER"} · {document.fileName || "Uploaded document"}</p></div></div><div className="flex shrink-0 gap-2"><button onClick={() => download(document)} aria-label={`Download ${document.title}`} className="rounded p-2 text-[#10B981] hover:bg-[#1A3530]"><Download className="h-4 w-4" /></button><button onClick={() => remove(document.id)} aria-label={`Delete ${document.title}`} className="rounded p-2 text-rose-400 hover:bg-rose-950/30"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>}
        </section>
    </div>
    </div>
  );
}
