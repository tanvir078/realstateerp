# Accounting & Finance Module - Comprehensive Planning Document

## 🏗️ Module Overview
**Module Name:** Accounting & Finance  
**Parent Navigation:** Dashboard → Accounting & Finance  
**Sub-menus:** Chart of Accounts, Vouchers, General Ledger, Cash & Bank, Receivables, Payables, Bank Reconciliation, Invoices & Receipts  
**Primary Users:** Accountants, Finance Managers, Management, Auditors  

---

## 📋 Module Structure & Navigation Flow

```
Dashboard
└── Accounting & Finance
    ├── Chart of Accounts
    │   ├── Account Tree View (Hierarchical)
    │   ├── Add Account (Modal Form)
    │   ├── Edit Account (Modal Form)
    │   ├── Account Details (Detail Page)
    │   ├── Account Balance Inquiry
    │   └── Account Structure Management
    │
    ├── Vouchers
    │   ├── Voucher List (Table View)
    │   ├── New Voucher (Modal Form)
    │   ├── Voucher Details (Detail Page)
    │   ├── Edit Voucher (Modal Form)
    │   ├── Post Voucher (Action)
    │   ├── Cancel Voucher (Action)
    │   └── Voucher Type Selection
    │
    ├── General Ledger
    │   ├── Ledger View (Table View)
    │   ├── Account Ledger (Detail Page)
    │   ├── Trial Balance (Report View)
    │   ├── Ledger Entry Search
    │   └── Ledger Reconciliation
    │
    ├── Cash & Bank
    │   ├── Cash/Bank Accounts (Card View)
    │   ├── Add Account (Modal Form)
    │   ├── Transaction Entry (Modal Form)
    │   ├── Balance Inquiry (Action)
    │   ├── Transfer Funds (Modal Form)
    │   └── Account Statement (Report View)
    │
    ├── Receivables
    │   ├── Receivables Dashboard (Dashboard)
    │   ├── Aging Analysis (Report View)
    │   ├── Client-wise Receivables (Table View)
    │   ├── Record Payment (Modal Form)
    │   ├── Send Reminder (Action)
    │   └── Collection Report (Report View)
    │
    ├── Payables
    │   ├── Payables Dashboard (Dashboard)
    │   ├── Aging Analysis (Report View)
    │   ├── Vendor-wise Payables (Table View)
    │   ├── Process Payment (Modal Form)
    │   ├── Send Reminder (Action)
    │   └── Payment Report (Report View)
    │
    ├── Bank Reconciliation
    │   ├── Reconciliation List (Table View)
    │   ├── Start Reconciliation (Modal Form)
    │   ├── Upload Statement (Action)
    │   ├── Match Transactions (Action)
    │   ├── Reconciliation Report (Report View)
    │   └── Statement Status Tracking
    │
    └── Invoices & Receipts
        ├── Invoice List (Table View)
        ├── Create Invoice (Modal Form)
        ├── Invoice Details (Detail Page)
        ├── Create Receipt (Modal Form)
        ├── Send Invoice (Action)
        ├── Download PDF (Action)
        └── Invoice Status Tracking
```

---

## 🎨 UI/UX Design Standards

### Color Palette Integration
```css
/* Account Type Colors */
.account-asset { background: #10B981; }          /* Green */
.account-liability { background: #EF4444; }     /* Red */
.account-equity { background: #3B82F6; }        /* Blue */
.account-revenue { background: #8B5CF6; }        /* Purple */
.account-expense { background: #F59E0B; }       /* Amber */

/* Voucher Status Colors */
.voucher-draft { background: #6B7280; }        /* Gray */
.voucher-posted { background: #10B981; }       /* Green */
.voucher-cancelled { background: #EF4444; }    /* Red */
.voucher-hold { background: #F59E0B; }         /* Amber */

/* Payment Status Colors */
.payment-pending { background: #F59E0B; }       /* Amber */
.payment-processed { background: #3B82F6; }    /* Blue */
.payment-completed { background: #10B981; }    /* Green */
.payment-failed { background: #EF4444; }      /* Red */

/* Reconciliation Status Colors */
.reconc-pending { background: #F59E0B; }      /* Amber */
.reconc-in-progress { background: #3B82F6; }   /* Blue */
.reconc-completed { background: #10B981; }    /* Green */
.reconc-discrepancy { background: #EF4444; }  /* Red */

/* Invoice Status Colors */
.invoice-draft { background: #6B7280; }        /* Gray */
.invoice-sent { background: #3B82F6; }         /* Blue */
.invoice-viewed { background: #F59E0B; }       /* Amber */
.invoice-paid { background: #10B981; }        /* Green */
.invoice-overdue { background: #EF4444; }      /* Red */
```

