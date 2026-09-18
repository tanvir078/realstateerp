export type UserRole =
  | "ADMIN"
  | "ACCOUNTING_MANAGER"
  | "ACCOUNTANT"
  | "CASHIER"
  | "VIEWER";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const modulePrefixes: Record<Exclude<UserRole, "ADMIN" | "VIEWER">, string[]> = {
  ACCOUNTING_MANAGER: ["/dashboard", "/accounting", "/reports", "/settings"],
  ACCOUNTANT: ["/dashboard", "/accounting", "/reports"],
  CASHIER: ["/dashboard", "/accounting/cash-bank"],
};

export const getStoredUser = (): StoredUser | null => {
  const value = localStorage.getItem("current_user");
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    localStorage.removeItem("current_user");
    return null;
  }
};

export const canAccessPath = (role: UserRole | undefined, path: string) => {
  if (!role) return false;
  if (path === "/profile" || path.startsWith("/profile/")) return true;
  if (path === "/settings/user-roles" || path.startsWith("/settings/user-roles/")) {
    return role === "ADMIN";
  }
  if (role === "ADMIN" || role === "VIEWER") return true;
  return modulePrefixes[role].some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
};

export const canManageUsers = (role: UserRole | undefined) => role === "ADMIN";
