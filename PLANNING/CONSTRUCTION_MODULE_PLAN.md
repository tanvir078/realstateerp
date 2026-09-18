# Construction & Engineering Module - Comprehensive Planning Document

## 🏗️ Module Overview
**Module Name:** Construction & Engineering  
**Parent Navigation:** Dashboard → Construction & Engineering  
**Sub-menus:** Site Requisitions (MRN), Contractors & Work Orders, RA Bills & Approvals, Physical Progress & Milestones, Site Equipment & Fuel Logs  
**Primary Users:** Construction Managers, Site Engineers, Project Managers, Contractors, Procurement Team  

---

## 📋 Module Structure & Navigation Flow

```
Dashboard
└── Construction & Engineering
    ├── Site Requisitions (MRN)
    │   ├── MRN List (Table View)
    │   ├── New MRN (Modal Form)
    │   ├── MRN Details (Detail Page)
    │   ├── Approve MRN (Action)
    │   ├── Reject MRN (Action)
    │   ├── Convert to PO (Action)
    │   └── MRN Status Tracking
    │
    ├── Contractors & Work Orders
    │   ├── Contractor List (Table View)
    │   ├── Add Contractor (Modal Form)
    │   ├── Contractor Details (Detail Page)
    │   ├── Work Order List (Table View)
    │   ├── New Work Order (Modal Form)
    │   ├── Work Order Details (Detail Page)
    │   ├── Approve Work Order (Action)
    │   └── Contractor Performance Tracking
    │
    ├── RA Bills & Approvals
    │   ├── RA Bill List (Table View)
    │   ├── New RA Bill (Modal Form)
    │   ├── RA Bill Details (Detail Page)
    │   ├── Approve RA Bill (Action)
    │   ├── Reject RA Bill (Action)
    │   ├── Process Payment (Modal Form)
    │   └── RA Bill Status Tracking
    │
    ├── Physical Progress & Milestones
    │   ├── Progress Dashboard (Dashboard)
    │   ├── Add Milestone (Modal Form)
    │   ├── Update Progress (Modal Form)
    │   ├── Photo Upload (Modal Form)
    │   ├── Progress Reports (Report View)
    │   └── Milestone Tracking
    │
    └── Site Equipment & Fuel Logs
        ├── Equipment List (Table View)
        ├── Add Equipment (Modal Form)
        ├── Equipment Details (Detail Page)
        ├── Fuel Log Entry (Modal Form)
        ├── Maintenance Log (Modal Form)
        ├── Equipment Status Tracking
        └── Fuel Consumption Reports
```

---

## 🎨 UI/UX Design Standards

### Color Palette Integration
```css
/* MRN Status Colors */
.mrn-pending { background: #F59E0B; }           /* Amber */
.mrn-approved { background: #10B981; }        /* Green */
.mrn-processing { background: #3B82F6; }      /* Blue */
.mrn-rejected { background: #EF4444; }        /* Red */
.mrn-completed { background: #8B5CF6; }       /* Purple */

/* Contractor Status Colors */
.contractor-active { background: #10B981; }     /* Green */
.contractor-completed { background: #3B82F6; }  /* Blue */
.contractor-terminated { background: #EF4444; } /* Red */
.contractor-pending { background: #F59E0B; }    /* Amber */

/* Work Order Status Colors */
.wo-pending { background: #F59E0B; }          /* Amber */
.wo-approved { background: #10B981; }         /* Green */
.wo-in-progress { background: #3B82F6; }     /* Blue */
.wo-completed { background: #8B5CF6; }       /* Purple */
.wo-cancelled { background: #EF4444; }       /* Red */

/* RA Bill Status Colors */
.ra-pending { background: #F59E0B; }          /* Amber */
.ra-processing { background: #3B82F6; }      /* Blue */
.ra-approved { background: #10B981; }        /* Green */
.ra-rejected { background: #EF4444; }        /* Red */
.ra-paid { background: #8B5CF6; }            /* Purple */

/* Progress Status Colors */
.progress-not-started { background: #6B7280; } /* Gray */
.progress-in-progress { background: #3B82F6; } /* Blue */
.progress-delayed { background: #EF4444; }    /* Red */
.progress-on-track { background: #10B981; }   /* Green */
.progress-completed { background: #8B5CF6; }  /* Purple */

/* Equipment Status Colors */
.equipment-available { background: #10B981; }   /* Green */
.equipment-in-use { background: #3B82F6; }    /* Blue */
.equipment-maintenance { background: #F59E0B; } /* Amber */
.equipment-out-of-service { background: #EF4444; } /* Red */
```

