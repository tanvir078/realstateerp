import { Save, Building2, Phone, Mail, MapPin, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const CompanyProfile = () => {
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
                <span className="text-text-primary">Company Profile</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Company Profile</h1>
              <p className="text-sm text-text-secondary mt-1">Manage company information and settings</p>
            </div>
            <Button size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Company details and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Company Name</label>
                <Input defaultValue="Sobhagya PropOps ERP Ltd" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Trade License Number</label>
                <Input defaultValue="TRN-123456789" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Tax Identification Number (TIN)</label>
                <Input defaultValue="TIN-987654321" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Business Type</label>
                <select className="w-full h-9 rounded-md border border-card-border bg-background-secondary px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-emerald">
                  <option>Real Estate Development</option>
                  <option>Construction</option>
                  <option>Property Management</option>
                  <option>Investment</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Establishment Date</label>
                <Input type="date" defaultValue="2015-01-15" />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Company contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input defaultValue="info@sobhagya.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input defaultValue="+880 2-12345678" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input defaultValue="+880 1712-345678" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input defaultValue="www.sobhagya.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input defaultValue="Dhaka, Bangladesh" className="pl-10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Company financial details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Currency</label>
                <select className="w-full h-9 rounded-md border border-card-border bg-background-secondary px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-emerald">
                  <option>৳ Bangladeshi Taka (BDT)</option>
                  <option>$ US Dollar (USD)</option>
                  <option>€ Euro (EUR)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Financial Year Start</label>
                <select className="w-full h-9 rounded-md border border-card-border bg-background-secondary px-3 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-emerald">
                  <option>January</option>
                  <option>April</option>
                  <option>July</option>
                  <option>October</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Bank Name</label>
                <Input defaultValue="Dutch-Bangla Bank Ltd" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Account Number</label>
                <Input defaultValue="1234567890" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Routing Number</label>
                <Input defaultValue="090260321" />
              </div>
            </CardContent>
          </Card>

          {/* Logo & Branding */}
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>Company visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Company Logo</label>
                <div className="border-2 border-dashed border-card-border rounded-lg p-8 text-center">
                  <Building2 className="w-12 h-12 mx-auto text-text-secondary mb-2" />
                  <p className="text-sm text-text-secondary mb-2">Drag and drop logo here</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Brand Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded bg-accent-emerald" />
                  <Input defaultValue="#10B981" className="w-32" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Tagline</label>
                <Input defaultValue="Building Dreams, Creating Reality" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Company Description</label>
                <textarea 
                  className="w-full h-24 rounded-md border border-card-border bg-background-secondary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-emerald resize-none"
                  defaultValue="Sobhagya PropOps ERP is a leading real estate development company specializing in residential and commercial properties in Bangladesh."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <Card className="border-card-border mt-6">
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>Other company configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Enable Multi-Currency</p>
                <p className="text-sm text-text-secondary">Allow transactions in multiple currencies</p>
              </div>
              <div className="w-12 h-6 bg-background-secondary rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-text-secondary rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Enable Multi-Language</p>
                <p className="text-sm text-text-secondary">Support multiple languages in the system</p>
              </div>
              <div className="w-12 h-6 bg-accent-emerald rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Auto-Backup</p>
                <p className="text-sm text-text-secondary">Automatically backup data daily</p>
              </div>
              <div className="w-12 h-6 bg-accent-emerald rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyProfile;
