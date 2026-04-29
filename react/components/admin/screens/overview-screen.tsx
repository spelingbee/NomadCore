"use client";

import { 
  destinations, 
  partners, 
  bookings, 
  channels,
  formatPrice 
} from "@/data/mock-data";
import { StatCard, KPIGrid } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";
import { InsightCard } from "@/components/shared/insight-card";
import { MapPlaceholder } from "@/components/shared/map-placeholder";
import { ChannelBadge } from "@/components/shared/badges";
import { Map, Users, Calendar, TrendingUp } from "lucide-react";

export function AdminOverviewScreen() {
  const totalRevenue = destinations.reduce((sum, d) => sum + d.stats.revenue, 0);
  const totalBookings = destinations.reduce((sum, d) => sum + d.stats.bookings, 0);
  const activePartners = partners.filter(p => p.verified).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tourism Analytics Dashboard</h1>
        <p className="text-muted-foreground">National overview of tourism activity</p>
      </div>

      {/* KPIs */}
      <KPIGrid columns={4}>
        <StatCard 
          label="Total Destinations"
          value={destinations.length}
          change="Active regions"
          icon={<Map className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Bookings"
          value={totalBookings.toLocaleString()}
          change="+23% from last quarter"
          changeType="positive"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          change="+18% from last quarter"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard 
          label="Active Partners"
          value={activePartners}
          change={`${partners.length} total registered`}
          icon={<Users className="w-5 h-5" />}
        />
      </KPIGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <MapPlaceholder 
          title="Destinations Overview"
          markers={destinations.map(d => ({ name: d.name, value: d.stats.bookings }))}
        />

        {/* Revenue by Region */}
        <div className="bg-card border border-border rounded-xl p-4">
          <SectionHeader title="Revenue by Destination" />
          <div className="mt-4 space-y-4">
            {destinations.map((dest) => {
              const percentage = Math.round((dest.stats.revenue / totalRevenue) * 100);
              return (
                <div key={dest.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{dest.name}</span>
                    <span>{formatPrice(dest.stats.revenue)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-chart-1 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Occupancy Trends */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Occupancy Trends" description="Average occupancy by destination" />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <div key={dest.id} className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">{dest.name}</h4>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-3xl font-bold">{dest.stats.occupancy}%</span>
                <span className="text-sm text-emerald-600 mb-1">+5%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {dest.stats.bookings} bookings this quarter
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Distribution */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Booking Distribution by Channel" />
        <div className="mt-4 flex flex-wrap gap-4">
          {channels.map((channel, i) => {
            const bookingCount = bookings.filter(b => b.channelId === channel.id).length;
            const percentage = Math.round((bookingCount / bookings.length) * 100);
            
            return (
              <div key={channel.id} className="flex-1 min-w-[150px] p-4 border border-border rounded-lg">
                <ChannelBadge name={channel.name} color={channel.color} />
                <p className="text-2xl font-bold mt-2">{bookingCount}</p>
                <p className="text-xs text-muted-foreground">{percentage}% of bookings</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard 
          title="Demand Forecast"
          insight="Based on historical data, expect 35% higher bookings in Song-Kul during July weekends. Consider infrastructure scaling."
          type="info"
        />
        <InsightCard 
          title="Revenue Opportunity"
          insight="Sary-Chelek has 62% occupancy but lower revenue. Recommend premium package development for eco-tourism segment."
          type="success"
        />
      </div>
    </div>
  );
}