### Typography Hierarchy
```css
/* MRN Cards */
.mrn-id { font-size: 16px; font-weight: 600; color: #1F2937; }
.mrn-material { font-size: 14px; color: #374151; }
.mrn-quantity { font-size: 14px; font-weight: 500; color: #10B981; }

/* Contractor Cards */
.contractor-name { font-size: 18px; font-weight: 600; color: #1F2937; }
.contractor-type { font-size: 13px; color: #6B7280; }
.contractor-value { font-size: 16px; font-weight: 600; color: #10B981; }

/* RA Bill Cards */
.ra-id { font-size: 16px; font-weight: 600; color: #1F2937; }
.ra-amount { font-size: 16px; font-weight: 700; color: #10B981; }
.ra-description { font-size: 13px; color: #6B7280; }

/* Progress Cards */
.progress-percentage { font-size: 24px; font-weight: 700; color: #10B981; }
.progress-milestone { font-size: 14px; font-weight: 500; color: #374151; }
.progress-date { font-size: 12px; color: #6B7280; }
```

### Layout Structure
```css
/* MRN Grid Layout */
.mrn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

/* Contractor Dashboard */
.contractor-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* Work Order Timeline */
.work-order-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* Progress Visualization */
.progress-visualization {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* Equipment Grid */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
```

---

## 📝 Form 1: Material Requisition Note (MRN) Form

### Form Architecture
```typescript
interface MRNFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  approvalWorkflow: true;
  poConversion: true;
  prioritySystem: true;
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
        additionalFields: ["location", "projectType", "status"]
      },
      ui: {
        icon: "building",
        searchable: true,
        helper: "Select project for material requisition"
      }
    },
    {
      name: "mrnType",
      label: "MRN Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "material", label: "Material Requisition", icon: "package" },
          { value: "equipment", label: "Equipment Requisition", icon: "truck" },
          { value: "labor", label: "Labor Requisition", icon: "users" },
          { value: "service", label: "Service Requisition", icon: "briefcase" }
        ]
      },
      ui: {
        icon: "type",
        helper: "Type of requisition"
      }
    },
    {
      name: "requestedBy",
      label: "Requested By",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/users/site-engineers",
        queryParams: {
          project: "{project}"
        },
        dependsOn: "project",
        displayField: "name",
        valueField: "id"
      },
      ui: {
        icon: "user",
        helper: "Site engineer requesting materials"
      }
    },
    {
      name: "requestDate",
      label: "Request Date",
      type: "date",
      required: true,
      defaultValue: "today",
      validation: {
        maxDate: "today"
      },
      ui: {
        icon: "calendar"
      }
    }
  ]
}
```

#### Section 2: Material Details (Dynamic)
```typescript
{
  section: "Material Details",
  layout: "dynamic-table",
  fields: [
    {
      name: "materials",
      type: "dynamic-array",
      required: true,
      minItems: 1,
      maxItems: 50,
      fields: [
        {
          name: "material",
          label: "Material",
          type: "select",
          required: true,
          options: {
            source: "api",
            endpoint: "/api/materials",
            displayField: "name",
            valueField: "id",
            additionalFields: ["currentStock", "unit", "lastPrice"]
          },
          ui: {
            searchable: true,
            width: "180px"
          }
        },
        {
          name: "specification",
          label: "Specification",
          type: "text",
          required: false,
          validation: {
            maxLength: 100
          },
          ui: {
            placeholder: "Size, grade, etc.",
            width: "120px"
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
            width: "80px"
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
              { value: "cum", label: "Cubic Meters" },
              { value: "bag", label: "Bags" },
              { value: "roll", label: "Rolls" }
            ]
          },
          ui: {
            width: "80px"
          }
        },
        {
          name: "requiredDate",
          label: "Required By",
          type: "date",
          required: true,
          validation: {
            minDate: "requestDate + 3 days"
          },
          ui: {
            width: "120px"
          }
        },
        {
          name: "estimatedCost",
          label: "Est. Cost",
          type: "currency",
          required: true,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            placeholder: "0.00",
            width: "120px",
            helper: "Estimated cost based on last price"
          }
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          required: true,
          options: {
            source: "static",
            data: [
              { value: "low", label: "Low", color: "#6B7280" },
              { value: "medium", label: "Medium", color: "#3B82F6" },
              { value: "high", label: "High", color: "#F59E0B" },
              { value: "urgent", label: "Urgent", color: "#EF4444" }
            ]
          },
          ui: {
            width: "100px",
            defaultValue: "medium"
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
        addButtonText: "Add Material",
        tableLayout: true,
        showTotals: true
      }
    }
  ]
}
```

#### Section 3: Delivery Information
```typescript
{
  section: "Delivery Information",
  layout: "two-column",
  fields: [
    {
      name: "deliveryLocation",
      label: "Delivery Location",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/{project}/delivery-locations",
        dependsOn: "project"
      },
      ui: {
        icon: "map-pin",
        helper: "Site location for material delivery"
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
    },
    {
      name: "contactPerson",
      label: "Site Contact Person",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/users/site-supervisors",
        queryParams: {
          project: "{project}"
        },
        dependsOn: "project"
      },
      ui: {
        icon: "user",
        helper: "Person to contact at site"
      }
    },
    {
      name: "contactPhone",
      label: "Contact Phone",
      type: "tel",
      placeholder: "0171-234567",
      required: true,
      validation: {
        pattern: "^[0-9]{11}$"
      },
      ui: {
        icon: "phone",
        helper: "Contact person's phone number"
      }
    }
  ]
}
```

