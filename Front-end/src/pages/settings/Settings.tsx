import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Settings, Building2, Users, Shield, Palette, Bell, 
  Database, FileText, Save, RefreshCw, 
  Calculator, Printer, LayoutGrid, Key, Plus, X, Check,
  Layers, DollarSign, Workflow, Hash
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    modules: string[];
    actions: string[];
    dataAccess: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  createdAt: string;
  createdBy: string;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"COMPANY" | "USERS" | "ROLES" | "SECURITY" | "ACCOUNTING" | "PRINT_TEMPLATES" | "FORM_CUSTOMIZATION" | "APPEARANCE" | "NOTIFICATIONS" | "SYSTEM" | "AUDIT">("COMPANY");
  const [hasChanges, setHasChanges] = useState(false);
  const [userFormError, setUserFormError] = useState("");
  
  // Roles state
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access including user management",
      permissions: {
        modules: ["All"],
        actions: ["Create", "Read", "Update", "Delete", "Approve", "Reject"],
        dataAccess: "All"
      }
    },
    {
      id: "2",
      name: "Admin",
      description: "All module access except user management",
      permissions: {
        modules: ["Projects", "Clients", "Accounting", "Procurement", "HR", "Reports"],
        actions: ["Create", "Read", "Update", "Delete", "Approve", "Reject"],
        dataAccess: "All"
      }
    },
    {
      id: "3",
      name: "Accounting Manager",
      description: "Accounting module access with approval rights",
      permissions: {
        modules: ["Accounting", "Reports"],
        actions: ["Create", "Read", "Update", "Approve", "Reject"],
        dataAccess: "All"
      }
    },
    {
      id: "4",
      name: "Accountant",
      description: "Accounting entry and view access",
      permissions: {
        modules: ["Accounting", "Reports"],
        actions: ["Create", "Read", "Update"],
        dataAccess: "All"
      }
    },
    {
      id: "5",
      name: "Cashier",
      description: "Cash/Bank transaction access",
      permissions: {
        modules: ["Accounting"],
        actions: ["Create", "Read"],
        dataAccess: "Limited"
      }
    },
    {
      id: "6",
      name: "Viewer",
      description: "Read-only access to all modules",
      permissions: {
        modules: ["All"],
        actions: ["Read"],
        dataAccess: "All"
      }
    }
  ]);
  
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    modules: [] as string[],
    actions: [] as string[],
    dataAccess: "All"
  });

  // Users state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@sobhagya.com",
      password: "••••••••",
      role: "Super Admin",
      status: "Active",
      lastLogin: "08 Sep 2026, 10:30 AM",
      createdAt: "01 Jan 2024",
      createdBy: "System"
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@sobhagya.com",
      password: "••••••••",
      role: "Accounting Manager",
      status: "Active",
      lastLogin: "07 Sep 2026, 3:45 PM",
      createdAt: "15 Feb 2024",
      createdBy: "Admin User"
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@sobhagya.com",
      password: "••••••••",
      role: "Accountant",
      status: "Active",
      lastLogin: "06 Sep 2026, 11:20 AM",
      createdAt: "20 Mar 2024",
      createdBy: "Admin User"
    }
  ]);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Accountant",
    status: "Active" as "Active" | "Inactive" | "Suspended"
  });

  // Accounting settings state
  const [showCOAModal, setShowCOAModal] = useState(false);
  const [showVoucherTypeModal, setShowVoucherTypeModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showNumberingModal, setShowNumberingModal] = useState(false);
  
  const [chartOfAccounts] = useState([
    { id: "1", code: "1000", name: "Assets", type: "Group", parent: null },
    { id: "2", code: "1100", name: "Current Assets", type: "Group", parent: "1000" },
    { id: "3", code: "1110", name: "Cash", type: "Ledger", parent: "1100" },
    { id: "4", code: "1120", name: "Bank", type: "Ledger", parent: "1100" },
    { id: "5", code: "2000", name: "Liabilities", type: "Group", parent: null },
    { id: "6", code: "2100", name: "Current Liabilities", type: "Group", parent: "2000" },
    { id: "7", code: "2110", name: "Accounts Payable", type: "Ledger", parent: "2100" },
    { id: "8", code: "3000", name: "Equity", type: "Group", parent: null },
    { id: "9", code: "3100", name: "Capital", type: "Ledger", parent: "3000" },
    { id: "10", code: "4000", name: "Income", type: "Group", parent: null },
    { id: "11", code: "4100", name: "Sales", type: "Ledger", parent: "4000" },
    { id: "12", code: "5000", name: "Expenses", type: "Group", parent: null },
    { id: "13", code: "5100", name: "Office Expenses", type: "Ledger", parent: "5000" }
  ]);
  
  const [voucherTypes, setVoucherTypes] = useState([
    { id: "1", name: "Journal Voucher", code: "JV", prefix: "JV-", enabled: true },
    { id: "2", name: "Payment Voucher", code: "PV", prefix: "PV-", enabled: true },
    { id: "3", name: "Receipt Voucher", code: "RV", prefix: "RV-", enabled: true },
    { id: "4", name: "Contra Voucher", code: "CV", prefix: "CV-", enabled: true },
    { id: "5", name: "Sales Voucher", code: "SV", prefix: "SV-", enabled: true },
    { id: "6", name: "Purchase Voucher", code: "PUV", prefix: "PUV-", enabled: true }
  ]);
  
  const [taxSettings, setTaxSettings] = useState({
    vatRate: 15,
    taxDeductionAtSource: 10,
    enableTax: true,
    taxAccount: "2110"
  });
  
  const [budgets] = useState([
    { id: "1", account: "5100", accountName: "Office Expenses", annualBudget: 500000, usedAmount: 250000, remaining: 250000 },
    { id: "2", account: "5110", accountName: "Salaries", annualBudget: 2000000, usedAmount: 1200000, remaining: 800000 }
  ]);
  
  const [approvalWorkflow] = useState([
    { id: "1", voucherType: "Journal Voucher", amount: 0, approver: "Self", level: 1 },
    { id: "2", voucherType: "Payment Voucher", amount: 50000, approver: "Accounting Manager", level: 1 },
    { id: "3", voucherType: "Payment Voucher", amount: 200000, approver: "Admin", level: 2 },
    { id: "4", voucherType: "Receipt Voucher", amount: 0, approver: "Self", level: 1 }
  ]);
  
  const [numberingPattern, setNumberingPattern] = useState({
    journal: "JV-{YYYY}-{MM}-{####}",
    payment: "PV-{YYYY}-{MM}-{####}",
    receipt: "RV-{YYYY}-{MM}-{####}",
    contra: "CV-{YYYY}-{MM}-{####}",
    sales: "SV-{YYYY}-{MM}-{####}",
    purchase: "PUV-{YYYY}-{MM}-{####}"
  });

  // Print templates state
  const [showInvoiceTemplateModal, setShowInvoiceTemplateModal] = useState(false);
  const [showVoucherTemplateModal, setShowVoucherTemplateModal] = useState(false);
  const [showReceiptTemplateModal, setShowReceiptTemplateModal] = useState(false);
  
  const [invoiceTemplate, setInvoiceTemplate] = useState({
    logoPosition: "top-left",
    logoSize: "medium",
    showLogo: true,
    showCompanyHeader: true,
    showTaxId: true,
    showLicenseNo: true,
    showAddress: true,
    showContact: true,
    invoiceTitle: "INVOICE",
    titleFontSize: "18",
    showInvoiceNumber: true,
    showInvoiceDate: true,
    showDueDate: true,
    showClientInfo: true,
    showItemsTable: true,
    showDescription: true,
    showQuantity: true,
    showUnitPrice: true,
    showAmount: true,
    showSubtotal: true,
    showTax: true,
    showDiscount: true,
    showGrandTotal: true,
    showPaymentTerms: true,
    showNotes: true,
    showSignature: true,
    showTerms: true,
    footerText: "Thank you for your business!",
    pageSize: "A4",
    watermark: "",
    fontFamily: "Arial"
  });
  
  const [voucherTemplate, setVoucherTemplate] = useState({
    logoPosition: "top-left",
    logoSize: "medium",
    showLogo: true,
    showCompanyHeader: true,
    voucherTitle: "VOUCHER",
    titleFontSize: "16",
    showVoucherNumber: true,
    showVoucherDate: true,
    showVoucherType: true,
    showDebitCreditTable: true,
    showNarration: true,
    showPreparedBy: true,
    showCheckedBy: true,
    showApprovedBy: true,
    showTotalAmount: true,
    showAmountInWords: true,
    footerText: "This is a computer generated voucher.",
    pageSize: "A4",
    fontFamily: "Arial"
  });
  
  const [receiptTemplate, setReceiptTemplate] = useState({
    logoPosition: "top-center",
    logoSize: "medium",
    showLogo: true,
    showCompanyHeader: true,
    receiptTitle: "MONEY RECEIPT",
    titleFontSize: "18",
    showReceiptNumber: true,
    showReceiptDate: true,
    showReceivedFrom: true,
    showAmount: true,
    showAmountInWords: true,
    showPaymentMode: true,
    showBankDetails: true,
    showChequeNumber: true,
    showSignature: true,
    showAuthority: true,
    footerText: "This receipt is valid for payment.",
    pageSize: "A5",
    fontFamily: "Arial"
  });

  // Form customization state
  const [showVoucherFormModal, setShowVoucherFormModal] = useState(false);
  const [showInvoiceFormModal, setShowInvoiceFormModal] = useState(false);
  const [showPaymentFormModal, setShowPaymentFormModal] = useState(false);
  
  const [voucherFormFields, setVoucherFormFields] = useState([
    { id: "voucherType", label: "Voucher Type", type: "select", required: true, visible: true, order: 1 },
    { id: "voucherNumber", label: "Voucher Number", type: "text", required: true, visible: true, order: 2 },
    { id: "voucherDate", label: "Voucher Date", type: "date", required: true, visible: true, order: 3 },
    { id: "narration", label: "Narration", type: "textarea", required: true, visible: true, order: 4 },
    { id: "debitAccount", label: "Debit Account", type: "select", required: true, visible: true, order: 5 },
    { id: "creditAccount", label: "Credit Account", type: "select", required: true, visible: true, order: 6 },
    { id: "amount", label: "Amount", type: "number", required: true, visible: true, order: 7 },
    { id: "reference", label: "Reference", type: "text", required: false, visible: true, order: 8 },
    { id: "costCenter", label: "Cost Center", type: "select", required: false, visible: false, order: 9 },
    { id: "project", label: "Project", type: "select", required: false, visible: false, order: 10 }
  ]);
  
  const [invoiceFormFields, setInvoiceFormFields] = useState([
    { id: "invoiceNumber", label: "Invoice Number", type: "text", required: true, visible: true, order: 1 },
    { id: "invoiceDate", label: "Invoice Date", type: "date", required: true, visible: true, order: 2 },
    { id: "dueDate", label: "Due Date", type: "date", required: true, visible: true, order: 3 },
    { id: "client", label: "Client", type: "select", required: true, visible: true, order: 4 },
    { id: "project", label: "Project", type: "select", required: true, visible: true, order: 5 },
    { id: "items", label: "Items Table", type: "table", required: true, visible: true, order: 6 },
    { id: "description", label: "Description", type: "textarea", required: false, visible: true, order: 7 },
    { id: "taxRate", label: "Tax Rate (%)", type: "number", required: false, visible: true, order: 8 },
    { id: "discount", label: "Discount", type: "number", required: false, visible: true, order: 9 },
    { id: "paymentTerms", label: "Payment Terms", type: "select", required: false, visible: true, order: 10 },
    { id: "notes", label: "Notes", type: "textarea", required: false, visible: false, order: 11 }
  ]);
  
  const [paymentFormFields, setPaymentFormFields] = useState([
    { id: "paymentDate", label: "Payment Date", type: "date", required: true, visible: true, order: 1 },
    { id: "paymentMode", label: "Payment Mode", type: "select", required: true, visible: true, order: 2 },
    { id: "amount", label: "Amount", type: "number", required: true, visible: true, order: 3 },
    { id: "client", label: "Client", type: "select", required: true, visible: true, order: 4 },
    { id: "invoice", label: "Invoice Reference", type: "select", required: false, visible: true, order: 5 },
    { id: "bankAccount", label: "Bank Account", type: "select", required: false, visible: true, order: 6 },
    { id: "chequeNumber", label: "Cheque Number", type: "text", required: false, visible: false, order: 7 },
    { id: "reference", label: "Reference", type: "text", required: false, visible: true, order: 8 },
    { id: "narration", label: "Narration", type: "textarea", required: false, visible: false, order: 9 }
  ]);

  const tabs = [
    { id: "COMPANY" as const, label: "Company", icon: Building2, description: "Company profile, business settings" },
    { id: "USERS" as const, label: "Users", icon: Users, description: "User management (admin-only)" },
    { id: "ROLES" as const, label: "Roles", icon: Key, description: "Role & permission management" },
    { id: "SECURITY" as const, label: "Security", icon: Shield, description: "Password policies, session" },
    { id: "ACCOUNTING" as const, label: "Accounting", icon: Calculator, description: "COA, vouchers, tax, approval" },
    { id: "PRINT_TEMPLATES" as const, label: "Print Templates", icon: Printer, description: "Invoice, voucher, receipt" },
    { id: "FORM_CUSTOMIZATION" as const, label: "Form Customization", icon: LayoutGrid, description: "Form fields, validation" },
    { id: "APPEARANCE" as const, label: "Appearance", icon: Palette, description: "Theme, UI customization" },
    { id: "NOTIFICATIONS" as const, label: "Notifications", icon: Bell, description: "Email, SMS, alerts" },
    { id: "SYSTEM" as const, label: "System", icon: Database, description: "Backup, restore, logs" },
    { id: "AUDIT" as const, label: "Audit Logs", icon: FileText, description: "Activity tracking" }
  ];

  const handleSave = () => {
    console.log("Save settings for tab:", activeTab);
    setHasChanges(false);
    // TODO: Implement save logic
  };

  const handleReset = () => {
    console.log("Reset settings for tab:", activeTab);
    setHasChanges(false);
    // TODO: Implement reset logic
  };

  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      {userFormError && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{userFormError}</p>}
      
      {/* Page Header */}
      <div className="p-4 space-y-3 pb-2 border-b border-[#1E3E37]">
        <div className="flex items-center gap-2 text-xs text-[#829B96]">
          <Settings className="h-3.5 w-3.5" />
          <span>Dashboard</span>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Settings</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
            <p className="text-xs text-[#829B96] mt-0.5">
              Configure your ERP system settings and preferences
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs gap-1.5"
              onClick={handleReset}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button 
              size="sm" 
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#112421] border border-[#1E3E37] rounded-xl overflow-hidden">
        <div className="flex border-b border-[#1E3E37] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#10B981]/10 text-[#10B981] border-b-2 border-[#10B981]"
                  : "text-[#829B96] hover:text-white hover:bg-[#1A3530]/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "COMPANY" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Company & Business Settings</h2>
                  <p className="text-xs text-[#829B96]">Configure company profile, license, and business information</p>
                </div>
              </div>

              {/* Company Logo */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Company Logo</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-[#112421] border border-[#1E3E37] flex items-center justify-center">
                    <span className="text-xs text-[#829B96]">Logo</span>
                  </div>
                  <div className="flex-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                    >
                      Upload New Logo
                    </Button>
                    <p className="text-xs text-[#829B96] mt-2">Recommended: PNG or SVG, max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Company Name</label>
                    <input
                      type="text"
                      defaultValue="Sobhagya Developers Ltd"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Trade License Number</label>
                    <input
                      type="text"
                      defaultValue="DL-123456789"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Tax ID / VAT Registration</label>
                    <input
                      type="text"
                      defaultValue="TIN-1234567890"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Business Type</label>
                    <select
                      defaultValue="real_estate"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="real_estate">Real Estate Developer</option>
                      <option value="construction">Construction Company</option>
                      <option value="trading">Trading Company</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="info@sobhagya.com"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Phone</label>
                    <input
                      type="text"
                      defaultValue="+880 1711-223344"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Website</label>
                    <input
                      type="url"
                      defaultValue="https://www.sobhagya.com"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Social Media (LinkedIn)</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/..."
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#829B96] mb-1">Address</label>
                  <textarea
                    defaultValue="Dhanmondi, Dhaka, Bangladesh"
                    rows={2}
                    className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981] resize-none"
                    onChange={() => setHasChanges(true)}
                  />
                </div>
              </div>

              {/* Financial Settings */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Financial Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Financial Year Start</label>
                    <input
                      type="date"
                      defaultValue="2024-07-01"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Default Currency</label>
                    <select
                      defaultValue="BDT"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="BDT">Bangladeshi Taka (৳)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Timezone</label>
                    <select
                      defaultValue="Asia/Dhaka"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                      <option value="UTC">UTC (UTC+0)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Date Format</label>
                    <select
                      defaultValue="DD/MM/YYYY"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Number Format</label>
                    <select
                      defaultValue="123,456.78"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="123,456.78">1,234.56 (US Format)</option>
                      <option value="123.456,78">1.234,56 (European)</option>
                      <option value="123456.78">123456.78 (No Separator)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Decimal Places</label>
                    <select
                      defaultValue="2"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="0">0 (Whole Numbers)</option>
                      <option value="2">2 (Standard)</option>
                      <option value="4">4 (High Precision)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Bank Accounts</h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Bank Account
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1E3E37]">
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Bank Name</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Account Number</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Account Type</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Branch</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Default</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-white">Dutch-Bangla Bank</td>
                        <td className="py-2 px-3 text-[#829B96]">1234567890</td>
                        <td className="py-2 px-3 text-[#829B96]">Current</td>
                        <td className="py-2 px-3 text-[#829B96]">Dhanmondi Branch</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-[#10B981]">✓</span>
                        </td>
                        <td className="py-2 px-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 text-xs px-2 py-1"
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-white">City Bank</td>
                        <td className="py-2 px-3 text-[#829B96]">0987654321</td>
                        <td className="py-2 px-3 text-[#829B96]">Savings</td>
                        <td className="py-2 px-3 text-[#829B96]">Gulshan Branch</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-[#829B96]">-</span>
                        </td>
                        <td className="py-2 px-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 text-xs px-2 py-1"
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Company Registration Date</label>
                    <input
                      type="date"
                      defaultValue="2010-01-15"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Number of Employees</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Industry</label>
                    <select
                      defaultValue="real_estate"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="real_estate">Real Estate</option>
                      <option value="construction">Construction</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="services">Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Company Size</label>
                    <select
                      defaultValue="medium"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="small">Small (1-50)</option>
                      <option value="medium">Medium (51-250)</option>
                      <option value="large">Large (251+)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#829B96] mb-1">About Company</label>
                  <textarea
                    defaultValue="Sobhagya Developers Ltd is a leading real estate development company specializing in residential and commercial properties."
                    rows={3}
                    className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981] resize-none"
                    onChange={() => setHasChanges(true)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "USERS" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">User Management</h2>
                  <p className="text-xs text-[#829B96]">Admin-only user creation and management</p>
                </div>
              </div>

              {/* User List */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Users ({users.length})</h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
                    onClick={() => setShowCreateUserModal(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add User (Admin Only)
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1E3E37]">
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Name</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Email</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Role</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Status</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Last Login</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Created By</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-[#1E3E37]">
                          <td className="py-2 px-3 text-white font-medium">{user.name}</td>
                          <td className="py-2 px-3 text-[#829B96]">{user.email}</td>
                          <td className="py-2 px-3 text-[#829B96]">{user.role}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.status === "Active" 
                                ? "bg-[#10B981]/10 text-[#10B981]" 
                                : user.status === "Inactive"
                                ? "bg-amber-400/10 text-amber-400"
                                : "bg-rose-400/10 text-rose-400"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[#829B96]">{user.lastLogin}</td>
                          <td className="py-2 px-3 text-[#829B96]">{user.createdBy}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs px-2 py-1"
                                onClick={() => {
                                  setNewUser({
                                    name: user.name,
                                    email: user.email,
                                    password: "",
                                    role: user.role,
                                    status: user.status
                                  });
                                  setShowCreateUserModal(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 text-xs px-2 py-1"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                                    setUsers(users.filter(u => u.id !== user.id));
                                    setHasChanges(true);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create/Edit User Modal */}
              {showCreateUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        {newUser.name ? "Edit User" : "Create New User"}
                      </h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setShowCreateUserModal(false);
                          setNewUser({
                            name: "",
                            email: "",
                            password: "",
                            role: "Accountant",
                            status: "Active"
                          });
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Full Name</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Email Address</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                          placeholder="user@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Password {newUser.name ? "(leave blank to keep current)" : ""}</label>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                          placeholder="Enter password"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Status</label>
                        <select
                          value={newUser.status}
                          onChange={(e) => setNewUser({...newUser, status: e.target.value as "Active" | "Inactive" | "Suspended"})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setShowCreateUserModal(false);
                          setNewUser({
                            name: "",
                            email: "",
                            password: "",
                            role: "Accountant",
                            status: "Active"
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          if (newUser.name && newUser.email && (newUser.password || newUser.email)) {
                            if (users.find(u => u.email === newUser.email && u.name !== newUser.name)) {
                              setUserFormError("Email already exists.");
                              return;
                            }
                            
                            if (users.find(u => u.name === newUser.name)) {
                              // Edit existing user
                              setUsers(users.map(u => 
                                u.name === newUser.name 
                                  ? {
                                      ...u,
                                      name: newUser.name,
                                      email: newUser.email,
                                      password: newUser.password || u.password,
                                      role: newUser.role,
                                      status: newUser.status
                                    }
                                  : u
                              ));
                            } else {
                              // Create new user
                              setUsers([
                                ...users,
                                {
                                  id: Date.now().toString(),
                                  name: newUser.name,
                                  email: newUser.email,
                                  password: newUser.password,
                                  role: newUser.role,
                                  status: newUser.status,
                                  lastLogin: "Never",
                                  createdAt: new Date().toLocaleDateString(),
                                  createdBy: "Admin User"
                                }
                              ]);
                            }
                            setShowCreateUserModal(false);
                            setNewUser({
                              name: "",
                              email: "",
                              password: "",
                              role: "Accountant",
                              status: "Active"
                            });
                            setHasChanges(true);
                          } else {
                            setUserFormError("Please fill in all required fields.");
                          }
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save User
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "ROLES" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Role & Permission Management</h2>
                  <p className="text-xs text-[#829B96]">Configure accounting staff roles and permissions</p>
                </div>
              </div>

              {!showPermissionMatrix ? (
                <>
                  {/* Role List */}
                  <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white">Roles</h3>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
                        onClick={() => setShowCreateRoleModal(true)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Create Role
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {roles.map((role) => (
                        <div key={role.id} className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3 flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-white">{role.name}</h4>
                              <span className="text-xs text-[#829B96]">({role.permissions.modules.length} modules)</span>
                            </div>
                            <p className="text-xs text-[#829B96] mt-1">{role.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                              onClick={() => {
                                setNewRole({
                                  name: role.name,
                                  description: role.description,
                                  modules: role.permissions.modules,
                                  actions: role.permissions.actions,
                                  dataAccess: role.permissions.dataAccess
                                });
                                setShowCreateRoleModal(true);
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Permission Matrix Button */}
                  <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                      onClick={() => setShowPermissionMatrix(true)}
                    >
                      <Key className="h-3.5 w-3.5 mr-1.5" />
                      View Permission Matrix
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Permission Matrix */}
                  <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white">Permission Matrix</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowPermissionMatrix(false)}
                      >
                        <X className="h-3.5 w-3.5 mr-1.5" />
                        Close
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[#1E3E37]">
                            <th className="text-left py-2 px-3 text-[#829B96] font-medium">Role</th>
                            <th className="text-left py-2 px-3 text-[#829B96] font-medium">Modules</th>
                            <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                            <th className="text-left py-2 px-3 text-[#829B96] font-medium">Data Access</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roles.map((role) => (
                            <tr key={role.id} className="border-b border-[#1E3E37]">
                              <td className="py-2 px-3 text-white font-medium">{role.name}</td>
                              <td className="py-2 px-3 text-[#829B96]">
                                {role.permissions.modules.join(", ")}
                              </td>
                              <td className="py-2 px-3 text-[#829B96]">
                                {role.permissions.actions.join(", ")}
                              </td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  role.permissions.dataAccess === "All" 
                                    ? "bg-[#10B981]/10 text-[#10B981]" 
                                    : "bg-amber-400/10 text-amber-400"
                                }`}>
                                  {role.permissions.dataAccess}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Create/Edit Role Modal */}
              {showCreateRoleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        {newRole.name ? "Edit Role" : "Create New Role"}
                      </h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setShowCreateRoleModal(false);
                          setNewRole({
                            name: "",
                            description: "",
                            modules: [],
                            actions: [],
                            dataAccess: "All"
                          });
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Role Name</label>
                        <input
                          type="text"
                          value={newRole.name}
                          onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                          placeholder="e.g., Senior Accountant"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Description</label>
                        <textarea
                          value={newRole.description}
                          onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                          rows={2}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981] resize-none"
                          placeholder="Role description"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-2">Module Access</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Projects", "Clients", "Accounting", "Procurement", "HR", "Reports", "Settings"].map((module) => (
                            <label key={module} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newRole.modules.includes(module) || newRole.modules.includes("All")}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewRole({
                                      ...newRole,
                                      modules: [...newRole.modules, module]
                                    });
                                  } else {
                                    setNewRole({
                                      ...newRole,
                                      modules: newRole.modules.filter(m => m !== module)
                                    });
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {module}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-2">Action Permissions</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Create", "Read", "Update", "Delete", "Approve", "Reject"].map((action) => (
                            <label key={action} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newRole.actions.includes(action)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewRole({
                                      ...newRole,
                                      actions: [...newRole.actions, action]
                                    });
                                  } else {
                                    setNewRole({
                                      ...newRole,
                                      actions: newRole.actions.filter(a => a !== action)
                                    });
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {action}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-2">Data Access Level</label>
                        <select
                          value={newRole.dataAccess}
                          onChange={(e) => setNewRole({...newRole, dataAccess: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        >
                          <option value="All">All Data</option>
                          <option value="Limited">Limited Data</option>
                          <option value="Own">Own Data Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setShowCreateRoleModal(false);
                          setNewRole({
                            name: "",
                            description: "",
                            modules: [],
                            actions: [],
                            dataAccess: "All"
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          if (newRole.name) {
                            if (roles.find(r => r.name === newRole.name)) {
                              // Edit existing role
                              setRoles(roles.map(r => 
                                r.name === newRole.name 
                                  ? {
                                      ...r,
                                      name: newRole.name,
                                      description: newRole.description,
                                      permissions: {
                                        modules: newRole.modules,
                                        actions: newRole.actions,
                                        dataAccess: newRole.dataAccess
                                      }
                                    }
                                  : r
                              ));
                            } else {
                              // Create new role
                              setRoles([
                                ...roles,
                                {
                                  id: Date.now().toString(),
                                  name: newRole.name,
                                  description: newRole.description,
                                  permissions: {
                                    modules: newRole.modules,
                                    actions: newRole.actions,
                                    dataAccess: newRole.dataAccess
                                  }
                                }
                              ]);
                            }
                            setShowCreateRoleModal(false);
                            setNewRole({
                              name: "",
                              description: "",
                              modules: [],
                              actions: [],
                              dataAccess: "All"
                            });
                            setHasChanges(true);
                          }
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save Role
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "SECURITY" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-rose-400/10 text-rose-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Security Settings</h2>
                  <p className="text-xs text-[#829B96]">Configure password policies and session management</p>
                </div>
              </div>

              {/* Password Policy */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Minimum Password Length</label>
                    <select
                      defaultValue="8"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="6">6 characters</option>
                      <option value="8">8 characters</option>
                      <option value="12">12 characters</option>
                      <option value="16">16 characters</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Password Expiry (Days)</label>
                    <select
                      defaultValue="90"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Require uppercase letters
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Require lowercase letters
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Require numbers
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Require special characters
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Prevent password reuse (last 5 passwords)
                  </label>
                </div>
              </div>

              {/* Session Management */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Session Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Session Timeout</label>
                    <select
                      defaultValue="30"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="480">8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Max Concurrent Sessions</label>
                    <select
                      defaultValue="3"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="1">1 session</option>
                      <option value="3">3 sessions</option>
                      <option value="5">5 sessions</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Auto-logout on idle
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Remember device (30 days)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Notify on new login
                  </label>
                </div>
              </div>

              {/* Login Security */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Login Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Failed Login Lockout</label>
                    <select
                      defaultValue="5"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="3">3 attempts</option>
                      <option value="5">5 attempts</option>
                      <option value="10">10 attempts</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Lockout Duration</label>
                    <select
                      defaultValue="30"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="1440">24 hours</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Two-Factor Authentication (2FA) for admins
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    IP Whitelist (restrict access by IP)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    CAPTCHA on login
                  </label>
                </div>
              </div>

              {/* Access Control */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Access Control</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Allow users to change their own password
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Require admin approval for password reset
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Log all failed login attempts
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Log all password changes
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ACCOUNTING" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Accounting Settings</h2>
                  <p className="text-xs text-[#829B96]">COA, vouchers, tax, approval workflow</p>
                </div>
              </div>

              {/* Chart of Accounts */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#10B981]" />
                    Chart of Accounts
                  </h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
                    onClick={() => setShowCOAModal(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Account
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1E3E37]">
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Code</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Name</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Type</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Parent</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartOfAccounts.map((account) => (
                        <tr key={account.id} className="border-b border-[#1E3E37]">
                          <td className="py-2 px-3 text-white font-mono">{account.code}</td>
                          <td className="py-2 px-3 text-white">{account.name}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              account.type === "Group" 
                                ? "bg-purple-400/10 text-purple-400" 
                                : "bg-sky-400/10 text-sky-400"
                            }`}>
                              {account.type}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[#829B96]">{account.parent || "-"}</td>
                          <td className="py-2 px-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs px-2 py-1"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Voucher Types */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-sky-400" />
                    Voucher Types
                  </h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
                    onClick={() => setShowVoucherTypeModal(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Voucher Type
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {voucherTypes.map((voucher) => (
                    <div key={voucher.id} className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{voucher.name}</span>
                          <span className="text-xs text-[#829B96]">({voucher.code})</span>
                        </div>
                        <p className="text-xs text-[#829B96] mt-1">Prefix: {voucher.prefix}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={voucher.enabled}
                            onChange={() => {
                              setVoucherTypes(voucherTypes.map(v => 
                                v.id === voucher.id ? {...v, enabled: !v.enabled} : v
                              ));
                              setHasChanges(true);
                            }}
                          />
                          <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Configuration */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-400" />
                    Tax Configuration
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                    onClick={() => setShowTaxModal(true)}
                  >
                    Configure
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between py-2 border-b border-[#1E3E37]">
                    <div>
                      <p className="text-sm text-white font-medium">VAT Rate</p>
                      <p className="text-xs text-[#829B96]">Current VAT percentage</p>
                    </div>
                    <span className="text-lg font-bold text-[#10B981]">{taxSettings.vatRate}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#1E3E37]">
                    <div>
                      <p className="text-sm text-white font-medium">TDS Rate</p>
                      <p className="text-xs text-[#829B96]">Tax deduction at source</p>
                    </div>
                    <span className="text-lg font-bold text-amber-400">{taxSettings.taxDeductionAtSource}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-white font-medium">Tax Status</p>
                      <p className="text-xs text-[#829B96]">Enable tax calculation</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      taxSettings.enableTax 
                        ? "bg-[#10B981]/10 text-[#10B981]" 
                        : "bg-rose-400/10 text-rose-400"
                    }`}>
                      {taxSettings.enableTax ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Budget Setup */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-400" />
                    Budget Setup
                  </h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
                    onClick={() => setShowBudgetModal(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Budget
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1E3E37]">
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Account</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Annual Budget</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Used</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Remaining</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.map((budget) => {
                        const percentage = (budget.usedAmount / budget.annualBudget) * 100;
                        return (
                          <tr key={budget.id} className="border-b border-[#1E3E37]">
                            <td className="py-2 px-3 text-white">{budget.accountName}</td>
                            <td className="py-2 px-3 text-white">৳{budget.annualBudget.toLocaleString()}</td>
                            <td className="py-2 px-3 text-white">৳{budget.usedAmount.toLocaleString()}</td>
                            <td className="py-2 px-3 text-white">৳{budget.remaining.toLocaleString()}</td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-[#1E3E37] rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      percentage > 90 ? "bg-rose-400" : percentage > 70 ? "bg-amber-400" : "bg-[#10B981]"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-[#829B96]">{percentage.toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Approval Workflow */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-sky-400" />
                    Approval Workflow
                  </h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs gap-1.5"
                    onClick={() => setShowApprovalModal(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-3">
                  {approvalWorkflow.map((rule) => (
                    <div key={rule.id} className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{rule.voucherType}</span>
                          <span className="text-xs text-[#829B96]">Level {rule.level}</span>
                        </div>
                        <p className="text-xs text-[#829B96] mt-1">
                          Amount: {rule.amount > 0 ? `৳${rule.amount.toLocaleString()}+` : "Any amount"} → Approver: {rule.approver}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs px-2 py-1"
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voucher Numbering Pattern */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Hash className="h-4 w-4 text-amber-400" />
                    Voucher Numbering Pattern
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                    onClick={() => setShowNumberingModal(true)}
                  >
                    Edit Patterns
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(numberingPattern).map(([key, pattern]) => (
                    <div key={key} className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white capitalize">{key}</span>
                        <span className="text-xs text-[#829B96]">Pattern</span>
                      </div>
                      <code className="text-xs text-[#10B981] bg-[#0B1816] px-2 py-1 rounded block">
                        {pattern}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Configuration Modal */}
              {showTaxModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-md">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Tax Configuration</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowTaxModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">VAT Rate (%)</label>
                        <input
                          type="number"
                          value={taxSettings.vatRate}
                          onChange={(e) => setTaxSettings({...taxSettings, vatRate: Number(e.target.value)})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Tax Deduction at Source (%)</label>
                        <input
                          type="number"
                          value={taxSettings.taxDeductionAtSource}
                          onChange={(e) => setTaxSettings({...taxSettings, taxDeductionAtSource: Number(e.target.value)})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-[#1E3E37]">
                        <div>
                          <p className="text-sm text-white font-medium">Enable Tax</p>
                          <p className="text-xs text-[#829B96]">Calculate tax on transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={taxSettings.enableTax}
                            onChange={(e) => setTaxSettings({...taxSettings, enableTax: e.target.checked})}
                          />
                          <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Tax Account Code</label>
                        <input
                          type="text"
                          value={taxSettings.taxAccount}
                          onChange={(e) => setTaxSettings({...taxSettings, taxAccount: e.target.value})}
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                          placeholder="e.g., 2110"
                        />
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowTaxModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowTaxModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart of Accounts Modal */}
              {showCOAModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-md">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Add Account</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowCOAModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Account Code</label>
                        <input
                          type="text"
                          placeholder="e.g., 1200"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Account Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Accounts Receivable"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Account Type</label>
                        <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                          <option value="Group">Group</option>
                          <option value="Ledger">Ledger</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Parent Account</label>
                        <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                          <option value="">None (Root)</option>
                          {chartOfAccounts.filter(a => a.type === "Group").map((account) => (
                            <option key={account.id} value={account.code}>{account.code} - {account.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowCOAModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowCOAModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Add Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Voucher Type Modal */}
              {showVoucherTypeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-md">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Add Voucher Type</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowVoucherTypeModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Voucher Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Debit Note"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Voucher Code</label>
                        <input
                          type="text"
                          placeholder="e.g., DN"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Number Prefix</label>
                        <input
                          type="text"
                          placeholder="e.g., DN-"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowVoucherTypeModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowVoucherTypeModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Add Voucher Type
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Modal */}
              {showBudgetModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-md">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Add Budget</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowBudgetModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Account</label>
                        <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                          {chartOfAccounts.filter(a => a.type === "Ledger").map((account) => (
                            <option key={account.id} value={account.code}>{account.code} - {account.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Annual Budget Amount</label>
                        <input
                          type="number"
                          placeholder="e.g., 500000"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowBudgetModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowBudgetModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Add Budget
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Workflow Modal */}
              {showApprovalModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-md">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Add Approval Rule</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowApprovalModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Voucher Type</label>
                        <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                          {voucherTypes.filter(v => v.enabled).map((voucher) => (
                            <option key={voucher.id} value={voucher.name}>{voucher.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Minimum Amount (৳)</label>
                        <input
                          type="number"
                          placeholder="e.g., 50000"
                          className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Approver Role</label>
                        <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#829B96] mb-1">Approval Level</label>
                        <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                          <option value="1">Level 1</option>
                          <option value="2">Level 2</option>
                          <option value="3">Level 3</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowApprovalModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowApprovalModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Numbering Pattern Modal */}
              {showNumberingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Edit Numbering Patterns</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowNumberingModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      {Object.entries(numberingPattern).map(([key, pattern]) => (
                        <div key={key}>
                          <label className="block text-xs text-[#829B96] mb-1 capitalize">{key} Pattern</label>
                          <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setNumberingPattern({...numberingPattern, [key]: e.target.value})}
                            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981] font-mono"
                          />
                          <p className="text-xs text-[#829B96] mt-1">
                            Variables: {"{YYYY}"}, {"{MM}"}, {"{DD}"}, {"{####}"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowNumberingModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowNumberingModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save Patterns
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "PRINT_TEMPLATES" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                  <Printer className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Print Template Customization</h2>
                  <p className="text-xs text-[#829B96]">Invoice, voucher, money receipt print layouts</p>
                </div>
              </div>

              {/* Template Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 cursor-pointer hover:border-[#10B981] transition-all"
                  onClick={() => setShowInvoiceTemplateModal(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                      <Printer className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Invoice Template</h3>
                      <p className="text-xs text-[#829B96]">Sales invoice layout</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">Page: {invoiceTemplate.pageSize}</span>
                    <span className="text-xs text-[#10B981]">Active</span>
                  </div>
                </div>

                <div 
                  className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 cursor-pointer hover:border-[#10B981] transition-all"
                  onClick={() => setShowVoucherTemplateModal(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400">
                      <Printer className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Voucher Template</h3>
                      <p className="text-xs text-[#829B96]">Journal/Payment/Receipt voucher</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">Page: {voucherTemplate.pageSize}</span>
                    <span className="text-xs text-[#10B981]">Active</span>
                  </div>
                </div>

                <div 
                  className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 cursor-pointer hover:border-[#10B981] transition-all"
                  onClick={() => setShowReceiptTemplateModal(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
                      <Printer className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Money Receipt Template</h3>
                      <p className="text-xs text-[#829B96]">Payment receipt layout</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">Page: {receiptTemplate.pageSize}</span>
                    <span className="text-xs text-[#10B981]">Active</span>
                  </div>
                </div>
              </div>

              {/* Invoice Template Modal */}
              {showInvoiceTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Invoice Template Customization</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowInvoiceTemplateModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* Logo Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Logo Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Show Logo</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={invoiceTemplate.showLogo}
                                onChange={(e) => setInvoiceTemplate({...invoiceTemplate, showLogo: e.target.checked})}
                              />
                              <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Logo Position</label>
                            <select
                              value={invoiceTemplate.logoPosition}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, logoPosition: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="top-left">Top Left</option>
                              <option value="top-center">Top Center</option>
                              <option value="top-right">Top Right</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Logo Size</label>
                            <select
                              value={invoiceTemplate.logoSize}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, logoSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Company Header Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Company Header</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "showCompanyHeader", label: "Company Header" },
                            { key: "showTaxId", label: "Tax ID" },
                            { key: "showLicenseNo", label: "License No" },
                            { key: "showAddress", label: "Address" },
                            { key: "showContact", label: "Contact Info" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={invoiceTemplate[field.key as keyof typeof invoiceTemplate] as boolean}
                                onChange={(e) => setInvoiceTemplate({...invoiceTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Invoice Header Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Invoice Header</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Invoice Title</label>
                            <input
                              type="text"
                              value={invoiceTemplate.invoiceTitle}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, invoiceTitle: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Title Font Size (px)</label>
                            <input
                              type="number"
                              value={invoiceTemplate.titleFontSize}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, titleFontSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          {[
                            { key: "showInvoiceNumber", label: "Invoice Number" },
                            { key: "showInvoiceDate", label: "Invoice Date" },
                            { key: "showDueDate", label: "Due Date" },
                            { key: "showClientInfo", label: "Client Info" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={invoiceTemplate[field.key as keyof typeof invoiceTemplate] as boolean}
                                onChange={(e) => setInvoiceTemplate({...invoiceTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Items Table Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Items Table</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "showItemsTable", label: "Items Table" },
                            { key: "showDescription", label: "Description" },
                            { key: "showQuantity", label: "Quantity" },
                            { key: "showUnitPrice", label: "Unit Price" },
                            { key: "showAmount", label: "Amount" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={invoiceTemplate[field.key as keyof typeof invoiceTemplate] as boolean}
                                onChange={(e) => setInvoiceTemplate({...invoiceTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Totals Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Totals Section</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "showSubtotal", label: "Subtotal" },
                            { key: "showTax", label: "Tax" },
                            { key: "showDiscount", label: "Discount" },
                            { key: "showGrandTotal", label: "Grand Total" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={invoiceTemplate[field.key as keyof typeof invoiceTemplate] as boolean}
                                onChange={(e) => setInvoiceTemplate({...invoiceTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Footer Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Footer</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {[
                            { key: "showPaymentTerms", label: "Payment Terms" },
                            { key: "showNotes", label: "Notes" },
                            { key: "showSignature", label: "Signature" },
                            { key: "showTerms", label: "Terms & Conditions" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={invoiceTemplate[field.key as keyof typeof invoiceTemplate] as boolean}
                                onChange={(e) => setInvoiceTemplate({...invoiceTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                        <div>
                          <label className="block text-xs text-[#829B96] mb-1">Footer Text</label>
                          <input
                            type="text"
                            value={invoiceTemplate.footerText}
                            onChange={(e) => setInvoiceTemplate({...invoiceTemplate, footerText: e.target.value})}
                            className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                          />
                        </div>
                      </div>

                      {/* Page Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Page Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Page Size</label>
                            <select
                              value={invoiceTemplate.pageSize}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, pageSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="A4">A4</option>
                              <option value="A5">A5</option>
                              <option value="Letter">Letter</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Font Family</label>
                            <select
                              value={invoiceTemplate.fontFamily}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, fontFamily: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Calibri">Calibri</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Watermark</label>
                            <input
                              type="text"
                              value={invoiceTemplate.watermark}
                              onChange={(e) => setInvoiceTemplate({...invoiceTemplate, watermark: e.target.value})}
                              placeholder="Optional watermark text"
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-between">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setInvoiceTemplate({
                            logoPosition: "top-left",
                            logoSize: "medium",
                            showLogo: true,
                            showCompanyHeader: true,
                            showTaxId: true,
                            showLicenseNo: true,
                            showAddress: true,
                            showContact: true,
                            invoiceTitle: "INVOICE",
                            titleFontSize: "18",
                            showInvoiceNumber: true,
                            showInvoiceDate: true,
                            showDueDate: true,
                            showClientInfo: true,
                            showItemsTable: true,
                            showDescription: true,
                            showQuantity: true,
                            showUnitPrice: true,
                            showAmount: true,
                            showSubtotal: true,
                            showTax: true,
                            showDiscount: true,
                            showGrandTotal: true,
                            showPaymentTerms: true,
                            showNotes: true,
                            showSignature: true,
                            showTerms: true,
                            footerText: "Thank you for your business!",
                            pageSize: "A4",
                            watermark: "",
                            fontFamily: "Arial"
                          });
                        }}
                      >
                        Reset to Default
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                          onClick={() => setShowInvoiceTemplateModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                          onClick={() => {
                            setShowInvoiceTemplateModal(false);
                            setHasChanges(true);
                          }}
                        >
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Save Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Voucher Template Modal */}
              {showVoucherTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Voucher Template Customization</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowVoucherTemplateModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* Logo Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Logo Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Show Logo</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={voucherTemplate.showLogo}
                                onChange={(e) => setVoucherTemplate({...voucherTemplate, showLogo: e.target.checked})}
                              />
                              <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Logo Position</label>
                            <select
                              value={voucherTemplate.logoPosition}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, logoPosition: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="top-left">Top Left</option>
                              <option value="top-center">Top Center</option>
                              <option value="top-right">Top Right</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Logo Size</label>
                            <select
                              value={voucherTemplate.logoSize}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, logoSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Voucher Header Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Voucher Header</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Voucher Title</label>
                            <input
                              type="text"
                              value={voucherTemplate.voucherTitle}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, voucherTitle: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Title Font Size (px)</label>
                            <input
                              type="number"
                              value={voucherTemplate.titleFontSize}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, titleFontSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          {[
                            { key: "showVoucherNumber", label: "Voucher Number" },
                            { key: "showVoucherDate", label: "Voucher Date" },
                            { key: "showVoucherType", label: "Voucher Type" },
                            { key: "showCompanyHeader", label: "Company Header" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={voucherTemplate[field.key as keyof typeof voucherTemplate] as boolean}
                                onChange={(e) => setVoucherTemplate({...voucherTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Debit/Credit Table */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Debit/Credit Table</h4>
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={voucherTemplate.showDebitCreditTable}
                            onChange={(e) => setVoucherTemplate({...voucherTemplate, showDebitCreditTable: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                          Show Debit/Credit Table
                        </label>
                      </div>

                      {/* Approval Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Approval Section</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "showPreparedBy", label: "Prepared By" },
                            { key: "showCheckedBy", label: "Checked By" },
                            { key: "showApprovedBy", label: "Approved By" },
                            { key: "showNarration", label: "Narration" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={voucherTemplate[field.key as keyof typeof voucherTemplate] as boolean}
                                onChange={(e) => setVoucherTemplate({...voucherTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Amount Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Amount Section</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: "showTotalAmount", label: "Total Amount" },
                            { key: "showAmountInWords", label: "Amount in Words" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={voucherTemplate[field.key as keyof typeof voucherTemplate] as boolean}
                                onChange={(e) => setVoucherTemplate({...voucherTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Page Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Page Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Page Size</label>
                            <select
                              value={voucherTemplate.pageSize}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, pageSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="A4">A4</option>
                              <option value="A5">A5</option>
                              <option value="Letter">Letter</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Font Family</label>
                            <select
                              value={voucherTemplate.fontFamily}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, fontFamily: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Calibri">Calibri</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Footer Text</label>
                            <input
                              type="text"
                              value={voucherTemplate.footerText}
                              onChange={(e) => setVoucherTemplate({...voucherTemplate, footerText: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-between">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setVoucherTemplate({
                            logoPosition: "top-left",
                            logoSize: "medium",
                            showLogo: true,
                            showCompanyHeader: true,
                            voucherTitle: "VOUCHER",
                            titleFontSize: "16",
                            showVoucherNumber: true,
                            showVoucherDate: true,
                            showVoucherType: true,
                            showDebitCreditTable: true,
                            showNarration: true,
                            showPreparedBy: true,
                            showCheckedBy: true,
                            showApprovedBy: true,
                            showTotalAmount: true,
                            showAmountInWords: true,
                            footerText: "This is a computer generated voucher.",
                            pageSize: "A4",
                            fontFamily: "Arial"
                          });
                        }}
                      >
                        Reset to Default
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                          onClick={() => setShowVoucherTemplateModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                          onClick={() => {
                            setShowVoucherTemplateModal(false);
                            setHasChanges(true);
                          }}
                        >
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Save Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Money Receipt Template Modal */}
              {showReceiptTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Money Receipt Template Customization</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowReceiptTemplateModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* Logo Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Logo Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Show Logo</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={receiptTemplate.showLogo}
                                onChange={(e) => setReceiptTemplate({...receiptTemplate, showLogo: e.target.checked})}
                              />
                              <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Logo Position</label>
                            <select
                              value={receiptTemplate.logoPosition}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, logoPosition: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="top-left">Top Left</option>
                              <option value="top-center">Top Center</option>
                              <option value="top-right">Top Right</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Logo Size</label>
                            <select
                              value={receiptTemplate.logoSize}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, logoSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Receipt Header Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Receipt Header</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Receipt Title</label>
                            <input
                              type="text"
                              value={receiptTemplate.receiptTitle}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, receiptTitle: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Title Font Size (px)</label>
                            <input
                              type="number"
                              value={receiptTemplate.titleFontSize}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, titleFontSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          {[
                            { key: "showReceiptNumber", label: "Receipt Number" },
                            { key: "showReceiptDate", label: "Receipt Date" },
                            { key: "showCompanyHeader", label: "Company Header" },
                            { key: "showReceivedFrom", label: "Received From" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={receiptTemplate[field.key as keyof typeof receiptTemplate] as boolean}
                                onChange={(e) => setReceiptTemplate({...receiptTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Amount Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Amount Section</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: "showAmount", label: "Amount" },
                            { key: "showAmountInWords", label: "Amount in Words" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={receiptTemplate[field.key as keyof typeof receiptTemplate] as boolean}
                                onChange={(e) => setReceiptTemplate({...receiptTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Payment Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "showPaymentMode", label: "Payment Mode" },
                            { key: "showBankDetails", label: "Bank Details" },
                            { key: "showChequeNumber", label: "Cheque Number" },
                            { key: "showSignature", label: "Signature" }
                          ].map((field) => (
                            <label key={field.key} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                              <input
                                type="checkbox"
                                checked={receiptTemplate[field.key as keyof typeof receiptTemplate] as boolean}
                                onChange={(e) => setReceiptTemplate({...receiptTemplate, [field.key]: e.target.checked})}
                                className="sr-only peer"
                              />
                              <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                              {field.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Authority Section */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Authority Section</h4>
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={receiptTemplate.showAuthority}
                            onChange={(e) => setReceiptTemplate({...receiptTemplate, showAuthority: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                          Show Authority Signature
                        </label>
                      </div>

                      {/* Page Settings */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Page Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Page Size</label>
                            <select
                              value={receiptTemplate.pageSize}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, pageSize: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="A4">A4</option>
                              <option value="A5">A5</option>
                              <option value="Letter">Letter</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Font Family</label>
                            <select
                              value={receiptTemplate.fontFamily}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, fontFamily: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            >
                              <option value="Arial">Arial</option>
                              <option value="Times New Roman">Times New Roman</option>
                              <option value="Calibri">Calibri</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Footer Text</label>
                            <input
                              type="text"
                              value={receiptTemplate.footerText}
                              onChange={(e) => setReceiptTemplate({...receiptTemplate, footerText: e.target.value})}
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-between">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => {
                          setReceiptTemplate({
                            logoPosition: "top-center",
                            logoSize: "medium",
                            showLogo: true,
                            showCompanyHeader: true,
                            receiptTitle: "MONEY RECEIPT",
                            titleFontSize: "18",
                            showReceiptNumber: true,
                            showReceiptDate: true,
                            showReceivedFrom: true,
                            showAmount: true,
                            showAmountInWords: true,
                            showPaymentMode: true,
                            showBankDetails: true,
                            showChequeNumber: true,
                            showSignature: true,
                            showAuthority: true,
                            footerText: "This receipt is valid for payment.",
                            pageSize: "A5",
                            fontFamily: "Arial"
                          });
                        }}
                      >
                        Reset to Default
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                          onClick={() => setShowReceiptTemplateModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                          onClick={() => {
                            setShowReceiptTemplateModal(false);
                            setHasChanges(true);
                          }}
                        >
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Save Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "FORM_CUSTOMIZATION" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Form & Modal Customization</h2>
                  <p className="text-xs text-[#829B96]">Customize form fields and validation rules</p>
                </div>
              </div>

              {/* Form Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 cursor-pointer hover:border-[#10B981] transition-all"
                  onClick={() => setShowVoucherFormModal(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Voucher Form</h3>
                      <p className="text-xs text-[#829B96]">Journal, Payment, Receipt</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">{voucherFormFields.filter(f => f.visible).length} fields</span>
                    <span className="text-xs text-[#10B981]">Active</span>
                  </div>
                </div>

                <div 
                  className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 cursor-pointer hover:border-[#10B981] transition-all"
                  onClick={() => setShowInvoiceFormModal(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Invoice Form</h3>
                      <p className="text-xs text-[#829B96]">Sales invoice creation</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">{invoiceFormFields.filter(f => f.visible).length} fields</span>
                    <span className="text-xs text-[#10B981]">Active</span>
                  </div>
                </div>

                <div 
                  className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 cursor-pointer hover:border-[#10B981] transition-all"
                  onClick={() => setShowPaymentFormModal(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Payment Form</h3>
                      <p className="text-xs text-[#829B96]">Payment receive/pay</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#829B96]">{paymentFormFields.filter(f => f.visible).length} fields</span>
                    <span className="text-xs text-[#10B981]">Active</span>
                  </div>
                </div>
              </div>

              {/* Voucher Form Modal */}
              {showVoucherFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Voucher Form Customization</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowVoucherFormModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Field Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#1E3E37]">
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Field Name</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Type</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Visible</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Required</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Order</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {voucherFormFields.map((field) => (
                              <tr key={field.id} className="border-b border-[#1E3E37]">
                                <td className="py-2 px-3 text-white">{field.label}</td>
                                <td className="py-2 px-3 text-[#829B96] capitalize">{field.type}</td>
                                <td className="py-2 px-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={field.visible}
                                      onChange={(e) => {
                                        setVoucherFormFields(voucherFormFields.map(f => 
                                          f.id === field.id ? {...f, visible: e.target.checked} : f
                                        ));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                                  </label>
                                </td>
                                <td className="py-2 px-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={field.required}
                                      onChange={(e) => {
                                        setVoucherFormFields(voucherFormFields.map(f => 
                                          f.id === field.id ? {...f, required: e.target.checked} : f
                                        ));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                                  </label>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="number"
                                    value={field.order}
                                    onChange={(e) => {
                                      setVoucherFormFields(voucherFormFields.map(f => 
                                        f.id === field.id ? {...f, order: Number(e.target.value)} : f
                                      ));
                                      setHasChanges(true);
                                    }}
                                    className="w-16 bg-[#0B1816] border border-[#1E3E37] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#10B981]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 text-xs px-2 py-1"
                                    onClick={() => {
                                      if (confirm(`Remove field "${field.label}"?`)) {
                                        setVoucherFormFields(voucherFormFields.filter(f => f.id !== field.id));
                                        setHasChanges(true);
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Add Custom Field */}
                      <div className="pt-4 border-t border-[#1E3E37]">
                        <h4 className="text-sm font-semibold text-white mb-3">Add Custom Field</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Field Label</label>
                            <input
                              type="text"
                              placeholder="e.g., Custom Field"
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Field Type</label>
                            <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="select">Select</option>
                              <option value="textarea">Textarea</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Required</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                            </label>
                          </div>
                          <div className="flex items-end">
                            <Button 
                              size="sm" 
                              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                              onClick={() => {
                                setVoucherFormFields([
                                  ...voucherFormFields,
                                  {
                                    id: `custom-${Date.now()}`,
                                    label: "Custom Field",
                                    type: "text",
                                    required: false,
                                    visible: true,
                                    order: voucherFormFields.length + 1
                                  }
                                ]);
                                setHasChanges(true);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Add Field
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowVoucherFormModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowVoucherFormModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Form Modal */}
              {showInvoiceFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Invoice Form Customization</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowInvoiceFormModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#1E3E37]">
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Field Name</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Type</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Visible</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Required</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Order</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceFormFields.map((field) => (
                              <tr key={field.id} className="border-b border-[#1E3E37]">
                                <td className="py-2 px-3 text-white">{field.label}</td>
                                <td className="py-2 px-3 text-[#829B96] capitalize">{field.type}</td>
                                <td className="py-2 px-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={field.visible}
                                      onChange={(e) => {
                                        setInvoiceFormFields(invoiceFormFields.map(f => 
                                          f.id === field.id ? {...f, visible: e.target.checked} : f
                                        ));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                                  </label>
                                </td>
                                <td className="py-2 px-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={field.required}
                                      onChange={(e) => {
                                        setInvoiceFormFields(invoiceFormFields.map(f => 
                                          f.id === field.id ? {...f, required: e.target.checked} : f
                                        ));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                                  </label>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="number"
                                    value={field.order}
                                    onChange={(e) => {
                                      setInvoiceFormFields(invoiceFormFields.map(f => 
                                        f.id === field.id ? {...f, order: Number(e.target.value)} : f
                                      ));
                                      setHasChanges(true);
                                    }}
                                    className="w-16 bg-[#0B1816] border border-[#1E3E37] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#10B981]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 text-xs px-2 py-1"
                                    onClick={() => {
                                      if (confirm(`Remove field "${field.label}"?`)) {
                                        setInvoiceFormFields(invoiceFormFields.filter(f => f.id !== field.id));
                                        setHasChanges(true);
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-4 border-t border-[#1E3E37]">
                        <h4 className="text-sm font-semibold text-white mb-3">Add Custom Field</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Field Label</label>
                            <input
                              type="text"
                              placeholder="e.g., Custom Field"
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Field Type</label>
                            <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="select">Select</option>
                              <option value="textarea">Textarea</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Required</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                            </label>
                          </div>
                          <div className="flex items-end">
                            <Button 
                              size="sm" 
                              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                              onClick={() => {
                                setInvoiceFormFields([
                                  ...invoiceFormFields,
                                  {
                                    id: `custom-${Date.now()}`,
                                    label: "Custom Field",
                                    type: "text",
                                    required: false,
                                    visible: true,
                                    order: invoiceFormFields.length + 1
                                  }
                                ]);
                                setHasChanges(true);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Add Field
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowInvoiceFormModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowInvoiceFormModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Form Modal */}
              {showPaymentFormModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b border-[#1E3E37] flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Payment Form Customization</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowPaymentFormModal(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#1E3E37]">
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Field Name</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Type</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Visible</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Required</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Order</th>
                              <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentFormFields.map((field) => (
                              <tr key={field.id} className="border-b border-[#1E3E37]">
                                <td className="py-2 px-3 text-white">{field.label}</td>
                                <td className="py-2 px-3 text-[#829B96] capitalize">{field.type}</td>
                                <td className="py-2 px-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={field.visible}
                                      onChange={(e) => {
                                        setPaymentFormFields(paymentFormFields.map(f => 
                                          f.id === field.id ? {...f, visible: e.target.checked} : f
                                        ));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                                  </label>
                                </td>
                                <td className="py-2 px-3">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={field.required}
                                      onChange={(e) => {
                                        setPaymentFormFields(paymentFormFields.map(f => 
                                          f.id === field.id ? {...f, required: e.target.checked} : f
                                        ));
                                        setHasChanges(true);
                                      }}
                                    />
                                    <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                                  </label>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="number"
                                    value={field.order}
                                    onChange={(e) => {
                                      setPaymentFormFields(paymentFormFields.map(f => 
                                        f.id === field.id ? {...f, order: Number(e.target.value)} : f
                                      ));
                                      setHasChanges(true);
                                    }}
                                    className="w-16 bg-[#0B1816] border border-[#1E3E37] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#10B981]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 text-xs px-2 py-1"
                                    onClick={() => {
                                      if (confirm(`Remove field "${field.label}"?`)) {
                                        setPaymentFormFields(paymentFormFields.filter(f => f.id !== field.id));
                                        setHasChanges(true);
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-4 border-t border-[#1E3E37]">
                        <h4 className="text-sm font-semibold text-white mb-3">Add Custom Field</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Field Label</label>
                            <input
                              type="text"
                              placeholder="e.g., Custom Field"
                              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Field Type</label>
                            <select className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]">
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="select">Select</option>
                              <option value="textarea">Textarea</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#829B96] mb-1">Required</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                            </label>
                          </div>
                          <div className="flex items-end">
                            <Button 
                              size="sm" 
                              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                              onClick={() => {
                                setPaymentFormFields([
                                  ...paymentFormFields,
                                  {
                                    id: `custom-${Date.now()}`,
                                    label: "Custom Field",
                                    type: "text",
                                    required: false,
                                    visible: true,
                                    order: paymentFormFields.length + 1
                                  }
                                ]);
                                setHasChanges(true);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Add Field
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#1E3E37] flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-[#0B1816] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                        onClick={() => setShowPaymentFormModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                        onClick={() => {
                          setShowPaymentFormModal(false);
                          setHasChanges(true);
                        }}
                      >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "APPEARANCE" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Appearance</h2>
                  <p className="text-xs text-[#829B96]">Customize theme and user interface</p>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Theme Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="p-4 rounded-lg bg-[#112421] border-2 border-[#10B981] text-xs text-white font-medium text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded bg-[#10B981]"></div>
                      <span>Dark Emerald</span>
                    </div>
                    <p className="text-xs text-[#829B96]">Professional dark theme with emerald accents</p>
                  </button>
                  <button className="p-4 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-xs text-[#829B96] hover:text-white font-medium text-left hover:border-[#1E3E37]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded bg-slate-300"></div>
                      <span>Light</span>
                    </div>
                    <p className="text-xs text-[#829B96]">Clean light theme for better visibility</p>
                  </button>
                  <button className="p-4 rounded-lg bg-[#0B1816] border border-[#1E3E37] text-xs text-[#829B96] hover:text-white font-medium text-left hover:border-[#1E3E37]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-r from-[#10B981] to-slate-300"></div>
                      <span>System</span>
                    </div>
                    <p className="text-xs text-[#829B96]">Follows system preference</p>
                  </button>
                </div>
              </div>

              {/* Color Customization */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Color Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-2">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-[#10B981] border-2 border-white"></div>
                      <input
                        type="text"
                        defaultValue="#10B981"
                        className="flex-1 bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-2">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-sky-400 border-2 border-white"></div>
                      <input
                        type="text"
                        defaultValue="#38BDF8"
                        className="flex-1 bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-2">Success Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-[#10B981] border-2 border-white"></div>
                      <input
                        type="text"
                        defaultValue="#10B981"
                        className="flex-1 bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-2">Warning Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-amber-400 border-2 border-white"></div>
                      <input
                        type="text"
                        defaultValue="#FBBF24"
                        className="flex-1 bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-2">Error Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-rose-400 border-2 border-white"></div>
                      <input
                        type="text"
                        defaultValue="#F87171"
                        className="flex-1 bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-2">Border Color</label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-[#1E3E37] border-2 border-white"></div>
                      <input
                        type="text"
                        defaultValue="#1E3E37"
                        className="flex-1 bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Font Family</label>
                    <select
                      defaultValue="inter"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="opensans">Open Sans</option>
                      <option value="arial">Arial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Font Size</label>
                    <select
                      defaultValue="medium"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="small">Small (12px)</option>
                      <option value="medium">Medium (14px)</option>
                      <option value="large">Large (16px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Line Height</label>
                    <select
                      defaultValue="normal"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="tight">Tight</option>
                      <option value="normal">Normal</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout Density */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Layout Density</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="p-3 rounded-lg bg-[#112421] border border-[#1E3E37] text-xs text-white font-medium hover:border-[#10B981]">
                    <div className="text-xs font-bold mb-1">Compact</div>
                    <p className="text-xs text-[#829B96]">More content, less spacing</p>
                  </button>
                  <button className="p-3 rounded-lg bg-[#112421] border-2 border-[#10B981] text-xs text-white font-medium">
                    <div className="text-xs font-bold mb-1">Comfortable</div>
                    <p className="text-xs text-[#829B96]">Balanced spacing</p>
                  </button>
                  <button className="p-3 rounded-lg bg-[#112421] border border-[#1E3E37] text-xs text-white font-medium hover:border-[#10B981]">
                    <div className="text-xs font-bold mb-1">Spacious</div>
                    <p className="text-xs text-[#829B96]">More breathing room</p>
                  </button>
                </div>
              </div>

              {/* Sidebar Customization */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Sidebar Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Sidebar Width</label>
                    <select
                      defaultValue="medium"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="narrow">Narrow (200px)</option>
                      <option value="medium">Medium (250px)</option>
                      <option value="wide">Wide (300px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Menu Items</label>
                    <select
                      defaultValue="icons"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="icons">Icons Only</option>
                      <option value="icons-text">Icons + Text</option>
                      <option value="icons-badges">Icons + Badges</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                        onChange={() => setHasChanges(true)}
                      />
                      <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                      Show module badges in sidebar
                    </label>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Application Logo</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#112421] border border-[#1E3E37] flex items-center justify-center">
                    <span className="text-xs text-[#829B96]">Logo</span>
                  </div>
                  <div className="flex-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                    >
                      Upload New Logo
                    </Button>
                    <p className="text-xs text-[#829B96] mt-2">Recommended: PNG or SVG, max 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "NOTIFICATIONS" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Notifications</h2>
                  <p className="text-xs text-[#829B96]">Configure email, SMS, and in-app alerts</p>
                </div>
              </div>

              {/* Email Configuration */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">SMTP Server</label>
                    <input
                      type="text"
                      placeholder="smtp.gmail.com"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">SMTP Port</label>
                    <input
                      type="number"
                      placeholder="587"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Sender Email</label>
                    <input
                      type="email"
                      placeholder="noreply@company.com"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Sender Name</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Enable email notifications
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Use SSL/TLS encryption
                  </label>
                </div>
              </div>

              {/* SMS Configuration */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">SMS Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">SMS Provider</label>
                    <select
                      defaultValue="twilio"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="twilio">Twilio</option>
                      <option value="nexmo">Nexmo</option>
                      <option value="custom">Custom Provider</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">API Key</label>
                    <input
                      type="password"
                      placeholder="Enter API key"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Enable SMS notifications
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    SMS for critical events only
                  </label>
                </div>
              </div>

              {/* Notification Types */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Notification Types by Module</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white font-medium">Accounting & Finance</p>
                      <p className="text-xs text-[#829B96]">Vouchers, payments, approvals</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#829B96]">Email</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                      <span className="text-xs text-[#829B96]">SMS</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white font-medium">Sales & Clients</p>
                      <p className="text-xs text-[#829B96]">Invoices, payments, client updates</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#829B96]">Email</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                      <span className="text-xs text-[#829B96]">SMS</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white font-medium">Projects & Property</p>
                      <p className="text-xs text-[#829B96]">Project updates, unit bookings</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#829B96]">Email</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                      <span className="text-xs text-[#829B96]">SMS</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white font-medium">HR & Payroll</p>
                      <p className="text-xs text-[#829B96]">Employee updates, payroll</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#829B96]">Email</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                      <span className="text-xs text-[#829B96]">SMS</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" onChange={() => setHasChanges(true)} />
                        <div className="w-9 h-5 bg-[#1E3E37] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Schedule */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Notification Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Notification Frequency</label>
                    <select
                      defaultValue="immediate"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#829B96] mb-1">Quiet Hours</label>
                    <select
                      defaultValue="22-6"
                      className="w-full bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="disabled">Disabled</option>
                      <option value="22-6">10 PM - 6 AM</option>
                      <option value="23-7">11 PM - 7 AM</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Allow urgent notifications during quiet hours
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Skip weekends for non-urgent notifications
                  </label>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">In-App Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Show browser notifications
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Show notification badge in sidebar
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                      onChange={() => setHasChanges(true)}
                    />
                    <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                    Play sound for urgent notifications
                  </label>
                </div>
              </div>

              {/* Test Notification */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Test Notification</h3>
                    <p className="text-xs text-[#829B96]">Send a test notification to verify configuration</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                  >
                    Send Test
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SYSTEM" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">System Maintenance</h2>
                  <p className="text-xs text-[#829B96]">Backup, restore, and system logs</p>
                </div>
              </div>

              {/* Backup Management */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Backup Management</h3>
                  <Button 
                    size="sm" 
                    className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Backup Now
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                    <p className="text-xs text-[#829B96] mb-1">Last Backup</p>
                    <p className="text-sm text-white font-medium">08 Sep 2026, 10:30 AM</p>
                  </div>
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                    <p className="text-xs text-[#829B96] mb-1">Backup Size</p>
                    <p className="text-sm text-white font-medium">245.8 MB</p>
                  </div>
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                    <p className="text-xs text-[#829B96] mb-1">Total Backups</p>
                    <p className="text-sm text-white font-medium">12 backups</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                        onChange={() => setHasChanges(true)}
                      />
                      <div className="w-4 h-4 bg-[#0B1816] border border-[#1E3E37] rounded peer-checked:bg-[#10B981] peer-checked:border-[#10B981]"></div>
                      Enable automatic backup
                    </label>
                    <select
                      defaultValue="daily"
                      className="bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#829B96]">Backup Time</label>
                    <input
                      type="time"
                      defaultValue="02:00"
                      className="bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#829B96]">Retention Period</label>
                    <select
                      defaultValue="30"
                      className="bg-[#112421] border border-[#1E3E37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      onChange={() => setHasChanges(true)}
                    >
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Restore Operations */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Restore Operations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1E3E37]">
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Backup Name</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Date</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Size</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Type</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-white">backup_2026_09_08</td>
                        <td className="py-2 px-3 text-[#829B96]">08 Sep 2026, 10:30 AM</td>
                        <td className="py-2 px-3 text-[#829B96]">245.8 MB</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-[#10B981]">Automatic</span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/20 text-xs px-2 py-1"
                            >
                              Restore
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 text-xs px-2 py-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-white">backup_2026_09_07</td>
                        <td className="py-2 px-3 text-[#829B96]">07 Sep 2026, 10:30 AM</td>
                        <td className="py-2 px-3 text-[#829B96]">244.2 MB</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-[#10B981]">Automatic</span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/20 text-xs px-2 py-1"
                            >
                              Restore
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 text-xs px-2 py-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Logs */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">System Logs</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                  >
                    View All Logs
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1E3E37]">
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Timestamp</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Level</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Module</th>
                        <th className="text-left py-2 px-3 text-[#829B96] font-medium">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-[#829B96]">08 Sep 2026, 10:30 AM</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-[#10B981]">INFO</span>
                        </td>
                        <td className="py-2 px-3 text-white">Backup</td>
                        <td className="py-2 px-3 text-[#829B96]">Automatic backup completed successfully</td>
                      </tr>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-[#829B96]">08 Sep 2026, 09:15 AM</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-amber-400">WARNING</span>
                        </td>
                        <td className="py-2 px-3 text-white">Auth</td>
                        <td className="py-2 px-3 text-[#829B96]">Multiple failed login attempts detected</td>
                      </tr>
                      <tr className="border-b border-[#1E3E37]">
                        <td className="py-2 px-3 text-[#829B96]">08 Sep 2026, 08:00 AM</td>
                        <td className="py-2 px-3">
                          <span className="text-xs text-[#10B981]">INFO</span>
                        </td>
                        <td className="py-2 px-3 text-white">System</td>
                        <td className="py-2 px-3 text-[#829B96]">System health check passed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#829B96]">Database Status</p>
                      <span className="text-xs text-[#10B981]">● Healthy</span>
                    </div>
                    <p className="text-sm text-white font-medium">Connected</p>
                  </div>
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#829B96]">Storage Usage</p>
                      <span className="text-xs text-[#10B981]">● 45%</span>
                    </div>
                    <p className="text-sm text-white font-medium">450 GB / 1 TB</p>
                  </div>
                  <div className="bg-[#112421] border border-[#1E3E37] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#829B96]">Memory Usage</p>
                      <span className="text-xs text-amber-400">● 72%</span>
                    </div>
                    <p className="text-sm text-white font-medium">7.2 GB / 10 GB</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#829B96]">Uptime</p>
                  <p className="text-sm text-white font-medium">45 days, 12 hours, 30 minutes</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs w-full"
                >
                  Run Health Check
                </Button>
              </div>

              {/* Data Export */}
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Data Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                  >
                    Export Chart of Accounts
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                  >
                    Export Transactions
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                  >
                    Export Clients
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs"
                  >
                    Export Projects
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "AUDIT" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-rose-400/10 text-rose-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Audit Logs</h2>
                  <p className="text-xs text-[#829B96]">Track system activities and security events</p>
                </div>
              </div>

              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-xl p-4">
                <p className="text-xs text-[#829B96] mb-4">Activity logs and security events will be displayed here.</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs">
                    View All Logs
                  </Button>
                  <Button size="sm" variant="outline" className="bg-[#112421] border border-[#1E3E37] text-white hover:bg-[#1A3530] text-xs">
                    Export Logs
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-amber-400">You have unsaved changes. Don't forget to save before leaving.</p>
          </div>
          <Button 
            size="sm" 
            className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-semibold text-xs"
            onClick={handleSave}
          >
            Save Now
          </Button>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
