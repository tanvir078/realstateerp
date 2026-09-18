# Procurement & Vendor Module - Comprehensive Planning Document

## 🏗️ Module Overview
**Module Name:** Procurement & Vendor  
**Parent Navigation:** Dashboard → Procurement & Vendor  
**Sub-menus:** Purchase Orders, Vendors, Vendor Bills, Site Advances  
**Primary Users:** Procurement Team, Project Managers, Finance Team, Site Engineers  

---

## 📋 Module Structure & Navigation Flow

```
Dashboard
└── Procurement & Vendor
    ├── Purchase Orders
    │   ├── PO List (Table View)
    │   ├── New Purchase Order (Modal Form)
    │   ├── PO Details (Detail Page)
    │   ├── Edit PO (Modal Form)
    │   ├── Approve PO (Action)
    │   ├── Cancel PO (Confirmation Dialog)
    │   └── PO Status Tracking
    │
    ├── Vendors
    │   ├── Vendor List (Table View)
    │   ├── Add Vendor (Modal Form)
    │   ├── Vendor Details (Detail Page)
    │   ├── Edit Vendor (Modal Form)
    │   ├── Vendor Performance (Dashboard)
    │   └── Vendor Rating System
    │
    ├── Vendor Bills
    │   ├── Bills List (Table View)
    │   ├── Record Bill (Modal Form)
    │   ├── Bill Details (Detail Page)
    │   ├── Process Payment (Modal Form)
    │   ├── Approve Bill (Action)
    │   └── Bill Reconciliation
    │
    └── Site Advances
        ├── Advances List (Table View)
        ├── New Advance (Modal Form)
        │   ├── Advance Details (Detail Page)
        │   ├── Approve Advance (Action)
        │   ├── Process Payment (Modal Form)
        │   └── Advance Recovery Tracking
```

---

## 🎨 UI/UX Design Standards

### Color Palette Integration
```css
/* Vendor Status Colors */
.vendor-active { background: #10B981; }           /* Green */
.vendor-inactive { background: #6B7280; }         /* Gray */
.vendor-pending { background: #F59E0B; }          /* Amber */
.vendor-blacklisted { background: #EF4444; }      /* Red */

/* PO Status Colors */
.po-draft { background: #6B7280; }               /* Gray */
.po-pending { background: #F59E0B; }             /* Amber */
.po-approved { background: #3B82F6; }             /* Blue */
.po-ordered { background: #10B981; }             /* Green */
.po-delivered { background: #8B5CF6; }           /* Purple */
.po-cancelled { background: #EF4444; }           /* Red */

/* Bill Status Colors */
.bill-pending { background: #F59E0B; }            /* Amber */
.bill-processing { background: #3B82F6; }         /* Blue */
.bill-approved { background: #10B981; }          /* Green */
.bill-paid { background: #8B5CF6; }              /* Purple */
.bill-overdue { background: #EF4444; }           /* Red */

/* Advance Status Colors */
.advance-pending { background: #F59E0B; }          /* Amber */
.advance-approved { background: #10B981; }        /* Green */
.advance-disbursed { background: #3B82F6; }       /* Blue */
.advance-recovered { background: #8B5CF6; }      /* Purple */
.advance-partial { background: #F59E0B; }        /* Amber */
```

### Typography Hierarchy
```css
/* Vendor Cards */
.vendor-name { font-size: 18px; font-weight: 600; color: #1F2937; }
.vendor-type { font-size: 13px; color: #6B7280; }
.vendor-rating { font-size: 14px; font-weight: 500; color: #F59E0B; }

/* PO Cards */
.po-number { font-size: 16px; font-weight: 600; color: #1F2937; }
.po-amount { font-size: 16px; font-weight: 700; color: #10B981; }
.po-vendor { font-size: 14px; color: #374151; }

/* Bill Cards */
.bill-amount { font-size: 16px; font-weight: 600; color: #1F2937; }
.bill-due-date { font-size: 13px; color: #6B7280; }
.bill-status { font-size: 12px; font-weight: 500; }
```

### Layout Structure
```css
/* Vendor Grid Layout */
.vendor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* PO Table Layout */
.po-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

/* Bill Dashboard */
.bill-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* Advance Timeline */
.advance-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}
```

---

## 📝 Form 1: Vendor Registration Form

### Form Architecture
```typescript
interface VendorFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  duplicateCheck: true;
  ratingSystem: true;
}
```

### Form Structure Design

#### Section 1: Basic Information
```typescript
{
  section: "Basic Information",
  layout: "two-column",
  fields: [
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "text",
      placeholder: "Enter vendor company name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
        pattern: "^[a-zA-Z0-9\\s\\-\\.']+$"
      },
      ui: {
        icon: "building",
        size: "large",
        autoFocus: true,
        helper: "Registered company name"
      },
      duplicateCheck: {
        endpoint: "/api/v1/vendors/check-duplicate",
        field: "vendorName",
        message: "Vendor with this name already exists"
      }
    },
    {
      name: "vendorType",
      label: "Vendor Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "materials", label: "Materials Supplier", icon: "package" },
          { value: "construction", label: "Construction Contractor", icon: "hard-hat" },
          { value: "services", label: "Service Provider", icon: "briefcase" },
          { value: "equipment", label: "Equipment Rental", icon: "truck" },
          { value: "consulting", label: "Consulting Services", icon: "users" }
        ]
      },
      validation: {
        required: true
      },
      ui: {
        icon: "type",
        helper: "Select primary vendor category"
      }
    },
    {
      name: "contactPerson",
      label: "Contact Person",
      type: "text",
      placeholder: "Enter contact person name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50
      },
      ui: {
        icon: "user",
        helper: "Primary contact person"
      }
    },
    {
      name: "designation",
      label: "Designation",
      type: "text",
      placeholder: "Enter designation",
      required: false,
      validation: {
        maxLength: 50
      },
      ui: {
        icon: "badge",
        helper: "Contact person's designation"
      }
    }
  ]
}
```

