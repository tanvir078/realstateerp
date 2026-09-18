# Accounting Module Implementation Plan

## 📊 Visual Tree Structure

```
ACCOUNTING MODULE
├── 1. FOUNDATION LAYER
│   ├── API Configuration
│   ├── Service Layer Setup
│   ├── Error Handling
│   └── State Management
│
├── 2. CORE ENTITIES
│   ├── Chart of Accounts
│   ├── Vouchers (Debit/Credit/Money Receipt)
│   ├── Transactions
│   └── Accounts (Ledger Accounts)
│
├── 3. USER INTERFACE LAYER
│   ├── Accounting Dashboard
│   ├── Chart of Accounts Page
│   ├── Vouchers Management
│   ├── General Ledger
│   ├── Cash & Bank Management
│   ├── Receivables (Income)
│   ├── Payables (Expenses)
│   ├── Bank Reconciliation
│   ├── Invoices & Receipts
│   └── Reports (Trial Balance, P&L, Balance Sheet, Cash Flow)
│
└── 4. REPORTING LAYER
    ├── Trial Balance
    ├── Profit & Loss Statement
    ├── Balance Sheet
    └── Cash Flow Statement
```

---

## 🎯 Implementation Priority Sequence

### **PHASE 1: Foundation Setup (Week 1)**

#### **Step 1.1: API Configuration**
- [ ] Create API service layer structure
- [ ] Configure axios/fetch for backend communication
- [ ] Setup base URL and interceptors
- [ ] Add JWT token management
- [ ] Implement error handling middleware

**Files to Create:**
```
src/services/
├── api/
│   ├── config.ts           # API configuration
│   ├── axios.ts            # Axios setup with interceptors
│   └── error-handler.ts    # Error handling utilities
└── accounting/
    ├── accounting.service.ts    # Main accounting API service
    ├── vouchers.service.ts       # Vouchers API
    ├── chart.service.ts          # Chart of accounts API
    └── reports.service.ts        # Reports API
```

**Implementation Instructions:**
1. Create `src/services/api/config.ts` with base URL from environment
2. Setup axios instance with JWT token in headers
3. Add request/response interceptors for error handling
4. Create service functions for each accounting entity

---

#### **Step 1.2: State Management**
- [ ] Setup context/store for accounting data
- [ ] Create state for chart of accounts
- [ ] Create state for vouchers
- [ ] Create state for transactions
- [ ] Implement loading/error states

**Files to Create:**
```
src/context/
└── AccountingContext.tsx       # Global accounting state
```

**Implementation Instructions:**
1. Create context provider for accounting module
2. Add CRUD operations for entities
3. Implement optimistic updates
4. Add error state management

---

### **PHASE 2: Chart of Accounts (Week 2)**

#### **Step 2.1: API Integration**
- [ ] Connect chart of accounts to backend
- [ ] Implement CRUD operations
- [ ] Add account hierarchy support
- [ ] Validate account codes

**Backend API Endpoints:**
```
GET    /api/v1/accounting/chart-of-accounts
POST   /api/v1/accounting/chart-of-accounts
PATCH  /api/v1/accounting/chart-of-accounts/:id
DELETE /api/v1/accounting/chart-of-accounts/:id
```

**Frontend Implementation:**
- [ ] Update `ChartOfAccounts.tsx` to use real API
- [ ] Remove mock data
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement optimistic UI updates

---

#### **Step 2.2: UI Enhancement**
- [ ] Add account type filters (Asset, Liability, Equity, Income, Expense)
- [ ] Implement search functionality
- [ ] Add account hierarchy display
- [ ] Add account balance calculation
- [ ] Implement account code validation

---

### **PHASE 3: Vouchers Management (Week 3)**

#### **Step 3.1: Voucher Types Implementation**
- [ ] Debit Voucher (DV)
- [ ] Credit Voucher (CV)
- [ ] Money Receipt (MR)
- [ ] Contra Voucher
- [ ] Journal Voucher

