import { cn } from "@/lib/utils";
import { Clock, Package } from "lucide-react";
import type { TourPackage } from "@/data/mock-data";
import { PriceBadge } from "@/components/shared/badges";

type PackageCardProps = {
  pkg: TourPackage;
  onClick?: () => void;
  variant?: 'full' | 'compact';
  className?: string;
};

export function PackageCard({ pkg, onClick, variant = 'full', className }: PackageCardProps) {
  if (variant === 'compact') {
    return (
      <button 
        onClick={onClick}
        className={cn(
          "group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md",
          className
        )}
      >
        <div className="flex">
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={pkg.image} 
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1">{pkg.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pkg.duration}
            </p>
            <div className="mt-2">
              <PriceBadge price={pkg.retailPrice} size="sm" />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={cn(
        "group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={pkg.image} 
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-foreground text-background rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium">
          <Package className="w-3.5 h-3.5" />
          Package
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {pkg.duration}
        </p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {pkg.items.slice(0, 3).map((item, i) => (
            <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
              {item.name}
            </span>
          ))}
          {pkg.items.length > 3 && (
            <span className="text-xs text-muted-foreground">+{pkg.items.length - 3} more</span>
          )}
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <PriceBadge price={pkg.retailPrice} size="lg" />
          <span className="text-sm text-muted-foreground">/ person</span>
        </div>
      </div>
    </button>
  );
}
