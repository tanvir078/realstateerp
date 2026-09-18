import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Building2, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DataTable,
  EmptyState,
  InlineAlert,
  PageContainer,
  PageHeader,
  QuickActionGrid,
  SectionCard,
  StatCard,
  StatGrid,
  StatusBadge,
  type DataTableColumn,
  type QuickAction,
} from "@/components/page";
import { formatDate, formatMoney, formatPercent } from "@/lib/format";
import { getClients } from "@/services/clients.service";
import { getBookings } from "@/services/bookings.service";

const quickActions: QuickAction[] = [
  { title: "Client List", description: "View and manage client records", icon: Users, route: "/clients/list", tone: "success" },
  { title: "Bookings", description: "Property bookings and reservations", icon: Building2, route: "/clients/bookings", tone: "info" },
  { title: "Collections", description: "Track payment collections and dues", icon: DollarSign, route: "/clients/collections", tone: "warning" },
  { title: "Installments", description: "Monitor installment schedules", icon: Calendar, route: "/clients/installments", tone: "default" },
];

interface BookingRow {
  id: string;
  clientName: string;
  project: string;
  unit: string;
  amount: number;
  date?: string;
  status: string;
}

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getClients(), getBookings()])
      .then(([loadedClients, loadedBookings]) => {
        setClients(loadedClients);
        setBookings(loadedBookings);
      })
      .catch((reason: any) => setError(reason?.message || "Failed to load clients and sales"))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = clients.reduce((sum, client) => sum + Number(client.totalPrice || 0), 0);
  const totalCollected = clients.reduce((sum, client) => sum + Number(client.totalPaid || 0), 0);
  const now = new Date();
  const newThisMonth = clients.filter((client) => {
    const createdAt = client.createdAt || client.registrationDate;
    if (!createdAt) return false;
    const date = new Date(createdAt);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter((client) => String(client.status).toLowerCase() === "active").length,
    totalRevenue,
    totalCollected,
    pending: Math.max(totalRevenue - totalCollected, 0),
    averagePerClient: clients.length ? totalRevenue / clients.length : 0,
    newThisMonth,
    collectionRate: totalRevenue > 0 ? (totalCollected / totalRevenue) * 100 : 0,
  };

  const recentBookings: BookingRow[] = bookings.slice(0, 8).map((booking) => ({
    id: booking.id,
    clientName: booking.clientName || clients.find((client) => client.id === (booking.clientRecordId || booking.clientId))?.clientName || booking.clientId,
    project: booking.projectName,
    unit: booking.unitNo,
    amount: Number(booking.totalPrice || 0),
    date: booking.saleDate || booking.createdAt,
    status: booking.status,
  }));

  const bookingColumns: DataTableColumn<BookingRow>[] = [
    {
      key: "clientName",
      header: "Client",
      render: (row) => <span className="font-medium">{row.clientName}</span>,
    },
    {
      key: "project",
      header: "Project / Unit",
      hideOnMobile: true,
      render: (row) => (
        <span className="text-text-secondary">
          {row.project}
          <span className="block text-[11px]">{row.unit}</span>
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      hideOnMobile: true,
      render: (row) => <span className="text-text-secondary">{formatDate(row.date)}</span>,
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "amount",
      header: "Value",
      align: "right",
      render: (row) => <span className="font-mono">{formatMoney(row.amount)}</span>,
    },
  ];

  const dueClients = clients.filter((client) => Number(client.dueAmount || 0) > 0).slice(0, 5);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Clients & Sales" }]}
        title="Clients & Sales"
        description="Client relationships, booking pipeline and collection performance."
        actions={
          <Button size="sm" onClick={() => navigate("/clients/list")}>
            <Users aria-hidden="true" className="h-4 w-4" />
            Manage Clients
          </Button>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <StatGrid>
        <StatCard
          label="Total Clients"
          value={stats.totalClients}
          hint={`${stats.activeClients} active · ${stats.newThisMonth} new this month`}
          icon={Users}
          tone="success"
        />
        <StatCard
          label="Total Revenue"
          value={formatMoney(stats.totalRevenue, { compact: true })}
          hint={`Avg ${formatMoney(stats.averagePerClient, { compact: true })} per client`}
          icon={DollarSign}
          tone="info"
        />
        <StatCard
          label="Collected"
          value={formatMoney(stats.totalCollected, { compact: true })}
          hint={`${formatPercent(stats.collectionRate)} collection rate`}
          icon={TrendingUp}
          tone="success"
          emphasiseValue
        />
        <StatCard
          label="Pending Dues"
          value={formatMoney(stats.pending, { compact: true })}
          hint="Requires follow-up"
          icon={Bell}
          tone="warning"
          emphasiseValue
        />
      </StatGrid>

      <QuickActionGrid actions={quickActions} />

      <SectionCard
        title="Recent Bookings"
        description="Latest property bookings and reservations"
        padded={false}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/clients/bookings")}>
            View all
          </Button>
        }
      >
        <DataTable
          columns={bookingColumns}
          rows={recentBookings}
          rowKey={(row) => row.id}
          loading={loading}
          emptyTitle="No bookings yet"
          emptyDescription="Bookings appear here once a unit is reserved for a client."
        />
      </SectionCard>

      <SectionCard
        title="Payment Reminders"
        description="Clients with an outstanding balance"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/clients/collections")}>
            View all
          </Button>
        }
      >
        {dueClients.length === 0 ? (
          <EmptyState title="No outstanding dues" description="Every client is up to date on payments." icon={Bell} />
        ) : (
          <ul className="space-y-2">
            {dueClients.map((client) => (
              <li
                key={client.id}
                className="flex items-center gap-3 rounded-lg border border-card-border bg-background-secondary/60 p-3"
              >
                <span className="rounded-md bg-status-warning/10 p-1.5 text-status-warning">
                  <Bell aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{client.clientName}</p>
                  <p className="text-[11px] text-text-secondary">Due {formatMoney(client.dueAmount)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/clients/collections")}>
                  Collect
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </PageContainer>
  );
};

export default Clients;
