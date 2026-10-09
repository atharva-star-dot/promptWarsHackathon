import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="glass-card p-5 rounded-2xl animate-pulse flex flex-col gap-3">
    <div className="h-5 bg-slate-700/50 rounded w-2/3"></div>
    <div className="h-4 bg-slate-800/50 rounded w-1/2"></div>
    <div className="h-16 bg-slate-800/30 rounded-xl mt-2"></div>
  </div>
);

export const WeatherSkeleton: React.FC = () => (
  <div className="glass-card p-6 rounded-3xl animate-pulse flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <div className="h-8 bg-slate-700/50 rounded w-1/3"></div>
      <div className="h-8 bg-slate-700/50 rounded w-16"></div>
    </div>
    <div className="h-16 bg-slate-800/60 rounded-2xl w-full"></div>
    <div className="grid grid-cols-3 gap-3">
      <div className="h-12 bg-slate-800/40 rounded-xl"></div>
      <div className="h-12 bg-slate-800/40 rounded-xl"></div>
      <div className="h-12 bg-slate-800/40 rounded-xl"></div>
    </div>
  </div>
);

export const MapSkeleton: React.FC = () => (
  <div className="glass-panel w-full h-[400px] md:h-full rounded-3xl animate-pulse flex items-center justify-center">
    <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      Initializing Interactive Map...
    </div>
  </div>
);
