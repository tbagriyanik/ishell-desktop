
import React from 'react';
import { useShell } from '../contexts/ShellContext';
import Window from './Window';
import SettingsWindow from './SettingsWindow';
import AddAppWindow from './AddAppWindow';

const WindowManager: React.FC = () => {
  const { state } = useShell();

  return (
    <>
      {Object.values(state.windows)
        .filter(window => window.isOpen)
        .map(window => {
          let content;
          
          switch (window.id) {
            case 'settings':
              content = <SettingsWindow />;
              break;
            case 'add-app':
              content = <AddAppWindow />;
              break;
            default:
              const app = state.apps.find(a => a.id === window.id);
              if (app && app.code) {
                content = (
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: app.code }}
                  />
                );
              } else {
                content = <div className="p-4 text-white">App not found</div>;
              }
          }

          return (
            <Window
              key={window.id}
              windowId={window.id}
              title={state.apps.find(a => a.id === window.id)?.name || window.id}
              icon={state.apps.find(a => a.id === window.id)?.icon || '📱'}
            >
              {content}
            </Window>
          );
        })}
    </>
  );
};

export default WindowManager;