#### Section 4: Additional Information
```typescript
{
  section: "Additional Information",
  layout: "single-column",
  fields: [
    {
      name: "purpose",
      label: "Purpose of Requisition",
      type: "textarea",
      placeholder: "Enter purpose of material requisition...",
      required: true,
      validation: {
        minLength: 20,
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Detailed purpose for this material requisition"
      }
    },
    {
      name: "technicalSpecifications",
      label: "Technical Specifications",
      type: "textarea",
      placeholder: "Enter technical specifications...",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "settings",
        rows: 2,
        helper: "Technical requirements, standards, etc."
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
        allowedTypes: ["application/pdf", "image/jpeg", "image/png", "application/vnd.ms-excel"]
      },
      ui: {
        icon: "paperclip",
        multiple: true,
        preview: false,
        helper: "Upload drawings, specifications, quotations, etc."
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
        helper: "Budget code for cost allocation"
      }
    }
  ]
}
```

### Form Submission Flow

#### Material Cost Calculation
```typescript
const calculateMaterialCost = (materials: Material[]): MaterialCostSummary => {
  const totalQuantity = materials.reduce((sum, mat) => sum + mat.quantity, 0);
  const totalEstimatedCost = materials.reduce((sum, mat) => sum + mat.estimatedCost, 0);
  const priorityCount = {
    urgent: materials.filter(m => m.priority === 'urgent').length,
    high: materials.filter(m => m.priority === 'high').length,
    medium: materials.filter(m => m.priority === 'medium').length,
    low: materials.filter(m => m.priority === 'low').length
  };
  
  return {
    totalQuantity,
    totalEstimatedCost,
    priorityCount,
    materialCount: materials.length
  };
};
```

#### Budget Validation
```typescript
const validateBudgetAvailability = async (projectId: string, estimatedCost: number): Promise<BudgetValidation> => {
  try {
    const response = await apiClient.get(`/api/v1/projects/${projectId}/budget-check`, {
      params: { amount: estimatedCost }
    });
    
    return {
      available: response.data.available,
      remainingBudget: response.data.remainingBudget,
      budgetCode: response.data.suggestedBudgetCode,
      message: response.data.message
    };
  } catch (error) {
    return {
      available: false,
      remainingBudget: 0,
      budgetCode: null,
      message: "Budget validation failed"
    };
  }
};
```

---

## 📝 Form 2: Contractor Registration Form

### Form Architecture
```typescript
interface ContractorFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  workOrderIntegration: true;
  performanceTracking: true;
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
      name: "contractorName",
      label: "Contractor/Company Name",
      type: "text",
      placeholder: "Enter contractor name",
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
        helper: "Registered contractor or company name"
      },
      duplicateCheck: {
        endpoint: "/api/v1/contractors/check-duplicate",
        field: "contractorName",
        message: "Contractor with this name already exists"
      }
    },
    {
      name: "contractorType",
      label: "Contractor Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "general", label: "General Contractor", icon: "hard-hat" },
          { value: "specialized", label: "Specialized Contractor", icon: "wrench" },
          { value: "subcontractor", label: "Subcontractor", icon: "users" },
          { value: "consultant", label: "Consultant", icon: "briefcase" }
        ]
      },
      validation: {
        required: true
      },
      ui: {
        icon: "type",
        helper: "Select contractor category"
      }
    },
    {
      name: "assignedProject",
      label: "Assigned Project",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/active",
        displayField: "projectName",
        valueField: "id",
        additionalFields: ["location", "projectType", "status"]
      },
      ui: {
        icon: "building",
        searchable: true,
        helper: "Primary project for this contractor"
      }
    },
    {
      name: "registrationNumber",
      label: "Registration Number",
      type: "text",
      placeholder: "Enter registration number",
      required: true,
      validation: {
        pattern: "^[A-Z0-9\\-]+$",
        customMessage: "Enter valid registration number"
      },
      ui: {
        icon: "hash",
        helper: "Business registration or license number"
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
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "0171-234567",
      required: true,
      validation: {
        pattern: "^[0-9]{11}$"
      },
      ui: {
        icon: "phone",
        helper: "Primary contact number"
      }
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "contractor@example.com",
      required: true,
      validation: {
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
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
      name: "officeAddress",
      label: "Office Address",
      type: "textarea",
      placeholder: "Enter office address...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        rows: 3,
        helper: "Complete office address"
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
    }
  ]
}
```

