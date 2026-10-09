import React, { useState } from 'react';
import { Compass, Utensils, Hotel, MapPin, DollarSign, CheckCircle2, Navigation } from 'lucide-react';
import { Place, PlaceCategory } from '../../types';
import { CardSkeleton } from '../ui/Skeletons';

interface ExploreTabProps {
  places: Place[];
  loading: boolean;
  onSelectPlaceOnMap?: (place: Place) => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  places,
  loading,
  onSelectPlaceOnMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);

  const filteredPlaces = places.filter((p) => {
    if (p.category === 'safety') return false; // Filter out police/hospitals from hospitality tab
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedBudget !== 'all' && p.budget.toLowerCase() !== selectedBudget.toLowerCase()) return false;
    if (onlyOpenNow && p.openNow === false) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Controls & Filter Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-700/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Category Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md glow-indigo'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Destinations
          </button>
          <button
            onClick={() => setSelectedCategory('attraction')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedCategory === 'attraction'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Attractions
          </button>
          <button
            onClick={() => setSelectedCategory('food')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedCategory === 'food'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Food & Cafes
          </button>
          <button
            onClick={() => setSelectedCategory('hotel')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedCategory === 'hotel'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" /> Stay & Hotels
          </button>
        </div>

        {/* Budget & Open Now Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Budgets</option>
            <option value="budget">Budget-Friendly ($)</option>
            <option value="mid">Mid-Range ($$)</option>
            <option value="premium">Premium ($$$)</option>
          </select>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={onlyOpenNow}
              onChange={(e) => setOnlyOpenNow(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            Open Now
          </label>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="glass-card p-5 rounded-3xl border border-slate-700/60 hover:border-indigo-500/60 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {place.subCategory}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      place.budget === 'Budget'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : place.budget === 'Premium'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {place.budget}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {place.name}
                </h4>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-indigo-400" /> {place.distance} km away
                  </span>
                  {place.rating && (
                    <span className="text-amber-400 font-bold">★ {place.rating.toFixed(1)}</span>
                  )}
                </div>

                {place.address && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">{place.address}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Location
                </div>
                {onSelectPlaceOnMap && (
                  <button
                    onClick={() => onSelectPlaceOnMap(place)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Show on Map
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl text-center text-slate-400 text-sm">
          No places found matching the selected filters.
        </div>
      )}
    </div>
  );
};
