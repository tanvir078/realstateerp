# Clients & Sales Module - Comprehensive Planning Document

## 🏗️ Module Overview
**Module Name:** Clients & Sales  
**Parent Navigation:** Dashboard → Clients & Sales  
**Sub-menus:** Clients, Bookings, Installments, Collections, Handover  
**Primary Users:** Sales Team, Customer Service, Management, Finance Team  

---

## 📋 Module Structure & Navigation Flow

```
Dashboard
└── Clients & Sales
    ├── Clients (Main List View)
    │   ├── Add New Client (Modal Form)
    │   ├── View Client Details (Detail Page)
    │   ├── Edit Client (Modal Form)
    │   ├── Client Activity History (Timeline)
    │   └── Delete Client (Confirmation Dialog)
    │
    ├── Bookings
    │   ├── Booking List (Table View)
    │   ├── New Booking (Modal Form)
    │   ├── Booking Details (Detail Page)
    │   ├── Edit Booking (Modal Form)
    │   ├── Cancel Booking (Confirmation Dialog)
    │   ├── Generate Agreement (Modal Form)
    │   └── Booking Status Management
    │
    ├── Installments
    │   ├── Installment Schedule (Table View)
    │   ├── Record Payment (Modal Form)
    │   ├── Payment Details (Detail Page)
    │   ├── Send Reminder (Action)
    │   ├── Installment Report (Report View)
    │   └── Payment History (Timeline)
    │
    ├── Collections
    │   ├── Collection Overview (Dashboard)
    │   ├── Overdue Payments (Table View)
    │   ├── Process Collection (Modal Form)
    │   ├── Send Notice (Action)
    │   ├── Collection Report (Report View)
    │   └── Payment Reconciliation
    │
    └── Handover
        ├── Handover List (Table View)
        ├── Initiate Handover (Modal Form)
        ├── Handover Checklist (Modal Form)
        ├── Complete Handover (Modal Form)
        ├── Generate Documents (Action)
        └── Handover History (Timeline)
```

---

## 🎨 UI/UX Design Standards

### Color Palette Integration
```css
/* Client Status Colors */
.client-active { background: #10B981; }          /* Green */
.client-inactive { background: #6B7280; }        /* Gray */
.client-blacklisted { background: #EF4444; }     /* Red */
.client-pending { background: #F59E0B; }         /* Amber */

/* Booking Status Colors */
.booking-pending { background: #F59E0B; }        /* Amber */
.booking-confirmed { background: #10B981; }      /* Green */
.booking-cancelled { background: #EF4444; }     /* Red */
.booking-completed { background: #3B82F6; }     /* Blue */

/* Payment Status Colors */
.payment-paid { background: #10B981; }          /* Green */
.payment-partial { background: #F59E0B; }       /* Amber */
.payment-overdue { background: #EF4444; }      /* Red */
.payment-pending { background: #6B7280; }       /* Gray */

/* Handover Status Colors */
.handover-pending { background: #F59E0B; }       /* Amber */
.handover-in-progress { background: #3B82F6; }  /* Blue */
.handover-completed { background: #10B981; }    /* Green */
.handover-delayed { background: #EF4444; }      /* Red */
```

### Typography Hierarchy
```css
/* Client Cards */
.client-name { font-size: 18px; font-weight: 600; color: #1F2937; }
.client-type { font-size: 13px; color: #6B7280; }
.client-contact { font-size: 14px; color: #374151; }

/* Booking Cards */
.booking-id { font-size: 16px; font-weight: 600; color: #1F2937; }
.booking-details { font-size: 13px; color: #6B7280; }
.booking-amount { font-size: 16px; font-weight: 700; color: #10B981; }

/* Installment Cards */
.installment-due { font-size: 14px; font-weight: 500; color: #1F2937; }
.installment-amount { font-size: 16px; font-weight: 600; color: #10B981; }
.installment-status { font-size: 12px; font-weight: 500; }
```

### Layout Structure
```css
/* Client Grid Layout */
.client-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

/* Booking Timeline */
.booking-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* Installment Progress */
.installment-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Collection Dashboard */
.collection-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
```

---

## 📝 Form 1: Client Registration Form

