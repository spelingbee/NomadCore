import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import type { Property, UnitType } from "@/data/mock-data";
import { PriceBadge } from "@/components/shared/badges";

type PropertyCardProps = {
  property: Property;
  unitTypes?: UnitType[];
  onClick?: () => void;
  className?: string;
};

export function PropertyCard({ property, unitTypes = [], onClick, className }: PropertyCardProps) {
  const lowestPrice = unitTypes.length > 0 
    ? Math.min(...unitTypes.map(u => u.basePrice))
    : null;

  return (
    <button 
      onClick={onClick}
      className={cn(
        "group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-card/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{property.rating}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground">{property.type}</p>
        <h3 className="font-semibold mt-0.5 line-clamp-1">{property.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
              {amenity}
            </span>
          ))}
        </div>
        {lowestPrice && (
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">from</span>
            <PriceBadge price={lowestPrice} size="sm" />
            <span className="text-xs text-muted-foreground">/ night</span>
          </div>
        )}
      </div>
    </button>
  );
}
