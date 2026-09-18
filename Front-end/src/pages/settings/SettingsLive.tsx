import { useEffect, useMemo, useState } from "react";
import {
  Building2, Calculator, Database, FileText, Key, Palette, Plus, Printer,
  Save, Shield, Trash2, Users, Bell, LayoutGrid,
} from "lucide-react";
import apiClient from "@/services/api/axios";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { getStoredUser, UserRole } from "@/lib/access";
import { useTheme, type AccentColor, type ThemeMode } from "@/context/ThemeContext";

type TabId = "COMPANY" | "USERS" | "ROLES" | "SECURITY" | "ACCOUNTING" | "PRINT_TEMPLATES" | "FORM_CUSTOMIZATION" | "APPEARANCE" | "NOTIFICATIONS" | "SYSTEM" | "AUDIT";
type SettingRecord = Record<string, unknown>;
type UserRecord = { id: string; name: string; email: string; role: UserRole; isActive: boolean; phone?: string; department?: string };

const tabs: Array<{ id: TabId; label: string; icon: typeof Building2 }> = [
  { id: "COMPANY", label: "Company", icon: Building2 },
  { id: "USERS", label: "Users", icon: Users },
  { id: "ROLES", label: "Roles", icon: Key },
  { id: "SECURITY", label: "Security", icon: Shield },
  { id: "ACCOUNTING", label: "Accounting", icon: Calculator },
  { id: "PRINT_TEMPLATES", label: "Print Templates", icon: Printer },
  { id: "FORM_CUSTOMIZATION", label: "Form Customization", icon: LayoutGrid },
  { id: "APPEARANCE", label: "Appearance", icon: Palette },
  { id: "NOTIFICATIONS", label: "Notifications", icon: Bell },
  { id: "SYSTEM", label: "System", icon: Database },
  { id: "AUDIT", label: "Audit Logs", icon: FileText },
];

const settingKeys: Record<Exclude<TabId, "USERS" | "ROLES" | "AUDIT">, string> = {
  COMPANY: "settings.company",
  SECURITY: "settings.security",
  ACCOUNTING: "settings.accounting",
  PRINT_TEMPLATES: "settings.printTemplates",
  FORM_CUSTOMIZATION: "settings.formCustomization",
  APPEARANCE: "settings.appearance",
  NOTIFICATIONS: "settings.notifications",
  SYSTEM: "settings.system",
};

const defaults: Record<string, SettingRecord> = {
  "settings.company": { legalName: "", businessType: "real_estate", email: "", phone: "", website: "", address: "", financialYearStart: "", currency: "BDT", timezone: "Asia/Dhaka", dateFormat: "DD/MM/YYYY", decimalPlaces: 2 },
  "settings.security": { sessionTimeoutMinutes: 30, passwordMinLength: 8, requireMfa: false, lockoutAttempts: 5, refreshTokenDays: 30 },
  "settings.accounting": { defaultCurrency: "BDT", taxEnabled: true, vatRate: 15, tdsRate: 10, approvalThreshold: 50000, fiscalYearStart: "", numberingPattern: "JV-{YYYY}-{MM}-{####}" },
  "settings.printTemplates": { invoiceHeader: "", invoiceFooter: "", voucherHeader: "", voucherFooter: "", paperSize: "A4", showLogo: true },
  "settings.formCustomization": { voucherRequiredFields: ["voucherDate", "narration", "amount"], invoiceRequiredFields: ["invoiceDate", "client", "items"], enableReference: true },
  "settings.appearance": { theme: "dark", accentColor: "emerald", compactTables: false, showSidebarLabels: true },
  "settings.notifications": { emailEnabled: false, smsEnabled: false, invoiceAlerts: true, paymentAlerts: true, approvalAlerts: true },
  "settings.system": { backupEnabled: false, backupSchedule: "daily", retentionDays: 30, maintenanceMode: false },
};

const roleDescriptions: Record<UserRole, string> = {
  ADMIN: "Full system control, user administration, security and configuration.",
  ACCOUNTING_MANAGER: "Accounting operations, approvals, reports and permitted settings.",
  ACCOUNTANT: "Accounting entries, reconciliation and financial reports.",
  CASHIER: "Cash and bank transaction operations only.",
  VIEWER: "Read-only access across available modules.",
};

const formatLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());

