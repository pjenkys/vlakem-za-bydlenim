# Vlakem za bydlením (Rail Commuting & Housing Affordability in Czechia)

A fast, visually refined, 100% static web application and Hackathon MVP prototype demonstrating how housing affordability in the Czech Republic is fundamentally connected to passenger rail infrastructure.

## Core Thesis
While apartment prices in the centers of Prague and Brno exceed 120,000–145,000 CZK/m², municipalities located within 35–60 minutes of travel by rail drop to a third or half of that cost. For a typical 65 m² apartment, this difference often represents **over 4 million CZK in savings**, reducing monthly mortgage installments by more than **16,000 CZK each month** over a 30-year term.

---

## Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling & Design System:** Tailwind CSS with an editorial cartography palette (paper background `#F7F6F2`, hairline borders `#E4E0D8`, railway slate `#1B365D`)
- **Map Engine:** Vanilla `leaflet` with custom React lifecycle wrappers (`useRef` / `useEffect`). **Zero `react-leaflet` dependency**. Base tiles: CartoDB Positron.
- **Icons:** `lucide-react`
- **Fonts:** Google Fonts `Plus Jakarta Sans` (UI) and `JetBrains Mono` (`tabular-nums` for prices, schedules, and metrics)
- **Deployment:** 100% static, GitHub Pages automated workflow (`.github/workflows/deploy.yml`)

---

## Key Features

1. **Multi-Hub Commuting Analysis (4 Target Cities):**
   - **Praha** (Baseline: 145 000 Kč/m² buy, 415 Kč/m² rent)
   - **Brno** (Baseline: 122 000 Kč/m² buy, 365 Kč/m² rent)
   - **Plzeň** (Baseline: 92 000 Kč/m² buy, 295 Kč/m² rent)
   - **Ostrava** (Baseline: 62 000 Kč/m² buy, 225 Kč/m² rent)

2. **Dual Housing Modes & Apartment Sizes:**
   - Instant toggle between **Koupě (Buy)** and **Nájem (Rent)** with independent price filter state preservation.
   - Apartment size selector: `45 m²`, `65 m²` (default), `85 m²`.

3. **Interactive Editorial Cartography:**
   - Dedicated Leaflet LayerGroups for catchment halos (`L.circle`, 3.5 km walking perimeter, non-interactive to prevent click hijacking) and crisp station markers (`L.circleMarker`).
   - Dynamic 5-step semantic price scale with real-time color mapping.
   - Dynamic corridor polylines (`L.polyline`) drawn between hovered/selected stations and the active workplace hub.
   - Quick bounds presets: `Celá ČR` and `Okolí {Hub}`.

4. **Curated Nationwide Dataset (78 Real Stations):**
   - 4 Major Hubs connected to each other.
   - Prague Commuter & Central Bohemia Ring (21 stations).
   - North & Northwest Bohemia (11 stations).
   - West Bohemia & Plzeň Commuter Ring (10 stations).
   - South Bohemia & Vysočina (9 stations).
   - East Bohemia, Moravia & Brno Commuter Ring (16 stations).
   - Silesia & Ostrava Commuter Ring (7 stations).

5. **Financial & Schedule Analytics:**
   - Deterministic Value-to-Time scoring formula:
     `((1 - price / hubBaselinePrice) * 100) - (durationMin * 0.45) + Math.min(peakTrainsPerHour, 4) * 4`
   - Real-world mortgage model (80% LTV, 4.8% p.a., 30-year maturity).
   - Post-midnight return train wraparound handling (e.g. `00:15` passes the "after 23:00" filter).
   - Deterministic sample property listings within walking distance (3–14 min) of each station.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## License
MIT
