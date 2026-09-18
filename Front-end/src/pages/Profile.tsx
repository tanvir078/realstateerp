import { Mail, ShieldCheck, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getStoredUser } from "@/lib/access";

const Profile = () => {
  const user = getStoredUser();

  return (
    <div className="w-full space-y-6 p-4 text-text-primary lg:p-8">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">View your account and access details.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader className="flex-row items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-emerald text-xl font-semibold text-white">
            {user?.name?.charAt(0) ?? "U"}
          </div>
          <div>
            <CardTitle>{user?.name ?? "User"}</CardTitle>
            <p className="mt-1 text-sm text-text-secondary">{user?.role ?? "User"}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-card-border bg-background-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-text-secondary"><Mail aria-hidden="true" className="h-4 w-4" /> Email</div>
            <p className="break-words text-sm font-medium">{user?.email ?? "Not available"}</p>
          </div>
          <div className="rounded-lg border border-card-border bg-background-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-text-secondary"><ShieldCheck aria-hidden="true" className="h-4 w-4" /> Access role</div>
            <p className="text-sm font-medium">{user?.role ?? "Not available"}</p>
          </div>
          <div className="rounded-lg border border-card-border bg-background-secondary p-4 sm:col-span-2">
            <div className="mb-2 flex items-center gap-2 text-text-secondary"><UserCircle aria-hidden="true" className="h-4 w-4" /> Account status</div>
            <p className="text-sm font-medium text-accent-emerald">Active</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
