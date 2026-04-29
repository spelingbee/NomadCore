"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Share2, 
  Lightbulb,
  Landmark,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

type AdminLayoutProps = {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'destinations', label: 'Destination Analytics', icon: Map },
  { id: 'infrastructure', label: 'Infrastructure Usage', icon: Building2 },
  { id: 'partners', label: 'Partner Analytics', icon: Landmark },
  { id: 'channels', label: 'Channel Analytics', icon: Share2 },
  { id: 'insights', label: 'AI Insights', icon: Lightbulb },
];

export function AdminLayout({ children, activePage, onPageChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-semibold">Government Dashboard</h1>
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
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Gov</span>
        </div>
        
        {/* Admin Info */}
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium">Ministry of Tourism</p>
          <p className="text-xs text-muted-foreground">Kyrgyz Republic</p>
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