#### Section 2: Contact Information
```typescript
{
  section: "Contact Information",
  layout: "two-column",
  fields: [
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "0171-234567",
      required: true,
      validation: {
        pattern: "^[0-9]{11}$",
        customMessage: "Enter 11-digit Bangladeshi phone number"
      },
      ui: {
        icon: "phone",
        helper: "Primary contact number",
        format: "XXX-XXXXXXX"
      }
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "vendor@example.com",
      required: true,
      validation: {
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        customMessage: "Enter valid email address"
      },
      ui: {
        icon: "mail",
        helper: "Primary email for communications"
      }
    },
    {
      name: "alternatePhone",
      label: "Alternate Phone",
      type: "tel",
      placeholder: "0181-345678",
      required: false,
      validation: {
        pattern: "^[0-9]{11}$"
      },
      ui: {
        icon: "phone",
        helper: "Secondary contact number"
      }
    },
    {
      name: "website",
      label: "Website",
      type: "url",
      placeholder: "https://www.example.com",
      required: false,
      validation: {
        pattern: "^https?:\\/\\/.+"
      },
      ui: {
        icon: "globe",
        helper: "Company website URL"
      }
    }
  ]
}
```

#### Section 3: Address Information
```typescript
{
  section: "Address Information",
  layout: "two-column",
  fields: [
    {
      name: "address",
      label: "Business Address",
      type: "textarea",
      placeholder: "Enter complete business address...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        rows: 3,
        helper: "Complete business address"
      }
    },
    {
      name: "city",
      label: "City",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/locations/cities",
        cache: true
      },
      ui: {
        icon: "map",
        searchable: true
      }
    },
    {
      name: "area",
      label: "Area/Thana",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/locations/areas",
        dependsOn: "city",
        cache: true
      },
      ui: {
        icon: "map-marker",
        searchable: true
      }
    },
    {
      name: "postalCode",
      label: "Postal Code",
      type: "text",
      placeholder: "1200",
      required: false,
      validation: {
        pattern: "^\\d{4}$"
      },
      ui: {
        icon: "map-pin",
        helper: "Postal code"
      }
    }
  ]
}
```

#### Section 4: Business Information
```typescript
{
  section: "Business Information",
  layout: "two-column",
  fields: [
    {
      name: "taxId",
      label: "Tax Identification Number",
      type: "text",
      placeholder: "Enter TIN",
      required: false,
      validation: {
        pattern: "^\\d{12}$",
        customMessage: "Enter 12-digit TIN"
      },
      ui: {
        icon: "percent",
        helper: "Tax ID for invoicing purposes"
      }
    },
    {
      name: "businessRegistration",
      label: "Business Registration Number",
      type: "text",
      placeholder: "Enter registration number",
      required: false,
      validation: {
        pattern: "^[A-Z0-9\\-]+$"
      },
      ui: {
        icon: "file-text",
        helper: "RJSC or business registration number"
      }
    },
    {
      name: "establishedYear",
      label: "Year Established",
      type: "number",
      placeholder: "2010",
      required: false,
      validation: {
        min: 1950,
        max: "currentYear"
      },
      ui: {
        icon: "calendar",
        helper: "Year business was established"
      }
    },
    {
      name: "employees",
      label: "Number of Employees",
      type: "number",
      placeholder: "50",
      required: false,
      validation: {
        min: 1,
        max: 10000
      },
      ui: {
        icon: "users",
        helper: "Approximate number of employees"
      }
    }
  ]
}
```

#### Section 5: Financial Information
```typescript
{
  section: "Financial Information",
  layout: "two-column",
  fields: [
    {
      name: "creditLimit",
      label: "Credit Limit",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: 100000000
      },
      ui: {
        icon: "credit-card",
        prefix: "৳",
        helper: "Maximum credit amount allowed"
      }
    },
    {
      name: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "cod", label: "Cash on Delivery (COD)" },
          { value: "net7", label: "Net 7 Days" },
          { value: "net15", label: "Net 15 Days" },
          { value: "net30", label: "Net 30 Days" },
          { value: "net45", label: "Net 45 Days" },
          { value: "net60", label: "Net 60 Days" },
          { value: "net90", label: "Net 90 Days" }
        ]
      },
      ui: {
        icon: "clock",
        helper: "Standard payment terms"
      }
    },
    {
      name: "bankName",
      label: "Bank Name",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/banks",
        cache: true
      },
      ui: {
        icon: "bank",
        helper: "Primary bank for payments"
      }
    },
    {
      name: "bankAccount",
      label: "Bank Account Number",
      type: "text",
      placeholder: "Enter account number",
      required: true,
      validation: {
        pattern: "^\\d{10,17}$",
        customMessage: "Enter valid bank account number"
      },
      ui: {
        icon: "credit-card",
        helper: "Account number for payments",
        mask: "XXXXXXXXXXXXXXX"
      }
    },
    {
      name: "branch",
      label: "Bank Branch",
      type: "text",
      placeholder: "Enter branch name",
      required: true,
      validation: {
        maxLength: 50
      },
      ui: {
        icon: "map-pin",
        helper: "Bank branch name"
      }
    },
    {
      name: "routingNumber",
      label: "Routing Number",
      type: "text",
      placeholder: "Enter routing number",
      required: false,
      validation: {
        pattern: "^\\d{9}$"
      },
      ui: {
        icon: "hash",
        helper: "Bank routing number"
      }
    }
  ]
}
```

