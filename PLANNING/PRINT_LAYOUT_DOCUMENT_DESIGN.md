# Print Layout & Document Design - Comprehensive Planning Document

## 🖨️ Print & Document Design Overview

**Document Name:** Print Layout & Document Design Standards  
**Purpose:** Define comprehensive print layouts, receipt designs, statement formats, and print workflows for SLBL-ERP  
**Modules Covered:** All modules with print functionality  
**Primary Users:** Finance Team, Sales Team, Management, Clients, Vendors  

---

## 📋 Document Types & Print Workflows

### Document Categories

```
Print Documents
├── Financial Documents
│   ├── Vouchers (Payment, Receipt, Journal, Contra)
│   ├── Money Receipts
│   ├── Invoices
│   ├── Statements (Account, Bank, Client, Vendor)
│   └── Payslips
│
├── Sales Documents
│   ├── Booking Confirmations
│   ├── Sale Agreements
│   ├── Installment Schedules
│   └── Handover Certificates
│
├── Procurement Documents
│   ├── Purchase Orders
│   ├── Vendor Bills
│   ├── Delivery Challans
│   └── Quotations
│
├── Construction Documents
│   ├── Material Requisition Notes (MRN)
│   ├── RA Bills
│   ├── Work Orders
│   └── Progress Reports
│
└── HR Documents
    ├── Appointment Letters
    ├── Experience Certificates
    ├── Salary Slips
    └── Leave Applications
```

---

## 🎨 Print Design Standards

### Paper Sizes & Margins

```css
/* Standard Paper Sizes */
--paper-a4: 210mm x 297mm;    /* Standard A4 */
--paper-a5: 148mm x 210mm;    /* A5 for receipts */
--paper-letter: 216mm x 279mm; /* Letter size */

/* Standard Margins */
--margin-narrow: 10mm;        /* Narrow margins */
--margin-normal: 15mm;        /* Normal margins */
--margin-wide: 20mm;          /* Wide margins */

/* Header/Footer Heights */
--header-height: 25mm;
--footer-height: 15mm;
```

### Print Typography

```css
/* Print Font Sizes */
--print-title: 18pt;          /* Document title */
--print-subtitle: 14pt;       /* Section headings */
--print-body: 11pt;           /* Body text */
--print-small: 9pt;           /* Small text */
--print-footer: 8pt;          /* Footer text */

/* Print Font Weights */
--print-bold: 700;
--print-semibold: 600;
--print-normal: 400;

/* Print Line Heights */
--print-leading-tight: 1.2;
--print-leading-normal: 1.4;
--print-leading-relaxed: 1.6;
```

### Print Colors

```css
/* Print Colors (Black & White for cost-effectiveness) */
--print-black: #000000;
--print-dark-gray: #333333;
--print-medium-gray: #666666;
--print-light-gray: #999999;
--print-border: #CCCCCC;

/* Brand Colors (for company logo only) */
--print-primary: #10B981;
--print-secondary: #3B82F6;
```

---

## 🖨️ Document 1: Voucher Print Layout

### Voucher Header Section
```typescript
interface VoucherPrintHeader {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  documentTitle: string;
  voucherNumber: string;
  voucherDate: string;
  voucherType: string;
}

const VoucherPrintHeader = {
  layout: "two-column",
  width: "100%",
  padding: "20mm",
  borderBottom: "2px solid #000",
  
  leftColumn: {
    companyLogo: {
      width: "50mm",
      height: "20mm",
      position: "top-left"
    },
    companyName: {
      fontSize: "18pt",
      fontWeight: "bold",
      marginTop: "5mm"
    },
    companyAddress: {
      fontSize: "9pt",
      marginTop: "2mm",
      lines: ["Address Line 1", "Address Line 2", "City, Country"]
    },
    contactInfo: {
      fontSize: "9pt",
      marginTop: "2mm",
      lines: ["Phone: +880-XXXX-XXXXXX", "Email: company@example.com"]
    }
  },
  
  rightColumn: {
    documentTitle: {
      fontSize: "16pt",
      fontWeight: "bold",
      textAlign: "right",
      marginBottom: "5mm"
    },
    voucherNumber: {
      label: "Voucher No:",
      value: "PV-2025-0001",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    voucherDate: {
      label: "Date:",
      value: "08-09-2025",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    voucherType: {
      label: "Type:",
      value: "Payment Voucher",
      fontSize: "11pt",
      textAlign: "right"
    }
  }
};
```

### Voucher Body Section
```typescript
interface VoucherPrintBody {
  payeePayer: string;
  account: string;
  amount: number;
  narration: string;
  lineItems?: LineItem[];
  approvals: Approval[];
}

const VoucherPrintBody = {
  layout: "table",
  marginTop: "10mm",
  
  payeePayerSection: {
    label: "Payee/Payer:",
    value: "Vendor Name / Client Name",
    fontSize: "11pt",
    fontWeight: "bold",
    marginBottom: "5mm"
  },
  
  accountSection: {
    label: "Account:",
    value: "Cash Account / Bank Account",
    fontSize: "11pt",
    marginBottom: "5mm"
  },
  
  amountSection: {
    label: "Amount:",
    value: "৳ 1,00,000.00",
    fontSize: "14pt",
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: "5mm",
    amountInWords: "One Lakh Taka Only"
  },
  
  lineItemsTable: {
    headers: ["Account", "Description", "Debit", "Credit"],
    fontSize: "10pt",
    borders: "1px solid #000",
    headerBackground: "#F0F0F0",
    alternatingRows: true
  },
  
  narrationSection: {
    label: "Narration:",
    value: "Payment for construction materials",
    fontSize: "10pt",
    marginTop: "5mm",
    maxWidth: "150mm"
  },
  
  approvalSection: {
    label: "Approvals:",
    approvals: [
      { role: "Prepared By", name: "John Doe", signature: true },
      { role: "Verified By", name: "Jane Smith", signature: true },
      { role: "Approved By", name: "Mike Johnson", signature: true }
    ],
    fontSize: "9pt",
    marginTop: "10mm"
  }
};
```

