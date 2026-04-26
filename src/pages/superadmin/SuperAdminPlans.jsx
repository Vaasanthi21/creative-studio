import React, { useState } from "react";
import { Plus, Edit, Trash2, Check, X, DollarSign, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INITIAL_PLANS = [
  {
    id: 1,
    name: "Starter",
    price: 99,
    credits: 500,
    platforms: ["LinkedIn", "Instagram", "Facebook"],
    features: ["Text posts", "Image captions", "Basic analytics"],
    active: true,
  },
  {
    id: 2,
    name: "Pro",
    price: 299,
    credits: 1000,
    platforms: ["LinkedIn", "Instagram", "Facebook", "Twitter/X", "YouTube"],
    features: ["All content types", "Advanced analytics", "Priority support", "Team collaboration"],
    active: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 799,
    credits: 5000,
    platforms: ["All platforms"],
    features: ["Unlimited everything", "Custom AI training", "Dedicated support", "API access", "White-label options"],
    active: true,
  },
  {
    id: 4,
    name: "Trial",
    price: 0,
    credits: 100,
    platforms: ["LinkedIn", "Instagram"],
    features: ["Basic features only", "14 days limit"],
    active: true,
  },
];

export default function SuperAdminPlans() {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    credits: "",
    platforms: "",
    features: "",
  });

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        credits: plan.credits.toString(),
        platforms: plan.platforms.join(", "),
        features: plan.features.join(", "),
      });
    } else {
      setEditingPlan(null);
      setFormData({ name: "", price: "", credits: "", platforms: "", features: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // TODO: Wire to backend API
    const newPlan = {
      id: editingPlan ? editingPlan.id : Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      credits: parseInt(formData.credits),
      platforms: formData.platforms.split(",").map(p => p.trim()),
      features: formData.features.split(",").map(f => f.trim()),
      active: true,
    };

    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setPlans([...plans, newPlan]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    // TODO: Wire to backend API
    setPlans(plans.filter(p => p.id !== id));
  };

  const toggleActive = (id) => {
    // TODO: Wire to backend API
    setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Subscription Plans</h1>
          <p className="text-muted-foreground text-sm">Manage pricing tiers and features</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.active ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  plan.active 
                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                    : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                }`}>
                  {plan.active ? "Active" : "Inactive"}
                </span>
              </div>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Credits */}
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{plan.credits} credits/month</span>
              </div>

              {/* Platforms */}
              <div className="flex items-start gap-2 text-sm">
                <Layers className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Platforms:</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.platforms.map((platform, idx) => (
                      <span key={idx} className="text-xs bg-secondary px-2 py-0.5 rounded text-foreground">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">Features:</p>
                <ul className="space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleOpenDialog(plan)}
                >
                  <Edit className="w-3 h-3" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 gap-1 ${plan.active ? "text-yellow-400" : "text-green-400"}`}
                  onClick={() => toggleActive(plan.id)}
                >
                  {plan.active ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  {plan.active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan ? "Update the plan details" : "Add a new subscription tier"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Pro"
                />
              </div>
              <div className="space-y-2">
                <Label>Price ($/month)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Monthly Credits</Label>
              <Input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="1000"
              />
            </div>

            <div className="space-y-2">
              <Label>Platforms (comma-separated)</Label>
              <Input
                value={formData.platforms}
                onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
                placeholder="LinkedIn, Instagram, Facebook"
              />
            </div>

            <div className="space-y-2">
              <Label>Features (comma-separated)</Label>
              <Input
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Text posts, Image captions, Analytics"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
