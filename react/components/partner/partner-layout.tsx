"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Package, 
  BookOpen, 
  Share2, 
  Star, 
  Bell,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { currentPartner } from "@/data/mock-data";

type PartnerLayoutProps = {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'inventory', label: 'Inventory & Rates', icon: Calendar },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'bookings', label: 'Bookings', icon: BookOpen },
  { id: 'channels', label: 'Channels', icon: Share2 },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function PartnerLayout({ children, activePage, onPageChange }: PartnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-semibold">Partner Dashboard</h1>
        <div className="w-6" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card">
            <div className="flex items-center justify-between h-14 px-4 border-b border-border">
              <h1 className="font-semibold">Nomad Core</h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      activePage === item.id 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <h1 className="font-semibold">Nomad Core</h1>
          <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">Partner</span>
        </div>
        
        {/* Partner Info */}
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium">{currentPartner.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{currentPartner.type.replace('_', ' ')}</p>
          {currentPartner.verified && (
            <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
              Verified
            </span>
          )}
        </div>

        <nav className="flex-1 p-2 overflow-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activePage === item.id 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
