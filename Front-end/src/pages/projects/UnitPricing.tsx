import { useEffect, useMemo, useState } from "react";
import { DollarSign, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProjects, getUnits } from "@/services/projects.service";

interface Unit {
  id: string;
  unitCode: string;
  project?: { projectName: string };
  buildingId?: string;
  building?: { name: string; buildingCode: string };
  floorLevel: string;
  unitType: string;
  size: number;
  basePricePerSft: number;
  parkingPrice: number;
  utilityCharges: number;
  totalPrice: number;
  status: string;
}

interface Project {
  id: string;
  projectName: string;
}

const money = (value: number) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

export default function UnitPricing() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [unitType, setUnitType] = useState("ALL");
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
      setError(reason instanceof Error ? reason.message : "Failed to load unit pricing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(""); }, []);

  const buildings = useMemo(() => {
    const values = new Map<string, string>();
    units.forEach((unit) => {
      if (unit.buildingId && unit.building) values.set(unit.buildingId, `${unit.building.buildingCode} - ${unit.building.name}`);
    });
    return Array.from(values.entries()).sort((left, right) => left[1].localeCompare(right[1]));
  }, [units]);

  const types = useMemo(() => Array.from(new Set(units.map((unit) => unit.unitType))).sort(), [units]);
  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase();
    return units.filter((unit) => {
      const text = `${unit.unitCode} ${unit.project?.projectName || ""} ${unit.building?.name || ""} ${unit.floorLevel} ${unit.unitType}`.toLowerCase();
      return (!query || text.includes(query))
        && (!buildingId || unit.buildingId === buildingId)
        && (unitType === "ALL" || unit.unitType === unitType);
    });
  }, [units, search, buildingId, unitType]);

  const totals = useMemo(() => filteredUnits.reduce((result, unit) => ({
    count: result.count + 1,
    size: result.size + Number(unit.size || 0),
    value: result.value + Number(unit.totalPrice || 0),
  }), { count: 0, size: 0, value: 0 }), [filteredUnits]);

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3E37] pb-4">
        <div><h1 className="text-2xl font-bold text-white">Unit Pricing</h1><p className="mt-1 text-xs text-[#829B96]">Live pricing catalogue for units and flats.</p></div>
        <Button variant="outline" onClick={() => void load()} disabled={loading} className="gap-2"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</Button>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Filtered units</p><p className="mt-2 text-2xl font-bold text-white">{totals.count}</p></div>
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Total area</p><p className="mt-2 text-2xl font-bold text-white">{totals.size.toLocaleString()} <span className="text-sm font-normal text-[#829B96]">sft</span></p></div>
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">Catalogue value</p><p className="mt-2 text-2xl font-bold text-[#10B981]">{money(totals.value)}</p></div>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px_210px_190px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" /><input aria-label="Search unit pricing" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search unit, building, floor, or type…" className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white" /></div>
        <select aria-label="Filter pricing by project" value={projectId} onChange={(event) => { setProjectId(event.target.value); void load(event.target.value); }} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white"><option value="">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}</select>
        <select aria-label="Filter pricing by building" value={buildingId} onChange={(event) => setBuildingId(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white"><option value="">All buildings</option>{buildings.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
        <select aria-label="Filter pricing by unit type" value={unitType} onChange={(event) => setUnitType(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white"><option value="ALL">All types</option>{types.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select>
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
        <table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Unit", "Project / Building", "Type", "Area", "Base / sft", "Parking", "Utilities", "Total price"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#1E3E37]">{filteredUnits.map((unit) => <tr key={unit.id}><td className="p-3 font-mono text-[#10B981]"><span className="block">{unit.unitCode}</span><span className="text-[#829B96]">{unit.floorLevel}</span></td><td className="p-3 text-white"><span className="block">{unit.project?.projectName || "—"}</span><span className="text-[#829B96]">{unit.building?.name || "Unassigned"}</span></td><td className="p-3 text-[#829B96]">{unit.unitType.replaceAll("_", " ")}</td><td className="p-3 text-white">{Number(unit.size || 0).toLocaleString()} sft</td><td className="p-3 text-white">{money(unit.basePricePerSft)}</td><td className="p-3 text-white">{money(unit.parkingPrice)}</td><td className="p-3 text-white">{money(unit.utilityCharges)}</td><td className="p-3 font-semibold text-[#10B981]"><DollarSign className="mr-1 inline h-3.5 w-3.5" />{money(unit.totalPrice)}</td></tr>)}{!loading && !filteredUnits.length && <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">No pricing records match the selected filters.</td></tr>}{loading && <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">Loading live pricing…</td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
}
