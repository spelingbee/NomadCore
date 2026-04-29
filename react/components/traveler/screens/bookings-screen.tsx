"use client";

import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { bookings, getPackageById, getPropertyById, formatDate } from "@/data/mock-data";
import { StatusBadge } from "@/components/shared/badges";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";

type BookingsScreenProps = {
  onPackageClick: (pkgId: string) => void;
  onPropertyClick: (propId: string) => void;
};

export function BookingsScreen({ onPackageClick, onPropertyClick }: BookingsScreenProps) {
  // Filter bookings for current customer (demo: show all)
  const userBookings = bookings.slice(0, 4);
  const upcomingBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {userBookings.length === 0 ? (
        <EmptyState 
          icon={<Calendar className="w-12 h-12" />}
          title="No bookings yet"
          description="Start exploring destinations and book your first adventure!"
        />
      ) : (
        <div className="space-y-8">
          {/* Upcoming */}
          {upcomingBookings.length > 0 && (
            <section>
              <SectionHeader title="Upcoming" />
              <div className="mt-4 space-y-3">
                {upcomingBookings.map((booking) => {
                  const pkg = booking.packageId ? getPackageById(booking.packageId) : null;
                  const property = booking.propertyId ? getPropertyById(booking.propertyId) : null;
                  const name = pkg?.name || property?.name || 'Booking';
                  const image = pkg?.image || property?.image;

                  return (
                    <button
                      key={booking.id}
                      onClick={() => {
                        if (booking.packageId) onPackageClick(booking.packageId);
                        else if (booking.propertyId) onPropertyClick(booking.propertyId);
                      }}
                      className="w-full bg-card border border-border rounded-xl p-4 text-left hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {image && (
                          <img 
                            src={image} 
                            alt={name}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold line-clamp-1">{name}</h3>
                            <StatusBadge status={booking.status} variant="booking" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-medium">{booking.totalPrice.toLocaleString()} KGS</p>
                            <span className="text-xs text-muted-foreground">{booking.code}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Past */}
          {pastBookings.length > 0 && (
            <section>
              <SectionHeader title="Past" />
              <div className="mt-4 space-y-3">
                {pastBookings.map((booking) => {
                  const pkg = booking.packageId ? getPackageById(booking.packageId) : null;
                  const property = booking.propertyId ? getPropertyById(booking.propertyId) : null;
                  const name = pkg?.name || property?.name || 'Booking';

                  return (
                    <div
                      key={booking.id}
                      className="bg-card border border-border rounded-xl p-4 opacity-75"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} variant="booking" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