#### Section 6: Services & Products
```typescript
{
  section: "Services & Products",
  layout: "single-column",
  fields: [
    {
      name: "services",
      label: "Services/Products Offered",
      type: "multiselect",
      required: true,
      options: {
        source: "dynamic",
        endpoint: "/api/v1/vendors/service-categories",
        dependsOn: "vendorType"
      },
      ui: {
        icon: "package",
        helper: "Select services or products this vendor provides",
        searchable: true,
        maxSelection: 10
      }
    },
    {
      name: "specializations",
      label: "Specializations",
      type: "multiselect",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "residential", label: "Residential Projects" },
          { value: "commercial", label: "Commercial Projects" },
          { value: "industrial", label: "Industrial Projects" },
          { value: "renovation", label: "Renovation Work" },
          { value: "maintenance", label: "Maintenance Services" }
        ]
      },
      ui: {
        icon: "star",
        helper: "Areas of specialization"
      }
    },
    {
      name: "serviceAreas",
      label: "Service Areas",
      type: "multiselect",
      required: false,
      options: {
        source: "api",
        endpoint: "/api/locations/divisions",
        cache: true
      },
      ui: {
        icon: "map",
        helper: "Geographic areas served",
        searchable: true
      }
    }
  ]
}
```

#### Section 7: Additional Information
```typescript
{
  section: "Additional Information",
  layout: "single-column",
  fields: [
    {
      name: "rating",
      label: "Initial Rating",
      type: "rating",
      required: true,
      validation: {
        min: 1,
        max: 5,
        step: 0.5
      },
      ui: {
        icon: "star",
        helper: "Initial vendor rating (1-5 stars)",
        defaultValue: 3.5
      }
    },
    {
      name: "notes",
      label: "Additional Notes",
      type: "textarea",
      placeholder: "Enter any additional notes...",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Any additional information about the vendor"
      }
    },
    {
      name: "documents",
      label: "Vendor Documents",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 10,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: false,
        helper: "Upload trade license, tax certificate, etc."
      }
    }
  ]
}
```

### Form Submission Flow

#### Step 1: Client-Side Validation
```typescript
const validateVendorForm = (formData: VendorFormData) => {
  // Required field validation
  const requiredFields = ['vendorName', 'vendorType', 'contactPerson', 'phone', 'email', 'address', 'creditLimit', 'paymentTerms', 'bankName', 'bankAccount', 'branch'];
  
  // Format validation
  const formatValidations = {
    phone: /^[0-9]{11}$/,
    email: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/,
    taxId: /^\\d{12}$/,
    bankAccount: /^\\d{10,17}$/,
    routingNumber: /^\\d{9}$/
  };
  
  // Business logic validation
  const businessValidations = {
    creditLimit: (value: number) => value >= 0 && value <= 100000000,
    establishedYear: (value: number) => value >= 1950 && value <= new Date().getFullYear()
  };
  
  return { isValid: boolean, errors: ValidationError[] };
};
```

#### Step 2: Data Preparation
```typescript
const prepareVendorData = (formData: VendorFormData) => {
  return {
    ...formData,
    phone: formatPhoneNumber(formData.phone),
    email: formData.email.toLowerCase(),
    address: formData.address.trim(),
    creditLimit: parseFloat(formData.creditLimit),
    services: formData.services.join(','),
    specializations: formData.specializations.join(','),
    serviceAreas: formData.serviceAreas.join(','),
    rating: parseFloat(formData.rating),
    status: 'active',
    totalOrders: 0,
    totalAmount: 0,
    averageRating: formData.rating,
    createdBy: getCurrentUserId(),
    createdAt: new Date().toISOString()
  };
};
```

