
import React, { useState } from 'react';
import { useShell } from '../contexts/ShellContext';

interface AppIconProps {
  app: {
    id: string;
    name: string;
    icon: string;
  };
  onContextMenu: (e: React.MouseEvent, appId: string) => void;
}

const AppIcon: React.FC<AppIconProps> = ({ app, onContextMenu }) => {
  const { dispatch } = useShell();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    dispatch({ type: 'OPEN_WINDOW', payload: app.id });
  };

  const truncatedName = app.name.length > 12 ? app.name.substring(0, 12) + '...' : app.name;

  return (
    <div
      className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
        isPressed ? 'scale-95' : 'hover:scale-105'
      }`}
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(e, app.id)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-shadow">
          {app.icon}
        </div>
        {isPressed && (
          <div className="absolute inset-0 bg-white/20 rounded-2xl" />
        )}
      </div>
      <span className="text-white text-sm mt-2 text-center font-medium">
        {truncatedName}
      </span>
    </div>
  );
};

export default AppIcon;