### Typography Hierarchy
```css
/* Account Cards */
.account-name { font-size: 16px; font-weight: 600; color: #1F2937; }
.account-code { font-size: 13px; color: #6B7280; }
.account-balance { font-size: 18px; font-weight: 700; color: #10B981; }

/* Voucher Cards */
.voucher-number { font-size: 16px; font-weight: 600; color: #1F2937; }
.voucher-type { font-size: 13px; color: #6B7280; }
.voucher-amount { font-size: 16px; font-weight: 700; color: #10B981; }

/* Ledger Cards */
.ledger-account { font-size: 16px; font-weight: 600; color: #1F2937; }
.ledger-balance { font-size: 14px; font-weight: 500; color: #374151; }
.ledger-debit { font-size: 14px; color: #EF4444; }
.ledger-credit { font-size: 14px; color: #10B981; }
```

### Layout Structure
```css
/* Account Tree Layout */
.account-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

/* Voucher Table Layout */
.voucher-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

/* Financial Dashboard */
.financial-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* Ledger Entry Form */
.ledger-entry-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
```

---

## 📝 Form 1: Voucher Creation Form

### Form Architecture
```typescript
interface VoucherFormArchitecture {
  formType: "modal";
  layout: "mixed";
  validation: "real-time";
  submission: "async";
  postingWorkflow: true;
  doubleEntry: true;
  multiLineItem: true;
}
```

### Form Structure Design

#### Section 1: Voucher Information
```typescript
{
  section: "Voucher Information",
  layout: "two-column",
  fields: [
    {
      name: "voucherType",
      label: "Voucher Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "payment", label: "Payment Voucher", icon: "arrow-down" },
          { value: "receipt", label: "Receipt Voucher", icon: "arrow-up" },
          { value: "journal", label: "Journal Voucher", icon: "file-text" },
          { value: "contra", label: "Contra Voucher", icon: "repeat" }
        ]
      },
      validation: {
        required: true
      },
      ui: {
        icon: "type",
        helper: "Select voucher type",
        onChange: "toggleConditionalFields"
      }
    },
    {
      name: "voucherDate",
      label: "Voucher Date",
      type: "date",
      required: true,
      defaultValue: "today",
      validation: {
        maxDate: "today"
      },
      ui: {
        icon: "calendar"
      }
    },
    {
      name: "voucherNumber",
      label: "Voucher Number",
      type: "text",
      placeholder: "Auto-generated",
      required: true,
      validation: {
        pattern: "^[A-Z]{2}-\\d{4}-\\d{4}$",
        customMessage: "Format: XX-0000-0000 (e.g., PV-2025-0001)"
      },
      ui: {
        icon: "hash",
        disabled: true,
        autoGenerate: true,
        helper: "Auto-generated based on type and date"
      }
    },
    {
      name: "reference",
      label: "Reference Number",
      type: "text",
      placeholder: "Enter reference",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50
      },
      ui: {
        icon: "hash",
        helper: "External reference (check number, invoice number, etc.)"
      }
    }
  ]
}
```

