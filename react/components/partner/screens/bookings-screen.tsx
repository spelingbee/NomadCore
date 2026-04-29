"use client";

import { 
  bookings, 
  payments,
  getCustomerById, 
  getPackageById, 
  getPropertyById,
  getChannelById,
  formatDate,
  formatPrice
} from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge, ChannelBadge } from "@/components/shared/badges";
import { FilterChip } from "@/components/shared/badges";
import { useState } from "react";

const statusFilters = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

export function PartnerBookingsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredBookings = activeFilter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter.toLowerCase());

  const columns = [
    {
      key: 'code',
      header: 'Booking',
      render: (booking: typeof bookings[0]) => {
        const customer = getCustomerById(booking.customerId);
        return (
          <div>
            <p className="font-medium">{booking.code}</p>
            <p className="text-xs text-muted-foreground">{customer?.name}</p>
          </div>
        );
      }
    },
    {
      key: 'item',
      header: 'Item',
      render: (booking: typeof bookings[0]) => {
        const pkg = booking.packageId ? getPackageById(booking.packageId) : null;
        const property = booking.propertyId ? getPropertyById(booking.propertyId) : null;
        return (
          <div>
            <p className="text-sm">{pkg?.name || property?.name}</p>
            <p className="text-xs text-muted-foreground">{pkg ? 'Package' : 'Property'}</p>
          </div>
        );
      }
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (booking: typeof bookings[0]) => (
        <div>
          <p className="text-sm">{formatDate(booking.checkIn)}</p>
          <p className="text-xs text-muted-foreground">to {formatDate(booking.checkOut)}</p>
        </div>
      )
    },
    {
      key: 'guests',
      header: 'Guests',
      render: (booking: typeof bookings[0]) => (
        <span className="text-sm">{booking.guests}</span>
      )
    },
    {
      key: 'channel',
      header: 'Channel',
      render: (booking: typeof bookings[0]) => {
        const channel = getChannelById(booking.channelId);
        return channel ? (
          <ChannelBadge name={channel.name} color={channel.color} />
        ) : null;
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking: typeof bookings[0]) => (
        <StatusBadge status={booking.status} variant="booking" />
      )
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (booking: typeof bookings[0]) => {
        const payment = payments.find(p => p.bookingId === booking.id);
        return payment ? (
          <StatusBadge status={payment.status} variant="payment" />
        ) : (
          <span className="text-xs text-muted-foreground">No payment</span>
        );
      }
    },
    {
      key: 'total',
      header: 'Total',
      render: (booking: typeof bookings[0]) => (
        <span className="font-medium">{formatPrice(booking.totalPrice)}</span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Bookings" 
        description="View and manage all your bookings"
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((filter) => (
          <FilterChip 
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-semibold mt-1">{bookings.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600">
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-semibold mt-1 text-amber-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-semibold mt-1">
            {formatPrice(bookings.reduce((sum, b) => sum + b.totalPrice, 0))}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <DataTable 
        columns={columns}
        data={filteredBookings}
        keyExtractor={(b) => b.id}
        emptyMessage="No bookings found"
      />
    </div>
  );
}