#### Section 4: Contract Information
```typescript
{
  section: "Contract Information",
  layout: "two-column",
  fields: [
    {
      name: "contractValue",
      label: "Contract Value",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: 1000000000
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Total contract value"
      }
    },
    {
      name: "contractStartDate",
      label: "Contract Start Date",
      type: "date",
      required: true,
      validation: {
        minDate: "today"
      },
      ui: {
        icon: "calendar"
      }
    },
    {
      name: "contractEndDate",
      label: "Contract End Date",
      type: "date",
      required: true,
      validation: {
        minDate: "contractStartDate + 30 days"
      },
      ui: {
        icon: "calendar-check",
        helper: "Expected contract completion date"
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
          { value: "milestone", label: "Milestone Based" },
          { value: "monthly", label: "Monthly Progress" },
          { value: "completion", label: "On Completion" },
          { value: "hybrid", label: "Hybrid (Milestone + Monthly)" }
        ]
      },
      ui: {
        icon: "clock",
        helper: "Contract payment structure"
      }
    },
    {
      name: "advancePercentage",
      label: "Advance Percentage",
      type: "percentage",
      placeholder: "10",
      required: true,
      validation: {
        min: 0,
        max: 30
      },
      ui: {
        icon: "percent",
        suffix: "%",
        helper: "Maximum advance allowed (30%)",
        defaultValue: 10
      }
    },
    {
      name: "retentionPercentage",
      label: "Retention Percentage",
      type: "percentage",
      placeholder: "5",
      required: true,
      validation: {
        min: 0,
        max: 10
      },
      ui: {
        icon: "lock",
        suffix: "%",
        helper: "Retention money percentage (typically 5-10%)",
        defaultValue: 5
      }
    }
  ]
}
```

#### Section 5: Specialization & Capabilities
```typescript
{
  section: "Specialization & Capabilities",
  layout: "single-column",
  fields: [
    {
      name: "specializations",
      label: "Areas of Specialization",
      type: "multiselect",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "foundation", label: "Foundation Work" },
          { value: "structural", label: "Structural Work" },
          { value: "electrical", label: "Electrical Work" },
          { value: "plumbing", label: "Plumbing & Sanitation" },
          { value: "hvac", label: "HVAC Systems" },
          { value: "firefighting", label: "Fire Fighting Systems" },
          { value: "elevator", label: "Elevator Installation" },
          { value: "finishing", label: "Interior Finishing" },
          { value: "landscaping", label: "Landscaping" },
          { value: "external", label: "External Works" }
        ]
      },
      ui: {
        icon: "star",
        helper: "Select areas of specialization",
        maxSelection: 5
      }
    },
    {
      name: "teamSize",
      label: "Team Size",
      type: "number",
      placeholder: "50",
      required: true,
      validation: {
        min: 5,
        max: 500
      },
      ui: {
        icon: "users",
        helper: "Approximate team size"
      }
    },
    {
      name: "equipmentAvailable",
      label: "Equipment Available",
      type: "multiselect",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "excavator", label: "Excavator" },
          { value: "crane", label: "Crane" },
          { value: "mixer", label: "Concrete Mixer" },
          { value: "compactor", label: "Compactor" },
          { value: "generator", label: "Generator" },
          { value: "welding", label: "Welding Equipment" },
          { value: "scaffolding", label: "Scaffolding" }
        ]
      },
      ui: {
        icon: "truck",
        helper: "Equipment contractor can provide"
      }
    },
    {
      name: "certifications",
      label: "Certifications & Licenses",
      type: "multiselect",
      required: false,
      options: {
        source: "api",
        endpoint: "/api/certifications/construction",
        cache: true
      },
      ui: {
        icon: "award",
        helper: "Relevant certifications and licenses"
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
      name: "previousExperience",
      label: "Previous Experience",
      type: "textarea",
      placeholder: "Enter previous project experience...",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "history",
        rows: 3,
        helper: "Previous similar projects completed"
      }
    },
    {
      name: "references",
      label: "References",
      type: "dynamic-array",
      required: false,
      minItems: 0,
      maxItems: 3,
      fields: [
        {
          name: "name",
          label: "Reference Name",
          type: "text",
          required: true
        },
        {
          name: "company",
          label: "Company",
          type: "text",
          required: true
        },
        {
          name: "phone",
          label: "Phone",
          type: "tel",
          required: true
        },
        {
          name: "project",
          label: "Project Reference",
          type: "text",
          required: false
        }
      ],
      ui: {
        addButtonText: "Add Reference",
        maxItems: 3
      }
    },
    {
      name: "documents",
      label: "Contractor Documents",
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
        helper: "Upload license, certificates, company profile, etc."
      }
    }
  ]
}
```

---

## 📝 Form 3: RA Bill Submission Form

