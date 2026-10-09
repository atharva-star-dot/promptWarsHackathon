import React from 'react';
import { LayoutDashboard, Compass, BookOpen, Shield, Scale, Cpu } from 'lucide-react';
import { useCityStore } from '../store/useCityStore';
import { DashboardTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useCityStore();

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <Shield className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800/80 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
              activeTab === tab.id
                ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
