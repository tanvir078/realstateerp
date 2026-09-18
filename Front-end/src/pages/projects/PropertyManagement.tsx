import { useEffect, useState } from "react";
import { Edit, Eye, Layers, Plus, Search, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import AddUnitModal from "@/components/forms/AddUnitModal";
import AddParkingModal from "@/components/forms/AddParkingModal";
import { bulkCreateUnits, createLandParcel, createUnit, deleteUnit, getLandParcels, getProjects, getUnits, updateLandParcel, updateUnit } from "@/services/projects.service";
import BulkCreateUnitsModal from "@/components/forms/BulkCreateUnitsModal";
import { PageHeader } from "@/components/page/PageHeader";

interface Unit {
  id: string;
  unitCode: string;
  projectName: string;
  floorLevel: string;
  unitType: "APARTMENT" | "COMMERCIAL_SHOP" | "PARKING" | "OFFICE_SPACE";
  size: number;
  totalPrice: number;
  projectId: string;
  facing: string;
  bedrooms: number;
  bathrooms: number;
  basePricePerSft: number;
  parkingPrice: number;
  utilityCharges: number;
  ownership: "DEVELOPER_SHARE" | "LANDOWNER_SHARE";
  status: "AVAILABLE" | "BOOKED" | "SOLD" | "BLOCKED";
}

export default function UnitsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isParkingPage = location.pathname === "/projects/parking";
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editingParking, setEditingParking] = useState<Unit | null>(null);
  const [isParkingOpen, setIsParkingOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"units" | "parking" | "land">(isParkingPage ? "parking" : "units");
  const [landParcels, setLandParcels] = useState<any[]>([]);
  const [isLandOpen, setIsLandOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<any | null>(null);
  const [landForm, setLandForm] = useState({ parcelCode: "", description: "", location: "", area: "", areaUnit: "SQFT", ownerName: "", acquisitionCost: "", projectId: "", status: "AVAILABLE" });

  const mapUnit = (unit: any): Unit => ({
    ...unit,
    projectName: unit.project?.projectName || projects.find((project) => project.id === unit.projectId)?.name || "",
  });

  const load = (projectId?: string) => {
    setError(null);
    return Promise.all([getUnits(projectId), getProjects(), getLandParcels().catch(() => [])]).then(([loadedUnits, loadedProjects, loadedParcels]) => {
      setProjects(loadedProjects.map((project: any) => ({ id: project.id, name: project.projectName })));
      setUnits(loadedUnits.map((unit: any) => ({
        ...unit,
        projectName: unit.project?.projectName || loadedProjects.find((project: any) => project.id === unit.projectId)?.projectName || "",
      })));
      setLandParcels(loadedParcels);
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Failed to load units"));
  };

  useEffect(() => {
    setActiveTab(isParkingPage ? "parking" : "units");
    load();
  }, [isParkingPage]);

  const handleProjectFilter = async (projectId: string) => {
    setSelectedProjectId(projectId);
    try {
      const loadedUnits = await getUnits(projectId || undefined);
      setUnits(loadedUnits.map(mapUnit));
    } catch (reason: any) {
      setError(reason.message || "Failed to filter project properties");
    }
  };

  const visibleUnits = units.filter((unit) => `${unit.unitCode} ${unit.projectName} ${unit.unitType} ${unit.size} ${unit.facing} ${unit.totalPrice} ${unit.utilityCharges} ${unit.status}`.toLowerCase().includes(search.toLowerCase()));
  const filteredUnits = visibleUnits.filter((unit) => activeTab === "parking" ? unit.unitType === "PARKING" : unit.unitType !== "PARKING");
  const tabUnits = units.filter((unit) => activeTab === "parking" ? unit.unitType === "PARKING" : unit.unitType !== "PARKING");
  const visibleLandParcels = landParcels.filter((parcel) => {
    const matchesProject = !selectedProjectId || parcel.projectId === selectedProjectId;
    const query = `${parcel.parcelCode || ""} ${parcel.description || ""} ${parcel.location || ""}`.toLowerCase();
    return matchesProject && query.includes(search.toLowerCase());
  });
  const handleSave = async (data: unknown) => {
    setError(null);
    try {
      if (editingUnit) await updateUnit(editingUnit.id, data);
      else await createUnit(data);
      setIsCreateOpen(false);
      setEditingUnit(null);
      await load(selectedProjectId || undefined);
    } catch (reason: any) {
      setError(reason.message || "Failed to save unit");
    }
  };

  const handleParkingSave = async (data: { projectId: string; unitCode: string; size: number; price?: number; pricePerSft?: number; priceMode: "SFT" | "MANUAL"; status: Unit["status"] }) => {
    setError(null);
    try {
      const parkingData = {
        projectId: data.projectId,
        unitCode: data.unitCode,
        floorLevel: "Parking",
        unitType: "PARKING",
        size: data.size,
        facing: "N/A",
        bedrooms: 0,
        bathrooms: 0,
        basePricePerSft: data.pricePerSft || 0,
        parkingPrice: 0,
        utilityCharges: 0,
        ...(data.priceMode === "MANUAL" ? { price: data.price } : {}),
        ownership: "DEVELOPER_SHARE",
        status: data.status,
      };
      if (editingParking) await updateUnit(editingParking.id, parkingData);
      else await createUnit(parkingData);
      setEditingParking(null);
      await load(selectedProjectId || undefined);
      return true;
    } catch (reason: any) {
      setError(reason.message || "Failed to save parking");
      return false;
    }
  };

  const handleBulkCreate = async (data: unknown) => {
    setError(null);
    try {
      await bulkCreateUnits(data);
      setIsBulkOpen(false);
      await load(selectedProjectId || undefined);
    } catch (reason: any) {
      setError(reason.message || "Failed to bulk create units");
    }
  };

  const openLandModal = (parcel?: any) => {
    setEditingLand(parcel || null);
    setLandForm(parcel ? { parcelCode: parcel.parcelCode || "", description: parcel.description || "", location: parcel.location || "", area: String(parcel.area || ""), areaUnit: parcel.areaUnit || "SQFT", ownerName: parcel.ownerName || "", acquisitionCost: String(parcel.acquisitionCost || ""), projectId: parcel.projectId || "", status: parcel.status || "AVAILABLE" } : { parcelCode: "", description: "", location: "", area: "", areaUnit: "SQFT", ownerName: "", acquisitionCost: "", projectId: selectedProjectId, status: "AVAILABLE" });
    setIsLandOpen(true);
  };

  const saveLand = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { ...landForm, area: Number(landForm.area), acquisitionCost: Number(landForm.acquisitionCost || 0), projectId: landForm.projectId || undefined };
      if (editingLand) await updateLandParcel(editingLand.id, payload);
      else await createLandParcel(payload);
      setIsLandOpen(false);
      setEditingLand(null);
      await load(selectedProjectId || undefined);
    } catch (reason: any) {
      setError(reason.message || "Failed to save land parcel");
    }
  };

  const handleDelete = async (unit: Unit) => {
    if (unit.status !== "AVAILABLE" || !window.confirm(`Delete unit ${unit.unitCode}?`)) return;
    try {
      await deleteUnit(unit.id);
      await load();
    } catch (reason: any) {
      setError(reason.message || "Failed to delete unit");
    }
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <PageHeader title="Property Management" actions={<div className="flex gap-2">{activeTab === "units" && <Button variant="outline" onClick={() => setIsBulkOpen(true)} className="gap-1.5"><Layers className="h-4 w-4" /> Bulk Create</Button>}{activeTab === "land" ? <Button onClick={() => openLandModal()} className="gap-1.5 bg-[#10B981] text-slate-950"><Plus className="h-4 w-4" /> Add Land Parcel</Button> : <Button onClick={() => activeTab === "parking" ? (setEditingParking(null), setIsParkingOpen(true)) : setIsCreateOpen(true)} className="gap-1.5 bg-[#10B981] text-slate-950"><Plus className="h-4 w-4" /> {activeTab === "parking" ? "Add Parking" : "Add Unit"}</Button>}</div>} />
      <div className="flex w-full gap-1 overflow-x-auto border-b border-[#1E3E37]">
        {[{ id: "units", label: "Apartment" }, { id: "parking", label: "Parking" }, { id: "land", label: "Land" }].map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === tab.id ? "border-[#10B981] text-[#10B981]" : "border-transparent text-[#829B96] hover:text-white"}`}>{tab.label}</button>)}
      </div>
      {activeTab !== "land" && <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#829B96]" /><input aria-label="Search properties" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activeTab === "parking" ? "parking" : activeTab === "land" ? "land / block" : "unit"}, project, floor…`} className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-sm text-white" /></div>
        <select aria-label="Filter by project" value={selectedProjectId} onChange={(event) => handleProjectFilter(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] px-3 py-2 text-sm text-white">
          <option value="">All projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
      </div>}
      {activeTab === "land" && <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-6">
        <div className="flex items-center justify-between">
          <div><h2 className="font-semibold text-white">Land / Block</h2><p className="mt-1 text-xs text-[#829B96]">{visibleLandParcels.length} land parcel{visibleLandParcels.length === 1 ? "" : "s"} recorded</p></div>
          <Button onClick={() => openLandModal()} className="bg-[#10B981] text-slate-950"><Plus className="mr-1 h-4 w-4" />Add Land Parcel</Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {visibleLandParcels.map((parcel) => (
            <div key={parcel.id} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-[#10B981]">{parcel.parcelCode}</p>
                <span className="text-xs text-[#829B96]">{parcel.status}</span>
              </div>
              <p className="mt-2 font-medium text-white">{parcel.description}</p>
              <p className="mt-1 text-xs text-[#829B96]">{parcel.location} · {Number(parcel.area).toLocaleString()} {parcel.areaUnit}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => openLandModal(parcel)}><Edit className="mr-1 h-3.5 w-3.5" />Edit</Button>
            </div>
          ))}
          {!visibleLandParcels.length && <p className="col-span-full py-6 text-center text-sm text-[#829B96]">No land / block records found.</p>}
        </div>
      </div>}
      {activeTab !== "land" && <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{["AVAILABLE", "BOOKED", "SOLD", "BLOCKED"].map((status) => <div key={status} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs uppercase text-[#829B96]">{status}</p><p className="mt-2 text-2xl font-bold text-white">{tabUnits.filter((unit) => unit.status === status).length}</p></div>)}</div>}
      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      {activeTab !== "land" && <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{(activeTab === "parking" ? ["Parking", "Project", "Size", "Price", "Status", "Actions"] : ["Unit", "Project", "Type", "Size", "Facing", "Price", "Utility Amount", "Status", "Actions"]).map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#1E3E37]">{filteredUnits.map((unit) => activeTab === "parking" ? <tr key={unit.id}><td className="p-3 font-mono text-[#10B981]">{unit.unitCode}</td><td className="p-3 text-white">{unit.projectName}</td><td className="p-3 text-white">{Number(unit.size).toLocaleString()} sq ft</td><td className="p-3 text-white">৳ {Number(unit.totalPrice).toLocaleString("en-BD")}</td><td className="p-3 text-[#10B981]">{unit.status}</td><td className="p-3"><div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => { setEditingParking(unit); setIsParkingOpen(true); }} aria-label={`Edit ${unit.unitCode}`}><Edit className="h-3.5 w-3.5" /></Button><Button variant="outline" size="sm" disabled={unit.status !== "AVAILABLE"} onClick={() => handleDelete(unit)} aria-label={`Delete ${unit.unitCode}`}><Trash2 className="h-3.5 w-3.5 text-rose-400" /></Button></div></td></tr> : <tr key={unit.id}><td className="p-3 font-mono text-[#10B981]">{unit.unitCode}</td><td className="p-3 text-white">{unit.projectName}</td><td className="p-3 text-[#829B96]">{unit.unitType}</td><td className="p-3 text-white">{Number(unit.size).toLocaleString()}</td><td className="p-3 text-[#829B96]">{unit.facing}</td><td className="p-3 text-white">৳ {Number(unit.totalPrice).toLocaleString("en-BD")}</td><td className="p-3 text-white">৳ {Number(unit.utilityCharges || 0).toLocaleString("en-BD")}</td><td className="p-3 text-[#10B981]">{unit.status}</td><td className="p-3"><div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => navigate(`/projects/view/${unit.projectId}`)} aria-label={`View ${unit.unitCode}`}><Eye className="h-3.5 w-3.5" /></Button><Button variant="outline" size="sm" onClick={() => { setEditingUnit(unit); setIsCreateOpen(true); }} aria-label={`Edit ${unit.unitCode}`}><Edit className="h-3.5 w-3.5" /></Button><Button variant="outline" size="sm" disabled={unit.status !== "AVAILABLE"} onClick={() => handleDelete(unit)} aria-label={`Delete ${unit.unitCode}`}><Trash2 className="h-3.5 w-3.5 text-rose-400" /></Button></div></td></tr>)}{!filteredUnits.length && <tr><td colSpan={activeTab === "parking" ? 6 : 9} className="p-8 text-center text-[#829B96]">No {activeTab === "parking" ? "parking units" : "units"} found.</td></tr>}</tbody></table></div>}
      <AddUnitModal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setEditingUnit(null); }} onSave={handleSave} mode={editingUnit ? "edit" : "create"} initialData={editingUnit || undefined} projects={projects} />
      <AddParkingModal isOpen={isParkingOpen} onClose={() => { setIsParkingOpen(false); setEditingParking(null); }} onSave={async (data) => { if (await handleParkingSave(data)) setIsParkingOpen(false); }} mode={editingParking ? "edit" : "create"} initialData={editingParking ? { projectId: editingParking.projectId, unitCode: editingParking.unitCode, size: editingParking.size, price: editingParking.totalPrice, pricePerSft: editingParking.basePricePerSft, status: editingParking.status } : undefined} projects={projects} />
      <BulkCreateUnitsModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} onSave={handleBulkCreate} projects={projects} />
      {isLandOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"><form onSubmit={saveLand} className="w-full max-w-2xl space-y-4 rounded-xl border border-[#1E3E37] bg-[#112421] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-white">{editingLand ? "Edit Land Parcel" : "Add Land Parcel"}</h2><p className="text-xs text-[#829B96]">Manage project-wise land and property records.</p></div><button type="button" onClick={() => setIsLandOpen(false)} className="text-[#829B96] hover:text-white"><X className="h-5 w-5" /></button></div><div className="grid gap-3 sm:grid-cols-2"><input required placeholder="Parcel / block code" value={landForm.parcelCode} onChange={(event) => setLandForm({ ...landForm, parcelCode: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /><select value={landForm.projectId} onChange={(event) => setLandForm({ ...landForm, projectId: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="">Unassigned project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select><input required placeholder="Description" value={landForm.description} onChange={(event) => setLandForm({ ...landForm, description: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /><input required placeholder="Location" value={landForm.location} onChange={(event) => setLandForm({ ...landForm, location: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /><input required type="number" min="0.01" placeholder="Area" value={landForm.area} onChange={(event) => setLandForm({ ...landForm, area: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /><select value={landForm.areaUnit} onChange={(event) => setLandForm({ ...landForm, areaUnit: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="SQFT">SQFT</option><option value="KATHA">KATHA</option><option value="BIGHA">BIGHA</option><option value="DECIMAL">DECIMAL</option></select><input required placeholder="Owner name" value={landForm.ownerName} onChange={(event) => setLandForm({ ...landForm, ownerName: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /><input type="number" min="0" placeholder="Acquisition cost" value={landForm.acquisitionCost} onChange={(event) => setLandForm({ ...landForm, acquisitionCost: event.target.value })} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white" /></div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsLandOpen(false)}>Cancel</Button><Button type="submit" className="bg-[#10B981] text-slate-950">Save Land Parcel</Button></div></form></div>}
    </div>
  );
}
