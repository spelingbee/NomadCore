"use client";

import { currentPartner, channels, channelMappings, properties } from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge, ChannelBadge } from "@/components/shared/badges";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function PartnerChannelsScreen() {
  const partnerProperties = properties.filter(p => p.partnerId === currentPartner.id);
  const partnerMappings = channelMappings.filter(m => 
    partnerProperties.some(p => p.id === m.propertyId)
  );

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Channels" 
        description="Manage distribution channels and pricing"
      />

      {/* Channel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel) => {
          const mappingsForChannel = partnerMappings.filter(m => m.channelId === channel.id);
          const activeMappings = mappingsForChannel.filter(m => m.status === 'active');

          return (
            <div 
              key={channel.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <ChannelBadge name={channel.name} color={channel.color} />
                <Switch defaultChecked={activeMappings.length > 0} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission</span>
                  <span className="font-medium">{channel.commission}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Listings</span>
                  <span className="font-medium">{activeMappings.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge 
                    status={activeMappings.length > 0 ? 'active' : 'inactive'} 
                    variant="channel" 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Property Mappings */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Property Channel Mappings</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure which properties are distributed to which channels
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Property
                </th>
                {channels.map((channel) => (
                  <th key={channel.id} className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <ChannelBadge name={channel.name} color={channel.color} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {partnerProperties.map((property) => (
                <tr key={property.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{property.name}</p>
                    <p className="text-xs text-muted-foreground">{property.type}</p>
                  </td>
                  {channels.map((channel) => {
                    const mapping = partnerMappings.find(
                      m => m.propertyId === property.id && m.channelId === channel.id
                    );
                    
                    return (
                      <td key={channel.id} className="px-4 py-3 text-center">
                        {mapping ? (
                          <div className="flex flex-col items-center gap-1">
                            <StatusBadge status={mapping.status} variant="channel" />
                            {mapping.priceModifier > 0 && (
                              <span className="text-xs text-muted-foreground">
                                +{mapping.priceModifier}%
                              </span>
                            )}
                          </div>
                        ) : (
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            Connect
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Settings */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-4">Channel Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Auto-accept bookings</p>
              <p className="text-xs text-muted-foreground">Automatically confirm new bookings from channels</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Sync inventory in real-time</p>
              <p className="text-xs text-muted-foreground">Keep availability updated across all channels</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Apply seasonal pricing</p>
              <p className="text-xs text-muted-foreground">Use rate plans for channel pricing</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