### Form Architecture
```typescript
interface ClientFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  conditionalFields: true;
  duplicateCheck: true;
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
      name: "clientName",
      label: "Client Name",
      type: "text",
      placeholder: "Enter client name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
        pattern: "^[a-zA-Z\\s\\-\\.']+$"
      },
      ui: {
        icon: "user",
        size: "large",
        autoFocus: true,
        helper: "Full legal name as per ID document"
      },
      duplicateCheck: {
        endpoint: "/api/v1/clients/check-duplicate",
        field: "clientName",
        message: "Client with this name already exists"
      }
    },
    {
      name: "clientType",
      label: "Client Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "individual", label: "Individual", icon: "user" },
          { value: "corporate", label: "Corporate", icon: "building" }
        ]
      },
      validation: {
        required: true
      },
      ui: {
        icon: "type",
        helper: "Select client type for appropriate documentation",
        onChange: "toggleConditionalFields"
      }
    },
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
      },
      duplicateCheck: {
        endpoint: "/api/v1/clients/check-phone",
        field: "phone",
        message: "Phone number already registered"
      }
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "client@example.com",
      required: true,
      validation: {
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        customMessage: "Enter valid email address"
      },
      ui: {
        icon: "mail",
        helper: "Primary email for communications"
      },
      duplicateCheck: {
        endpoint: "/api/v1/clients/check-email",
        field: "email",
        message: "Email already registered"
      }
    }
  ]
}
```

#### Section 2: Address Information
```typescript
{
  section: "Address Information",
  layout: "two-column",
  fields: [
    {
      name: "address",
      label: "Permanent Address",
      type: "textarea",
      placeholder: "Enter full address...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        rows: 3,
        helper: "Complete residential or business address"
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
        pattern: "^\\d{4}$",
        customMessage: "Enter 4-digit postal code"
      },
      ui: {
        icon: "map-pin",
        helper: "Optional postal code"
      }
    }
  ]
}
```

#### Section 3: Individual Client Fields (Conditional)
```typescript
{
  section: "Individual Information",
  layout: "two-column",
  conditional: {
    showWhen: {
      field: "clientType",
      equals: "individual"
    }
  },
  fields: [
    {
      name: "nid",
      label: "National ID Number",
      type: "text",
      placeholder: "Enter 10 or 13-digit NID",
      required: true,
      validation: {
        pattern: "^\\d{10}$|^\\d{13}$",
        customMessage: "Enter valid 10 or 13-digit NID"
      },
      ui: {
        icon: "credit-card",
        helper: "National ID card number",
        mask: "XXXXXXXXXXX"
      },
      duplicateCheck: {
        endpoint: "/api/v1/clients/check-nid",
        field: "nid",
        message: "NID already registered"
      }
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
      validation: {
        maxDate: "today - 18 years",
        customMessage: "Client must be at least 18 years old"
      },
      ui: {
        icon: "calendar",
        helper: "Date of birth as per NID"
      }
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" }
        ]
      },
      ui: {
        icon: "users"
      }
    },
    {
      name: "occupation",
      label: "Occupation",
      type: "text",
      placeholder: "Enter occupation",
      required: false,
      validation: {
        maxLength: 50
      },
      ui: {
        icon: "briefcase",
        helper: "Current occupation or profession"
      }
    },
    {
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "divorced", label: "Divorced" },
          { value: "widowed", label: "Widowed" }
        ]
      },
      ui: {
        icon: "heart"
      }
    }
  ]
}
```

#### Section 4: Corporate Client Fields (Conditional)
```typescript
{
  section: "Corporate Information",
  layout: "two-column",
  conditional: {
    showWhen: {
      field: "clientType",
      equals: "corporate"
    }
  },
  fields: [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      placeholder: "Enter company name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100
      },
      ui: {
        icon: "building",
        helper: "Registered company name"
      },
      duplicateCheck: {
        endpoint: "/api/v1/clients/check-company",
        field: "companyName",
        message: "Company already registered"
      }
    },
    {
      name: "companyRegistration",
      label: "Company Registration Number",
      type: "text",
      placeholder: "Enter registration number",
      required: true,
      validation: {
        pattern: "^[A-Z0-9\\-]+$",
        customMessage: "Enter valid registration number"
      },
      ui: {
        icon: "file-text",
        helper: "RJSC or other registration number"
      },
      duplicateCheck: {
        endpoint: "/api/v1/clients/check-registration",
        field: "companyRegistration",
        message: "Registration number already exists"
      }
    },
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
      name: "businessType",
      label: "Business Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "proprietorship", label: "Sole Proprietorship" },
          { value: "partnership", label: "Partnership" },
          { value: "private_limited", label: "Private Limited" },
          { value: "public_limited", label: "Public Limited" },
          { value: "llc", label: "LLC" }
        ]
      },
      ui: {
        icon: "briefcase"
      }
    },
    {
      name: "incorporationDate",
      label: "Incorporation Date",
      type: "date",
      required: true,
      validation: {
        maxDate: "today"
      },
      ui: {
        icon: "calendar",
        helper: "Company incorporation date"
      }
    }
  ]
}
```