### Voucher Footer Section
```typescript
interface VoucherPrintFooter {
  pageNumber: number;
  totalPages: number;
  generatedBy: string;
  generatedDate: string;
  terms: string[];
}

const VoucherPrintFooter = {
  layout: "two-column",
  marginTop: "10mm",
  paddingTop: "5mm",
  borderTop: "1px solid #000",
  
  leftColumn: {
    terms: {
      label: "Terms & Conditions:",
      fontSize: "8pt",
      lines: [
        "1. This voucher is subject to company policies",
        "2. Any discrepancy must be reported within 7 days",
        "3. This is a computer-generated document"
      ]
    }
  },
  
  rightColumn: {
    pageInfo: {
      label: "Page",
      value: "1 of 1",
      fontSize: "8pt",
      textAlign: "right"
    },
    generatedInfo: {
      label: "Generated by:",
      value: "System",
      label2: "Generated on:",
      value2: "08-09-2025 14:30",
      fontSize: "8pt",
      textAlign: "right"
    }
  }
};
```

---

## 🖨️ Document 2: Money Receipt Print Layout

### Money Receipt Header
```typescript
interface MoneyReceiptHeader {
  companyLogo: string;
  companyName: string;
  receiptTitle: string;
  receiptNumber: string;
  receiptDate: string;
}

const MoneyReceiptHeader = {
  layout: "centered",
  width: "100%",
  padding: "15mm",
  
  logoSection: {
    companyLogo: {
      width: "40mm",
      height: "15mm",
      position: "center"
    }
  },
  
  titleSection: {
    receiptTitle: {
      text: "MONEY RECEIPT",
      fontSize: "20pt",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "5mm",
      textDecoration: "underline"
    }
  },
  
  receiptInfo: {
    receiptNumber: {
      label: "Receipt No:",
      value: "MR-2025-0001",
      fontSize: "12pt",
      textAlign: "center",
      marginTop: "5mm"
    },
    receiptDate: {
      label: "Date:",
      value: "08-09-2025",
      fontSize: "12pt",
      textAlign: "center",
      marginTop: "2mm"
    }
  }
};
```

### Money Receipt Body
```typescript
interface MoneyReceiptBody {
  receivedFrom: string;
  amount: number;
  paymentMethod: string;
  forPaymentOf: string;
  paymentDetails: PaymentDetails;
}

const MoneyReceiptBody = {
  layout: "centered",
  marginTop: "10mm",
  
  receivedFromSection: {
    label: "Received with thanks from",
    value: "Mr. John Doe",
    fontSize: "12pt",
    fontWeight: "bold",
    marginTop: "5mm",
    borderBottom: "1px solid #000",
    paddingTop: "2mm"
  },
  
  amountSection: {
    label: "The sum of",
    value: "৳ 50,000.00",
    amountInWords: "Fifty Thousand Taka Only",
    fontSize: "14pt",
    fontWeight: "bold",
    marginTop: "5mm",
    textAlign: "center",
    borderBottom: "1px solid #000",
    paddingTop: "2mm"
  },
  
  paymentMethodSection: {
    label: "Payment Method",
    value: "Cash / Bank Transfer / Check",
    fontSize: "11pt",
    marginTop: "5mm"
  },
  
  paymentDetails: {
    bankName: {
      label: "Bank:",
      value: "Dutch-Bangla Bank",
      fontSize: "10pt"
    },
    accountNumber: {
      label: "Account:",
      value: "1234567890",
      fontSize: "10pt"
    },
    checkNumber: {
      label: "Check No:",
      value: "123456",
      fontSize: "10pt"
    },
    checkDate: {
      label: "Check Date:",
      value: "08-09-2025",
      fontSize: "10pt"
    }
  },
  
  forPaymentOfSection: {
    label: "For payment of",
    value: "Booking amount for Unit A-101, Project XYZ",
    fontSize: "11pt",
    marginTop: "5mm",
    maxWidth: "140mm"
  }
};
```

### Money Receipt Footer
```typescript
interface MoneyReceiptFooter {
  authorizedSignatory: string;
  designation: string;
  stamp: string;
  terms: string[];
}

const MoneyReceiptFooter = {
  layout: "two-column",
  marginTop: "15mm",
  
  leftColumn: {
    terms: {
      label: "Terms:",
      fontSize: "8pt",
      lines: [
        "1. This receipt is valid for the purpose mentioned above",
        "2. Any alteration makes this receipt invalid",
        "3. Subject to realization of check (if applicable)"
      ]
    }
  },
  
  rightColumn: {
    signatureSection: {
      label: "Authorized Signatory",
      fontSize: "10pt",
      marginTop: "10mm",
      signatureLine: {
        width: "60mm",
        borderBottom: "1px solid #000",
        paddingTop: "20mm"
      },
      name: {
        fontSize: "11pt",
        fontWeight: "bold",
        marginTop: "2mm"
      },
      designation: {
        fontSize: "9pt",
        marginTop: "1mm"
      },
      stamp: {
        width: "30mm",
        height: "30mm",
        marginTop: "5mm",
        position: "right"
      }
    }
  }
};
```

---

## 🖨️ Document 3: Booking Confirmation Print Layout

