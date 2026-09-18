# Projects & Property Module - Comprehensive Planning Document

## 🏗️ Module Overview
**Module Name:** Projects & Property  
**Parent Navigation:** Dashboard → Projects & Property  
**Sub-menus:** All Projects, Unit Management, Construction Progress  
**Primary Users:** Project Managers, Sales Team, Management  

---

## 📋 Module Structure & Navigation Flow

```
Dashboard
└── Projects & Property
    ├── All Projects (Main List View)
    │   ├── Add New Project (Modal Form)
    │   ├── View Project Details (Detail Page)
    │   ├── Edit Project (Modal Form)
    │   └── Delete Project (Confirmation Dialog)
    │
    ├── Unit Management
    │   ├── Unit List (Table View)
    │   ├── Add Unit (Modal Form)
    │   ├── Unit Details (Detail Page)
    │   ├── Edit Unit (Modal Form)
    │   ├── Allocate Unit (Modal Form)
    │   └── Unit Status Management
    │
    └── Construction Progress
        ├── Progress Overview (Dashboard)
        ├── Add Milestone (Modal Form)
        ├── Update Progress (Modal Form)
        ├── Photo Upload (Modal Form)
        └── Progress Reports (Report View)
```

---

## 🎨 UI/UX Design Standards

### Color Palette Integration
```css
/* Project Status Colors */
.status-planning { background: #6B7280; }      /* Gray */
.status-active { background: #10B981; }         /* Green */
.status-completed { background: #3B82F6; }     /* Blue */
.status-on-hold { background: #F59E0B; }       /* Amber */
.status-delayed { background: #EF4444; }        /* Red */

/* Unit Status Colors */
.unit-available { background: #10B981; }       /* Green */
.unit-booked { background: #F59E0B; }          /* Amber */
.unit-sold { background: #3B82F6; }            /* Blue */
.unit-reserved { background: #8B5CF6; }       /* Purple */
```

### Typography Hierarchy
```css
/* Page Headers */
.page-title { font-size: 24px; font-weight: 700; color: #1F2937; }
.page-subtitle { font-size: 14px; color: #6B7280; }

/* Card Headers */
.card-title { font-size: 18px; font-weight: 600; color: #1F2937; }
.card-subtitle { font-size: 13px; color: #6B7280; }

/* Table Headers */
.table-header { font-size: 13px; font-weight: 600; color: #374151; }
.table-cell { font-size: 14px; color: #1F2937; }

/* Form Labels */
.form-label { font-size: 14px; font-weight: 500; color: #374151; }
.form-helper { font-size: 12px; color: #6B7280; }
```

### Layout Structure
```css
/* Main Container */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

/* Form Layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-full-width {
  grid-column: span 2;
}
```

---

## 📝 Form 1: Project Creation Form

### Form Architecture
```typescript
interface ProjectFormArchitecture {
  formType: "modal" | "page";
  layout: "two-column" | "single-column";
  validation: "real-time" | "on-submit";
  submission: "async" | "sync";
  fileUpload: true;
  dynamicFields: true;
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
      name: "projectName",
      label: "Project Name",
      type: "text",
      placeholder: "Enter project name",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
        pattern: "^[a-zA-Z0-9\\s\\-]+$"
      },
      ui: {
        icon: "building",
        size: "large",
        autoFocus: true
      }
    },
    {
      name: "projectCode",
      label: "Project Code",
      type: "text",
      placeholder: "PRJ-001",
      required: true,
      validation: {
        pattern: "^[A-Z]{3}-\\d{3}$",
        customMessage: "Format: XXX-000 (e.g., PRJ-001)"
      },
      ui: {
        icon: "hash",
        size: "medium",
        helper: "Auto-generated or manual entry"
      }
    },
    {
      name: "projectType",
      label: "Project Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "residential", label: "Residential", icon: "home" },
          { value: "commercial", label: "Commercial", icon: "building" },
          { value: "mixed", label: "Mixed Use", icon: "layers" }
        ]
      },
      validation: {
        required: true
      },
      ui: {
        icon: "type",
        searchable: true,
        clearable: false
      }
    }
  ]
}
```

