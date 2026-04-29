"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { currentPartner, properties, unitTypes, inventoryDaily } from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PartnerInventoryScreen() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const partnerProperties = properties.filter(p => p.partnerId === currentPartner.id);
  
  // Get unit types for selected property or all partner properties
  const relevantUnitTypes = selectedProperty 
    ? unitTypes.filter(u => u.propertyId === selectedProperty)
    : unitTypes.filter(u => partnerProperties.some(p => p.id === u.propertyId));

  // Generate dates for display
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date('2024-07-15');
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Inventory & Rates" 
        description="Manage availability and pricing by date"
      />

      {/* Property Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedProperty === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedProperty(null)}
        >
          All Properties
        </Button>
        {partnerProperties.map((prop) => (
          <Button
            key={prop.id}
            variant={selectedProperty === prop.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedProperty(prop.id)}
          >
            {prop.name}
          </Button>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium">July 15 - July 21, 2024</span>
        <Button variant="outline" size="sm">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Inventory Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">
                  Unit Type
                </th>
                {dates.map((date) => {
                  const d = new Date(date);
                  return (
                    <th key={date} className="px-2 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                      <div>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="font-bold text-foreground">{d.getDate()}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {relevantUnitTypes.map((unit) => {
                const property = partnerProperties.find(p => p.id === unit.propertyId);
                
                return (
                  <tr key={unit.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{unit.name}</p>
                      <p className="text-xs text-muted-foreground">{property?.name}</p>
                    </td>
                    {dates.map((date) => {
                      const inv = inventoryDaily.find(
                        i => i.unitTypeId === unit.id && i.date === date
                      );
                      const available = inv?.available ?? 5;
                      const retailRate = inv?.retailRate ?? unit.basePrice;
                      const netRate = inv?.netRate ?? Math.round(unit.basePrice * 0.8);
                      const stopSell = inv?.stopSell ?? false;

                      return (
                        <td key={date} className={cn(
                          "px-2 py-3 text-center",
                          stopSell && "bg-red-50"
                        )}>
                          <div className={cn(
                            "text-sm font-medium",
                            available === 0 ? "text-red-600" : available < 3 ? "text-amber-600" : "text-emerald-600"
                          )}>
                            {available}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(retailRate / 1000).toFixed(1)}k
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            net: {(netRate / 1000).toFixed(1)}k
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-600" />
          <span className="text-muted-foreground">Available (3+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-600" />
          <span className="text-muted-foreground">Low (1-2)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600" />
          <span className="text-muted-foreground">Sold Out (0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
          <span className="text-muted-foreground">Stop Sell</span>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-medium mb-4">Bulk Update</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Date Range</label>
            <input 
              type="text" 
              defaultValue="Jul 15 - Jul 21"
              className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Retail Rate</label>
            <input 
              type="number" 
              placeholder="6000"
              className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Available Units</label>
            <input 
              type="number" 
              placeholder="5"
              className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full">Apply Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
