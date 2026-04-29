import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type ReviewCardProps = {
  author: string;
  rating: number;
  comment: string;
  date: string;
  className?: string;
};

export function ReviewCard({ author, rating, comment, date, className }: ReviewCardProps) {
  return (
    <div className={cn("border border-border rounded-lg p-4 bg-card", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {author.charAt(0)}
          </div>
          <span className="font-medium text-sm">{author}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-3.5 h-3.5",
                i < rating ? "fill-amber-400 text-amber-400" : "text-muted"
              )} 
            />
          ))}
        </div>
      </div>
      <p className="text-sm mt-3 text-muted-foreground">{comment}</p>
      <p className="text-xs text-muted-foreground mt-2">{date}</p>
    </div>
  );
}
