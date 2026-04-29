"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Users, Star } from "lucide-react";
import { 
  getPackageById, 
  getPartnerById,
  getDestinationById,
  reviews,
  getCustomerById,
  formatDate
} from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { PriceBadge } from "@/components/shared/badges";
import { ReviewCard } from "@/components/shared/review-card";
import { PackageBreakdown, AvailabilityCalendar, BookingSummaryCard, BookingForm, ConfirmationCard } from "@/components/traveler/booking-components";
import { SectionHeader } from "@/components/shared/section-header";

type PackageScreenProps = {
  packageId: string;
  onBack: () => void;
};

type BookingStep = 'details' | 'booking' | 'confirmation';

export function PackageScreen({ packageId, onBack }: PackageScreenProps) {
  const [step, setStep] = useState<BookingStep>('details');
  const [selectedDate, setSelectedDate] = useState<string>();
  const [guests, setGuests] = useState(2);

  const pkg = getPackageById(packageId);
  const partner = pkg ? getPartnerById(pkg.partnerId) : null;
  const destination = pkg ? getDestinationById(pkg.destinationId) : null;
  const packageReviews = reviews.slice(0, 2);

  if (!pkg) {
    return <div className="p-4">Package not found</div>;
  }

  const mockBooking = {
    id: 'new-booking',
    code: 'NC-2024-NEW',
    customerId: 'cust-1',
    packageId: pkg.id,
    channelId: 'ch-1',
    checkIn: selectedDate || '2024-07-15',
    checkOut: selectedDate ? new Date(new Date(selectedDate).getTime() + 86400000 * (pkg.itinerary.length)).toISOString().split('T')[0] : '2024-07-17',
    guests,
    status: 'confirmed' as const,
    totalPrice: pkg.retailPrice * guests,
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
          <ConfirmationCard booking={mockBooking} packageName={pkg.name} />
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
            title={pkg.name}
            checkIn={mockBooking.checkIn}
            checkOut={mockBooking.checkOut}
            guests={guests}
            items={[
              { label: `${pkg.name} x ${guests}`, price: pkg.retailPrice * guests },
            ]}
            total={pkg.retailPrice * guests}
          />
          <BookingForm onSubmit={() => setStep('confirmation')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-64 lg:h-80">
        <img 
          src={pkg.image} 
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white/80 text-sm">{destination?.name}</p>
          <h1 className="text-white text-2xl font-bold">{pkg.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {pkg.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-6 max-w-3xl mx-auto">
        {/* Price + Book */}
        <div className="pt-6 flex items-center justify-between">
          <div>
            <PriceBadge price={pkg.retailPrice} size="lg" />
            <span className="text-sm text-muted-foreground ml-1">/ person</span>
          </div>
          <Button onClick={() => setStep('booking')} size="lg">
            Book Now
          </Button>
        </div>

        {/* Description */}
        <div>
          <p className="text-muted-foreground">{pkg.description}</p>
        </div>

        {/* What's Included */}
        <PackageBreakdown pkg={pkg} />

        {/* Itinerary */}
        <section>
          <SectionHeader title="Itinerary" />
          <div className="mt-4 space-y-4">
            {pkg.itinerary.map((day) => (
              <div key={day.day} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold flex-shrink-0">
                  D{day.day}
                </div>
                <div>
                  <h4 className="font-semibold">{day.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Availability */}
        <AvailabilityCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Guests */}
        <div>
          <h3 className="font-semibold mb-3">Number of Guests</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-lg"
            >
              -
            </button>
            <span className="text-lg font-semibold w-8 text-center">{guests}</span>
            <button 
              onClick={() => setGuests(guests + 1)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Partner Info */}
        {partner && (
          <div className="border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Operated by</p>
            <p className="font-semibold mt-0.5">{partner.name}</p>
            <div className="flex items-center gap-2 mt-2">
              {partner.verified && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                  Verified Partner
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {partner.stats.bookings} bookings
              </span>
            </div>
          </div>
        )}

        {/* Reviews */}
        <section>
          <SectionHeader 
            title="Reviews" 
            action={
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">4.8</span>
                <span className="text-muted-foreground">(24 reviews)</span>
              </div>
            }
          />
          <div className="mt-4 space-y-3">
            {packageReviews.map((review) => {
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

        {/* Book CTA */}
        <div className="sticky bottom-20 lg:bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <PriceBadge price={pkg.retailPrice * guests} size="lg" />
              <p className="text-xs text-muted-foreground">Total for {guests} {guests === 1 ? 'guest' : 'guests'}</p>
            </div>
            <Button onClick={() => setStep('booking')} size="lg">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
