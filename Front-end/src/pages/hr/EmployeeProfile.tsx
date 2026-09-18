import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployees } from "@/services/hr.service";

export default function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getEmployees().then((employees) => setEmployee(employees.find((item: any) => item.id === id) ?? null)).catch((reason) => setError(reason.message));
  }, [id]);
  if (error) return <p className="text-sm text-rose-400">{error}</p>;
  if (!employee) return <p className="text-sm text-[#829B96]">Employee profile not found.</p>;
  const monthlyGross = Number(employee.basicSalary) + Number(employee.houseRent) + Number(employee.medicalAllowance) + Number(employee.siteAllowance);
  return (
    <div className="w-full space-y-6 text-[#E2E8F0]">
      <header className="border-b border-[#1E3E37] pb-4"><h1 className="text-2xl font-bold text-white">{employee.fullName}</h1><p className="mt-1 font-mono text-xs text-[#10B981]">{employee.employeeId}</p></header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-5 text-sm"><h2 className="font-semibold text-white">Employee information</h2><p>Phone: {employee.phone}</p><p>Department: {employee.department}</p><p>Designation: {employee.designation}</p><p>Joining date: {employee.joiningDate}</p><p>Status: <span className="text-emerald-400">{employee.status}</span></p></div>
        <div className="space-y-3 rounded-xl border border-[#1E3E37] bg-[#112421] p-5 text-sm"><h2 className="font-semibold text-white">Payroll information</h2><p>Basic salary: ৳ {Number(employee.basicSalary).toLocaleString("en-BD")}</p><p>Allowances: ৳ {(monthlyGross - Number(employee.basicSalary)).toLocaleString("en-BD")}</p><p className="font-semibold text-white">Monthly gross: ৳ {monthlyGross.toLocaleString("en-BD")}</p><Link to="/hr/payroll" className="inline-block text-[#10B981]">Open payroll</Link></div>
      </div>
      <Link to="/hr/employees" className="inline-block rounded-lg border border-[#1E3E37] px-4 py-2 text-xs text-white">Back to employees</Link>
    </div>
  );
}