#### Section 2: Payment Voucher Specific Fields
```typescript
{
  section: "Payment Details",
  layout: "two-column",
  conditional: {
    showWhen: {
      field: "voucherType",
      equals: "payment"
    }
  },
  fields: [
    {
      name: "payee",
      label: "Payee Name",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/parties/active",
        queryParams: {
          type: "vendor,contractor,employee"
        },
        displayField: "name",
        valueField: "id",
        additionalFields: ["type", "category"]
      },
      ui: {
        icon: "user",
        searchable: true,
        helper: "Select person/entity to pay"
      }
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "cash", label: "Cash" },
          { value: "bank", label: "Bank Transfer" },
          { value: "check", label: "Check" },
          { value: "mobile", label: "Mobile Banking" }
        ]
      },
      ui: {
        icon: "credit-card"
      }
    },
    {
      name: "bankDetails",
      label: "Bank Details",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/banks",
        dependsOn: "paymentMethod",
        conditional: {
          when: "paymentMethod IN ['bank', 'check']"
        }
      },
      ui: {
        icon: "bank"
      }
    },
    {
      name: "checkNumber",
      label: "Check Number",
      type: "text",
      placeholder: "Enter check number",
      required: true,
      validation: {
        pattern: "^\\d{6,10}$"
      },
      conditional: {
        showWhen: {
          field: "paymentMethod",
          equals: "check"
        }
      },
      ui: {
        icon: "file-text"
      }
    }
  ]
}
```

#### Section 3: Receipt Voucher Specific Fields
```typescript
{
  section: "Receipt Details",
  layout: "two-column",
  conditional: {
    showWhen: {
      field: "voucherType",
      equals: "receipt"
    }
  },
  fields: [
    {
      name: "payer",
      label: "Payer Name",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/parties/active",
        queryParams: {
          type: "client,investor"
        },
        displayField: "name",
        valueField: "id",
        additionalFields: ["type", "category"]
      },
      ui: {
        icon: "user",
        searchable: true,
        helper: "Select person/entity receiving payment"
      }
    },
    {
      name: "receiptMethod",
      label: "Receipt Method",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "cash", label: "Cash" },
          { value: "bank", label: "Bank Transfer" },
          { value: "check", label: "Check" },
          { value: "mobile", label: "Mobile Banking" }
        ]
      },
      ui: {
        icon: "credit-card"
      }
    },
    {
      name: "invoiceReference",
      label: "Invoice Reference",
      type: "text",
      placeholder: "Enter invoice number",
      required: false,
      validation: {
        pattern: "^[A-Z0-9\\-]+$"
      },
      ui: {
        icon: "file-text",
        helper: "Reference to invoice being paid"
      }
    }
  ]
}
```

#### Section 4: Journal Voucher Line Items (Dynamic)
```typescript
{
  section: "Journal Entries",
  layout: "dynamic-table",
  fields: [
    {
      name: "lineItems",
      type: "dynamic-array",
      required: true,
      minItems: 2,
      maxItems: 20,
      validation: {
        rule: "totalDebit must equal totalCredit"
      },
      fields: [
        {
          name: "account",
          label: "Account",
          type: "select",
          required: true,
          options: {
            source: "api",
            endpoint: "/api/v1/chart-of-accounts/active",
            displayField: "accountName",
            valueField: "id",
            additionalFields: ["accountCode", "accountType", "balance"]
          },
          ui: {
            searchable: true,
            width: "200px",
            helper: "Select debit/credit account"
          }
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: true,
          validation: {
            minLength: 5,
            maxLength: 100
          },
          ui: {
            placeholder: "Enter description",
            width: "150px"
          }
        },
        {
          name: "debitAmount",
          label: "Debit Amount",
          type: "currency",
          required: false,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            placeholder: "0.00",
            width: "120px",
            onChange: "validateBalance"
          }
        },
        {
          name: "creditAmount",
          label: "Credit Amount",
          type: "currency",
          required: false,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            placeholder: "0.00",
            width: "120px",
            onChange: "validateBalance"
          }
        },
        {
          name: "actions",
          type: "actions",
          ui: {
            removeButton: true,
            width: "50px"
          }
        }
      ],
      ui: {
        addButtonText: "Add Line Item",
        tableLayout: true,
        showTotals: true,
        balanceCheck: true
      }
    }
  ]
}
```

