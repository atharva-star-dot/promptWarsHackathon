import React, { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { ExploreTab } from './components/dashboard/ExploreTab';
import { HistoryTab } from './components/dashboard/HistoryTab';
import { SafetyPanel } from './components/dashboard/SafetyPanel';
import { ComparePanel } from './components/dashboard/ComparePanel';
import { InsightsPanel } from './components/dashboard/InsightsPanel';
import { ReportForm } from './components/reports/ReportForm';
import { useCityStore } from './store/useCityStore';
import { usePlaces } from './hooks/usePlaces';
import { useWeather } from './hooks/useWeather';
import { MapSkeleton } from './components/ui/Skeletons';
import { Place } from './types';

// Lazy load heavy components
const Hero3D = lazy(() => import('./components/3d/Hero3D'));
const MapView = lazy(() => import('./components/map/MapView').then((m) => ({ default: m.MapView })));

export const App: React.FC = () => {
  const { selectedCity, activeTab, setActiveTab } = useCityStore();
  const { places, loading: loadingPlaces } = usePlaces(selectedCity.name, selectedCity.latitude, selectedCity.longitude);
  const { data: weather } = useWeather(selectedCity.latitude, selectedCity.longitude);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportLat, setReportLat] = useState<number | undefined>(undefined);
  const [reportLng, setReportLng] = useState<number | undefined>(undefined);
  const [highlightedPlace, setHighlightedPlace] = useState<Place | null>(null);

  const handleOpenReportModal = (lat?: number, lng?: number) => {
    setReportLat(lat);
    setReportLng(lng);
    setIsReportModalOpen(true);
  };

  const handleSelectPlaceOnMap = (place: Place) => {
    setHighlightedPlace(place);
    // Scroll smoothly to map section on mobile/desktop
    const mapElement = document.getElementById('interactive-map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col pb-20 lg:pb-8">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.1 AA) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Sticky Header */}
      <Header />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 w-full space-y-8 flex-1">
        {/* 3D Hero Animation */}
        <Suspense fallback={<div className="h-48 bg-slate-900/40 rounded-3xl animate-pulse"></div>}>
          <Hero3D />
        </Suspense>

        {/* BENTO GRID: Interactive Map + Tab Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Dashboard Tabs Content */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'explore' && (
              <ExploreTab
                places={places}
                loading={loadingPlaces}
                onSelectPlaceOnMap={handleSelectPlaceOnMap}
              />
            )}
            {activeTab === 'history' && (
              <HistoryTab heritagePlaces={places} loadingPlaces={loadingPlaces} />
            )}
            {activeTab === 'safety' && (
              <SafetyPanel
                places={places}
                onOpenReportModal={() => handleOpenReportModal()}
              />
            )}
            {activeTab === 'compare' && <ComparePanel places={places} />}
            {activeTab === 'insights' && <InsightsPanel weather={weather} places={places} />}
          </div>

          {/* Interactive Leaflet Map Column */}
          <div id="interactive-map-section" className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                🗺 Live Interactive Map
              </h3>
              <span className="text-xs text-indigo-400 font-semibold">
                {places.length} OSM Points
              </span>
            </div>

            <Suspense fallback={<MapSkeleton />}>
              <MapView
                places={places}
                onOpenReportModal={handleOpenReportModal}
                highlightedPlaceId={highlightedPlace?.id}
              />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Citizen Report Modal */}
      <ReportForm
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialLat={reportLat}
        initialLng={reportLng}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default App;