const SettingsLive = () => {
  const currentUser = getStoredUser();
  const { appearance, setAppearance } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("COMPANY");
  const [settings, setSettings] = useState<Record<string, SettingRecord>>({});
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([]);
  const [draft, setDraft] = useState<SettingRecord>({});
  const [userDraft, setUserDraft] = useState({ name: "", email: "", password: "", role: "ACCOUNTANT" as UserRole, phone: "", department: "" });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canWrite = currentUser?.role === "ADMIN";
  const canReadSettings = currentUser?.role === "ADMIN" || currentUser?.role === "ACCOUNTING_MANAGER" || currentUser?.role === "VIEWER";

  const loadData = async () => {
    setError("");
    try {
      const settingResponse = await apiClient.get("/settings");
      const nextSettings = Object.fromEntries(settingResponse.data.map((item: { key: string; value: SettingRecord }) => [item.key, item.value]));
      setSettings(nextSettings);
      if (currentUser?.role === "ADMIN") {
        const usersResponse = await apiClient.get("/users");
        setUsers(usersResponse.data);
      }
      if (currentUser?.role === "ADMIN" || currentUser?.role === "ACCOUNTING_MANAGER") {
        const logsResponse = await apiClient.get("/audit/logs?limit=100");
        setLogs(logsResponse.data);
      }
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to load live settings data");
    }
  };

  useEffect(() => { void loadData(); }, []);
  useEffect(() => {
    if (activeTab in settingKeys) {
      const key = settingKeys[activeTab as Exclude<TabId, "USERS" | "ROLES" | "AUDIT">];
      setDraft({ ...(defaults[key] ?? {}), ...(settings[key] ?? {}) });
    }
  }, [activeTab, settings]);

  const updateDraft = (key: string, value: unknown) => setDraft((previous) => ({ ...previous, [key]: value }));
  const saveSettings = async () => {
    const key = settingKeys[activeTab as Exclude<TabId, "USERS" | "ROLES" | "AUDIT">];
    try {
      await apiClient.put(`/settings/${encodeURIComponent(key)}`, { value: draft });
      setSettings((previous) => ({ ...previous, [key]: draft }));
      if (key === "settings.appearance") {
        setAppearance(draft as Partial<{ theme: ThemeMode; accentColor: AccentColor; compactTables: boolean; showSidebarLabels: boolean }>);
      }
      setMessage("Settings saved successfully.");
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to save settings");
    }
  };

  const saveUser = async () => {
    try {
      if (editingUserId) {
        await apiClient.patch(`/users/${editingUserId}`, { ...userDraft, password: undefined });
      } else {
        await apiClient.post("/users", userDraft);
      }
      setUserDraft({ name: "", email: "", password: "", role: "ACCOUNTANT", phone: "", department: "" });
      setEditingUserId(null);
      setMessage(editingUserId ? "User updated successfully." : "User created successfully.");
      await loadData();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to save user");
    }
  };

  const removeUser = async (id: string) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/users/${id}`);
      setMessage("User deleted successfully.");
      await loadData();
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to delete user");
    }
  };

  const fields = useMemo(() => Object.entries(draft), [draft]);

  return (
    <div className="w-full space-y-6 p-4 text-text-primary lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border pb-5">
        <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-text-secondary">Live configuration and access management</p></div>
        {activeTab !== "USERS" && activeTab !== "ROLES" && activeTab !== "AUDIT" && (
          <Button disabled={!canWrite || !canReadSettings} onClick={() => void saveSettings()} className="gap-2"><Save className="h-4 w-4" />Save changes</Button>
        )}
      </div>
      {message && <p className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
      {error && <p className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
      <div className="flex overflow-x-auto rounded border border-card-border bg-card-surface">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm ${activeTab === id ? "border-b-2 border-accent-emerald text-accent-emerald" : "text-text-secondary"}`}><Icon className="h-4 w-4" />{label}</button>)}
      </div>

      {activeTab === "USERS" && <Card><CardHeader><CardTitle>User management (Admin only)</CardTitle></CardHeader><CardContent className="space-y-5">
        {canWrite && <div className="grid gap-3 rounded border border-card-border p-4 md:grid-cols-3">
          <Input placeholder="Full name" value={userDraft.name} onChange={(event) => setUserDraft({ ...userDraft, name: event.target.value })} />
          <Input placeholder="Email" type="email" value={userDraft.email} onChange={(event) => setUserDraft({ ...userDraft, email: event.target.value })} />
          <Input placeholder={editingUserId ? "Password cannot be changed here" : "Temporary password"} type="password" disabled={Boolean(editingUserId)} value={userDraft.password} onChange={(event) => setUserDraft({ ...userDraft, password: event.target.value })} />
          <select className="rounded border border-card-border bg-background-primary px-3 text-sm" value={userDraft.role} onChange={(event) => setUserDraft({ ...userDraft, role: event.target.value as UserRole })}>{Object.keys(roleDescriptions).map((role) => <option key={role}>{role}</option>)}</select>
          <Input placeholder="Phone" value={userDraft.phone} onChange={(event) => setUserDraft({ ...userDraft, phone: event.target.value })} />
          <Input placeholder="Department" value={userDraft.department} onChange={(event) => setUserDraft({ ...userDraft, department: event.target.value })} />
          <Button onClick={() => void saveUser()} className="gap-2"><Plus className="h-4 w-4" />{editingUserId ? "Update user" : "Create user"}</Button>
        </div>}
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-card-border text-left text-text-secondary"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-card-border"><td className="p-3">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3"><Badge variant="outline">{user.role}</Badge></td><td className="p-3">{user.isActive ? "Active" : "Inactive"}</td><td className="flex gap-2 p-3"><Button size="sm" variant="outline" onClick={() => { setEditingUserId(user.id); setUserDraft({ name: user.name, email: user.email, password: "", role: user.role, phone: user.phone ?? "", department: user.department ?? "" }); }}>Edit</Button><Button size="sm" variant="outline" onClick={() => void removeUser(user.id)}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div>
      </CardContent></Card>}

      {activeTab === "ROLES" && <Card><CardHeader><CardTitle>Role access matrix</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{(Object.keys(roleDescriptions) as UserRole[]).map((role) => <div key={role} className="rounded border border-card-border p-4"><div className="mb-2 flex items-center justify-between"><strong>{role}</strong><Badge variant="outline">{role === "VIEWER" ? "Read only" : "Managed policy"}</Badge></div><p className="text-sm text-text-secondary">{roleDescriptions[role]}</p></div>)}</CardContent></Card>}

      {activeTab === "AUDIT" && <Card><CardHeader><CardTitle>Live audit logs</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-card-border text-left text-text-secondary"><th className="p-3">Time</th><th className="p-3">Action</th><th className="p-3">Actor</th><th className="p-3">Module</th></tr></thead><tbody>{logs.map((log) => <tr key={String(log.id)} className="border-b border-card-border"><td className="p-3">{new Date(String(log.createdAt)).toLocaleString()}</td><td className="p-3">{String(log.action)}</td><td className="p-3">{String(log.actorEmail ?? log.actorId ?? "System")}</td><td className="p-3">{String(log.module)}</td></tr>)}</tbody></table></CardContent></Card>}

      {activeTab === "APPEARANCE" && <Card><CardHeader><CardTitle>Appearance configuration</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm"><span className="text-text-secondary">Theme</span><select aria-label="Theme" disabled={!canWrite} className="h-9 w-full rounded border border-card-border bg-input-bg px-3 text-sm text-text-primary" value={String(draft.theme ?? appearance.theme)} onChange={(event) => updateDraft("theme", event.target.value)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">Use system setting</option></select></label>
        <fieldset className="space-y-2 text-sm"><legend className="text-text-secondary">Accent color</legend><div className="flex flex-wrap gap-2">{(["emerald", "blue", "violet", "amber", "rose"] as AccentColor[]).map((color) => <button type="button" key={color} disabled={!canWrite} aria-pressed={draft.accentColor === color} onClick={() => updateDraft("accentColor", color)} className={`rounded-full border px-3 py-1.5 capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald ${draft.accentColor === color ? "border-accent-emerald bg-accent-emerald/15 text-accent-emerald" : "border-card-border text-text-secondary hover:border-accent-emerald"}`}>{color}</button>)}</div></fieldset>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(draft.compactTables)} disabled={!canWrite} onChange={(event) => updateDraft("compactTables", event.target.checked)} /><span><span className="block text-text-primary">Compact tables</span><span className="text-text-secondary">Reduce row spacing throughout data tables.</span></span></label>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.showSidebarLabels !== false} disabled={!canWrite} onChange={(event) => updateDraft("showSidebarLabels", event.target.checked)} /><span><span className="block text-text-primary">Show sidebar labels</span><span className="text-text-secondary">Keep navigation labels visible on desktop.</span></span></label>
      </CardContent></Card>}
      {activeTab !== "USERS" && activeTab !== "ROLES" && activeTab !== "AUDIT" && activeTab !== "APPEARANCE" && <Card><CardHeader><CardTitle>{tabs.find((tab) => tab.id === activeTab)?.label} configuration</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">{fields.map(([key, value]) => <label key={key} className="space-y-1 text-sm"><span className="text-text-secondary">{formatLabel(key)}</span>{typeof value === "boolean" ? <input type="checkbox" checked={value} disabled={!canWrite} onChange={(event) => updateDraft(key, event.target.checked)} /> : Array.isArray(value) ? <textarea className="min-h-24 w-full rounded border border-card-border bg-background-primary p-2" disabled={!canWrite} value={value.join(", ")} onChange={(event) => updateDraft(key, event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /> : <Input disabled={!canWrite} type={typeof value === "number" ? "number" : "text"} value={String(value ?? "")} onChange={(event) => updateDraft(key, typeof value === "number" ? Number(event.target.value) : event.target.value)} />}</label>)}</CardContent></Card>}
    </div>
  );
};

export default SettingsLive;
