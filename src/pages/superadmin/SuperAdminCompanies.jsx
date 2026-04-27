import React, { useState } from "react";
import { Building2, Plus, Search, MoreHorizontal, Users, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/api/supabaseClient";

const COMPANIES = [
  { id: 1, name: "Uden Tech", email: "admin@udentech.com", users: 42, plan: "Pro", status: "active", joined: "Jan 2024" },
  { id: 2, name: "Brandify Co.", email: "admin@brandify.com", users: 18, plan: "Starter", status: "active", joined: "Feb 2024" },
  { id: 3, name: "Nova Labs", email: "admin@novalabs.io", users: 7, plan: "Trial", status: "trial", joined: "Apr 2024" },
  { id: 4, name: "Pixel Works", email: "hello@pixelworks.com", users: 31, plan: "Pro", status: "active", joined: "Mar 2024" },
  { id: 5, name: "MarkNet", email: "ops@marknet.io", users: 3, plan: "Trial", status: "suspended", joined: "Apr 2024" },
];

const statusStyles = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  trial: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SuperAdminCompanies() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState(COMPANIES);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactPerson: "",
    plan: "Starter",
  });

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual backend API call
      // For now, simulate adding to local state
      const newCompany = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        users: 1,
        plan: formData.plan,
        status: "active",
        joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      setCompanies([...companies, newCompany]);
      
      toast({
        title: "Company created",
        description: `${formData.name} has been added successfully`,
      });

      setFormData({ name: "", email: "", contactPerson: "", plan: "Starter" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      // TODO: Replace with actual backend API call
      setCompanies(
        companies.map((c) =>
          c.id === companyId ? { ...c, status: newStatus } : c
        )
      );

      toast({
        title: "Status updated",
        description: `Company has been ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground text-sm">Manage all registered companies</p>
        </div>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Company</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Users</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Plan</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" /> {c.users}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground">{c.plan}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.joined}</td>
                  <td className="px-5 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Building2 className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" /> View Users
                        </DropdownMenuItem>
                        {c.status !== "active" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(c.id, "active")}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Activate
                          </DropdownMenuItem>
                        )}
                        {c.status !== "suspended" && (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(c.id, "suspended")}>
                            <Ban className="w-4 h-4 mr-2" /> Suspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Company Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Company</DialogTitle>
            <DialogDescription>
              Add a new company to the platform
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Acme Corporation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Admin Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Subscription Plan</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter - $99/month</SelectItem>
                  <SelectItem value="Pro">Pro - $299/month</SelectItem>
                  <SelectItem value="Enterprise">Enterprise - $799/month</SelectItem>
                  <SelectItem value="Trial">Trial - Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Company"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}