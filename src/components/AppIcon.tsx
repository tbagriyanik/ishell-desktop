
import React, { useState } from 'react';
import { useShell } from '../contexts/ShellContext';

interface AppIconProps {
  app: {
    id: string;
    name: string;
    icon: string;
  };
}

const AppIcon: React.FC<AppIconProps> = ({ app }) => {
  const { state, dispatch, t } = useShell();
  const [isPressed, setIsPressed] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    if (!isDragging) {
      dispatch({ type: 'OPEN_WINDOW', payload: app.id });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'open':
        dispatch({ type: 'OPEN_WINDOW', payload: app.id });
        break;
      case 'edit':
        dispatch({ type: 'OPEN_WINDOW', payload: 'add-app' });
        break;
      case 'delete':
        if (confirm(t('delete') + ' ' + app.name + '?')) {
          dispatch({ type: 'DELETE_APP', payload: app.id });
        }
        break;
    }
    setShowContextMenu(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', app.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const truncatedName = app.name.length > 12 ? app.name.substring(0, 12) + '...' : app.name;

  const getIconSize = () => {
    switch (state.iconSize) {
      case 'small': return 'w-12 h-12 text-lg';
      case 'large': return 'w-20 h-20 text-3xl';
      default: return 'w-16 h-16 text-2xl';
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
          isPressed ? 'scale-95' : 'hover:scale-105'
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ fontFamily: state.theme.font }}
      >
        <div className="relative">
          <div className={`${getIconSize()} bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
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

      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className="fixed bg-white/20 backdrop-blur-md border border-white/30 rounded-lg py-2 min-w-32 z-50"
            style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
          >
            <div
              className="flex items-center px-4 py-2 text-white hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => handleMenuAction('open')}
            >
              <span className="mr-3">📂</span>
              <span>{t('open')}</span>
            </div>
            <div
              className="flex items-center px-4 py-2 text-white hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => handleMenuAction('edit')}
            >
              <span className="mr-3">✏️</span>
              <span>{t('edit')}</span>
            </div>
            <div
              className="flex items-center px-4 py-2 text-white hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => handleMenuAction('delete')}
            >
              <span className="mr-3">🗑️</span>
              <span>{t('delete')}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AppIcon;