### Booking Confirmation Header
```typescript
interface BookingConfirmationHeader {
  companyLogo: string;
  companyName: string;
  documentTitle: string;
  bookingNumber: string;
  bookingDate: string;
}

const BookingConfirmationHeader = {
  layout: "two-column",
  width: "100%",
  padding: "20mm",
  borderBottom: "2px solid #10B981",
  
  leftColumn: {
    companyLogo: {
      width: "50mm",
      height: "20mm"
    },
    companyName: {
      fontSize: "16pt",
      fontWeight: "bold",
      marginTop: "3mm"
    },
    companyTagline: {
      fontSize: "9pt",
      fontStyle: "italic",
      marginTop: "2mm"
    }
  },
  
  rightColumn: {
    documentTitle: {
      text: "BOOKING CONFIRMATION",
      fontSize: "14pt",
      fontWeight: "bold",
      color: "#10B981",
      textAlign: "right",
      marginBottom: "5mm"
    },
    bookingNumber: {
      label: "Booking No:",
      value: "BK-2025-0001",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    bookingDate: {
      label: "Booking Date:",
      value: "08-09-2025",
      fontSize: "11pt",
      textAlign: "right"
    }
  }
};
```

### Booking Confirmation Body
```typescript
interface BookingConfirmationBody {
  clientInfo: ClientInfo;
  projectInfo: ProjectInfo;
  unitInfo: UnitInfo;
  paymentInfo: PaymentInfo;
  installmentSchedule: Installment[];
}

const BookingConfirmationBody = {
  layout: "two-column",
  marginTop: "10mm",
  
  clientSection: {
    title: "Client Information",
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "3mm",
    fields: [
      { label: "Name:", value: "Mr. John Doe" },
      { label: "Address:", value: "123 Street, City" },
      { label: "Phone:", value: "+880-171-234567" },
      { label: "Email:", value: "john@example.com" }
    ],
    fontSize: "10pt"
  },
  
  projectSection: {
    title: "Project Information",
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "3mm",
    fields: [
      { label: "Project Name:", value: "XYZ Residential Complex" },
      { label: "Location:", value: "Dhaka, Bangladesh" },
      { label: "Project Type:", value: "Residential" }
    ],
    fontSize: "10pt"
  },
  
  unitSection: {
    title: "Unit Information",
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "3mm",
    marginTop: "5mm",
    fields: [
      { label: "Unit Number:", value: "A-101" },
      { label: "Unit Type:", value: "Apartment" },
      { label: "Floor:", value: "10th Floor" },
      { label: "Size:", value: "1,200 sq ft" },
      { label: "Total Price:", value: "৳ 60,00,000.00" }
    ],
    fontSize: "10pt"
  },
  
  paymentSection: {
    title: "Payment Information",
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "3mm",
    marginTop: "5mm",
    fields: [
      { label: "Booking Amount:", value: "৳ 6,00,000.00" },
      { label: "Payment Method:", value: "Bank Transfer" },
      { label: "Reference:", value: "TXN-123456" }
    ],
    fontSize: "10pt"
  },
  
  installmentSchedule: {
    title: "Installment Schedule",
    fontSize: "12pt",
    fontWeight: "bold",
    marginTop: "5mm",
    table: {
      headers: ["Installment #", "Due Date", "Amount", "Status"],
      fontSize: "9pt",
      borders: "1px solid #000",
      headerBackground: "#10B981",
      headerColor: "#FFFFFF"
    }
  }
};
```

### Booking Confirmation Footer
```typescript
interface BookingConfirmationFooter {
  terms: string[];
  authorizedSignatory: string;
  clientSignature: string;
}

const BookingConfirmationFooter = {
  layout: "two-column",
  marginTop: "10mm",
  paddingTop: "5mm",
  borderTop: "1px solid #000",
  
  leftColumn: {
    terms: {
      label: "Terms & Conditions:",
      fontSize: "8pt",
      lines: [
        "1. This booking is subject to approval by management",
        "2. Unit allocation is subject to availability",
        "3. Installment schedule must be followed strictly",
        "4. Any delay in payment may attract penalty",
        "5. Company reserves right to cancel booking if terms violated"
      ]
    }
  },
  
  rightColumn: {
    signatures: {
      companySignature: {
        label: "For Company",
        fontSize: "10pt",
        marginTop: "10mm",
        signatureLine: {
          width: "50mm",
          borderBottom: "1px solid #000",
          paddingTop: "15mm"
        },
        name: {
          fontSize: "11pt",
          fontWeight: "bold",
          marginTop: "2mm"
        },
        designation: {
          fontSize: "9pt"
        }
      },
      clientSignature: {
        label: "Client Signature",
        fontSize: "10pt",
        marginTop: "10mm",
        signatureLine: {
          width: "50mm",
          borderBottom: "1px solid #000",
          paddingTop: "15mm"
        },
        name: {
          fontSize: "11pt",
          fontWeight: "bold",
          marginTop: "2mm"
        },
        date: {
          fontSize: "9pt",
          marginTop: "1mm"
        }
      }
    }
  }
};
```

---

## 🖨️ Document 4: Account Statement Print Layout

### Statement Header
```typescript
interface StatementHeader {
  companyLogo: string;
  companyName: string;
  statementTitle: string;
  accountNumber: string;
  accountName: string;
  period: string;
  openingBalance: number;
}

const StatementHeader = {
  layout: "two-column",
  width: "100%",
  padding: "20mm",
  borderBottom: "2px solid #000",
  
  leftColumn: {
    companyLogo: {
      width: "50mm",
      height: "20mm"
    },
    companyName: {
      fontSize: "16pt",
      fontWeight: "bold",
      marginTop: "3mm"
    },
    companyAddress: {
      fontSize: "9pt",
      marginTop: "2mm"
    }
  },
  
  rightColumn: {
    statementTitle: {
      text: "ACCOUNT STATEMENT",
      fontSize: "14pt",
      fontWeight: "bold",
      textAlign: "right",
      marginBottom: "5mm"
    },
    accountNumber: {
      label: "Account No:",
      value: "ACC-001",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    accountName: {
      label: "Account Name:",
      value: "Cash Account",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    period: {
      label: "Period:",
      value: "01-01-2025 to 31-12-2025",
      fontSize: "11pt",
      textAlign: "right"
    }
  }
};
```