#### Section 5: Additional Information
```typescript
{
  section: "Additional Information",
  layout: "single-column",
  fields: [
    {
      name: "preferredContactMethod",
      label: "Preferred Contact Method",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "phone", label: "Phone Call" },
          { value: "email", label: "Email" },
          { value: "sms", label: "SMS" },
          { value: "whatsapp", label: "WhatsApp" }
        ]
      },
      ui: {
        icon: "message-circle",
        helper: "Preferred method for communication"
      }
    },
    {
      name: "emergencyContact",
      label: "Emergency Contact",
      type: "text",
      placeholder: "Emergency contact name and number",
      required: false,
      validation: {
        maxLength: 100
      },
      ui: {
        icon: "phone-call",
        helper: "Emergency contact person and number"
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
        helper: "Any additional information about the client"
      }
    },
    {
      name: "documents",
      label: "Client Documents",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 5,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: false,
        helper: "Upload ID documents, address proof, etc."
      }
    }
  ]
}
```

### Form Submission Flow

#### Step 1: Client-Side Validation
```typescript
const validateClientForm = (formData: ClientFormData) => {
  // Required field validation based on client type
  const requiredFields = ['clientName', 'clientType', 'phone', 'email', 'address'];
  
  if (formData.clientType === 'individual') {
    requiredFields.push('nid', 'dateOfBirth', 'gender');
  } else if (formData.clientType === 'corporate') {
    requiredFields.push('companyName', 'companyRegistration', 'businessType');
  }
  
  // Format validation
  const formatValidations = {
    phone: /^[0-9]{11}$/,
    email: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/,
    nid: /^\\d{10}$|^\\d{13}$/,
    companyRegistration: /^[A-Z0-9\\-]+$/
  };
  
  // Business logic validation
  const businessValidations = {
    dateOfBirth: (value: Date) => {
      const age = calculateAge(value);
      return age >= 18;
    },
    incorporationDate: (value: Date) => value <= new Date()
  };
  
  return { isValid: boolean, errors: ValidationError[] };
};
```

#### Step 2: Data Preparation
```typescript
const prepareClientData = (formData: ClientFormData) => {
  const baseData = {
    ...formData,
    phone: formatPhoneNumber(formData.phone),
    email: formData.email.toLowerCase(),
    address: formData.address.trim(),
    preferredContactMethod: formData.preferredContactMethod,
    status: 'active',
    createdBy: getCurrentUserId(),
    createdAt: new Date().toISOString()
  };
  
  if (formData.clientType === 'individual') {
    return {
      ...baseData,
      nid: formData.nid,
      dateOfBirth: formatDate(formData.dateOfBirth),
      gender: formData.gender,
      occupation: formData.occupation,
      maritalStatus: formData.maritalStatus
    };
  } else {
    return {
      ...baseData,
      companyName: formData.companyName,
      companyRegistration: formData.companyRegistration.toUpperCase(),
      taxId: formData.taxId,
      businessType: formData.businessType,
      incorporationDate: formatDate(formData.incorporationDate)
    };
  }
};
```