**Backend API Endpoints:**
```
GET    /api/v1/accounting/vouchers
POST   /api/v1/accounting/vouchers
PATCH  /api/v1/accounting/vouchers/:id
DELETE /api/v1/accounting/vouchers/:id
POST   /api/v1/accounting/vouchers/:id/approve
POST   /api/v1/accounting/vouchers/:id/reject
```

**Frontend Implementation:**
- [ ] Update `Vouchers.tsx` to use real API
- [ ] Remove mock voucher data
- [ ] Implement voucher type selection
- [ ] Add approval workflow UI
- [ ] Add voucher printing functionality

---

#### **Step 3.2: Voucher Form Integration**
- [ ] Connect existing modals to backend
- [ ] Implement form validation
- [ ] Add account selection from chart of accounts
- [ ] Implement auto-debit/credit logic
- [ ] Add voucher number generation

**Files to Update:**
- `NewVoucherModal.tsx`
- `AddPayableModal.tsx`
- `ReceivablesPage.tsx`
- `CollectPaymentModal.tsx`

---

### **PHASE 4: General Ledger & Transactions (Week 4)**

#### **Step 4.1: General Ledger**
- [ ] Connect general ledger to backend
- [ ] Implement transaction display
- [ ] Add account-wise ledger view
- [ ] Implement date range filtering
- [ ] Add search functionality

**Backend API Endpoints:**
```
GET    /api/v1/accounting/general-ledger
GET    /api/v1/accounting/general-ledger/:accountId
GET    /api/v1/accounting/transactions
```

**Frontend Implementation:**
- [ ] Update `GeneralLedger.tsx` to use real API
- [ ] Remove mock transaction data
- [ ] Implement pagination
- [ ] Add export functionality

---

#### **Step 4.2: Cash & Bank Management**
- [ ] Connect cash accounts to backend
- [ ] Implement bank account management
- [ ] Add cash balance display
- [ ] Implement fund transfer functionality
- [ ] Add reconciliation status

**Backend API Endpoints:**
```
GET    /api/v1/accounting/cash-bank
POST   /api/v1/accounting/cash-bank
PATCH  /api/v1/accounting/cash-bank/:id
GET    /api/v1/accounting/cash-bank/balance
```

**Frontend Implementation:**
- [ ] Update `CashBank.tsx` to use real API
- [ ] Remove mock account data
- [ ] Implement account creation
- [ ] Add balance tracking UI

---

### **PHASE 5: Receivables & Payables (Week 5)**

#### **Step 5.1: Receivables (Income)**
- [ ] Connect receivables to backend
- [ ] Implement client collection flow
- [ ] Add income categorization
- [ ] Implement payment tracking
- [ ] Add overdue management

**Important: Separation of Client Collections**
- `CollectPaymentModal` → Only for client money receipts
- Separate credit voucher forms → Bank interest, asset sales, other income

**Backend API Endpoints:**
```
GET    /api/v1/accounting/receivables
POST   /api/v1/accounting/receivables
GET    /api/v1/accounting/receivables/overdue
POST   /api/v1/accounting/receivables/:client-id/collection
```

**Frontend Implementation:**
- [ ] Update `Receivables.tsx` to use real API
- [ ] Update `CollectPaymentModal` for client collections
- [ ] Create separate credit voucher forms
- [ ] Remove mock receivables data

---

#### **Step 5.2: Payables (Expenses)**
- [ ] Connect payables to backend
- [ ] Implement vendor payment flow
- [ ] Add expense categorization
- [ ] Implement payment tracking
- [ ] Add approval workflow

**Backend API Endpoints:**
```
GET    /api/v1/accounting/payables
POST   /api/v1/accounting/payables
GET    /api/v1/accounting/payables/pending
POST   /api/v1/accounting/payables/:id/approve
```

**Frontend Implementation:**
- [ ] Update `Payables.tsx` to use real API
- [ ] Update `AddPayableModal` for vendor payments
- [ ] Update `VendorPaymentModal` for payment processing
- [ ] Remove mock payables data

