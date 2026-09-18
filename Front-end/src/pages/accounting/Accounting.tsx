import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, FileText, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DataTable,
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
import { useAccounting } from "@/context/AccountingContext";

const quickActions: QuickAction[] = [
  { title: "Receivables", description: "Client dues and collections", icon: ArrowDownLeft, route: "/accounting/receivables", tone: "success" },
  { title: "Payables", description: "Vendor bills and settlements", icon: ArrowUpRight, route: "/accounting/payables", tone: "danger" },
  { title: "Vouchers", description: "All financial vouchers", icon: FileText, route: "/accounting/vouchers", tone: "info" },
  { title: "Cash & Bank", description: "Account balances and transfers", icon: Wallet, route: "/accounting/cash-bank", tone: "warning" },
];

interface VoucherRow {
  id: string;
  voucherNo: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

const Accounting = () => {
  const navigate = useNavigate();
  const {
    accountSummary,
    fetchAccountSummary,
    vouchers,
    fetchVouchers,
    cashBankAccounts,
    fetchCashBankAccounts,
    vouchersLoading,
  } = useAccounting();

  useEffect(() => {
    void Promise.all([fetchAccountSummary(), fetchVouchers(), fetchCashBankAccounts()]);
  }, []);

  const income = Number(accountSummary.REVENUE ?? 0);
  const expense = Number(accountSummary.EXPENSE ?? 0);
  const netProfit = income - expense;
  const liquidity = cashBankAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);

  const recentVouchers: VoucherRow[] = vouchers.slice(0, 8).map((voucher: any) => ({
    id: voucher.id,
    voucherNo: voucher.voucherNo,
    type: voucher.voucherType,
    description: voucher.particulars,
    amount: Number(voucher.amount),
    date: voucher.entryDate,
    status: voucher.status,
  }));

  const voucherColumns: DataTableColumn<VoucherRow>[] = [
    {
      key: "voucherNo",
      header: "Voucher",
      render: (row) => <span className="font-mono text-accent-emerald">{row.voucherNo}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (row) => <StatusBadge status={row.type} tone={row.type === "CREDIT" ? "success" : "danger"} />,
    },
    { key: "description", header: "Particulars", hideOnMobile: true },
    {
      key: "date",
      header: "Date",
      hideOnMobile: true,
      render: (row) => <span className="text-text-secondary">{formatDate(row.date)}</span>,
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (row) => (
        <span className={row.type === "CREDIT" ? "font-mono text-status-success" : "font-mono text-status-danger"}>
          {formatMoney(row.amount)}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Accounting & Finance" }]}
        title="Accounting & Finance"
        description="Ledger position, liquidity and recent posting activity."
        actions={
          <Button size="sm" onClick={() => navigate("/accounting/vouchers")}>
            <FileText aria-hidden="true" className="h-4 w-4" />
            New Voucher
          </Button>
        }
      />

      <StatGrid>
        <StatCard
          label="Total Income"
          value={formatMoney(income, { compact: true })}
          hint="Posted revenue accounts"
          icon={ArrowDownLeft}
          tone="success"
          emphasiseValue
        />
        <StatCard
          label="Total Expense"
          value={formatMoney(expense, { compact: true })}
          hint="Posted expense accounts"
          icon={ArrowUpRight}
          tone="danger"
          emphasiseValue
        />
        <StatCard
          label="Net Profit"
          value={formatMoney(netProfit, { compact: true })}
          hint={income > 0 ? `${formatPercent((netProfit / income) * 100)} margin` : "No revenue posted yet"}
          icon={TrendingUp}
          tone={netProfit >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="Cash & Bank"
          value={formatMoney(liquidity, { compact: true })}
          hint={`${cashBankAccounts.length} account(s)`}
          icon={Wallet}
          tone="info"
        />
      </StatGrid>

      <QuickActionGrid actions={quickActions} />

      <SectionCard
        title="Recent Vouchers"
        description="Latest posted financial transactions"
        padded={false}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/accounting/vouchers")}>
            View all
          </Button>
        }
      >
        <DataTable
          columns={voucherColumns}
          rows={recentVouchers}
          rowKey={(row) => row.id}
          loading={vouchersLoading}
          emptyTitle="No posted transactions"
          emptyDescription="Vouchers appear here once they are posted to the ledger."
          onRowClick={() => navigate("/accounting/vouchers")}
        />
      </SectionCard>
    </PageContainer>
  );
};

export default Accounting;