### Statement Body
```typescript
interface StatementBody {
  transactions: Transaction[];
  openingBalance: number;
  closingBalance: number;
}

const StatementBody = {
  layout: "table",
  marginTop: "10mm",
  
  balanceSummary: {
    openingBalance: {
      label: "Opening Balance:",
      value: "৳ 1,00,000.00",
      fontSize: "12pt",
      fontWeight: "bold",
      marginTop: "5mm"
    }
  },
  
  transactionTable: {
    headers: ["Date", "Voucher No", "Description", "Debit", "Credit", "Balance"],
    fontSize: "9pt",
    borders: "1px solid #000",
    headerBackground: "#F0F0F0",
    alternatingRows: true,
    textAlign: ["left", "left", "left", "right", "right", "right"]
  },
  
  balanceSummary: {
    closingBalance: {
      label: "Closing Balance:",
      value: "৳ 5,00,000.00",
      fontSize: "12pt",
      fontWeight: "bold",
      marginTop: "5mm",
      textAlign: "right"
    }
  }
};
```

### Statement Footer
```typescript
interface StatementFooter {
  generatedBy: string;
  generatedDate: string;
  verifiedBy: string;
}

const StatementFooter = {
  layout: "two-column",
  marginTop: "10mm",
  paddingTop: "5mm",
  borderTop: "1px solid #000",
  
  leftColumn: {
    generatedInfo: {
      label: "Generated by:",
      value: "System",
      label2: "Generated on:",
      value2: "08-09-2025 14:30",
      fontSize: "8pt"
    }
  },
  
  rightColumn: {
    verification: {
      label: "Verified by:",
      signatureLine: {
        width: "50mm",
        borderBottom: "1px solid #000",
        paddingTop: "15mm"
      },
      name: {
        fontSize: "11pt",
        fontWeight: "bold",
        marginTop: "2mm"
      },
      designation: {
        fontSize: "9pt"
      }
    }
  }
};
```

---

## 🖨️ Document 5: Invoice Print Layout

### Invoice Header
```typescript
interface InvoiceHeader {
  companyLogo: string;
  companyName: string;
  invoiceTitle: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  clientInfo: ClientInfo;
}

const InvoiceHeader = {
  layout: "two-column",
  width: "100%",
  padding: "20mm",
  borderBottom: "2px solid #3B82F6",
  
  leftColumn: {
    companyLogo: {
      width: "50mm",
      height: "20mm"
    },
    companyName: {
      fontSize: "16pt",
      fontWeight: "bold",
      marginTop: "3mm"
    },
    companyAddress: {
      fontSize: "9pt",
      marginTop: "2mm"
    },
    companyContact: {
      fontSize: "9pt",
      marginTop: "2mm"
    }
  },
  
  rightColumn: {
    invoiceTitle: {
      text: "INVOICE",
      fontSize: "16pt",
      fontWeight: "bold",
      color: "#3B82F6",
      textAlign: "right",
      marginBottom: "5mm"
    },
    invoiceNumber: {
      label: "Invoice No:",
      value: "INV-2025-0001",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    invoiceDate: {
      label: "Invoice Date:",
      value: "08-09-2025",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    dueDate: {
      label: "Due Date:",
      value: "08-10-2025",
      fontSize: "11pt",
      textAlign: "right"
    }
  },
  
  billToSection: {
    title: "Bill To:",
    fontSize: "12pt",
    fontWeight: "bold",
    marginTop: "5mm",
    clientName: {
      fontSize: "11pt",
      fontWeight: "bold",
      marginTop: "2mm"
    },
    clientAddress: {
      fontSize: "9pt",
      marginTop: "1mm"
    },
    clientContact: {
      fontSize: "9pt",
      marginTop: "1mm"
    }
  }
};
```

### Invoice Body
```typescript
interface InvoiceBody {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const InvoiceBody = {
  layout: "table",
  marginTop: "10mm",
  
  itemTable: {
    headers: ["Item", "Description", "Quantity", "Rate", "Amount"],
    fontSize: "10pt",
    borders: "1px solid #000",
    headerBackground: "#3B82F6",
    headerColor: "#FFFFFF",
    textAlign: ["left", "left", "center", "right", "right"]
  },
  
  summarySection: {
    marginTop: "10mm",
    textAlign: "right",
    subtotal: {
      label: "Subtotal:",
      value: "৳ 1,00,000.00",
      fontSize: "11pt",
      marginTop: "2mm"
    },
    tax: {
      label: "VAT (5%):",
      value: "৳ 5,000.00",
      fontSize: "11pt",
      marginTop: "2mm"
    },
    total: {
      label: "Total:",
      value: "৳ 1,05,000.00",
      fontSize: "14pt",
      fontWeight: "bold",
      marginTop: "3mm",
      borderBottom: "2px solid #000",
      paddingTop: "2mm"
    },
    amountInWords: {
      value: "One Lakh Five Thousand Taka Only",
      fontSize: "10pt",
      marginTop: "2mm"
    }
  }
};
```

