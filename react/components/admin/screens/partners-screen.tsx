"use client";

import { 
  partners, 
  formatPrice,
  formatDate
} from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard, KPIGrid } from "@/components/shared/stat-card";
import { DataTable } from "@/components/shared/data-table";
import { Users, CheckCircle, TrendingUp, Building2 } from "lucide-react";

const partnerTypeLabels: Record<string, string> = {
  yurt_camp: 'Yurt Camp',
  guest_house: 'Guest House',
  tour_operator: 'Tour Operator',
  park_admin: 'Park Admin',
  rest_point: 'Rest Point',
};

export function AdminPartnersScreen() {
  const verifiedPartners = partners.filter(p => p.verified);
  const totalRevenue = partners.reduce((sum, p) => sum + p.stats.revenue, 0);
  const totalBookings = partners.reduce((sum, p) => sum + p.stats.bookings, 0);

  const columns = [
    {
      key: 'name',
      header: 'Partner',
      render: (partner: typeof partners[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="font-medium">{partner.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{partner.name}</p>
            <p className="text-xs text-muted-foreground">{partnerTypeLabels[partner.type]}</p>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (partner: typeof partners[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          partner.verified 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {partner.verified ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (partner: typeof partners[0]) => (
        <span className="text-sm">{formatDate(partner.joinedDate)}</span>
      )
    },
    {
      key: 'properties',
      header: 'Properties',
      render: (partner: typeof partners[0]) => (
        <span className="text-sm">{partner.stats.properties}</span>
      )
    },
    {
      key: 'bookings',
      header: 'Bookings',
      render: (partner: typeof partners[0]) => (
        <span className="text-sm font-medium">{partner.stats.bookings}</span>
      )
    },
    {
      key: 'revenue',
      header: 'Revenue',
      render: (partner: typeof partners[0]) => (
        <span className="font-medium">{formatPrice(partner.stats.revenue)}</span>
      )
    },
  ];

  // Partner type distribution
  const partnersByType = Object.entries(partnerTypeLabels).map(([type, label]) => ({
    type,
    label,
    count: partners.filter(p => p.type === type).length
  }));

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Partner Analytics" 
        description="Overview of tourism partners and their performance"
      />

      {/* KPIs */}
      <KPIGrid columns={4}>
        <StatCard 
          label="Total Partners"
          value={partners.length}
          change={`${verifiedPartners.length} verified`}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard 
          label="Verified Partners"
          value={verifiedPartners.length}
          change={`${Math.round((verifiedPartners.length / partners.length) * 100)}% verification rate`}
          changeType="positive"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Bookings"
          value={totalBookings.toLocaleString()}
          change="+28% from last quarter"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard 
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={<Building2 className="w-5 h-5" />}
        />
      </KPIGrid>

      {/* Partner Type Distribution */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Partner Distribution" description="By business type" />
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {partnersByType.map(({ type, label, count }) => (
            <div key={type} className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Partners */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Top Partners by Revenue" />
        <div className="mt-4 space-y-3">
          {[...partners]
            .sort((a, b) => b.stats.revenue - a.stats.revenue)
            .slice(0, 5)
            .map((partner, i) => (
              <div key={partner.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                <div className="flex-1">
                  <p className="font-medium">{partner.name}</p>
                  <p className="text-xs text-muted-foreground">{partnerTypeLabels[partner.type]}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(partner.stats.revenue)}</p>
                  <p className="text-xs text-muted-foreground">{partner.stats.bookings} bookings</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* All Partners Table */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="All Partners" />
        <div className="mt-4">
          <DataTable 
            columns={columns}
            data={partners}
            keyExtractor={(p) => p.id}
          />
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-card border border-border rounded-xl p-4">
        <SectionHeader title="Partner Growth" description="New registrations over time" />
        <div className="mt-4 grid grid-cols-6 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
            const height = [20, 35, 45, 60, 75, 90][i];
            return (
              <div key={month} className="flex flex-col items-center">
                <div className="w-full h-24 bg-muted rounded relative">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-chart-3 rounded"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{month}</p>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          +{Math.round((partners.length / 3) * 100)}% partner growth in 2024
        </p>
      </div>
    </div>
  );
}