#### Step 3: API Submission
```typescript
const submitVendorForm = async (preparedData: PreparedVendorData) => {
  try {
    // Step 3.1: Upload documents first
    const documentUrls = await uploadFiles(preparedData.documents, 'vendors/documents');
    
    // Step 3.2: Prepare final data
    const finalData = {
      ...preparedData,
      documents: documentUrls
    };
    
    // Step 3.3: Submit to API
    const response = await apiClient.post('/api/v1/vendors', finalData);
    
    // Step 3.4: Handle response
    if (response.success) {
      return { success: true, vendorId: response.data.id };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### API Integration Specifications

#### Create Vendor API
```typescript
// Endpoint: POST /api/v1/vendors
interface CreateVendorAPI {
  method: 'POST';
  endpoint: '/api/v1/vendors';
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
  };
  requestBody: {
    vendorName: string;
    vendorType: 'materials' | 'construction' | 'services' | 'equipment' | 'consulting';
    contactPerson: string;
    designation?: string;
    phone: string;
    email: string;
    alternatePhone?: string;
    website?: string;
    address: string;
    city: string;
    area: string;
    postalCode?: string;
    taxId?: string;
    businessRegistration?: string;
    establishedYear?: number;
    employees?: number;
    creditLimit: number;
    paymentTerms: string;
    bankName: string;
    bankAccount: string;
    branch: string;
    routingNumber?: string;
    services: string;
    specializations?: string;
    serviceAreas?: string;
    rating: number;
    notes?: string;
    documents?: string[];
  };
  response: {
    success: boolean;
    data?: {
      id: string;
      vendorCode: string;
      status: string;
      createdAt: string;
    };
    message?: string;
    errors?: ValidationError[];
  };
}
```

---

## 📝 Form 2: Purchase Order Creation Form

### Form Architecture
```typescript
interface PurchaseOrderFormArchitecture {
  formType: "modal";
  layout: "mixed";
  validation: "real-time";
  submission: "async";
  dynamicItems: true;
  autoCalculation: true;
  approvalWorkflow: true;
}
```

### Form Structure Design

#### Section 1: Basic Information
```typescript
{
  section: "Basic Information",
  layout: "two-column",
  fields: [
    {
      name: "project",
      label: "Select Project",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/active",
        displayField: "projectName",
        valueField: "id",
        cache: true
      },
      ui: {
        icon: "building",
        searchable: true,
        helper: "Select project for this purchase order"
      }
    },
    {
      name: "vendor",
      label: "Select Vendor",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/vendors/active",
        queryParams: {
          vendorType: "materials"
        },
        displayField: "vendorName",
        valueField: "id",
        additionalFields: ["creditLimit", "paymentTerms", "rating"]
      },
      ui: {
        icon: "users",
        searchable: true,
        helper: "Select vendor for this purchase order"
      }
    },
    {
      name: "orderDate",
      label: "Order Date",
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
      name: "expectedDeliveryDate",
      label: "Expected Delivery Date",
      type: "date",
      required: true,
      validation: {
        minDate: "orderDate + 7 days"
      },
      ui: {
        icon: "calendar-check",
        helper: "Expected delivery date"
      }
    }
  ]
}
```

#### Section 2: Order Items (Dynamic)
```typescript
{
  section: "Order Items",
  layout: "dynamic-table",
  fields: [
    {
      name: "items",
      type: "dynamic-array",
      required: true,
      minItems: 1,
      maxItems: 50,
      fields: [
        {
          name: "material",
          label: "Material/Item",
          type: "select",
          required: true,
          options: {
            source: "api",
            endpoint: "/api/materials",
            displayField: "name",
            valueField: "id",
            additionalFields: ["unit", "currentPrice"]
          },
          ui: {
            searchable: true,
            width: "200px"
          }
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
          validation: {
            maxLength: 100
          },
          ui: {
            placeholder: "Item description",
            width: "150px"
          }
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
          validation: {
            min: 1,
            step: 1
          },
          ui: {
            placeholder: "0",
            width: "80px",
            onChange: "calculateLineTotal"
          }
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          required: true,
          options: {
            source: "static",
            data: [
              { value: "pcs", label: "Pieces" },
              { value: "kg", label: "Kilograms" },
              { value: "ton", label: "Tons" },
              { value: "m", label: "Meters" },
              { value: "sqft", label: "Square Feet" },
              { value: "l", label: "Liters" },
              { value: "bag", label: "Bags" }
            ]
          },
          ui: {
            width: "80px"
          }
        },
        {
          name: "unitPrice",
          label: "Unit Price",
          type: "currency",
          required: true,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            placeholder: "0.00",
            width: "120px",
            onChange: "calculateLineTotal"
          }
        },
        {
          name: "lineTotal",
          label: "Line Total",
          type: "currency",
          required: true,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            disabled: true,
            calculated: true,
            width: "120px"
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
        addButtonText: "Add Item",
        tableLayout: true,
        showTotals: true
      }
    }
  ]
}
```

#### Section 3: Order Summary
```typescript
{
  section: "Order Summary",
  layout: "informational",
  fields: [
    {
      name: "orderSummary",
      type: "information-display",
      displayFormat: "card",
      fields: [
        {
          label: "Total Items",
          value: "items.length",
          icon: "package"
        },
        {
          label: "Total Quantity",
          value: "sum(items.quantity)",
          icon: "hash"
        },
        {
          label: "Subtotal",
          value: "formatCurrency(sum(items.lineTotal))",
          icon: "dollar-sign"
        },
        {
          label: "VAT (5%)",
          value: "formatCurrency(subtotal * 0.05)",
          icon: "percent"
        },
        {
          label: "Shipping Cost",
          value: "formatCurrency(shippingCost)",
          icon: "truck"
        },
        {
          label: "Grand Total",
          value: "formatCurrency(subtotal + vat + shipping)",
          icon: "dollar-sign",
          highlight: true,
          size: "large"
        }
      ]
    }
  ]
}
```

#### Section 4: Shipping & Delivery
```typescript
{
  section: "Shipping & Delivery",
  layout: "two-column",
  fields: [
    {
      name: "shippingAddress",
      label: "Shipping Address",
      type: "textarea",
      placeholder: "Enter shipping address...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        rows: 2,
        helper: "Delivery address (if different from vendor address)"
      }
    },
    {
      name: "shippingMethod",
      label: "Shipping Method",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "vendor", label: "Vendor Delivery" },
          { value: "company", label: "Company Transport" },
          { value: "pickup", label: "Pickup by Company" }
        ]
      },
      ui: {
        icon: "truck"
      }
    },
    {
      name: "shippingCost",
      label: "Shipping Cost",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        defaultValue: 0,
        onChange: "recalculateTotal"
      }
    },
    {
      name: "deliveryInstructions",
      label: "Delivery Instructions",
      type: "textarea",
      placeholder: "Enter delivery instructions...",
      required: false,
      validation: {
        maxLength: 300
      },
      ui: {
        icon: "message-square",
        rows: 2
      }
    }
  ]
}
```

#### Section 5: Payment Terms
```typescript
{
  section: "Payment Terms",
  layout: "two-column",
  fields: [
    {
      name: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/vendors/{vendor}/payment-terms",
        dependsOn: "vendor",
        displayField: "terms"
      },
      ui: {
        icon: "clock",
        helper: "Vendor's standard payment terms"
      }
    },
    {
      name: "advancePayment",
      label: "Advance Payment",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0,
        max: "grandTotal * 0.5"
      },
      ui: {
        icon: "credit-card",
        prefix: "৳",
        helper: "Advance payment amount (optional)"
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
          { value: "bank", label: "Bank Transfer" },
          { value: "check", label: "Check" },
          { value: "cash", label: "Cash" }
        ]
      },
      ui: {
        icon: "credit-card"
      }
    },
    {
      name: "budgetCode",
      label: "Budget Code",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/{project}/budget-codes",
        dependsOn: "project"
      },
      ui: {
        icon: "tag",
        helper: "Budget code for expense tracking"
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
      name: "notes",
      label: "Order Notes",
      type: "textarea",
      placeholder: "Enter any special instructions...",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3
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
        helper: "Upload quotations, specifications, etc."
      }
    },
    {
      name: "internalNotes",
      label: "Internal Notes",
      type: "textarea",
      placeholder: "Internal notes for team...",
      required: false,
      validation: {
        maxLength: 300
      },
      ui: {
        icon: "lock",
        rows: 2,
        helper: "Notes visible only to internal team"
      }
    }
  ]
}
```

### Form Submission Flow

#### Line Item Calculation
```typescript
const calculateLineTotal = (item: OrderItem): number => {
  return item.quantity * item.unitPrice;
};