### Invoice Footer
```typescript
interface InvoiceFooter {
  bankDetails: BankDetails;
  terms: string[];
  authorizedSignatory: string;
}

const InvoiceFooter = {
  layout: "two-column",
  marginTop: "10mm",
  paddingTop: "5mm",
  borderTop: "1px solid #000",
  
  leftColumn: {
    bankDetails: {
      title: "Bank Details:",
      fontSize: "10pt",
      fontWeight: "bold",
      fields: [
        { label: "Bank:", value: "Dutch-Bangla Bank" },
        { label: "Account:", value: "1234567890" },
        { label: "Routing:", value: "123456789" }
      ],
      fontSize: "9pt"
    },
    terms: {
      title: "Terms:",
      fontSize: "10pt",
      fontWeight: "bold",
      marginTop: "5mm",
      lines: [
        "1. Payment due within 30 days",
        "2. Late payment attracts 2% monthly penalty",
        "3. Goods once sold cannot be returned"
      ],
      fontSize: "8pt"
    }
  },
  
  rightColumn: {
    signatureSection: {
      label: "Authorized Signatory",
      fontSize: "10pt",
      marginTop: "10mm",
      signatureLine: {
        width: "60mm",
        borderBottom: "1px solid #000",
        paddingTop: "20mm"
      },
      name: {
        fontSize: "11pt",
        fontWeight: "bold",
        marginTop: "2mm"
      },
      designation: {
        fontSize: "9pt"
      },
      stamp: {
        width: "30mm",
        height: "30mm",
        marginTop: "5mm"
      }
    }
  }
};
```

---

## 🖨️ Document 6: Purchase Order Print Layout

### PO Header
```typescript
interface POHeader {
  companyLogo: string;
  companyName: string;
  poTitle: string;
  poNumber: string;
  poDate: string;
  vendorInfo: VendorInfo;
}

const POHeader = {
  layout: "two-column",
  width: "100%",
  padding: "20mm",
  borderBottom: "2px solid #F59E0B",
  
  leftColumn: {
    companyLogo: {
      width: "50mm",
      height: "20mm"
    },
    companyName: {
      fontSize: "16pt",
      fontWeight: "bold",
      marginTop: "3mm"
    }
  },
  
  rightColumn: {
    poTitle: {
      text: "PURCHASE ORDER",
      fontSize: "14pt",
      fontWeight: "bold",
      color: "#F59E0B",
      textAlign: "right",
      marginBottom: "5mm"
    },
    poNumber: {
      label: "PO No:",
      value: "PO-2025-0001",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    poDate: {
      label: "PO Date:",
      value: "08-09-2025",
      fontSize: "11pt",
      textAlign: "right",
      marginBottom: "2mm"
    },
    expectedDelivery: {
      label: "Expected Delivery:",
      value: "15-09-2025",
      fontSize: "11pt",
      textAlign: "right"
    }
  },
  
  vendorSection: {
    title: "Vendor:",
    fontSize: "12pt",
    fontWeight: "bold",
    marginTop: "5mm",
    vendorName: {
      fontSize: "11pt",
      fontWeight: "bold",
      marginTop: "2mm"
    },
    vendorAddress: {
      fontSize: "9pt",
      marginTop: "1mm"
    },
    vendorContact: {
      fontSize: "9pt",
      marginTop: "1mm"
    }
  }
};
```

### PO Body
```typescript
interface POBody {
  items: POItem[];
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
}

const POBody = {
  layout: "table",
  marginTop: "10mm",
  
  itemTable: {
    headers: ["Item", "Description", "Quantity", "Unit", "Rate", "Amount"],
    fontSize: "10pt",
    borders: "1px solid #000",
    headerBackground: "#F59E0B",
    headerColor: "#FFFFFF",
    textAlign: ["left", "left", "center", "center", "right", "right"]
  },
  
  summarySection: {
    marginTop: "10mm",
    textAlign: "right",
    subtotal: {
      label: "Subtotal:",
      value: "৳ 1,00,000.00",
      fontSize: "11pt",
      marginTop: "2mm"
    },
    vat: {
      label: "VAT (5%):",
      value: "৳ 5,000.00",
      fontSize: "11pt",
      marginTop: "2mm"
    },
    shipping: {
      label: "Shipping:",
      value: "৳ 2,000.00",
      fontSize: "11pt",
      marginTop: "2mm"
    },
    total: {
      label: "Grand Total:",
      value: "৳ 1,07,000.00",
      fontSize: "14pt",
      fontWeight: "bold",
      marginTop: "3mm",
      borderBottom: "2px solid #000",
      paddingTop: "2mm"
    },
    amountInWords: {
      value: "One Lakh Seven Thousand Taka Only",
      fontSize: "10pt",
      marginTop: "2mm"
    }
  }
};
```

### PO Footer
```typescript
interface POFooter {
  deliveryAddress: string;
  terms: string[];
  authorizedSignatory: string;
}

const POFooter = {
  layout: "two-column",
  marginTop: "10mm",
  paddingTop: "5mm",
  borderTop: "1px solid #000",
  
  leftColumn: {
    deliveryAddress: {
      title: "Delivery Address:",
      fontSize: "10pt",
      fontWeight: "bold",
      address: "Site Address, Project Location",
      fontSize: "9pt",
      marginTop: "2mm"
    },
    terms: {
      title: "Terms & Conditions:",
      fontSize: "10pt",
      fontWeight: "bold",
      marginTop: "5mm",
      lines: [
        "1. Delivery must be made as per schedule",
        "2. Material quality must meet specifications",
        "3. Any delay will attract penalty",
        "4. Payment will be made after inspection"
      ],
      fontSize: "8pt"
    }
  },
  
  rightColumn: {
    signatureSection: {
      label: "Authorized Signatory",
      fontSize: "10pt",
      marginTop: "10mm",
      signatureLine: {
        width: "60mm",
        borderBottom: "1px solid #000",
        paddingTop: "20mm"
      },
      name: {
        fontSize: "11pt",
        fontWeight: "bold",
        marginTop: "2mm"
      },
      designation: {
        fontSize: "9pt"
      },
      stamp: {
        width: "30mm",
        height: "30mm",
        marginTop: "5mm"
      }
    }
  }
};
```

