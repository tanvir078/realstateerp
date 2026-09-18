export const mockDashboardData = {
  kpiCards: [
    {
      title: "CASH IN HAND",
      amount: "৳ 1,12,50,000",
      subtext: "Cash + bank balances",
      status: "success",
      statusColor: "#10B981"
    },
    {
      title: "RECEIVABLES",
      amount: "৳ 0",
      subtext: "15 open installments",
      status: "warning",
      statusColor: "#F59E0B"
    },
    {
      title: "PAYABLES",
      amount: "৳ 0",
      subtext: "1 bills to clear",
      status: "danger",
      statusColor: "#EF4444"
    },
    {
      title: "PROJECT COST TO DATE",
      amount: "৳ 16.05 Cr",
      subtext: "21% of budget",
      status: "neutral",
      statusColor: "#FFFFFF"
    }
  ],
  
  cashFlowChart: {
    data: [
      { month: "Jul", inflow: 15, outflow: 20 },
      { month: "Sept", inflow: 25, outflow: 18 },
      { month: "Oct", inflow: 18, outflow: 22 },
      { month: "Dec", inflow: 30, outflow: 25 },
      { month: "Jan", inflow: 22, outflow: 28 },
      { month: "Feb", inflow: 28, outflow: 20 },
      { month: "Mar", inflow: 35, outflow: 30 },
      { month: "Apr", inflow: 40, outflow: 35 }
    ],
    netInflow: "-৳ 13.00 L",
    periods: 8
  },
  
  pendingApprovals: [
    {
      id: 1,
      description: "Site advance for contractor",
      amount: "৳ 5,00,000"
    },
    {
      id: 2,
      description: "Civil work phase 1 invoice",
      amount: "৳ 40,00,000"
    }
  ],
  
  recentVouchers: [
    {
      ref: "PV-0001",
      description: "Test expense via Playwright",
      date: "15 Jun 2025",
      status: "POSTED",
      amount: "৳ 50,000"
    },
    {
      ref: "PV-0002",
      description: "Office rent payment",
      date: "10 Jun 2025",
      status: "POSTED",
      amount: "৳ 75,000"
    },
    {
      ref: "PV-0003",
      description: "Material purchase - steel",
      date: "5 Jun 2025",
      status: "DRAFT",
      amount: "৳ 2,50,000"
    },
    {
      ref: "PV-0004",
      description: "Contractor payment",
      date: "1 Jun 2025",
      status: "POSTED",
      amount: "৳ 1,00,000"
    },
    {
      ref: "PV-0005",
      description: "Utility bills",
      date: "28 May 2025",
      status: "POSTED",
      amount: "৳ 25,000"
    }
  ],
  
  projectProgress: [
    {
      name: "Green Valley Tower",
      type: "residential",
      units: 42,
      totalUnits: 120,
      percentage: 35
    },
    {
      name: "Blue Orchid Residences",
      type: "residential",
      units: 18,
      totalUnits: 80,
      percentage: 22.5
    },
    {
      name: "Landmark Commercial Plaza",
      type: "commercial",
      units: 0,
      totalUnits: 45,
      percentage: 0
    }
  ]
};

export const navigationItems = [
  {
    title: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
    children: []
  },
  {
    title: "Projects & Property",
    icon: "Building2",
    path: "/projects",
    children: [
      { title: "All Projects", path: "/projects/all" },
      { title: "Property Management", path: "/projects/property-management"},
      { title: "Land & Utilities", path: "/projects/property-assets" },
      { title: "Construction Progress", path: "/projects/progress" }
    ]
  },
  {
    title: "Clients & Sales",
    icon: "Users",
    path: "/clients",
    children: [
      { title: "Clients", path: "/clients/list" },
      { title: "Bookings", path: "/clients/bookings" },
      { title: "Installments", path: "/clients/installments" },
      { title: "Collections", path: "/clients/collections" },
      { title: "Handover", path: "/clients/handover" }
    ]
  },
  {
    title: "Accounting & Finance",
    icon: "Calculator",
    path: "/accounting",
    children: [
      { title: "Chart of Accounts", path: "/accounting/chart-of-accounts" },
      { title: "Vouchers", path: "/accounting/vouchers" },
      { title: "Receivables", path: "/accounting/receivables" },
      { title: "Payables", path: "/accounting/payables" },
      { title: "Invoices & Receipts", path: "/accounting/invoices-receipts" },
      { title: "Cash & Bank", path: "/accounting/cash-bank" },
      { title: "Bank Reconciliation", path: "/accounting/bank-reconciliation" },
      { title: "General Ledger", path: "/accounting/general-ledger" },
      { title: "Trial Balance", path: "/accounting/trial-balance" },
      { title: "Profit & Loss", path: "/accounting/profit-loss" },
      { title: "Balance Sheet", path: "/accounting/balance-sheet" },
      { title: "Cash Flow", path: "/accounting/cash-flow" },
      { title: "VAT & TDS Configuration", path: "/accounting/tax-configurations" }
    ]
  },
  {
    title: "Construction & Engineering",
    icon: "HardHat",
    path: "/construction",
    children: [
      { title: "Contractors", path: "/construction/contractors" },
      { title: "Site Requisitions (MRN)", path: "/construction/site-requisitions" },
      { title: "Work Orders", path: "/construction/work-orders" },
      { title: "RA Bills & Approvals", path: "/construction/ra-bills" },
      { title: "Physical Progress & Milestones", path: "/construction/progress" },
      { title: "Site Equipment & Fuel Logs", path: "/construction/equipment" },
      { title: "Site Labor & Daily Wages", path: "/construction/labor-payroll" }
    ]
  },
  {
    title: "HR & Payroll",
    icon: "User",
    path: "/hr",
    children: [
      { title: "Employees", path: "/hr/employees" },
      { title: "Attendance & Leave", path: "/hr/attendance" },
      { title: "Payroll & Payslips", path: "/hr/payroll" },
      { title: "Loans & Performance", path: "/hr/loans-performance" }
    ]
  },
  {
    title: "Procurement & Vendors",
    icon: "ShoppingCart",
    path: "/procurement",
    children: [
      { title: "Vendors", path: "/procurement/vendors" },
      { title: "Purchase Orders", path: "/procurement/purchase-orders" },
      { title: "Vendor Bills", path: "/procurement/vendor-bills" },
    ]
  },
  {
    title: "Investors",
    icon: "TrendingUp",
    path: "/investors",
    children: [
      { title: "Investor Profiles", path: "/investors/profiles" },
      { title: "Equity Share", path: "/investors/equity-share" },
      { title: "Payout Schedule", path: "/investors/payout-schedule" }
    ]
  },
  {
    title: "Reports",
    icon: "FileText",
    path: "/reports",
    children: [
      { title: "Sales Report", path: "/reports/sales-report" }
    ]
  },
  {
    title: "Settings",
    icon: "Settings",
    path: "/settings"
  }
];
