"use client";

import { Plus, Package, Clock, Edit } from "lucide-react";
import { currentPartner, tourPackages, getDestinationById, formatPrice } from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";

export function PartnerPackagesScreen() {
  const partnerPackages = tourPackages.filter(p => p.partnerId === currentPartner.id);

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Packages" 
        description="Create and manage tour packages"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Package
          </Button>
        }
      />

      {/* Packages List */}
      <div className="space-y-4">
        {partnerPackages.map((pkg) => {
          const destination = getDestinationById(pkg.destinationId);

          return (
            <div 
              key={pkg.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-64 aspect-video lg:aspect-auto">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Package</span>
                      </div>
                      <h3 className="font-semibold text-lg mt-1">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{destination?.name}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{pkg.description}</p>

                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {pkg.duration}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {pkg.items.map((item, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                        {item.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Retail Price</p>
                      <p className="font-semibold">{formatPrice(pkg.retailPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Net Price</p>
                      <p className="font-semibold">{formatPrice(pkg.netPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Margin</p>
                      <p className="font-semibold text-emerald-600">
                        {Math.round((1 - pkg.netPrice / pkg.retailPrice) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {partnerPackages.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-medium mt-4">No packages yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first package to bundle accommodations, activities, and services.
            </p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
          </div>
        )}
      </div>

      {/* Package Builder Preview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Package Builder</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop items to create a new package. Combine unit types, services, and experiences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[150px]">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accommodation</p>
            <p className="text-sm text-muted-foreground mt-2">Drop unit types here</p>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[150px]">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Services</p>
            <p className="text-sm text-muted-foreground mt-2">Drop services here</p>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[150px]">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experiences</p>
            <p className="text-sm text-muted-foreground mt-2">Drop experiences here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
