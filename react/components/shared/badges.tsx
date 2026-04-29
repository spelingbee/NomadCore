import { cn } from "@/lib/utils";

type PriceBadgeProps = {
  price: number | string;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function PriceBadge({ price, currency = "KGS", size = "md", className }: PriceBadgeProps) {
  return (
    <span className={cn(
      "font-semibold",
      size === "sm" && "text-sm",
      size === "md" && "text-base",
      size === "lg" && "text-xl",
      className
    )}>
      {typeof price === 'number' ? price.toLocaleString() : price} {currency}
    </span>
  );
}

type StatusBadgeProps = {
  status: string;
  variant?: 'booking' | 'payment' | 'channel';
  className?: string;
};

const statusColors = {
  booking: {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  },
  payment: {
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    refunded: "bg-gray-100 text-gray-700",
  },
  channel: {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    inactive: "bg-gray-100 text-gray-700",
  },
};

export function StatusBadge({ status, variant = 'booking', className }: StatusBadgeProps) {
  const colors = statusColors[variant];
  const colorClass = colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize",
      colorClass,
      className
    )}>
      {status}
    </span>
  );
}

type ChannelBadgeProps = {
  name: string;
  color?: string;
  className?: string;
};

export function ChannelBadge({ name, color, className }: ChannelBadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        className
      )}
      style={{ 
        backgroundColor: color ? `${color}20` : undefined,
        color: color || undefined
      }}
    >
      {name}
    </span>
  );
}

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        active 
          ? "bg-foreground text-background" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {label}
    </button>
  );
}
