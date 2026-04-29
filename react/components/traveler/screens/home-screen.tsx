"use client";

import { Search, ChevronRight } from "lucide-react";
import { destinations, tourPackages, properties, getUnitTypesByProperty } from "@/data/mock-data";
import { DestinationCard } from "@/components/traveler/destination-card";
import { PackageCard } from "@/components/traveler/package-card";
import { PropertyCard } from "@/components/traveler/property-card";
import { FilterChip } from "@/components/shared/badges";

type HomeScreenProps = {
  onDestinationClick: (destId: string) => void;
  onPackageClick: (pkgId: string) => void;
  onPropertyClick: (propId: string) => void;
};

const categories = ['All', 'Yurts', 'Guest Houses', 'Rest Points', 'National Parks', 'Experiences'];

export function HomeScreen({ onDestinationClick, onPackageClick, onPropertyClick }: HomeScreenProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-muted to-background px-4 pt-12 pb-8 lg:pt-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-balance">
            Discover Kyrgyzstan
          </h1>
          <p className="text-muted-foreground mt-2 text-balance">
            Alpine lakes, nomadic culture, and mountain adventures await
          </p>
          
          {/* Search Bar */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Where do you want to go?"
              className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-8 max-w-6xl mx-auto">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((cat, i) => (
            <FilterChip key={cat} label={cat} active={i === 0} />
          ))}
        </div>

        {/* Featured Destinations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Destinations</h2>
            <button className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {destinations.map((dest) => (
              <DestinationCard 
                key={dest.id} 
                destination={dest} 
                variant="compact"
                onClick={() => onDestinationClick(dest.id)}
              />
            ))}
          </div>
        </section>

        {/* Featured Package */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Popular Packages</h2>
            <button className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tourPackages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                onClick={() => onPackageClick(pkg.id)}
              />
            ))}
          </div>
        </section>

        {/* Recommended Properties */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recommended for You</h2>
            <button className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {properties.slice(0, 4).map((prop) => (
              <PropertyCard 
                key={prop.id} 
                property={prop}
                unitTypes={getUnitTypesByProperty(prop.id)}
                onClick={() => onPropertyClick(prop.id)}
              />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">How Nomad Core Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto text-lg font-bold">
                1
              </div>
              <h3 className="font-medium mt-3">Discover</h3>
              <p className="text-sm text-muted-foreground mt-1">Browse destinations, yurts, and curated packages</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto text-lg font-bold">
                2
              </div>
              <h3 className="font-medium mt-3">Book</h3>
              <p className="text-sm text-muted-foreground mt-1">Reserve with verified local partners instantly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto text-lg font-bold">
                3
              </div>
              <h3 className="font-medium mt-3">Experience</h3>
              <p className="text-sm text-muted-foreground mt-1">Enjoy authentic Kyrgyz hospitality</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