---

## 🖨️ Document 7: Payslip Print Layout

### Payslip Header
```typescript
interface PayslipHeader {
  companyLogo: string;
  companyName: string;
  payslipTitle: string;
  payslipMonth: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
}

const PayslipHeader = {
  layout: "two-column",
  width: "100%",
  padding: "20mm",
  borderBottom: "2px solid #8B5CF6",
  
  leftColumn: {
    companyLogo: {
      width: "50mm",
      height: "20mm"
    },
    companyName: {
      fontSize: "16pt",
      fontWeight: "bold",
      marginTop: "3mm"
    }
  },
  
  rightColumn: {
    payslipTitle: {
      text: "PAYSLIP",
      fontSize: "14pt",
      fontWeight: "bold",
      color: "#8B5CF6",
      textAlign: "right",
      marginBottom: "5mm"
    },
    payslipMonth: {
      label: "Month:",
      value: "September 2025",
      fontSize: "11pt",
      textAlign: "right"
    }
  },
  
  employeeSection: {
    title: "Employee Details:",
    fontSize: "12pt",
    fontWeight: "bold",
    marginTop: "5mm",
    fields: [
      { label: "Name:", value: "John Doe" },
      { label: "Employee ID:", value: "EMP-2025-0001" },
      { label: "Designation:", value: "Software Engineer" },
      { label: "Department:", value: "IT" }
    ],
    fontSize: "10pt"
  }
};
```

### Payslip Body
```typescript
interface PayslipBody {
  earnings: Earning[];
  deductions: Deduction[];
  netSalary: number;
}

const PayslipBody = {
  layout: "two-column",
  marginTop: "10mm",
  
  earningsSection: {
    title: "Earnings",
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "3mm",
    table: {
      headers: ["Description", "Amount"],
      fontSize: "10pt",
      borders: "1px solid #000",
      headerBackground: "#8B5CF6",
      headerColor: "#FFFFFF",
      textAlign: ["left", "right"]
    },
    totalEarnings: {
      label: "Total Earnings:",
      value: "৳ 50,000.00",
      fontSize: "11pt",
      fontWeight: "bold",
      marginTop: "3mm",
      textAlign: "right"
    }
  },
  
  deductionsSection: {
    title: "Deductions",
    fontSize: "12pt",
    fontWeight: "bold",
    marginBottom: "3mm",
    table: {
      headers: ["Description", "Amount"],
      fontSize: "10pt",
      borders: "1px solid #000",
      headerBackground: "#EF4444",
      headerColor: "#FFFFFF",
      textAlign: ["left", "right"]
    },
    totalDeductions: {
      label: "Total Deductions:",
      value: "৳ 5,000.00",
      fontSize: "11pt",
      fontWeight: "bold",
      marginTop: "3mm",
      textAlign: "right"
    }
  },
  
  netSalarySection: {
    title: "Net Salary",
    fontSize: "12pt",
    fontWeight: "bold",
    marginTop: "5mm",
    amount: {
      value: "৳ 45,000.00",
      fontSize: "16pt",
      fontWeight: "bold",
      color: "#10B981",
      textAlign: "center",
      borderBottom: "2px solid #000",
      paddingTop: "2mm"
    },
    amountInWords: {
      value: "Forty Five Thousand Taka Only",
      fontSize: "10pt",
      marginTop: "2mm",
      textAlign: "center"
    }
  }
};
```

### Payslip Footer
```typescript
interface PayslipFooter {
  generatedBy: string;
  generatedDate: string;
  terms: string[];
}

const PayslipFooter = {
  layout: "single-column",
  marginTop: "10mm",
  paddingTop: "5mm",
  borderTop: "1px solid #000",
  
  generatedInfo: {
    label: "Generated by:",
    value: "System",
    label2: "Generated on:",
    value2: "08-09-2025 14:30",
    fontSize: "8pt",
    textAlign: "center"
  },
  
  terms: {
    label: "Note:",
    fontSize: "8pt",
    marginTop: "3mm",
    lines: [
      "This is a computer-generated payslip",
      "For any discrepancies, contact HR department",
      "This document is confidential"
    ],
    textAlign: "center"
  }
};
```

---

## 🖨️ Print Workflow Architecture

### Print Generation Flow
```typescript
interface PrintWorkflow {
  trigger: "button_click" | "auto_generate" | "scheduled";
  dataFetch: {
    source: "api" | "database" | "cache";
    endpoint: string;
    params: Record<string, any>;
  };
  templateRender: {
    template: string;
    data: any;
    options: PrintOptions;
  };
  preview: {
    showPreview: boolean;
    allowEdit: boolean;
  };
  print: {
    printer: "default" | "specific";
    copies: number;
    duplex: boolean;
    color: boolean;
  };
  postPrint: {
    saveToHistory: boolean;
    sendEmail: boolean;
    archive: boolean;
  };
}
```

