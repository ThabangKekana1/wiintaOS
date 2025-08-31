'use client';

import React, { useState } from 'react';
import { LandingPage } from '../components/LandingPage';
import { PreferencesPage } from '../components/PreferencesPage';

export default function HomePage() {
  const [showPreferences, setShowPreferences] = useState(false);

  const handleAccountCreated = () => {
    setShowPreferences(true);
  };

  if (showPreferences) {
    return <PreferencesPage />;
  }

  return <LandingPage onAccountCreated={handleAccountCreated} />;
}