"use client";

import { useState } from "react";
import { TravelerApp } from "@/components/traveler/traveler-app";
import { PartnerApp } from "@/components/partner/partner-app";
import { AdminApp } from "@/components/admin/admin-app";
import { ModeSwitcher, type AppMode } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import { Mountain, Compass, Building2, Shield, ArrowRight, Globe, Users, TrendingUp } from "lucide-react";

function LandingPage({ onSelectMode }: { onSelectMode: (mode: AppMode) => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mountain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">Nomad Core</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</a>
          </nav>
          <Button onClick={() => onSelectMode("traveler")}>
            Explore Kyrgyzstan
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Globe className="h-4 w-4" />
                Tourism Operating System
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
                Discover the Heart of Central Asia
              </h1>
              <p className="text-lg text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
                Nomad Core connects travelers, tourism partners, and government stakeholders 
                to showcase Kyrgyzstan&apos;s breathtaking landscapes, rich culture, and unforgettable experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={() => onSelectMode("traveler")} className="gap-2">
                  Start Exploring
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onSelectMode("partner")}>
                  Partner with Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "7", label: "UNESCO Sites", icon: Globe },
                { value: "50+", label: "Destinations", icon: Compass },
                { value: "200+", label: "Tourism Partners", icon: Building2 },
                { value: "500K+", label: "Annual Visitors", icon: Users },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User Types */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">One Platform, Three Perspectives</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nomad Core serves everyone in the tourism ecosystem with tailored experiences and tools.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  mode: "traveler" as const,
                  icon: Compass,
                  title: "For Travelers",
                  description: "Discover destinations, book unique experiences, and plan your perfect Kyrgyzstan adventure.",
                  features: ["Browse 50+ destinations", "Book stays & experiences", "Create travel packages", "Leave reviews"],
                  color: "teal",
                },
                {
                  mode: "partner" as const,
                  icon: Building2,
                  title: "For Partners",
                  description: "Manage your tourism business with powerful tools for properties, bookings, and analytics.",
                  features: ["Property management", "Real-time bookings", "Revenue analytics", "Channel distribution"],
                  color: "blue",
                },
                {
                  mode: "admin" as const,
                  icon: Shield,
                  title: "For Government",
                  description: "Oversee national tourism development with comprehensive data and partner management.",
                  features: ["Tourism analytics", "Partner oversight", "Infrastructure tracking", "Policy insights"],
                  color: "amber",
                },
              ].map((item) => (
                <button
                  key={item.mode}
                  onClick={() => onSelectMode(item.mode)}
                  className={`group text-left p-6 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1`}
                >
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-4 ${
                    item.color === "teal" ? "bg-teal-100 dark:bg-teal-900/30" :
                    item.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" :
                    "bg-amber-100 dark:bg-amber-900/30"
                  }`}>
                    <item.icon className={`h-6 w-6 ${
                      item.color === "teal" ? "text-teal-600 dark:text-teal-400" :
                      item.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                      "text-amber-600 dark:text-amber-400"
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Enter {item.title.split(" ")[1]} View
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Kyrgyzstan?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Whether you&apos;re planning a trip, managing a tourism business, or overseeing national tourism development, 
              Nomad Core has the tools you need.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => onSelectMode("traveler")}
                className="gap-2"
              >
                <Compass className="h-4 w-4" />
                Explore as Traveler
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onSelectMode("partner")}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                <Building2 className="h-4 w-4" />
                Partner Dashboard
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              <span className="font-semibold">Nomad Core</span>
              <span className="text-muted-foreground text-sm">- Tourism Operating System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A unified platform for Kyrgyzstan tourism development
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<AppMode | null>(null);

  if (!mode) {
    return <LandingPage onSelectMode={setMode} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mode Switcher Header */}
      <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setMode(null)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Mountain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold">Nomad Core</span>
          </button>
          <ModeSwitcher currentMode={mode} onModeChange={setMode} />
        </div>
      </div>

      {/* App Content */}
      {mode === "traveler" && <TravelerApp />}
      {mode === "partner" && <PartnerApp />}
      {mode === "admin" && <AdminApp />}
    </div>
  );
}
