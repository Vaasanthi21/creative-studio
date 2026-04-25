import React from "react";
import { Building2, Users, CreditCard, TrendingUp, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  { label: "Total Companies", value: "12", icon: Building2, change: "+2 this month" },
  { label: "Total Users", value: "348", icon: Users, change: "+24 this month" },
  { label: "Active Subscriptions", value: "10", icon: CreditCard, change: "2 trials" },
  { label: "Generations This Month", value: "9,241", icon: TrendingUp, change: "+18% vs last month" },
];

const RECENT_COMPANIES = [
  { name: "Uden Tech", users: 42, plan: "Pro", status: "active" },
  { name: "Brandify Co.", users: 18, plan: "Starter", status: "active" },
  { name: "Nova Labs", users: 7, plan: "Trial", status: "trial" },
  { name: "Pixel Works", users: 31, plan: "Pro", status: "active" },
  { name: "MarkNet", users: 3, plan: "Trial", status: "suspended" },
];

const statusStyles = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  trial: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground text-sm">Platform-wide metrics across all companies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Recent Companies */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Recent Companies</h2>
          </div>
          <Link to="/superadmin/companies" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-border">
          {RECENT_COMPANIES.map((c) => (
            <div key={c.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.users} users</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{c.plan}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[c.status]}`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}