#### Section 2: Location & Details
```typescript
{
  section: "Location & Details",
  layout: "two-column",
  fields: [
    {
      name: "location",
      label: "Project Location",
      type: "text",
      placeholder: "Enter full address",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        size: "large",
        helper: "Full physical address"
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
      label: "Area/Zone",
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
      name: "landSize",
      label: "Land Size",
      type: "number",
      placeholder: "Enter land size",
      required: true,
      validation: {
        min: 0,
        step: 0.01
      },
      ui: {
        icon: "maximize",
        suffix: "sq ft",
        helper: "Total land area in square feet"
      }
    }
  ]
}
```

#### Section 3: Project Specifications
```typescript
{
  section: "Project Specifications",
  layout: "two-column",
  fields: [
    {
      name: "totalUnits",
      label: "Total Units",
      type: "number",
      placeholder: "Enter total units",
      required: true,
      validation: {
        min: 1,
        max: 1000
      },
      ui: {
        icon: "grid",
        helper: "Total number of units in project"
      }
    },
    {
      name: "totalFloors",
      label: "Total Floors",
      type: "number",
      placeholder: "Enter total floors",
      required: true,
      validation: {
        min: 1,
        max: 100
      },
      ui: {
        icon: "layers",
        helper: "Number of floors including ground"
      }
    },
    {
      name: "startDate",
      label: "Project Start Date",
      type: "date",
      required: true,
      validation: {
        minDate: "today",
        custom: "Cannot be in the past"
      },
      ui: {
        icon: "calendar",
        helper: "Expected project commencement date"
      }
    },
    {
      name: "estimatedCompletion",
      label: "Estimated Completion",
      type: "date",
      required: true,
      validation: {
        minDate: "startDate",
        custom: "Must be after start date"
      },
      ui: {
        icon: "calendar-check",
        helper: "Expected completion date"
      }
    }
  ]
}
```

#### Section 4: Financial Information
```typescript
{
  section: "Financial Information",
  layout: "two-column",
  fields: [
    {
      name: "budget",
      label: "Total Project Budget",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        format: "BDT"
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Total estimated project cost"
      }
    },
    {
      name: "budgetBreakdown",
      label: "Budget Breakdown",
      type: "dynamic-array",
      required: false,
      fields: [
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["Construction", "Materials", "Labor", "Permits", "Other"]
        },
        {
          name: "amount",
          label: "Amount",
          type: "currency"
        },
        {
          name: "percentage",
          label: "% of Total",
          type: "percentage",
          calculated: true
        }
      ],
      ui: {
        icon: "pie-chart",
        addButtonText: "Add Budget Item",
        minItems: 1,
        maxItems: 10
      }
    },
    {
      name: "fundingSource",
      label: "Primary Funding Source",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/investors/active",
        displayField: "investorName"
      },
      ui: {
        icon: "wallet",
        helper: "Main investor or funding source"
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
      name: "description",
      label: "Project Description",
      type: "textarea",
      placeholder: "Enter project description...",
      required: false,
      validation: {
        maxLength: 1000,
        minLength: 0
      },
      ui: {
        icon: "file-text",
        rows: 4,
        helper: "Detailed project overview (max 1000 characters)"
      }
    },
    {
      name: "features",
      label: "Project Features",
      type: "multiselect",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "parking", label: "Parking Facility" },
          { value: "gym", label: "Gym/Fitness Center" },
          { value: "pool", label: "Swimming Pool" },
          { value: "security", label: "24/7 Security" },
          { value: "elevator", label: "Elevator" },
          { value: "generator", label: "Power Backup" },
          { value: "garden", label: "Community Garden" },
          { value: "playground", label: "Children's Play Area" }
        ]
      },
      ui: {
        icon: "check-square",
        helper: "Select available amenities"
      }
    },
    {
      name: "projectImages",
      label: "Project Images",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 5,
        maxSize: "5MB",
        allowedTypes: ["image/jpeg", "image/png", "image/webp"]
      },
      ui: {
        icon: "image",
        multiple: true,
        preview: true,
        helper: "Upload project images (max 5 files, 5MB each)"
      }
    },
    {
      name: "documents",
      label: "Project Documents",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 10,
        maxSize: "10MB",
        allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      },
      ui: {
        icon: "file",
        multiple: true,
        preview: false,
        helper: "Upload permits, approvals, etc. (max 10 files)"
      }
    }
  ]
}
```

