## 📊 SLBL-ERP Accounting Document Architecture & Flow Design

### 🎯 **Document Types Definition**

| Document Type | Purpose | Direction | When Generated |
|---------------|---------|-----------|----------------|
| **Invoice** | ক্লায়েন্ট থেকে টাকা দাবি করা | Credit (Receivable) | Booking, Installment, Service billing |
| **Money Receipt** | ক্লায়েন্ট থেকে টাকা গ্রহণের প্রমাণ | Debit (Cash/Bank) | Payment collection against invoice |
| **Debit Voucher** | কোম্পানির খরচ/expense রেকর্ড | Debit (Expense) | Salary, Vendor payment, Official expense |
| **Credit Voucher** | কোম্পানির আয়/income রেকর্ড | Credit (Income) | Investor payment, Sale of other assets |

---

### 🏗️ **Module-wise Document Flow**

#### **Module 1: Clients & Sales**

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT BOOKING FLOW                        │
├─────────────────────────────────────────────────────────────┤
│  1. Add Client (ClientForm.tsx)                              │
│     ↓                                                        │
│  2. Create Booking (CreateBookingModal.tsx)                  │
│     → Generates: BOOKING MONEY INVOICE (optional)           │
│     → Records: Booking Money Due Amount                     │
│     ↓                                                        │
│  3. Create Installment Schedule (CreateInstallmentModal.tsx) │
│     → Creates: Installment milestones with due dates         │
│     → Auto-generates: INSTALLMENT INVOICES                  │
│     ↓                                                        │
│  4. Collect Payment (CollectPaymentModal.tsx)                │
│     → Against: Installment Invoice / Booking Money          │
│     → Generates: MONEY RECEIPT                              │
│     → Updates: Invoice status (PAID/PARTIAL)                 │
│     → Posts: To Client Ledger (Credit)                       │
└─────────────────────────────────────────────────────────────┘
```

**Where to Create/Manage:**
- **Client Add:** `/clients/ClientList.tsx` → "Add Client" button → `ClientForm.tsx`
- **Booking Entry:** `/clients/Bookings.tsx` → "Create Booking" button → `CreateBookingModal.tsx`
- **Installment Schedule:** `/clients/Installments.tsx` → "Add Installment" button → `CreateInstallmentModal.tsx`
- **Payment Collection:** `/clients/Installments.tsx` → "Collect" button OR `/clients/Bookings.tsx` → "Collect Payment" button → `CollectPaymentModal.tsx` (UNIFIED)

---

#### **Module 2: Construction & Procurement**

```
┌─────────────────────────────────────────────────────────────┐
│              CONSTRUCTION & VENDOR FLOW                      │
├─────────────────────────────────────────────────────────────┤
│  1. Site Requisition (CreateRequisitionModal.tsx)            │
│     → Materials/Equipment request from site                 │
│     ↓                                                        │
│  2. PO Issued to Vendor (CreatePurchaseOrderModal.tsx)       │
│     → Generates: PURCHASE ORDER (Not voucher yet)            │
│     ↓                                                        │
│  3. Material Received (GRN - Goods Received Note)            │
│     ↓                                                        │
│  4. Vendor Bill Received                                     │
│     → Generates: VENDOR INVOICE (Credit to Vendor)           │
│     ↓                                                        │
│  5. Vendor Payment (PayVendorModal.tsx)                     │
│     → Against: Vendor Invoice                              │
│     → Generates: DEBIT VOUCHER (Expense)                    │
│     → Posts: To Vendor Ledger (Debit)                       │
│     → Updates: Vendor Invoice status (PAID/PARTIAL)          │
└─────────────────────────────────────────────────────────────┘
```

**Where to Create/Manage:**
- **Site Requisition:** `/construction/site-requisitions` → "Create Requisition" → `CreateRequisitionModal.tsx`
- **Purchase Order:** `/procurement/purchase-orders` → "Create PO" → `CreatePurchaseOrderModal.tsx`
- **Vendor Bill Entry:** `/procurement/vendor-bills` → "Add Vendor Bill" → `VendorBillModal.tsx`
- **Vendor Payment:** `/procurement/vendor-payments` → "Pay Vendor" button → `PayVendorModal.tsx` (UNIFIED with DEBIT VOUCHER)

---

#### **Module 3: HR & Payroll**

```
┌─────────────────────────────────────────────────────────────┐
│                    HR & PAYROLL FLOW                         │
├─────────────────────────────────────────────────────────────┤
│  1. Process Salary (ProcessSalaryModal.tsx)                  │
│     → Calculates: Net salary for all employees               │
│     → Generates: SALARY INVOICE (Credit to Employee)         │
│     ↓                                                        │
│  2. Salary Disbursement (DisburseSalaryModal.tsx)            │
│     → Against: Salary Invoice                               │
│     → Generates: DEBIT VOUCHER (Expense)                     │
│     → Posts: To Employee Ledger (Debit - payable)           │
│     → Updates: Salary Invoice status (PAID)                  │
│     ↓                                                        │
│  3. Money Receipt (if paid by employee in cash)              │
│     → Alternative: Bank transfer (no receipt needed)         │
└─────────────────────────────────────────────────────────────┘
```

**Where to Create/Manage:**
- **Salary Processing:** `/hr/payroll` → "Process Salary" button → `ProcessSalaryModal.tsx`
- **Salary Disbursement:** `/hr/payroll` → "Disburse Salary" button → `DisburseSalaryModal.tsx` (UNIFIED with DEBIT VOUCHER)

---

#### **Module 4: Investors**

```
┌─────────────────────────────────────────────────────────────┐
│                    INVESTOR FLOW                             │
├─────────────────────────────────────────────────────────────┤
│  1. Add Investor (InvestorForm.tsx)                          │
│     ↓                                                        │
│  2. Record Investment (AddInvestmentModal.tsx)               │
│     → Investor pays money to company                        │
│     → Generates: MONEY RECEIPT                              │
│     → Generates: CREDIT VOUCHER (Income)                    │
│     → Posts: To Investor Ledger (Credit - capital)          │
│     ↓                                                        │
│  3. Profit Distribution / Return of Investment              │
│     → Company pays to investor                              │
│     → Generates: DEBIT VOUCHER (Expense)                    │
│     → Posts: To Investor Ledger (Debit - payable)           │
└─────────────────────────────────────────────────────────────┘
```

**Where to Create/Manage:**
- **Investor Add:** `/investors` → "Add Investor" button → `InvestorForm.tsx`
- **Investment Received:** `/investors` → "Record Investment" button → `AddInvestmentModal.tsx` (UNIFIED - generates both Money Receipt + Credit Voucher)
- **Profit/Return Payment:** `/investors` → "Pay Investor" button → `PayInvestorModal.tsx` (UNIFIED with DEBIT VOUCHER)

---

#### **Module 5: Official Expenses (General)**

```
┌─────────────────────────────────────────────────────────────┐
│                  OFFICIAL EXPENSE FLOW                       │
├─────────────────────────────────────────────────────────────┤
│  1. Create Expense Voucher (CreateExpenseVoucherModal.tsx)   │
│     → Categories: Rent, Utilities, Office Supplies,          │
│                   Marketing, Legal, Maintenance, etc.        │
│     → Generates: DEBIT VOUCHER (Expense)                    │
│     → Posts: To Expense Ledger (Debit)                      │
│     → Updates: Cash/Bank Account (Credit)                    │
└─────────────────────────────────────────────────────────────┘
```

**Where to Create/Manage:**
- **Official Expense:** `/accounting/expenses` → "Create Expense Voucher" button → `CreateExpenseVoucherModal.tsx` (UNIFIED with DEBIT VOUCHER)

---

### 🔄 **Unified Payment Collection Modal (No Duplicate)**

#### **Single Modal: `CollectPaymentModal.tsx`**

**This modal will handle ALL payment collections:**

| Payment Source | Used In | Generates |
|----------------|---------|-----------|
| Client Installment | Installments page, Bookings page | Money Receipt + Ledger Post |
| Client Booking Money | Bookings page | Money Receipt + Ledger Post |
| Vendor Payment | Procurement page | Debit Voucher + Ledger Post |
| Salary Disbursement | HR Payroll page | Debit Voucher + Ledger Post |
| Investor Return | Investors page | Debit Voucher + Ledger Post |

**Modal Structure:**
```typescript
interface CollectPaymentModalProps {
  paymentType: "CLIENT_PAYMENT" | "VENDOR_PAYMENT" | "SALARY_PAYMENT" | "INVESTOR_PAYMENT";
  referenceId: string; // Invoice ID / Employee ID / Vendor ID
  referenceType: "INVOICE" | "SALARY_INVOICE" | "VENDOR_INVOICE" | "INVESTOR";
  defaultAmount?: number;
}
```

**Based on `paymentType`, it generates:**
- `CLIENT_PAYMENT` → Money Receipt
- `VENDOR_PAYMENT` → Debit Voucher
- `SALARY_PAYMENT` → Debit Voucher
- `INVESTOR_PAYMENT` → Debit Voucher

---

### 📋 **Document Generation Matrix**

| Source Action | Document Generated | Modal Used | Print Modal |
|---------------|-------------------|------------|-------------|
| **Client Booking Created** | Booking Money Invoice (optional) | `CreateBookingModal.tsx` | `InvoicePrintModal.tsx` |
| **Installment Created** | Installment Invoice (auto) | `CreateInstallmentModal.tsx` | `InvoicePrintModal.tsx` |
| **Client Payment Collected** | Money Receipt | `CollectPaymentModal.tsx` | `MoneyReceiptPrintModal.tsx` |
| **Vendor Bill Paid** | Debit Voucher | `CollectPaymentModal.tsx` | `DebitVoucherPrintModal.tsx` |
| **Salary Disbursed** | Debit Voucher | `CollectPaymentModal.tsx` | `DebitVoucherPrintModal.tsx` |
| **Investor Investment Received** | Money Receipt + Credit Voucher | `AddInvestmentModal.tsx` | `MoneyReceiptPrintModal.tsx` + `CreditVoucherPrintModal.tsx` |
| **Official Expense Recorded** | Debit Voucher | `CreateExpenseVoucherModal.tsx` | `DebitVoucherPrintModal.tsx` |
| **Other Income Received** | Credit Voucher | `CreateIncomeVoucherModal.tsx` | `CreditVoucherPrintModal.tsx` |

---

### 🎨 **Required Modals (No Duplicate)**

#### **Core Modals (Unified):**

| Modal | Purpose | Used In |
|-------|---------|---------|
| `CollectPaymentModal.tsx` | Unified payment collection (generates Money Receipt or Debit Voucher based on type) | All modules |
| `CreateInvoiceModal.tsx` | Create manual invoice (already exists) | Accounting |
| `CreateExpenseVoucherModal.tsx` | Official expense entry | Accounting |
| `CreateIncomeVoucherModal.tsx` | Other income entry | Accounting |

#### **Print Modals (Specific):**

| Print Modal | Purpose |
|-------------|---------|
| `InvoicePrintModal.tsx` | Print Sales Invoice |
| `MoneyReceiptPrintModal.tsx` | Print Money Receipt |
| `DebitVoucherPrintModal.tsx` | Print Debit Voucher |
| `CreditVoucherPrintModal.tsx` | Print Credit Voucher |

---

### 📊 **Accounting Ledger Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                 GENERAL LEDGER POSTING                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INVOICE GENERATED:                                          │
│  ├─ Debit: Accounts Receivable (Client Ledger)              │
│  └─ Credit: Sales Revenue / Income                          │
│                                                              │
│  MONEY RECEIPT ISSUED:                                       │
│  ├─ Debit: Cash / Bank Account                              │
│  └─ Credit: Accounts Receivable (Client Ledger)             │
│                                                              │
│  DEBIT VOUCHER (Expense):                                    │
│  ├─ Debit: Expense Account (Salary, Vendor, Office, etc.)  │
│  └─ Credit: Cash / Bank Account                            │
│                                                              │
│  CREDIT VOUCHER (Income):                                    │
│  ├─ Debit: Cash / Bank Account                              │
│  └─ Credit: Income Account (Investment, Other Income)       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 🗂️ **Page-wise Button to Modal Mapping**

| Page | Button | Modal Opened | Document Generated |
|------|--------|--------------|-------------------|
| `/clients/ClientList.tsx` | Add Client | `ClientForm.tsx` | None (data entry) |
| `/clients/Bookings.tsx` | Create Booking | `CreateBookingModal.tsx` | Booking Money Invoice (optional) |
| `/clients/Bookings.tsx` | Collect Payment | `CollectPaymentModal.tsx` (type: CLIENT_PAYMENT) | Money Receipt |
| `/clients/Installments.tsx` | Add Installment | `CreateInstallmentModal.tsx` | Installment Invoice (auto) |
| `/clients/Installments.tsx` | Collect | `CollectPaymentModal.tsx` (type: CLIENT_PAYMENT) | Money Receipt |
| `/construction/site-requisitions` | Create Requisition | `CreateRequisitionModal.tsx` | None (request) |
| `/procurement/purchase-orders` | Create PO | `CreatePurchaseOrderModal.tsx` | Purchase Order |
| `/procurement/vendor-bills` | Add Vendor Bill | `VendorBillModal.tsx` | Vendor Invoice |
| `/procurement/vendor-payments` | Pay Vendor | `CollectPaymentModal.tsx` (type: VENDOR_PAYMENT) | Debit Voucher |
| `/hr/payroll` | Process Salary | `ProcessSalaryModal.tsx` | Salary Invoice |
| `/hr/payroll` | Disburse Salary | `CollectPaymentModal.tsx` (type: SALARY_PAYMENT) | Debit Voucher |
| `/investors` | Add Investor | `InvestorForm.tsx` | None (data entry) |
| `/investors` | Record Investment | `AddInvestmentModal.tsx` | Money Receipt + Credit Voucher |
| `/investors` | Pay Investor | `CollectPaymentModal.tsx` (type: INVESTOR_PAYMENT) | Debit Voucher |
| `/accounting/expenses` | Create Expense | `CreateExpenseVoucherModal.tsx` | Debit Voucher |
| `/accounting/income` | Record Income | `CreateIncomeVoucherModal.tsx` | Credit Voucher |
| `/accounting/invoices-receipts` | Create Invoice | `CreateInvoiceModal.tsx` | Invoice |
| `/accounting/invoices-receipts` | Issue Money Receipt | `CollectPaymentModal.tsx` (type: CLIENT_PAYMENT) | Money Receipt |

---

### ✅ **Summary: No Duplicate Approach**

#### **Single Payment Collection Modal:**
- **`CollectPaymentModal.tsx`** handles ALL outflows (Debit Vouchers) AND client receipts (Money Receipts)
- Based on `paymentType` parameter, it decides what to generate
- Avoids duplicate: `PayVendorModal`, `DisburseSalaryModal`, `PayInvestorModal` → all use `CollectPaymentModal.tsx`

#### **Single Invoice Modal:**
- **`CreateInvoiceModal.tsx`** handles ALL invoice types (Sales, Installment, Vendor Bill)
- Based on `invoiceType` parameter, it customizes fields

#### **Specific Print Modals:**
- Each document type has its own print modal for proper formatting
- No generic print modal - proper legal/compliance format

---

### 🎯 **Implementation Priority**

| Priority | Component | Action |
|----------|-----------|--------|
| 🔴 **High** | `CollectPaymentModal.tsx` (unified) | Create or refactor existing |
| 🔴 **High** | `MoneyReceiptPrintModal.tsx` | Create |
| 🔴 **High** | `DebitVoucherPrintModal.tsx` | Create |
| 🔴 **High** | `CreditVoucherPrintModal.tsx` | Create |
| 🔴 **High** | `InvoicePrintModal.tsx` | Create (replace generic) |
| 🟡 **Medium** | `CreateExpenseVoucherModal.tsx` | Create |
| 🟡 **Medium** | `CreateIncomeVoucherModal.tsx` | Create |
| 🟢 **Low** | Ledger posting logic | Backend integration |

**এই architecture অনুযায়ী কোনো duplicate modal থাকবে না এবং সব payment collection একটি unified modal থেকে হবে।**