### Form Architecture
```typescript
interface RABillFormArchitecture {
  formType: "modal";
  layout: "two-column",
  validation: "real-time";
  submission: "async";
  workOrderLinking: true;
  approvalWorkflow: true;
  measurementIntegration: true;
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
      name: "contractor",
      label: "Select Contractor",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/contractors/active",
        displayField: "contractorName",
        valueField: "id",
        additionalFields: ["contractValue", "remainingContract", "specializations"]
      },
      ui: {
        icon: "hard-hat",
        searchable: true,
        helper: "Select contractor for this RA bill"
      }
    },
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
        additionalFields: ["description", "contractValue", "approvedAmount", "status"]
      },
      ui: {
        icon: "file-text",
        searchable: true,
        helper: "Link to approved work order"
      }
    },
    {
      name: "raBillNumber",
      label: "RA Bill Number",
      type: "text",
      placeholder: "RA-001",
      required: true,
      validation: {
        pattern: "^RA-\\d{4}$",
        customMessage: "Format: RA-0000 (e.g., RA-0001)"
      },
      ui: {
        icon: "hash",
        helper: "Auto-generated or manual entry",
        autoGenerate: true
      },
      duplicateCheck: {
        endpoint: "/api/v1/ra-bills/check-duplicate",
        field: "raBillNumber",
        message: "RA bill number already exists"
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
      name: "billPeriod",
      label: "Billing Period",
      type: "daterange",
      required: true,
      validation: {
        minDays: 7,
        maxDays: 90
      },
      ui: {
        icon: "calendar",
        helper: "Period covered by this RA bill"
      }
    },
    {
      name: "description",
      label: "Work Description",
      type: "textarea",
      placeholder: "Enter work description...",
      required: true,
      validation: {
        minLength: 20,
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Detailed description of work completed"
      }
    },
    {
      name: "claimedAmount",
      label: "Claimed Amount",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: "workOrder.remainingAmount"
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Amount claimed by contractor"
      }
    },
    {
      name: "measurementSheet",
      label: "Measurement Sheet Reference",
      type: "text",
      placeholder: "Enter measurement sheet number",
      required: true,
      validation: {
        pattern: "^MS-\\d{4}$",
        customMessage: "Format: MS-0000"
      },
      ui: {
        icon: "ruler",
        helper: "Reference to measurement sheet"
      }
    }
  ]
}
```

#### Section 3: Work Breakdown (Dynamic)
```typescript
{
  section: "Work Breakdown",
  layout: "dynamic-table",
  fields: [
    {
      name: "workItems",
      type: "dynamic-array",
      required: true,
      minItems: 1,
      maxItems: 20,
      fields: [
        {
          name: "item",
          label: "Work Item",
          type: "select",
          required: true,
          options: {
            source: "api",
            endpoint: "/api/v1/work-orders/{workOrder}/items",
            dependsOn: "workOrder",
            displayField: "description",
            valueField: "id",
            additionalFields: ["unit", "rate", "quantity"]
          },
          ui: {
            searchable: true,
            width: "150px"
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
            placeholder: "Additional details",
            width: "120px"
          }
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
          validation: {
            min: 0,
            step: 0.01
          },
          ui: {
            placeholder: "0",
            width: "80px"
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
              { value: "sqft", label: "Sq Ft" },
              { value: "cum", label: "Cum" },
              { value: "m", label: "Meters" },
              { value: "kg", label: "Kg" },
              { value: "tons", label: "Tons" },
              { value: "pcs", label: "Pieces" },
              { value: "hours", label: "Hours" }
            ]
          },
          ui: {
            width: "80px"
          }
        },
        {
          name: "rate",
          label: "Rate",
          type: "currency",
          required: true,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            placeholder: "0.00",
            width: "100px"
          }
        },
        {
          name: "amount",
          label: "Amount",
          type: "currency",
          required: true,
          validation: {
            min: 0
          },
          ui: {
            prefix: "৳",
            disabled: true,
            calculated: true,
            formula: "quantity * rate",
            width: "100px"
          }
        },
        {
          name: "approvedQuantity",
          label: "Approved Qty",
          type: "number",
          required: false,
          validation: {
            min: 0,
            max: "quantity"
          },
          ui: {
            placeholder: "0",
            width: "80px",
            helper: "Quantity approved by site engineer"
          }
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "text",
          required: false,
          validation: {
            maxLength: 100
          },
          ui: {
            placeholder: "Any remarks",
            width: "100px"
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
        addButtonText: "Add Work Item",
        tableLayout: true,
        showTotals: true
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
      name: "measurementSheet",
      label: "Measurement Sheet",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 5,
        maxSize: "10MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "ruler",
        multiple: true,
        preview: false,
        helper: "Upload signed measurement sheet"
      }
    },
    {
      name: "progressPhotos",
      label: "Progress Photos",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 3,
        maxFiles: 10,
        maxSize: "5MB",
        allowedTypes: ["image/jpeg", "image/png"]
      },
      ui: {
        icon: "camera",
        multiple: true,
        preview: true,
        helper: "Upload progress photos (min 3, max 10)"
      }
    },
    {
      name: "supportingDocuments",
      label: "Additional Documents",
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
        helper: "Any additional supporting documents"
      }
    }
  ]
}
```

---

## 📝 Form 4: Progress Update Form

