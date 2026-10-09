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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectedCity, setSelectedCity } = useCityStore();

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const cities = await searchCities(query);
      setResults(cities);
      setLoading(false);
      setIsOpen(true);
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
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      {/* Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-indigo-400 pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search any city worldwide (e.g. Pune, Tokyo, Paris)..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-xl transition-all text-sm md:text-base"
        />
        {selectedCity && !query && (
          <div className="absolute right-4 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
            <MapPin className="w-3.5 h-3.5" />
            {selectedCity.name}
          </div>
        )}
      </div>

      {/* Quick Demo City Chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium text-slate-400 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo:
        </span>
        {DEMO_CITIES.map((city) => (
          <button
            key={city.id}
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
        <div className="absolute left-0 right-0 top-14 mt-2 bg-[#111827]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
          {results.length > 0 ? (
            results.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-indigo-600/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-indigo-500/30 group-hover:text-indigo-300 text-slate-400 transition-colors">
                    <MapPin className="w-4 h-4" />
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