### Print Button Implementation
```typescript
const printButtonConfiguration = {
  voucher: {
    action: "printDocument",
    documentType: "voucher",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "voucher.status === 'posted'",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/vouchers/:id/print-data"
      },
      template: "voucher-print-template",
      preview: true,
      defaultCopies: 1,
      saveToHistory: true
    }
  },
  
  receipt: {
    action: "printDocument",
    documentType: "money-receipt",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "payment.status === 'paid'",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/payments/:id/receipt-data"
      },
      template: "receipt-print-template",
      preview: true,
      defaultCopies: 2,
      saveToHistory: true,
      sendEmail: true
    }
  },
  
  booking: {
    action: "printDocument",
    documentType: "booking-confirmation",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "booking.status === 'confirmed'",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/bookings/:id/confirmation-data"
      },
      template: "booking-print-template",
      preview: true,
      defaultCopies: 2,
      saveToHistory: true,
      sendEmail: true
    }
  },
  
  statement: {
    action: "printDocument",
    documentType: "account-statement",
    icon: "printer",
    variant: "ghost",
    size: "small",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/statements/:id/print-data"
      },
      template: "statement-print-template",
      preview: true,
      defaultCopies: 1,
      saveToHistory: true
    }
  },
  
  invoice: {
    action: "printDocument",
    documentType: "invoice",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "invoice.status === 'sent'",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/invoices/:id/print-data"
      },
      template: "invoice-print-template",
      preview: true,
      defaultCopies: 2,
      saveToHistory: true,
      sendEmail: true
    }
  },
  
  purchaseOrder: {
    action: "printDocument",
    documentType: "purchase-order",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "po.status === 'approved'",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/purchase-orders/:id/print-data"
      },
      template: "po-print-template",
      preview: true,
      defaultCopies: 2,
      saveToHistory: true,
      sendEmail: true
    }
  },
  
  payslip: {
    action: "printDocument",
    documentType: "payslip",
    icon: "printer",
    variant: "ghost",
    size: "small",
    condition: "payroll.status === 'completed'",
    workflow: {
      dataFetch: {
        endpoint: "/api/v1/payroll/:id/payslip-data"
      },
      template: "payslip-print-template",
      preview: true,
      defaultCopies: 1,
      saveToHistory: true,
      sendEmail: true
    }
  }
};
```

---

## 🖨️ Print Preview Modal

### Print Preview Component
```typescript
interface PrintPreviewModal {
  document: any;
  template: string;
  showPreview: boolean;
  onPrint: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

const PrintPreviewModal = {
  layout: "full-screen",
  width: "100%",
  height: "100%",
  
  header: {
    title: "Print Preview",
    actions: [
      {
        label: "Edit",
        icon: "edit",
        variant: "outline",
        action: "onEdit"
      },
      {
        label: "Download PDF",
        icon: "download",
        variant: "outline",
        action: "onDownload"
      },
      {
        label: "Print",
        icon: "printer",
        variant: "primary",
        action: "onPrint"
      },
      {
        label: "Cancel",
        icon: "x",
        variant: "ghost",
        action: "onCancel"
      }
    ]
  },
  
  previewArea: {
    width: "100%",
    height: "calc(100% - 80px)",
    overflow: "auto",
    backgroundColor: "#F0F0F0",
    padding: "20mm",
    
    documentPreview: {
      width: "210mm", // A4 width
      minHeight: "297mm", // A4 height
      backgroundColor: "#FFFFFF",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "0 auto"
    }
  },
  
  printOptions: {
    copies: {
      label: "Copies",
      type: "number",
      defaultValue: 1,
      min: 1,
      max: 10
    },
    printer: {
      label: "Printer",
      type: "select",
      options: ["Default Printer", "Specific Printer"]
    },
    duplex: {
      label: "Double-sided",
      type: "checkbox",
      defaultValue: false
    },
    color: {
      label: "Color",
      type: "checkbox",
      defaultValue: false
    }
  }
};
```

---

## 🖨️ PDF Generation Standards

### PDF Configuration
```typescript
interface PDFConfig {
  format: "A4" | "A5" | "Letter";
  orientation: "portrait" | "landscape";
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header: {
    show: boolean;
    height: number;
    template: string;
  };
  footer: {
    show: boolean;
    height: number;
    template: string;
    pageNumber: boolean;
  };
  watermark: {
    show: boolean;
    text: string;
    opacity: number;
  };
  security: {
    password: string;
    permissions: string[];
  };
}

const defaultPDFConfig = {
  format: "A4",
  orientation: "portrait",
  margin: {
    top: 20,
    right: 15,
    bottom: 15,
    left: 15
  },
  header: {
    show: true,
    height: 25,
    template: "default-header"
  },
  footer: {
    show: true,
    height: 15,
    template: "default-footer",
    pageNumber: true
  },
  watermark: {
    show: false,
    text: "DRAFT",
    opacity: 0.1
  },
  security: {
    password: null,
    permissions: ["print", "copy"]
  }
};
```

---

## 🖨️ Email Integration

### Email with PDF Attachment
```typescript
interface EmailWithPDF {
  recipient: string;
  subject: string;
  body: string;
  pdfAttachment: {
    filename: string;
    content: Blob;
  };
  sender: string;
  cc?: string[];
  bcc?: string[];
}

const emailWithPDFConfig = {
  voucher: {
    subject: "Payment Voucher - {voucherNumber}",
    body: "Dear {payeeName}, Please find attached the payment voucher for your reference.",
    filename: "Voucher-{voucherNumber}.pdf"
  },
  
  receipt: {
    subject: "Payment Receipt - {receiptNumber}",
    body: "Dear {clientName}, Your payment of {amount} has been received. Please find attached the receipt.",
    filename: "Receipt-{receiptNumber}.pdf"
  },
  
  booking: {
    subject: "Booking Confirmation - {bookingNumber}",
    body: "Dear {clientName}, Your booking for {unitNumber} has been confirmed. Please find attached the confirmation document.",
    filename: "Booking-{bookingNumber}.pdf"
  },
  
  invoice: {
    subject: "Invoice - {invoiceNumber}",
    body: "Dear {clientName}, Please find attached the invoice for {description}. Payment is due by {dueDate}.",
    filename: "Invoice-{invoiceNumber}.pdf"
  },
  
  payslip: {
    subject: "Payslip - {month} {year}",
    body: "Dear {employeeName}, Please find attached your payslip for {month} {year}.",
    filename: "Payslip-{month}-{year}.pdf"
  }
};
```

