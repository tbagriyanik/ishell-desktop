
import React, { useState, useEffect } from 'react';
import { useShell } from '../contexts/ShellContext';
import SearchBar from './SearchBar';

const Taskbar: React.FC = () => {
  const { state, t } = useShell();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: state.timeFormat === '12'
    };

    if (state.showSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString(state.language === 'tr' ? 'tr-TR' : 'en-US', options);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(state.language === 'tr' ? 'tr-TR' : 'en-US');
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-16 backdrop-blur-md bg-white/10 border-t border-white/20 flex items-center justify-between px-6 z-50"
      style={{ fontFamily: state.theme.font }}
    >
      {/* Left side - Search */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* Center - Active Windows */}
      <div className="flex space-x-2">
        {Object.values(state.windows)
          .filter(window => window.isOpen)
          .map(window => (
            <div
              key={window.id}
              className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => {
                // Bring window to front
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          ))}
      </div>

      {/* Right side - Clock */}
      <div className="flex-1 flex justify-end">
        <div className="text-white text-right">
          <div className="font-medium">{formatTime(currentTime)}</div>
          {state.showDate && (
            <div className="text-xs text-white/70">{formatDate(currentTime)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
