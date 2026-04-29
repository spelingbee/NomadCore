"use client";

import { useState } from "react";
import { mockDestinations, mockRegionalStats } from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { MapPlaceholder } from "@/components/shared/map-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Eye,
  Mountain,
  Waves,
  Trees,
  Building2,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Lake: <Waves className="h-4 w-4" />,
  Mountains: <Mountain className="h-4 w-4" />,
  Nature: <Trees className="h-4 w-4" />,
  City: <Building2 className="h-4 w-4" />,
};

export function DestinationsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredDestinations = mockDestinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Destination Management"
        description="Manage tourism destinations across Kyrgyzstan"
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Destination
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Destinations"
          value={mockDestinations.length}
          icon={<MapPin className="h-4 w-4" />}
        />
        <StatCard
          title="Active Regions"
          value={mockRegionalStats.length}
          icon={<MapPin className="h-4 w-4" />}
        />
        <StatCard
          title="Total Visitors YTD"
          value="245K"
          trend={{ value: 18, isPositive: true }}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Avg Growth Rate"
          value="+15%"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regional Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MapPlaceholder
              title="Kyrgyzstan Tourism Map"
              height="h-64"
              markers={mockDestinations.map((d) => ({
                label: d.name,
                position: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 },
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regional Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRegionalStats.map((region) => (
                <button
                  key={region.region}
                  onClick={() => setSelectedRegion(region.region)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                    selectedRegion === region.region
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-muted-foreground">
                      {region.destinations} destinations
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {(region.visitors / 1000).toFixed(0)}K visitors
                    </p>
                    <p
                      className={`text-sm ${
                        region.growth > 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {region.growth > 0 ? "+" : ""}
                      {region.growth}% growth
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Destinations</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="group relative overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {destination.region}
                      </p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      {categoryIcons[destination.category]}
                      {destination.category}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{destination.properties} properties</span>
                    <span>{destination.experiences} experiences</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
