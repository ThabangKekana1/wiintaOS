import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PreferencesPage } from './components/PreferencesPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'preferences'>('landing');
  const [userCreated, setUserCreated] = useState(false);

  // This would typically be handled by your authentication/routing system
  const handleAccountCreated = () => {
    setUserCreated(true);
    setCurrentPage('preferences');
  };

  const handlePreferencesComplete = () => {
    // Navigate to main app
    console.log('Preferences completed, navigating to main app...');
  };

  if (currentPage === 'preferences') {
    return <PreferencesPage />;
  }

  return <LandingPage onAccountCreated={handleAccountCreated} />;
}