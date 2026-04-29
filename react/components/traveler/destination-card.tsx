import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import type { DestinationArea } from "@/data/mock-data";

type DestinationCardProps = {
  destination: DestinationArea;
  onClick?: () => void;
  variant?: 'featured' | 'compact';
  className?: string;
};

export function DestinationCard({ destination, onClick, variant = 'featured', className }: DestinationCardProps) {
  if (variant === 'compact') {
    return (
      <button 
        onClick={onClick}
        className={cn(
          "group relative rounded-xl overflow-hidden aspect-[4/3] w-full text-left",
          className
        )}
      >
        <img 
          src={destination.image} 
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold">{destination.name}</h3>
          <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {destination.region}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl overflow-hidden aspect-[16/10] w-full text-left",
        className
      )}
    >
      <img 
        src={destination.image} 
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
          <MapPin className="w-4 h-4" />
          {destination.region}
        </div>
        <h3 className="text-white text-xl font-bold">{destination.name}</h3>
        <p className="text-white/80 text-sm mt-1 line-clamp-2">{destination.description}</p>
      </div>
    </button>
  );
}
