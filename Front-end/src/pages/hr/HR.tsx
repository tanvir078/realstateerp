import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Calendar, CheckCircle2, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  EmptyState,
  InlineAlert,
  PageContainer,
  PageHeader,
  QuickActionGrid,
  SectionCard,
  StatCard,
  StatGrid,
  type QuickAction,
} from "@/components/page";
import { formatMoney } from "@/lib/format";
import { getAttendance, getEmployees, getPayroll } from "@/services/hr.service";

const quickActions: QuickAction[] = [
  { title: "Employee Directory", description: "Records, roles and profiles", icon: Users, route: "/hr/employees", tone: "success" },
  { title: "Attendance & Leave", description: "Daily attendance and requests", icon: Calendar, route: "/hr/attendance", tone: "info" },
  { title: "Payroll & Payslips", description: "Process salary and payslips", icon: DollarSign, route: "/hr/payroll", tone: "warning" },
  { title: "Loans & Performance", description: "Advances and appraisals", icon: Award, route: "/hr/loans-performance", tone: "default" },
];

const HR = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getEmployees(), getAttendance(), getPayroll()])
      .then(([staff, records, runs]) => {
        setEmployees(staff);
        setAttendance(records);
        setPayroll(runs);
      })
      .catch((reason: any) => setError(reason?.message || "Failed to load HR data"));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const stats = useMemo(
    () => ({
      totalEmployees: employees.length,
      activeEmployees: employees.filter((employee) => employee.status === "ACTIVE").length,
      presentToday: attendance.filter((record) => record.date === today && record.status === "PRESENT").length,
      onLeave: attendance.filter((record) => record.date === today && record.status === "ON_LEAVE").length,
      totalPayroll: payroll.reduce((sum, run) => sum + Number(run.netPayable || 0), 0),
      pendingSalaries: payroll.filter((run) => run.status === "POSTED" || run.status === "PARTIAL").length,
    }),
    [employees, attendance, payroll, today],
  );

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "HR & Payroll" }]}
        title="HR & Payroll"
        description="Headcount, daily attendance and payroll position."
        actions={
          <Button size="sm" onClick={() => navigate("/hr/employees")}>
            <Users aria-hidden="true" className="h-4 w-4" />
            Manage Employees
          </Button>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <StatGrid>
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          hint={`${stats.activeEmployees} active`}
          icon={Users}
          tone="success"
        />
        <StatCard
          label="Present Today"
          value={stats.presentToday}
          hint={`${stats.onLeave} on leave`}
          icon={CheckCircle2}
          tone="success"
          emphasiseValue
        />
        <StatCard
          label="Total Payroll"
          value={formatMoney(stats.totalPayroll, { compact: true })}
          hint="Net payable across runs"
          icon={DollarSign}
          tone="warning"
        />
        <StatCard
          label="Pending Disbursement"
          value={stats.pendingSalaries}
          hint="Payroll runs awaiting payment"
          icon={Award}
          tone={stats.pendingSalaries > 0 ? "danger" : "default"}
          emphasiseValue
          onClick={() => navigate("/hr/payroll")}
        />
      </StatGrid>

      <QuickActionGrid actions={quickActions} />

      <SectionCard title="HR Activity" description="Recent audit events for people operations">
        <EmptyState
          title="No activity events"
          description="Attendance, leave and payroll events will appear here once the audit feed is enabled."
          icon={Calendar}
        />
      </SectionCard>
    </PageContainer>
  );
};

export default HR;
