import React from "react";
import { CreditCard, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

const BILLING = [
  { company: "Uden Tech", plan: "Pro", amount: "$299/mo", status: "paid", next: "May 1, 2026" },
  { company: "Brandify Co.", plan: "Starter", amount: "$99/mo", status: "paid", next: "May 5, 2026" },
  { company: "Nova Labs", plan: "Trial", amount: "$0", status: "trial", next: "Ends Apr 30, 2026" },
  { company: "Pixel Works", plan: "Pro", amount: "$299/mo", status: "paid", next: "May 12, 2026" },
  { company: "MarkNet", plan: "Trial", amount: "$0", status: "overdue", next: "Trial ended" },
];

const statusStyles = {
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  trial: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATS = [
  { label: "Monthly Revenue", value: "$2,790", icon: DollarSign },
  { label: "Active Subscriptions", value: "10", icon: CreditCard },
  { label: "Revenue Growth", value: "+18%", icon: TrendingUp },
  { label: "Overdue / Suspended", value: "2", icon: AlertCircle },
];

export default function SuperAdminBilling() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground text-sm">Revenue and subscription overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Billing Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">Subscription Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Company</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Plan</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Amount</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Next Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BILLING.map((b) => (
                <tr key={b.company} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{b.company}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{b.plan}</td>
                  <td className="px-5 py-3.5 text-foreground">{b.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{b.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}