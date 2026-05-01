import React, { useEffect, useState } from "react";
import { Building2, Plus, Search, MoreHorizontal, Users, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_COMPANIES = [
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
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "Starter",
    status: "active",
  });

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/companies`);
        const data = await response.json();

        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies(INITIAL_COMPANIES);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddCompany(e) {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const response = await fetch(`${apiUrl}/api/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          plan: form.plan,
          status: form.status,
        }),
      });

      const data = await response.json();

      console.log("Add company response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add company");
      }

      setCompanies((prev) => [data, ...prev]);

      setForm({ name: "", email: "", plan: "Starter", status: "active" });
      setOpen(false);

      setToast("Company added successfully");
      setTimeout(() => setToast(""), 2500);
    } catch (error) {
      console.error("Add company error:", error);
      setToast("Failed to add company");
      setTimeout(() => setToast(""), 2500);
    }
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto px-4 sm:px-6">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground text-sm">Manage all registered companies</p>
        </div>

        <Button onClick={() => setOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Loading companies...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No companies found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-secondary/20 transition-colors">
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
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" /> Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="w-4 h-4 mr-2" /> Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
            Loading companies...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
            No companies found
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id || c._id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                  </div>
                </div>

                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[c.status]}`}>
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Users</p>
                  <p className="text-foreground font-medium">{c.users}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="text-foreground font-medium">{c.plan}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="text-foreground font-medium">{c.joined}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Actions</p>
                  <p className="text-primary font-medium">View / Edit</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Add Company</h2>
              <p className="text-sm text-muted-foreground">
                Create a new company entry for the Super Admin panel.
              </p>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-3">
              <Input
                placeholder="Company Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm text-foreground"
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Trial">Trial</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm text-foreground"
              >
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </select>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  Add Company
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}