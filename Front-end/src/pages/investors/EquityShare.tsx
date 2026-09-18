import { useEffect, useMemo, useState } from "react";
import { Plus, Filter, Search, PieChart, TrendingUp, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { createInvestorAllocation, getInvestorAllocations, getInvestors } from "../../services/investors.service";
import { getProjects } from "../../services/projects.service";
import InvestorActionModal from "../../components/forms/InvestorActionModal";

const EquityShare = () => {
  const [liveShares, setLiveShares] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [investors, setInvestors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => { Promise.all([getInvestorAllocations(), getInvestors(), getProjects()]).then(([shares, list, loadedProjects]) => { setLiveShares(shares); setInvestors(list); setProjects(loadedProjects); }); }, []);
  const equityShares = liveShares ?? [];
  const investorName = (item: any) => item.investor ?? investors.find((investor) => investor.id === item.investorId)?.name ?? item.investorId ?? "-";
  const visibleShares = equityShares.filter((item) => `${investorName(item)} ${item.project}`.toLowerCase().includes(search.toLowerCase()));
  const equityStats = useMemo(() => {
    const totalEquity = equityShares.reduce((sum, item) => sum + Number(item.equityPercent || 0), 0);
    const totalProfit = equityShares.reduce((sum, item) => sum + Number(item.currentValue || 0) - Number(item.investment || 0), 0);
    const activeProjects = new Set(equityShares.map((item) => item.project).filter(Boolean)).size;
    const monthStart = new Date();
    monthStart.setDate(1);
    const newAllocations = equityShares.filter((item) => item.createdAt && new Date(item.createdAt) >= monthStart).length;
    const byProject = equityShares.reduce<Record<string, number>>((summary, item) => {
      if (item.project) summary[item.project] = (summary[item.project] || 0) + Number(item.equityPercent || 0);
      return summary;
    }, {});
    return { totalEquity, totalProfit, activeProjects, newAllocations, byProject };
  }, [equityShares]);
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
                <span className="text-text-primary">Equity Share</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Equity Share</h1>
              <p className="text-sm text-text-secondary mt-1">Track equity distribution and ownership</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setModal(true)}>
                <Plus className="w-4 h-4" />
                Allocate Equity
              </Button>
            </div>
            {modal && <InvestorActionModal mode="allocation" investors={investors} projects={projects} onClose={() => setModal(false)} onSave={async (data) => { const created = await createInvestorAllocation(data); setLiveShares((current) => [created, ...(current ?? [])]); setModal(false); }} />}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Equity</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{equityStats.totalEquity.toLocaleString()}%</p>
              <p className="text-xs text-text-secondary mt-1">From live allocations</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Profit</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">৳ {equityStats.totalProfit.toLocaleString("en-BD")}</p>
              <p className="text-xs text-text-secondary mt-1">Current value less investment</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Active Projects</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{equityStats.activeProjects}</p>
              <p className="text-xs text-text-secondary mt-1">With equity investors</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">New Allocations</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{equityStats.newAllocations}</p>
              <p className="text-xs text-text-secondary mt-1">Created this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Equity Distribution */}
        <Card className="border-card-border mb-6">
          <CardHeader>
            <CardTitle>Equity Distribution by Project</CardTitle>
            <CardDescription>Overview of equity allocation across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(equityStats.byProject).map(([project, allocation]) => (
                <div key={project}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{project}</span>
                    <span className="text-sm text-text-primary">{allocation.toLocaleString()}% allocated</span>
                  </div>
                  <ProgressBar value={allocation} max={100} showLabel={false} />
                </div>
              ))}
              {!Object.keys(equityStats.byProject).length && (
                <p className="text-sm text-text-secondary">No live equity allocations found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Equity Shares Table */}
        <Card className="border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Equity Holdings</CardTitle>
                <CardDescription>Detailed equity distribution and performance</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input placeholder="Search equity..." className="pl-10 w-64" value={search} onChange={(event) => setSearch(event.target.value)} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Equity %</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Profit/Loss</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleShares.map((equity) => (
                  <TableRow key={equity.id}>
                    <TableCell className="font-medium">{equity.investor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {equity.project}
                      </div>
                    </TableCell>
                    <TableCell>{investorName(equity)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{equity.equityPercent ? `${equity.equityPercent}%` : equity.equity}</span>
                        <ProgressBar value={Number(equity.equityPercent ?? parseFloat(equity.equity))} max={100} showLabel={false} className="w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{equity.investment?.toLocaleString ? `৳ ${Number(equity.investment).toLocaleString("en-BD")}` : equity.investment}</TableCell>
                    <TableCell className="text-right">{equity.currentValue?.toLocaleString ? `৳ ${Number(equity.currentValue).toLocaleString("en-BD")}` : equity.currentValue}</TableCell>
                    <TableCell className="text-right text-accent-emerald">+{equity.profit?.toLocaleString ? `৳ ${Number(equity.profit).toLocaleString("en-BD")}` : equity.profit}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          equity.status === 'ACTIVE' || equity.status === 'Active' ? 'success' : 
                          equity.status === 'PENDING' || equity.status === 'Pending' ? 'warning' : 'outline'
                        }
                      >
                        {equity.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquityShare;
