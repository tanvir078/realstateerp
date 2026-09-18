import { useEffect, useMemo, useState } from "react";
import { Plus, Filter, Search, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { createInvestorPayout, getInvestorPayouts, getInvestors, processInvestorPayout } from "../../services/investors.service";
import InvestorActionModal from "../../components/forms/InvestorActionModal";
import { getProjects } from "../../services/projects.service";

const PayoutSchedule = () => {
  const [livePayouts, setLivePayouts] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"payout" | "process" | null>(null);
  const [investors, setInvestors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  useEffect(() => { Promise.all([getInvestorPayouts(), getInvestors(), getProjects()]).then(([items, list, loadedProjects]) => { setLivePayouts(items); setInvestors(list); setProjects(loadedProjects); }); }, []);
  const investorName = (item: any) => item.investor ?? investors.find((investor) => investor.id === item.investorId)?.name ?? item.investorId ?? "-";
  const payouts = (livePayouts ?? []).filter((item) => `${investorName(item)} ${item.project} ${item.payoutNo ?? item.id}`.toLowerCase().includes(search.toLowerCase()));
  const payoutStats = useMemo(() => {
    const now = new Date();
    const next30Days = new Date(now);
    next30Days.setDate(now.getDate() + 30);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const scheduled = (livePayouts ?? []).filter((item) => {
      const date = new Date(item.scheduledDate);
      return ["SCHEDULED", "Pending", "PENDING"].includes(item.status) && date >= now && date <= next30Days;
    });
    const pending = (livePayouts ?? []).filter((item) => ["SCHEDULED", "Pending", "PENDING"].includes(item.status));
    const paidThisMonth = (livePayouts ?? []).filter((item) => ["PAID", "Paid"].includes(item.status) && item.paidDate && new Date(item.paidDate) >= monthStart);
    const overdue = (livePayouts ?? []).filter((item) => ["OVERDUE", "Overdue"].includes(item.status));
    return {
      scheduled: scheduled.length,
      pending: pending.length,
      pendingAmount: pending.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      paidAmount: paidThisMonth.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      paidCount: paidThisMonth.length,
      overdue: overdue.length,
    };
  }, [livePayouts]);
  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span>Investors</span>
                <span>/</span>
                <span className="text-text-primary">Payout Schedule</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Payout Schedule</h1>
              <p className="text-sm text-text-secondary mt-1">Manage investor payouts and distributions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setModal("payout")}>
                <Plus className="w-4 h-4" />
                Schedule Payout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Scheduled Payouts</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{payoutStats.scheduled}</p>
              <p className="text-xs text-text-secondary mt-1">Next 30 days</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Pending</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{payoutStats.pending}</p>
              <p className="text-xs text-text-secondary mt-1">Total: ৳ {payoutStats.pendingAmount.toLocaleString("en-BD")}</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Paid This Month</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">৳ {payoutStats.paidAmount.toLocaleString("en-BD")}</p>
              <p className="text-xs text-text-secondary mt-1">{payoutStats.paidCount} payouts completed</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Overdue</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{payoutStats.overdue}</p>
              <p className="text-xs text-text-secondary mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Schedule Table */}
        <Card className="border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>Upcoming and completed investor payouts</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input placeholder="Search payouts..." className="pl-10 w-64" value={search} onChange={(event) => setSearch(event.target.value)} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Investor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.payoutNo ?? payout.id}</TableCell>
                    <TableCell>{investorName(payout)}</TableCell>
                    <TableCell>{payout.project}</TableCell>
                    <TableCell className="text-right">{typeof payout.amount === "number" ? `৳ ${payout.amount.toLocaleString("en-BD")}` : payout.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payout.type}</Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{payout.scheduledDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payout.status === 'PAID' || payout.status === 'Paid' ? 'success' : 
                          payout.status === 'OVERDUE' || payout.status === 'Overdue' ? 'danger' : 
                          payout.status === 'SCHEDULED' || payout.status === 'Scheduled' ? 'outline' : 'warning'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{payout.paidDate || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {(payout.status === 'Pending' || payout.status === 'SCHEDULED') && (
                          <Button variant="ghost" size="sm" className="text-accent-emerald" onClick={() => { setSelectedPayout(payout); setModal("process"); }}>
                            Process
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {modal === "payout" && <InvestorActionModal mode="payout" investors={investors} projects={projects} onClose={() => setModal(null)} onSave={async (data) => { const created = await createInvestorPayout(data); setLivePayouts((current) => [created, ...(current ?? [])]); setModal(null); }} />}
      {modal === "process" && selectedPayout && <InvestorActionModal mode="process" payout={selectedPayout} onClose={() => setModal(null)} onSave={async (data) => { const result = await processInvestorPayout(selectedPayout.id, data); setLivePayouts((current) => (current ?? []).map((item) => item.id === selectedPayout.id ? result.payout : item)); setModal(null); }} />}
    </div>
  );
};

export default PayoutSchedule;