### Form Architecture
```typescript
interface ProgressFormArchitecture {
  formType: "modal";
  layout: "single-column";
  validation: "real-time";
  submission: "async";
  photoUpload: true;
  milestoneTracking: true;
  percentageCalculation: true;
}
```

### Form Structure Design

#### Section 1: Progress Information
```typescript
{
  section: "Progress Information",
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
      name: "milestone",
      label: "Milestone",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/{project}/milestones",
        dependsOn: "project",
        displayField: "name",
        valueField: "id",
        additionalFields: ["targetDate", "targetPercentage", "status"]
      },
      ui: {
        icon: "flag",
        helper: "Select milestone to update"
      }
    },
    {
      name: "progressPercentage",
      label: "Progress Percentage",
      type: "range",
      required: true,
      validation: {
        min: 0,
        max: 100
      },
      ui: {
        icon: "activity",
        suffix: "%",
        showValue: true,
        colorSegments: [
          { max: 25, color: "#EF4444" },
          { max: 50, color: "#F59E0B" },
          { max: 75, color: "#3B82F6" },
          { max: 100, color: "#10B981" }
        ]
      }
    },
    {
      name: "updateDate",
      label: "Update Date",
      type: "date",
      required: true,
      defaultValue: "today",
      validation: {
        maxDate: "today"
      },
      ui: {
        icon: "calendar"
      }
    }
  ]
}
```

#### Section 2: Progress Details
```typescript
{
  section: "Progress Details",
  layout: "single-column",
  fields: [
    {
      name: "description",
      label: "Progress Description",
      type: "textarea",
      required: true,
      validation: {
        minLength: 20,
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 4,
        helper: "Detailed progress update description"
      }
    },
    {
      name: "challenges",
      label: "Challenges/Issues",
      type: "textarea",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "alert-triangle",
        rows: 3,
        helper: "Any challenges or issues faced"
      }
    },
    {
      name: "nextSteps",
      label: "Next Steps",
      type: "textarea",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "arrow-right",
        rows: 3,
        helper: "Planned next steps"
      }
    }
  ]
}
```

#### Section 3: Photo Documentation
```typescript
{
  section: "Photo Documentation",
  layout: "single-column",
  fields: [
    {
      name: "progressPhotos",
      label: "Progress Photos",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 10,
        maxSize: "5MB",
        allowedTypes: ["image/jpeg", "image/png"]
      },
      ui: {
        icon: "camera",
        multiple: true,
        preview: true,
        geoTag: true,
        helper: "Upload current progress photos"
      }
    },
    {
      name: "photoCategories",
      label: "Photo Categories",
      type: "multiselect",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "exterior", label: "Exterior Work" },
          { value: "interior", label: "Interior Work" },
          { value: "structural", label: "Structural Work" },
          { value: "finishing", label: "Finishing Work" },
          { value: "safety", label: "Safety Measures" },
          { value: "quality", label: "Quality Control" }
        ]
      },
      ui: {
        icon: "tag",
        helper: "Categorize uploaded photos"
      }
    }
  ]
}
```

---

## 🎯 Button Functionality Mapping

### MRN Page Buttons
```typescript
const mrnPageButtons = {
  "New MRN": {
    action: "openModal",
    modal: "MRNForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Approve": {
    action: "approveMRN",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "mrn.status === 'pending'"
  },
  "Reject": {
    action: "rejectMRN",
    icon: "x-circle",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "mrn.status === 'pending'"
  },
  "Convert to PO": {
    action: "convertToPO",
    icon: "shopping-cart",
    variant: "outline",
    size: "small",
    condition: "mrn.status === 'approved'"
  },
  "View Details": {
    action: "navigate",
    route: "/mrn/:id",
    icon: "eye",
    variant: "ghost",
    size: "small"
  }
};
```

### Contractor Page Buttons
```typescript
const contractorPageButtons = {
  "Add Contractor": {
    action: "openModal",
    modal: "ContractorForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "View Work Orders": {
    action: "navigate",
    route: "/contractors/:id/work-orders",
    icon: "file-text",
    variant: "ghost",
    size: "small"
  },
  "View Performance": {
    action: "navigate",
    route: "/contractors/:id/performance",
    icon: "bar-chart",
    variant: "ghost",
    size: "small"
  },
  "Terminate Contract": {
    action: "confirmAction",
    confirmation: "Are you sure you want to terminate this contract?",
    icon: "ban",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "contractor.status === 'active'"
  }
};
```

### RA Bill Page Buttons
```typescript
const raBillButtons = {
  "New RA Bill": {
    action: "openModal",
    modal: "RABillForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Approve": {
    action: "approveRABill",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "ra.status === 'pending'"
  },
  "Reject": {
    action: "rejectRABill",
    icon: "x-circle",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "ra.status === 'pending'"
  },
  "Process Payment": {
    action: "openModal",
    modal: "PaymentForm",
    icon: "credit-card",
    variant: "outline",
    size: "small",
    condition: "ra.status === 'approved'"
  },
  "View Measurement": {
    action: "openModal",
    modal: "MeasurementSheetViewer",
    icon: "ruler",
    variant: "ghost",
    size: "small"
  }
};
```

