import React from 'react';
import { Activity, Compass, Shield, BookOpen, Scale, Cpu, LayoutDashboard } from 'lucide-react';
import { SearchBar } from './ui/SearchBar';
import { useCityStore } from '../store/useCityStore';
import { DashboardTab } from '../types';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useCityStore();

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <Shield className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" /> },
    { id: 'insights', label: 'AI Insights', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          aria-label="CityPulse Home, go to Overview"
          className="flex items-center gap-2.5 shrink-0 text-left focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl"
          onClick={() => setActiveTab('overview')}
        >
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white rounded-2xl shadow-lg glow-indigo">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">
              City<span className="text-indigo-400">Pulse</span>
            </span>
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block -mt-1">
              Urban Intelligence
            </span>
          </div>
        </button>

        {/* Search Bar */}
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>

        {/* Desktop Tabs */}
        <nav
          aria-label="Dashboard navigation tabs"
          className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shrink-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md glow-indigo'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
