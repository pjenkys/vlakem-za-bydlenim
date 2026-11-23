import React from 'react';
import { Train, Info, Map, List, Home, KeyRound, Building, ArrowLeft } from 'lucide-react';
import { HubId, HousingMode, ApartmentSize } from '../types';
import { HUBS, HUB_IDS } from '../data/hubs';

interface HeaderProps {
  currentView: 'map' | 'case-study';
  onViewChange: (view: 'map' | 'case-study') => void;
  activeHub: HubId;
  onHubChange: (hub: HubId) => void;
  mode: HousingMode;
  onModeChange: (mode: HousingMode) => void;
  apartmentSize: ApartmentSize;
  onApartmentSizeChange: (size: ApartmentSize) => void;
  onOpenAbout: () => void;
  activeMobileTab: 'list' | 'map';
  onMobileTabChange: (tab: 'list' | 'map') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  activeHub,
  onHubChange,
  mode,
  onModeChange,
  apartmentSize,
  onApartmentSizeChange,
  onOpenAbout,
  activeMobileTab,
  onMobileTabChange,
}) => {
  const currentHub = HUBS[activeHub];

  return (
    <header className="w-full bg-white border-b border-hairline px-4 py-2.5 md:px-6 md:py-3 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title, Navigation & Hub context */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onViewChange('map')}
              className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-white shadow-sm flex-shrink-0 cursor-pointer hover:bg-navy-dark transition-colors"
              title="Přejít na mapu"
            >
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewChange('map')}
                  className="text-lg md:text-xl font-extrabold tracking-tight text-ink font-sans hover:text-navy transition-colors text-left"
                >
                  Vlakem za bydlením
                </button>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-navy/10 text-navy border border-navy/20">
                  ČR 2026
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                {currentView === 'map' ? (
                  <>
                    Dostupnost bydlení a dojezdová doba vlakem <span className="font-semibold text-ink">{currentHub.toLabel}</span>
                  </>
                ) : (
                  <>
                    Případová studie reálného bytu: <span className="font-semibold text-ink">Lovosice (3 min od vlaku)</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* View Switcher on mobile */}
            <button
              onClick={() => onViewChange(currentView === 'map' ? 'case-study' : 'map')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                currentView === 'case-study'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-paper text-navy border-hairline hover:bg-white'
              }`}
            >
              {currentView === 'case-study' ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <Building className="w-3.5 h-3.5" />
              )}
              <span>{currentView === 'map' ? 'Modelový příklad' : 'Zpět na mapu'}</span>
            </button>

            {currentView === 'map' && (
              <div className="flex items-center bg-paper p-0.5 rounded-lg border border-hairline">
                <button
                  onClick={() => onMobileTabChange('list')}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeMobileTab === 'list'
                      ? 'bg-white text-navy shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Seznam</span>
                </button>
                <button
                  onClick={() => onMobileTabChange('map')}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeMobileTab === 'map'
                      ? 'bg-white text-navy shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Mapa</span>
                </button>
              </div>
            )}

            <button
              onClick={onOpenAbout}
              className="p-1.5 text-ink-muted hover:text-navy hover:bg-paper rounded-lg border border-hairline transition-colors"
              title="O datech a metodice"
              aria-label="O datech"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
          {/* Back button when viewing case study on desktop/tablet */}
          {currentView === 'case-study' && (
            <button
              onClick={() => onViewChange('map')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs text-navy hover:text-navy-dark bg-paper hover:bg-hairline rounded-lg border border-hairline transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Zpět na mapu</span>
            </button>
          )}

          {/* Main View Switcher (Desktop) */}
          <div className="hidden lg:flex items-center bg-paper p-1 rounded-lg border border-hairline">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1 font-semibold rounded-md transition-all ${
                currentView === 'map'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Mapa ČR</span>
            </button>
            <button
              onClick={() => onViewChange('case-study')}
              className={`flex items-center gap-1.5 px-3 py-1 font-semibold rounded-md transition-all ${
                currentView === 'case-study'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Modelový příklad: Lovosice</span>
            </button>
          </div>

          {/* Target Hub Switcher (shown in map view) */}
          {currentView === 'map' && (
            <div className="flex items-center gap-1.5 bg-paper p-1 rounded-lg border border-hairline">
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider pl-1.5 hidden xl:inline">
                Cíl:
              </span>
              {HUB_IDS.map((hubId) => {
                const hub = HUBS[hubId];
                const isActive = activeHub === hubId;
                return (
                  <button
                    key={hubId}
                    onClick={() => onHubChange(hubId)}
                    className={`px-3 py-1 font-semibold rounded-md transition-all ${
                      isActive
                        ? 'bg-navy text-white shadow-sm'
                        : 'text-ink-muted hover:text-ink hover:bg-white/60'
                    }`}
                  >
                    {hub.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode Switcher: Buy vs Rent */}
          {currentView === 'map' && (
            <div className="flex items-center bg-paper p-1 rounded-lg border border-hairline">
              <button
                onClick={() => onModeChange('buy')}
                className={`flex items-center gap-1 px-3 py-1 font-semibold rounded-md transition-all ${
                  mode === 'buy'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Koupě</span>
              </button>
              <button
                onClick={() => onModeChange('rent')}
                className={`flex items-center gap-1 px-3 py-1 font-semibold rounded-md transition-all ${
                  mode === 'rent'
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Nájem</span>
              </button>
            </div>
          )}

          {/* Apartment Size Pills */}
          {currentView === 'map' && (
            <div className="flex items-center bg-paper p-1 rounded-lg border border-hairline">
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider pl-1.5 pr-1 hidden sm:inline">
                Byt:
              </span>
              {([45, 65, 85] as ApartmentSize[]).map((size) => {
                const isActive = apartmentSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => onApartmentSizeChange(size)}
                    className={`px-2.5 py-1 font-mono font-medium rounded-md tabular-nums transition-all ${
                      isActive
                        ? 'bg-white text-ink font-bold shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {size}&nbsp;m²
                  </button>
                );
              })}
            </div>
          )}

          {/* About Button on desktop */}
          <button
            onClick={onOpenAbout}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-ink-muted hover:text-navy hover:bg-paper rounded-lg border border-hairline transition-colors font-medium ml-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>O datech</span>
          </button>
        </div>
      </div>
    </header>
  );
};
