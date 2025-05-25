
import React, { useState, useEffect, useRef } from 'react';
import { useShell } from '../contexts/ShellContext';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { state, dispatch, t } = useShell();
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.searchQuery) {
      const results = state.apps.filter(app => 
        app.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [state.searchQuery, state.apps]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleResultClick = (appId: string) => {
    dispatch({ type: 'OPEN_WINDOW', payload: appId });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className={`flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 transition-all ${
          isOpen ? 'bg-white/30' : ''
        }`}
      >
        <Search className="w-4 h-4 text-white/70 mr-2" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search apps..."
          value={state.searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="bg-transparent text-white placeholder-white/70 outline-none flex-1"
        />
      </div>

      {/* Search Results */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 overflow-hidden z-50">
          {searchResults.map(app => (
            <div
              key={app.id}
              className="flex items-center px-3 py-2 hover:bg-white/20 cursor-pointer transition-colors"
              onClick={() => handleResultClick(app.id)}
            >
              <span className="text-lg mr-3">{app.icon}</span>
              <span className="text-white">{app.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && state.searchQuery && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 px-3 py-2">
          <span className="text-white/70">{t('no_results')}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
