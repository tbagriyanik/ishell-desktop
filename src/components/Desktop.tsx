
import React, { useState, useRef } from 'react';
import { useShell } from '../contexts/ShellContext';
import AppIcon from './AppIcon';
import Taskbar from './Taskbar';
import ContextMenu from './ContextMenu';

const Desktop: React.FC = () => {
  const { state, dispatch } = useShell();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleClick = () => {
    setContextMenu(null);
  };

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case 'new_app':
        dispatch({ type: 'OPEN_WINDOW', payload: 'add-app' });
        break;
      case 'settings':
        dispatch({ type: 'OPEN_WINDOW', payload: 'settings' });
        break;
      case 'arrange_icons':
        // Implement icon arrangement logic
        break;
      case 'refresh':
        dispatch({ type: 'REFRESH' });
        break;
    }
    setContextMenu(null);
  };

  return (
    <div
      ref={desktopRef}
      className="min-h-screen relative overflow-hidden pt-16"
      style={{ 
        backgroundColor: state.theme.desktopBackground,
        fontFamily: state.theme.font 
      }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {/* Desktop Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-slate-900/20 to-slate-800/20" />
      
      {/* App Icons */}
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-6 gap-6 max-w-screen-xl">
          {state.apps.map((app) => (
            <AppIcon key={app.id} app={app} />
          ))}
        </div>
      </div>

      {/* Taskbar at top */}
      <Taskbar />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default Desktop;
