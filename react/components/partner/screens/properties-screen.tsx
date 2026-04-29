"use client";

import { useState } from "react";
import { Plus, Star, MapPin, Edit, MoreVertical } from "lucide-react";
import { currentPartner, properties, getDestinationById, getUnitTypesByProperty, getServicesByProperty } from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/modal";
import { Tabs } from "@/components/shared/tabs";
import { cn } from "@/lib/utils";

export function PartnerPropertiesScreen() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const partnerProperties = properties.filter(p => p.partnerId === currentPartner.id);

  const selectedProp = partnerProperties.find(p => p.id === selectedProperty);
  const unitTypes = selectedProp ? getUnitTypesByProperty(selectedProp.id) : [];
  const services = selectedProp ? getServicesByProperty(selectedProp.id) : [];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Properties" 
        description="Manage your accommodations and listings"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        }
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partnerProperties.map((property) => {
          const destination = getDestinationById(property.destinationId);
          const units = getUnitTypesByProperty(property.id);

          return (
            <div 
              key={property.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="relative aspect-video">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button className="w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {destination?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{property.rating}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    Active
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    {units.length} unit types
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    {property.reviewCount} reviews
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Property Card */}
        <button className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors min-h-[300px]">
          <Plus className="w-8 h-8" />
          <p className="font-medium mt-2">Add New Property</p>
          <p className="text-sm">List your accommodation</p>
        </button>
      </div>

      {/* Property Detail Modal */}
      <Modal 
        isOpen={!!selectedProperty} 
        onClose={() => setSelectedProperty(null)}
        title={selectedProp?.name || 'Property Details'}
        className="max-w-2xl"
      >
        {selectedProp && (
          <Tabs
            tabs={[
              {
                id: 'basic',
                label: 'Basic Info',
                content: (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Property Name</label>
                      <input 
                        type="text" 
                        defaultValue={selectedProp.name}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Property Type</label>
                      <input 
                        type="text" 
                        defaultValue={selectedProp.type}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Description</label>
                      <textarea 
                        defaultValue={selectedProp.description}
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background resize-none"
                      />
                    </div>
                    <Button className="w-full">Save Changes</Button>
                  </div>
                )
              },
              {
                id: 'units',
                label: 'Unit Types',
                content: (
                  <div className="p-4 space-y-3">
                    {unitTypes.map((unit) => (
                      <div key={unit.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        <img 
                          src={unit.image} 
                          alt={unit.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{unit.name}</p>
                          <p className="text-xs text-muted-foreground">{unit.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Capacity: {unit.capacity} | Base: {unit.basePrice} KGS</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Unit Type
                    </Button>
                  </div>
                )
              },
              {
                id: 'services',
                label: 'Services',
                content: (
                  <div className="p-4 space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{service.price} KGS</p>
                          <p className="text-xs text-muted-foreground">{service.category}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                )
              },
              {
                id: 'amenities',
                label: 'Amenities',
                content: (
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedProp.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1.5 bg-muted rounded-full text-sm flex items-center gap-2">
                          {amenity}
                          <button className="text-muted-foreground hover:text-foreground">
                            <span className="sr-only">Remove</span>
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Amenity
                    </Button>
                  </div>
                )
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
}