#### Section 5: Single Account Voucher (Simplified)
```typescript
{
  section: "Account Details",
  layout: "two-column",
  conditional: {
    showWhen: {
      field: "voucherType",
      notEquals: "journal"
    }
  },
  fields: [
    {
      name: "account",
      label: "Account",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/chart-of-accounts/active",
        displayField: "accountName",
        valueField: "id",
        additionalFields: ["accountCode", "accountType", "balance"]
      },
      ui: {
        icon: "book",
        searchable: true,
        helper: "Select account for this transaction"
      }
    },
    {
      name: "amount",
      label: "Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Transaction amount"
      }
    },
    {
      name: "narration",
      label: "Narration",
      type: "textarea",
      placeholder: "Enter transaction narration...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Detailed description of transaction"
      }
    }
  ]
}
```

#### Section 6: Additional Information
```typescript
{
  section: "Additional Information",
  layout: "single-column",
  fields: [
    {
      name: "costCenter",
      label: "Cost Center",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/cost-centers/active",
        displayField: "name",
        valueField: "id"
      },
      ui: {
        icon: "tag",
        helper: "Cost center for expense allocation"
      }
    },
    {
      name: "project",
      label: "Project",
      type: "select",
      required: false,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/active",
        displayField: "projectName",
        valueField: "id"
      },
      ui: {
        icon: "building",
        helper: "Project reference (if applicable)"
      }
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Enter any additional notes...",
      required: false,
      validation: {
        maxLength: 300
      },
      ui: {
        icon: "file-text",
        rows: 2
      }
    },
    {
      name: "attachments",
      label: "Attachments",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 5,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "paperclip",
        multiple: true,
        preview: false,
        helper: "Upload supporting documents"
      }
    }
  ]
}
```

### Form Submission Flow

#### Double-Entry Validation
```typescript
const validateDoubleEntry = (lineItems: LineItem[]): ValidationResult => {
  const totalDebit = lineItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0);
  const totalCredit = lineItems.reduce((sum, item) => sum + (item.creditAmount || 0), 0);
  
  const difference = Math.abs(totalDebit - totalCredit);
  
  if (difference > 0.01) { // Allow for rounding differences
    return {
      isValid: false,
      errors: [
        {
          field: "lineItems",
          message: `Debit and credit amounts must be equal. Difference: ৳${difference.toFixed(2)}`
        }
      ]
    };
  }
  
  return { isValid: true, errors: [] };
};
```

#### Voucher Number Generation
```typescript
const generateVoucherNumber = (voucherType: string, date: Date): string => {
  const typeCode = {
    payment: 'PV',
    receipt: 'RV',
    journal: 'JV',
    contra: 'CV'
  };
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Get last voucher number for this type and month
  const lastNumber = await getLastVoucherNumber(voucherType, year, month);
  const nextNumber = String(lastNumber + 1).padStart(4, '0');
  
  return `${typeCode}-${year}${month}-${nextNumber}`;
};
```

---

## 📝 Form 2: Account Creation Form

### Form Architecture
```typescript
interface AccountFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  hierarchicalStructure: true;
  accountCodeGeneration: true;
}
```

### Form Structure Design

#### Section 1: Account Information
```typescript
{
  section: "Account Information",
  layout: "two-column",
  fields: [
    {
      name: "accountName",
      label: "Account Name",
      type: "text",
      placeholder: "Enter account name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
        pattern: "^[a-zA-Z0-9\\s\\-\\.']+$"
      },
      ui: {
        icon: "book",
        size: "large",
        autoFocus: true,
        helper: "Account name as it will appear in reports"
      }
    },
    {
      name: "accountType",
      label: "Account Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "asset", label: "Asset", icon: "trending-up", color: "#10B981" },
          { value: "liability", label: "Liability", icon: "trending-down", color: "#EF4444" },
          { value: "equity", label: "Equity", icon: "pie-chart", color: "#3B82F6" },
          { value: "revenue", label: "Revenue", icon: "bar-chart", color: "#8B5CF6" },
          { value: "expense", label: "Expense", icon: "bar-chart-2", color: "#F59E0B" }
        ]
      },
      validation: {
        required: true
      },
      ui: {
        icon: "type",
        helper: "Select account type for classification"
      }
    },
    {
      name: "accountCategory",
      label: "Account Category",
      type: "select",
      required: true,
      options: {
        source: "dynamic",
        endpoint: "/api/v1/chart-of-accounts/categories",
        dependsOn: "accountType"
      },
      ui: {
        icon: "folder",
        helper: "Select account category"
      }
    },
    {
      name: "parentAccount",
      label: "Parent Account",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/chart-ofaccounts/hierarchy",
        queryParams: {
          accountType: "{accountType}",
          accountCategory: "{accountCategory}"
        },
        dependsOn: ["accountType", "accountCategory"],
        displayField: "accountName",
        valueField: "id",
        additionalFields: ["accountCode", "level"]
      },
      ui: {
        icon: "folder-tree",
        searchable: true,
        helper: "Select parent account in hierarchy"
      }
    }
  ]
}
```

