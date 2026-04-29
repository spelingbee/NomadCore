import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

type InsightCardProps = {
  title?: string;
  insight: string;
  type?: 'info' | 'success' | 'warning';
  className?: string;
};

export function InsightCard({ title = "AI Insight", insight, type = 'info', className }: InsightCardProps) {
  return (
    <div className={cn(
      "border rounded-lg p-4",
      type === 'info' && "border-blue-200 bg-blue-50",
      type === 'success' && "border-emerald-200 bg-emerald-50",
      type === 'warning' && "border-amber-200 bg-amber-50",
      className
    )}>
      <div className="flex gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          type === 'info' && "bg-blue-100 text-blue-600",
          type === 'success' && "bg-emerald-100 text-emerald-600",
          type === 'warning' && "bg-amber-100 text-amber-600",
        )}>
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <p className={cn(
            "text-xs font-medium",
            type === 'info' && "text-blue-600",
            type === 'success' && "text-emerald-600",
            type === 'warning' && "text-amber-600",
          )}>
            {title}
          </p>
          <p className={cn(
            "text-sm mt-0.5",
            type === 'info' && "text-blue-900",
            type === 'success' && "text-emerald-900",
            type === 'warning' && "text-amber-900",
          )}>
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}
