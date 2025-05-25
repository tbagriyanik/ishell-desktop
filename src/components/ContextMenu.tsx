
import React, { useEffect, useRef } from 'react';
import { useShell } from '../contexts/ShellContext';

interface ContextMenuProps {
  x: number;
  y: number;
  onAction: (action: string) => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onAction, onClose }) => {
  const { t } = useShell();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { key: 'new_app', label: t('new_app'), icon: '➕' },
    { key: 'settings', label: t('settings'), icon: '⚙️' },
    { key: 'arrange_icons', label: t('arrange_icons'), icon: '📐' },
    { key: 'refresh', label: t('refresh'), icon: '🔄' }
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-white/20 backdrop-blur-md border border-white/30 rounded-lg py-2 min-w-48 z-50"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => (
        <div
          key={item.key}
          className="flex items-center px-4 py-2 text-white hover:bg-white/20 cursor-pointer transition-colors"
          onClick={() => onAction(item.key)}
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
