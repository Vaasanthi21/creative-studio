import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/AuthContext";
import {
  Moon,
  Sun,
  Key,
  Users,
  CreditCard,
  BarChart3,
  HelpCircle,
  Info,
  LogOut,
  Eye,
  EyeOff,
  ExternalLink,
  Building2,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const maskedKey = "sk-••••••••••••••••••••••4f2e";

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    toast({ title: `Theme is always dark in this version`, duration: 1500 });
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
      <h2 className="text-lg font-display font-bold text-foreground">Settings</h2>

      {/* Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleToggleTheme} className="gap-2">
              {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {darkMode ? "Dark" : "Light"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">API Key</p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                {showApiKey ? "sk-proj-abc123def456ghi789jkl0mn4f2e" : maskedKey}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm text-foreground">{user?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
            <Badge className="text-[10px]">Owner</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Current Plan</p>
              <p className="text-xs text-muted-foreground">Full access to all features</p>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/30 text-[10px]">
              Pro
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">Generations this month</p>
            <span className="text-lg font-display font-bold text-foreground">
              {generationsThisMonth}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            Help & Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm gap-2 h-9">
            <ExternalLink className="w-3.5 h-3.5" /> Documentation
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm gap-2 h-9">
            <ExternalLink className="w-3.5 h-3.5" /> Support
          </Button>
          <Separator className="my-2" />
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="w-3 h-3" /> Version
            </span>
            <span className="text-xs text-muted-foreground font-mono">1.0.0</span>
          </div>
        </CardContent>
      </Card>

      {/* Switch Company */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Switch Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Sign out of your current company account and log in as a different company user.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Uden Tech</p>
              <p className="text-xs text-muted-foreground">{user?.email || "current session"}</p>
            </div>
            <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
            onClick={handleLogout}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Sign Out & Switch Company
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            After signing out, log in with the other company's credentials
          </p>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
        onClick={() => setLogoutConfirm(true)}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>

      <ConfirmDialog
        open={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign out?"
        description="You'll need to sign in again to access the studio."
        confirmLabel="Sign Out"
        destructive
      />
    </div>
  );
}