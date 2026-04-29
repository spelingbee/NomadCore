"use client";

import { cn } from "@/lib/utils";
import { Home, Search, Calendar, User } from "lucide-react";

type TravelerLayoutProps = {
  children: React.ReactNode;
  activeTab?: 'home' | 'search' | 'bookings' | 'profile';
  onTabChange?: (tab: 'home' | 'search' | 'bookings' | 'profile') => void;
};

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'search' as const, label: 'Search', icon: Search },
  { id: 'bookings' as const, label: 'Bookings', icon: Calendar },
  { id: 'profile' as const, label: 'Profile', icon: User },
];

export function TravelerLayout({ children, activeTab = 'home', onTabChange }: TravelerLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Header - hidden on mobile */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 bg-card border-b border-border z-40 h-14 items-center px-6 justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-semibold">Nomad Core</h1>
          <nav className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}

export function MobileTopBar({ title, onBack }: { title?: string; onBack?: () => void }) {
  return (
    <header className="sticky top-0 bg-card/95 backdrop-blur border-b border-border z-30 lg:hidden">
      <div className="flex items-center h-14 px-4">
        {onBack && (
          <button onClick={onBack} className="mr-3 text-muted-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
    </header>
  );
}
