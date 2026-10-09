import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Scale, Trophy, Sparkles } from 'lucide-react';
import { Place } from '../../types';
import { useCityStore } from '../../store/useCityStore';
import { computeComparisonMetrics } from '../../lib/scoring';
import { DEMO_CITIES } from '../../services/geocode';

interface ComparePanelProps {
  places: Place[];
}

// Fix 3: helper to shorten legend labels
const shortName = (name: string, max: number) =>
  name.length > max ? name.slice(0, max - 1) + '…' : name;

// Fix 5: pick a default second item that differs from item1
function pickDefaultItem2(item1: string): string {
  for (const c of DEMO_CITIES) {
    if (c.name !== item1) return c.name;
  }
  return '';
}

export const ComparePanel: React.FC<ComparePanelProps> = ({ places }) => {
  const { selectedCity } = useCityStore();

  // Fix 6: initialise from selectedCity; reset when it changes
  const [compareItem1, setCompareItem1] = useState<string>(selectedCity.name);
  const [compareItem2, setCompareItem2] = useState<string>(
    pickDefaultItem2(selectedCity.name)
  );

  useEffect(() => {
    setCompareItem1(selectedCity.name);
    setCompareItem2((prev) =>
      prev === selectedCity.name ? pickDefaultItem2(selectedCity.name) : prev
    );
  }, [selectedCity.name]);

  // Fix 5: guard – if only one option exists show empty state
  const allOptions = [
    selectedCity.name,
    ...places.slice(0, 5).map((p) => p.name),
    ...DEMO_CITIES.map((c) => c.name),
    ...places.slice(5, 10).map((p) => p.name),
  ];
  const uniqueOptions = Array.from(new Set(allOptions));
  const onlyOneOption = uniqueOptions.length <= 1;

  const metrics1 = computeComparisonMetrics(
    compareItem1,
    compareItem1 === selectedCity.name ? places : undefined
  );
  const metrics2 = computeComparisonMetrics(
    compareItem2,
    compareItem2 === selectedCity.name ? places : undefined
  );

  const radarData = [
    { subject: 'Safety', A: metrics1.safety, B: metrics2.safety, fullMark: 100 },
    { subject: 'Cleanliness', A: metrics1.cleanliness, B: metrics2.cleanliness, fullMark: 100 },
    { subject: 'Affordability', A: metrics1.affordability, B: metrics2.affordability, fullMark: 100 },
    { subject: 'Rating', A: metrics1.rating, B: metrics2.rating, fullMark: 100 },
    { subject: 'Accessibility', A: metrics1.accessibility, B: metrics2.accessibility, fullMark: 100 },
  ];

  const getWinner = (m1: number, m2: number) => {
    if (m1 > m2) return compareItem1;
    if (m2 > m1) return compareItem2;
    return 'Tie';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Compare Header & Selectors */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <Scale className="w-4 h-4" /> Comparative Urban Analytics
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Estimated Metrics
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Best vs. Worst Multi-Factor Comparison
          </h2>
        </div>

        {/* Fix 1: flex-wrap + gap-2 container; each select max-w-[180px] */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={compareItem1}
            onChange={(e) => setCompareItem1(e.target.value)}
            aria-label="First location to compare"
            className="max-w-[180px] truncate px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={selectedCity.name}>{selectedCity.name} (Current)</option>
            {places.slice(0, 5).map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500" aria-hidden="true">VS</span>

          <select
            value={compareItem2}
            onChange={(e) => setCompareItem2(e.target.value)}
            aria-label="Second location to compare"
            className="max-w-[180px] truncate px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DEMO_CITIES.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
            {places.slice(5, 10).map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fix 5: single-option empty state */}
      {onlyOneOption ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 text-center text-slate-400 text-sm">
          Add another place to compare
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Multi-Dimensional Radar Comparison
            </h3>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                {/* Fix 3: outerRadius reduced to 65% */}
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  {/* Fix 4: readable tick colour + size */}
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  {/* Fix 3: shorten legend names */}
                  <Radar name={shortName(compareItem1, 18)} dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  <Radar name={shortName(compareItem2, 18)} dataKey="B" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Winners Table */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Category Breakdown &amp; Winners
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Safety Index', m1: metrics1.safety, m2: metrics2.safety },
                { label: 'Cleanliness Proxy', m1: metrics1.cleanliness, m2: metrics2.cleanliness },
                { label: 'Affordability', m1: metrics1.affordability, m2: metrics2.affordability },
                { label: 'Overall Rating', m1: metrics1.rating, m2: metrics2.rating },
                { label: 'Accessibility', m1: metrics1.accessibility, m2: metrics2.accessibility },
              ].map((row, idx) => {
                const winner = getWinner(row.m1, row.m2);
                return (
                  <div
                    key={idx}
                    className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-2"
                  >
                    {/* Fix 2: min-w-0 so text can shrink and truncate */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200">{row.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {compareItem1}: <span className="text-indigo-400 font-semibold">{row.m1}</span> | {compareItem2}: <span className="text-cyan-400 font-semibold">{row.m2}</span>
                      </div>
                    </div>

                    {/* Fix 2: shrink-0 + max-w-[40%] + truncate on badge */}
                    <div className="shrink-0 max-w-[40%] truncate flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30">
                      <Trophy className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{winner}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
