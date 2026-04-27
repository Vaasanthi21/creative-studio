import React, { useState } from "react";
import { Search, MoreHorizontal, UserX, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@udentech.com", company: "Uden Tech", role: "admin", status: "active", joined: "Jan 2024" },
  { id: 2, name: "Bob Martin", email: "bob@udentech.com", company: "Uden Tech", role: "user", status: "active", joined: "Feb 2024" },
  { id: 3, name: "Carol Lee", email: "carol@brandify.com", company: "Brandify Co.", role: "admin", status: "active", joined: "Feb 2024" },
  { id: 4, name: "Dan Wu", email: "dan@novalabs.io", company: "Nova Labs", role: "user", status: "trial", joined: "Apr 2024" },
  { id: 5, name: "Eva Torres", email: "eva@pixelworks.com", company: "Pixel Works", role: "admin", status: "active", joined: "Mar 2024" },
  { id: 6, name: "Frank Osei", email: "frank@marknet.io", company: "MarkNet", role: "user", status: "suspended", joined: "Apr 2024" },
];

const statusStyles = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  trial: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SuperAdminUsers() {
  const [search, setSearch] = useState("");

  const filtered = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm">All users across all companies</p>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">User</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Company</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Role</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground">{u.company}</td>

                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 text-xs font-medium ${u.role === "admin" ? "text-primary" : "text-muted-foreground"}`}>
                        {u.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[u.status]}`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground">{u.joined}</td>

                    <td className="px-5 py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserCheck className="w-4 h-4 mr-2" /> Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="w-4 h-4 mr-2" /> Suspend
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

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
            No users found
          </div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                    {u.name[0]}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                </div>

                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${statusStyles[u.status]}`}>
                  {u.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="text-foreground font-medium truncate">{u.company}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className={`font-medium ${u.role === "admin" ? "text-primary" : "text-foreground"}`}>
                    {u.role}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="text-foreground font-medium">{u.joined}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Actions</p>
                  <p className="text-primary font-medium">Activate / Suspend</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}