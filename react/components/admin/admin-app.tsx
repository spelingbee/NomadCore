"use client";

import { useState } from "react";
import { AdminLayout } from "./admin-layout";
import { AdminOverviewScreen } from "./screens/overview-screen";
import { DestinationsScreen } from "./screens/destinations-screen";
import { InfrastructureScreen } from "./screens/infrastructure-screen";
import { AdminPartnersScreen } from "./screens/partners-screen";
import { AdminChannelsScreen } from "./screens/channels-screen";
import { AdminInsightsScreen } from "./screens/insights-screen";

export function AdminApp() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <AdminOverviewScreen />;
      case 'destinations':
        return <DestinationsScreen />;
      case 'infrastructure':
        return <InfrastructureScreen />;
      case 'partners':
        return <AdminPartnersScreen />;
      case 'channels':
        return <AdminChannelsScreen />;
      case 'insights':
        return <AdminInsightsScreen />;
      default:
        return <AdminOverviewScreen />;
    }
  };

  return (
    <AdminLayout activePage={activePage} onPageChange={setActivePage}>
      {renderPage()}
    </AdminLayout>
  );
}
