"use client";

import { ArrowLeft, Info } from "lucide-react";
import { 
  getDestinationById, 
  getPropertiesByDestination, 
  getExperiencesByDestination,
  getUnitTypesByProperty,
  tourPackages 
} from "@/data/mock-data";
import { PropertyCard } from "@/components/traveler/property-card";
import { ExperienceCard } from "@/components/traveler/experience-card";
import { PackageCard } from "@/components/traveler/package-card";
import { SectionHeader } from "@/components/shared/section-header";

type DestinationScreenProps = {
  destinationId: string;
  onBack: () => void;
  onPackageClick: (pkgId: string) => void;
  onPropertyClick: (propId: string) => void;
};

export function DestinationScreen({ destinationId, onBack, onPackageClick, onPropertyClick }: DestinationScreenProps) {
  const destination = getDestinationById(destinationId);
  const properties = getPropertiesByDestination(destinationId);
  const experiences = getExperiencesByDestination(destinationId);
  const packages = tourPackages.filter(p => p.destinationId === destinationId);

  if (!destination) {
    return <div className="p-4">Destination not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 lg:h-80">
        <img 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white/80 text-sm">{destination.region}</p>
          <h1 className="text-white text-3xl font-bold">{destination.name}</h1>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-8 max-w-6xl mx-auto">
        {/* Description */}
        <div className="pt-6">
          <p className="text-muted-foreground">{destination.description}</p>
        </div>

        {/* Facts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {destination.facts.map((fact, i) => (
            <div key={i} className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{fact.label}</p>
              <p className="font-semibold mt-0.5">{fact.value}</p>
            </div>
          ))}
        </div>

        {/* Packages */}
        {packages.length > 0 && (
          <section>
            <SectionHeader title="Packages" description="All-inclusive travel experiences" />
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  onClick={() => onPackageClick(pkg.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Properties */}
        {properties.length > 0 && (
          <section>
            <SectionHeader title="Where to Stay" description={`Accommodation in ${destination.name}`} />
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {properties.map((prop) => (
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

        {/* Experiences */}
        {experiences.length > 0 && (
          <section>
            <SectionHeader title="Experiences" description="Activities and tours" />
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
              {experiences.map((exp) => (
                <ExperienceCard 
                  key={exp.id} 
                  experience={exp}
                  className="w-48 flex-shrink-0"
                />
              ))}
            </div>
          </section>
        )}

        {/* Travel Tips */}
        <section className="bg-blue-50 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Travel Tips</h3>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>- Best visited during {destination.facts.find(f => f.label === 'Best Season')?.value || 'summer months'}</li>
                <li>- Bring warm layers, temperatures drop at night</li>
                <li>- Cash is recommended, limited ATM access</li>
                <li>- Book accommodation in advance during peak season</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
