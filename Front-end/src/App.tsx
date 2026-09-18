import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TopBar from "./components/layout/TopBar";
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import { AccountingProvider } from "./context/AccountingContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/accounting/Accounting";
import Projects from "./pages/projects/Projects";
import Clients from "./pages/clients/Clients";
import Procurement from "./pages/procurement/Procurement";
import Investors from "./pages/investors/Investors";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/SettingsLive";
import Construction from "./pages/construction/Construction";
import HR from "./pages/hr/HR";
import ChartOfAccounts from "./pages/accounting/ChartOfAccounts";
import Vouchers from "./pages/accounting/Vouchers";
import GeneralLedger from "./pages/accounting/GeneralLedger";
import CashBank from "./pages/accounting/CashBank";
import Receivables from "./pages/accounting/Receivables";
import Payables from "./pages/accounting/Payables";
import BankReconciliation from "./pages/accounting/BankReconciliation";
import InvoicesReceipts from "./pages/accounting/InvoicesReceipts";
import TrialBalance from "./pages/accounting/TrialBalance";
import BalanceSheet from "./pages/accounting/BalanceSheet";
import ProfitLoss from "./pages/accounting/ProfitLoss";
import CashFlow from "./pages/accounting/CashFlow";
import TaxConfigurations from "./pages/accounting/TaxConfigurations";
import AllProjects from "./pages/projects/AllProjects";
import PropertyManagement from "./pages/projects/PropertyManagement";
import Progress from "./pages/projects/Progress";
import ProjectsView from "./pages/projects/ProjectsView";
import PropertyAssets from "./pages/projects/PropertyAssets";
import ClientList from "./pages/clients/ClientList";
import Bookings from "./pages/clients/Bookings";
import Installments from "./pages/clients/Installments";
import Collections from "./pages/clients/Collections";
import Handover from "./pages/clients/Handover";
import ClientsView from "./pages/clients/ClientsView";
import PurchaseOrders from "./pages/procurement/PurchaseOrders";
import Vendors from "./pages/procurement/Vendors";
import VendorBills from "./pages/procurement/VendorBills";
import Employees from "./pages/hr/Employees";
import Attendance from "./pages/hr/Attendance";
import Payroll from "./pages/hr/Payroll";
import LoansPerformance from "./pages/hr/LoansPerformance";
import EmployeeProfile from "./pages/hr/EmployeeProfile";
import InvestorProfiles from "./pages/investors/InvestorProfiles";
import EquityShare from "./pages/investors/EquityShare";
import PayoutSchedule from "./pages/investors/PayoutSchedule";
import SalesReport from "./pages/reports/SalesReport";
import SiteRequisitions from "./pages/construction/SiteRequisitions";
import Contractors from "./pages/construction/Contractors";
import WorkOrders from "./pages/construction/WorkOrders";
import RABills from "./pages/construction/RABills";
import ConstructionProgress from "./pages/construction/Progress";
import Equipment from "./pages/construction/Equipment";
import SiteLabor from "./pages/construction/SiteLabor";
import UserRoles from "./pages/settings/UserRoles";
import AccessDenied from "./pages/AccessDenied";
import { canAccessPath, getStoredUser } from "./lib/access";
import { LanguageProvider } from "./context/LanguageContext";
import ThemeProvider from "./context/ThemeContext";

const Layout = () => {
  const location = useLocation();
  const user = getStoredUser();

  if (!canAccessPath(user?.role, location.pathname)) {
    return (
      <div className="min-h-screen bg-background-primary">
        <TopBar />
        <AccessDenied />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <TopBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="page-shell flex-1 lg:ml-64 lg:px-4 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden transition-all duration-300 pb-32 lg:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/accounting" element={<Accounting />} />
            <Route path="/accounting/chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="/accounting/vouchers" element={<Vouchers />} />
            <Route path="/accounting/general-ledger" element={<GeneralLedger />} />
            <Route path="/accounting/cash-bank" element={<CashBank />} />
            <Route path="/accounting/receivables" element={<Receivables />} />
            <Route path="/accounting/payables" element={<Payables />} />
            <Route path="/accounting/bank-reconciliation" element={<BankReconciliation />} />
            <Route path="/accounting/invoices-receipts" element={<InvoicesReceipts />} />
            <Route path="/accounting/trial-balance" element={<TrialBalance />} />
            <Route path="/reports/trial-balance" element={<TrialBalance />} />
            <Route path="/accounting/balance-sheet" element={<BalanceSheet />} />
            <Route path="/reports/balance-sheet" element={<BalanceSheet />} />
            <Route path="/accounting/profit-loss" element={<ProfitLoss />} />
            <Route path="/reports/profit-loss" element={<ProfitLoss />} />
            <Route path="/accounting/cash-flow" element={<CashFlow />} />
            <Route path="/accounting/tax-configurations" element={<TaxConfigurations />} />
            <Route path="/projects" element={<Projects />} />

            <Route path="/projects/all" element={<AllProjects />} />
            <Route path="/projects/property-management" element={<PropertyManagement />} />
            <Route path="/projects/progress" element={<Progress />} />
            <Route path="/projects/view/:id" element={<ProjectsView />} />
            <Route path="/projects/property-assets" element={<PropertyAssets />} />

            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/list" element={<ClientList />} />
            <Route path="/clients/bookings" element={<Bookings />} />
            <Route path="/clients/installments" element={<Installments />} />
            <Route path="/clients/collections" element={<Collections />} />
            <Route path="/clients/handover" element={<Handover />} />
            <Route path="/clients/view/:id" element={<ClientsView />} />
            <Route path="/procurement" element={<Procurement />} />

            <Route path="/procurement/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/procurement/vendors" element={<Vendors />} />
            <Route path="/procurement/vendor-bills" element={<VendorBills />} />

            <Route path="/investors" element={<Investors />} />
            <Route path="/investors/profiles" element={<InvestorProfiles />} />
            <Route path="/investors/equity-share" element={<EquityShare />} />
            <Route path="/investors/payout-schedule" element={<PayoutSchedule />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/sales-report" element={<SalesReport />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/user-roles" element={<UserRoles />} />

            <Route path="/construction" element={<Construction />} />
            <Route path="/construction/site-requisitions" element={<SiteRequisitions />} />
            <Route path="/construction/contractors" element={<Contractors />} />
            <Route path="/construction/work-orders" element={<WorkOrders />} />
            <Route path="/construction/ra-bills" element={<RABills />} />
            <Route path="/construction/progress" element={<ConstructionProgress />} />
            <Route path="/construction/equipment" element={<Equipment />} />
            <Route path="/construction/labor-payroll" element={<SiteLabor />} />

            <Route path="/hr" element={<HR />} />
            <Route path="/hr/employees" element={<Employees />} />
            <Route path="/hr/attendance" element={<Attendance />} />
            <Route path="/hr/payroll" element={<Payroll />} />
            <Route path="/hr/loans-performance" element={<LoansPerformance />} />
            <Route path="/hr/employee-profile/:id" element={<EmployeeProfile />} />
            


          </Routes>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

const ProtectedLayout = () => {
  const hasAccessToken = Boolean(localStorage.getItem("access_token"));
  return hasAccessToken ? <Layout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AccountingProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </Router>
        </AccountingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
