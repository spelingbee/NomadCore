"use client";

import { Bell, Calendar, DollarSign, Star, AlertCircle, Check } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'alert' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const notifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking',
    message: 'Anna Schmidt booked Song-Kul Starter Package for Jul 15-17',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: '25,000 KGS received for booking NC-2024-001',
    time: '3 hours ago',
    read: false
  },
  {
    id: '3',
    type: 'review',
    title: 'New Review',
    message: 'John Miller left a 5-star review for Song-Kul Lakeside Yurts',
    time: '1 day ago',
    read: true
  },
  {
    id: '4',
    type: 'alert',
    title: 'Low Inventory Alert',
    message: 'Standard Yurt has only 2 units available for Jul 19-20',
    time: '1 day ago',
    read: true
  },
  {
    id: '5',
    type: 'system',
    title: 'Channel Connected',
    message: 'Your property is now live on MTravel',
    time: '3 days ago',
    read: true
  },
  {
    id: '6',
    type: 'booking',
    title: 'Booking Cancelled',
    message: 'Marie Dubois cancelled booking NC-2024-008',
    time: '5 days ago',
    read: true
  },
];

const iconMap = {
  booking: Calendar,
  payment: DollarSign,
  review: Star,
  alert: AlertCircle,
  system: Bell,
};

const colorMap = {
  booking: 'bg-blue-100 text-blue-600',
  payment: 'bg-emerald-100 text-emerald-600',
  review: 'bg-amber-100 text-amber-600',
  alert: 'bg-red-100 text-red-600',
  system: 'bg-gray-100 text-gray-600',
};

export function PartnerNotificationsScreen() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Notifications" 
        description={`You have ${unreadCount} unread notifications`}
        action={
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Mark all as read
          </button>
        }
      />

      {/* Notifications List */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          const colorClass = colorMap[notification.type];

          return (
            <div 
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                !notification.read && "bg-muted/30"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("font-medium text-sm", !notification.read && "font-semibold")}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { label: 'New bookings', description: 'Get notified when you receive a new booking' },
            { label: 'Payments', description: 'Receive payment confirmations and alerts' },
            { label: 'Reviews', description: 'Know when guests leave reviews' },
            { label: 'Inventory alerts', description: 'Get alerts when availability is low' },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-2 py-1 text-xs rounded border border-border hover:bg-muted">
                  Email
                </button>
                <button className="px-2 py-1 text-xs rounded bg-foreground text-background">
                  Push
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
