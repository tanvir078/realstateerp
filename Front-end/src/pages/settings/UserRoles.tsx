import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Shield, Edit, Trash2, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import apiClient from "../../services/api/axios";

const UserRoles = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { apiClient.get("/users").then((response) => setUsers(response.data)); }, []);
  const roles = useMemo(() => [...new Set(users.map((user) => user.role))].map((role) => ({
    name: role,
    description: role === "ADMIN" ? "Full system access and control" : "Role-based ERP access",
    users: users.filter((user) => user.role === role).length,
    permissions: [role],
    status: "Active",
  })), [users]);
  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span>Settings</span>
                <span>/</span>
                <span className="text-text-primary">User Roles</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">User Roles & Permissions</h1>
              <p className="text-sm text-text-secondary mt-1">Manage user roles and access control</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Role
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Roles</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{roles.length}</p>
              <p className="text-xs text-text-secondary mt-1">Live roles</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Users</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{users.length}</p>
              <p className="text-xs text-text-secondary mt-1">Live users</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Active Sessions</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">12</p>
              <p className="text-xs text-text-secondary mt-1">Currently logged in</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Pending Requests</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">3</p>
              <p className="text-xs text-text-secondary mt-1">Role changes pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Roles Table */}
        <Card className="border-card-border mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>System roles and their access levels</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input placeholder="Search roles..." className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.name}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-sm text-text-secondary">{role.description}</TableCell>
                    <TableCell>{role.users}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((perm, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{role.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-status-danger">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>System users and their role assignments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-text-secondary">{user.email}</TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'outline'}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">-</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserRoles;
