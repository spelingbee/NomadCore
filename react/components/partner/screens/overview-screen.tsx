"use client";

import { 
  currentPartner, 
  bookings, 
  properties, 
  getCustomerById, 
  getPackageById, 
  getPropertyById,
  formatDate,
  formatPrice
} from "@/data/mock-data";
import { StatCard, KPIGrid } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";
import { InsightCard } from "@/components/shared/insight-card";
import { StatusBadge } from "@/components/shared/badges";
import { TrendingUp, Building2, CalendarCheck, DollarSign } from "lucide-react";

export function PartnerOverviewScreen() {
  const recentBookings = bookings.slice(0, 5);
  const partnerProperties = properties.filter(p => p.partnerId === currentPartner.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {currentPartner.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground">{"Here's what's happening with your business"}</p>
      </div>

      {/* KPIs */}
      <KPIGrid columns={4}>
        <StatCard 
          label="Total Bookings"
          value={currentPartner.stats.bookings}
          change="+12% from last month"
          changeType="positive"
          icon={<CalendarCheck className="w-5 h-5" />}
        />
        <StatCard 
          label="Revenue"
          value={formatPrice(currentPartner.stats.revenue)}
          change="+8% from last month"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard 
          label="Occupancy Rate"
          value="78%"
          change="+5% from last month"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard 
          label="Active Listings"
          value={partnerProperties.length}
          icon={<Building2 className="w-5 h-5" />}
        />
      </KPIGrid>

      {/* AI Insight */}
      <InsightCard 
        title="AI Pricing Suggestion"
        insight="Based on demand patterns, consider increasing rates by 15% for July 19-21 weekend. Similar properties in Song-Kul are already at higher rates."
        type="info"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-card border border-border rounded-xl p-4">
          <SectionHeader title="Recent Bookings" />
          <div className="mt-4 divide-y divide-border">
            {recentBookings.map((booking) => {
              const customer = getCustomerById(booking.customerId);
              const pkg = booking.packageId ? getPackageById(booking.packageId) : null;
              const property = booking.propertyId ? getPropertyById(booking.propertyId) : null;
              
              return (
                <div key={booking.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{customer?.name}</p>
                    <p className="text-xs text-muted-foreground">{pkg?.name || property?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={booking.status} variant="booking" />
                    <p className="text-sm font-medium mt-1">{formatPrice(booking.totalPrice)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Properties Overview */}
        <div className="bg-card border border-border rounded-xl p-4">
          <SectionHeader title="Your Properties" />
          <div className="mt-4 space-y-3">
            {partnerProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{property.name}</p>
                  <p className="text-xs text-muted-foreground">{property.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                      Active
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {property.rating} rating
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {partnerProperties.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No properties yet. Add your first property to get started.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Quick Actions" />
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="p-4 bg-muted rounded-lg text-left hover:bg-muted/80 transition-colors">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium text-sm mt-2">Add Property</p>
            <p className="text-xs text-muted-foreground">List a new accommodation</p>
          </button>
          <button className="p-4 bg-muted rounded-lg text-left hover:bg-muted/80 transition-colors">
            <CalendarCheck className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium text-sm mt-2">Update Availability</p>
            <p className="text-xs text-muted-foreground">Manage your calendar</p>
          </button>
          <button className="p-4 bg-muted rounded-lg text-left hover:bg-muted/80 transition-colors">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium text-sm mt-2">Adjust Pricing</p>
            <p className="text-xs text-muted-foreground">Set rates and offers</p>
          </button>
          <button className="p-4 bg-muted rounded-lg text-left hover:bg-muted/80 transition-colors">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium text-sm mt-2">View Analytics</p>
            <p className="text-xs text-muted-foreground">Track performance</p>
          </button>
        </div>
      </div>
    </div>
  );
}