#### Step 3: API Submission
```typescript
const submitClientForm = async (preparedData: PreparedClientData) => {
  try {
    // Step 3.1: Upload documents first
    const documentUrls = await uploadFiles(preparedData.documents, 'clients/documents');
    
    // Step 3.2: Prepare final data
    const finalData = {
      ...preparedData,
      documents: documentUrls
    };
    
    // Step 3.3: Submit to API
    const response = await apiClient.post('/api/v1/clients', finalData);
    
    // Step 3.4: Handle response
    if (response.success) {
      return { success: true, clientId: response.data.id };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### API Integration Specifications

#### Create Client API
```typescript
// Endpoint: POST /api/v1/clients
interface CreateClientAPI {
  method: 'POST';
  endpoint: '/api/v1/clients';
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
  };
  requestBody: {
    clientName: string;
    clientType: 'individual' | 'corporate';
    phone: string;
    email: string;
    address: string;
    city: string;
    area: string;
    postalCode?: string;
    preferredContactMethod: string;
    emergencyContact?: string;
    notes?: string;
    // Individual fields
    nid?: string;
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    maritalStatus?: string;
    // Corporate fields
    companyName?: string;
    companyRegistration?: string;
    taxId?: string;
    businessType?: string;
    incorporationDate?: string;
    documents?: string[];
  };
  response: {
    success: boolean;
    data?: {
      id: string;
      clientCode: string;
      status: string;
      createdAt: string;
    };
    message?: string;
    errors?: ValidationError[];
  };
}
```

---

## 📝 Form 2: Unit Booking Form

### Form Architecture
```typescript
interface BookingFormArchitecture {
  formType: "modal";
  layout: "mixed";
  validation: "real-time";
  submission: "async";
  dependentFields: true;
  autoCalculation: true;
  documentGeneration: true;
}
```

### Form Structure Design

#### Section 1: Project & Unit Selection
```typescript
{
  section: "Project & Unit Selection",
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
        helper: "Select project for booking",
        onChange: "loadAvailableUnits"
      }
    },
    {
      name: "unit",
      label: "Select Unit",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/units/available",
        queryParams: {
          project: "{project}",
          status: "available"
        },
        dependsOn: "project",
        displayField: "unitNumber",
        valueField: "id",
        additionalFields: ["size", "totalPrice", "floorNumber", "unitType"]
      },
      ui: {
        icon: "home",
        searchable: true,
        helper: "Select available unit",
        onChange: "loadUnitDetails"
      }
    },
    {
      name: "client",
      label: "Select Client",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/clients/active",
        displayField: "clientName",
        valueField: "id",
        additionalFields: ["clientType", "phone", "email"]
      },
      ui: {
        icon: "user",
        searchable: true,
        helper: "Select client for booking"
      }
    }
  ]
}
```

#### Section 2: Unit Details Display (Read-only)
```typescript
{
  section: "Unit Details",
  layout: "informational",
  fields: [
    {
      name: "unitDetails",
      type: "information-display",
      displayFormat: "card",
      fields: [
        {
          label: "Unit Number",
          value: "unit.unitNumber",
          icon: "hash"
        },
        {
          label: "Unit Type",
          value: "unit.unitType",
          icon: "type"
        },
        {
          label: "Floor",
          value: "unit.floorNumber",
          icon: "layers"
        },
        {
          label: "Size",
          value: "unit.size + ' sq ft'",
          icon: "maximize"
        },
        {
          label: "Total Price",
          value: "formatCurrency(unit.totalPrice)",
          icon: "dollar-sign",
          highlight: true
        },
        {
          label: "Price per Sq Ft",
          value: "formatCurrency(unit.pricePerSqFt)",
          icon: "tag"
        }
      ]
    }
  ]
}
```

#### Section 3: Booking Information
```typescript
{
  section: "Booking Information",
  layout: "two-column",
  fields: [
    {
      name: "bookingDate",
      label: "Booking Date",
      type: "date",
      required: true,
      defaultValue: "today",
      validation: {
        maxDate: "today"
      },
      ui: {
        icon: "calendar",
        helper: "Date of booking"
      }
    },
    {
      name: "bookingAmount",
      label: "Booking Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: "unit.totalPrice * 0.5"
      },
      ui: {
        icon: "credit-card",
        prefix: "৳",
        helper: "Initial booking amount (10% of total)",
        defaultValue: "unit.totalPrice * 0.10"
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
          { value: "cash", label: "Cash", icon: "dollar-sign" },
          { value: "bank", label: "Bank Transfer", icon: "bank" },
          { value: "check", label: "Check", icon: "file-text" },
          { value: "mobile", label: "Mobile Banking", icon: "smartphone" }
        ]
      },
      ui: {
        icon: "credit-card",
        helper: "Method of initial payment"
      }
    },
    {
      name: "paymentReference",
      label: "Payment Reference",
      type: "text",
      placeholder: "Enter transaction reference",
      required: true,
      validation: {
        minLength: 5,
        maxLength: 50
      },
      conditional: {
        showWhen: {
          field: "paymentMethod",
          notEquals: "cash"
        }
      },
      ui: {
        icon: "hash",
        helper: "Transaction ID, check number, or reference"
      }
    }
  ]
}
```

#### Section 4: Installment Plan Configuration
```typescript
{
  section: "Installment Plan",
  layout: "two-column",
  fields: [
    {
      name: "installmentPlan",
      label: "Installment Plan",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "monthly", label: "Monthly (12-36 months)" },
          { value: "quarterly", label: "Quarterly (4-12 quarters)" },
          { value: "half-yearly", label: "Half-Yearly (2-6 periods)" },
          { value: "lumpsum", label: "Lump Sum (1-3 payments)" }
        ]
      },
      ui: {
        icon: "calendar",
        helper: "Select payment schedule",
        onChange: "calculateInstallments"
      }
    },
    {
      name: "installmentCount",
      label: "Number of Installments",
      type: "number",
      placeholder: "12",
      required: true,
      validation: {
        min: 1,
        max: 36
      },
      ui: {
        icon: "hash",
        helper: "Total number of installment payments",
        defaultValue: "12"
      }
    },
    {
      name: "firstInstallmentDate",
      label: "First Installment Due Date",
      type: "date",
      required: true,
      validation: {
        minDate: "bookingDate + 30 days"
      },
      ui: {
        icon: "calendar",
        helper: "Due date for first installment",
        defaultValue: "bookingDate + 30 days"
      }
    },
    {
      name: "generateSchedule",
      type: "action-button",
      label: "Generate Installment Schedule",
      action: "calculateInstallments",
      ui: {
        icon: "calculator",
        variant: "outline"
      }
    }
  ]
}
```

#### Section 5: Installment Schedule Preview
```typescript
{
  section: "Installment Schedule Preview",
  layout: "table",
  conditional: {
    showWhen: {
      field: "installmentSchedule",
      hasValue: true
    }
  },
  fields: [
    {
      name: "installmentSchedule",
      type: "dynamic-table",
      columns: [
        {
          header: "Installment #",
          field: "installmentNumber",
          width: "80px"
        },
        {
          header: "Due Date",
          field: "dueDate",
          width: "120px",
          format: "date"
        },
        {
          header: "Amount",
          field: "amount",
          width: "120px",
          format: "currency"
        },
        {
          header: "Status",
          field: "status",
          width: "100px",
          format: "badge"
        }
      ],
      ui: {
        editable: false,
        downloadable: true,
        helper: "Review generated installment schedule"
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
      name: "specialTerms",
      label: "Special Terms & Conditions",
      type: "textarea",
      placeholder: "Enter any special terms...",
      required: false,
      validation: {
        maxLength: 1000
      },
      ui: {
        icon: "file-text",
        rows: 4,
        helper: "Any special terms for this booking"
      }
    },
    {
      name: "salesPerson",
      label: "Sales Person",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/users/sales-team",
        displayField: "name",
        valueField: "id"
      },
      ui: {
        icon: "user",
        helper: "Sales person handling this booking",
        defaultValue: "currentUser"
      }
    },
    {
      name: "bookingDocuments",
      label: "Booking Documents",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 5,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: false,
        helper: "Upload booking documents, payment receipts, etc."
      }
    }
  ]
}
```

### Form Submission Flow

#### Installment Calculation Logic
```typescript
const calculateInstallments = (bookingData: BookingFormData) => {
  const { totalPrice, bookingAmount, installmentPlan, installmentCount, firstInstallmentDate } = bookingData;
  
  const remainingAmount = totalPrice - bookingAmount;
  const installmentAmount = remainingAmount / installmentCount;
  
  const schedule = [];
  const startDate = new Date(firstInstallmentDate);
  
  for (let i = 1; i <= installmentCount; i++) {
    const dueDate = calculateDueDate(startDate, i, installmentPlan);
    schedule.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString(),
      amount: installmentAmount.toFixed(2),
      status: 'pending'
    });
  }
  
  return schedule;
};

