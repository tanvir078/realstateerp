import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, User, Phone, Mail, MapPin, Building2, 
  Calendar, DollarSign, CreditCard, CheckCircle2
} from "lucide-react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeData) => void;
  initialEmployee?: Partial<EmployeeData>;
  mode?: "add" | "edit";
}

interface EmployeeData {
  fullName: string;
  fatherName: string;
  phone: string;
  email: string;
  nid: string;
  emergencyContact: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: "PERMANENT" | "PROBATIONARY" | "CONTRACTUAL";
  assignedLocation: "HEAD_OFFICE" | string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  siteAllowance: number;
  bankName: string;
  accountNumber: string;
  mobileBanking: string;
}

export default function AddEmployeeModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialEmployee,
  mode = "add",
}: AddEmployeeModalProps) {
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [employmentType, setEmploymentType] = useState<"PERMANENT" | "PROBATIONARY" | "CONTRACTUAL">("PERMANENT");
  const [assignedLocation, setAssignedLocation] = useState("HEAD_OFFICE");
  const [basicSalary, setBasicSalary] = useState("");
  const [houseRent, setHouseRent] = useState("");
  const [medicalAllowance, setMedicalAllowance] = useState("");
  const [siteAllowance, setSiteAllowance] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mobileBanking, setMobileBanking] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setFullName(initialEmployee?.fullName ?? "");
    setPhone(initialEmployee?.phone ?? "");
    setDepartment(initialEmployee?.department ?? "");
    setDesignation(initialEmployee?.designation ?? "");
    setJoiningDate(initialEmployee?.joiningDate ?? new Date().toISOString().split('T')[0]);
    setBasicSalary(initialEmployee?.basicSalary?.toString() ?? "");
    setHouseRent(initialEmployee?.houseRent?.toString() ?? "");
    setMedicalAllowance(initialEmployee?.medicalAllowance?.toString() ?? "");
    setSiteAllowance(initialEmployee?.siteAllowance?.toString() ?? "");
  }, [initialEmployee, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const data: EmployeeData = {
      fullName,
      fatherName,
      phone,
      email,
      nid,
      emergencyContact,
      department,
      designation,
      joiningDate,
      employmentType,
      assignedLocation,
      basicSalary: parseFloat(basicSalary),
      houseRent: parseFloat(houseRent),
      medicalAllowance: parseFloat(medicalAllowance),
      siteAllowance: parseFloat(siteAllowance),
      bankName,
      accountNumber,
      mobileBanking
    };
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{mode === "edit" ? "Edit Employee" : "Add New Employee"}</h2>
              <p className="text-xs text-[#829B96]">{mode === "edit" ? "Update live employee master data" : "Register head office or site staff"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Personal Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white border-b border-[#1E3E37] pb-2">Personal Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#10B981]" /> Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#10B981]" /> Father's Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter father's name"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#10B981]" /> Phone <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 01711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#10B981]" /> Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#10B981]" /> NID Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="13-digit NID"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#10B981]" /> Emergency Contact
                </label>
                <input
                  type="text"
                  placeholder="Emergency contact number"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>
          </div>

          {/* Job Profile */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white border-b border-[#1E3E37] pb-2">Job Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Department <span className="text-rose-400">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                  required
                >
                  <option value="">Select department</option>
                  <option value="Administration & Operations">Administration & Operations</option>
                  <option value="Finance and Accounting">Finance and Accounting</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Sales">Sales</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Site Management">Site Management</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#10B981]" /> Designation <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Site Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Joining Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Employment Type <span className="text-rose-400">*</span>
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                  required
                >
                  <option value="PERMANENT">Permanent</option>
                  <option value="PROBATIONARY">Probationary</option>
                  <option value="CONTRACTUAL">Contractual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Posting & Site Assignment */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white border-b border-[#1E3E37] pb-2">Posting / Site Assignment</h3>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#10B981]" /> Assigned Location <span className="text-rose-400">*</span>
              </label>
              <select
                value={assignedLocation}
                onChange={(e) => setAssignedLocation(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="HEAD_OFFICE">Head Office</option>
                <option value="GREEN_VALLEY_SITE">Sardar Green Valley Site</option>
                <option value="GRAND_HEIGHTS_SITE">Sardar Grand Heights Site</option>
                <option value="CITY_VISTA_SITE">City Vista Plaza Site</option>
              </select>
            </div>
          </div>

          {/* Salary & Bank Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white border-b border-[#1E3E37] pb-2">Salary & Bank Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Basic Salary (৳) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 45,000"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> House Rent (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 18,000"
                  value={houseRent}
                  onChange={(e) => setHouseRent(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Medical Allowance (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5,000"
                  value={medicalAllowance}
                  onChange={(e) => setMedicalAllowance(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-[#10B981]" /> Site Allowance (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 7,000"
                  value={siteAllowance}
                  onChange={(e) => setSiteAllowance(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dutch-Bangla Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-[#10B981]" /> Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104-110-1234567"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#10B981]" /> Mobile Banking (bKash/Nagad)
                </label>
                <input
                  type="text"
                  placeholder="Mobile number"
                  value={mobileBanking}
                  onChange={(e) => setMobileBanking(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3E37]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:bg-[#1A3530] hover:text-white text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {mode === "edit" ? "Save Changes" : "Register Employee"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
