import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, DollarSign, Eye, FileText, Layers, MapPin, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AddProjectModal from "@/components/forms/AddProjectModal";
import {
  EmptyState,
  InlineAlert,
  LoadingState,
  PageContainer,
  PageHeader,
  QuickActionGrid,
  SectionCard,
  StatCard,
  StatGrid,
  StatusBadge,
  type QuickAction,
} from "@/components/page";
import { formatMoney } from "@/lib/format";
import { createProject, getProjectFinancialSummary, getProjects } from "@/services/projects.service";

const quickActions: QuickAction[] = [
  {
    title: "All Projects",
    description: "Browse and manage every development",
    icon: Building2,
    route: "/projects/all",
    tone: "success",
  },
  {
    title: "Unit Management",
    description: "Inventory, pricing and allocation",
    icon: Layers,
    route: "/projects/units",
    tone: "info",
  },
  {
    title: "Construction Progress",
    description: "Milestones and site photos",
    icon: TrendingUp,
    route: "/projects/progress",
    tone: "warning",
  },
  {
    title: "Project Documents",
    description: "Agreements and approvals",
    icon: FileText,
    route: "/projects/documents",
    tone: "default",
  },
];

const Projects = () => {
  const navigate = useNavigate();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [financialSummaries, setFinancialSummaries] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedProjects = await getProjects();
      setProjects(loadedProjects);

      // Financial summaries are per-project endpoints; resolve them together so a
      // single failing project does not blank the whole dashboard.
      const settled = await Promise.allSettled(
        loadedProjects.map((project: any) => getProjectFinancialSummary(project.id)),
      );
      setFinancialSummaries(
        Object.fromEntries(
          loadedProjects.map((project: any, index: number) => [
            project.id,
            settled[index].status === "fulfilled" ? settled[index].value : null,
          ]),
        ),
      );
    } catch (reason: any) {
      setError(reason?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const units = projects.flatMap((project) => project.units || []);
  const summaryValues = Object.values(financialSummaries);
  const sum = (key: string) => summaryValues.reduce((total, item: any) => total + Number(item?.[key] || 0), 0);

  const stats = {
    totalProjects: projects.length,
    ongoing: projects.filter((project) => project.status === "ONGOING").length,
    completed: projects.filter((project) => project.status === "COMPLETED").length,
    totalUnits: units.length,
    availableUnits: units.filter((unit) => unit.status === "AVAILABLE").length,
    soldUnits: units.filter((unit) => unit.status === "SOLD").length,
    averageProgress: projects.length
      ? Math.round(
          projects.reduce((total, project) => total + Number(project.constructionProgress || 0), 0) / projects.length,
        )
      : 0,
    revenue: sum("revenue"),
    collected: sum("collected"),
    cost: sum("totalCost"),
  };

  const recentProjects = projects.slice(0, 5);

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Projects & Property" }]}
        title="Projects & Property"
        description="Portfolio position across every residential and commercial development."
        actions={
          <Button size="sm" onClick={() => setIsAddProjectModalOpen(true)}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            New Project
          </Button>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <StatGrid columns={5}>
        <StatCard
          label="Total Projects"
          value={stats.totalProjects}
          hint={`${stats.ongoing} ongoing · ${stats.completed} completed`}
          icon={Building2}
          tone="success"
        />
        <StatCard
          label="Total Units"
          value={stats.totalUnits}
          hint={`${stats.availableUnits} available · ${stats.soldUnits} sold`}
          icon={Layers}
          tone="info"
        />
        <StatCard
          label="Total Revenue"
          value={formatMoney(stats.revenue, { compact: true })}
          hint={`${formatMoney(stats.collected, { compact: true })} collected`}
          icon={DollarSign}
          tone="success"
        />
        <StatCard
          label="Total Cost"
          value={formatMoney(stats.cost, { compact: true })}
          hint="Vendor bills and RA bills"
          icon={DollarSign}
          tone="warning"
        />
        <StatCard
          label="Avg Progress"
          value={`${stats.averageProgress}%`}
          hint="Weighted across active sites"
          icon={TrendingUp}
          tone="success"
          emphasiseValue
        />
      </StatGrid>

      <QuickActionGrid actions={quickActions} />

      <SectionCard
        title="Recent Projects"
        description="Latest project status and completion"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/projects/all")}>
            View all
          </Button>
        }
        padded={false}
      >
        {loading ? (
          <LoadingState message="Loading projects…" />
        ) : recentProjects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start tracking units, costs and progress."
            icon={Building2}
            action={
              <Button size="sm" onClick={() => setIsAddProjectModalOpen(true)}>
                <Plus aria-hidden="true" className="h-4 w-4" />
                New Project
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-card-border">
            {recentProjects.map((project) => {
              const projectUnits = project.units || [];
              const sold = projectUnits.filter((unit: any) => unit.status === "SOLD").length;
              const progress = Number(project.constructionProgress || 0);
              return (
                <li key={project.id} className="px-4 py-4 transition-colors hover:bg-background-secondary/50 sm:px-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] text-accent-emerald">{project.projectCode}</span>
                        <h3 className="truncate text-sm font-semibold text-text-primary">{project.projectName}</h3>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin aria-hidden="true" className="h-3 w-3" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers aria-hidden="true" className="h-3 w-3" />
                          {projectUnits.length} units
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye aria-hidden="true" className="h-3 w-3" />
                          {sold} sold
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:shrink-0">
                      <div className="text-right">
                        <p className="text-base font-semibold text-accent-emerald">{progress}%</p>
                        <p className="text-[10px] text-text-secondary">Progress</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/projects/view/${project.id}`)}>
                        <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background-secondary">
                    <div className="h-full rounded-full bg-accent-emerald transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onSave={async (data) => {
          try {
            await createProject(data);
            setIsAddProjectModalOpen(false);
            await load();
          } catch (reason: any) {
            setError(reason?.message || "Failed to create project");
          }
        }}
      />
    </PageContainer>
  );
};

export default Projects;