#### Section 2: Account Details
```typescript
{
  section: "Account Details",
  layout: "two-column",
  fields: [
    {
      name: "accountCode",
      label: "Account Code",
      type: "text",
      placeholder: "Auto-generated",
      required: true,
      validation: {
        pattern: "^\\d{4}-\\d{3}-\\d{3}$",
        customMessage: "Format: 0000-000-000"
      },
      ui: {
        icon: "hash",
        disabled: true,
        autoGenerate: true,
        helper: "Auto-generated based on category and parent"
      }
    },
    {
      name: "openingBalance",
      label: "Opening Balance",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "Prefix",
        helper: "Opening balance for this account"
      }
    },
    {
      name: "balanceType",
      label: "Balance Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "debit", label: "Debit Balance" },
          { value: "credit", label: "Credit Balance" }
        ]
      },
      ui: {
        icon: "scale"
      }
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "BDT", label: "Bangladeshi Taka (৳)" },
          { value: "USD", label: "US Dollar ($)" },
          { value: "EUR", label: "Euro (€)" }
        ]
      },
      ui: {
        icon: "dollar-sign",
        defaultValue: "BDT"
      }
    }
  ]
}
```

#### Section 3: Additional Settings
```typescript
{
  section: "Additional Settings",
  layout: "single-column",
  fields: [
    {
      name: "description",
      label: "Account Description",
      type: "textarea",
      placeholder: "Enter account description...",
      required: false,
      validation: {
        maxLength: 200
      },
      ui: {
        icon: "file-text",
        rows: 2
      }
    },
    {
      name: "isActive",
      label: "Active Status",
      type: "checkbox",
      required: false,
      defaultValue: true,
      ui: {
        helper: "Account will be available for transactions"
      }
    },
    {
      name: "allowManualEntry",
      label: "Allow Manual Entry",
      type: "checkbox",
      required: false,
      defaultValue: true,
      ui: {
        helper: "Allow direct posting to this account"
      }
    },
    {
      name: "requiresApproval",
      label: "Requires Approval",
      type: "checkbox",
      required: false,
      defaultValue: false,
      ui: {
        helper: "Transactions require manager approval before posting"
      }
    }
  ]
}
```

---

## 📝 Form 3: Bank Reconciliation Form

### Form Architecture
```typescript
interface BankReconciliationFormArchitecture {
  form: "modal";
  layout: "single-column";
  validation: "real-time";
  submission: "async";
  statementUpload: true;
  transactionMatching: true;
  discrepancyHandling: true;
}
```

### Form Structure Design

#### Section 1: Reconciliation Information
```typescript
{
  section: "Reconciliation Information",
  layout: "two-column",
  fields: [
    {
      name: "bankAccount",
      label: "Select Bank Account",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/cash-bank/bank-accounts",
        displayField: "accountName",
        valueField: "id",
        additionalFields: ["accountNumber", "bankName", "currentBalance"]
      },
      ui: {
        icon: "bank",
        searchable: true,
        helper: "Select bank account to reconcile"
      }
    },
    {
      name: "statementPeriod",
      label: "Statement Period",
      type: "daterange",
      required: true,
      validation: {
        maxDays: 31
      },
      ui: {
        icon: "calendar",
        helper: "Bank statement period"
      }
    },
    {
      name: "statementBalance",
      label: "Statement Balance",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Ending balance as per bank statement"
      }
    },
    {
      name: "systemBalance",
      label: "System Balance",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "database",
        prefix: "৳",
        disabled: true,
        calculated: true,
        helper: "Current balance in system"
      }
    }
  ]
}
```

