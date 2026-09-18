import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ClientForm from "@/components/forms/ClientForm";
import { createClient, deleteClient, getClients } from "@/services/clients.service";

interface Client {
  id: string;
  clientId: string;
  clientName: string;
  clientType: string;
  phone: string;
  email?: string;
  city?: string;
  project?: string;
  totalPrice: number;
  totalPaid: number;
  dueAmount: number;
  paymentStatus: string;
  status: string;
}

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadClients = () => {
    setLoading(true);
    getClients().then(setClients).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  };

  useEffect(loadClients, []);

  const visibleClients = clients.filter((client) => `${client.clientId} ${client.clientName} ${client.phone} ${client.email || ""}`.toLowerCase().includes(search.toLowerCase()));
  const handleCreate = async (data: any) => {
    try {
      await createClient({ ...data, city: data.city || undefined });
      setIsCreateOpen(false);
      loadClients();
    } catch (reason: any) {
      setError(reason.message || "Failed to create client");
    }
  };
  const handleDelete = async (client: Client) => {
    if (!window.confirm(`Delete ${client.clientName}?`)) return;
    try {
      await deleteClient(client.id);
      setClients((current) => current.filter((item) => item.id !== client.id));
    } catch (reason: any) {
      setError(reason.message || "Failed to delete client");
    }
  };

  const totalContractValue = clients.reduce((sum, client) => sum + Number(client.totalPrice || 0), 0);
  const totalCollected = clients.reduce((sum, client) => sum + Number(client.totalPaid || 0), 0);
  const totalDue = clients.reduce((sum, client) => sum + Number(client.dueAmount || 0), 0);

  return (
    <div className="w-full space-y-6 bg-background-primary text-text-primary">
      <div className="flex items-center justify-between border-b border-card-border pb-4"><div><h1 className="text-2xl font-bold">Clients Directory</h1><p className="mt-1 text-sm text-text-secondary">Live client master records</p></div><Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-emerald-600 text-white"><Plus className="h-4 w-4" /> Add Client</Button></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{[["Portfolio Value", totalContractValue], ["Collected", totalCollected], ["Outstanding", totalDue]].map(([label, value]) => <div key={label} className="rounded-xl border border-card-border bg-card-surface p-4"><p className="text-xs uppercase text-text-secondary">{label}</p><p className="mt-2 text-xl font-bold">৳ {Number(value).toLocaleString("en-BD")}</p></div>)}</div>
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" /><input aria-label="Search clients" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client, phone or email…" className="w-full rounded-lg border border-card-border bg-card-surface py-2 pl-9 pr-3 text-sm" /></div>
      {loading && <p className="text-sm text-text-secondary">Loading clients…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-card-border bg-card-surface"><table className="w-full text-left text-sm"><thead className="border-b border-card-border text-text-secondary"><tr>{["Client", "Contact", "Project", "Contract", "Paid", "Due", "Status", "Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-card-border">{visibleClients.map((client) => <tr key={client.id}><td className="p-3"><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-emerald-500" /><span><b className="block">{client.clientName}</b><small className="text-text-secondary">{client.clientId}</small></span></div></td><td className="p-3">{client.phone}<br /><small className="text-text-secondary">{client.email || ""}</small></td><td className="p-3">{client.project || "Not allocated"}</td><td className="p-3">৳ {Number(client.totalPrice || 0).toLocaleString("en-BD")}</td><td className="p-3 text-emerald-600">৳ {Number(client.totalPaid || 0).toLocaleString("en-BD")}</td><td className="p-3 text-rose-500">৳ {Number(client.dueAmount || 0).toLocaleString("en-BD")}</td><td className="p-3">{client.status} / {client.paymentStatus}</td>      <td className="p-3"><div className="flex items-center gap-2"><button onClick={() => navigate(`/clients/view/${client.id}`)} className="rounded px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-500/10">View</button><button aria-label={`Delete ${client.clientName}`} onClick={() => handleDelete(client)} className="rounded p-2 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}{!loading && !visibleClients.length && <tr><td colSpan={8} className="p-10 text-center text-text-secondary">No clients found.</td></tr>}</tbody></table></div>
      <ClientForm isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
    </div>
  );
}