const calculateOrderTotals = (items: OrderItem[], shippingCost: number): OrderTotals => {
  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const vat = subtotal * 0.05; // 5% VAT
  const grandTotal = subtotal + vat + shippingCost;
  
  return {
    subtotal,
    vat,
    shippingCost,
    grandTotal
  };
};
```

#### Vendor Credit Check
```typescript
const checkVendorCredit = async (vendorId: string, orderAmount: number): Promise<CreditCheckResult> => {
  try {
    const response = await apiClient.get(`/api/v1/vendors/${vendorId}/credit-check`, {
      params: { orderAmount }
    });
    
    return {
      approved: response.data.approved,
      remainingCredit: response.data.remainingCredit,
      message: response.data.message
    };
  } catch (error) {
    return {
      approved: false,
      remainingCredit: 0,
      message: "Credit check failed"
    };
  }
};
```

---

## 📝 Form 3: Vendor Bill Recording Form

### Form Architecture
```typescript
interface VendorBillFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  poLinking: true;
  approvalWorkflow: true;
}
```

### Form Structure Design

#### Section 1: Bill Information
```typescript
{
  section: "Bill Information",
  layout: "two-column",
  fields: [
    {
      name: "vendor",
      label: "Select Vendor",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/vendors/active",
        displayField: "vendorName",
        valueField: "id"
      },
      ui: {
        icon: "users",
        searchable: true,
        helper: "Select vendor for this bill"
      }
    },
    {
      name: "purchaseOrder",
      label: "Purchase Order Reference",
      type: "select",
      required: false,
      options: {
        source: "api",
        endpoint: "/api/v1/purchase-orders/pending-billing",
        queryParams: {
          vendor: "{vendor}"
        },
        dependsOn: "vendor",
        displayField: "poNumber",
        valueField: "id",
        additionalFields: ["orderDate", "totalAmount", "status"]
      },
      ui: {
        icon: "file-text",
        searchable: true,
        helper: "Link to existing purchase order (optional)"
      }
    },
    {
      name: "billNumber",
      label: "Bill Number",
      type: "text",
      placeholder: "Enter bill number",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50,
        pattern: "^[A-Z0-9\\-]+$"
      },
      ui: {
        icon: "hash",
        helper: "Vendor's bill/invoice number"
      },
      duplicateCheck: {
        endpoint: "/api/v1/vendor-bills/check-duplicate",
        field: "billNumber",
        vendorField: "vendor",
        message: "Bill number already exists for this vendor"
      }
    },
    {
      name: "billDate",
      label: "Bill Date",
      type: "date",
      required: true,
      validation: {
        maxDate: "today"
      },
      ui: {
        icon: "calendar"
      }
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: "date",
      required: true,
      validation: {
        minDate: "billDate"
      },
      ui: {
        icon: "calendar-check",
        helper: "Payment due date"
      }
    }
  ]
}
```

#### Section 2: Bill Details
```typescript
{
  section: "Bill Details",
  layout: "two-column",
  fields: [
    {
      name: "project",
      label: "Project",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/active",
        displayField: "projectName",
        valueField: "id"
      },
      ui: {
        icon: "building",
        searchable: true
      }
    },
    {
      name: "billAmount",
      label: "Bill Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Total bill amount"
      }
    },
    {
      name: "taxAmount",
      label: "Tax Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0
      },
      ui: {
        icon: "percent",
        prefix: "৳",
        helper: "VAT or tax amount (if included)"
      }
    },
    {
      name: "discountAmount",
      label: "Discount Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0,
        max: "billAmount"
      },
      ui: {
        icon: "tag",
        prefix: "৳",
        helper: "Any discount applied"
      }
    },
    {
      name: "netAmount",
      label: "Net Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        disabled: true,
        calculated: true,
        formula: "billAmount + taxAmount - discountAmount"
      }
    }
  ]
}
```

#### Section 3: Bill Description
```typescript
{
  section: "Bill Description",
  layout: "single-column",
  fields: [
    {
      name: "description",
      label: "Bill Description",
      type: "textarea",
      placeholder: "Enter bill description...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Detailed description of goods/services billed"
      }
    },
    {
      name: "lineItems",
      label: "Line Items",
      type: "dynamic-array",
      required: false,
      minItems: 0,
      maxItems: 20,
      fields: [
        {
          name: "item",
          label: "Item",
          type: "text",
          required: true,
          validation: {
            maxLength: 100
          }
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true
        },
        {
          name: "unit",
          label: "Unit",
          type: "text",
          required: true
        },
        {
          name: "rate",
          label: "Rate",
          type: "currency",
          required: true
        },
        {
          name: "amount",
          label: "Amount",
          type: "currency",
          required: true,
          calculated: true
        }
      ],
      ui: {
        addButtonText: "Add Line Item",
        tableLayout: true
      }
    }
  ]
}
```

#### Section 4: Attachments & Notes
```typescript
{
  section: "Attachments & Notes",
  layout: "single-column",
  fields: [
    {
      name: "billDocument",
      label: "Bill Document",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 5,
        maxSize: "10MB",
        allowedTypes: ["application/pdf"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: false,
        helper: "Upload vendor bill/invoice (PDF required)"
      }
    },
    {
      name: "supportingDocuments",
      label: "Supporting Documents",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 10,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "paperclip",
        multiple: true,
        preview: false,
        helper: "Delivery notes, challans, etc."
      }
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Enter any notes...",
      required: false,
      validation: {
        maxLength: 300
      },
      ui: {
        icon: "file-text",
        rows: 2
      }
    }
  ]
}
```

---

## 📝 Form 4: Site Advance Request Form

### Form Architecture
```typescript
interface SiteAdvanceFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  approvalWorkflow: true;
  recoveryTracking: true;
}
```

### Form Structure Design

#### Section 1: Advance Information
```typescript
{
  section: "Advance Information",
  layout: "two-column",
  fields: [
    {
      name: "project",
      label: "Select Project",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/active",
        displayField: "projectName",
        valueField: "id"
      },
      ui: {
        icon: "building",
        searchable: true
      }
    },
    {
      name: "contractor",
      label: "Select Contractor",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/contractors/active",
        queryParams: {
          project: "{project}"
        },
        dependsOn: "project",
        displayField: "contractorName",
        valueField: "id",
        additionalFields: ["contractValue", "remainingContract", "workOrders"]
      },
      ui: {
        icon: "hard-hat",
        searchable: true
      }
    },
    {
      name: "workOrder",
      label: "Work Order Reference",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/work-orders/active",
        queryParams: {
          contractor: "{contractor}",
          project: "{project}"
        },
        dependsOn: ["contractor", "project"],
        displayField: "woNumber",
        valueField: "id",
        additionalFields: ["description", "amount", "status"]
      },
      ui: {
        icon: "file-text",
        searchable: true
      }
    },
    {
      name: "advanceType",
      label: "Advance Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "mobilization", label: "Mobilization Advance" },
          { value: "material", label: "Material Advance" },
          { value: "progress", label: "Progress Payment" },
          { value: "special", label: "Special Advance" }
        ]
      },
      ui: {
        icon: "type"
      }
    }
  ]
}
```

#### Section 2: Financial Details
```typescript
{
  section: "Financial Details",
  layout: "two-column",
  fields: [
    {
      name: "advanceAmount",
      label: "Advance Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: "workOrder.amount * 0.3"
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Maximum 30% of work order amount"
      }
    },
    {
      name: "requestedDate",
      label: "Requested Date",
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
      name: "expectedRecoveryDate",
      label: "Expected Recovery Date",
      type: "date",
      required: true,
      validation: {
        minDate: "requestedDate + 30 days"
      },
      ui: {
        icon: "calendar-check",
        helper: "Expected date for recovery from bill"
      }
    },
    {
      name: "recoveryMethod",
      label: "Recovery Method",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "ra_bill", label: "From RA Bill" },
          { value: "final_bill", label: "From Final Bill" },
          { value: "partial", label: "Partial Recovery" },
          { value: "separate", label: "Separate Payment" }
        ]
      },
      ui: {
        icon: "refresh-cw"
      }
    }
  ]
}
```

#### Section 3: Purpose & Justification
```typescript
{
  section: "Purpose & Justification",
  layout: "single-column",
  fields: [
    {
      name: "purpose",
      label: "Purpose of Advance",
      type: "textarea",
      placeholder: "Enter purpose of advance...",
      required: true,
      validation: {
        minLength: 20,
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Detailed purpose for this advance request"
      }
    },
    {
      name: "justification",
      label: "Justification",
      type: "textarea",
      placeholder: "Enter justification...",
      required: true,
      validation: {
        minLength: 20,
        maxLength: 500
      },
      ui: {
        icon: "check-circle",
        rows: 3,
        helper: "Why this advance is necessary"
      }
    },
    {
      name: "breakdown",
      label: "Fund Breakdown",
      type: "dynamic-array",
      required: true,
      minItems: 1,
      maxItems: 10,
      fields: [
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: {
            source: "static",
            data: [
              { value: "labor", label: "Labor Cost" },
              { value: "material", label: "Material Cost" },
              { value: "equipment", label: "Equipment Cost" },
              { value: "transport", label: "Transport Cost" },
              { value: "other", label: "Other" }
            ]
          }
        },
        {
          name: "amount",
          label: "Amount",
          type: "currency",
          required: true
        },
        {
          name: "percentage",
          label: "% of Total",
          type: "percentage",
          calculated: true
        }
      ],
      ui: {
        addButtonText: "Add Breakdown Item",
        tableLayout: true,
        showTotal: true
      }
    }
  ]
}
```

#### Section 4: Supporting Documents
```typescript
{
  section: "Supporting Documents",
  layout: "single-column",
  fields: [
    {
      name: "supportingDocuments",
      label: "Supporting Documents",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 5,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: false,
        helper: "Upload work order copy, quotations, estimates, etc."
      }
    },
    {
      name: "previousAdvanceReference",
      label: "Previous Advance Reference",
      type: "text",
      placeholder: "Enter previous advance number (if any)",
      required: false,
      validation: {
        pattern: "^[A-Z0-9\\-]+$"
      },
      ui: {
        icon: "history",
        helper: "Reference to previous advance for this work order"
      }
    }
  ]
}
```

---

## 🎯 Button Functionality Mapping

### Purchase Orders Page Buttons
```typescript
const purchaseOrderButtons = {
  "New Purchase Order": {
    action: "openModal",
    modal: "PurchaseOrderForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Approve": {
    action: "approvePO",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "po.status === 'pending'"
  },
  "Cancel": {
    action: "cancelPO",
    icon: "x-circle",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "po.status !== 'delivered' && po.status !== 'cancelled'"
  },
  "View Details": {
    action: "navigate",
    route: "/purchase-orders/:id",
    icon: "eye",
    variant: "ghost",
    size: "small"
  },
  "Print PO": {
    action: "printDocument",
    documentType: "purchase-order",
    icon: "printer",
    variant: "ghost",
    size: "small"
  }
};
```

### Vendors Page Buttons
```typescript
const vendorPageButtons = {
  "Add Vendor": {
    action: "openModal",
    modal: "VendorForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "View Performance": {
    action: "navigate",
    route: "/vendors/:id/performance",
    icon: "bar-chart",
    variant: "ghost",
    size: "small"
  },
  "View Orders": {
    action: "navigate",
    route: "/vendors/:id/orders",
    icon: "shopping-cart",
    variant: "ghost",
    size: "small"
  },
  "Update Rating": {
    action: "openModal",
    modal: "VendorRatingForm",
    icon: "star",
    variant: "ghost",
    size: "small"
  },
  "Blacklist": {
    action: "confirmAction",
    confirmation: "Are you sure you want to blacklist this vendor?",
    icon: "ban",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "vendor.status === 'active'"
  }
};
```

### Vendor Bills Page Buttons
```typescript
const vendorBillButtons = {
  "Record Bill": {
    action: "openModal",
    modal: "VendorBillForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Process Payment": {
    action: "openModal",
    modal: "PaymentForm",
    icon: "credit-card",
    variant: "outline",
    size: "small",
    condition: "bill.status === 'approved'"
  },
  "Approve": {
    action: "approveBill",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "bill.status === 'pending'"
  },
  "View PO": {
    action: "navigate",
    route: "/purchase-orders/:id",
    icon: "file-text",
    variant: "ghost",
    size: "small",
    condition: "bill.purchaseOrder"
  },
  "Download Bill": {
    action: "downloadDocument",
    documentType: "vendor-bill",
    icon: "download",
    variant: "ghost",
    size: "small"
  }
};
```

### Site Advances Page Buttons
```typescript
const siteAdvanceButtons = {
  "New Advance": {
    action: "openModal",
    modal: "SiteAdvanceForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Approve": {
    action: "approveAdvance",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "advance.status === 'pending'"
  },
  "Process Payment": {
    action: "openModal",
    modal: "AdvancePaymentForm",
    icon: "credit-card",
    variant: "outline",
    size: "small",
    condition: "advance.status === 'approved'"
  },
  "View Recovery": {
    action: "navigate",
    route: "/site-advances/:id/recovery",
    icon: "refresh-cw",
    variant: "ghost",
    size: "small"
  },
  "Recovery Status": {
    action: "openModal",
    modal: "RecoveryStatusForm",
    icon: "activity",
    variant: "ghost",
    size: "small"
  }
};
```

---

## 📊 Data Flow Architecture

### Vendor Registration Data Flow
```
User Input → Vendor Type Selection → Contact Information → Business Details → Financial Information → Validation → Duplicate Check → Data Preparation → Document Upload → API Submission → Vendor Creation → Credit Limit Setup → Notification
```

### Purchase Order Data Flow
```
Project Selection → Vendor Selection → Vendor Credit Check → Order Items Entry → Line Item Calculation → Shipping Details → Payment Terms → Order Summary → Validation → API Submission → PO Creation → Vendor Notification → Budget Allocation → Status Tracking
```

### Vendor Bill Data Flow
```
Vendor Selection → PO Linking (Optional) → Bill Details → Line Items → Amount Calculation → Document Upload → Validation → API Submission → Bill Recording → PO Status Update → Approval Workflow → Payment Processing → Accounting Entry
```

### Site Advance Data Flow
```
Project Selection → Contractor Selection → Work Order Selection → Advance Details → Fund Breakdown → Purpose Justification → Document Upload → Validation → API Submission → Advance Request → Approval Workflow → Payment Processing → Recovery Setup → Contractor Notification
```

---

## 🔗 Module Relationships

### Vendors ↔ Purchase Orders Relationship
```typescript
interface VendorPORelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "vendorId";
  constraints: {
    status: "vendor must be 'active' for PO creation",
    credit: "PO amount cannot exceed available credit"
  };
}
```

### Purchase Orders ↔ Vendor Bills Relationship
```typescript
interface POBillRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "purchaseOrderId";
  constraints: {
    amount: "Total bill amount cannot exceed PO amount",
    status: "Cannot bill cancelled POs"
  };
}
```

### Contractors ↔ Site Advances Relationship
```typescript
interface ContractorAdvanceRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "contractorId";
  constraints: {
    workOrder: "Advance must be linked to active work order",
    amount: "Advance amount limited by work order and contract"
  };
}
```

### Projects ↔ Procurement Relationship
```typescript
interface ProjectProcurementRelationship {
  type: "one-to-many";
  cascade: "none";
  foreignKey: "projectId";
  constraints: {
    budget: "Procurement limited by project budget",
    status: "Active projects only"
  };
}
```

---

## 🎨 UI Component Specifications

### Vendor Performance Card Component
```typescript
interface VendorPerformanceCardProps {
  vendor: Vendor;
  onViewDetails: (id: string) => void;
  onViewOrders: (id: string) => void;
}

