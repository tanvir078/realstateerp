import { useEffect, useMemo, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { getProjectFinancialSummary, getProjects } from "@/services/projects.service";

type Project = { id: string; projectName: string; projectCode?: string };

const money = (value: unknown) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

export default function ProjectCostSummary() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then((loadedProjects) => {
        setProjects(loadedProjects);
        if (loadedProjects[0]) setProjectId(loadedProjects[0].id);
      })
      .catch((reason) => setError(reason.message || "Projects could not be loaded."));
  }, []);

  const loadSummary = () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    getProjectFinancialSummary(projectId)
      .then(setSummary)
      .catch((reason) => setError(reason.message || "Financial summary could not be loaded."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSummary();
  }, [projectId]);

  const metrics = useMemo(() => summary ? [
    ["Revenue", summary.revenue, "text-emerald-300"],
    ["Collected", summary.collected, "text-sky-300"],
    ["Receivable", summary.receivable, "text-amber-300"],
    ["Total Cost", summary.totalCost, "text-rose-300"],
    ["Gross Profit", summary.grossProfit, summary.grossProfit >= 0 ? "text-emerald-300" : "text-rose-300"],
  ] : [], [summary]);

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <div className="flex flex-col gap-4 border-b border-[#1E3E37] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-white">Project Cost Summary</h1><p className="mt-1 text-xs text-[#829B96]">Live project revenue, cost and profitability summary</p></div>
        <div className="flex gap-2">
          <select aria-label="Select project" value={projectId} onChange={(event) => setProjectId(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#112421] px-3 py-2 text-sm text-white">
            <option value="">Select project</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}{project.projectCode ? ` (${project.projectCode})` : ""}</option>)}
          </select>
          <button onClick={loadSummary} disabled={loading || !projectId} className="rounded-lg border border-[#1E3E37] p-2 text-[#10B981] disabled:opacity-50" aria-label="Refresh summary"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">{error}</p>}
      {loading && <p className="rounded-lg border border-[#1E3E37] bg-[#112421] px-4 py-3 text-sm text-[#829B96]">Loading financial summary...</p>}
      {!loading && !summary && !error && <p className="rounded-lg border border-[#1E3E37] bg-[#112421] px-4 py-10 text-center text-sm text-[#829B96]">Select a project to view its cost summary.</p>}
      {summary && <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{metrics.map(([label, value, color]) => <div key={label} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">{label}</p><p className={`mt-2 text-xl font-bold ${color}`}>{money(value)}</p></div>)}</div><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-[#1E3E37] bg-[#112421] p-5"><div className="mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#10B981]" /><h2 className="font-semibold text-white">Cost breakdown</h2></div>{[["Vendor cost", summary.vendorCost], ["Paid vendor cost", summary.paidVendorCost], ["Posted construction cost", summary.postedConstructionCost]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-[#1E3E37] py-3 text-sm"><span className="text-[#829B96]">{label}</span><span className="text-white">{money(value)}</span></div>)}</section><section className="rounded-xl border border-[#1E3E37] bg-[#112421] p-5"><h2 className="mb-4 font-semibold text-white">Unit summary</h2>{Object.entries(summary.units || {}).map(([label, value]) => <div key={label} className="flex justify-between border-b border-[#1E3E37] py-3 text-sm"><span className="capitalize text-[#829B96]">{label}</span><span className="text-white">{String(value)}</span></div>)}<div className="mt-4 flex justify-between text-sm"><span className="text-[#829B96]">Profit margin</span><span className="font-semibold text-emerald-300">{Number(summary.marginPercent || 0).toFixed(2)}%</span></div></section></div></>}
    </div>
  );
}