### Progress Page Buttons
```typescript
const progressPageButtons = {
  "Update Progress": {
    action: "openModal",
    modal: "ProgressForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Add Milestone": {
    action: "openModal",
    modal: "MilestoneForm",
    icon: "flag",
    variant: "outline",
    size: "medium"
  },
  "View Photos": {
    action: "openModal",
    modal: "PhotoGallery",
    icon: "image",
    variant: "ghost",
    size: "small"
  },
  "Generate Report": {
    action: "generateReport",
    reportType: "progress-report",
    icon: "file-text",
    variant: "outline",
    size: "small"
  }
};
```

---

## 📊 Data Flow Architecture

### MRN Data Flow
```
Project Selection → Material Entry → Priority Assignment → Budget Validation → Document Upload → Submission → Approval Workflow → PO Conversion → Vendor Notification → Material Delivery → Site Receipt
```

### Contractor Registration Data Flow
```
Basic Information → Contact Details → Contract Information → Specialization → Reference Check → Document Upload → Validation → Registration → Work Order Assignment → Performance Tracking Setup
```

### RA Bill Data Flow
```
Contractor Selection → Work Order Linking → Bill Details → Work Breakdown → Measurement Reference → Document Upload → Site Engineer Review → Quantity Verification → Amount Validation → Approval → Payment Processing → Contract Update
```

### Progress Update Data Flow
```
Project Selection → Milestone Selection → Progress Input → Photo Upload → Description Entry → Challenge Documentation → Validation → Submission → Progress Calculation → Milestone Update → Dashboard Update → Notification
```

---

## 🔗 Module Relationships

### MRN ↔ Purchase Orders Relationship
```typescript
interface MRNPORelationship {
  type: "one-to-one";
  cascade: "restrict";
  foreignKey: "mrnId";
  constraints: {
    status: "Only approved MRNs can be converted to POs",
    amount: "PO amount must match MRN estimated cost"
  };
}
```

### Contractors ↔ Work Orders Relationship
```typescript
interface ContractorWorkOrderRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "contractorId";
  constraints: {
    contract: "Work order must be within contract period",
    amount: "Total work orders cannot exceed contract value"
  };
}
```

### Work Orders ↔ RA Bills Relationship
```typescript
interface WorkOrderRABillRelationship {
  type: "one-to-many";
  cascade: "restrict";
  foreignKey: "workOrderId";
  constraints: {
    amount: "Total RA bills cannot exceed work order amount",
    status: "Cannot bill cancelled work orders"
  };
}
```

### Projects ↔ Progress Relationship
```typescript
interface ProjectProgressRelationship {
  type: "one-to-many";
  cascade: "none";
  foreignKey: "projectId";
  constraints: {
    chronological: "Progress updates must be sequential",
    percentage: "Progress percentage must be increasing"
  };
}
```

---

## 🎨 UI Component Specifications

### MRN Status Card Component
```typescript
interface MRNStatusCardProps {
  mrn: MRN;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onConvert: (id: string) => void;
}

const MRNStatusCard = ({ mrn, onApprove, onReject, onConvert }: MRNStatusCardProps) => {
  return (
    <Card className="mrn-status-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="mrn-id">{mrn.mrnNumber}</h3>
            <p className="mrn-material">{mrn.material}</p>
          </div>
          <Badge variant={getStatusVariant(mrn.status)}>
            {mrn.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <InfoRow icon="building" label="Project" value={mrn.projectName} />
          <InfoRow icon="calendar" label="Required By" value={formatDate(mrn.requiredDate)} />
          <InfoRow icon="user" label="Requested By" value={mrn.requestedBy} />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm font-medium">Est. Cost</span>
            <span className="mrn-quantity">{formatCurrency(mrn.estimatedCost)}</span>
          </div>
          <PriorityBadge priority={mrn.priority} />
        </div>
        <div className="flex gap-2 mt-4">
          {mrn.status === 'pending' && (
            <>
              <Button onClick={() => onApprove(mrn.id)} variant="outline" size="sm">
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button onClick={() => onReject(mrn.id)} variant="ghost" size="sm" className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
            </>
          )}
          {mrn.status === 'approved' && (
            <Button onClick={() => onConvert(mrn.id)} variant="outline" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" /> Convert to PO
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

### Work Order Timeline Component
```typescript
interface WorkOrderTimelineProps {
  workOrder: WorkOrder;
  onViewDetails: (id: string) => void;
}