const VendorPerformanceCard = ({ vendor, onViewDetails, onViewOrders }: VendorPerformanceCardProps) => {
  return (
    <Card className="vendor-performance-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="vendor-name">{vendor.vendorName}</h3>
            <p className="vendor-type">{vendor.vendorType}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="vendor-rating">{vendor.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <PerformanceMetric 
            label="Total Orders" 
            value={vendor.totalOrders} 
            icon="shopping-cart" 
          />
          <PerformanceMetric 
            label="Total Amount" 
            value={formatCurrency(vendor.totalAmount)} 
            icon="dollar-sign" 
          />
          <PerformanceMetric 
            label="On-Time Delivery" 
            value={`${vendor.onTimeDeliveryRate}%`} 
            icon="clock" 
            color={vendor.onTimeDeliveryRate >= 90 ? 'green' : 'red'}
          />
          <PerformanceMetric 
            label="Quality Rating" 
            value={`${vendor.qualityRating}/5`} 
            icon="star" 
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onViewDetails(vendor.id)} variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" /> Details
            </Button>
            <Button onClick={() => onViewOrders(vendor.id)} variant="outline" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" /> Orders
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Purchase Order Summary Component
```typescript
interface PurchaseOrderSummaryProps {
  purchaseOrder: PurchaseOrder;
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
}

const PurchaseOrderSummary = ({ purchaseOrder, onApprove, onCancel }: PurchaseOrderSummaryProps) => {
  return (
    <Card className="po-summary">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="po-number">{purchaseOrder.poNumber}</h3>
            <p className="po-vendor">{purchaseOrder.vendorName}</p>
          </div>
          <Badge variant={getStatusVariant(purchaseOrder.status)}>
            {purchaseOrder.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <InfoRow icon="building" label="Project" value={purchaseOrder.projectName} />
          <InfoRow icon="calendar" label="Order Date" value={formatDate(purchaseOrder.orderDate)} />
          <InfoRow icon="truck" label="Expected Delivery" value={formatDate(purchaseOrder.expectedDeliveryDate)} />
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="po-amount">{formatCurrency(purchaseOrder.grandTotal)}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {purchaseOrder.status === 'pending' && (
            <Button onClick={() => onApprove(purchaseOrder.id)} variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </Button>
          )}
          {purchaseOrder.status !== 'delivered' && purchaseOrder.status !== 'cancelled' && (
            <Button onClick={() => onCancel(purchaseOrder.id)} variant="ghost" size="sm" className="text-red-600">
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 📱 Responsive Design Breakpoints

```css
/* Vendor Grid Responsive */
@media (min-width: 1024px) {
  .vendor-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .vendor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .vendor-grid {
    grid-template-columns: 1fr;
  }
  
  .po-table {
    font-size: 12px;
  }
  
  .bill-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 🔒 Security & Validation Rules

### Vendor Data Protection
```typescript
const vendorDataProtection = {
  encryption: {
    fields: ['bankAccount', 'routingNumber', 'taxId'],
    algorithm: 'AES-256'
  },
  accessControl: {
    view: ['admin', 'procurement', 'project-manager', 'finance'],
    edit: ['admin', 'procurement'],
    delete: ['admin']
  },
  auditLog: {
    events: ['VENDOR_CREATED', 'VENDOR_UPDATED', 'VENDOR_DELETED', 'VENDOR_RATING_UPDATED']
  }
};
```

### Financial Security
```typescript
const financialSecurity = {
  validation: {
    purchaseOrder: {
      maxAmount: 100000000, // Max 10 crore per PO
      maxItems: 50
    },
    vendorBill: {
      maxAmount: 50000000, // Max 5 crore per bill
      maxLineItems: 20
    },
    siteAdvance: {
      maxAmount: 10000000, // Max 1 crore per advance
      maxPercentage: 30 // Max 30% of work order
    }
  },
  approvalLimits: {
    level1: { maxAmount: 1000000, approvers: ['procurement-manager'] },
    level2: { maxAmount: 10000000, approvers: ['project-manager', 'finance-manager'] },
    level3: { maxAmount: 100000000, approvers: ['director', 'finance-director'] }
  }
};
```

---

## 📈 Performance Optimization

### Vendor Search Optimization
```typescript
const vendorSearchConfig = {
  debounceTime: 300,
  cacheResults: true,
  cacheTTL: 300000, // 5 minutes
  searchFields: ['vendorName', 'contactPerson', 'phone', 'email'],
  maxResults: 50,
  filters: ['vendorType', 'city', 'rating', 'status']
};
```

### PO Calculation Caching
```typescript
const poCalculationCache = {
  keyGenerator: (items: OrderItem[]) => 
    `po-calc-${items.map(i => i.id).sort().join('-')}`,
  ttl: 60000, // 1 minute
  storage: 'memory'
};
```

---

## 🎯 Success Metrics

### Procurement Metrics
```typescript
const procurementMetrics = {
  vendorRegistration: {
    targetTime: "4 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  },
  purchaseOrder: {
    targetTime: "8 minutes",
    targetErrorRate: "< 3%",
    targetSuccessRate: "> 95%"
  },
  vendorBill: {
    targetTime: "5 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  },
  siteAdvance: {
    targetTime: "6 minutes",
    targetErrorRate: "< 3%",
    targetSuccessRate: "> 95%"
  }
};
```

---

## 📋 Testing Checklist

### Vendor Form Testing
- [ ] Vendor type selection and service category loading
- [ ] Duplicate vendor detection
- [ ] Bank account validation
- [ ] Credit limit validation
- [ ] Payment terms enforcement
- [ ] Document upload functionality
- [ ] Rating system functionality

### Purchase Order Form Testing
- [ ] Project and vendor selection
- [ ] Vendor credit check
- [ ] Dynamic item addition/removal
- [ ] Line item calculation accuracy
- [ ] VAT and shipping calculation
- [ ] Grand total accuracy
- [ ] PO approval workflow

### Vendor Bill Form Testing
- [ ] PO linking and validation
- [ ] Bill number uniqueness
- [ ] Line item calculation
- [ ] Net amount calculation
- [ ] Document upload validation
- [ ] Payment processing workflow

### Site Advance Form Testing
- [ ] Contractor and work order selection
- [ ] Advance amount validation
- [ ] Fund breakdown calculation
- [ ] Recovery method selection
- [ ] Approval workflow
- [ ] Recovery tracking
