import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";

const Investors = () => {
  const navigate = useNavigate();

  const quickActions = [
    { icon: Users, title: "Investor Profiles", description: "Manage investor information", path: "/investors/profiles" },
    { icon: TrendingUp, title: "Equity Share", description: "Track equity distribution", path: "/investors/equity-share" },
    { icon: Wallet, title: "Payout Schedule", description: "Manage investor payouts", path: "/investors/payout-schedule" },
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
                <span className="text-text-primary">Investors</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Investors</h1>
              <p className="text-sm text-text-secondary mt-1">Manage investor relationships and investments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default Investors;
