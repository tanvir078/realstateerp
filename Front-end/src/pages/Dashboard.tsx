import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Home, FileText, DollarSign, Users, AlertCircle, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import CollectPaymentModal from "../components/forms/CollectPaymentModal";
import ClientForm from "../components/forms/ClientForm";
import DebitVoucherModal from "../components/forms/DebitVoucherModal";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardSummary, getDashboardSummary } from "@/services/reports.service";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDebitVoucherModalOpen, setIsDebitVoucherModalOpen] = useState(false);
  const [isCollectPaymentModalOpen, setIsCollectPaymentModalOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const { t } = useLanguage();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setSummaryError("Dashboard data could not be loaded."));
  }, []);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value);

  const kpiCards = useMemo(() => summary ? [
    { title: "Total Revenue", amount: formatMoney(summary.kpis.revenue), subtext: "All sales revenue", statusColor: "#10B981", icon: <DollarSign className="h-5 w-5" /> },
    { title: "Total Expenses", amount: formatMoney(summary.kpis.expenses), subtext: "Vendor bill value", statusColor: "#EF4444", icon: <AlertCircle className="h-5 w-5" /> },
    { title: "Net Profit", amount: formatMoney(summary.kpis.netProfit), subtext: "Revenue less vendor bills", statusColor: "#10B981", icon: <TrendingUp className="h-5 w-5" /> },
    { title: "Cash Balance", amount: formatMoney(summary.kpis.cashBalanceEstimate), subtext: "Collections less paid bills", statusColor: "#3B82F6", icon: <Clock className="h-5 w-5" /> },
  ] : [], [summary]);

  const pendingApprovals = summary?.counts.pendingVendorBills
    ? [{ id: "vendor-bills", description: "Vendor bills pending payment", amount: String(summary.counts.pendingVendorBills) }]
    : [];
  const recentVouchers = summary?.recentVouchers ?? [];
  const projectProgress = summary?.projectProgress ?? [];

  const handleDebitVoucherSave = (_data: unknown) => {};

  const handleCollectPaymentSave = (_data: unknown) => {};

  const handleClientSave = (_data: unknown) => {};

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {/* Page Header */}
      <div className="p-4 space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <Home className="h-3.5 w-3.5" />
          <span>Dashboard</span>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Finance Overview</span>
        </div>

        {summaryError && (
          <div className="mx-4 rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
            {summaryError}
          </div>
        )}

        {!summary && !summaryError && (
          <div className="mx-4 rounded-lg border border-[#1E3E37] bg-[#112421] px-4 py-3 text-sm text-[#829B96]">
            Loading live dashboard data...
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{t("dashboard.title")}</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              FY 2024–25 · 3 projects tracked · Accounting summary
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-[#112421] border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#10B981]" />
              {t("dashboard.exportReport")}
            </Button>
            <Button 
              onClick={() => setIsCollectPaymentModalOpen(true)}
              size="sm" className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
            >
              <DollarSign className="h-3.5 w-3.5" />
              {t("dashboard.collectPayment")}
            </Button>
            <Button 
              onClick={() => setIsDebitVoucherModalOpen(true)}
              size="sm" className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              {t("dashboard.debitVoucher")}
            </Button>
            <Button 
              onClick={() => setIsClientFormOpen(true)}
              size="sm" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs gap-1.5"
            >
              <Users className="h-3.5 w-3.5" />
              {t("dashboard.addClient")}
            </Button>
          </div>
        </div>
      </div>

      {/* Primary mobile actions */}
      <div className="grid grid-cols-2 gap-3 px-4 sm:hidden">
        <Button
          onClick={() => setIsCollectPaymentModalOpen(true)}
          className="h-14 justify-start gap-2 bg-[#10B981] text-left text-slate-950 hover:bg-[#0D9668]"
        >
          <DollarSign className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold">{t("dashboard.collectPayment")}</span>
        </Button>
        <Button
          onClick={() => setIsDebitVoucherModalOpen(true)}
          className="h-14 justify-start gap-2 bg-rose-500 text-left text-white hover:bg-rose-600"
        >
          <FileText className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold">{t("dashboard.debitVoucher")}</span>
        </Button>
        <Button
          onClick={() => setIsClientFormOpen(true)}
          className="h-14 justify-start gap-2 bg-sky-500 text-left text-white hover:bg-sky-600"
        >
          <Users className="h-5 w-5 shrink-0" />
          <span className="text-xs font-semibold">{t("dashboard.addClient")}</span>
        </Button>
        <Button
          onClick={() => navigate("/accounting")}
          variant="outline"
          className="h-14 justify-start gap-2 border-[#1E3E37] bg-[#112421] text-left text-white hover:bg-[#1A3530]"
        >
          <TrendingUp className="h-5 w-5 shrink-0 text-[#10B981]" />
          <span className="text-xs font-semibold">Accounting</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="group bg-[#112421] border border-[#1E3E37] border-l-2 p-4 rounded-lg space-y-2 transition-colors hover:border-[#2B554B]"
            style={{ borderLeftColor: card.statusColor }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[#829B96] font-semibold uppercase tracking-wide">{t(`dashboard.${card.title === "Total Revenue" ? "totalRevenue" : card.title === "Total Expenses" ? "totalExpenses" : card.title === "Net Profit" ? "netProfit" : "cashBalance"}`)}</p>
              <div
                className="p-1.5 rounded-md border border-[#1E3E37] bg-[#0B1816]"
                style={{ color: card.statusColor }}
              >
                {card.icon}
              </div>
            </div>
            <p className="text-xl font-bold tracking-tight text-white">{card.amount}</p>
            <p className="border-t border-[#1E3E37] pt-1.5 text-[11px] text-[#829B96]">{t(`dashboard.${card.subtext === "This month revenue" ? "thisMonthRevenue" : card.subtext === "This month expenses" ? "thisMonthExpenses" : card.subtext === "This month profit" ? "thisMonthProfit" : "availableCash"}`)}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Net Cash Flow Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">{t("dashboard.netCashFlow")}</h3>
              <p className="text-xs text-[#829B96]">{t("dashboard.inflowOutflow")}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[11px] text-[#829B96]">{t("dashboard.inflow")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[11px] text-[#829B96]">{t("dashboard.outflow")}</span>
              </div>
            </div>
          </div>
          <div className="h-48 bg-[#0B1816] border border-[#1E3E37] rounded-lg flex items-center justify-center text-[#829B96] text-xs">
            <span>{t("dashboard.chartPlaceholder")}</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">{t("dashboard.pendingApprovals")}</h3>
            <p className="text-xs text-[#829B96]">{t("dashboard.itemsRequiringReview")}</p>
          </div>
          <div className="space-y-2">
            {pendingApprovals.map((item) => (
              <div 
                key={item.id}
                className="p-3 bg-[#0B1816] border border-[#1E3E37] rounded-lg"
              >
                <p className="text-sm text-white mb-1">{item.description}</p>
                <p className="text-xs text-[#829B96]">{item.amount}</p>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:bg-[#1A3530] hover:text-white text-xs gap-1.5"
            onClick={() => navigate("/accounting/vouchers")}
          >
            {t("dashboard.reviewItems")} {pendingApprovals.length}
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Recent Vouchers and Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Vouchers Table */}
        <div className="lg:col-span-2 bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1E3E37]">
            <h3 className="text-sm font-bold text-white">{t("dashboard.recentVouchers")}</h3>
            <p className="text-xs text-[#829B96]">{t("dashboard.latestTransactions")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E2E8F0]">
              <thead className="bg-[#0B1816]/80 uppercase text-[#829B96] border-b border-[#1E3E37]">
                <tr>
                  <th className="p-3.5">REF</th>
                  <th className="p-3.5">DESCRIPTION</th>
                  <th className="p-3.5">DATE</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E37]">
                {recentVouchers.map((voucher) => (
                  <tr 
                    key={voucher.ref} 
                    className="hover:bg-[#1A3530]/40 transition-colors cursor-pointer"
                    onClick={() => navigate("/accounting/vouchers")}
                  >
                    <td className="p-3.5 font-mono text-[#10B981] font-medium">{voucher.ref}</td>
                    <td className="p-3.5 text-white">{voucher.description}</td>
                    <td className="p-3.5 text-[#829B96]">{voucher.date}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        voucher.status === 'POSTED'
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : voucher.status === 'CLEARED'
                          ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                          : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                      }`}>
                        {voucher.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-white">{voucher.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-[#112421] border border-[#1E3E37] p-4 rounded-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">{t("dashboard.projectProgress")}</h3>
            <p className="text-xs text-[#829B96]">{t("dashboard.unitCompletion")}</p>
          </div>
          <div className="space-y-4">
            {projectProgress.map((project) => (
              <div 
                key={project.name}
                className="cursor-pointer hover:bg-[#1A3530]/20 p-2 rounded-lg transition-colors"
                onClick={() => navigate("/projects")}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{project.name}</p>
                    <p className="text-[11px] text-[#829B96]">{project.type}</p>
                  </div>
                  <span className="text-sm text-[#10B981] font-medium">
                    {project.units} / {project.totalUnits}
                  </span>
                </div>
                <div className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-full h-2">
                  <div 
                    className="h-2 bg-[#10B981] rounded-full"
                    style={{ width: `${(project.units / project.totalUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collect Payment Modal */}
      <CollectPaymentModal
        isOpen={isCollectPaymentModalOpen}
        onClose={() => setIsCollectPaymentModalOpen(false)}
        onSave={handleCollectPaymentSave}
      />

      {/* Debit Voucher Modal */}
      <DebitVoucherModal
        isOpen={isDebitVoucherModalOpen}
        onClose={() => setIsDebitVoucherModalOpen(false)}
        onSave={handleDebitVoucherSave}
      />

      {/* Client Form Modal */}
      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
        onSave={handleClientSave}
      />
    </div>
  );
};

export default Dashboard;
