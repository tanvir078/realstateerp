# HR & Employee Module - Comprehensive Planning Document

## 🏗️ Module Overview
**Module Name:** HR & Employee  
**Parent Navigation:** Dashboard → HR & Employee  
**Sub-menus:** Employees, Attendance & Leave, Payroll, Recruitment, Performance, Training & Development  
**Primary Users:** HR Managers, Department Heads, Management, Employees  

---

## 📋 Module Structure & Navigation Flow

```
Dashboard
└── HR & Employee
    ├── Employees
    │   ├── Employee List (Table View)
    │   ├── Add Employee (Modal Form)
    │   ├── Employee Details (Detail Page)
    │   ├── Edit Employee (Modal Form)
    │   ├── Employee Profile (Detail Page)
    │   ├── Organizational Chart (Visual View)
    │   └── Employee Directory (Card View)
    │
    ├── Attendance & Leave
    │   ├── Attendance Dashboard (Dashboard)
    │   ├── Mark Attendance (Modal Form)
    │   ├── Attendance Records (Table View)
    │   ├── Leave Application (Modal Form)
    │   ├── Leave Requests (Table View)
    │   ├── Approve/Reject Leave (Action)
    │   ├── Leave Balance (Table View)
    │   └── Attendance Reports (Report View)
    │
    ├── Payroll
    │   ├── Payroll Dashboard (Dashboard)
    │   ├── Process Payroll (Modal Form)
    │   ├── Payroll History (Table View)
    │   ├── Payslip Generation (Action)
    │   ├── Salary Structure (Table View)
    │   ├── Allowances & Deductions (Modal Form)
    │   ├── Bonus Processing (Modal Form)
    │   └── Payroll Reports (Report View)
    │
    ├── Recruitment
    │   ├── Job Postings (Table View)
    │   ├── Create Job Posting (Modal Form)
    │   ├── Applications List (Table View)
    │   ├── Application Details (Detail Page)
    │   ├── Schedule Interview (Modal Form)
    │   ├── Interview Feedback (Modal Form)
    │   ├── Offer Letter (Action)
    │   └── Hiring Process (Modal Form)
    │
    ├── Performance
    │   ├── Performance Dashboard (Dashboard)
    │   ├── KPI Setup (Modal Form)
    │   ├── Performance Review (Modal Form)
    │   ├── 360-Degree Feedback (Modal Form)
    │   ├── Goal Setting (Modal Form)
    │   ├── Performance Reports (Report View)
    │   └── Promotion/Transfer (Modal Form)
    │
    └── Training & Development
        ├── Training Programs (Table View)
        ├── Create Training (Modal Form)
        ├── Training Schedule (Calendar View)
        ├── Employee Enrollment (Modal Form)
        ├── Training Attendance (Table View)
        ├── Training Feedback (Modal Form)
        ├── Certification Tracking (Table View)
        └── Training Reports (Report View)
```

---

## 🎨 UI/UX Design Standards

### Color Palette Integration
```css
/* Employee Status Colors */
.employee-active { background: #10B981; }         /* Green */
.employee-on-leave { background: #F59E0B; }       /* Amber */
.employee-resigned { background: #6B7280; }       /* Gray */
.employee-terminated { background: #EF4444; }    /* Red */
.employee-probation { background: #3B82F6; }      /* Blue */

/* Attendance Status Colors */
.attendance-present { background: #10B981; }     /* Green */
.attendance-absent { background: #EF4444; }      /* Red */
.attendance-late { background: #F59E0B; }        /* Amber */
.attendance-half-day { background: #8B5CF6; }    /* Purple */
.attendance-holiday { background: #6B7280; }     /* Gray */

/* Leave Status Colors */
.leave-pending { background: #F59E0B; }          /* Amber */
.leave-approved { background: #10B981; }         /* Green */
.leave-rejected { background: #EF4444; }         /* Red */
.leave-cancelled { background: #6B7280; }        /* Gray */

/* Payroll Status Colors */
.payroll-draft { background: #6B7280; }          /* Gray */
.payroll-processing { background: #3B82F6; }    /* Blue */
.payroll-completed { background: #10B981; }     /* Green */
.payroll-paid { background: #8B5CF6; }          /* Purple */

/* Performance Rating Colors */
.rating-excellent { background: #10B981; }       /* Green */
.rating-good { background: #3B82F6; }           /* Blue */
.rating-average { background: #F59E0B; }        /* Amber */
.rating-poor { background: #EF4444; }           /* Red */
```

