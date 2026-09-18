import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-emerald">404</p>
        <h1 className="mt-3 text-3xl font-bold text-text-primary">Page not found</h1>
        <p className="mt-3 text-sm text-text-secondary">
          The page you requested does not exist or may have moved. Use the dashboard or go back to continue.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go Back
          </Button>
          <Button asChild className="gap-2">
            <Link to="/dashboard">
              <Home className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}