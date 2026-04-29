"use client";

import { useState } from "react";
import { ArrowLeft, Star, Check } from "lucide-react";
import { 
  getPropertyById, 
  getPartnerById,
  getDestinationById,
  getUnitTypesByProperty,
  getServicesByProperty,
  reviews,
  getCustomerById,
  formatDate
} from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { PriceBadge } from "@/components/shared/badges";
import { ReviewCard } from "@/components/shared/review-card";
import { AvailabilityCalendar, BookingSummaryCard, BookingForm, ConfirmationCard } from "@/components/traveler/booking-components";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

type PropertyScreenProps = {
  propertyId: string;
  onBack: () => void;
};

type BookingStep = 'details' | 'booking' | 'confirmation';

export function PropertyScreen({ propertyId, onBack }: PropertyScreenProps) {
  const [step, setStep] = useState<BookingStep>('details');
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedUnit, setSelectedUnit] = useState<string>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const property = getPropertyById(propertyId);
  const partner = property ? getPartnerById(property.partnerId) : null;
  const destination = property ? getDestinationById(property.destinationId) : null;
  const unitTypes = property ? getUnitTypesByProperty(property.id) : [];
  const services = property ? getServicesByProperty(property.id) : [];
  const propertyReviews = reviews.filter(r => r.propertyId === propertyId).slice(0, 2);

  if (!property) {
    return <div className="p-4">Property not found</div>;
  }

  const selectedUnitData = unitTypes.find(u => u.id === selectedUnit);
  const selectedServicesData = services.filter(s => selectedServices.includes(s.id));
  const servicesTotal = selectedServicesData.reduce((sum, s) => sum + s.price, 0);
  const total = (selectedUnitData?.basePrice || 0) + servicesTotal;

  const mockBooking = {
    id: 'new-booking',
    code: 'NC-2024-NEW',
    customerId: 'cust-1',
    propertyId: property.id,
    channelId: 'ch-1',
    checkIn: selectedDate || '2024-07-15',
    checkOut: selectedDate ? new Date(new Date(selectedDate).getTime() + 86400000).toISOString().split('T')[0] : '2024-07-16',
    guests: selectedUnitData?.capacity || 2,
    status: 'confirmed' as const,
    totalPrice: total,
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-card border-b border-border z-30 px-4 h-14 flex items-center">
          <button onClick={onBack} className="mr-3 text-muted-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Booking Confirmed</h1>
        </header>
        <div className="p-4 max-w-lg mx-auto">
          <ConfirmationCard booking={mockBooking} propertyName={property.name} />
          <Button onClick={onBack} variant="outline" className="w-full mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'booking') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-card border-b border-border z-30 px-4 h-14 flex items-center">
          <button onClick={() => setStep('details')} className="mr-3 text-muted-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Complete Booking</h1>
        </header>
        <div className="p-4 max-w-lg mx-auto space-y-6">
          <BookingSummaryCard 
            title={property.name}
            checkIn={mockBooking.checkIn}
            checkOut={mockBooking.checkOut}
            guests={mockBooking.guests}
            items={[
              { label: selectedUnitData?.name || 'Room', price: selectedUnitData?.basePrice || 0 },
              ...selectedServicesData.map(s => ({ label: s.name, price: s.price })),
            ]}
            total={total}
          />
          <BookingForm onSubmit={() => setStep('confirmation')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gallery */}
      <div className="relative h-64 lg:h-80">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-8 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{property.type} in {destination?.name}</p>
              <h1 className="text-2xl font-bold mt-1">{property.name}</h1>
            </div>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-muted-foreground text-sm">({property.reviewCount})</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-3">{property.description}</p>
        </div>

        {/* Amenities */}
        <section>
          <SectionHeader title="Amenities" />
          <div className="mt-3 flex flex-wrap gap-2">
            {property.amenities.map((amenity, i) => (
              <span key={i} className="px-3 py-1.5 bg-muted rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </section>

        {/* Unit Types */}
        <section>
          <SectionHeader title="Room Types" />
          <div className="mt-4 space-y-3">
            {unitTypes.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={cn(
                  "w-full border rounded-xl p-4 text-left transition-colors",
                  selectedUnit === unit.id 
                    ? "border-foreground bg-muted/50" 
                    : "border-border hover:border-foreground/50"
                )}
              >
                <div className="flex gap-4">
                  <img 
                    src={unit.image} 
                    alt={unit.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{unit.name}</h4>
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Up to {unit.capacity} guests</p>
                    <div className="mt-2">
                      <PriceBadge price={unit.basePrice} size="sm" />
                      <span className="text-xs text-muted-foreground"> / night</span>
                    </div>
                  </div>
                  {selectedUnit === unit.id && (
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Services */}
        {services.length > 0 && (
          <section>
            <SectionHeader title="Add Services" />
            <div className="mt-4 space-y-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedServices(prev => 
                      prev.includes(service.id) 
                        ? prev.filter(id => id !== service.id)
                        : [...prev, service.id]
                    );
                  }}
                  className={cn(
                    "w-full border rounded-lg p-3 text-left flex items-center justify-between transition-colors",
                    selectedServices.includes(service.id)
                      ? "border-foreground bg-muted/50" 
                      : "border-border hover:border-foreground/50"
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriceBadge price={service.price} size="sm" />
                    {selectedServices.includes(service.id) && (
                      <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Availability */}
        <AvailabilityCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Reviews */}
        {propertyReviews.length > 0 && (
          <section>
            <SectionHeader title="Reviews" />
            <div className="mt-4 space-y-3">
              {propertyReviews.map((review) => {
                const customer = getCustomerById(review.customerId);
                return (
                  <ReviewCard 
                    key={review.id}
                    author={customer?.name || 'Anonymous'}
                    rating={review.rating}
                    comment={review.comment}
                    date={formatDate(review.createdAt)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Book CTA */}
        {selectedUnit && (
          <div className="sticky bottom-20 lg:bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <PriceBadge price={total} size="lg" />
                <p className="text-xs text-muted-foreground">
                  {selectedUnitData?.name}
                  {selectedServicesData.length > 0 && ` + ${selectedServicesData.length} services`}
                </p>
              </div>
              <Button onClick={() => setStep('booking')} size="lg">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
