import { useEffect, useState } from "react";
import { ClipboardCheck, FileText, HardHat, TrendingUp, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  EmptyState,
  InlineAlert,
  LoadingState,
  PageContainer,
  PageHeader,
  QuickActionGrid,
  SectionCard,
  StatCard,
  StatGrid,
  StatusBadge,
  type QuickAction,
} from "@/components/page";
import { formatDate, formatMoney } from "@/lib/format";
import { getConstructionDashboard } from "@/services/construction.service";

type DashboardData = {
  stats: {
    activeContractors: number;
    pendingMRNs: number;
    pendingRABills: number;
    totalEquipment: number;
    activeLaborRecords: number;
  };
  recentMRNs: Array<{ id: string; project: string; status: string; date: string }>;
  recentRABills: Array<{
    id: string;
    project: string;
    contractor: string;
    amount: number;
    status: string;
    date: string;
  }>;
};

const quickActions: QuickAction[] = [
  { title: "Site Requisitions", description: "Material requisition notes", icon: FileText, route: "/construction/site-requisitions", tone: "success" },
  { title: "Contractors", description: "Contractors and work orders", icon: Users, route: "/construction/contractors", tone: "info" },
  { title: "RA Bills", description: "Running account bills and approvals", icon: ClipboardCheck, route: "/construction/ra-bills", tone: "warning" },
  { title: "Progress & Milestones", description: "Physical progress tracking", icon: TrendingUp, route: "/construction/progress", tone: "success" },
  { title: "Equipment & Fuel", description: "Site equipment and fuel logs", icon: Wrench, route: "/construction/equipment", tone: "default" },
  { title: "Site Labor", description: "Daily wages and disbursement", icon: HardHat, route: "/construction/labor-payroll", tone: "info" },
];

const Construction = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConstructionDashboard()
      .then(setData)
      .catch(() => setError("Construction dashboard data could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Construction & Engineering" }]}
        title="Construction & Engineering"
        description="Site operations, contractor billing and equipment status."
        actions={
          <Button size="sm" onClick={() => navigate("/construction/site-requisitions")}>
            <FileText aria-hidden="true" className="h-4 w-4" />
            New Requisition
          </Button>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}
      {loading && <LoadingState message="Loading construction dashboard…" />}

      {stats && (
        <StatGrid columns={5}>
          <StatCard label="Active Contractors" value={stats.activeContractors} icon={Users} tone="success" />
          <StatCard
            label="Pending MRNs"
            value={stats.pendingMRNs}
            icon={FileText}
            tone={stats.pendingMRNs > 0 ? "warning" : "default"}
            emphasiseValue
            onClick={() => navigate("/construction/site-requisitions")}
          />
          <StatCard
            label="Pending RA Bills"
            value={stats.pendingRABills}
            icon={ClipboardCheck}
            tone={stats.pendingRABills > 0 ? "warning" : "default"}
            emphasiseValue
            onClick={() => navigate("/construction/ra-bills")}
          />
          <StatCard label="Total Equipment" value={stats.totalEquipment} icon={Wrench} tone="info" />
          <StatCard label="Labor Records" value={stats.activeLaborRecords} icon={HardHat} tone="default" />
        </StatGrid>
      )}

      <QuickActionGrid actions={quickActions} className="lg:grid-cols-3" />

      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard
            title="Recent Material Requisitions"
            description="Latest MRNs and approval status"
            actions={
              <Button variant="outline" size="sm" onClick={() => navigate("/construction/site-requisitions")}>
                View all
              </Button>
            }
          >
            {data.recentMRNs.length === 0 ? (
              <EmptyState title="No requisitions" description="Site material requests will appear here." icon={FileText} />
            ) : (
              <ul className="space-y-2">
                {data.recentMRNs.map((mrn) => (
                  <li
                    key={mrn.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-card-border bg-background-secondary/50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-accent-emerald">{mrn.id}</p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {mrn.project} · {formatDate(mrn.date)}
                      </p>
                    </div>
                    <StatusBadge status={mrn.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Recent RA Bills"
            description="Latest running account bills"
            actions={
              <Button variant="outline" size="sm" onClick={() => navigate("/construction/ra-bills")}>
                View all
              </Button>
            }
          >
            {data.recentRABills.length === 0 ? (
              <EmptyState title="No RA bills" description="Contractor bills will appear here once submitted." icon={ClipboardCheck} />
            ) : (
              <ul className="space-y-2">
                {data.recentRABills.map((bill) => (
                  <li
                    key={bill.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-card-border bg-background-secondary/50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-accent-emerald">{bill.id}</p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">{bill.project}</p>
                      <p className="mt-0.5 text-xs font-medium text-text-primary">{formatMoney(bill.amount)}</p>
                    </div>
                    <StatusBadge status={bill.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      )}
    </PageContainer>
  );
};

export default Construction;
