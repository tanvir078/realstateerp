import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "bn";

type TranslationKey =
  | `nav.${string}`
  | "topbar.search"
  | "topbar.english"
  | "topbar.bangla"
  | "topbar.recentSearches"
  | "dashboard.title"
  | "dashboard.exportReport"
  | "dashboard.collectPayment"
  | "dashboard.debitVoucher"
  | "dashboard.addClient"
  | "dashboard.totalRevenue"
  | "dashboard.totalExpenses"
  | "dashboard.netProfit"
  | "dashboard.cashBalance"
  | "dashboard.thisMonthRevenue"
  | "dashboard.thisMonthExpenses"
  | "dashboard.thisMonthProfit"
  | "dashboard.availableCash"
  | "dashboard.netCashFlow"
  | "dashboard.inflowOutflow"
  | "dashboard.inflow"
  | "dashboard.outflow"
  | "dashboard.chartPlaceholder"
  | "dashboard.pendingApprovals"
  | "dashboard.itemsRequiringReview"
  | "dashboard.reviewItems"
  | "dashboard.recentVouchers"
  | "dashboard.latestTransactions"
  | "dashboard.projectProgress"
  | "dashboard.unitCompletion"
  | "coa.title"
  | "coa.export"
  | "coa.addHead"
  | "coa.editHead"
  | "coa.totalAssets"
  | "coa.totalLiabilities"
  | "coa.ytdRevenue"
  | "coa.ytdExpense"
  | "coa.search"
  | "coa.type"
  | "coa.allHeads"
  | "coa.assets"
  | "coa.liabilities"
  | "coa.revenue"
  | "coa.expenses"
  | "coa.accountCode"
  | "coa.accountName"
  | "coa.category"
  | "coa.balance"
  | "coa.status"
  | "coa.actions"
  | "coa.active"
  | "coa.loading"
  | "coa.empty"
  | "coa.retry"
  | "coa.addFirst";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "nav.Dashboard": "Dashboard",
    "nav.Projects & Property": "Projects & Property",
    "nav.Clients & Sales": "Clients & Sales",
    "nav.Accounting & Finance": "Accounting & Finance",
    "nav.Procurement & Vendors": "Procurement & Vendors",
    "nav.Construction & Engineering": "Construction & Engineering",
    "nav.HR & Payroll": "HR & Payroll",
    "nav.Investors": "Investors",
    "nav.Reports": "Reports",
    "nav.Settings": "Settings",
    "nav.All Projects": "All Projects",
    "nav.Property Management": "Property Management",
    "nav.Land & Utilities": "Land & Utilities",
    "nav.Construction Progress": "Construction Progress",
    "nav.Clients": "Clients",
    "nav.Bookings": "Bookings",
    "nav.Installments": "Installments",
    "nav.Collections": "Collections",
    "nav.Handover": "Handover",
    "nav.Chart of Accounts": "Chart of Accounts",
    "nav.Vouchers": "Vouchers",
    "nav.Receivables": "Receivables",
    "nav.Payables": "Payables",
    "nav.Invoices & Receipts": "Invoices & Receipts",
    "nav.Cash & Bank": "Cash & Bank",
    "nav.Bank Reconciliation": "Bank Reconciliation",
    "nav.General Ledger": "General Ledger",
    "nav.Trial Balance": "Trial Balance",
    "nav.Profit & Loss": "Profit & Loss",
    "nav.Balance Sheet": "Balance Sheet",
    "nav.Cash Flow": "Cash Flow",
    "nav.VAT & TDS Configuration": "VAT & TDS Configuration",
    "nav.Site Requisitions (MRN)": "Site Requisitions (MRN)",
    "nav.Contractors": "Contractors",
    "nav.Work Orders": "Work Orders",
    "nav.RA Bills & Approvals": "RA Bills & Approvals",
    "nav.Physical Progress & Milestones": "Physical Progress & Milestones",
    "nav.Site Equipment & Fuel Logs": "Site Equipment & Fuel Logs",
    "nav.Site Labor & Daily Wages": "Site Labor & Daily Wages",
    "nav.Employees": "Employees",
    "nav.Attendance & Leave": "Attendance & Leave",
    "nav.Payroll & Payslips": "Payroll & Payslips",
    "nav.Loans & Performance": "Loans & Performance",
    "nav.Purchase Orders": "Purchase Orders",
    "nav.Vendors": "Vendors",
    "nav.Vendor Bills": "Vendor Bills",
    "nav.Site Advances": "Site Advances",
    "nav.Investor Profiles": "Investor Profiles",
    "nav.Equity Share": "Equity Share",
    "nav.Payout Schedule": "Payout Schedule",
    "nav.Sales Report": "Sales Report",
    "topbar.search": "Search — vouchers, clients, projects... ⌘K",
    "topbar.english": "English",
    "topbar.bangla": "Bangla",
    "topbar.recentSearches": "Recent searches",
    "dashboard.title": "Finance Overview",
    "dashboard.exportReport": "Export Report",
    "dashboard.collectPayment": "Collect Payment",
    "dashboard.debitVoucher": "Debit Voucher",
    "dashboard.addClient": "Add Client",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.totalExpenses": "Total Expenses",
    "dashboard.netProfit": "Net Profit",
    "dashboard.cashBalance": "Cash Balance",
    "dashboard.thisMonthRevenue": "This month revenue",
    "dashboard.thisMonthExpenses": "This month expenses",
    "dashboard.thisMonthProfit": "This month profit",
    "dashboard.availableCash": "Available cash & bank",
    "dashboard.netCashFlow": "Net Cash Flow",
    "dashboard.inflowOutflow": "Inflow vs Outflow trends",
    "dashboard.inflow": "Inflow",
    "dashboard.outflow": "Outflow",
    "dashboard.chartPlaceholder": "Chart data will appear here",
    "dashboard.pendingApprovals": "Pending Approvals",
    "dashboard.itemsRequiringReview": "Items requiring review",
    "dashboard.reviewItems": "Review items",
    "dashboard.recentVouchers": "Recent Vouchers",
    "dashboard.latestTransactions": "Latest financial transactions",
    "dashboard.projectProgress": "Project Progress",
    "dashboard.unitCompletion": "Unit completion status",
    "coa.title": "Chart of Accounts",
    "coa.export": "Export COA",
    "coa.addHead": "Add Account Head",
    "coa.editHead": "Edit Account Head",
    "coa.totalAssets": "Total Assets",
    "coa.totalLiabilities": "Total Liabilities",
    "coa.ytdRevenue": "YTD Revenue",
    "coa.ytdExpense": "YTD Operating Expense",
    "coa.search": "Search account code, title...",
    "coa.type": "Type:",
    "coa.allHeads": "All Heads",
    "coa.assets": "Assets",
    "coa.liabilities": "Liabilities",
    "coa.revenue": "Revenue",
    "coa.expenses": "Expenses",
    "coa.accountCode": "Account Code",
    "coa.accountName": "Account Head Name",
    "coa.category": "Category",
    "coa.balance": "Balance",
    "coa.status": "Status",
    "coa.actions": "Actions",
    "coa.active": "Active",
    "coa.loading": "Loading chart of accounts...",
    "coa.empty": "No chart of accounts found",
    "coa.retry": "Retry",
    "coa.addFirst": "Add First Account",
  },
  bn: {
    "nav.Dashboard": "ড্যাশবোর্ড",
    "nav.Projects & Property": "প্রকল্প ও সম্পত্তি",
    "nav.Clients & Sales": "ক্লায়েন্ট ও বিক্রয়",
    "nav.Accounting & Finance": "হিসাব ও অর্থায়ন",
    "nav.Procurement & Vendors": "ক্রয় ও সরবরাহকারী",
    "nav.Construction & Engineering": "নির্মাণ ও প্রকৌশল",
    "nav.HR & Payroll": "এইচআর ও বেতন",
    "nav.Investors": "বিনিয়োগকারী",
    "nav.Reports": "রিপোর্ট",
    "nav.Settings": "সেটিংস",
    "nav.All Projects": "সকল প্রকল্প",
    "nav.Unit Management": "প্রপার্টি ব্যবস্থাপনা",
    "nav.Land & Utilities": "জমি ও ইউটিলিটি",
    "nav.Construction Progress": "নির্মাণ অগ্রগতি",
    "nav.Clients": "ক্লায়েন্ট",
    "nav.Bookings": "বুকিং",
    "nav.Installments": "কিস্তি",
    "nav.Collections": "আদায়",
    "nav.Handover": "হস্তান্তর",
    "nav.Chart of Accounts": "হিসাবের তালিকা",
    "nav.Vouchers": "ভাউচার",
    "nav.Receivables": "প্রাপ্য",
    "nav.Payables": "দেয়",
    "nav.Invoices & Receipts": "চালান ও রসিদ",
    "nav.Cash & Bank": "নগদ ও ব্যাংক",
    "nav.Bank Reconciliation": "ব্যাংক সমন্বয়",
    "nav.General Ledger": "সাধারণ খতিয়ান",
    "nav.Trial Balance": "রেওয়ামিল",
    "nav.Profit & Loss": "লাভ ও ক্ষতি",
    "nav.Balance Sheet": "আর্থিক অবস্থাপত্র",
    "nav.Cash Flow": "নগদ প্রবাহ",
    "nav.VAT & TDS Configuration": "ভ্যাট ও টিডিএস সেটিংস",
    "nav.Site Requisitions (MRN)": "সাইট চাহিদাপত্র (এমআরএন)",
    "nav.Contractors": "ঠিকাদার",
    "nav.Work Orders": "কাজের আদেশ",
    "nav.RA Bills & Approvals": "আরএ বিল ও অনুমোদন",
    "nav.Physical Progress & Milestones": "নির্মাণ অগ্রগতি ও মাইলস্টোন",
    "nav.Site Equipment & Fuel Logs": "সাইট সরঞ্জাম ও জ্বালানি লগ",
    "nav.Site Labor & Daily Wages": "সাইট শ্রম ও দৈনিক মজুরি",
    "nav.Employees": "কর্মী তালিকা",
    "nav.Attendance & Leave": "উপস্থিতি ও ছুটি",
    "nav.Payroll & Payslips": "বেতন ও পে-স্লিপ",
    "nav.Loans & Performance": "ঋণ ও কর্মদক্ষতা",
    "nav.Purchase Orders": "ক্রয় আদেশ",
    "nav.Vendors": "সরবরাহকারী",
    "nav.Vendor Bills": "সরবরাহকারী বিল",
    "nav.Site Advances": "সাইট অগ্রিম",
    "nav.Investor Profiles": "বিনিয়োগকারী প্রোফাইল",
    "nav.Equity Share": "ইকুইটি শেয়ার",
    "nav.Payout Schedule": "পরিশোধের সময়সূচি",
    "nav.Sales Report": "বিক্রয় রিপোর্ট",
    "topbar.search": "ভাউচার, ক্লায়েন্ট, প্রকল্প খুঁজুন... ⌘K",
    "topbar.english": "ইংরেজি",
    "topbar.bangla": "বাংলা",
    "topbar.recentSearches": "সাম্প্রতিক অনুসন্ধান",
    "dashboard.title": "অর্থায়ন সারসংক্ষেপ",
    "dashboard.exportReport": "রিপোর্ট এক্সপোর্ট",
    "dashboard.collectPayment": "পেমেন্ট গ্রহণ",
    "dashboard.debitVoucher": "ডেবিট ভাউচার",
    "dashboard.addClient": "ক্লায়েন্ট যোগ করুন",
    "dashboard.totalRevenue": "মোট আয়",
    "dashboard.totalExpenses": "মোট ব্যয়",
    "dashboard.netProfit": "নিট লাভ",
    "dashboard.cashBalance": "নগদ স্থিতি",
    "dashboard.thisMonthRevenue": "এই মাসের আয়",
    "dashboard.thisMonthExpenses": "এই মাসের ব্যয়",
    "dashboard.thisMonthProfit": "এই মাসের লাভ",
    "dashboard.availableCash": "উপলব্ধ নগদ ও ব্যাংক",
    "dashboard.netCashFlow": "নিট নগদ প্রবাহ",
    "dashboard.inflowOutflow": "আয় ও ব্যয়ের প্রবণতা",
    "dashboard.inflow": "আয়",
    "dashboard.outflow": "ব্যয়",
    "dashboard.chartPlaceholder": "চার্টের তথ্য এখানে দেখা যাবে",
    "dashboard.pendingApprovals": "অনুমোদনের অপেক্ষায়",
    "dashboard.itemsRequiringReview": "পর্যালোচনার জন্য আইটেম",
    "dashboard.reviewItems": "আইটেম পর্যালোচনা",
    "dashboard.recentVouchers": "সাম্প্রতিক ভাউচার",
    "dashboard.latestTransactions": "সাম্প্রতিক আর্থিক লেনদেন",
    "dashboard.projectProgress": "প্রকল্পের অগ্রগতি",
    "dashboard.unitCompletion": "ইউনিট সম্পন্নের অবস্থা",
    "coa.title": "হিসাবের তালিকা",
    "coa.export": "সিওএ এক্সপোর্ট",
    "coa.addHead": "হিসাবের হেড যোগ করুন",
    "coa.editHead": "হিসাবের হেড সম্পাদনা",
    "coa.totalAssets": "মোট সম্পদ",
    "coa.totalLiabilities": "মোট দায়",
    "coa.ytdRevenue": "এ বছর মোট আয়",
    "coa.ytdExpense": "এ বছর পরিচালন ব্যয়",
    "coa.search": "হিসাব কোড বা নাম খুঁজুন...",
    "coa.type": "ধরন:",
    "coa.allHeads": "সব হেড",
    "coa.assets": "সম্পদ",
    "coa.liabilities": "দায়",
    "coa.revenue": "আয়",
    "coa.expenses": "ব্যয়",
    "coa.accountCode": "হিসাব কোড",
    "coa.accountName": "হিসাবের নাম",
    "coa.category": "ক্যাটাগরি",
    "coa.balance": "ব্যালেন্স",
    "coa.status": "অবস্থা",
    "coa.actions": "অ্যাকশন",
    "coa.active": "সক্রিয়",
    "coa.loading": "হিসাবের তালিকা লোড হচ্ছে...",
    "coa.empty": "কোনো হিসাব পাওয়া যায়নি",
    "coa.retry": "আবার চেষ্টা করুন",
    "coa.addFirst": "প্রথম হিসাব যোগ করুন",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return localStorage.getItem("slbl_language") === "bn" ? "bn" : "en";
  });

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("slbl_language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  const t = (key: TranslationKey) => translations[language][key] ?? translations.en[key] ?? key;

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
