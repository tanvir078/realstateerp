import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AddEmployeeModal from "@/components/forms/AddEmployeeModal";
import { createEmployee, getEmployees, updateEmployee } from "@/services/hr.service";

type Employee = {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  siteAllowance: number;
  status: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => getEmployees().then(setEmployees).catch((reason) => setError(reason.message));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => employees.filter((employee) => {
    const query = search.toLowerCase();
    return (employee.fullName.toLowerCase().includes(query) ||
      employee.employeeId.toLowerCase().includes(query) ||
      employee.designation.toLowerCase().includes(query)) &&
      (department === "ALL" || employee.department === department);
  }), [employees, search, department]);

  const save = async (data: any) => {
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        joiningDate: data.joiningDate,
        basicSalary: data.basicSalary,
        houseRent: data.houseRent,
        medicalAllowance: data.medicalAllowance,
        siteAllowance: data.siteAllowance,
      };
      if (editing) {
        await updateEmployee(editing.id, payload);
      } else {
        await createEmployee(payload);
      }
      setEditing(null);
      setOpen(false);
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  };

  const deactivate = async (employee: Employee) => {
    try {
      await updateEmployee(employee.id, { ...employee, status: "INACTIVE" });
      await load();
    } catch (reason: any) {
      setError(reason.message);
    }
  };

  const departments = [...new Set(employees.map((employee) => employee.department))];
  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <header className="flex items-center justify-between border-b border-[#1E3E37] pb-4">
        <div><h1 className="text-2xl font-bold text-white">Employee Directory</h1><p className="text-xs text-[#829B96]">Live employee master data</p></div>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-slate-950"><Plus className="h-4 w-4" />Add Employee</button>
      </header>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs text-[#829B96]">Total employees</p><p className="mt-1 flex items-center gap-2 text-xl font-bold text-white"><Users className="h-5 w-5 text-[#10B981]" />{employees.length}</p></div>
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs text-[#829B96]">Active employees</p><p className="mt-1 text-xl font-bold text-emerald-400">{employees.filter((employee) => employee.status === "ACTIVE").length}</p></div>
        <div className="rounded-xl border border-[#1E3E37] bg-[#112421] p-4"><p className="text-xs text-[#829B96]">Monthly gross salary</p><p className="mt-1 text-xl font-bold text-white">৳ {employees.reduce((sum, employee) => sum + Number(employee.basicSalary) + Number(employee.houseRent) + Number(employee.medicalAllowance) + Number(employee.siteAllowance), 0).toLocaleString("en-BD")}</p></div>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-3 md:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#829B96]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee..." className="w-full rounded-lg border border-[#1E3E37] bg-[#0B1816] py-2 pl-9 pr-3 text-xs text-white" /></div>
        <label className="flex items-center gap-2 text-xs text-[#829B96]"><Filter className="h-3.5 w-3.5" /><select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-lg border border-[#1E3E37] bg-[#0B1816] p-2 text-white"><option value="ALL">All departments</option>{departments.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#1E3E37] bg-[#112421]"><table className="w-full text-left text-xs"><thead className="border-b border-[#1E3E37] text-[#829B96]"><tr>{["Employee ID", "Name", "Department", "Designation", "Joining date", "Basic salary", "Status", "Action"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#1E3E37]">{filtered.map((employee) => <tr key={employee.id}>      <td className="p-3 font-mono"><Link to={`/hr/employee-profile/${employee.id}`} className="text-[#10B981] hover:underline">{employee.employeeId}</Link></td><td className="p-3 text-white">{employee.fullName}<span className="block text-[#829B96]">{employee.phone}</span></td><td className="p-3 text-[#829B96]">{employee.department}</td><td className="p-3 text-white">{employee.designation}</td><td className="p-3 text-[#829B96]">{employee.joiningDate}</td><td className="p-3 text-white">৳ {Number(employee.basicSalary).toLocaleString("en-BD")}</td><td className="p-3 text-emerald-400">{employee.status}</td><td className="p-3"><button onClick={() => { setEditing(employee); setOpen(true); }} className="mr-3 text-sky-400">Edit</button>{employee.status === "ACTIVE" && <button onClick={() => deactivate(employee)} className="text-rose-400">Deactivate</button>}</td></tr>)}{!filtered.length && <tr><td colSpan={8} className="p-10 text-center text-[#829B96]">No employees found.</td></tr>}</tbody></table></div>
      <AddEmployeeModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={save} initialEmployee={editing ?? undefined} mode={editing ? "edit" : "add"} />
    </div>
  );
}
