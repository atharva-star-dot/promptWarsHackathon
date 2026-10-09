import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Scale, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { Place, ComparisonMetrics } from '../../types';
import { useCityStore } from '../../store/useCityStore';
import { computeComparisonMetrics } from '../../lib/scoring';
import { DEMO_CITIES } from '../../services/geocode';

interface ComparePanelProps {
  places: Place[];
}

export const ComparePanel: React.FC<ComparePanelProps> = ({ places }) => {
  const { selectedCity } = useCityStore();

  const [compareItem1, setCompareItem1] = useState<string>(selectedCity.name);
  const [compareItem2, setCompareItem2] = useState<string>('Mumbai');

  const metrics1 = computeComparisonMetrics(compareItem1, compareItem1 === selectedCity.name ? places : undefined);
  const metrics2 = computeComparisonMetrics(compareItem2, compareItem2 === selectedCity.name ? places : undefined);

  // Format data for Recharts Radar Chart
  const radarData = [
    { subject: 'Safety', A: metrics1.safety, B: metrics2.safety, fullMark: 100 },
    { subject: 'Cleanliness', A: metrics1.cleanliness, B: metrics2.cleanliness, fullMark: 100 },
    { subject: 'Affordability', A: metrics1.affordability, B: metrics2.affordability, fullMark: 100 },
    { subject: 'Rating', A: metrics1.rating, B: metrics2.rating, fullMark: 100 },
    { subject: 'Accessibility', A: metrics1.accessibility, B: metrics2.accessibility, fullMark: 100 },
  ];

  // Winner calculation
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

        {/* Selectors */}
        <div className="flex items-center gap-3">
          <select
            value={compareItem1}
            onChange={(e) => setCompareItem1(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={selectedCity.name}>{selectedCity.name} (Current)</option>
            {places.slice(0, 5).map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500">VS</span>

          <select
            value={compareItem2}
            onChange={(e) => setCompareItem2(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Multi-Dimensional Radar Comparison
          </h3>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name={compareItem1} dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                <Radar name={compareItem2} dataKey="B" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Winners Table */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Category Breakdown & Winners
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
                  className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{row.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {compareItem1}: <span className="text-indigo-400 font-semibold">{row.m1}</span> | {compareItem2}: <span className="text-cyan-400 font-semibold">{row.m2}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30">
                    <Trophy className="w-3.5 h-3.5" /> {winner}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
