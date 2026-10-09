import React from 'react';
import { Landmark, BookOpen, ExternalLink, ShieldAlert } from 'lucide-react';
import { Place } from '../../types';
import { useCityStore } from '../../store/useCityStore';
import { useWiki } from '../../hooks/useWiki';
import { CardSkeleton } from '../ui/Skeletons';

interface HistoryTabProps {
  heritagePlaces: Place[];
  loadingPlaces: boolean;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  heritagePlaces,
  loadingPlaces,
}) => {
  const { selectedCity } = useCityStore();
  const { wiki, loading: loadingWiki } = useWiki(selectedCity.name);

  const heritageList = heritagePlaces.filter((p) => p.category === 'heritage');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Wikipedia Summary Hero Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <BookOpen className="w-4 h-4" /> Cultural Archives & Heritage
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              History & Heritage of {selectedCity.name}
            </h2>
            {loadingWiki ? (
              <div className="h-20 bg-slate-800/50 rounded-xl animate-pulse"></div>
            ) : wiki ? (
              <p className="text-slate-300 text-sm leading-relaxed">
                {wiki.summary}
              </p>
            ) : null}

            {wiki?.url && (
              <a
                href={wiki.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2 transition-colors"
              >
                Read full article on Wikipedia <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {wiki?.thumbnail ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl h-48 md:h-56">
              <img
                src={wiki.thumbnail}
                alt={selectedCity.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-[10px] text-slate-300 font-semibold bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md">
                Wikipedia Archive Media
              </div>
            </div>
          ) : (
            <div className="h-48 md:h-56 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
              Historical Media Archive
            </div>
          )}
        </div>
      </div>

      {/* Heritage Landmarks Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Landmark className="w-4 h-4 text-emerald-400" /> Historic Monuments, Museums & Places of Worship
        </h3>

        {loadingPlaces ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : heritageList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heritageList.map((place) => (
              <div
                key={place.id}
                className="glass-card p-5 rounded-3xl border border-slate-700/60 hover:border-emerald-500/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {place.subCategory}
                  </span>
                  <h4 className="text-base font-bold text-white mt-2 truncate">{place.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {place.distance} km from city center
                  </p>
                </div>
                {place.address && (
                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                    {place.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-sm">
            Heritage landmark records loading from OpenStreetMap...
          </div>
        )}
      </div>
    </div>
  );
};
