"use client";

import { useState } from "react";
import { TravelerLayout } from "./traveler-layout";
import { HomeScreen } from "./screens/home-screen";
import { SearchScreen } from "./screens/search-screen";
import { DestinationScreen } from "./screens/destination-screen";
import { PackageScreen } from "./screens/package-screen";
import { PropertyScreen } from "./screens/property-screen";
import { BookingsScreen } from "./screens/bookings-screen";
import { ProfileScreen } from "./screens/profile-screen";

type Screen = 
  | { type: 'home' }
  | { type: 'search' }
  | { type: 'bookings' }
  | { type: 'profile' }
  | { type: 'destination'; id: string }
  | { type: 'package'; id: string }
  | { type: 'property'; id: string };

export function TravelerApp() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' });
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'bookings' | 'profile'>('home');

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setScreen({ type: tab });
  };

  const handleDestinationClick = (id: string) => {
    setScreen({ type: 'destination', id });
  };

  const handlePackageClick = (id: string) => {
    setScreen({ type: 'package', id });
  };

  const handlePropertyClick = (id: string) => {
    setScreen({ type: 'property', id });
  };

  const handleBack = () => {
    setScreen({ type: activeTab });
  };

  const renderScreen = () => {
    switch (screen.type) {
      case 'home':
        return (
          <HomeScreen 
            onDestinationClick={handleDestinationClick}
            onPackageClick={handlePackageClick}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'search':
        return (
          <SearchScreen 
            onDestinationClick={handleDestinationClick}
            onPackageClick={handlePackageClick}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'bookings':
        return (
          <BookingsScreen 
            onPackageClick={handlePackageClick}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      case 'destination':
        return (
          <DestinationScreen 
            destinationId={screen.id}
            onBack={handleBack}
            onPackageClick={handlePackageClick}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'package':
        return (
          <PackageScreen 
            packageId={screen.id}
            onBack={handleBack}
          />
        );
      case 'property':
        return (
          <PropertyScreen 
            propertyId={screen.id}
            onBack={handleBack}
          />
        );
    }
  };

  return (
    <TravelerLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderScreen()}
    </TravelerLayout>
  );
}
