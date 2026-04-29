"use client";

import { 
  channels, 
  bookings,
  properties,
  channelMappings,
  formatPrice
} from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard, KPIGrid } from "@/components/shared/stat-card";
import { ChannelBadge } from "@/components/shared/badges";
import { Share2, TrendingUp, DollarSign, Building2 } from "lucide-react";

export function AdminChannelsScreen() {
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const channelStats = channels.map((channel) => {
    const channelBookings = bookings.filter(b => b.channelId === channel.id);
    const revenue = channelBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const mappings = channelMappings.filter(m => m.channelId === channel.id && m.status === 'active');
    
    return {
      ...channel,
      bookings: channelBookings.length,
      revenue,
      percentage: Math.round((channelBookings.length / totalBookings) * 100),
      revenuePercentage: Math.round((revenue / totalRevenue) * 100),
      activeProperties: mappings.length,
    };
  });

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Channel Analytics" 
        description="Distribution channel performance and inventory allocation"
      />

      {/* KPIs */}
      <KPIGrid columns={4}>
        <StatCard 
          label="Active Channels"
          value={channels.length}
          change="All connected"
          icon={<Share2 className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Distributed Bookings"
          value={totalBookings}
          change="+22% from last month"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard 
          label="Channel Revenue"
          value={formatPrice(totalRevenue)}
          change="+18% from last month"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard 
          label="Properties Distributed"
          value={properties.length}
          change="Across all channels"
          icon={<Building2 className="w-5 h-5" />}
        />
      </KPIGrid>

      {/* Channel Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channelStats.map((channel) => (
          <div 
            key={channel.id}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <ChannelBadge name={channel.name} color={channel.color} />
              <span className="text-xs text-muted-foreground">{channel.commission}% commission</span>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Bookings</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{channel.bookings}</span>
                  <span className="text-sm text-muted-foreground">({channel.percentage}%)</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="font-semibold">{formatPrice(channel.revenue)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Active Listings</p>
                <p className="font-medium">{channel.activeProperties} properties</p>
              </div>
            </div>

            {/* Visual bar */}
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${channel.percentage}%`,
                  backgroundColor: channel.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Channel Distribution Chart (simplified) */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Booking Distribution" description="Share of bookings by channel" />
        <div className="mt-4 flex items-center gap-4">
          {/* Pie chart placeholder */}
          <div className="w-48 h-48 rounded-full relative" style={{
            background: `conic-gradient(
              ${channels[0].color} 0% ${channelStats[0].percentage}%,
              ${channels[1].color} ${channelStats[0].percentage}% ${channelStats[0].percentage + channelStats[1].percentage}%,
              ${channels[2].color} ${channelStats[0].percentage + channelStats[1].percentage}% ${channelStats[0].percentage + channelStats[1].percentage + channelStats[2].percentage}%,
              ${channels[3].color} ${channelStats[0].percentage + channelStats[1].percentage + channelStats[2].percentage}% 100%
            )`
          }}>
            <div className="absolute inset-6 bg-card rounded-full" />
          </div>
          
          {/* Legend */}
          <div className="flex-1 space-y-2">
            {channelStats.map((channel) => (
              <div key={channel.id} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: channel.color }}
                />
                <span className="flex-1 text-sm">{channel.name}</span>
                <span className="text-sm font-medium">{channel.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Revenue by Channel" />
        <div className="mt-4 space-y-4">
          {channelStats.sort((a, b) => b.revenue - a.revenue).map((channel) => (
            <div key={channel.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ChannelBadge name={channel.name} color={channel.color} />
                </div>
                <span className="font-medium">{formatPrice(channel.revenue)}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${channel.revenuePercentage}%`,
                    backgroundColor: channel.color
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {channel.revenuePercentage}% of total revenue
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Strategy */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900">Distribution Strategy Recommendations</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>- Direct channel shows highest margin. Consider loyalty programs to increase direct bookings.</li>
          <li>- MTravel drives significant volume. Negotiate commission rates for high-performing partners.</li>
          <li>- Kettik has strong local reach. Expand domestic tourism campaigns through this channel.</li>
          <li>- Tunduk Travel targeting international visitors. Increase premium inventory allocation.</li>
        </ul>
      </div>
    </div>
  );
}
