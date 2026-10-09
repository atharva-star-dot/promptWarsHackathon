import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Route, PlusCircle, Building2, Cross } from 'lucide-react';
import { Place } from '../../types';
import { useCityStore } from '../../store/useCityStore';
import { computeSafetyScore } from '../../lib/scoring';

interface SafetyPanelProps {
  places: Place[];
  onOpenReportModal: () => void;
}

export const SafetyPanel: React.FC<SafetyPanelProps> = ({ places, onOpenReportModal }) => {
  const { selectedCity, reports } = useCityStore();
  const safety = computeSafetyScore(places);

  const safePoints = places.filter((p) => p.category === 'safety');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Safety Gauge & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safety Score Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Civic Safety Score
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Estimated
                </span>
              </div>
              <div className="text-5xl font-extrabold text-white mt-3 flex items-baseline gap-2">
                {safety.score}
                <span className="text-lg text-slate-500 font-normal">/100</span>
              </div>
            </div>
            <div
              className={`p-4 rounded-2xl border shadow-lg ${
                safety.score >= 80
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Safety Tier: {safety.level}</span>
            <span className="text-slate-400">{safePoints.length} verified safety hubs</span>
          </div>
        </div>

        {/* Safe Route Hint */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
              <Route className="w-4 h-4" /> Safe Transit & Mobility Hint
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Recommended Nighttime Mobility Protocol
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {safety.safeRouteHint}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-400">
                🛡 Police Hubs: {safety.policeCount}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                🏥 Hospitals: {safety.hospitalCount}
              </span>
            </div>

            <button
              type="button"
              aria-label="Report hazard or incident in this city"
              onClick={onOpenReportModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" /> Report Hazard / Incident
            </button>
          </div>
        </div>
      </div>

      {/* Safe Points Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" /> Police Stations & Emergency Medical Hubs
        </h3>

        {safePoints.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safePoints.map((point) => (
              <div
                key={point.id}
                className="glass-card p-5 rounded-3xl border border-slate-700/60 hover:border-blue-500/60 transition-all flex justify-between items-center gap-3"
              >
                {/* Fix 7: min-w-0 so text can shrink; truncate long names */}
                <div className="min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {point.subCategory}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5 truncate">{point.name}</h4>
                  <div className="text-xs text-slate-400 mt-1">{point.distance} km from center</div>
                </div>
                {/* Fix 7: shrink-0 so icon box never collapses */}
                <div className="shrink-0 p-3 bg-slate-800 rounded-2xl text-blue-400">
                  {point.subCategory.toLowerCase().includes('police') ? '👮' : '🏥'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-sm">
            Searching police and hospital infrastructure in OSM...
          </div>
        )}
      </div>
    </div>
  );
};
