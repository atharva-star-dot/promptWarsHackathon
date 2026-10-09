import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';
import { City } from '../../types';
import { searchCities, DEMO_CITIES } from '../../services/geocode';
import { useCityStore } from '../../store/useCityStore';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { selectedCity, setSelectedCity } = useCityStore();

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const cities = await searchCities(query);
      setResults(cities);
      setLoading(false);
      setIsOpen(true);
      setSelectedIndex(-1);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    setSelectedCity(city);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation for combobox
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      {/* Screen reader live announcer for autocomplete results */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? 'Searching cities...'
          : isOpen && results.length > 0
          ? `${results.length} cities found. Use up and down arrow keys to navigate.`
          : isOpen && query.length >= 2
          ? 'No cities found.'
          : ''}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center">
        <label htmlFor="city-search-input" className="sr-only">
          Search any city worldwide
        </label>
        <div className="absolute left-4 text-indigo-400 pointer-events-none" aria-hidden="true">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          id="city-search-input"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && results.length > 0}
          aria-controls="city-search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `city-option-${results[selectedIndex]?.id}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search any city worldwide (e.g. Pune, Tokyo, Paris)..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-xl transition-all text-sm md:text-base"
        />
        {selectedCity && !query && (
          <div
            className="absolute right-4 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30"
            aria-label={`Currently active city: ${selectedCity.name}`}
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            {selectedCity.name}
          </div>
        )}
      </div>

      {/* Quick Demo City Chips */}
      <div
        className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400"
        role="group"
        aria-label="Popular demo cities"
      >
        <span className="flex items-center gap-1 font-medium text-slate-400 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" /> Demo:
        </span>
        {DEMO_CITIES.map((city) => (
          <button
            key={city.id}
            type="button"
            aria-label={`Select demo city ${city.name}`}
            onClick={() => handleSelect(city)}
            className={`px-3 py-1 rounded-full border text-xs transition-all ${
              selectedCity.name.toLowerCase() === city.name.toLowerCase()
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md glow-indigo'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/60 hover:border-slate-500'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (results.length > 0 || query.length >= 2) && (
        <div
          id="city-search-results"
          role="listbox"
          aria-label="City search suggestions"
          className="absolute left-0 right-0 top-14 mt-2 bg-[#111827]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800"
        >
          {results.length > 0 ? (
            results.map((city, idx) => (
              <button
                key={city.id}
                id={`city-option-${city.id}`}
                role="option"
                aria-selected={selectedIndex === idx}
                type="button"
                onClick={() => handleSelect(city)}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors group ${
                  selectedIndex === idx ? 'bg-indigo-600/30' : 'hover:bg-indigo-600/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-indigo-500/30 group-hover:text-indigo-300 text-slate-400 transition-colors">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 group-hover:text-indigo-300 text-sm">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {city.admin1 ? `${city.admin1}, ` : ''}
                      {city.country}
                    </div>
                  </div>
                </div>
                {city.population && (
                  <span className="text-xs text-slate-500 font-mono">
                    Pop: {(city.population / 1000000).toFixed(1)}M
                  </span>
                )}
              </button>
            ))
          ) : !loading ? (
            <div className="px-5 py-4 text-sm text-slate-400 text-center">
              No matching cities found. Try another search.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
