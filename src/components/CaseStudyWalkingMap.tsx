import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CASE_STUDY_LOCATION } from '../data/caseStudyLovosice';

export const CaseStudyWalkingMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [50.5121, 14.0571],
      zoom: 17,
      minZoom: 14,
      maxZoom: 19,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Positron base tiles with official CARTO key
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=cb1_5eck_1_870a1281647d601c7f187f5a',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Walking Route Polyline
    const polyline = L.polyline(CASE_STUDY_LOCATION.routePolyline, {
      color: '#1B365D',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Dashed inner glow for editorial railway aesthetic
    L.polyline(CASE_STUDY_LOCATION.routePolyline, {
      color: '#FFFFFF',
      weight: 2,
      dashArray: '6, 6',
      opacity: 0.8,
    }).addTo(map);

    // Custom Station Marker
    const stationIcon = L.divIcon({
      className: 'walking-station-icon',
      html: `
        <div style="background-color: #1B365D; color: white; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="16" x="4" y="3" rx="2"/>
            <path d="M4 11h16"/>
            <path d="M12 3v8"/>
            <circle cx="8" cy="15" r="1"/>
            <circle cx="16" cy="15" r="1"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const stationMarker = L.marker(CASE_STUDY_LOCATION.stationCoords, {
      icon: stationIcon,
    }).addTo(map);

    stationMarker.bindTooltip(
      `<div class="font-bold text-navy">Nádraží Lovosice</div><div class="text-[10px] text-ink-muted">R20 do Prahy (68 min)</div>`,
      {
        direction: 'bottom',
        permanent: true,
        className: 'editorial-tooltip',
        offset: [0, 8],
      }
    );

    // Custom Apartment Marker
    const apartmentIcon = L.divIcon({
      className: 'walking-apartment-icon',
      html: `
        <div style="background-color: #157A5B; color: white; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const apartmentMarker = L.marker(CASE_STUDY_LOCATION.apartmentCoords, {
      icon: apartmentIcon,
    }).addTo(map);

    apartmentMarker.bindTooltip(
      `<div class="font-bold text-price-tier1">Terezínská 351/83</div><div class="text-[10px] text-ink-muted">Byt 2+1 (3 min / 210 m od vlaku)</div>`,
      {
        direction: 'top',
        permanent: true,
        className: 'editorial-tooltip',
        offset: [0, -10],
      }
    );

    // Fit bounds to route
    map.fitBounds(polyline.getBounds(), { padding: [45, 45] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden border border-hairline shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-hairline shadow-sm text-xs font-semibold text-ink flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
        <span>Pěší trasa po rovině: <strong>210 m · 3 minuty</strong></span>
      </div>
    </div>
  );
};