### Form Submission Flow

#### Step 1: Client-Side Validation
```typescript
const validateProjectForm = (formData: ProjectFormData) => {
  // Required field validation
  const requiredFields = ['projectName', 'projectCode', 'projectType', 'location', 'totalUnits', 'startDate', 'estimatedCompletion', 'budget'];
  
  // Format validation
  const formatValidations = {
    projectCode: /^[A-Z]{3}-\d{3}$/,
    budget: /^\d+(\.\d{1,2})?$/
  };
  
  // Business logic validation
  const businessValidations = {
    estimatedCompletion: (value: Date) => value > formData.startDate,
    budgetBreakdown: (items: BudgetItem[]) => {
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      return total <= formData.budget;
    }
  };
  
  return { isValid: boolean, errors: ValidationError[] };
};
```

#### Step 2: Data Preparation
```typescript
const prepareProjectData = (formData: ProjectFormData) => {
  return {
    ...formData,
    projectCode: formData.projectCode.toUpperCase(),
    budget: parseFloat(formData.budget),
    startDate: formatDate(formData.startDate),
    estimatedCompletion: formatDate(formData.estimatedCompletion),
    features: formData.features.join(','),
    budgetBreakdown: calculatePercentages(formData.budgetBreakdown),
    status: 'planning',
    createdBy: getCurrentUserId(),
    createdAt: new Date().toISOString()
  };
};
```

