"use client";

import { useState } from "react";
import { PartnerLayout } from "./partner-layout";
import { PartnerOverviewScreen } from "./screens/overview-screen";
import { PartnerPropertiesScreen } from "./screens/properties-screen";
import { PartnerInventoryScreen } from "./screens/inventory-screen";
import { PartnerBookingsScreen } from "./screens/bookings-screen";
import { PartnerPackagesScreen } from "./screens/packages-screen";
import { PartnerChannelsScreen } from "./screens/channels-screen";
import { PartnerReviewsScreen } from "./screens/reviews-screen";
import { PartnerNotificationsScreen } from "./screens/notifications-screen";

export function PartnerApp() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <PartnerOverviewScreen />;
      case 'properties':
        return <PartnerPropertiesScreen />;
      case 'inventory':
        return <PartnerInventoryScreen />;
      case 'bookings':
        return <PartnerBookingsScreen />;
      case 'packages':
        return <PartnerPackagesScreen />;
      case 'channels':
        return <PartnerChannelsScreen />;
      case 'reviews':
        return <PartnerReviewsScreen />;
      case 'notifications':
        return <PartnerNotificationsScreen />;
      default:
        return <PartnerOverviewScreen />;
    }
  };

  return (
    <PartnerLayout activePage={activePage} onPageChange={setActivePage}>
      {renderPage()}
    </PartnerLayout>
  );
}
