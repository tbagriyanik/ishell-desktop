
import React, { useRef, useState, useEffect } from 'react';
import { useShell } from '../contexts/ShellContext';
import { X } from 'lucide-react';

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
  const [resizeDirection, setResizeDirection] = useState('');
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

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && windowRef.current) {
      const newX = Math.max(0, e.clientX - dragOffset.x);
      const newY = Math.max(0, e.clientY - dragOffset.y);
      
      dispatch({
        type: 'UPDATE_WINDOW',
        payload: {
          id: windowId,
          updates: { position: { x: newX, y: newY } }
        }
      });
    }

    if (isResizing && windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      let newWidth = windowState.size.width;
      let newHeight = windowState.size.height;
      let newX = windowState.position.x;
      let newY = windowState.position.y;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(200, e.clientX - rect.left);
      }
      if (resizeDirection.includes('left')) {
        const deltaX = rect.left - e.clientX;
        newWidth = Math.max(200, windowState.size.width + deltaX);
        newX = Math.min(windowState.position.x - deltaX, windowState.position.x + windowState.size.width - 200);
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(200, e.clientY - rect.top);
      }
      if (resizeDirection.includes('top')) {
        const deltaY = rect.top - e.clientY;
        newHeight = Math.max(200, windowState.size.height + deltaY);
        newY = Math.min(windowState.position.y - deltaY, windowState.position.y + windowState.size.height - 200);
      }

      dispatch({
        type: 'UPDATE_WINDOW',
        payload: {
          id: windowId,
          updates: {
            size: { width: newWidth, height: newHeight },
            position: { x: newX, y: newY }
          }
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
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
  }, [isDragging, isResizing, dragOffset, resizeDirection]);

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
        minHeight: 200,
        fontFamily: state.theme.font
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
        
        <button
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Window Content */}
      <div className="h-full bg-white/5 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
        {children}
      </div>

      {/* Resize Handles */}
      {/* Corners */}
      <div 
        className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'top-left')}
      />
      <div 
        className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
        onMouseDown={(e) => handleResizeStart(e, 'top-right')}
      />
      <div 
        className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
      />
      <div 
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
        onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
      />
      
      {/* Edges */}
      <div 
        className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      />
      <div 
        className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
      />
      <div 
        className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      <div 
        className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />

      {/* Visual resize indicator */}
      <div className="absolute bottom-1 right-1 w-3 h-3 opacity-50">
        <div className="w-full h-full flex flex-col justify-end space-y-0.5">
          <div className="flex space-x-0.5">
            <div className="w-0.5 h-0.5 bg-white/50"></div>
            <div className="w-0.5 h-0.5 bg-white/50"></div>
          </div>
          <div className="flex space-x-0.5">
            <div className="w-0.5 h-0.5 bg-white/50"></div>
            <div className="w-0.5 h-0.5 bg-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Window;