#### Section 2: Statement Upload
```typescript
{
  section: "Statement Upload",
  layout: "single-column",
  fields: [
    {
      name: "statementFile",
      label: "Bank Statement",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 1,
        maxSize: "10MB",
        allowedTypes: ["application/pdf"]
      },
      ui: {
        icon: "file",
        multiple: false,
        preview: false,
        helper: "Upload bank statement (PDF format required)"
      }
    },
    {
      name: "statementReference",
      label: "Statement Reference",
      type: "text",
      placeholder: "Enter statement reference",
      required: false,
      validation: {
        maxLength: 50
      },
      ui: {
        icon: "hash",
        helper: "Bank statement reference number"
      }
    }
  ]
}
```

#### Section 3: Discrepancy Handling
```typescript
{
  section: "Discrepancy Resolution",
  layout: "single-column",
  conditional: {
    showWhen: {
      field: "hasDiscrepancy",
      equals: true
    }
  },
  fields: [
    {
      name: "discrepancyAmount",
      label: "Discrepancy Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "alert-triangle",
        prefix: "৳",
        disabled: true,
        calculated: true
      }
    },
    {
      name: "discrepancyReason",
      label: "Reason for Discrepancy",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "bank_charge", label: "Bank Charges" },
          { value: "interest", label: "Interest Not Recorded" },
          { value: "unpresented_cheque", label: "Unpresented Cheque" },
          { value: "timing_difference", label: "Timing Difference" },
          { value: "other", label: "Other" }
        ]
      },
      ui: {
        icon: "help-circle"
      }
    },
    {
      name: "discrepancyAction",
      label: "Action Required",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "adjust", label: "Adjust System Balance" },
          { value: "create_entry", label: "Create Adjustment Entry" },
          { value: "ignore", label: "Ignore (Document in Notes)" },
          { value: "investigate", label: "Investigate Further" }
        ]
      },
      ui: {
        icon: "settings"
      }
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Enter explanation for discrepancy...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 300
      },
      ui: {
        icon: "file-text",
        rows: 3
      }
    }
  ]
}
```

---

## 🎯 Button Functionality Mapping

### Vouchers Page Buttons
```typescript
const voucherPageButtons = {
  "New Voucher": {
    action: "openModal",
    modal: "VoucherForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Post Voucher": {
    action: "postVoucher",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "voucher.status === 'draft'"
  },
  "Cancel Voucher": {
    action: "cancelVoucher",
    icon: "x-circle",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "voucher.status === 'draft'"
  },
  "View Details": {
    action: "navigate",
    route: "/vouchers/:id",
    icon: "eye",
    variant: "ghost",
    size: "small"
  },
  "Print Voucher": {
    action: "printDocument",
    documentType: "voucher",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "voucher.status === 'posted'"
  }
};
```

### General Ledger Page Buttons
```typescript
const ledgerPageButtons = {
  "View Account Ledger": {
    action: "navigate",
    route: "/ledger/:accountId",
    icon: "book",
    variant: "outline",
    size: "medium"
  },
  "Trial Balance": {
    action: "generateReport",
    reportType: "trial-balance",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  },
  "Export Ledger": {
    action: "exportData",
    format: ["excel", "pdf"],
    icon: "download",
    variant: "outline",
    size: "medium"
  },
  "Search Entries": {
    action: "openSearchPanel",
    icon: "search",
    variant: "outline",
    size: "medium"
  }
};
```

### Receivables Page Buttons
```typescript
const receivablesButtons = {
  "Record Payment": {
    action: "openModal",
    modal: "PaymentForm",
    icon: "credit-card",
    variant: "primary",
    size: "medium"
  },
  "Send Reminder": {
    action: "sendNotification",
    notificationType: "payment-reminder",
    icon: "bell",
    variant: "outline",
    size: "small",
    condition: "payment.status === 'overdue'"
  },
  "Aging Report": {
    action: "generateReport",
    reportType: "aging-report",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  },
  "Collection Report": {
    action: "generateReport",
    reportType: "collection-report",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  }
};
```

