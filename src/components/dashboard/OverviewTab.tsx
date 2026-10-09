import React from 'react';
import { Cloud, Thermometer, Wind, Droplets, Sun, AlertOctagon, Clock, MapPin, Users } from 'lucide-react';
import { useCityStore } from '../../store/useCityStore';
import { useWeather } from '../../hooks/useWeather';
import { WeatherSkeleton } from '../ui/Skeletons';

export const OverviewTab: React.FC = () => {
  const { selectedCity } = useCityStore();
  const { data: weather, loading, error } = useWeather(selectedCity.latitude, selectedCity.longitude);

  const getLocalTime = () => {
    try {
      const date = new Date();
      return new Intl.DateTimeFormat('en-US', {
        timeZone: selectedCity.timezone || 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (e) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* City Banner & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City Info Card */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
              <MapPin className="w-3.5 h-3.5" /> {selectedCity.admin1 ? `${selectedCity.admin1}, ` : ''}{selectedCity.country}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              {selectedCity.name}
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Smart exploration dashboard mapping real-time weather, civic safety, historical heritage, and community reporting.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Population</div>
                <div className="text-sm font-bold text-slate-100">
                  {selectedCity.population ? `${(selectedCity.population / 1000000).toFixed(1)}M` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Local Time</div>
                <div className="text-sm font-bold text-slate-100">{getLocalTime()}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Coords</div>
                <div className="text-xs font-bold text-slate-100">
                  {selectedCity.latitude.toFixed(2)}°, {selectedCity.longitude.toFixed(2)}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Weather Card */}
        {loading ? (
          <WeatherSkeleton />
        ) : weather ? (
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-xl flex flex-col justify-between relative">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Weather</div>
                <div className="text-4xl font-extrabold text-white mt-1">{weather.temp}°C</div>
                <div className="text-xs text-indigo-300 font-medium">Feels like {weather.feelsLike}°C</div>
              </div>
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <Cloud className="w-8 h-8" />
              </div>
            </div>

            <div className="text-sm font-semibold text-slate-200 mt-2">{weather.conditionText}</div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <Droplets className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400">Humidity</div>
                <div className="text-xs font-bold text-slate-200">{weather.humidity}%</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <Wind className="w-3.5 h-3.5 text-purple-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400">Wind</div>
                <div className="text-xs font-bold text-slate-200">{weather.windSpeed} km/h</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <Sun className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400">UV Index</div>
                <div className="text-xs font-bold text-slate-200">{weather.uvIndex}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-3xl text-slate-400 text-sm">Weather data unavailable</div>
        )}
      </div>

      {/* Severe Weather Alert Banner if present */}
      {weather?.alertBanner && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-3 animate-pulse">
          <AlertOctagon className="w-6 h-6 shrink-0 text-rose-400" />
          <div className="text-xs md:text-sm font-semibold">{weather.alertBanner}</div>
        </div>
      )}

      {/* 5-Day Forecast Grid */}
      {weather?.forecast && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-indigo-400" /> 5-Day Atmospheric Forecast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {weather.forecast.map((day, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center flex flex-col items-center justify-between hover:border-indigo-500/50 transition-colors"
              >
                <div className="text-xs font-bold text-slate-300">{day.dayName}</div>
                <Cloud className="w-6 h-6 text-indigo-400 my-2" />
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-100">{day.tempMax}°</span>
                  <span className="text-slate-500">{day.tempMin}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