### Typography Hierarchy
```css
/* Employee Cards */
.employee-name { font-size: 18px; font-weight: 600; color: #1F2937; }
.employee-designation { font-size: 13px; color: #6B7280; }
.employee-department { font-size: 14px; color: #374151; }

/* Attendance Cards */
.attendance-date { font-size: 16px; font-weight: 600; color: #1F2937; }
.attendance-time { font-size: 14px; color: #374151; }
.attendance-status { font-size: 12px; font-weight: 500; }

/* Payroll Cards */
.salary-amount { font-size: 18px; font-weight: 700; color: #10B981; }
.payroll-period { font-size: 14px; color: #6B7280; }
.payroll-status { font-size: 12px; font-weight: 500; }
```

### Layout Structure
```css
/* Employee Grid Layout */
.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Attendance Calendar */
.attendance-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

/* Payroll Dashboard */
.payroll-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

/* Performance Chart */
.performance-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}
```

---

## 📝 Form 1: Employee Registration Form

### Form Architecture
```typescript
interface EmployeeFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  duplicateCheck: true;
  documentUpload: true;
  profilePhoto: true;
}
```

### Form Structure Design

#### Section 1: Personal Information
```typescript
{
  section: "Personal Information",
  layout: "two-column",
  fields: [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
        pattern: "^[a-zA-Z\\s\\-']+$"
      },
      ui: {
        icon: "user",
        size: "large",
        autoFocus: true
      }
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
        pattern: "^[a-zA-Z\\s\\-']+$"
      },
      ui: {
        icon: "user"
      }
    },
    {
      name: "employeeId",
      label: "Employee ID",
      type: "text",
      placeholder: "Auto-generated",
      required: true,
      validation: {
        pattern: "^EMP-\\d{4}$",
        customMessage: "Format: EMP-0000"
      },
      ui: {
        icon: "hash",
        disabled: true,
        autoGenerate: true,
        helper: "Auto-generated employee ID"
      },
      duplicateCheck: {
        endpoint: "/api/v1/employees/check-id",
        field: "employeeId",
        message: "Employee ID already exists"
      }
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
      validation: {
        maxDate: "today - 18 years",
        customMessage: "Employee must be at least 18 years old"
      },
      ui: {
        icon: "calendar"
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
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      required: true,
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
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      type: "select",
      required: false,
      options: {
        source: "static",
        data: [
          { value: "A+", label: "A+" },
          { value: "A-", label: "A-" },
          { value: "B+", label: "B+" },
          { value: "B-", label: "B-" },
          { value: "AB+", label: "AB+" },
          { value: "AB-", label: "AB-" },
          { value: "O+", label: "O+" },
          { value: "O-", label: "O-" }
        ]
      },
      ui: {
        icon: "droplet"
      }
    },
    {
      name: "nationality",
      label: "Nationality",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/countries",
        cache: true
      },
      ui: {
        icon: "globe",
        defaultValue: "Bangladeshi"
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
        helper: "Primary contact number"
      },
      duplicateCheck: {
        endpoint: "/api/v1/employees/check-phone",
        field: "phone",
        message: "Phone number already registered"
      }
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "employee@example.com",
      required: true,
      validation: {
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        customMessage: "Enter valid email address"
      },
      ui: {
        icon: "mail",
        helper: "Company email or personal email"
      },
      duplicateCheck: {
        endpoint: "/api/v1/employees/check-email",
        field: "email",
        message: "Email already registered"
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
        helper: "Emergency contact number"
      }
    },
    {
      name: "emergencyContact",
      label: "Emergency Contact Name",
      type: "text",
      placeholder: "Enter emergency contact",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50
      },
      ui: {
        icon: "phone-call",
        helper: "Person to contact in emergency"
      }
    },
    {
      name: "emergencyPhone",
      label: "Emergency Contact Phone",
      type: "tel",
      placeholder: "0181-345678",
      required: true,
      validation: {
        pattern: "^[0-9]{11}$"
      },
      ui: {
        icon: "phone"
      }
    },
    {
      name: "emergencyRelation",
      label: "Relationship",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "spouse", label: "Spouse" },
          { value: "parent", label: "Parent" },
          { value: "sibling", label: "Sibling" },
          { value: "friend", label: "Friend" },
          { value: "other", label: "Other" }
        ]
      },
      ui: {
        icon: "users"
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
      name: "presentAddress",
      label: "Present Address",
      type: "textarea",
      placeholder: "Enter present address...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        rows: 3
      }
    },
    {
      name: "permanentAddress",
      label: "Permanent Address",
      type: "textarea",
      placeholder: "Enter permanent address...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 200
      },
      ui: {
        icon: "map-pin",
        rows: 3
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

#### Section 4: Employment Information
```typescript
{
  section: "Employment Information",
  layout: "two-column",
  fields: [
    {
      name: "department",
      label: "Department",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/departments/active",
        displayField: "departmentName",
        valueField: "id",
        additionalFields: ["headOfDepartment", "location"]
      },
      ui: {
        icon: "building",
        searchable: true,
        helper: "Select department for this employee"
      }
    },
    {
      name: "designation",
      label: "Designation",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/designations/active",
        displayField: "title",
        valueField: "id",
        additionalFields: ["grade", "salaryRange"]
      },
      ui: {
        icon: "briefcase",
        searchable: true,
        helper: "Select job designation"
      }
    },
    {
      name: "reportingTo",
      label: "Reporting To",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/employees/active",
        queryParams: {
          department: "{department}"
        },
        dependsOn: "department",
        displayField: "fullName",
        valueField: "id",
        additionalFields: ["designation", "email"]
      },
      ui: {
        icon: "user",
        searchable: true,
        helper: "Select supervisor/manager"
      }
    },
    {
      name: "employmentType",
      label: "Employment Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "permanent", label: "Permanent" },
          { value: "contract", label: "Contract" },
          { value: "probation", label: "Probation" },
          { value: "intern", label: "Intern" },
          { value: "consultant", label: "Consultant" }
        ]
      },
      ui: {
        icon: "type"
      }
    },
    {
      name: "joiningDate",
      label: "Joining Date",
      type: "date",
      required: true,
      validation: {
        minDate: "today - 30 days",
        maxDate: "today + 30 days"
      },
      ui: {
        icon: "calendar"
      }
    },
    {
      name: "probationEndDate",
      label: "Probation End Date",
      type: "date",
      required: false,
      validation: {
        minDate: "joiningDate + 30 days"
      },
      conditional: {
        showWhen: {
          field: "employmentType",
          equals: "probation"
        }
      },
      ui: {
        icon: "calendar-check"
      }
    },
    {
      name: "workLocation",
      label: "Work Location",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/locations/office-locations",
        displayField: "locationName",
        valueField: "id"
      },
      ui: {
        icon: "map-pin"
      }
    },
    {
      name: "workShift",
      label: "Work Shift",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/work-shifts/active",
        displayField: "shiftName",
        valueField: "id",
        additionalFields: ["startTime", "endTime", "breakTime"]
      },
      ui: {
        icon: "clock"
      }
    }
  ]
}
```

#### Section 5: Salary Information
```typescript
{
  section: "Salary Information",
  layout: "two-column",
  fields: [
    {
      name: "basicSalary",
      label: "Basic Salary",
      type: "currency",
      placeholder: "৳ 0.00",
      required: true,
      validation: {
        min: 0,
        max: 500000
      },
      ui: {
        icon: "dollar-sign",
        prefix: "৳",
        helper: "Monthly basic salary"
      }
    },
    {
      name: "houseRent",
      label: "House Rent Allowance",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0,
        max: "basicSalary * 0.5"
      },
      ui: {
        icon: "home",
        prefix: "৳",
        helper: "Monthly house rent allowance",
        defaultValue: "basicSalary * 0.4"
      }
    },
    {
      name: "medicalAllowance",
      label: "Medical Allowance",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0,
        max: "basicSalary * 0.2"
      },
      ui: {
        icon: "heart-pulse",
        prefix: "৳",
        helper: "Monthly medical allowance",
        defaultValue: "basicSalary * 0.1"
      }
    },
    {
      name: "transportAllowance",
      label: "Transport Allowance",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0,
        max: "basicSalary * 0.15"
      },
      ui: {
        icon: "car",
        prefix: "৳",
        helper: "Monthly transport allowance",
        defaultValue: "basicSalary * 0.05"
      }
    },
    {
      name: "otherAllowances",
      label: "Other Allowances",
      type: "currency",
      placeholder: "৳ 0.00",
      required: false,
      validation: {
        min: 0,
        max: "basicSalary * 0.25"
      },
      ui: {
        icon: "plus-circle",
        prefix: "৳",
        helper: "Any other allowances"
      }
    },
    {
      name: "providentFund",
      label: "Provident Fund %",
      type: "percentage",
      placeholder: "10",
      required: false,
      validation: {
        min: 0,
        max: 25
      },
      ui: {
        icon: "piggy-bank",
        suffix: "%",
        helper: "Percentage of basic salary for PF",
        defaultValue: 10
      }
    },
    {
      name: "taxId",
      label: "Tax ID (TIN)",
      type: "text",
      placeholder: "Enter TIN",
      required: false,
      validation: {
        pattern: "^\\d{12}$",
        customMessage: "Enter 12-digit TIN"
      },
      ui: {
        icon: "percent"
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
        icon: "bank"
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
        helper: "Account for salary deposit"
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
        icon: "map-pin"
      }
    }
  ]
}
```

#### Section 6: Education & Experience
```typescript
{
  section: "Education & Experience",
  layout: "single-column",
  fields: [
    {
      name: "education",
      label: "Education",
      type: "dynamic-array",
      required: false,
      minItems: 0,
      maxItems: 5,
      fields: [
        {
          name: "degree",
          label: "Degree",
          type: "text",
          required: true
        },
        {
          name: "institution",
          label: "Institution",
          type: "text",
          required: true
        },
        {
          name: "year",
          label: "Year",
          type: "number",
          required: true
        },
        {
          name: "result",
          label: "Result/CGPA",
          type: "text",
          required: false
        }
      ],
      ui: {
        addButtonText: "Add Education",
        maxItems: 5
      }
    },
    {
      name: "experience",
      label: "Work Experience",
      type: "dynamic-array",
      required: false,
      minItems: 0,
      maxItems: 5,
      fields: [
        {
          name: "company",
          label: "Company",
          type: "text",
          required: true
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true
        },
        {
          name: "fromDate",
          label: "From Date",
          type: "date",
          required: true
        },
        {
          name: "toDate",
          label: "To Date",
          type: "date",
          required: false
        },
        {
          name: "currentlyWorking",
          label: "Currently Working",
          type: "checkbox",
          required: false
        }
      ],
      ui: {
        addButtonText: "Add Experience",
        maxItems: 5
      }
    }
  ]
}
```

#### Section 7: Documents & Photo
```typescript
{
  section: "Documents & Photo",
  layout: "single-column",
  fields: [
    {
      name: "profilePhoto",
      label: "Profile Photo",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 1,
        maxSize: "2MB",
        allowedTypes: ["image/jpeg", "image/png"]
      },
      ui: {
        icon: "image",
        multiple: false,
        preview: true,
        helper: "Upload passport size photo"
      }
    },
    {
      name: "nid",
      label: "National ID Card",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 2,
        maxSize: "5MB",
        allowedTypes: ["image/jpeg", "image/png", "application/pdf"]
      },
      ui: {
        icon: "credit-card",
        multiple: true,
        preview: false,
        helper: "Upload NID card (front and back)"
      }
    },
    {
      name: "cv",
      label: "CV/Resume",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 1,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      },
      ui: {
        icon: "file-text",
        multiple: false,
        preview: false,
        helper: "Upload CV/Resume"
      }
    },
    {
      name: "otherDocuments",
      label: "Other Documents",
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
        helper: "Upload certificates, experience letters, etc."
      }
    }
  ]
}
```

### Form Submission Flow

#### Employee ID Generation
```typescript
const generateEmployeeId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const lastId = await getLastEmployeeId(year);
  const nextNumber = String(lastId + 1).padStart(4, '0');
  return `EMP-${year}${nextNumber}`;
};
```

#### Salary Calculation
```typescript
const calculateTotalSalary = (salaryData: SalaryData): number => {
  const allowances = 
    (salaryData.houseRent || 0) +
    (salaryData.medicalAllowance || 0) +
    (salaryData.transportAllowance || 0) +
    (salaryData.otherAllowances || 0);
  
  return salaryData.basicSalary + allowances;
};
```

---

## 📝 Form 2: Leave Application Form

### Form Architecture
```typescript
interface LeaveFormArchitecture {
  formType: "modal";
  layout: "two-column";
  validation: "real-time";
  submission: "async";
  balanceCheck: true;
  approvalWorkflow: true;
}
```

### Form Structure Design

#### Section 1: Leave Information
```typescript
{
  section: "Leave Information",
  layout: "two-column",
  fields: [
    {
      name: "employee",
      label: "Employee",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/employees/active",
        displayField: "fullName",
        valueField: "id",
        additionalFields: ["department", "designation", "leaveBalance"]
      },
      ui: {
        icon: "user",
        searchable: true,
        helper: "Select employee applying for leave"
      }
    },
    {
      name: "leaveType",
      label: "Leave Type",
      type: "select",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/leave-types/active",
        displayField: "leaveName",
        valueField: "id",
        additionalFields: ["daysAllowed", "paidUnpaid", "requiresProof"]
      },
      ui: {
        icon: "calendar",
        helper: "Select type of leave"
      }
    },
    {
      name: "leaveFromDate",
      label: "From Date",
      type: "date",
      required: true,
      validation: {
        minDate: "today",
        maxDate: "today + 90 days"
      },
      ui: {
        icon: "calendar"
      }
    },
    {
      name: "leaveToDate",
      label: "To Date",
      type: "date",
      required: true,
      validation: {
        minDate: "leaveFromDate"
      },
      ui: {
        icon: "calendar-check"
      }
    },
    {
      name: "totalDays",
      label: "Total Days",
      type: "number",
      placeholder: "0",
      required: true,
      validation: {
        min: 0.5,
        max: 90,
        step: 0.5
      },
      ui: {
        icon: "clock",
        disabled: true,
        calculated: true,
        formula: "calculateDays(leaveFromDate, leaveToDate)"
      }
    },
    {
      name: "reason",
      label: "Reason for Leave",
      type: "textarea",
      placeholder: "Enter reason for leave...",
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

#### Section 2: Leave Balance Display
```typescript
{
  section: "Leave Balance",
  layout: "informational",
  fields: [
    {
      name: "leaveBalance",
      type: "information-display",
      displayFormat: "card",
      fields: [
        {
          label: "Total Allowed",
          value: "leaveType.daysAllowed",
          icon: "calendar"
        },
        {
          label: "Balance Before This",
          value: "employee.leaveBalance[leaveType]",
          icon: "minus-circle"
        },
        {
          label: "Applied Days",
          value: "totalDays",
          icon: "plus-circle"
        },
        {
          label: "Balance After",
          value: "employee.leaveBalance[leaveType] - totalDays",
          icon: "check-circle",
          highlight: true
        }
      ]
    }
  ]
}
```

#### Section 3: Supporting Documents
```typescript
{
  section: "Supporting Documents",
  layout: "single-column",
  conditional: {
    showWhen: {
      field: "leaveType",
      property: "requiresProof",
      equals: true
    }
  },
  fields: [
    {
      name: "supportingDocuments",
      label: "Supporting Documents",
      type: "file-upload",
      required: true,
      validation: {
        minFiles: 1,
        maxFiles: 3,
        maxSize: "5MB",
        allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
      },
      ui: {
        icon: "paperclip",
        multiple: true,
        preview: false,
        helper: "Upload medical certificate, travel documents, etc."
      }
    },
    {
      name: "contactDuringLeave",
      label: "Contact During Leave",
      type: "text",
      placeholder: "Enter contact number",
      required: false,
      validation: {
        pattern: "^[0-9]{11}$"
      },
      ui: {
        icon: "phone",
        helper: "Emergency contact during leave period"
      }
    }
  ]
}
```

---

## 📝 Form 3: Payroll Processing Form

### Form Architecture
```typescript
interface PayrollFormArchitecture {
  formType: "modal";
  layout: "single-column";
  validation: "real-time";
  submission: "async";
  batchProcessing: true;
  payslipGeneration: true;
}
```

### Form Structure Design

#### Section 1: Payroll Period
```typescript
{
  section: "Payroll Period",
  layout: "two-column",
  fields: [
    {
      name: "payrollMonth",
      label: "Payroll Month",
      type: "month",
      required: true,
      validation: {
        maxMonth: "current month"
      },
      ui: {
        icon: "calendar"
      }
    },
    {
      name: "payrollType",
      label: "Payroll Type",
      type: "select",
      required: true,
      options: {
        source: "static",
        data: [
          { value: "monthly", label: "Monthly Payroll" },
          { value: "bonus", label: "Bonus/Special Payroll" },
          { value: "final_settlement", label: "Final Settlement" }
        ]
      },
      ui: {
        icon: "type"
      }
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      required: false,
      options: {
        source: "api",
        endpoint: "/api/v1/departments/active",
        displayField: "departmentName",
        valueField: "id"
      },
      ui: {
        icon: "building",
        helper: "Leave empty for all departments"
      }
    },
    {
      name: "processDate",
      label: "Processing Date",
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

#### Section 2: Employee Selection
```typescript
{
  section: "Employee Selection",
  layout: "table",
  fields: [
    {
      name: "employees",
      type: "multiselect-table",
      required: true,
      options: {
        source: "api",
        endpoint: "/api/v1/employees/active",
        queryParams: {
          department: "{department}",
          payrollMonth: "{payrollMonth}"
        },
        dependsOn: ["department", "payrollMonth"],
        displayField: "fullName",
        valueField: "id",
        additionalFields: ["employeeId", "designation", "basicSalary", "lastPayrollDate"]
      },
      columns: [
        {
          header: "Select",
          field: "selected",
          type: "checkbox",
          width: "50px"
        },
        {
          header: "Employee ID",
          field: "employeeId",
          width: "100px"
        },
        {
          header: "Name",
          field: "fullName",
          width: "200px"
        },
        {
          header: "Designation",
          field: "designation",
          width: "150px"
        },
        {
          header: "Basic Salary",
          field: "basicSalary",
          width: "120px",
          format: "currency"
        },
        {
          header: "Last Payroll",
          field: "lastPayrollDate",
          width: "120px",
          format: "date"
        },
        {
          header: "Days Worked",
          field: "daysWorked",
          width: "100px",
          editable: true
        },
        {
          header: "Overtime Hours",
          field: "overtimeHours",
          width: "100px",
          editable: true
        }
      ],
      ui: {
        selectAll: true,
        showTotals: true
      }
    }
  ]
}
```

#### Section 3: Deductions & Adjustments
```typescript
{
  section: "Deductions & Adjustments",
  layout: "dynamic-table",
  fields: [
    {
      name: "adjustments",
      type: "dynamic-array",
      required: false,
      minItems: 0,
      maxItems: 10,
      fields: [
        {
          name: "employee",
          label: "Employee",
          type: "select",
          required: true,
          options: {
            source: "dynamic",
            from: "selectedEmployees"
          }
        },
        {
          name: "adjustmentType",
          label: "Type",
          type: "select",
          required: true,
          options: {
            source: "static",
            data: [
              { value: "deduction", label: "Deduction" },
              { value: "addition", label: "Addition" }
            ]
          }
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: {
            source: "static",
            data: [
              { value: "advance", label: "Salary Advance" },
              { value: "loan", label: "Loan Recovery" },
              { value: "absent", label: "Absent Deduction" },
              { value: "late", label: "Late Deduction" },
              { value: "bonus", label: "Special Bonus" },
              { value: "incentive", label: "Performance Incentive" },
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
          name: "description",
          label: "Description",
          type: "text",
          required: false
        }
      ],
      ui: {
        addButtonText: "Add Adjustment",
        tableLayout: true
      }
    }
  ]
}
```

#### Section 4: Processing Options
```typescript
{
  section: "Processing Options",
  layout: "single-column",
  fields: [
    {
      name: "generatePayslips",
      label: "Generate Payslips",
      type: "checkbox",
      required: false,
      defaultValue: true,
      ui: {
        helper: "Auto-generate payslips for all employees"
      }
    },
    {
      name: "sendEmail",
      label: "Send Email Notification",
      type: "checkbox",
      required: false,
      defaultValue: false,
      ui: {
        helper: "Send payslip to employee email"
      }
    },
    {
      name: "bankTransfer",
      label: "Initiate Bank Transfer",
      type: "checkbox",
      required: false,
      defaultValue: false,
      ui: {
        helper: "Initiate bank transfer for salary payment"
      }
    },
    {
      name: "notes",
      label: "Processing Notes",
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

## 🎯 Button Functionality Mapping

### Employees Page Buttons
```typescript
const employeePageButtons = {
  "Add Employee": {
    action: "openModal",
    modal: "EmployeeForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "View Profile": {
    action: "navigate",
    route: "/employees/:id",
    icon: "user",
    variant: "ghost",
    size: "small"
  },
  "Edit": {
    action: "openModal",
    modal: "EmployeeForm",
    mode: "edit",
    icon: "edit",
    variant: "ghost",
    size: "small"
  },
  "Attendance": {
    action: "navigate",
    route: "/employees/:id/attendance",
    icon: "calendar",
    variant: "ghost",
    size: "small"
  },
  "Payroll": {
    action: "navigate",
    route: "/employees/:id/payroll",
    icon: "dollar-sign",
    variant: "ghost",
    size: "small"
  },
  "Terminate": {
    action: "confirmAction",
    confirmation: "Are you sure you want to terminate this employee?",
    icon: "user-x",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "employee.status === 'active'"
  }
};
```

### Leave Page Buttons
```typescript
const leavePageButtons = {
  "Apply Leave": {
    action: "openModal",
    modal: "LeaveForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "Approve": {
    action: "approveLeave",
    icon: "check-circle",
    variant: "outline",
    size: "small",
    condition: "leave.status === 'pending'"
  },
  "Reject": {
    action: "rejectLeave",
    icon: "x-circle",
    variant: "ghost",
    size: "small",
    color: "danger",
    condition: "leave.status === 'pending'"
  },
  "View Details": {
    action: "navigate",
    route: "/leaves/:id",
    icon: "eye",
    variant: "ghost",
    size: "small"
  },
  "Leave Balance": {
    action: "navigate",
    route: "/employees/:id/leave-balance",
    icon: "bar-chart",
    variant: "ghost",
    size: "small"
  }
};
```

### Payroll Page Buttons
```typescript
const payrollPageButtons = {
  "Process Payroll": {
    action: "openModal",
    modal: "PayrollForm",
    icon: "plus",
    variant: "primary",
    size: "medium"
  },
  "View Payslip": {
    action: "openModal",
    modal: "PayslipViewer",
    icon: "file-text",
    variant: "ghost",
    size: "small",
    condition: "payroll.status === 'completed'"
  },
  "Download Payslip": {
    action: "downloadDocument",
    documentType: "payslip",
    icon: "download",
    variant: "ghost",
    size: "small",
    condition: "payroll.status === 'completed'"
  },
  "Send Email": {
    action: "sendEmail",
    icon: "mail",
    variant: "ghost",
    size: "small",
    condition: "payroll.status === 'completed'"
  },
  "Generate Report": {
    action: "generateReport",
    reportType: "payroll-report",
    icon: "file-text",
    variant: "outline",
    size: "medium"
  }
};
```

---

## 📊 Data Flow Architecture

### Employee Registration Data Flow
```
Personal Information → Contact Details → Address → Employment Details → Salary Structure → Education & Experience → Document Upload → Validation → Duplicate Check → Data Preparation → API Submission → Employee Creation → System Account Generation → Department Notification → Welcome Email
```

### Leave Application Data Flow
```
Employee Selection → Leave Type Selection → Date Range → Leave Duration Calculation → Balance Check → Reason Entry → Document Upload (if required) → Validation → API Submission → Leave Request → Manager Notification → Approval Workflow → Leave Balance Update → Calendar Update
```

### Payroll Processing Data Flow
```
Payroll Period Selection → Employee Selection → Attendance Data → Overtime Calculation → Allowances Calculation → Deductions Application → Tax Calculation → Net Salary Calculation → Payslip Generation → Bank Transfer Initiation → Email Notification → Payroll History Update → Financial Integration
```

---

## 🔗 Module Relationships

### Employees ↔ Department Relationship
```typescript
interface EmployeeDepartmentRelationship {
  type: "many-to-one";
  cascade: "restrict";
  foreignKey: "departmentId";
  constraints: {
    active: "Employees must belong to active department",
    head: "Only one head per department"
  };
}
```

### Employees ↔ Payroll Relationship
```typescript
interface EmployeePayrollRelationship {
  type: "one-to-many";
  cascade: "none";
  foreignKey: "employeeId";
  constraints: {
    period: "One payroll per employee per month",
    status: "Cannot process payroll for inactive employees"
  };
}
```

### Employees ↔ Leave Relationship
```typescript
interface EmployeeLeaveRelationship {
  type: "one-to-many";
  cascade: "none";
  foreignKey: "employeeId";
  constraints: {
    balance: "Leave days cannot exceed available balance",
    overlap: "Leave periods cannot overlap"
  };
}
```

### Employees ↔ Attendance Relationship
```typescript
interface EmployeeAttendanceRelationship {
  type: "one-to-many";
  cascade: "none";
  foreignKey: "employeeId";
  constraints: {
    uniqueness: "One attendance record per employee per day",
    timing: "Cannot modify attendance after payroll processing"
  };
}
```

---

## 🎨 UI Component Specifications

### Employee Card Component
```typescript
interface EmployeeCardProps {
  employee: Employee;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
  onAttendance: (id: string) => void;
  onPayroll: (id: string) => void;
}

const EmployeeCard = ({ employee, onViewProfile, onEdit, onAttendance, onPayroll }: EmployeeCardProps) => {
  return (
    <Card className="employee-card">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar src={employee.profilePhoto} alt={employee.fullName} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="employee-name">{employee.fullName}</h3>
                <p className="employee-designation">{employee.designation}</p>
              </div>
              <Badge variant={getStatusVariant(employee.status)}>
                {employee.status}
              </Badge>
            </div>
            <p className="employee-department">{employee.department}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <InfoRow icon="hash" label={employee.employeeId} />
          <InfoRow icon="mail" label={employee.email} />
          <InfoRow icon="phone" label={formatPhone(employee.phone)} />
          <InfoRow icon="calendar" label={`Joined: ${formatDate(employee.joiningDate)}`} />
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => onViewProfile(employee.id)} variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button onClick={() => onAttendance(employee.id)} variant="ghost" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Attendance
          </Button>
          <Button onClick={() => onPayroll(employee.id)} variant="ghost" size="sm">
            <DollarSign className="mr-2 h-4 w-4" /> Payroll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Leave Balance Component
```typescript
interface LeaveBalanceProps {
  employee: Employee;
  leaveTypes: LeaveType[];
}

const LeaveBalance = ({ employee, leaveTypes }: LeaveBalanceProps) => {
  return (
    <Card className="leave-balance">
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
        <CardDescription>Current leave balance for {employee.fullName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaveTypes.map(leaveType => (
            <div key={leaveType.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{leaveType.leaveName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {employee.leaveBalance[leaveType.id] || 0} / {leaveType.daysAllowed}
                </Badge>
                <Button onClick={() => applyLeave(employee.id, leaveType.id)} variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 📱 Responsive Design Breakpoints

```css
/* Employee Grid Responsive */
@media (min-width: 1024px) {
  .employee-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .employee-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .employee-grid {
    grid-template-columns: 1fr;
  }
  
  .attendance-calendar {
    font-size: 12px;
  }
  
  .payroll-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 🔒 Security & Validation Rules

### Employee Data Protection
```typescript
const employeeDataProtection = {
  encryption: {
    fields: ['nid', 'bankAccount', 'salary', 'phone', 'email'],
    algorithm: 'AES-256'
  },
  accessControl: {
    view: ['admin', 'hr-manager', 'department-head', 'self'],
    edit: ['admin', 'hr-manager'],
    delete: ['admin'],
    salary: ['admin', 'hr-manager', 'finance-manager']
  },
  auditLog: {
    events: ['EMPLOYEE_CREATED', 'EMPLOYEE_UPDATED', 'EMPLOYEE_TERMINATED', 'SALARY_UPDATED', 'LEAVE_APPLIED', 'LEAVE_APPROVED', 'PAYROLL_PROCESSED']
  }
};
```

### HR Security
```typescript
const hrSecurity = {
  validation: {
    salary: {
      maxAmount: 1000000, // Max 10 lakh per month
      maxChange: 0.2, // Max 20% change per revision
      approval: "Changes > 10% require approval"
    },
    leave: {
      maxDays: 90, // Max 90 days per leave request
      maxFrequency: "Max 2 leave requests per month"
    },
    payroll: {
      maxAmount: 10000000, // Max 1 crore per payroll batch
      maxEmployees: 100 // Max 100 employees per batch
    }
  },
  approvalLimits: {
    salary: { maxAmount: 500000, approvers: ['hr-manager', 'finance-manager'] },
    leave: { maxDays: 7, approvers: ['department-head'] },
    payroll: { maxAmount: 5000000, approvers: ['hr-manager', 'finance-manager', 'director'] }
  }
};
```

---

## 📈 Performance Optimization

### Employee Search Optimization
```typescript
const employeeSearchConfig = {
  debounceTime: 300,
  cacheResults: true,
  cacheTTL: 300000, // 5 minutes
  searchFields: ['fullName', 'employeeId', 'email', 'phone'],
  maxResults: 50,
  filters: ['department', 'designation', 'status', 'location']
};
```

### Payroll Calculation Caching
```typescript
const payrollCacheConfig = {
  keyGenerator: (month: string, department: string) => 
    `payroll-${month}-${department}`,
  ttl: 3600000, // 1 hour
  storage: 'memory'
};
```

---

## 🎯 Success Metrics

### HR Metrics
```typescript
const hrMetrics = {
  employeeRegistration: {
    targetTime: "10 minutes",
    targetErrorRate: "< 2%",
    targetSuccessRate: "> 98%"
  },
  leaveApplication: {
    targetTime: "3 minutes",
    targetErrorRate: "< 1%",
    targetSuccessRate: "> 99%"
  },
  payrollProcessing: {
    targetTime: "15 minutes",
    targetErrorRate: "< 1%",
    targetSuccessRate: "> 99%"
  }
};
```

---

## 📋 Testing Checklist

### Employee Form Testing
- [ ] Personal information validation
- [ ] Contact information validation
- [ ] Duplicate employee detection
- [ ] Department and designation selection
- [ ] Salary structure validation
- [ ] Education and experience entry
- [ ] Document upload (photo, NID, CV)
- [ ] Employee ID generation
- [ ] System account creation

### Leave Form Testing
- [ ] Employee selection and balance display
- [ ] Leave type selection
- [ ] Date range validation
- [ ] Leave duration calculation
- [ ] Balance availability check
- [ ] Document upload conditional display
- [ ] Approval workflow
- [ ] Leave balance update

### Payroll Form Testing
- [ ] Payroll period selection
- [ ] Employee selection (department-wise)
- [ ] Attendance data integration
- [ ] Overtime calculation
- [ ] Allowances and deductions
- [ ] Tax calculation
- [ ] Net salary calculation
- [ ] Payslip generation
- [ ] Bank transfer initiation
