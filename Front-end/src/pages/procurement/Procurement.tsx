import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, FileText, ShoppingCart, TrendingUp, Users } from "lucide-react";
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
import { formatDate, formatMoney } from "@/lib/format";
import { getPurchaseOrders, getVendorBills, getVendors } from "@/services/procurement.service";

type PurchaseOrder = {
  poNo: string;
  vendorId: string;
  items: string;
  totalAmount: number;
  deliveryDate: string;
  status: string;
};

type Vendor = { id: string; name: string; status: string };
type VendorBill = { billNo: string; amount: number; paidAmount: number; dueDate: string; status: string };

interface OrderRow {
  id: string;
  vendor: string;
  items: string;
  amount: number;
  date: string;
  status: string;
}

const quickActions: QuickAction[] = [
  { title: "Purchase Orders", description: "Raise and track purchase orders", icon: ShoppingCart, route: "/procurement/purchase-orders", tone: "success" },
  { title: "Vendors", description: "Supplier master records", icon: Users, route: "/procurement/vendors", tone: "info" },
  { title: "Vendor Bills", description: "Invoices, payments and balances", icon: FileText, route: "/procurement/vendor-bills", tone: "warning" },
];

const Procurement = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorBills, setVendorBills] = useState<VendorBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPurchaseOrders(), getVendors(), getVendorBills()])
      .then(([orders, vendorList, bills]) => {
        setPurchaseOrders(orders as PurchaseOrder[]);
        setVendors(vendorList as Vendor[]);
        setVendorBills(bills as VendorBill[]);
      })
      .catch(() => setError("Procurement dashboard data could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      totalPOs: purchaseOrders.length,
      pendingPOs: purchaseOrders.filter((order) => order.status !== "APPROVED").length,
      totalVendors: vendors.length,
      activeVendors: vendors.filter((vendor) => vendor.status === "ACTIVE").length,
      totalPurchases: purchaseOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      pendingPayments: vendorBills.reduce(
        (sum, bill) => sum + Number(bill.amount || 0) - Number(bill.paidAmount || 0),
        0,
      ),
    }),
    [purchaseOrders, vendors, vendorBills],
  );

  const recentOrders: OrderRow[] = purchaseOrders.slice(0, 8).map((order) => ({
    id: order.poNo,
    vendor: vendors.find((vendor) => vendor.id === order.vendorId)?.name || order.vendorId,
    items: order.items,
    amount: Number(order.totalAmount || 0),
    date: order.deliveryDate,
    status: order.status,
  }));

  const orderColumns: DataTableColumn<OrderRow>[] = [
    { key: "id", header: "PO", render: (row) => <span className="font-mono text-accent-emerald">{row.id}</span> },
    { key: "vendor", header: "Vendor" },
    { key: "items", header: "Items", hideOnMobile: true, render: (row) => <span className="text-text-secondary">{row.items}</span> },
    {
      key: "date",
      header: "Delivery",
      hideOnMobile: true,
      render: (row) => <span className="text-text-secondary">{formatDate(row.date)}</span>,
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "amount", header: "Amount", align: "right", render: (row) => <span className="font-mono">{formatMoney(row.amount)}</span> },
  ];

  const outstandingBills = vendorBills
    .filter((bill) => Number(bill.amount || 0) > Number(bill.paidAmount || 0))
    .slice(0, 5);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Procurement & Vendors" }]}
        title="Procurement & Vendors"
        description="Purchase pipeline, supplier base and outstanding payables."
        actions={
          <Button size="sm" onClick={() => navigate("/procurement/purchase-orders")}>
            <ShoppingCart aria-hidden="true" className="h-4 w-4" />
            New PO
          </Button>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <StatGrid>
        <StatCard
          label="Purchase Orders"
          value={stats.totalPOs}
          hint={`${stats.pendingPOs} awaiting approval`}
          icon={ShoppingCart}
          tone="success"
        />
        <StatCard
          label="Active Vendors"
          value={stats.activeVendors}
          hint={`of ${stats.totalVendors} total`}
          icon={Users}
          tone="info"
        />
        <StatCard
          label="Total Purchases"
          value={formatMoney(stats.totalPurchases, { compact: true })}
          hint="Across all purchase orders"
          icon={TrendingUp}
          tone="default"
        />
        <StatCard
          label="Pending Payments"
          value={formatMoney(stats.pendingPayments, { compact: true })}
          hint="Unsettled vendor bills"
          icon={AlertCircle}
          tone={stats.pendingPayments > 0 ? "warning" : "default"}
          emphasiseValue
          onClick={() => navigate("/procurement/vendor-bills")}
        />
      </StatGrid>

      <QuickActionGrid actions={quickActions} className="lg:grid-cols-3" />

      <SectionCard
        title="Recent Purchase Orders"
        description="Latest procurement activity"
        padded={false}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/procurement/purchase-orders")}>
            View all
          </Button>
        }
      >
        <DataTable
          columns={orderColumns}
          rows={recentOrders}
          rowKey={(row) => row.id}
          loading={loading}
          emptyTitle="No purchase orders"
          emptyDescription="Raise a purchase order to start tracking procurement."
        />
      </SectionCard>

      <SectionCard
        title="Payment Alerts"
        description="Vendor bills with an outstanding balance"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/procurement/vendor-bills")}>
            View all
          </Button>
        }
      >
        {outstandingBills.length === 0 ? (
          <EmptyState title="No outstanding bills" description="All vendor bills are fully settled." icon={FileText} />
        ) : (
          <ul className="space-y-2">
            {outstandingBills.map((bill) => (
              <li
                key={bill.billNo}
                className="flex items-center gap-3 rounded-lg border border-card-border bg-background-secondary/60 p-3"
              >
                <span className="rounded-md bg-status-danger/10 p-1.5 text-status-danger">
                  <AlertCircle aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">Invoice {bill.billNo}</p>
                  <p className="text-[11px] text-text-secondary">
                    Due {formatMoney(Math.max(0, Number(bill.amount) - Number(bill.paidAmount)))} · {formatDate(bill.dueDate)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/procurement/vendor-bills")}>
                  Settle
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </PageContainer>
  );
};

export default Procurement;
