"use client";

import { cn } from "@/lib/utils";
import { Calendar, Users, Check, QrCode } from "lucide-react";
import { PriceBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import type { TourPackage, Booking } from "@/data/mock-data";

type BookingSummaryCardProps = {
  title: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  items: { label: string; price: number }[];
  total: number;
  className?: string;
};

export function BookingSummaryCard({ title, checkIn, checkOut, guests, items, total, className }: BookingSummaryCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
      <h3 className="font-semibold">{title}</h3>
      
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{checkIn} - {checkOut}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span>{item.price.toLocaleString()} KGS</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="font-semibold">Total</span>
        <PriceBadge price={total} size="lg" />
      </div>
    </div>
  );
}

type PackageBreakdownProps = {
  pkg: TourPackage;
  className?: string;
};

export function PackageBreakdown({ pkg, className }: PackageBreakdownProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-semibold">{"What's Included"}</h3>
      <div className="space-y-2">
        {pkg.items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type AvailabilityCalendarProps = {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  className?: string;
};

export function AvailabilityCalendar({ selectedDate, onDateSelect, className }: AvailabilityCalendarProps) {
  // Simple mock calendar for demo
  const dates = [
    { date: '2024-07-15', available: true, price: 6000 },
    { date: '2024-07-16', available: true, price: 6000 },
    { date: '2024-07-17', available: false, price: 6000 },
    { date: '2024-07-18', available: true, price: 6000 },
    { date: '2024-07-19', available: true, price: 7500 },
    { date: '2024-07-20', available: true, price: 7500 },
    { date: '2024-07-21', available: true, price: 6000 },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-semibold">Select Date</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((d) => {
          const day = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
          return (
            <button
              key={d.date}
              disabled={!d.available}
              onClick={() => d.available && onDateSelect?.(d.date)}
              className={cn(
                "flex-shrink-0 w-16 p-2 rounded-lg border text-center transition-colors",
                d.available 
                  ? selectedDate === d.date 
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                  : "border-border bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <p className="text-xs font-medium">{day.split(' ')[0]}</p>
              <p className="text-lg font-semibold">{day.split(' ')[1]}</p>
              {d.available && (
                <p className="text-[10px] text-muted-foreground">{(d.price / 1000).toFixed(1)}k</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type BookingFormProps = {
  onSubmit?: () => void;
  className?: string;
};

export function BookingForm({ onSubmit, className }: BookingFormProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold">Contact Details</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <input 
            type="text" 
            defaultValue="Anna Schmidt"
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input 
            type="email" 
            defaultValue="anna@email.com"
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Phone</label>
          <input 
            type="tel" 
            defaultValue="+49 123 456 789"
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
          />
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full" size="lg">
        Confirm Booking
      </Button>
    </div>
  );
}

type ConfirmationCardProps = {
  booking: Booking;
  packageName?: string;
  propertyName?: string;
  className?: string;
};

export function ConfirmationCard({ booking, packageName, propertyName, className }: ConfirmationCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <Check className="w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-bold mt-4">Booking Confirmed!</h2>
      <p className="text-muted-foreground mt-1">{packageName || propertyName}</p>
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Booking Code</p>
        <p className="text-2xl font-mono font-bold mt-1">{booking.code}</p>
      </div>

      <div className="mt-4 p-4 border border-dashed border-border rounded-lg">
        <QrCode className="w-24 h-24 mx-auto text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-2">Show this QR code at check-in</p>
      </div>

      <div className="mt-6 text-left space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Check-in</span>
          <span className="font-medium">{booking.checkIn}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Check-out</span>
          <span className="font-medium">{booking.checkOut}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Guests</span>
          <span className="font-medium">{booking.guests}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Total Paid</span>
          <span className="font-semibold">{booking.totalPrice.toLocaleString()} KGS</span>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg text-left">
        <p className="text-sm font-medium text-blue-900">Next Steps</p>
        <ul className="text-sm text-blue-800 mt-1 space-y-1">
          <li>1. Check your email for confirmation</li>
          <li>2. Save your booking code</li>
          <li>3. Arrive at the location on your check-in date</li>
        </ul>
      </div>
    </div>
  );
}
