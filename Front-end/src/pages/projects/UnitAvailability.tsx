import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Search, XCircle } from "lucide-react";
import { getProjects, getUnits } from "@/services/projects.service";
import { Button } from "@/components/ui/Button";

type UnitStatus = "AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED";

interface Unit {
  id: string;
  unitCode: string;
  projectId: string;
  project?: { projectName: string };
  buildingId?: string;
  building?: { name: string; buildingCode: string };
  floorLevel: string;
  unitType: string;
  size: number;
  totalPrice: number;
  status: UnitStatus;
}

interface Project {
  id: string;
  projectName: string;
}

const statusLabels: Record<UnitStatus, string> = {
  AVAILABLE: "Available",
  BOOKED: "Booked",
  SOLD: "Sold",
  BLOCKED: "Blocked",
};

const statusStyles: Record<UnitStatus, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-300",
  BOOKED: "bg-amber-500/10 text-amber-300",
  SOLD: "bg-sky-500/10 text-sky-300",
  BLOCKED: "bg-rose-500/10 text-rose-300",
};

const formatCurrency = (value: number) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

export default function UnitAvailability() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [status, setStatus] = useState<"ALL" | UnitStatus>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (selectedProjectId = projectId) => {
    setLoading(true);
    setError("");
    try {
      const [loadedUnits, loadedProjects] = await Promise.all([
        getUnits(selectedProjectId || undefined),
        getProjects(),
      ]);
      setUnits(loadedUnits);
      setProjects(loadedProjects);
      setBuildingId("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to load unit availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const buildings = useMemo(() => {
    const seen = new Map<string, { id: string; label: string }>();
    units.forEach((unit) => {
      if (unit.buildingId && unit.building) {
        seen.set(unit.buildingId, {
          id: unit.buildingId,
          label: `${unit.building.buildingCode} - ${unit.building.name}`,
        });
      }
    });
    return Array.from(seen.values()).sort((left, right) => left.label.localeCompare(right.label));
  }, [units]);

  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase();
    return units.filter((unit) => {
      const searchable = `${unit.unitCode} ${unit.project?.projectName || ""} ${unit.building?.name || ""} ${unit.unitType} ${unit.floorLevel}`.toLowerCase();
      return (!query || searchable.includes(query))
        && (!buildingId || unit.buildingId === buildingId)
        && (status === "ALL" || unit.status === status);
    });
  }, [units, search, buildingId, status]);

  const counts = useMemo(() => units.reduce<Record<UnitStatus, number>>((result, unit) => {
    result[unit.status] += 1;
    return result;
  }, { AVAILABLE: 0, BOOKED: 0, SOLD: 0, BLOCKED: 0 }), [units]);

  const handleProjectChange = (nextProjectId: string) => {
    setProjectId(nextProjectId);
    void load(nextProjectId);
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3E37] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Unit Availability</h1>
          <p className="mt-1 text-xs text-[#829B96]">Live availability across projects, buildings, and flats.</p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(["AVAILABLE", "BOOKED", "SOLD", "BLOCKED"] as UnitStatus[]).map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded-xl border p-4 text-left transition-colors ${status === item ? "border-[#10B981] bg-[#12352D]" : "border-[#1E3E37] bg-[#112421]"}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase text-[#829B96]">{statusLabels[item]}</p>
              {item === "AVAILABLE" ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <XCircle className="h-4 w-4 text-[#829B96]" />}
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{counts[item]}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" />
          <input aria-label="Search units" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search unit, building, floor, or type…" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white" />
        </div>
        <select aria-label="Filter by project" value={projectId} onChange={(event) => handleProjectChange(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white">
          <option value="">All projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
        </select>
        <select aria-label="Filter by building" value={buildingId} onChange={(event) => setBuildingId(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white">
          <option value="">All buildings</option>
          {buildings.map((building) => <option key={building.id} value={building.id}>{building.label}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#1E3E37] text-[#829B96]">
            <tr>{["Unit", "Project / Building", "Floor", "Type", "Size", "Price", "Status"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#1E3E37]">
            {filteredUnits.map((unit) => (
              <tr key={unit.id}>
                <td className="p-3 font-mono text-[#10B981]">{unit.unitCode}</td>
                <td className="p-3 text-white"><span className="block">{unit.project?.projectName || "—"}</span><span className="text-[#829B96]">{unit.building?.name || "Unassigned"}</span></td>
                <td className="p-3 text-[#829B96]">{unit.floorLevel}</td>
                <td className="p-3 text-[#829B96]">{unit.unitType.replaceAll("_", " ")}</td>
                <td className="p-3 text-white">{Number(unit.size || 0).toLocaleString()} sft</td>
                <td className="p-3 text-white">{formatCurrency(unit.totalPrice)}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-1 text-[11px] ${statusStyles[unit.status]}`}>{statusLabels[unit.status]}</span></td>
              </tr>
            ))}
            {!loading && !filteredUnits.length && <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">No units match the selected filters.</td></tr>}
            {loading && <tr><td colSpan={7} className="p-10 text-center text-[#829B96]">Loading live unit availability…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
