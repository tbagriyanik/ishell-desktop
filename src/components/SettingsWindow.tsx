
import React from 'react';
import { useShell } from '../contexts/ShellContext';

const SettingsWindow: React.FC = () => {
  const { state, dispatch, t } = useShell();

  const handleThemeColorChange = (color: string) => {
    dispatch({ type: 'SET_THEME', payload: { primary: color } });
  };

  const handleDesktopBackgroundChange = (color: string) => {
    dispatch({ type: 'SET_THEME', payload: { desktopBackground: color } });
  };

  const handleFontChange = (font: string) => {
    dispatch({ type: 'SET_THEME', payload: { font } });
  };

  const handleIconSizeChange = (size: 'small' | 'medium' | 'large') => {
    dispatch({ type: 'SET_ICON_SIZE', payload: size });
  };

  const handleLanguageChange = (lang: 'en' | 'tr') => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  const handleExport = () => {
    const exportData = {
      theme: state.theme,
      language: state.language,
      timeFormat: state.timeFormat,
      showSeconds: state.showSeconds,
      showDate: state.showDate,
      iconSize: state.iconSize,
      apps: state.apps.filter(app => !['settings', 'add-app'].includes(app.id))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ishell-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          dispatch({ type: 'LOAD_STATE', payload: importData });
        } catch (error) {
          console.error('Import failed:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings?')) {
      localStorage.removeItem('ishell_state');
      window.location.reload();
    }
  };

  const themeColors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
    '#ef4444', '#ec4899', '#6366f1', '#14b8a6'
  ];

  const desktopColors = [
    '#1e293b', '#0f172a', '#374151', '#1f2937',
    '#0c4a6e', '#065f46', '#7c2d12', '#92400e'
  ];

  const fonts = [
    'system-ui', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia',
    'Verdana', 'Courier New', 'Trebuchet MS', 'Comic Sans MS', 'Impact',
    'Palatino', 'Garamond'
  ];

  return (
    <div className="p-6 text-white space-y-6 max-h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">{t('settings')}</h2>

      {/* Theme Color */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{t('theme_color')}</label>
        <div className="flex flex-wrap gap-2">
          {themeColors.map(color => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                state.theme.primary === color ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleThemeColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Desktop Background */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{t('desktop_background')}</label>
        <div className="flex flex-wrap gap-2">
          {desktopColors.map(color => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                state.theme.desktopBackground === color ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleDesktopBackgroundChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{t('font')}</label>
        <select
          value={state.theme.font}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          style={{ fontFamily: state.theme.font }}
        >
          {fonts.map(font => (
            <option key={font} value={font} style={{ fontFamily: font, color: 'black' }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Icon Size */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{t('icon_size')}</label>
        <div className="flex space-x-2">
          {(['small', 'medium', 'large'] as const).map(size => (
            <button
              key={size}
              className={`px-4 py-2 rounded-lg transition-all ${
                state.iconSize === size ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
              }`}
              onClick={() => handleIconSizeChange(size)}
            >
              {t(size)}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{t('language')}</label>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              state.language === 'en' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
            }`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              state.language === 'tr' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
            }`}
            onClick={() => handleLanguageChange('tr')}
          >
            Türkçe
          </button>
        </div>
      </div>

      {/* Time Format */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{t('time_format')}</label>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              state.timeFormat === '12' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
            }`}
            onClick={() => dispatch({ type: 'SET_TIME_FORMAT', payload: '12' })}
          >
            12 Hour
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all ${
              state.timeFormat === '24' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
            }`}
            onClick={() => dispatch({ type: 'SET_TIME_FORMAT', payload: '24' })}
          >
            24 Hour
          </button>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('show_seconds')}</span>
          <button
            className={`w-12 h-6 rounded-full transition-all ${
              state.showSeconds ? 'bg-blue-500' : 'bg-white/20'
            }`}
            onClick={() => dispatch({ type: 'SET_SHOW_SECONDS', payload: !state.showSeconds })}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              state.showSeconds ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('show_date')}</span>
          <button
            className={`w-12 h-6 rounded-full transition-all ${
              state.showDate ? 'bg-blue-500' : 'bg-white/20'
            }`}
            onClick={() => dispatch({ type: 'SET_SHOW_DATE', payload: !state.showDate })}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
              state.showDate ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="border-t border-white/20 pt-6 space-y-4">
        <button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {t('export')}
        </button>

        <label className="block">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <div className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-center cursor-pointer transition-colors">
            {t('import')}
          </div>
        </label>

        <button
          onClick={handleReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};

export default SettingsWindow;