const calculateDueDate = (startDate: Date, installmentNumber: number, plan: string): Date => {
  const dueDate = new Date(startDate);
  
  switch (plan) {
    case 'monthly':
      dueDate.setMonth(dueDate.getMonth() + (installmentNumber - 1));
      break;
    case 'quarterly':
      dueDate.setMonth(dueDate.getMonth() + ((installmentNumber - 1) * 3));
      break;
    case 'half-yearly':
      dueDate.setMonth(dueDate.getMonth() + ((installmentNumber - 1) * 6));
      break;
    case 'lumpsum':
      dueDate.setMonth(dueDate.getMonth() + ((installmentNumber - 1) * 12));
      break;
  }
  
  return dueDate;
};
```

#### Unit Availability Check
```typescript
const checkUnitAvailability = async (unitId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/api/v1/units/${unitId}/availability`);
    return response.data.available;
  } catch (error) {
    return false;
  }
};
```

---

## 📝 Form 3: Payment Recording Form

### Form Architecture
```typescript
interface PaymentFormArchitecture {
  formType: "modal";
  layout: "single-column";
  validation: "real-time";
  submission: "async";
  receiptGeneration: true;
  notification: true;
}
```

### Form Structure Design

#### Section 1: Payment Details
```typescript
{
  section: "Payment Details",
  layout: "two-column",
  fields: [
    {
      name: "installment",
      label: "Select Installment",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/installments/pending",
        queryParams: {
          booking: "{bookingId}"
        },
        dependsOn: "bookingId",
        displayField: "installmentNumber",
        valueField: "id",
        additionalFields: ["dueDate", "amount", "status"]
      },
      ui: {
        icon: "calendar",
        searchable: true,
        helper: "Select installment to pay"
      }
    },
    {
      name: "paymentDate",
      label: "Payment Date",
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
      name: "paymentAmount",
      label: "Payment Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: "installment.amount"
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Amount being paid",
        defaultValue: "installment.amount"
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
    }
  ]
}
```

#### Section 2: Payment Reference
```typescript
{
  section: "Payment Reference",
  layout: "single-column",
  fields: [
    {
      name: "transactionReference",
      label: "Transaction Reference",
      type: "text",
      placeholder: "Enter transaction ID",
      required: true,
      validation: {
        minLength: 5,
        maxLength: 50
      },
      conditional: {
        showWhen: {
          field: "paymentMethod",
          notEquals: "cash"
        }
      },
      ui: {
        icon: "hash",
        helper: "Bank transaction ID, check number, or mobile reference"
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
      conditional: {
        showWhen: {
          field: "paymentMethod",
          equals: ["bank", "check"]
        }
      },
      ui: {
        icon: "bank"
      }
    },
    {
      name: "branch",
      label: "Branch",
      type: "text",
      placeholder: "Enter branch name",
      required: false,
      conditional: {
        showWhen: {
          field: "paymentMethod",
          equals: ["bank", "check"]
        }
      },
      ui: {
        icon: "map-pin"
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

#### Section 3: Notes & Documents
```typescript
{
  section: "Additional Information",
  layout: "single-column",
  fields: [
    {
      name: "notes",
      label: "Payment Notes",
      type: "textarea",
      placeholder: "Enter payment notes...",
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
      name: "receipt",
      label: "Payment Receipt",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 3,
        maxSize: "3MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: true,
        helper: "Upload payment receipt or proof"
      }
    }
  ]
}
```

---

## 🎯 Button Functionality Mapping

### Clients Page Buttons
```typescript
const clientPageButtons = {
  "Add Client": {
    action: "openModal",
    modal: "ClientForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Import Clients": {
    action: "openModal",
    modal: "BulkClientImport",
    icon: "upload",
    variant: "outline",
    size: "medium"
  },
  "Export": {
    action: "exportData",
    format: ["excel", "pdf"],
    icon: "download",
    variant: "outline",
    size: "medium"
  },
  "View Details": {
    action: "navigate",
    route: "/clients/:id",
    icon: "eye",
    variant: "ghost",
    size: "small"
  },
  "Edit": {
    action: "openModal",
    modal: "ClientForm",
    mode: "edit",
    icon: "edit",
    variant: "ghost",
    size: "small"
  },
  "Activity History": {
    action: "openModal",
    modal: "ClientActivityTimeline",
    icon: "clock",
    variant: "ghost",
    size: "small"
  },
  "Delete": {
    action: "confirmDelete",
    confirmation: "Are you sure you want to delete this client?",
    icon: "trash",
    variant: "ghost",
    size: "small",
    color: "danger"
  }
};
```

### Bookings Page Buttons
```typescript
const bookingPageButtons = {
  "New Booking": {
    action: "openModal",
    modal: "BookingForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Generate Agreement": {
    action: "generateDocument",
    documentType: "booking-agreement",
    icon: "file-text",
    variant: "outline",
    size: "small",
    condition: "booking.status === 'confirmed'"
  },
  "View Installments": {
    action: "navigate",
    route: "/bookings/:id/installments",
    icon: "calendar",
    variant: "ghost",
    size: "small"
  },
  "Send Reminder": {
    action: "sendNotification",
    notificationType: "payment-reminder",
    icon: "bell",
    variant: "ghost",
    size: "small",
    condition: "booking.status === 'confirmed'"
  },
  "Cancel Booking": {
    action: "confirmAction",
    confirmation: "Are you sure you want to cancel this booking?",
    icon: "x-circle",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "booking.status !== 'completed'"
  }
};
```

### Installments Page Buttons
```typescript
const installmentPageButtons = {
  "Record Payment": {
    action: "openModal",
    modal: "PaymentForm",
    icon: "credit-card",
    variant: "primary",
    size: "medium"
  },
  "Send Reminder": {
    action: "sendNotification",
    notificationType: "installment-reminder",
    icon: "bell",
    variant: "outline",
    size: "small",
    condition: "installment.status === 'pending' || installment.status === 'overdue'"
  },
  "View Receipt": {
    action: "openModal",
    modal: "ReceiptViewer",
    icon: "file-text",
    variant: "ghost",
    size: "small",
    condition: "installment.status === 'paid'"
  },
  "Download Schedule": {
    action: "downloadDocument",
    documentType: "installment-schedule",
    icon: "download",
    variant: "ghost",
    size: "small"
  }
};
```

### Collections Page Buttons
```typescript
const collectionPageButtons = {
  "Process Collection": {
    action: "openModal",
    modal: "CollectionForm",
    icon: "dollar-sign",
    variant: "primary",
    size: "medium"
  },
  "Send Notice": {
    action: "sendNotification",
    notificationType: "overdue-notice",
    icon: "mail",
    variant: "outline",
    size: "small",
    condition: "payment.status === 'overdue'"
  },
  "Generate Report": {
    action: "generateReport",
    reportType: "collection-report",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  },
  "Reconcile": {
    action: "openModal",
    modal: "PaymentReconciliation",
    icon: "refresh-cw",
    variant: "ghost",
    size: "small"
  }
};
```

### Handover Page Buttons
```typescript
const handoverPageButtons = {
  "Initiate Handover": {
    action: "openModal",
    modal: "HandoverInitiationForm",
    icon: "home",
    variant: "primary",
    size: "medium",
    condition: "booking.status === 'completed' && handover.status === 'pending'"
  },
  "Complete Handover": {
    action: "openModal",
    modal: "HandoverCompletionForm",
    icon: "check-circle",
    variant: "primary",
    size: "medium",
    condition: "handover.status === 'in-progress'"
  },
  "View Checklist": {
    action: "openModal",
    modal: "HandoverChecklist",
    icon: "list-checks",
    variant: "ghost",
    size: "small"
  },
  "Generate Documents": {
    action: "generateDocuments",
    documentTypes: ["handover-certificate", "possession-letter"],
    icon: "file-text",
    variant: "outline",
    size: "small",
    condition: "handover.status === 'completed'"
  }
};
```

---

## 📊 Data Flow Architecture

### Client Registration Data Flow
```
User Input → Client Type Selection → Conditional Field Display → Validation → Duplicate Check → Data Preparation → Document Upload → API Submission → Response Handling → Client Creation → Notification
```

### Booking Creation Data Flow
```
Project Selection → Unit Loading → Unit Availability Check → Client Selection → Unit Details Display → Booking Information → Installment Plan Selection → Schedule Calculation → Agreement Generation → API Submission → Booking Creation → Unit Status Update → Installment Schedule Creation → Notification
```

### Payment Recording Data Flow
```
Booking Selection → Installment Loading → Payment Details → Payment Reference → Receipt Upload → Validation → API Submission → Payment Recording → Installment Status Update → Receipt Generation → Notification → Dashboard Update
```

### Handover Process Data Flow
```
Booking Selection → Handover Eligibility Check → Handover Initiation → Checklist Creation → Document Generation → Handover Completion → Unit Status Update → Client Notification → Property Transfer
```

---

## 🔗 Module Relationships

### Clients ↔ Bookings Relationship
```typescript
interface ClientBookingRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "clientId";
  constraints: {
    status: "client must be 'active' for booking",
    limit: "maximum 10 active bookings per client"
  };
}
```

### Bookings ↔ Units Relationship
```typescript
interface BookingUnitRelationship {
  type: "one-to-one";
  cascade: "restrict";
  foreignKey: "unitId";
  constraints: {
    status: "unit must be 'available' for booking",
    exclusive: "one booking per unit"
  };
}
```

### Bookings ↔ Installments Relationship
```typescript
interface BookingInstallmentRelationship {
  type: "one-to-many";
  cascade: "delete";
  foreignKey: "bookingId";
  constraints: {
    chronological: "installment dates must be sequential",
    total: "installment amounts must sum to remaining balance"
  };
}
```

### Installments ↔ Collections Relationship
```typescript
interface InstallmentCollectionRelationship {
  type: "one-to-many";
  cascade: "none";
  foreignKey: "installmentId";
  constraints: {
    amount: "collection amount cannot exceed installment amount",
    status: "only pending installments can have collections"
  };
}
```

---

## 🎨 UI Component Specifications

### Client Card Component
```typescript
interface ClientCardProps {
  client: Client;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onActivity: (id: string) => void;
}

const ClientCard = ({ client, onView, onEdit, onDelete, onActivity }: ClientCardProps) => {
  return (
    <Card className="client-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="client-name">{client.clientName}</h3>
              <Badge variant={getStatusVariant(client.status)}>
                {client.status}
              </Badge>
            </div>
            <p className="client-type">{client.clientType}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onView(client.id)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(client.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActivity(client.id)}>
                <Clock className="mr-2 h-4 w-4" /> Activity History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(client.id)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <InfoRow icon="phone" label={formatPhone(client.phone)} />
          <InfoRow icon="mail" label={client.email} />
          <InfoRow icon="map-pin" label={client.address} />
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline">{client.bookings} Bookings</Badge>
            <Badge variant="outline">{client.totalSpent} Total Spent</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Booking Timeline Component
```typescript
interface BookingTimelineProps {
  booking: Booking;
  onViewInstallments: () => void;
  onGenerateAgreement: () => void;
}

const BookingTimeline = ({ booking, onViewInstallments, onGenerateAgreement }: BookingTimelineProps) => {
  const timelineEvents = [
    {
      date: booking.bookingDate,
      title: "Booking Created",
      icon: "calendar-plus",
      status: "completed"
    },
    {
      date: booking.confirmationDate,
      title: "Booking Confirmed",
      icon: "check-circle",
      status: booking.status === 'confirmed' ? 'completed' : 'pending'
    },
    {
      date: booking.firstInstallmentDate,
      title: "First Installment Due",
      icon: "calendar",
      status: booking.firstInstallmentPaid ? 'completed' : 'pending'
    },
    {
      date: booking.estimatedHandover,
      title: "Estimated Handover",
      icon: "home",
      status: booking.handoverCompleted ? 'completed' : 'pending'
    }
  ];

  return (
    <div className="booking-timeline">
      {timelineEvents.map((event, index) => (
        <TimelineItem key={index} event={event} />
      ))}
      <div className="flex gap-2 mt-4">
        <Button onClick={onViewInstallments} variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" /> View Installments
        </Button>
        {booking.status === 'confirmed' && (
          <Button onClick={onGenerateAgreement} variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Generate Agreement
          </Button>
        )}
      </div>
    </div>
  );
};
```

### Installment Progress Component
```typescript
interface InstallmentProgressProps {
  installments: Installment[];
  onRecordPayment: (id: string) => void;
}

const InstallmentProgress = ({ installments, onRecordPayment }: InstallmentProgressProps) => {
  const paidInstallments = installments.filter(i => i.status === 'paid').length;
  const totalInstallments = installments.length;
  const progressPercentage = (paidInstallments / totalInstallments) * 100;

  return (
    <div className="installment-progress">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Payment Progress</span>
        <span className="text-sm text-gray-600">{paidInstallments}/{totalInstallments} Paid</span>
      </div>
      <ProgressBar value={progressPercentage} />
      <div className="mt-4 space-y-2">
        {installments.slice(0, 3).map(installment => (
          <InstallmentCard 
            key={installment.id} 
            installment={installment}
            onRecordPayment={onRecordPayment}
          />
        ))}
        {installments.length > 3 && (
          <Button variant="ghost" size="sm" className="w-full">
            View All {installments.length} Installments
          </Button>
        )}
      </div>
    </div>
  );
};
```

---

## 📱 Responsive Design Breakpoints

```css
/* Client Grid Responsive */
@media (min-width: 1024px) {
  .client-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .client-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .client-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-timeline {
    padding: 12px;
  }
  
  .installment-progress {
    padding: 12px;
  }
}
```

---

## 🔒 Security & Validation Rules

### Client Data Protection
```typescript
const clientDataProtection = {
  encryption: {
    fields: ['nid', 'phone', 'email'],
    algorithm: 'AES-256'
  },
  accessControl: {
    view: ['admin', 'sales', 'customer-service'],
    edit: ['admin', 'sales'],
    delete: ['admin']
  },
  auditLog: {
    events: ['CLIENT_CREATED', 'CLIENT_UPDATED', 'CLIENT_DELETED', 'CLIENT_VIEWED']
  }
};
```

### Payment Security
```typescript
const paymentSecurity = {
  validation: {
    amount: {
      max: 10000000, // Max 1 crore per transaction
      min: 1000      // Min 1000 per transaction
    },
    reference: {
      pattern: /^[A-Z0-9\-]{5,50}$/,
      uniqueness: true
    }
  },
  fraudDetection: {
    checks: ['duplicate-payment', 'unusual-amount', 'rapid-payments'],
    threshold: 3
  }
};
```

---

## 📈 Performance Optimization

### Client Search Optimization
```typescript
const clientSearchConfig = {
  debounceTime: 300,
  cacheResults: true,
  cacheTTL: 300000, // 5 minutes
  searchFields: ['clientName', 'phone', 'email', 'companyName'],
  maxResults: 50
};
```

### Installment Calculation Caching
```typescript
const installmentCacheConfig = {
  keyGenerator: (bookingId: string, plan: string, count: number) => 
    `installment-schedule-${bookingId}-${plan}-${count}`,
  ttl: 86400000, // 24 hours
  storage: 'localStorage'
};
```

---

## 🎯 Success Metrics

### Client Registration Metrics
```typescript
const clientMetrics = {
  registration: {
    targetTime: "3 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  },
  booking: {
    targetTime: "5 minutes",
    targetErrorRate: "< 3%",
    targetSuccessRate: "> 95%"
  },
  payment: {
    targetTime: "2 minutes",
    targetErrorRate: "< 1%",
    targetSuccessRate: "> 99%"
  }
};
```

---

## 📋 Testing Checklist

### Client Form Testing
- [ ] Individual vs Corporate field switching
- [ ] NID/Registration validation
- [ ] Duplicate client detection
- [ ] Phone/email format validation
- [ ] Document upload functionality
- [ ] Address validation

### Booking Form Testing
- [ ] Project selection and unit loading
- [ ] Unit availability check
- [ ] Price calculation accuracy
- [ ] Installment schedule generation
- [ ] Agreement document generation
- [ ] Unit status update after booking

### Payment Form Testing
- [ ] Installment selection and loading
- [ ] Payment method conditional fields
- [ ] Amount validation (max/min)
- [ ] Reference number validation
- [ ] Receipt upload and preview
- [ ] Payment status update
- [ ] Notification sending