const WorkOrderTimeline = ({ workOrder, onViewDetails }: WorkOrderTimelineProps) => {
  const timelineEvents = [
    {
      date: workOrder.createdDate,
      title: "Work Order Created",
      icon: "file-plus",
      status: "completed"
    },
    {
      date: workOrder.approvedDate,
      title: "Work Order Approved",
      icon: "check-circle",
      status: workOrder.status === 'approved' ? 'completed' : 'pending'
    },
    {
      date: workOrder.startDate,
      title: "Work Started",
      icon: "play",
      status: workOrder.status === 'in-progress' ? 'completed' : 'pending'
    },
    {
      date: workOrder.estimatedCompletion,
      title: "Estimated Completion",
      icon: "flag",
      status: workOrder.status === 'completed' ? 'completed' : 'pending'
    }
  ];

  return (
    <div className="work-order-timeline">
      {timelineEvents.map((event, index) => (
        <TimelineItem key={index} event={event} />
      ))}
      <div className="flex gap-2 mt-4">
        <Button onClick={() => onViewDetails(workOrder.id)} variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </div>
    </div>
  );
};
```

---

## 📱 Responsive Design Breakpoints

```css
/* MRN Grid Responsive */
@media (min-width: 1024px) {
  .mrn-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .mrn-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .contractor-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .work-order-timeline {
    padding: 12px;
  }
  
  .progress-visualization {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔒 Security & Validation Rules

### Construction Data Protection
```typescript
const constructionDataProtection = {
  encryption: {
    fields: ['bankAccount', 'contractValue', 'claimedAmount'],
    algorithm: 'AES-256'
  },
  accessControl: {
    view: ['admin', 'construction-manager', 'project-manager', 'site-engineer'],
    edit: ['admin', 'construction-manager', 'project-manager'],
    approve: ['admin', 'construction-manager', 'project-manager'],
    delete: ['admin']
  },
  auditLog: {
    events: ['MRN_CREATED', 'MRN_APPROVED', 'MRN_REJECTED', 'CONTRACTOR_REGISTERED', 'RA_BILL_SUBMITTED', 'RA_BILL_APPROVED', 'PROGRESS_UPDATED']
  }
};
```

### Financial Security
```typescript
const constructionFinancialSecurity = {
  validation: {
    raBill: {
      maxAmount: 50000000, // Max 5 crore per RA bill
      maxVariance: 10, // Max 10% variance from measurement
      maxItems: 20
    },
    siteAdvance: {
      maxAmount: 10000000, // Max 1 crore per advance
      maxPercentage: 30 // Max 30% of work order
    },
    progress: {
      maxPercentage: 100,
      validation: "Must be incremental"
    }
  },
  approvalLimits: {
    level1: { maxAmount: 5000000, approvers: ['site-engineer', 'construction-manager'] },
    level2: { maxAmount: 20000000, approvers: ['project-manager', 'construction-manager'] },
    level3: { maxAmount: 50000000, approvers: ['director', 'finance-director'] }
  }
};
```

---

## 📈 Performance Optimization

### MRN Search Optimization
```typescript
const mrnSearchConfig = {
  debounceTime: 300,
  cacheResults: true,
  cacheTTL: 300000, // 5 minutes
  searchFields: ['mrnNumber', 'material', 'project', 'requestedBy'],
  maxResults: 50,
  filters: ['status', 'priority', 'project', 'dateRange']
};
```

### Progress Calculation Caching
```typescript
const progressCacheConfig = {
  keyGenerator: (projectId: string, milestoneId: string) => 
    `progress-${projectId}-${milestoneId}`,
  ttl: 60000, // 1 minute
  storage: 'memory'
};
```

---

## 🎯 Success Metrics

### Construction Metrics
```typescript
const constructionMetrics = {
  mrn: {
    targetTime: "6 minutes",
    targetErrorRate: "< 3%",
    targetSuccessRate: "> 95%"
  },
  contractor: {
    targetTime: "8 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  },
  raBill: {
    targetTime: "10 minutes",
    targetErrorRate: "< 3%",
    targetSuccessRate: "> 95%"
  },
  progress: {
    targetTime: "5 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  }
};
```

---

## 📋 Testing Checklist

### MRN Form Testing
- [ ] Project and material selection
- [ ] Dynamic material addition/removal
- [ ] Priority assignment and routing
- [ ] Budget availability validation
- [ ] Document upload functionality
- [ ] PO conversion workflow
- [ ] Approval notification system

### Contractor Form Testing
- [ ] Contractor type selection
- [ ] Contract value validation
- [ ] Payment terms enforcement
- [ ] Specialization selection
- [ ] Reference validation
- [ ] Document upload functionality
- [ ] Work order assignment

### RA Bill Form Testing
- [ ] Contractor and work order selection
- [ ] Work item addition/removal
- [ ] Measurement sheet validation
- [ ] Quantity verification
- [ ] Amount calculation accuracy
- [ ] Photo upload and categorization
- [ ] Approval workflow

### Progress Form Testing
- [ ] Project and milestone selection
- [ ] Progress percentage validation
- [ ] Photo upload with geo-tagging
- [ ] Description and challenges entry
- [ ] Progress calculation accuracy
- [ ] Milestone update workflow
