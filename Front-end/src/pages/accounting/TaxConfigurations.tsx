import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  createTaxConfiguration,
  getTaxConfigurations,
  TaxConfiguration,
  TaxConfigurationInput,
  updateTaxConfiguration,
  getTaxReport,
  TaxReport,
} from "@/services/accounting/accounting.service";

const emptyForm: TaxConfigurationInput = {
  type: "VAT",
  code: "",
  name: "",
  ratePercent: 0,
  enabled: true,
  effectiveFrom: new Date().toISOString().slice(0, 10),
  effectiveTo: "",
  outputAccountCode: "",
  inputAccountCode: "",
  withholdingAccountCode: "",
};

export default function TaxConfigurations() {
  const [taxes, setTaxes] = useState<TaxConfiguration[]>([]);
  const [form, setForm] = useState<TaxConfigurationInput>(emptyForm);
  const [editingId, setEditingId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<TaxReport>();

  const loadTaxes = async () => {
    setLoading(true);
    try {
      setTaxes(await getTaxConfigurations());
      const now = new Date();
      const fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      setReport(await getTaxReport(fromDate, toDate));
      setError("");
    } catch (reason: any) {
      setError(reason?.message ?? "Unable to load tax configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadTaxes(); }, []);

  const updateField = (field: keyof TaxConfigurationInput, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        effectiveTo: form.effectiveTo || undefined,
        ratePercent: Number(form.ratePercent),
      };
      if (editingId) await updateTaxConfiguration(editingId, payload);
      else await createTaxConfiguration(payload);
      setForm(emptyForm);
      setEditingId(undefined);
      await loadTaxes();
    } catch (reason: any) {
      setError(reason?.message ?? "Unable to save tax configuration");
    } finally {
      setSaving(false);
    }
  };

  const edit = (tax: TaxConfiguration) => {
    setEditingId(tax.id);
    setForm({ ...tax, effectiveTo: tax.effectiveTo ?? "" });
  };

  return (
    <div className="w-full space-y-6 p-6 text-[#E2E8F0]">
      <div>
        <p className="text-xs text-[#829B96]">Accounting & Finance / Controls</p>
        <h1 className="text-2xl font-bold text-white">VAT & TDS Configuration</h1>
        <p className="mt-1 text-sm text-[#829B96]">Manage effective-dated tax rules used by invoice, vendor bill and payroll posting.</p>
      </div>

      {error && <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>}

      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-4 md:grid-cols-4">
        <select value={form.type} onChange={(event) => updateField("type", event.target.value)} className="h-9 rounded-md border border-card-border bg-input-bg px-3 text-sm">
          <option value="VAT">VAT</option>
          <option value="TDS">TDS</option>
        </select>
        <Input required placeholder="Code (e.g. VAT15)" value={form.code} onChange={(event) => updateField("code", event.target.value)} />
        <Input required placeholder="Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
        <Input required min="0" max="100" step="0.0001" type="number" placeholder="Rate %" value={form.ratePercent} onChange={(event) => updateField("ratePercent", Number(event.target.value))} />
        <label className="text-xs text-[#829B96]">Effective from<Input required type="date" value={form.effectiveFrom} onChange={(event) => updateField("effectiveFrom", event.target.value)} /></label>
        <label className="text-xs text-[#829B96]">Effective to<Input type="date" value={form.effectiveTo ?? ""} onChange={(event) => updateField("effectiveTo", event.target.value)} /></label>
        <Input placeholder="Output account code" value={form.outputAccountCode ?? ""} onChange={(event) => updateField("outputAccountCode", event.target.value)} />
        <Input placeholder="Input account code" value={form.inputAccountCode ?? ""} onChange={(event) => updateField("inputAccountCode", event.target.value)} />
        <Input placeholder="Withholding account code" value={form.withholdingAccountCode ?? ""} onChange={(event) => updateField("withholdingAccountCode", event.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(event) => updateField("enabled", event.target.checked)} /> Enabled</label>
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update rule" : "Add rule"}</Button>
          {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(undefined); setForm(emptyForm); }}>Cancel</Button>}
        </div>
      </form>

      {report && <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Output VAT", report.outputVat],
          ["Input VAT", report.inputVat],
          ["Net VAT", report.netVat],
          ["TDS payable", report.tds],
        ].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs text-[#829B96]">{label}</p><p className="mt-1 text-lg font-semibold text-white">৳ {Number(value).toLocaleString("en-BD")}</p></div>)}
      </div>}

      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#1E3E37] text-xs uppercase text-[#829B96]"><tr><th className="p-3">Type</th><th className="p-3">Code</th><th className="p-3">Name</th><th className="p-3">Rate</th><th className="p-3">Effective</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td className="p-4 text-[#829B96]" colSpan={7}>Loading tax configurations...</td></tr> : taxes.length === 0 ? <tr><td className="p-4 text-[#829B96]" colSpan={7}>No tax configurations found.</td></tr> : taxes.map((tax) => (
              <tr key={tax.id} className="border-b border-[#1E3E37] last:border-0"><td className="p-3">{tax.type}</td><td className="p-3">{tax.code}</td><td className="p-3">{tax.name}</td><td className="p-3">{tax.ratePercent}%</td><td className="p-3">{tax.effectiveFrom}{tax.effectiveTo ? ` - ${tax.effectiveTo}` : ""}</td><td className="p-3">{tax.enabled ? "Enabled" : "Disabled"}</td><td className="p-3"><Button size="sm" variant="outline" onClick={() => edit(tax)}>Edit</Button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
