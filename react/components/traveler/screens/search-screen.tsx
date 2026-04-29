"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { destinations, properties, tourPackages, getUnitTypesByProperty } from "@/data/mock-data";
import { DestinationCard } from "@/components/traveler/destination-card";
import { PropertyCard } from "@/components/traveler/property-card";
import { PackageCard } from "@/components/traveler/package-card";
import { FilterChip } from "@/components/shared/badges";
import { SectionHeader } from "@/components/shared/section-header";

type SearchScreenProps = {
  onDestinationClick: (destId: string) => void;
  onPackageClick: (pkgId: string) => void;
  onPropertyClick: (propId: string) => void;
};

const filters = ['All', 'Destinations', 'Properties', 'Packages'];

export function SearchScreen({ onDestinationClick, onPackageClick, onPropertyClick }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.region.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.type.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPackages = tourPackages.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const showDestinations = activeFilter === 'All' || activeFilter === 'Destinations';
  const showProperties = activeFilter === 'All' || activeFilter === 'Properties';
  const showPackages = activeFilter === 'All' || activeFilter === 'Packages';

  return (
    <div className="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-6xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, stays, packages..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
        {filters.map((filter) => (
          <FilterChip 
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      {/* Results */}
      <div className="space-y-8">
        {showDestinations && filteredDestinations.length > 0 && (
          <section>
            <SectionHeader title="Destinations" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredDestinations.map((dest) => (
                <DestinationCard 
                  key={dest.id}
                  destination={dest}
                  variant="compact"
                  onClick={() => onDestinationClick(dest.id)}
                />
              ))}
            </div>
          </section>
        )}

        {showPackages && filteredPackages.length > 0 && (
          <section>
            <SectionHeader title="Packages" />
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPackages.map((pkg) => (
                <PackageCard 
                  key={pkg.id}
                  pkg={pkg}
                  onClick={() => onPackageClick(pkg.id)}
                />
              ))}
            </div>
          </section>
        )}

        {showProperties && filteredProperties.length > 0 && (
          <section>
            <SectionHeader title="Properties" />
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProperties.map((prop) => (
                <PropertyCard 
                  key={prop.id}
                  property={prop}
                  unitTypes={getUnitTypesByProperty(prop.id)}
                  onClick={() => onPropertyClick(prop.id)}
                />
              ))}
            </div>
          </section>
        )}

        {query && filteredDestinations.length === 0 && filteredProperties.length === 0 && filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
