import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface AppData {
  id: string;
  name: string;
  icon: string;
  code: string;
  prompt: string;
  position: { x: number; y: number };
}

interface WindowState {
  id: string;
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

interface ShellState {
  theme: {
    primary: string;
    background: string;
    desktopBackground: string;
    font: string;
  };
  language: 'en' | 'tr';
  timeFormat: '12' | '24';
  showSeconds: boolean;
  showDate: boolean;
  iconSize: 'small' | 'medium' | 'large';
  apps: AppData[];
  windows: { [key: string]: WindowState };
  nextZIndex: number;
  searchQuery: string;
}

interface ShellContextType {
  state: ShellState;
  dispatch: React.Dispatch<any>;
  t: (key: string) => string;
}

const initialState: ShellState = {
  theme: {
    primary: '#3b82f6',
    background: '#1e293b',
    desktopBackground: '#1e293b',
    font: 'system-ui'
  },
  language: 'en',
  timeFormat: '24',
  showSeconds: true,
  showDate: true,
  iconSize: 'medium',
  apps: [
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      code: '',
      prompt: '',
      position: { x: 50, y: 50 }
    },
    {
      id: 'add-app',
      name: 'Add App',
      icon: '➕',
      code: '',
      prompt: '',
      position: { x: 150, y: 50 }
    }
  ],
  windows: {},
  nextZIndex: 1000,
  searchQuery: ''
};

const translations = {
  en: {
    'welcome': 'Welcome to iShell',
    'settings': 'Settings',
    'add_app': 'Add App',
    'theme_color': 'Theme Color',
    'background_color': 'Background Color',
    'desktop_background': 'Desktop Background',
    'font': 'Font',
    'icon_size': 'Icon Size',
    'language': 'Language',
    'time_format': 'Time Format',
    'show_seconds': 'Show Seconds',
    'show_date': 'Show Date',
    'export': 'Export',
    'import': 'Import',
    'reset': 'Reset',
    'open': 'Open',
    'edit': 'Edit',
    'delete': 'Delete',
    'new_app': 'New App',
    'arrange_icons': 'Arrange Icons',
    'refresh': 'Refresh',
    'no_results': 'No results found',
    'get_started': 'Get Started',
    'small': 'Small',
    'medium': 'Medium',
    'large': 'Large'
  },
  tr: {
    'welcome': 'iShell\'e Hoş Geldiniz',
    'settings': 'Ayarlar',
    'add_app': 'Uygulama Ekle',
    'theme_color': 'Tema Rengi',
    'background_color': 'Arkaplan Rengi',
    'desktop_background': 'Masaüstü Arkaplanı',
    'font': 'Yazı Tipi',
    'icon_size': 'Simge Boyutu',
    'language': 'Dil',
    'time_format': 'Saat Formatı',
    'show_seconds': 'Saniye Göster',
    'show_date': 'Tarih Göster',
    'export': 'Dışa Aktar',
    'import': 'İçe Aktar',
    'reset': 'Sıfırla',
    'open': 'Aç',
    'edit': 'Düzenle',
    'delete': 'Sil',
    'new_app': 'Yeni Uygulama',
    'arrange_icons': 'Simgeleri Diz',
    'refresh': 'Yenile',
    'no_results': 'Sonuç bulunamadı',
    'get_started': 'Başlayın',
    'small': 'Küçük',
    'medium': 'Orta',
    'large': 'Büyük'
  }
};

const shellReducer = (state: ShellState, action: any): ShellState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload } };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_TIME_FORMAT':
      return { ...state, timeFormat: action.payload };
    case 'SET_SHOW_SECONDS':
      return { ...state, showSeconds: action.payload };
    case 'SET_SHOW_DATE':
      return { ...state, showDate: action.payload };
    case 'SET_ICON_SIZE':
      return { ...state, iconSize: action.payload };
    case 'ADD_APP':
      return { ...state, apps: [...state.apps, action.payload] };
    case 'UPDATE_APP':
      return {
        ...state,
        apps: state.apps.map(app => 
          app.id === action.payload.id ? { ...app, ...action.payload } : app
        )
      };
    case 'DELETE_APP':
      return {
        ...state,
        apps: state.apps.filter(app => app.id !== action.payload)
      };
    case 'OPEN_WINDOW':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload]: {
            id: action.payload,
            isOpen: true,
            position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
            size: { width: 600, height: 400 },
            isMinimized: false,
            zIndex: state.nextZIndex
          }
        },
        nextZIndex: state.nextZIndex + 1
      };
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload]: {
            ...state.windows[action.payload],
            isOpen: false
          }
        }
      };
    case 'UPDATE_WINDOW':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...state.windows[action.payload.id],
            ...action.payload.updates
          }
        }
      };
    case 'BRING_TO_FRONT':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload]: {
            ...state.windows[action.payload],
            zIndex: state.nextZIndex
          }
        },
        nextZIndex: state.nextZIndex + 1
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'REFRESH':
      window.location.reload();
      return state;
    default:
      return state;
  }
};

const ShellContext = createContext<ShellContextType | null>(null);

export const ShellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shellReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('ishell_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    const stateToSave = {
      theme: state.theme,
      language: state.language,
      timeFormat: state.timeFormat,
      showSeconds: state.showSeconds,
      showDate: state.showDate,
      iconSize: state.iconSize,
      apps: state.apps.filter(app => !['settings', 'add-app'].includes(app.id))
    };
    localStorage.setItem('ishell_state', JSON.stringify(stateToSave));
  }, [state.theme, state.language, state.timeFormat, state.showSeconds, state.showDate, state.iconSize, state.apps]);

  const t = (key: string): string => {
    return translations[state.language][key] || key;
  };

  return (
    <ShellContext.Provider value={{ state, dispatch, t }}>
      {children}
    </ShellContext.Provider>
  );
};

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
};