---

### **PHASE 6: Bank Reconciliation (Week 6)**

#### **Step 6.1: Reconciliation Implementation**
- [ ] Connect bank reconciliation to backend
- [ ] Implement statement upload
- [ ] Add auto-matching functionality
- [ ] Implement manual reconciliation
- [ ] Add reconciliation reports

**Backend API Endpoints:**
```
GET    /api/v1/accounting/bank-reconciliation
POST   /api/v1/accounting/bank-reconciliation
POST   /api/v1/accounting/bank-reconciliation/:id/match
POST   /api/v1/accounting/bank-reconciliation/:id/unmatch
```

**Frontend Implementation:**
- [ ] Update `BankReconciliation.tsx` to use real API
- [ ] Implement statement upload UI
- [ ] Add matching interface
- [ ] Remove mock reconciliation data

---

### **PHASE 7: Invoices & Receipts (Week 7)**

#### **Step 7.1: Invoice Management**
- [ ] Connect invoices to backend
- [ ] Implement invoice generation
- [ ] Add invoice printing
- [ ] Implement invoice tracking
- [ ] Add payment application

**Backend API Endpoints:**
```
GET    /api/v1/accounting/invoices
POST   /api/v1/accounting/invoices
PATCH  /api/v1/accounting/invoices/:id
POST   /api/v1/accounting/invoices/:id/print
```

**Frontend Implementation:**
- [ ] Update `InvoicesReceipts.tsx` to use real API
- [ ] Update `CreateInvoiceModal` for invoice creation
- [ ] Implement invoice printing
- [ ] Remove mock invoice data

---

### **PHASE 8: Financial Reports (Week 8)**

#### **Step 8.1: Trial Balance**
- [ ] Connect trial balance to backend
- [ ] Implement date range selection
- [ ] Add account grouping
- [ ] Implement export functionality
- [ ] Add printing

**Backend API Endpoints:**
```
GET    /api/v1/accounting/trial-balance?fromDate=&toDate=
POST   /api/v1/accounting/trial-balance/export
```

**Frontend Implementation:**
- [ ] Update `TrialBalance.tsx` to use real API
- [ ] Remove mock trial balance data
- [ ] Implement date filtering
- [ ] Add export/print functionality

---

