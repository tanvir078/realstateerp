import { ShieldAlert } from "lucide-react";

const AccessDenied = () => (
  <div className="flex min-h-[60vh] items-center justify-center p-8">
    <div className="max-w-md text-center">
      <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-status-danger" />
      <h1 className="text-2xl font-bold text-text-primary">Access denied</h1>
      <p className="mt-2 text-text-secondary">
        Your assigned role does not have permission to access this module.
      </p>
    </div>
  </div>
);

export default AccessDenied;