### Payables Page Buttons
```typescript
const payablesButtons = {
  "Process Payment": {
    action: "openModal",
    modal: "PaymentForm",
    icon: "credit-card",
    variant: "primary",
    size: "medium"
  },
  "Send Reminder": {
    action: "sendNotification",
    notificationType: "payment-reminder",
    icon: "bell",
    variant: "outline",
    size: "small",
    condition: "payment.status === 'overdue'"
  },
  "Aging Report": {
    action: "generateReport",
    reportType: "aging-report",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  },
  "Payment Report": {
    action: "generateReport",
    reportType: "payment-report",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  }
};
```

---

## 📊 Data Flow Architecture

### Voucher Posting Data Flow
```
Voucher Creation → Line Item Entry → Double-Entry Validation → Account Balance Check → Approval (if required) → Posting to Ledger → General Ledger Update → Trial Balance Update → Financial Report Update → Notification
```

### Payment Processing Data Flow
```
Payment Request → Payment Method Selection → Bank Account Validation → Amount Validation → Payment Processing → Ledger Entry Creation → Vendor/Client Account Update → Bank Account Update → Receipt Generation → Notification → Dashboard Update
```

### Reconciliation Data Flow
```
Bank Account Selection → Statement Period Selection → Statement Upload → System Balance Comparison → Transaction Matching → Discrepancy Identification → Resolution Action → Adjustment Entry Creation → Reconciliation Completion → Report Generation
```

---

## 🔗 Module Relationships

### Vouchers ↔ Chart of Accounts Relationship
```typescript
interface VoucherAccountRelationship {
  type: "many-to-many",
  cascade: "restrict";
  foreignKey: "voucherId";
  junctionTable: "voucher_line_items";
  constraints: {
    posting: "Cannot modify posted vouchers",
    balance: "Account must have sufficient balance for debit"
  };
}
```

### Vouchers ↔ General Ledger Relationship
```typescript
interface VoucherLedgerRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "voucherId";
  constraints: {
    posting: "Posted vouchers create ledger entries",
    reversal: "Cancelled vouchers create reversal entries"
  };
}
```

### Vouchers ↔ Cash & Bank Relationship
```typescript
interface VoucherCashBankRelationship {
  type: "many-to-one";
  cascade: "restrict";
  foreignKey: "cashBankId";
  constraints: {
    type: "Payment vouchers must debit cash/bank",
    amount: "Cannot exceed available balance"
  };
}
```

### Receivables ↔ Invoices Relationship
```typescript
interface ReceivableInvoiceRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "invoiceId";
  constraints: {
    amount: "Total payments cannot exceed invoice amount",
    status: "Only issued invoices can have receivables"
  };
}
```

---

## 🎨 UI Component Specifications

### Voucher Status Card Component
```typescript
interface VoucherCardProps {
  voucher: Voucher;
  onPost: (id: string) => void;
  onCancel: (id: string) => void;
  onView: (id: string) => void;
}

const VoucherCard = ({ voucher, onPost, onCancel, onView }: VoucherCardProps) => {
  return (
    <Card className="voucher-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="voucher-number">{voucher.voucherNumber}</h3>
            <p className="voucher-type">{voucher.voucherType}</p>
          </div>
          <Badge variant={getStatusVariant(voucher.status)}>
            {voucher.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <InfoRow icon="calendar" label="Date" value={formatDate(voucher.voucherDate)} />
          <InfoRow icon="book" label="Account" value={voucher.accountName} />
          <InfoRow icon="hash" label="Reference" value={voucher.reference} />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm font-medium">Amount</span>
            <span className="voucher-amount">{formatCurrency(voucher.amount)}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {voucher.status === 'draft' && (
            <>
              <Button onClick={() => onPost(voucher.id)} variant="outline" size="sm">
                <CheckCircle className="mr-2 h-4 w-4" /> Post
              </Button>
              <Button onClick={() => onCancel(voucher.id)} variant="ghost" size="sm" className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </>
          )}
          <Button onClick={() => onView(voucher.id)} variant="ghost" size="sm">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Account Tree Component
```typescript
interface AccountTreeProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  level: number;
}

