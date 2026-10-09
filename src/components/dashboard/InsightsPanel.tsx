import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Cpu, AlertTriangle, MessageSquare, CheckCircle, Flame } from 'lucide-react';
import { WeatherData, Place } from '../../types';
import { useCityStore } from '../../store/useCityStore';
import { generateAIInsights, analyzeReportSentiment } from '../../lib/nlpEngine';
import { computeSafetyScore } from '../../lib/scoring';

interface InsightsPanelProps {
  weather: WeatherData | null;
  places: Place[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ weather, places }) => {
  const { selectedCity, reports } = useCityStore();

  const safety = computeSafetyScore(places);
  const aiInsights = generateAIInsights(selectedCity.name, weather, places, safety, reports);

  // Traffic Curve Data (Typical day curve, 24h, demo data)
  const trafficData = [
    { hour: '00:00', congestion: 12 },
    { hour: '03:00', congestion: 8 },
    { hour: '06:00', congestion: 25 },
    { hour: '09:00', congestion: 88 },
    { hour: '12:00', congestion: 52 },
    { hour: '15:00', congestion: 64 },
    { hour: '18:00', congestion: 94 },
    { hour: '21:00', congestion: 45 },
    { hour: '23:59', congestion: 20 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> Rule-Based Urban AI Engine
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Smart City AI Insights & Predictive Patterns
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Actionable Recommendations
          </h3>

          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-2xl border transition-all ${
                  insight.severity === 'warning'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : insight.severity === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">
                    {insight.category}
                  </span>
                  {insight.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-sm font-bold text-white mb-1">{insight.title}</div>
                <div className="text-xs opacity-90 leading-relaxed">{insight.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Curve (Simulated Demo Data) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> Hourly Traffic Congestion Profile
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo Data
              </span>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <YAxis stroke="#475569" domain={[0, 100]} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="congestion" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorCongestion)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Peak Rush Hour: 09:00 AM & 06:00 PM</span>
            <span className="text-amber-400 font-semibold">Typical Day Curve</span>
          </div>
        </div>
      </div>

      {/* Citizen Report Feed with Sentiment Tagging */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" /> Community Report Activity & Sentiment Feed
        </h3>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reports.slice(0, 4).map((report) => {
              const sentiment = analyzeReportSentiment(report.description);
              return (
                <div key={report.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white capitalize">{report.type}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        sentiment === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : sentiment === 'Warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {sentiment} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{report.description}</p>
                  <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800">
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>Local Community Marker</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/40 text-center text-xs text-slate-400">
            No citizen reports submitted yet. Use the "Report Issue" button to contribute!
          </div>
        )}
      </div>
    </div>
  );
};
