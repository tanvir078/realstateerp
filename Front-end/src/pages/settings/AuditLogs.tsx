import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Download, Eye, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import apiClient from "../../services/api/axios";

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    apiClient.get("/audit/logs?limit=100")
      .then((response) => setLogs(response.data))
      .catch((reason) => setError(reason?.response?.data?.message ?? "Unable to load audit logs"));
  }, []);
  const stats = useMemo(() => ({
    total: logs.length,
    successful: logs.filter((log) => ["LOGIN", "REGISTER"].includes(log.action)).length,
    warnings: logs.filter((log) => log.action.includes("FAILED") || log.action.includes("DELETE")).length,
  }), [logs]);
  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span>Settings</span>
                <span>/</span>
                <span className="text-text-primary">Audit Logs</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Audit Logs</h1>
              <p className="text-sm text-text-secondary mt-1">Track system activities and security events</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
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
                <Shield className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Events</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-secondary mt-1">Loaded events</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Successful</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stats.successful}</p>
              <p className="text-xs text-text-secondary mt-1">Login and registration events</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-status-warning" />
                <p className="text-sm text-text-secondary">Warnings</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stats.warnings}</p>
              <p className="text-xs text-text-secondary mt-1">Sensitive or failed events</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-status-danger" />
                <p className="text-sm text-text-secondary">Critical</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">0</p>
              <p className="text-xs text-text-secondary mt-1">Critical events</p>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card className="border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent system activities and security events</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input placeholder="Search logs..." className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-text-secondary">{new Date(log.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.actorEmail || log.actorId || "System"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.module}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary max-w-xs truncate">{log.details ? JSON.stringify(log.details) : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.severity === 'success' ? 'success' :
                          log.severity === 'warning' ? 'warning' :
                          log.severity === 'danger' ? 'destructive' : 'outline'
                        }
                      >
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;
