import { useEffect, useState } from "react";
import { Plus, Search, Eye, Edit, Mail, Phone, Building2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { createInvestor, getInvestors } from "../../services/investors.service";
import InvestorActionModal from "../../components/forms/InvestorActionModal";

const InvestorProfiles = () => {
  const [investors, setInvestors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  useEffect(() => { getInvestors().then(setInvestors); }, []);
  const saveInvestor = async (data: any) => { const created = await createInvestor(data); setInvestors((current) => [created, ...current]); setModal(false); };
  const visibleInvestors = investors.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="bg-background-primary">
      <div className="border-b border-card-border bg-card-surface">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span>Investors</span>
                <span>/</span>
                <span className="text-text-primary">Investor Profiles</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Investor Profiles</h1>
              <p className="text-sm text-text-secondary mt-1">Manage investor information and relationships</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <Input placeholder="Search investors..." className="pl-10 w-64" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <Button size="sm" className="gap-2" onClick={() => setModal(true)}>
                <Plus className="w-4 h-4" />
                Add Investor
              </Button>
            </div>
            {modal && <InvestorActionModal mode="investor" onClose={() => setModal(false)} onSave={saveInvestor} />}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Total Investors</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{investors.length}</p>
              <p className="text-xs text-text-secondary mt-1">Active: {investors.filter((item) => item.status === "ACTIVE").length}</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Corporate</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{investors.filter((item) => item.type === "CORPORATE").length}</p>
              <p className="text-xs text-text-secondary mt-1">Live records</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Individual</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{investors.filter((item) => item.type === "INDIVIDUAL").length}</p>
              <p className="text-xs text-text-secondary mt-1">Live records</p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-accent-emerald" />
                <p className="text-sm text-text-secondary">Institutional</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{investors.filter((item) => item.type === "INSTITUTIONAL").length}</p>
              <p className="text-xs text-text-secondary mt-1">Live records</p>
            </CardContent>
          </Card>
        </div>

        {/* Investors Table */}
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Investor Directory</CardTitle>
            <CardDescription>Complete investor profiles and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total Investment</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleInvestors.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell className="font-medium">{investor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{investor.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="w-3 h-3" />
                          {investor.contact}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                          <Mail className="w-3 h-3" />
                          {investor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{investor.address}</TableCell>
                    <TableCell className="text-right">{investor.totalInvestment}</TableCell>
                    <TableCell className="text-right">{investor.roi}</TableCell>
                    <TableCell>{investor.projects}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          investor.status === 'ACTIVE' ? 'success' : 
                          investor.status === 'PENDING' ? 'warning' : 'outline'
                        }
                      >
                        {investor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{investor.joined}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
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

export default InvestorProfiles;
