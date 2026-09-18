import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, DollarSign, Building2, Download, Filter } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Reports = () => {
  const navigate = useNavigate();

  const quickActions = [
    { icon: FileText, title: "Trial Balance", description: "View account balances", path: "/reports/trial-balance" },
    { icon: TrendingUp, title: "Profit & Loss", description: "Financial performance report", path: "/reports/profit-loss" },
    { icon: DollarSign, title: "Balance Sheet", description: "Assets and liabilities summary", path: "/reports/balance-sheet" },
    { icon: Building2, title: "Sales Report", description: "Sales and revenue analysis", path: "/reports/sales-report" },
  ];

  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-text-primary">Reports</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
              <p className="text-sm text-text-secondary mt-1">Generate and view financial and operational reports</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="border-card-border hover:border-accent-emerald transition-colors cursor-pointer" onClick={() => navigate(action.path)}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-emerald/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-emerald" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{action.title}</p>
                      <p className="text-xs text-text-secondary">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;
