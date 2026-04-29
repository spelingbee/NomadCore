import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { Experience } from "@/data/mock-data";
import { PriceBadge } from "@/components/shared/badges";

type ExperienceCardProps = {
  experience: Experience;
  onClick?: () => void;
  className?: string;
};

export function ExperienceCard({ experience, onClick, className }: ExperienceCardProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md min-w-[200px]",
        className
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={experience.image} 
          alt={experience.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{experience.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {experience.duration}
        </p>
        <div className="mt-2">
          <PriceBadge price={experience.price} size="sm" />
        </div>
      </div>
    </button>
  );
}