#### **Step 8.2: Profit & Loss Statement**
- [ ] Connect P&L to backend
- [ **Implement period selection (monthly/quarterly/yearly)
- [ ] Add expense categorization
- [ ] Implement comparison views
- [ ] Add drill-down functionality

**Backend API Endpoints:**
```
GET    /api/v1/accounting/profit-loss?period=&year=
POST   /api/v1/accounting/profit-loss/export
```

**Frontend Implementation:**
- [ ] Update `ProfitLoss.tsx` to use real API
- [ ] Remove mock P&L data
- [ ] Implement period selection
- [ ] Add comparison views

---

#### **Step 8.3: Balance Sheet**
- [ ] Connect balance sheet to backend
- [ ] Implement as-of-date selection
- [ ] Add asset/liability grouping
- [ ] Implement comparison views
- [ **Add drill-down functionality

**Backend API Endpoints:**
```
GET    /api/v1/accounting/balance-sheet?asOfDate=
POST   /api/v1/accounting/balance-sheet/export
```

**Frontend Implementation:**
- [ ] Update `BalanceSheet.tsx` to use real API
- [ ] Remove mock balance sheet data
- [ ] Implement as-of-date selection
- [ ] Add comparison views

---

#### **Step 8.4: Cash Flow Statement**
- [ ] Connect cash flow to backend
- [ ] Implement period selection
- [ ] Add cash flow categorization
- [ **Implement direct/indirect method
- [ ] Add comparison views

**Backend API Endpoints:**
```
GET    /api/v1/accounting/cash-flow?period=&year=
POST   /api/v1/accounting/cash-flow/export
```

**Frontend Implementation:**
- [ ] Update `CashFlow.tsx` to use real API
- [ ] Remove mock cash flow data
- [ ] Implement period selection
- [ ] Add method selection

---

## 🚨 Mock Data Cleanup Strategy

### **Files to Clean:**
1. `ChartOfAccounts.tsx` - Remove mock accounts array
2. `Vouchers.tsx` - Remove mock vouchers array
3. `GeneralLedger.tsx` - Remove mock transactions array
4. `CashBank.tsx` - Remove mock accounts array
5. `Receivables.tsx` - Remove mock receivables array
6. `Payables.tsx` - Remove mock payables array
7. `BankReconciliation.tsx` - Remove mock reconciliation data
8. `InvoicesReceipts.tsx` - Remove mock invoices array
9. `TrialBalance.tsx` - Remove mock trial balance data
10. `ProfitLoss.tsx` - Remove mock P&L data
11. `BalanceSheet.tsx` - Remove mock balance sheet data
12. `CashFlow.tsx` - Remove mock cash flow data

### **Cleanup Process:**
1. Identify all mock data arrays
2. Replace with API calls using useEffect
3. Add loading states
4. Add error handling
5. Test with empty states

---

## 🔧 API Integration Guidelines

### **Service Layer Pattern:**
```typescript
// Example service structure
export class AccountingService {
  private apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  async getChartOfAccounts(): Promise<Account[]> {
    const response = await this.apiClient.get('/accounting/chart-of-accounts');
    return response.data;
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    const response = await this.apiClient.post('/accounting/chart-of-accounts', data);
    return response.data;
  }
}
```

### **Error Handling Pattern:**
```typescript
const handleApiCall = async (apiCall: () => Promise<any>) => {
  try {
    setLoading(true);
    const result = await apiCall();
    setData(result);
  } catch (error) {
    setError(error.message);
    // Show error notification
  } finally {
    setLoading(false);
  }
};
```

---

## 📋 Implementation Checklist

### **Before Starting Each Phase:**
- [ ] Review backend API documentation
- [ ] Check required data structures
- [ ] Identify state management needs
- [ ] Plan UI component updates
- [ ] Prepare fallback states

### **During Implementation:**
- [ ] Follow existing code patterns
- [ ] Maintain consistent styling
- [ ] Add proper error handling
- [ ] Implement loading states
- [ ] Test with empty data

### **After Each Phase:**
- [ ] Test API integration
- [ ] Verify error handling
- [ ] Check UI responsiveness
- [ ] Validate data flow
- [ ] Update documentation

---

## 🎯 Success Criteria

### **API Integration:**
- ✅ All mock data replaced with real API calls
- ✅ Loading states implemented
- ✅ Error handling in place
- ✅ Optimistic UI updates
- ✅ Offline handling considered

### **User Experience:**
- ✅ Smooth data loading
- ✅ Clear error messages
- ✅ Consistent interactions
- ✅ Responsive design maintained
- ✅ Accessibility preserved

### **Code Quality:**
- ✅ Follows existing patterns
- ✅ No duplicate code
- ✅ Proper TypeScript types
- ✅ Clean component structure
- ✅ Well-documented changes

---

## 📅 Timeline Estimate

- **Phase 1 (Foundation):** 1 week
- **Phase 2 (Chart of Accounts):** 1 week
- **Phase 3 (Vouchers):** 1 week
- **Phase 4 (Ledger & Cash):** 1 week
- **Phase 5 (Receivables & Payables):** 1 week
- **Phase 6 (Bank Reconciliation):** 1 week
- **Phase 7 (Invoices):** 1 week
- **Phase 8 (Reports):** 1 week

**Total Estimated Time:** 8 weeks

---

## 🚀 Next Steps

1. **Review this plan** and confirm the sequence
2. **Start with Phase 1** (Foundation Setup)
3. **Complete API configuration** before moving to entities
4. **Test each phase** before proceeding to next
5. **Maintain clean code** throughout implementation

**Ready to start Phase 1?**