const AccountTree = ({ accounts, onSelectAccount, level }: AccountTreeProps) => {
  return (
    <div className="account-tree">
      {accounts.map(account => (
        <div key={account.id} style={{ marginLeft: `${level * 20}px` }}>
          <AccountNode 
            account={account} 
            onSelect={onSelectAccount}
            hasChildren={account.children?.length > 0}
          />
          {account.children?.length > 0 && (
            <AccountTree 
              accounts={account.children} 
              onSelectAccount={onSelectAccount}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## 📱 Responsive Design Breakpoints

```css
/* Financial Dashboard Responsive */
@media (min-width: 1024px) {
  .financial-dashboard {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .financial-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .financial-dashboard {
    grid-template-columns: 1fr;
  }
  
  .voucher-table {
    font-size: 12px;
  }
  
  .account-tree {
    padding: 12px;
  }
}
```

---

## 🔒 Security & Validation Rules

### Financial Data Protection
```typescript
const financialDataProtection = {
  encryption: {
    fields: ['bankAccount', 'amount', 'balance'],
    algorithm: 'AES-256'
  },
  accessControl: {
    view: ['admin', 'accountant', 'finance-manager', 'auditor'],
    edit: ['admin', 'accountant', 'finance-manager'],
    post: ['admin', 'accountant', 'finance-manager'],
    cancel: ['admin', 'finance-manager']
  },
  auditLog: {
    events: ['VOUCHER_CREATED', 'VOUCHER_POSTED', 'VOUCHER_CANCELLED', 'ACCOUNT_CREATED', 'RECONCILIATION_COMPLETED', 'PAYMENT_PROCESSED']
  }
};
```

### Financial Validation
```typescript
const financialValidation = {
  voucher: {
    maxAmount: 1000000000, // Max 10 crore per voucher
    maxLineItems: 20,
    postingPeriod: "Can only post within current fiscal year"
  },
  payment: {
    maxAmount: 50000000, // Max 5 crore per payment
    maxFrequency: "Max 10 payments per day per user"
  },
  reconciliation: {
    maxDiscrepancy: 100000, // Max 1 lakh discrepancy auto-approval
    maxUnmatched: 20 // Max 20 unmatched transactions allowed
  }
};
```

---

## 📈 Performance Optimization

### Voucher Calculation Caching
```typescript
const voucherCacheConfig = {
  keyGenerator: (voucherType: string, date: string) => 
    `voucher-${voucherType}-${date}`,
  ttl: 300000, // 5 minutes
  storage: 'memory'
};
```

### Account Tree Caching
```typescript
const accountTreeCache = {
  keyGenerator: (accountType: string) => 
    `account-tree-${accountType}`,
  ttl: 600000, // 10 minutes
  storage: 'localStorage'
};
```

---

## 🎯 Success Metrics

### Accounting Metrics
```typescript
const accountingMetrics = {
  voucher: {
    targetTime: "4 minutes",
    targetErrorRate: "< 1%",
    targetSuccessRate: "> 99%"
  },
  reconciliation: {
    targetTime: "15 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  },
  payment: {
    targetTime: "3 minutes",
    targetErrorRate: "< 1%",
    targetSuccessRate: "> 99%"
  }
};
```

---

## 📋 Testing Checklist

### Voucher Form Testing
- [ ] Voucher type selection and conditional fields
- [ ] Single account vs journal voucher mode
- [ ] Line item addition/removal
- [ ] Double-entry validation
- [ ] Account balance checking
- [ ] Payee/payer selection
- [ ] Payment method conditional fields
- [ ] Amount validation
- [ ] Posting workflow
- [ ] Cancellation workflow

### Account Form Testing
- [ ] Account type and category selection
- [ ] Parent account selection
- [ ] Account code generation
- [] Opening balance validation
- [] Currency selection
- [] Account hierarchy validation
- [] Duplicate account detection

### Reconciliation Form Testing
- [ ] Bank account selection
- [ ] Statement upload and parsing
- | Balance comparison
- [ ] Transaction matching
- [ ] Discrepancy identification
- [ ] Adjustment entry creation
- [ ] Reconciliation report generation