#### Step 3: API Submission
```typescript
const submitProjectForm = async (preparedData: PreparedProjectData) => {
  try {
    // Step 3.1: Upload files first
    const imageUrls = await uploadFiles(preparedData.projectImages, 'projects/images');
    const documentUrls = await uploadFiles(preparedData.documents, 'projects/documents');
    
    // Step 3.2: Prepare final data
    const finalData = {
      ...preparedData,
      projectImages: imageUrls,
      documents: documentUrls
    };
    
    // Step 3.3: Submit to API
    const response = await apiClient.post('/api/v1/projects', finalData);
    
    // Step 3.4: Handle response
    if (response.success) {
      return { success: true, projectId: response.data.id };
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

#### Step 4: Post-Submission Actions
```typescript
const handleProjectSubmissionSuccess = (result: SubmissionResult) => {
  // Show success notification
  showNotification('Project created successfully', 'success');
  
  // Close modal
  closeFormModal();
  
  // Refresh project list
  refreshProjectList();
  
  // Optional: Navigate to project details
  if (autoNavigate) {
    navigate(`/projects/${result.projectId}`);
  }
  
  // Log activity
  logActivity('PROJECT_CREATED', { projectId: result.projectId });
};
```

### API Integration Specifications

#### Create Project API
```typescript
// Endpoint: POST /api/v1/projects
interface CreateProjectAPI {
  method: 'POST';
  endpoint: '/api/v1/projects';
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
  };
  requestBody: {
    projectName: string;
    projectCode: string;
    projectType: 'residential' | 'commercial' | 'mixed';
    location: string;
    city: string;
    area: string;
    landSize: number;
    totalUnits: number;
    totalFloors: number;
    startDate: string; // ISO date
    estimatedCompletion: string; // ISO date
    budget: number;
    budgetBreakdown?: BudgetItem[];
    fundingSource: string;
    description?: string;
    features?: string;
    projectImages?: string[];
    documents?: string[];
  };
  response: {
    success: boolean;
    data?: {
      id: string;
      projectCode: string;
      status: string;
      createdAt: string;
    };
    message?: string;
    errors?: ValidationError[];
  };
}
```

#### Get Projects API
```typescript
// Endpoint: GET /api/v1/projects
interface GetProjectsAPI {
  method: 'GET';
  endpoint: '/api/v1/projects';
  queryParams: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    projectType?: string;
    city?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  response: {
    success: boolean;
    data?: Project[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

---

## 📝 Form 2: Unit Creation Form

### Form Architecture
```typescript
interface UnitFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  dependentFields: true;
  autoCalculation: true;
}
```

### Form Structure Design

#### Section 1: Unit Basic Information
```typescript
{
  section: "Unit Basic Information",
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
        cache: true,
        refreshOnMount: true
      },
      ui: {
        icon: "building",
        searchable: true,
        helper: "Select project for this unit",
        onChange: "loadProjectUnits"
      }
    },
    {
      name: "unitNumber",
      label: "Unit Number",
      type: "text",
      placeholder: "A-101",
      required: true,
      validation: {
        pattern: "^[A-Z]?\\d{3}[A-Z]?$",
        customMessage: "Format: A-101, 101, or 101A"
      },
      ui: {
        icon: "hash",
        helper: "Unique unit identifier",
        uniqueCheck: {
          endpoint: "/api/v1/units/check-availability",
          field: "unitNumber",
          dependsOn: "project"
        }
      }
    },
    {
      name: "unitType",
      label: "Unit Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "apartment", label: "Apartment", icon: "home" },
          { value: "office", label: "Office Space", icon: "briefcase" },
          { value: "shop", label: "Shop/Retail", icon: "shopping-bag" },
          { value: "penthouse", label: "Penthouse", icon: "star" },
          { value: "studio", label: "Studio", icon: "maximize" }
        ]
      },
      ui: {
        icon: "type",
        searchable: false
      }
    },
    {
      name: "floorNumber",
      label: "Floor Number",
      type: "number",
      placeholder: "1",
      required: true,
      validation: {
        min: 0,
        max: 100
      },
      ui: {
        icon: "layers",
        helper: "Floor number (0 for ground floor)"
      }
    }
  ]
}
```

#### Section 2: Unit Specifications
```typescript
{
  section: "Unit Specifications",
  layout: "two-column",
  fields: [
    {
      name: "size",
      label: "Unit Size",
      type: "number",
      placeholder: "1200",
      required: true,
      validation: {
        min: 100,
        max: 10000,
        step: 1
      },
      ui: {
        icon: "maximize",
        suffix: "sq ft",
        helper: "Total area in square feet"
      }
    },
    {
      name: "bedrooms",
      label: "Bedrooms",
      type: "number",
      placeholder: "3",
      required: false,
      validation: {
        min: 0,
        max: 10
      },
      conditional: {
        showWhen: {
          field: "unitType",
          equals: ["apartment", "penthouse", "studio"]
        }
      },
      ui: {
        icon: "bed",
        helper: "Number of bedrooms"
      }
    },
    {
      name: "bathrooms",
      label: "Bathrooms",
      type: "number",
      placeholder: "2",
      required: false,
      validation: {
        min: 0,
        max: 10
      },
      conditional: {
        showWhen: {
          field: "unitType",
          equals: ["apartment", "penthouse"]
        }
      },
      ui: {
        icon: "bath",
        helper: "Number of bathrooms"
      }
    },
    {
      name: "balconies",
      label: "Balconies",
      type: "number",
      placeholder: "1",
      required: false,
      validation: {
        min: 0,
        max: 5
      },
      ui: {
        icon: "sun",
        helper: "Number of balconies"
      }
    },
    {
      name: "parkingSpaces",
      label: "Parking Spaces",
      type: "number",
      placeholder: "1",
      required: false,
      validation: {
        min: 0,
        max: 5
      },
      ui: {
        icon: "car",
        helper: "Number of parking spaces allocated"
      }
    },
    {
      name: "facing",
      label: "Unit Facing",
      type: "select",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "north", label: "North" },
          { value: "south", label: "South" },
          { value: "east", label: "East" },
          { value: "west", label: "West" },
          { value: "north-east", label: "North-East" },
          { value: "north-west", label: "North-West" },
          { value: "south-east", label: "South-East" },
          { value: "south-west", label: "South-West" }
        ]
      },
      ui: {
        icon: "compass",
        helper: "Direction the unit faces"
      }
    }
  ]
}
```

#### Section 3: Pricing Information
```typescript
{
  section: "Pricing Information",
  layout: "two-column",
  fields: [
    {
      name: "pricePerSqFt",
      label: "Price per Sq Ft",
      type: "currency",
      placeholder: "৳ 5,000",
      required: true,
      validation: {
        min: 1000,
        max: 100000
      },
      ui: {
        icon: "tag",
        prefix: "৳",
        helper: "Price per square foot",
        autoCalculate: {
          targetField: "totalPrice",
          formula: "pricePerSqFt * size"
        }
      }
    },
    {
      name: "totalPrice",
      label: "Total Price",
      type: "currency",
      placeholder: "৳ 60,00,000",
      required: true,
      validation: {
        min: 0
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        disabled: true,
        helper: "Auto-calculated from size × price/sq ft",
        calculated: true
      }
    },
    {
      name: "bookingAmount",
      label: "Booking Amount",
      type: "currency",
      placeholder: "৳ 6,00,000",
      required: true,
      validation: {
        min: 0,
        max: "totalPrice * 0.5" // Max 50% of total
      },
      ui: {
        icon: "credit-card",
        prefix: "৳",
        helper: "Initial booking amount (typically 10% of total)",
        defaultValue: "totalPrice * 0.10"
      }
    },
    {
      name: "installmentPlan",
      label: "Default Installment Plan",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "monthly", label: "Monthly (12-36 months)" },
          { value: "quarterly", label: "Quarterly (4-12 quarters)" },
          { value: "lumpsum", label: "Lump Sum (1-3 payments)" }
        ]
      },
      ui: {
        icon: "calendar",
        helper: "Default payment schedule for this unit"
      }
    }
  ]
}
```

#### Section 4: Additional Features
```typescript
{
  section: "Additional Features",
  layout: "single-column",
  fields: [
    {
      name: "unitFeatures",
      label: "Unit Features",
      type: "multiselect",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "ac", label: "Air Conditioning" },
          { value: "heating", label: "Central Heating" },
          { value: "wardrobe", label: "Built-in Wardrobes" },
          { value: "kitchen", label: "Modular Kitchen" },
          { value: "furnished", label: "Semi-Furnished" },
          { value: "internet", label: "Internet Ready" },
          { value: "cable", label: "Cable TV Points" },
          { value: "intercom", label: "Intercom System" }
        ]
      },
      ui: {
        icon: "check-square",
        helper: "Select unit-specific features"
      }
    },
    {
      name: "description",
      label: "Unit Description",
      type: "textarea",
      placeholder: "Enter unit description...",
      required: false,
      validation: {
        maxLength: 500
      },
      ui: {
        icon: "file-text",
        rows: 3,
        helper: "Detailed unit description"
      }
    },
    {
      name: "unitImages",
      label: "Unit Images",
      type: "file-upload",
      required: false,
      validation: {
        maxFiles: 8,
        maxSize: "3MB",
        allowedTypes: ["image/jpeg", "image/png", "image/webp"]
      },
      ui: {
        icon: "image",
        multiple: true,
        preview: true,
        helper: "Upload unit images (floor plans, interior shots)"
      }
    }
  ]
}
```

### Form Submission Flow for Units

#### Dependent Field Loading
```typescript
const loadProjectUnits = async (projectId: string) => {
  // Load existing units to check for duplicates
  const existingUnits = await apiClient.get(`/api/v1/projects/${projectId}/units`);
  
  // Get project specifications for validation
  const projectSpecs = await apiClient.get(`/api/v1/projects/${projectId}/specs`);
  
  return {
    existingUnits: existingUnits.data,
    maxUnits: projectSpecs.data.totalUnits,
    maxFloors: projectSpecs.data.totalFloors
  };
};
```

#### Auto-Calculation Logic
```typescript
const calculateUnitPrice = (formData: UnitFormData) => {
  if (formData.size && formData.pricePerSqFt) {
    const totalPrice = formData.size * formData.pricePerSqFt;
    const bookingAmount = totalPrice * 0.10; // Default 10%
    
    return {
      totalPrice: totalPrice.toFixed(2),
      bookingAmount: bookingAmount.toFixed(2)
    };
  }
  return null;
};
```

---

## 📝 Form 3: Project Progress Update Form

### Form Architecture
```typescript
interface ProgressFormArchitecture {
  formType: "modal";
  layout: "single-column";
  validation: "real-time";
  submission: "async";
  photoUpload: true;
  milestoneTracking: true;
}
```

### Form Structure Design

#### Section 1: Progress Update
```typescript
{
  section: "Progress Update",
  layout: "single-column",
  fields: [
    {
      name: "project",
      label: "Select Project",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/projects/active",
        displayField: "projectName"
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
        dependsOn: "project"
      },
      ui: {
        icon: "flag",
        helper: "Select current milestone"
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
        minLength: 10,
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
          { value: "safety", label: "Safety Measures" }
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

### Projects Page Buttons
```typescript
const projectPageButtons = {
  "Add Project": {
    action: "openModal",
    modal: "ProjectForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Export": {
    action: "exportData",
    format: ["excel", "pdf"],
    icon: "download",
    variant: "outline",
    size: "medium"
  },
  "Filter": {
    action: "openFilterPanel",
    filters: ["status", "type", "city", "dateRange"],
    icon: "filter",
    variant: "outline",
    size: "medium"
  },
  "View Details": {
    action: "navigate",
    route: "/projects/:id",
    icon: "eye",
    variant: "ghost",
    size: "small"
  },
  "Edit": {
    action: "openModal",
    modal: "ProjectForm",
    mode: "edit",
    icon: "edit",
    variant: "ghost",
    size: "small"
  },
  "Delete": {
    action: "confirmDelete",
    confirmation: "Are you sure you want to delete this project?",
    icon: "trash",
    variant: "ghost",
    size: "small",
    color: "danger"
  }
};
```

### Units Page Buttons
```typescript
const unitPageButtons = {
  "Add Unit": {
    action: "openModal",
    modal: "UnitForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Bulk Import": {
    action: "openModal",
    modal: "BulkUnitImport",
    icon: "upload",
    variant: "outline",
    size: "medium"
  },
  "Allocate Unit": {
    action: "openModal",
    modal: "UnitAllocation",
    icon: "user-plus",
    variant: "ghost",
    size: "small",
    condition: "unit.status === 'available'"
  },
  "View Floor Plan": {
    action: "openModal",
    modal: "FloorPlanViewer",
    icon: "layout",
    variant: "ghost",
    size: "small"
  }
};
```

---

## 📊 Data Flow Architecture

### Project Creation Data Flow
```
User Input → Form Validation → Data Preparation → File Upload → API Submission → Response Handling → UI Update → Activity Logging
```

### Unit Allocation Data Flow
```
Project Selection → Unit Loading → Client Selection → Price Calculation → Booking Creation → Installment Generation → Notification → Database Update
```

### Progress Update Data Flow
```
Project Selection → Milestone Loading → Progress Input → Photo Upload → API Submission → Progress Calculation → Notification → Dashboard Update
```

---

## 🔗 Module Relationships

### Projects ↔ Units Relationship
```typescript
interface ProjectUnitRelationship {
  type: "one-to-many";
  cascade: "delete";
  foreignKey: "projectId";
  constraints: {
    maxUnits: "project.totalUnits",
    unitNumbers: "unique within project"
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
    chronological: "progressDate must be sequential",
    percentage: "must be increasing"
  };
}
```

### Units ↔ Bookings Relationship
```typescript
interface UnitBookingRelationship {
  type: "one-to-one";
  cascade: "restrict";
  foreignKey: "unitId";
  constraints: {
    status: "unit must be 'available' for booking",
    exclusive: "one booking per unit"
  };
}
```

---

## 🎨 UI Component Specifications

### Project Card Component
```typescript
interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onView, onEdit, onDelete }: ProjectCardProps) => {
  return (
    <Card className="project-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.projectName}</CardTitle>
            <CardDescription>{project.projectCode}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <InfoRow icon="map-pin" label={project.location} />
          <InfoRow icon="home" label={`${project.totalUnits} Units`} />
          <InfoRow icon="calendar" label={formatDate(project.estimatedCompletion)} />
          <ProgressBar value={project.progressPercentage} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onView(project.id)}>View Details</Button>
      </CardFooter>
    </Card>
  );
};
```

### Unit Grid Component
```typescript
interface UnitGridProps {
  units: Unit[];
  onUnitClick: (unit: Unit) => void;
  layout: "grid" | "list";
}

const UnitGrid = ({ units, onUnitClick, layout }: UnitGridProps) => {
  if (layout === "grid") {
    return (
      <div className="unit-grid">
        {units.map(unit => (
          <UnitCard 
            key={unit.id} 
            unit={unit} 
            onClick={() => onUnitClick(unit)} 
          />
        ))}
      </div>
    );
  }
  
  return <UnitTable units={units} onUnitClick={onUnitClick} />;
};
```

---

## 📱 Responsive Design Breakpoints

```css
/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .data-table {
    font-size: 14px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-table {
    font-size: 13px;
  }
}

/* Mobile (<768px) */
@media (max-width: 767px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .form-full-width {
    grid-column: span 1;
  }
}
```

---

## 🔒 Security & Validation Rules

### Input Sanitization
```typescript
const sanitizeProjectInput = (input: any): any => {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .substring(0, 1000); // Limit length
  }
  
  if (typeof input === 'number') {
    return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, input));
  }
  
  return input;
};
```

### Authorization Checks
```typescript
const checkProjectPermissions = (action: string, user: User): boolean => {
  const permissions = {
    'create': ['admin', 'project_manager'],
    'edit': ['admin', 'project_manager'],
    'delete': ['admin'],
    'view': ['admin', 'project_manager', 'sales', 'viewer']
  };
  
  return permissions[action]?.includes(user.role) || false;
};
```

---

## 📈 Performance Optimization

### Data Caching Strategy
```typescript
const projectCacheConfig = {
  projectsList: {
    ttl: 300000, // 5 minutes
    strategy: "stale-while-revalidate"
  },
  projectDetails: {
    ttl: 60000, // 1 minute
    strategy: "cache-first"
  },
  unitList: {
    ttl: 120000, // 2 minutes
    strategy: "network-first"
  }
};
```

### Lazy Loading
```typescript
const lazyLoadProjectComponents = () => {
  return {
    ProjectForm: lazy(() => import('./components/forms/ProjectForm')),
    UnitForm: lazy(() => import('./components/forms/UnitForm')),
    ProgressForm: lazy(() => import('./components/forms/ProgressForm'))
  };
};
```

---

## 🎯 Success Metrics

### Form Completion Metrics
```typescript
const formMetrics = {
  projectForm: {
    targetCompletionTime: "5 minutes",
    targetErrorRate: "< 5%",
    targetSuccessRate: "> 95%"
  },
  unitForm: {
    targetCompletionTime: "3 minutes",
    targetErrorRate: "< 3%",
    targetSuccessRate: "> 98%"
  }
};
```

---

## 📋 Testing Checklist

### Form Validation Testing
- [ ] Required field validation
- [ ] Format validation (email, phone, patterns)
- [ ] Business logic validation (dates, ranges)
- [ ] Cross-field validation
- [ ] API validation feedback

### Integration Testing
- [ ] File upload functionality
- [ ] Dependent field loading
- [ ] Auto-calculation accuracy
- [ ] API error handling
- [ ] Network failure handling

### UI/UX Testing
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Loading states
- [ ] Error states
- [ ] Success notifications
