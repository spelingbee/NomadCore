"use client";

import { User, Mail, Phone, Globe, ChevronRight, LogOut, Settings, HelpCircle, Bell } from "lucide-react";
import { currentCustomer } from "@/data/mock-data";
import { Button } from "@/components/ui/button";

export function ProfileScreen() {
  return (
    <div className="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold mt-4">{currentCustomer.name}</h1>
        <p className="text-sm text-muted-foreground">{currentCustomer.email}</p>
      </div>

      {/* Profile Info */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        <div className="p-4 flex items-center gap-3">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{currentCustomer.email}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm">{currentCustomer.phone}</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Nationality</p>
            <p className="text-sm">{currentCustomer.nationality}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 bg-card border border-border rounded-xl divide-y divide-border">
        <button className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">Notifications</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">Help & Support</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <div className="mt-6">
        <Button variant="outline" className="w-full" size="lg">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Demo Notice */}
      <p className="text-xs text-muted-foreground text-center mt-8">
        This is a demo profile. No real authentication is implemented.
      </p>
    </div>
  );
}