---

## 🖨️ Print History & Archiving

### Print History Storage
```typescript
interface PrintHistory {
  id: string;
  documentType: string;
  documentId: string;
  documentNumber: string;
  printedBy: string;
  printedAt: Date;
  copies: number;
  printer: string;
  pdfPath: string;
  emailSent: boolean;
  emailRecipients: string[];
}

const printHistoryConfig = {
  storage: "database",
  retention: "5 years",
  indexing: ["documentType", "documentId", "printedBy", "printedAt"],
  search: {
    fields: ["documentNumber", "documentType", "printedBy"],
    filters: ["dateRange", "documentType", "printedBy"]
  }
};
```

---

## 🖨️ Print Security & Permissions

### Print Permissions
```typescript
interface PrintPermissions {
  documentType: string;
  roles: string[];
  requireApproval: boolean;
  maxCopies: number;
  allowDownload: boolean;
  allowEmail: boolean;
  watermarkIfDraft: boolean;
}

const printPermissionsConfig = {
  voucher: {
    roles: ["admin", "accountant", "finance-manager"],
    requireApproval: false,
    maxCopies: 5,
    allowDownload: true,
    allowEmail: true,
    watermarkIfDraft: true
  },
  
  receipt: {
    roles: ["admin", "accountant", "finance-manager", "sales"],
    requireApproval: false,
    maxCopies: 3,
    allowDownload: true,
    allowEmail: true,
    watermarkIfDraft: false
  },
  
  booking: {
    roles: ["admin", "sales", "management"],
    requireApproval: false,
    maxCopies: 3,
    allowDownload: true,
    allowEmail: true,
    watermarkIfDraft: true
  },
  
  statement: {
    roles: ["admin", "accountant", "finance-manager", "auditor"],
    requireApproval: false,
    maxCopies: 2,
    allowDownload: true,
    allowEmail: false,
    watermarkIfDraft: false
  },
  
  invoice: {
    roles: ["admin", "accountant", "finance-manager", "sales"],
    requireApproval: false,
    maxCopies: 3,
    allowDownload: true,
    allowEmail: true,
    watermarkIfDraft: true
  },
  
  payslip: {
    roles: ["admin", "hr-manager", "employee-self"],
    requireApproval: false,
    maxCopies: 2,
    allowDownload: true,
    allowEmail: true,
    watermarkIfDraft: false
  }
};
```

---

## 🖨️ Print Customization Options

### Template Customization
```typescript
interface TemplateCustomization {
  companyLogo: string;
  companyColors: {
    primary: string;
    secondary: string;
  };
  headerTemplate: string;
  footerTemplate: string;
  watermark: {
    text: string;
    opacity: number;
    position: string;
  };
  customFields: CustomField[];
}

const templateCustomizationOptions = {
  logo: {
    upload: true,
    maxSize: "2MB",
    allowedTypes: ["image/png", "image/jpeg"]
  },
  colors: {
    primary: "#10B981",
    secondary: "#3B82F6",
    custom: true
  },
  header: {
    templates: ["default", "minimal", "detailed"],
    custom: true
  },
  footer: {
    templates: ["default", "minimal", "detailed"],
    custom: true
  },
  watermark: {
    text: "DRAFT",
    opacity: 0.1,
    position: "center"
  }
};
```

---

## 🎯 Print Quality Standards

### Print Quality Checklist
```typescript
const printQualityChecklist = {
  resolution: {
    minimum: "300 DPI",
    recommended: "600 DPI"
  },
  color: {
    mode: "CMYK for print",
    RGB: "for screen preview only"
  },
  fonts: {
    embed: true,
    outline: true,
    subset: true
  },
  images: {
    compression: "lossless",
    format: "TIFF for print",
    resolution: "300 DPI minimum"
  },
  bleeds: {
    margin: "3mm",
    safety: "5mm"
  },
  cropMarks: {
    show: false,
    position: "corners"
  }
};
```

---

## 📋 Print Implementation Checklist

### Print Workflow Implementation
- [ ] Print button integration in all relevant pages
- [ ] Print data fetching API endpoints
- [ ] Print template rendering engine
- [ ] Print preview modal component
- [ ] PDF generation library integration
- [ ] Print history storage system
- [ ] Email with PDF attachment
- [ ] Print permission system
- [ ] Print customization options
- [ ] Print quality validation

### Document Template Implementation
- [ ] Voucher print template
- [ ] Money receipt print template
- [ ] Booking confirmation print template
- [ ] Account statement print template
- [ ] Invoice print template
- [ ] Purchase order print template
- [ ] Payslip print template
- [ ] MRN print template
- [ ] RA bill print template
- [ ] Work order print template

### Print Optimization
- [ ] Lazy loading of print templates
- [ ] Caching of frequently printed documents
- [ ] Batch printing support
- [ ] Print queue management
- [ ] Error handling and retry logic
- [ ] Print performance monitoring
- [ ] User activity logging
- [ ] Print cost tracking

This comprehensive print layout and document design planning ensures that all financial, sales, procurement, construction, and HR documents are printed in a professional, consistent, and cost-effective manner while maintaining brand identity and regulatory compliance.
