import { useState, useMemo, useCallback, useEffect } from 'react';
import { HubId, HousingMode, ApartmentSize, FilterState, PragueTargetMode, TrainConnection } from './types';
import { HUBS } from './data/hubs';
import { STATIONS } from './data/stations';
import { PRAGUE_STATIONS } from './data/pragueStations';
import { resolvePragueConnection, ResolvedPragueConnection } from './utils/pragueRouting';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StationMap } from './components/StationMap';
import { AboutModal } from './components/AboutModal';
import { CaseStudyPage } from './components/CaseStudyPage';
import { parseTrainTimeInMinutes, calculateStationMetrics } from './utils/calculations';

const DEFAULT_FILTERS: FilterState = {
  maxDurationMin: 120,
  minFrequency: 'all',
  lastTrain: 'any',
  maxBuyPrice: 150000,
  maxRentPrice: 450,
  directOnly: false,
  sort: 'value',
};

export function App() {
  // Navigation state synced with URL hash
  const [currentView, setCurrentView] = useState<'map' | 'case-study'>(() => {
    return window.location.hash.includes('modelovy-priklad') ? 'case-study' : 'map';
  });

  const [activeHubId, setActiveHubId] = useState<HubId>('praha');
  const [pragueTargetMode, setPragueTargetMode] = useState<PragueTargetMode>('hln');
  const [pragueDetailMode, setPragueDetailMode] = useState<boolean>(false);
  const [mode, setMode] = useState<HousingMode>('buy');
  const [apartmentSize, setApartmentSize] = useState<ApartmentSize>(45);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // Sync hash changes with view state (e.g. browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const isCaseStudy = window.location.hash.includes('modelovy-priklad');
      setCurrentView(isCaseStudy ? 'case-study' : 'map');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = useCallback((newView: 'map' | 'case-study') => {
    setCurrentView(newView);
    window.location.hash = newView === 'case-study' ? '#/modelovy-priklad' : '#/';
  }, []);

  const currentHub = useMemo(() => {
    if (activeHubId === 'praha' && pragueTargetMode !== 'first') {
      const targetSt = PRAGUE_STATIONS[pragueTargetMode];
      return {
        ...HUBS.praha,
        stationName: targetSt.name,
        coords: targetSt.coords,
      };
    }
    return HUBS[activeHubId];
  }, [activeHubId, pragueTargetMode]);

  // Hub switch cleanup:
  // Whenever activeHub changes, immediately clear selectedStationId if no connection, equals activeHub, or detail-only outside Prague
  const handleHubChange = useCallback((newHubId: HubId) => {
    setActiveHubId(newHubId);
    setSelectedStationId((prevId) => {
      if (!prevId) return null;
      if (prevId === newHubId) return null;
      const st = STATIONS.find((s) => s.id === prevId);
      if (!st || !st.connections[newHubId]) return null;
      if (newHubId !== 'praha' && st.isDetailOnly) return null;
      return prevId;
    });
  }, []);

  const handlePragueDetailModeChange = useCallback((enabled: boolean) => {
    setPragueDetailMode(enabled);
    if (!enabled) {
      setSelectedStationId((prevId) => {
        if (!prevId) return null;
        const st = STATIONS.find((s) => s.id === prevId);
        return st?.isDetailOnly ? null : prevId;
      });
    }
  }, []);

  const handleFilterChange = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      // preserve sort preference
      sort: prev.sort,
    }));
  }, []);

  // Check if filters differ from default
  const isFiltered = useMemo(() => {
    return (
      filters.maxDurationMin !== DEFAULT_FILTERS.maxDurationMin ||
      filters.minFrequency !== DEFAULT_FILTERS.minFrequency ||
      filters.lastTrain !== DEFAULT_FILTERS.lastTrain ||
      (mode === 'buy' && filters.maxBuyPrice !== DEFAULT_FILTERS.maxBuyPrice) ||
      (mode === 'rent' && filters.maxRentPrice !== DEFAULT_FILTERS.maxRentPrice) ||
      filters.directOnly !== DEFAULT_FILTERS.directOnly
    );
  }, [filters, mode]);

  // All eligible stations for this hub (excluding the hub itself and detail-only unless Prague detail mode is active)
  const eligibleStations = useMemo(() => {
    return STATIONS.filter((station) => {
      if (station.id === activeHubId) return false;
      if (!station.connections[activeHubId]) return false;
      if (station.isDetailOnly && !(activeHubId === 'praha' && pragueDetailMode)) {
        return false;
      }
      return true;
    });
  }, [activeHubId, pragueDetailMode]);

  // Resolved connections map for Prague target station recalculation
  const resolvedConnectionsMap = useMemo(() => {
    const map = new Map<string, TrainConnection | ResolvedPragueConnection>();
    eligibleStations.forEach((station) => {
      const baseConn = station.connections[activeHubId];
      if (!baseConn) return;
      if (activeHubId === 'praha') {
        map.set(station.id, resolvePragueConnection(station, baseConn, pragueTargetMode));
      } else {
        map.set(station.id, baseConn);
      }
    });
    return map;
  }, [eligibleStations, activeHubId, pragueTargetMode]);

  // Filtered and sorted stations
  const filteredStations = useMemo(() => {
    return eligibleStations
      .filter((station) => {
        const connection = resolvedConnectionsMap.get(station.id);
        if (!connection) return false;

        // 1. Travel time
        if (connection.durationMin > filters.maxDurationMin) return false;

        // 2. Price filter (independent states for buy and rent)
        if (mode === 'buy' && station.buyPricePerSqm > filters.maxBuyPrice) {
          return false;
        }
        if (mode === 'rent' && station.rentPricePerSqm > filters.maxRentPrice) {
          return false;
        }

        // 3. Peak frequency
        if (filters.minFrequency === '1h' && connection.peakTrainsPerHour < 1) return false;
        if (filters.minFrequency === '2h' && connection.peakTrainsPerHour < 2) return false;
        if (filters.minFrequency === '4h' && connection.peakTrainsPerHour < 4) return false;

        // 4. Last return train (with post-midnight wraparound)
        if (filters.lastTrain !== 'any') {
          const departureMinutes = parseTrainTimeInMinutes(connection.lastTrainFromHub);
          if (filters.lastTrain === 'after21' && departureMinutes < 21 * 60) return false;
          if (filters.lastTrain === 'after22' && departureMinutes < 22 * 60) return false;
          if (filters.lastTrain === 'after23' && departureMinutes < 23 * 60) return false;
        }

        // 5. Direct train only
        if (filters.directOnly && !connection.isDirect) return false;

        return true;
      })
      .sort((a, b) => {
        const connA = resolvedConnectionsMap.get(a.id)!;
        const connB = resolvedConnectionsMap.get(b.id)!;
        const metricsA = calculateStationMetrics(a, connA, currentHub, mode, apartmentSize);
        const metricsB = calculateStationMetrics(b, connB, currentHub, mode, apartmentSize);

        switch (filters.sort) {
          case 'value':
            // Higher value score first
            return metricsB.valueScore - metricsA.valueScore;
          case 'price':
            // Cheapest price per m2 first
            return metricsA.pricePerSqm - metricsB.pricePerSqm;
          case 'time':
            // Fastest travel duration first
            return connA.durationMin - connB.durationMin;
          case 'savings':
            // Highest price difference (savings) first
            return metricsB.priceDifference - metricsA.priceDifference;
          default:
            return 0;
        }
      });
  }, [eligibleStations, resolvedConnectionsMap, currentHub, filters, mode, apartmentSize]);

  // Set of IDs that pass filters for map styling
  const filteredStationIds = useMemo(() => {
    return new Set(filteredStations.map((s) => s.id));
  }, [filteredStations]);

  const handleSelectStation = useCallback((stationId: string | null) => {
    setSelectedStationId(stationId);
    // If a station is selected on mobile while viewing map, switch to list to show details
    if (stationId && window.innerWidth < 768) {
      setMobileTab('list');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-paper text-ink font-sans">
      {/* Header Bar */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        activeHub={activeHubId}
        onHubChange={handleHubChange}
        mode={mode}
        onModeChange={setMode}
        apartmentSize={apartmentSize}
        onApartmentSizeChange={setApartmentSize}
        onOpenAbout={() => setIsAboutOpen(true)}
        activeMobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
      />

      {/* Main View: Case Study or Map Split */}
      {currentView === 'case-study' ? (
        <CaseStudyPage onBackToMap={() => handleViewChange('map')} />
      ) : (
        <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          {/* Left Sidebar (Desktop: always visible; Mobile: visible when mobileTab === 'list') */}
          <div
            className={`h-full flex-shrink-0 ${
              mobileTab === 'list' ? 'flex w-full md:w-auto' : 'hidden md:flex'
            }`}
          >
            <Sidebar
              stations={filteredStations}
              allEligibleCount={eligibleStations.length}
              activeHub={currentHub}
              mode={mode}
              apartmentSize={apartmentSize}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
              selectedStationId={selectedStationId}
              onSelectStation={handleSelectStation}
              hoveredStationId={hoveredStationId}
              onHoverStation={setHoveredStationId}
              onOpenCaseStudy={() => handleViewChange('case-study')}
              pragueTargetMode={pragueTargetMode}
              onPragueTargetModeChange={setPragueTargetMode}
              pragueDetailMode={pragueDetailMode}
              onPragueDetailModeChange={handlePragueDetailModeChange}
              resolvedConnectionsMap={resolvedConnectionsMap}
            />
          </div>

          {/* Right Panel Map (Desktop: always visible; Mobile: visible when mobileTab === 'map') */}
          <div
            className={`h-full flex-1 relative ${
              mobileTab === 'map' ? 'block w-full' : 'hidden md:block'
            }`}
          >
            <StationMap
              stations={STATIONS}
              filteredStationIds={filteredStationIds}
              activeHub={currentHub}
              mode={mode}
              apartmentSize={apartmentSize}
              selectedStationId={selectedStationId}
              onSelectStation={handleSelectStation}
              hoveredStationId={hoveredStationId}
              onHoverStation={setHoveredStationId}
              activeMobileTab={mobileTab}
              pragueTargetMode={pragueTargetMode}
              onPragueTargetModeChange={setPragueTargetMode}
              pragueDetailMode={pragueDetailMode}
              resolvedConnectionsMap={resolvedConnectionsMap}
            />
          </div>
        </main>
      )}

      {/* About & Methodology Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
