
import React, { useState, useEffect } from 'react';
import Desktop from '../components/Desktop';
import WelcomeScreen from '../components/WelcomeScreen';
import WindowManager from '../components/WindowManager';
import { ShellProvider } from '../contexts/ShellContext';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('ishell_visited');
    if (hasVisited) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('ishell_visited', 'true');
    setShowWelcome(false);
  };

  return (
    <ShellProvider>
      <div className="min-h-screen overflow-hidden">
        {showWelcome ? (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        ) : (
          <>
            <Desktop />
            <WindowManager />
          </>
        )}
      </div>
    </ShellProvider>
  );
};

export default Index;
