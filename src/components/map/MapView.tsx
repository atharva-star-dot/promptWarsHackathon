import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Locate, ShieldAlert, PlusCircle, Filter } from 'lucide-react';
import { Place, CitizenReport, PlaceCategory } from '../../types';
import { useCityStore } from '../../store/useCityStore';

// Custom SVG Icons for categories
const createSvgIcon = (color: string, symbol: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="7" fill="#ffffff"/>
      <text x="12" y="15" font-size="10" font-weight="bold" text-anchor="middle" fill="${color}">${symbol}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-map-icon',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36],
  });
};

const ICONS: Record<PlaceCategory | 'report', L.DivIcon> = {
  attraction: createSvgIcon('#8B5CF6', '★'),
  food: createSvgIcon('#F59E0B', '🍔'),
  hotel: createSvgIcon('#06B6D4', '🏨'),
  heritage: createSvgIcon('#10B981', '🏛'),
  safety: createSvgIcon('#3B82F6', '🛡'),
  report: createSvgIcon('#F43F5E', '⚠️'),
};

const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
};

const MapClickEvents: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

interface MapViewProps {
  places: Place[];
  onOpenReportModal: (lat?: number, lng?: number) => void;
  highlightedPlaceId?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  onOpenReportModal,
  highlightedPlaceId,
}) => {
  const { selectedCity, mapFilters, toggleMapFilter, reports } = useCityStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          alert('Geolocation permission denied or unavailable.');
        }
      );
    }
  };

  const filteredPlaces = places.filter((p) => mapFilters[p.category]);
  const cityReports = reports.filter((r) => r.cityId === selectedCity.name || true);

  return (
    <div className="relative w-full h-[450px] md:h-[600px] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl glass-panel">
      {/* Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Filters */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-2 bg-[#0F172A]/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl">
          <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Layers:
          </span>
          {(['attraction', 'food', 'hotel', 'heritage', 'safety'] as PlaceCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => toggleMapFilter(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                mapFilters[cat]
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => onOpenReportModal()}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-bold rounded-2xl text-xs shadow-lg backdrop-blur-md transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Report Issue
          </button>
          <button
            onClick={handleLocateMe}
            className="p-2.5 bg-slate-800/90 hover:bg-indigo-600 text-white rounded-2xl border border-slate-700 shadow-lg backdrop-blur-md transition-all"
            title="Locate me"
          >
            <Locate className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <MapContainer
        center={[selectedCity.latitude, selectedCity.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
        />

        <MapRecenter lat={selectedCity.latitude} lng={selectedCity.longitude} />
        <MapClickEvents onMapClick={(lat, lng) => onOpenReportModal(lat, lng)} />

        {/* Places Markers */}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={ICONS[place.category] || ICONS.attraction}
          >
            <Popup>
              <div className="text-slate-100 max-w-xs">
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                  {place.subCategory} • {place.budget}
                </div>
                <div className="text-sm font-bold text-white mb-1">{place.name}</div>
                <div className="text-xs text-slate-300 mb-2">
                  Distance: {place.distance} km from city center
                </div>
                {place.address && (
                  <div className="text-xs text-slate-400 border-t border-slate-700 pt-1">
                    {place.address}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Community Citizen Reports Markers */}
        {mapFilters.safety &&
          cityReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={ICONS.report}
            >
              <Popup>
                <div className="text-slate-100 max-w-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Community Report ({report.type})
                  </div>
                  <div className="text-xs text-slate-200 mb-2">{report.description}</div>
                  {report.photoUrl && (
                    <img
                      src={report.photoUrl}
                      alt="Report attachment"
                      className="w-full h-24 object-cover rounded-lg border border-slate-700 mb-2"
                    />
                  )}
                  {report.audioBlobUrl && (
                    <audio controls src={report.audioBlobUrl} className="w-full h-8 mt-1" />
                  )}
                  <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-1 mt-1">
                    Local device report • {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* User Geolocation Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createSvgIcon('#10B981', 'ME')}
          >
            <Popup>
              <div className="text-xs font-bold text-emerald-400">Your Location</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
