
import React, { useRef, useState, useEffect } from 'react';
import { useShell } from '../contexts/ShellContext';

interface WindowProps {
  windowId: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ windowId, title, icon, children }) => {
  const { state, dispatch } = useShell();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowState = state.windows[windowId];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
      }
    }
    dispatch({ type: 'BRING_TO_FRONT', payload: windowId });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && windowRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      dispatch({
        type: 'UPDATE_WINDOW',
        payload: {
          id: windowId,
          updates: { position: { x: newX, y: newY } }
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_WINDOW', payload: windowId });
  };

  if (!windowState || !windowState.isOpen) return null;

  return (
    <div
      ref={windowRef}
      className="fixed bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden select-none"
      style={{
        left: windowState.position.x,
        top: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
        minWidth: 200,
        minHeight: 200
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-move"
        style={{ backgroundColor: state.theme.primary }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <span className="text-white font-medium">{title}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          />
          <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors" />
          <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full bg-white/5 overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
        <div className="absolute bottom-1 right-1 w-0 h-0 border-l-2 border-b-2 border-white/50" />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-l-2 border-b-2 border-white/50" />
        <div className="absolute bottom-0 right-1 w-0 h-0 border-l-2 border-b-2 border-white/50" />
      </div>
    </div>
  );
};

export default Window;
