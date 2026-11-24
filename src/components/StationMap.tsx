import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Maximize2, Crosshair } from 'lucide-react';
import { Station, HubInfo, HousingMode, ApartmentSize, PragueTargetMode, PragueStationId, TrainConnection } from '../types';
import { getPriceColor, formatCzechNumber, PRICE_TIERS } from '../utils/calculations';
import { PRAGUE_STATIONS, PRAGUE_STATION_IDS } from '../data/pragueStations';
import { isResolvedPragueConnection, ResolvedPragueConnection } from '../utils/pragueRouting';

interface StationMapProps {
  stations: Station[];
  filteredStationIds: Set<string>;
  activeHub: HubInfo;
  mode: HousingMode;
  apartmentSize: ApartmentSize;
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  hoveredStationId: string | null;
  onHoverStation: (stationId: string | null) => void;
  activeMobileTab?: 'list' | 'map';
  pragueTargetMode?: PragueTargetMode;
  onPragueTargetModeChange?: (mode: PragueTargetMode) => void;
  pragueDetailMode?: boolean;
  resolvedConnectionsMap?: Map<string, TrainConnection | ResolvedPragueConnection>;
}

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  filteredStationIds,
  activeHub,
  mode,
  apartmentSize: _apartmentSize,
  selectedStationId,
  onSelectStation,
  hoveredStationId,
  onHoverStation,
  activeMobileTab,
  pragueTargetMode = 'hln',
  onPragueTargetModeChange,
  pragueDetailMode = false,
  resolvedConnectionsMap,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Dedicated LayerGroups
  const halosLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerRef = useRef<L.LayerGroup | null>(null);
  const pragueStationsLayerRef = useRef<L.LayerGroup | null>(null);
  const hubLayerRef = useRef<L.LayerGroup | null>(null);

  // Keep references to marker instances to manage hover and tooltips cleanly
  const stationMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  // 1. Initialize Map ONCE
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [49.80, 15.47],
      zoom: 8,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: false,
    });

    // Add zoom control in top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // CartoDB Positron base tiles with official CARTO Basemaps API key
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=cb1_5eck_1_870a1281647d601c7f187f5a',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Create LayerGroups in order: corridors at bottom, halos in middle, markers on top, prague stations, hub pin on top
    const corridorsLayer = L.layerGroup().addTo(map);
    const halosLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);
    const pragueStationsLayer = L.layerGroup().addTo(map);
    const hubLayer = L.layerGroup().addTo(map);

    corridorsLayerRef.current = corridorsLayer;
    halosLayerRef.current = halosLayer;
    markersLayerRef.current = markersLayer;
    pragueStationsLayerRef.current = pragueStationsLayer;
    hubLayerRef.current = hubLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Invalidate map size when mobile tab changes or window resizes
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [activeMobileTab]);

  // 2. Fly to active hub area whenever activeHub changes
  const prevHubIdRef = useRef<string>(activeHub.id);
  useEffect(() => {
    if (!mapRef.current) return;
    if (prevHubIdRef.current !== activeHub.id) {
      prevHubIdRef.current = activeHub.id;
      fitActiveHubArea();
    }
  }, [activeHub.id]);

  // 2b. Fly to Central Bohemian commuter network when Prague Detailed Mode is toggled
  useEffect(() => {
    if (!mapRef.current) return;
    if (activeHub.id === 'praha' && pragueDetailMode) {
      mapRef.current.flyToBounds(
        [
          [49.68, 13.70],
          [50.56, 15.35],
        ],
        { padding: [30, 30], duration: 1.0 }
      );
    }
  }, [pragueDetailMode, activeHub.id]);

  // 3. Render Hub reference pin (used for non-Prague hubs)
  useEffect(() => {
    if (!hubLayerRef.current) return;
    hubLayerRef.current.clearLayers();

    if (activeHub.id === 'praha') {
      // Prague stations layer handles Prague hub markers
      return;
    }

    // Custom pure HTML/SVG divIcon for Hub
    const hubIcon = L.divIcon({
      className: 'hub-pin-container',
      html: `
        <div class="hub-pin">
          <div class="hub-pin-pulse"></div>
          <div class="hub-pin-inner">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="16" x="4" y="3" rx="2"/>
              <path d="M4 11h16"/>
              <path d="M12 3v8"/>
              <circle cx="8" cy="15" r="1"/>
              <circle cx="16" cy="15" r="1"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const hubMarker = L.marker(activeHub.coords, {
      icon: hubIcon,
      interactive: true,
      zIndexOffset: 1000,
    });

    hubMarker.bindTooltip(
      `<div class="font-bold text-navy">${activeHub.label} (${activeHub.stationName})</div><div class="text-[11px] text-ink-muted">Cílové pracoviště · Referenční bod</div>`,
      {
        direction: 'top',
        className: 'editorial-tooltip',
        offset: [0, -12],
      }
    );

    hubLayerRef.current.addLayer(hubMarker);
  }, [activeHub]);

  // 3b. Render Prague station markers
  useEffect(() => {
    if (!pragueStationsLayerRef.current) return;
    pragueStationsLayerRef.current.clearLayers();

    if (activeHub.id !== 'praha') return;

    let stationIdsToRender: PragueStationId[] = [];
    if (pragueDetailMode) {
      stationIdsToRender = PRAGUE_STATION_IDS;
    } else if (pragueTargetMode === 'first') {
      stationIdsToRender = ['podbaba', 'smichov', 'liben', 'vysocany', 'vrsovice', 'veleslavin'];
    } else {
      stationIdsToRender = [pragueTargetMode as PragueStationId];
    }

    stationIdsToRender.forEach((stId) => {
      const st = PRAGUE_STATIONS[stId];
      if (!st) return;

      const isActive = pragueTargetMode === stId;
      const iconHtml = `
        <div class="prague-station-pin ${isActive ? 'active' : ''}">
          <div class="prague-station-pin-inner">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="16" x="4" y="3" rx="2"/>
              <path d="M4 11h16"/>
              <path d="M12 3v8"/>
              <circle cx="8" cy="15" r="1"/>
              <circle cx="16" cy="15" r="1"/>
            </svg>
          </div>
          <span class="prague-station-pin-label">${st.shortName}</span>
        </div>
      `;

      const icon = L.divIcon({
        className: 'prague-station-pin-container',
        html: iconHtml,
        iconSize: [40, 36],
        iconAnchor: [20, 10],
      });

      const marker = L.marker(st.coords, {
        icon,
        interactive: true,
        zIndexOffset: isActive ? 1200 : 800,
      });

      marker.bindTooltip(
        `<div class="font-bold text-navy">${st.name}</div><div class="text-[11px] text-ink-muted">${st.mhdNote}</div><div class="text-[10px] text-emerald-700 font-semibold mt-0.5">${
          isActive ? '✓ Zvolená cílová stanice' : 'Kliknutím vybrat jako cíl'
        }</div>`,
        {
          direction: 'top',
          className: 'editorial-tooltip',
          offset: [0, -12],
        }
      );

      marker.on('click', () => {
        onPragueTargetModeChange?.(stId);
      });

      pragueStationsLayerRef.current?.addLayer(marker);
    });
  }, [activeHub.id, pragueDetailMode, pragueTargetMode, onPragueTargetModeChange]);

  // 4. Render Halos and Station Markers
  useEffect(() => {
    if (!halosLayerRef.current || !markersLayerRef.current) return;

    halosLayerRef.current.clearLayers();
    markersLayerRef.current.clearLayers();
    stationMarkersRef.current.clear();

    const isDetailPrague = activeHub.id === 'praha' && pragueDetailMode;
    const haloRadius = isDetailPrague ? 1700 : 3500;
    const filteredHaloRadius = isDetailPrague ? 1400 : 3000;
    const dotRadiusBase = isDetailPrague ? 5.5 : 7;
    const dotRadiusActive = isDetailPrague ? 7.5 : 9;

    stations.forEach((station) => {
      // Exclude hub itself from station dots
      if (station.id === activeHub.id) return;

      // In normal mode, do not render detail-only stations
      if (station.isDetailOnly && !isDetailPrague) return;

      const connection = station.connections[activeHub.id];
      const isConnected = !!connection;
      const passesFilter = isConnected && filteredStationIds.has(station.id);
      const isSelected = selectedStationId === station.id;
      const isHovered = hoveredStationId === station.id;

      const pricePerSqm = mode === 'buy' ? station.buyPricePerSqm : station.rentPricePerSqm;
      const priceColor = getPriceColor(pricePerSqm, mode);

      if (isConnected) {
        // A) Halo Layer (L.circle with radius 1700m or 3500m, interactive: false)
        if (passesFilter) {
          const halo = L.circle(station.coords, {
            radius: haloRadius,
            fillColor: priceColor,
            fillOpacity: isSelected || isHovered ? 0.38 : 0.22,
            stroke: true,
            color: priceColor,
            weight: 1,
            opacity: 0.45,
            interactive: false,
          });
          halosLayerRef.current?.addLayer(halo);
        } else {
          // Filtered out halo (faint gray)
          const halo = L.circle(station.coords, {
            radius: filteredHaloRadius,
            fillColor: '#9CA3AF',
            fillOpacity: 0.08,
            stroke: false,
            interactive: false,
          });
          halosLayerRef.current?.addLayer(halo);
        }

        // B) Crisp Station Dot (L.circleMarker, interactive: true)
        const dotRadius = isSelected || isHovered ? dotRadiusActive : dotRadiusBase;
        const dotColor = passesFilter ? priceColor : '#9CA3AF';
        const dotOpacity = passesFilter ? 1.0 : 0.35;

        const marker = L.circleMarker(station.coords, {
          radius: dotRadius,
          fillColor: dotColor,
          fillOpacity: dotOpacity,
          color: '#FFFFFF',
          weight: 2,
          interactive: true,
        });

        if (isSelected || isHovered) {
          marker.bringToFront();
        }

        // Tooltip
        const rawResolved = activeHub.id === 'praha' ? resolvedConnectionsMap?.get(station.id) : undefined;
        const resolved = isResolvedPragueConnection(rawResolved) ? rawResolved : undefined;
        const durationMin = resolved ? resolved.durationMin : connection.durationMin;
        const targetLabel = resolved
          ? `→ ${resolved.targetStationName}`
          : activeHub.toLabel;
        const transferBadge = resolved && resolved.requiresPragueTransfer
          ? `<div class="text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-sans mt-0.5 font-medium">S přestupem v Praze (${resolved.viaStationName ? 'přes ' + resolved.viaStationName : ''})</div>`
          : '';

        const tooltipContent = `
          <div class="space-y-0.5">
            <div class="font-bold text-ink">${station.name}</div>
            <div class="text-[11px] font-mono text-navy font-bold">
              🚂 ${durationMin} min ${targetLabel}
            </div>
            ${transferBadge}
            <div class="text-[11px] font-mono text-ink-muted">
              ${formatCzechNumber(pricePerSqm)} Kč/m² ${passesFilter ? '' : '<span class="text-rose-600 font-sans">(mimo filtry)</span>'}
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          direction: 'top',
          className: 'editorial-tooltip',
          offset: [0, -6],
        });

        marker.on('click', () => {
          onSelectStation(station.id);
        });

        marker.on('mouseover', () => {
          onHoverStation(station.id);
        });

        marker.on('mouseout', () => {
          onHoverStation(null);
        });

        markersLayerRef.current?.addLayer(marker);
        stationMarkersRef.current.set(station.id, marker);
      } else {
        // C) Station not connected to this hub (neutral subtle dot to preserve nationwide rail geography)
        const marker = L.circleMarker(station.coords, {
          radius: 5,
          fillColor: '#6B7280',
          fillOpacity: 0.18,
          color: '#FFFFFF',
          weight: 1.5,
          interactive: true,
        });

        marker.bindTooltip(
          `<div class="text-xs font-semibold text-ink">${station.name}</div><div class="text-[10px] text-ink-muted font-medium">Mimo spádovou oblast ${activeHub.label}</div>`,
          {
            direction: 'top',
            className: 'editorial-tooltip',
            offset: [0, -4],
          }
        );

        markersLayerRef.current?.addLayer(marker);
        stationMarkersRef.current.set(station.id, marker);
      }
    });
  }, [
    stations,
    filteredStationIds,
    activeHub,
    mode,
    selectedStationId,
    hoveredStationId,
    pragueDetailMode,
    pragueTargetMode,
    resolvedConnectionsMap,
  ]);

  // 5. Draw Corridor line to Hub when station is hovered or selected
  useEffect(() => {
    if (!corridorsLayerRef.current) return;
    corridorsLayerRef.current.clearLayers();

    const activeStationId = hoveredStationId || selectedStationId;
    if (!activeStationId || activeStationId === activeHub.id) return;

    const station = stations.find((s) => s.id === activeStationId);
    if (!station || !station.connections[activeHub.id]) return;

    let targetCoords = activeHub.coords;
    const rawResolved = activeHub.id === 'praha' ? resolvedConnectionsMap?.get(station.id) : undefined;
    const resolved = isResolvedPragueConnection(rawResolved) ? rawResolved : undefined;

    if (resolved && resolved.targetStationId) {
      targetCoords = PRAGUE_STATIONS[resolved.targetStationId]?.coords || activeHub.coords;
    }

    let polylineCoords: [number, number][] = [station.coords, targetCoords];
    if (
      resolved &&
      resolved.requiresPragueTransfer &&
      resolved.viaStationId &&
      resolved.viaStationId !== resolved.targetStationId
    ) {
      const viaCoords = PRAGUE_STATIONS[resolved.viaStationId]?.coords;
      if (viaCoords) {
        polylineCoords = [station.coords, viaCoords, targetCoords];
      }
    }

    // Draw crisp corridor polyline
    const line = L.polyline(polylineCoords, {
      color: '#1B365D',
      weight: 2.5,
      dashArray: '5, 5',
      opacity: 0.85,
      interactive: false,
    });

    corridorsLayerRef.current.addLayer(line);
  }, [hoveredStationId, selectedStationId, stations, activeHub, resolvedConnectionsMap]);

  // Helper: Zoom to fit entire Czech Republic
  const fitCzechRepublic = () => {
    if (!mapRef.current) return;
    const allCoords = stations.map((s) => s.coords);
    const bounds = L.latLngBounds(allCoords);
    mapRef.current.flyToBounds(bounds, { padding: [30, 30], duration: 1.0 });
  };

  // Helper: Zoom to active hub and its connected commuter catchment
  const fitActiveHubArea = () => {
    if (!mapRef.current) return;
    if (activeHub.id === 'praha' && pragueDetailMode) {
      mapRef.current.flyToBounds(
        [
          [49.68, 13.70],
          [50.56, 15.35],
        ],
        { padding: [30, 30], duration: 1.0 }
      );
      return;
    }

    const connectedCoords = stations
      .filter((s) => s.connections[activeHub.id])
      .map((s) => s.coords);

    if (connectedCoords.length > 0) {
      connectedCoords.push(activeHub.coords);
      const bounds = L.latLngBounds(connectedCoords);
      mapRef.current.flyToBounds(bounds, { padding: [40, 40], duration: 1.0 });
    }
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top-Right Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={fitCzechRepublic}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-ink text-xs font-semibold rounded-lg border border-hairline shadow-md hover:bg-paper hover:text-navy transition-all"
          title="Zobrazit celou Českou republiku"
        >
          <Maximize2 className="w-3.5 h-3.5 text-navy" />
          <span>Celá ČR</span>
        </button>

        <button
          onClick={fitActiveHubArea}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-ink text-xs font-semibold rounded-lg border border-hairline shadow-md hover:bg-paper hover:text-navy transition-all"
          title={`Zobrazit spádovou oblast ${activeHub.toLabel}`}
        >
          <Crosshair className="w-3.5 h-3.5 text-navy" />
          <span>Okolí {activeHub.label}</span>
        </button>
      </div>

      {/* Bottom-Right Floating Semantic Legend */}
      <div className="absolute bottom-6 right-4 z-20 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-hairline shadow-lg max-w-[280px] pointer-events-auto">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-hairline">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            Cena za m² ({mode === 'buy' ? 'Koupě' : 'Nájem'})
          </span>
          <span className="text-[10px] text-ink-muted font-medium">Hladina</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {PRICE_TIERS.map((tier) => {
            const label = mode === 'buy' ? tier.buyLabel : tier.rentLabel;
            return (
              <div key={tier.hex} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: tier.hex }}
                  />
                  <span className="text-[11px] text-ink font-medium">{tier.name}</span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-ink tabular-nums">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 pt-2 border-t border-hairline text-[10px] text-ink-muted leading-tight">
          {activeHub.id === 'praha' && pragueDetailMode
            ? 'Kruhový halo znázorňuje cenový perimetr do 1,7 km v detailním režimu.'
            : 'Kruhový halo znázorňuje cenový perimetr do 3,5 km od železniční stanice.'}
        </div>
      </div>
    </div>
  );
};
