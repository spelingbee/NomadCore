import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

type MapPlaceholderProps = {
  title?: string;
  markers?: { name: string; value?: number }[];
  className?: string;
};

export function MapPlaceholder({ title = "Map View", markers = [], className }: MapPlaceholderProps) {
  return (
    <div className={cn("border border-border rounded-lg bg-muted/30 overflow-hidden", className)}>
      <div className="p-3 border-b border-border bg-card">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="relative h-64 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        {/* Simplified map representation */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <path d="M50,150 Q100,50 200,100 T350,150" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M100,200 Q150,150 250,180 T380,160" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="120" cy="120" r="30" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="280" cy="140" r="40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
        
        {markers.length > 0 ? (
          <div className="relative z-10 flex flex-wrap gap-2 justify-center p-4">
            {markers.map((marker, i) => (
              <div key={i} className="flex items-center gap-1 bg-card px-2 py-1 rounded shadow-sm text-xs">
                <MapPin className="w-3 h-3 text-primary" />
                <span>{marker.name}</span>
                {marker.value !== undefined && (
                  <span className="text-muted-foreground">({marker.value})</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>Map visualization</span>
          </div>
        )}
      </div>
    </div>
  );
}
