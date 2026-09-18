import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const PlaceholderPage = ({ title, description }: { title: string; description?: string }) => {
  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">
              This page is under development. The {title} module will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaceholderPage;
