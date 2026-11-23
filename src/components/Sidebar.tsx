import React, { useState } from 'react';
import {
  Train,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import {
  Station,
  HubInfo,
  HousingMode,
  ApartmentSize,
  FilterState,
  FrequencyFilter,
  LastTrainFilter,
  SortOption,
} from '../types';
import {
  calculateStationMetrics,
  formatCzechNumber,
  formatPriceDiffBadge,
} from '../utils/calculations';
import { StationDetail } from './StationDetail';
import { STATIONS } from '../data/stations';

interface SidebarProps {
  stations: Station[];
  allEligibleCount: number;
  activeHub: HubInfo;
  mode: HousingMode;
  apartmentSize: ApartmentSize;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
  hoveredStationId: string | null;
  onHoverStation: (stationId: string | null) => void;
  onOpenCaseStudy?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stations,
  allEligibleCount,
  activeHub,
  mode,
  apartmentSize,
  filters,
  onFilterChange,
  onResetFilters,
  isFiltered,
  selectedStationId,
  onSelectStation,
  hoveredStationId,
  onHoverStation,
  onOpenCaseStudy,
}) => {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // If a station is selected, render StationDetail (check filtered stations first, then all stations)
  const selectedStation = selectedStationId
    ? stations.find((s) => s.id === selectedStationId) ||
      STATIONS.find((s) => s.id === selectedStationId) ||
      null
    : null;

  if (selectedStation) {
    return (
      <aside className="w-full md:w-[420px] lg:w-[440px] h-full flex flex-col bg-white border-r border-hairline overflow-hidden z-20 shadow-md">
        <StationDetail
          station={selectedStation}
          hub={activeHub}
          mode={mode}
          apartmentSize={apartmentSize}
          onBack={() => onSelectStation(null)}
          onOpenCaseStudy={onOpenCaseStudy}
        />
      </aside>
    );
  }

  const currentPriceMax = mode === 'buy' ? filters.maxBuyPrice : filters.maxRentPrice;
  const priceSliderMin = mode === 'buy' ? 35000 : 150;
  const priceSliderMax = mode === 'buy' ? 150000 : 450;
  const priceSliderStep = mode === 'buy' ? 5000 : 10;

  return (
    <aside className="w-full md:w-[420px] lg:w-[440px] h-full flex flex-col bg-paper border-r border-hairline overflow-hidden z-20">
      {/* Filters Header Accordion */}
      <div className="bg-white border-b border-hairline p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy hover:text-navy-dark transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtry dojezdu & rozpočtu</span>
            {filtersCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-ink-muted" />
            )}
          </button>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetovat filtry</span>
            </button>
          )}
        </div>

        {!filtersCollapsed && (
          <div className="space-y-3 pt-1 text-xs">
            {/* Travel Time Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-ink">
                  Max. dojezd vlakem {activeHub.toLabel}:
                </span>
                <span className="font-mono font-bold text-navy tabular-nums bg-paper px-1.5 py-0.5 rounded border border-hairline">
                  {filters.maxDurationMin} min
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={210}
                step={5}
                value={filters.maxDurationMin}
                onChange={(e) => onFilterChange({ maxDurationMin: Number(e.target.value) })}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-navy"
              />
              <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                <span>15 min</span>
                <span>60 min</span>
                <span>120 min</span>
                <span>210 min</span>
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-ink">Max. cena za m²:</span>
                <span className="font-mono font-bold text-navy tabular-nums bg-paper px-1.5 py-0.5 rounded border border-hairline">
                  {formatCzechNumber(currentPriceMax)} Kč/m²
                </span>
              </div>
              <input
                type="range"
                min={priceSliderMin}
                max={priceSliderMax}
                step={priceSliderStep}
                value={currentPriceMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (mode === 'buy') {
                    onFilterChange({ maxBuyPrice: val });
                  } else {
                    onFilterChange({ maxRentPrice: val });
                  }
                }}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-navy"
              />
              <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                <span>{formatCzechNumber(priceSliderMin)}</span>
                <span>{formatCzechNumber(priceSliderMax)} Kč/m²</span>
              </div>
            </div>

            {/* Peak Frequency Segmented Control */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-ink block">
                Min. četnost ve špičce:
              </span>
              <div className="grid grid-cols-4 gap-1 bg-paper p-0.5 rounded-lg border border-hairline text-center">
                {(
                  [
                    { key: 'all', label: 'Vše' },
                    { key: '1h', label: '1× / hod' },
                    { key: '2h', label: '2× / hod' },
                    { key: '4h', label: '4× / hod' },
                  ] as { key: FrequencyFilter; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => onFilterChange({ minFrequency: key })}
                    className={`py-1 text-[11px] font-semibold rounded transition-all ${
                      filters.minFrequency === key
                        ? 'bg-white text-navy font-bold shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Last Return Train Segmented Control */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-ink block">
                Poslední vlak {activeHub.fromLabel} domů:
              </span>
              <div className="grid grid-cols-4 gap-1 bg-paper p-0.5 rounded-lg border border-hairline text-center">
                {(
                  [
                    { key: 'any', label: 'Kdykoliv' },
                    { key: 'after21', label: 'po 21:00' },
                    { key: 'after22', label: 'po 22:00' },
                    { key: 'after23', label: 'po 23:00' },
                  ] as { key: LastTrainFilter; label: string }[]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => onFilterChange({ lastTrain: key })}
                    className={`py-1 text-[11px] font-semibold rounded transition-all ${
                      filters.lastTrain === key
                        ? 'bg-white text-navy font-bold shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Only Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-ink select-none">
                <input
                  type="checkbox"
                  checked={filters.directOnly}
                  onChange={(e) => onFilterChange({ directOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-hairline text-navy focus:ring-0 cursor-pointer accent-navy"
                />
                <span>Pouze přímé spoje bez přestupu</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Summary Strip & Sorting */}
      <div className="bg-paper px-4 py-2.5 border-b border-hairline flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-ink">
          Nalezeno <strong className="font-mono text-navy font-bold">{stations.length}</strong> z {allEligibleCount} stanic
        </span>

        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-ink-muted hidden sm:inline">Řazení:</span>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value as SortOption })}
              className="bg-white border border-hairline text-ink font-semibold rounded-md px-2 py-1 pr-6 appearance-none text-[11px] cursor-pointer hover:border-ink-muted transition-colors focus:outline-none"
            >
              <option value="value">Nejlepší poměr cena/čas</option>
              <option value="price">Nejlevnější m²</option>
              <option value="time">Nejrychlejší dojezd</option>
              <option value="savings">Největší úspora</option>
            </select>
            <ChevronDown className="w-3 h-3 text-ink-muted absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Station Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {stations.length === 0 ? (
          <div className="bg-white rounded-xl border border-hairline p-8 text-center space-y-3 my-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-paper mx-auto flex items-center justify-center text-ink-muted">
              <Filter className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-ink">Žádná stanice neodpovídá filtrům</h4>
            <p className="text-xs text-ink-muted">
              Zkuste zvětšit maximální dojezdovou dobu, posunout cenový limit nebo povolit přestupní spoje.
            </p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-dark transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetovat filtry</span>
            </button>
          </div>
        ) : (
          stations.map((station) => {
            const connection = station.connections[activeHub.id]!;
            const metrics = calculateStationMetrics(
              station,
              connection,
              activeHub,
              mode,
              apartmentSize
            );
            const diffBadge = formatPriceDiffBadge(metrics.priceDifference, mode);
            const isHovered = hoveredStationId === station.id;

            return (
              <div
                key={station.id}
                onClick={() => onSelectStation(station.id)}
                onMouseEnter={() => onHoverStation(station.id)}
                onMouseLeave={() => onHoverStation(null)}
                className={`group bg-white rounded-lg border p-3 cursor-pointer transition-all ${
                  isHovered
                    ? 'border-navy shadow-md ring-1 ring-navy/20 bg-paper/20'
                    : 'border-hairline hover:border-ink-muted/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h3 className="font-bold text-sm text-ink tracking-tight group-hover:text-navy transition-colors flex items-center gap-1.5">
                      <span>{station.name}</span>
                    </h3>
                    <span className="text-[10px] text-ink-muted block">{station.region}</span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: metrics.colorHex }}
                      />
                      <span className="font-mono font-bold text-xs text-ink tabular-nums">
                        {formatCzechNumber(metrics.pricePerSqm)}
                      </span>
                      <span className="text-[10px] text-ink-muted">Kč/m²</span>
                    </div>

                    <div className="mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          diffBadge.isPositive
                            ? 'bg-emerald-50 text-price-tier1 border-price-tier1/20'
                            : 'bg-rose-50 text-price-tier5 border-price-tier5/20'
                        }`}
                      >
                        {diffBadge.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Train details & timetable monospace strip */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-hairline/80">
                  <div className="flex items-center gap-1 font-mono font-bold text-navy">
                    <Train className="w-3.5 h-3.5" />
                    <span>{connection.durationMin} min</span>
                  </div>

                  <div className="font-mono text-[10px] text-ink-muted">
                    {connection.peakTrainsPerHour}×/hod · {connection.firstTrainToHub}–{connection.lastTrainFromHub} · {connection.isDirect ? 'Přímý' : 'Přestup'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
