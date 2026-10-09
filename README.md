# CityPulse — Smart Interactive City Exploration Web App

> **City Life: Exploring, Experiencing & Navigating the Chaos We Call Home**

CityPulse is a smart, interactive city exploration web platform built with **Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, Leaflet, and Recharts**. It converts real-world city data into verified, actionable insights for tourists, commuters, and urban explorers.

---

## 🌟 Key Features & Dashboard Sections

1. **Overview & Live Weather**:
   - Debounced global city autocomplete via Open-Meteo Geocoding API.
   - Quick-demo city chips (**Pune, Mumbai, Delhi, Bengaluru, Paris, Tokyo**).
   - Real-time temperature, feels-like, humidity, wind speed, UV index, 5-day forecast, and severe weather warning banners.

2. **Explore & Hospitality**:
   - Browse tourist attractions, cafes/restaurants, and hotels/hostels powered by OpenStreetMap (Overpass API).
   - Filter by Category, Budget (*Budget / Mid / Premium* inferred from OSM tags), and "Open Now" status.
   - Interactive "Show on Map" focus triggers.

3. **History & Culture**:
   - Historical summaries & thumbnail images fetched live from the Wikipedia REST API.
   - OSM heritage landmarks, monuments, museums, and places of worship.

4. **Safety & Security**:
   - **Estimated Safety Score (0-100)** computed from police, hospital, lighting, and venue density.
   - Safe Route Hints for nighttime transit.
   - **Citizen Community Reporting**: File local reports (unsafe area, accident, pothole, flooding) with map location selection, photo attachment, and voice recording using the browser **MediaRecorder API** (saved to `localStorage`).

5. **Best vs. Worst Comparison Tool**:
   - Side-by-side place/city comparison powered by Recharts Radar Charts across 5 dimensions: **Safety, Cleanliness, Affordability, Rating, and Accessibility**.
   - Automatic category winner badges (explicitly tagged as *"Estimated"* data).

6. **Smart City AI Insights**:
   - Rule-based NLP engine delivering plain-English travel and safety recommendations.
   - Hourly typical-day traffic congestion curve (tagged *"Demo data"*).
   - Citizen report sentiment feed (*Critical, Warning, Neutral* priority tagging).

7. **Interactive Leaflet Map**:
   - Dark CartoDB basemap with custom category SVG markers, layer toggling, marker clustering, and *"Near me"* browser geolocation.

8. **3D Hero Scene**:
   - React Three Fiber interactive floating globe with automatic fallback to a 2D gradient on low-end devices or when `prefers-reduced-motion` is set.

---

## 🛠 Tech Stack & Architecture

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Dark Glassmorphism
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Interactive Maps**: Leaflet + `react-leaflet`
- **Charts**: Recharts
- **State Management**: Zustand + `sessionStorage` (API caching) + `localStorage` (Citizen reports)
- **Keyless Free Public APIs**: Open-Meteo, OpenStreetMap Overpass API, Wikipedia REST API

---

## 🚀 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/your-username/citypulse.git
cd citypulse

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Production build verification
npm run build
```

---

## 🌐 Vercel Deployment

CityPulse is a 100% frontend SPA with no backend servers or environment variables required. To deploy to Vercel:

```bash
npx vercel
```
Or connect the repository directly in the Vercel Dashboard.
