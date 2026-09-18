import { useEffect, useMemo, useState } from "react";
import { Download, Filter, Search, TrendingUp, Users, Building2, Calendar, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { getSales } from "../../services/sales.service";

const SalesReport = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getSales().then(setSales).catch((reason) => setError(reason?.response?.data?.message ?? "Unable to load sales report"));
  }, []);

  const projectOptions = useMemo(
    () => [...new Set(sales.map((sale) => sale.projectName || sale.projectId).filter(Boolean))].sort(),
    [sales],
  );

  const filteredSales = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return sales.filter((sale) => {
      const saleDate = String(sale.saleDate || sale.createdAt || "").slice(0, 10);
      const searchable = [sale.id, sale.clientName, sale.clientId, sale.projectName, sale.projectId, sale.unitNo, sale.unitId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const normalizedStatus = String(sale.status || "").toUpperCase();
      return (!normalizedSearch || searchable.includes(normalizedSearch))
        && (statusFilter === "ALL" || normalizedStatus === statusFilter)
        && (projectFilter === "ALL" || (sale.projectName || sale.projectId) === projectFilter)
        && (!fromDate || saleDate >= fromDate)
        && (!toDate || saleDate <= toDate);
    });
  }, [fromDate, projectFilter, sales, searchTerm, statusFilter, toDate]);

  const totalUnitsSold = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const averageSale = totalUnitsSold ? totalRevenue / totalUnitsSold : 0;
  const salesByProject = useMemo(() => Object.values(filteredSales.reduce((groups, sale) => { const key = sale.projectName || sale.projectId || "Unassigned"; const current = groups[key] ?? { project: key, units: 0, value: 0 }; current.units += 1; current.value += Number(sale.totalPrice || 0); groups[key] = current; return groups; }, {} as Record<string, { project: string; units: number; value: number }>)), [filteredSales]);
  const recentSales = filteredSales.slice(0, 20);
  const reportEndDate = filteredSales
    .map((sale) => String(sale.saleDate || sale.createdAt || "").slice(0, 10))
    .filter(Boolean)
    .sort()
    .at(-1) || new Date().toISOString().slice(0, 10);

  const handleExport = () => {
    const headers = ["Sale ID", "Client", "Project", "Unit", "Amount", "Date", "Status"];
    const rows = filteredSales.map((sale) => [
      sale.id,
      sale.clientName || sale.clientId || "",
      sale.projectName || sale.projectId || "",
      sale.unitNo || sale.unitId || "",
      Number(sale.totalPrice || 0),
      String(sale.saleDate || sale.createdAt || "").slice(0, 10),
      sale.status || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span>Reports</span>
                <span>/</span>
                <span className="text-text-primary">Sales Report</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Sales Report</h1>
              <p className="text-sm text-text-secondary mt-1">Live sales data through {reportEndDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters((visible) => !visible)} aria-expanded={showFilters}>
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button size="sm" className="gap-2" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Revenue</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">৳ {totalRevenue.toLocaleString("en-BD")}</p>
              <p className="text-xs text-text-secondary mt-1">Live filtered total</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Units Sold</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{totalUnitsSold}</p>
              <p className="text-xs text-text-secondary mt-1">Live filtered count</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">New Clients</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{new Set(sales.map((sale) => sale.clientId)).size}</p>
              <p className="text-xs text-text-secondary mt-1">Distinct clients in selection</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Avg. Sale Value</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">৳ {averageSale.toLocaleString("en-BD")}</p>
              <p className="text-xs text-text-secondary mt-1">Based on filtered sales</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales by Project */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Sales by Project</CardTitle>
              <CardDescription>Unit sales breakdown by project</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Avg Price</TableHead>
                    <TableHead className="text-right">Sold %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesByProject.map((item: any, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.project}</TableCell>
                      <TableCell className="text-right">{item.units}</TableCell>
                      <TableCell className="text-right">৳ {item.value.toLocaleString("en-BD")}</TableCell>
                      <TableCell className="text-right">৳ {(item.value / item.units).toLocaleString("en-BD")}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.soldPercentage !== "0%" ? "success" : "outline"}>
                          {item.units} sold
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sales by Agent */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Sales by Agent</CardTitle>
              <CardDescription>Agent performance and commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-text-secondary">
                      Agent attribution is not available on the sales records.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {showFilters && (
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-card-border bg-card-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm text-text-secondary">Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-card-border bg-background-secondary px-3 text-sm text-text-primary" aria-label="Filter sales by status">
                <option value="ALL">All statuses</option>
                {[...new Set(sales.map((sale) => String(sale.status || "").toUpperCase()).filter(Boolean))].sort().map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="text-sm text-text-secondary">Project
              <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-card-border bg-background-secondary px-3 text-sm text-text-primary" aria-label="Filter sales by project">
                <option value="ALL">All projects</option>
                {projectOptions.map((project) => <option key={project} value={project}>{project}</option>)}
              </select>
            </label>
            <label className="text-sm text-text-secondary">From date
              <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1" aria-label="Sales report start date" />
            </label>
            <label className="text-sm text-text-secondary">To date
              <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1" aria-label="Sales report end date" />
            </label>
          </div>
        )}

        {/* Recent Sales */}
        <Card className="border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest property transactions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input placeholder="Search sales…" className="pl-10 w-64" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Search sales report" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.clientName || sale.clientId}</TableCell>
                    <TableCell>{sale.projectName || sale.projectId}</TableCell>
                    <TableCell>{sale.unitNo || sale.unitId}</TableCell>
                    <TableCell className="text-right">৳ {Number(sale.totalPrice || 0).toLocaleString("en-BD")}</TableCell>
                    <TableCell className="text-text-secondary">{sale.createdAt?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Badge variant={sale.status === 'completed' ? 'success' : 'warning'}>
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {!recentSales.length && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-text-secondary">No sales match the selected filters.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      </div>
    </div>
  );
};

export default SalesReport;
