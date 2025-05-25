
import React, { useEffect, useState } from 'react';
import { useShell } from '../contexts/ShellContext';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { t } = useShell();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center text-white space-y-8">
        <div className="space-y-4">
          <div className="text-8xl mb-8">🚀</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            iShell
          </h1>
          <p className="text-xl text-blue-200 max-w-md mx-auto">
            {t('welcome')} - AI destekli modern masaüstü deneyimi
          </p>
        </div>
        
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
        >
          {t('get_started')}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
