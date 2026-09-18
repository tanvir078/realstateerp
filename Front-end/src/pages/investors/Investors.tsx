import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, TrendingUp, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
import { formatDate, formatMoney, formatPercent } from "@/lib/format";
import { getInvestorsDashboard } from "@/services/investors.service";

type DashboardData = {
  stats: {
    totalInvestors: number;
    activeInvestors: number;
    totalEquity: number;
    pendingPayouts: number;
    totalPayouts: number;
  };
  recentAllocations: Array<{
    id: string;
    investor: string;
    project: string;
    equityPercent: number;
    investment: number;
    currentValue: number;
    profit: number;
  }>;
  recentPayouts: Array<{
    id: string;
    investor: string;
    project: string;
    amount: number;
    type: string;
    status: string;
    scheduledDate: string;
  }>;
};

const quickActions: QuickAction[] = [
  { title: "Investor Profiles", description: "Investor master records", icon: Users, route: "/investors/profiles", tone: "success" },
  { title: "Equity Share", description: "Allocation across projects", icon: PieChart, route: "/investors/equity-share", tone: "info" },
  { title: "Payout Schedule", description: "Scheduled and settled payouts", icon: Wallet, route: "/investors/payout-schedule", tone: "warning" },
];

const Investors = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInvestorsDashboard()
      .then(setData)
      .catch(() => setError("Investors dashboard data could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Investors" }]}
        title="Investors"
        description="Equity distribution, invested capital and payout position."
        actions={
          <Button size="sm" onClick={() => navigate("/investors/profiles")}>
            <Users aria-hidden="true" className="h-4 w-4" />
            Manage Investors
          </Button>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}
      {loading && <LoadingState message="Loading investors dashboard…" />}

      {stats && (
        <StatGrid columns={5}>
          <StatCard label="Total Investors" value={stats.totalInvestors} icon={Users} tone="success" />
          <StatCard label="Active Investors" value={stats.activeInvestors} icon={Users} tone="info" />
          <StatCard
            label="Total Equity"
            value={formatPercent(stats.totalEquity)}
            hint="Allocated across projects"
            icon={PieChart}
            tone="default"
          />
          <StatCard
            label="Pending Payouts"
            value={stats.pendingPayouts}
            icon={Wallet}
            tone={stats.pendingPayouts > 0 ? "warning" : "default"}
            emphasiseValue
            onClick={() => navigate("/investors/payout-schedule")}
          />
          <StatCard
            label="Total Payouts"
            value={formatMoney(stats.totalPayouts, { compact: true })}
            hint="Settled to date"
            icon={TrendingUp}
            tone="success"
          />
        </StatGrid>
      )}

      <QuickActionGrid actions={quickActions} className="lg:grid-cols-3" />

      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard
            title="Recent Equity Allocations"
            description="Latest investor allocations"
            actions={
              <Button variant="outline" size="sm" onClick={() => navigate("/investors/equity-share")}>
                View all
              </Button>
            }
          >
            {data.recentAllocations.length === 0 ? (
              <EmptyState title="No allocations" description="Equity allocations will appear here." icon={PieChart} />
            ) : (
              <ul className="space-y-2">
                {data.recentAllocations.map((allocation) => (
                  <li
                    key={allocation.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-card-border bg-background-secondary/50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{allocation.project}</p>
                      <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                        {allocation.investor} · {formatPercent(allocation.equityPercent)} equity
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary">
                        Invested {formatMoney(allocation.investment)}
                      </p>
                    </div>
                    <StatusBadge
                      status={`Profit ${formatMoney(allocation.profit)}`}
                      tone={allocation.profit >= 0 ? "success" : "danger"}
                      raw
                    />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Recent Payouts"
            description="Latest investor disbursements"
            actions={
              <Button variant="outline" size="sm" onClick={() => navigate("/investors/payout-schedule")}>
                View all
              </Button>
            }
          >
            {data.recentPayouts.length === 0 ? (
              <EmptyState title="No payouts" description="Scheduled payouts will appear here." icon={Wallet} />
            ) : (
              <ul className="space-y-2">
                {data.recentPayouts.map((payout) => (
                  <li
                    key={payout.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-card-border bg-background-secondary/50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{payout.project}</p>
                      <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                        {payout.investor} · {payout.type}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary">
                        {formatMoney(payout.amount)} · {formatDate(payout.scheduledDate)}
                      </p>
                    </div>
                    <StatusBadge status={payout.status} />
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

export default Investors;
