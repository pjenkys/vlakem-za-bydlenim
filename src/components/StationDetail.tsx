import React from 'react';
import {
  ArrowLeft,
  Clock,
  Train,
  TrendingDown,
  TrendingUp,
  Footprints,
  Layers,
  Banknote,
  Percent,
  Sparkles,
  ArrowRight,
  Building,
} from 'lucide-react';
import { Station, HubInfo, HousingMode, ApartmentSize } from '../types';
import {
  calculateStationMetrics,
  formatCzechNumber,
  formatPriceDiffBadge,
} from '../utils/calculations';
import { generateStationListings } from '../utils/listings';

interface StationDetailProps {
  station: Station;
  hub: HubInfo;
  mode: HousingMode;
  apartmentSize: ApartmentSize;
  onBack: () => void;
  onOpenCaseStudy?: () => void;
}

export const StationDetail: React.FC<StationDetailProps> = ({
  station,
  hub,
  mode,
  apartmentSize,
  onBack,
  onOpenCaseStudy,
}) => {
  const connection = station.connections[hub.id];

  if (!connection) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-ink-muted">Pro vybraný cíl ({hub.label}) neexistuje přímé či spádové spojení z této stanice.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-paper text-ink font-semibold rounded-lg border border-hairline hover:bg-hairline transition-colors text-sm"
        >
          ← Zpět na seznam
        </button>
      </div>
    );
  }

  const metrics = calculateStationMetrics(station, connection, hub, mode, apartmentSize);
  const diffBadge = formatPriceDiffBadge(metrics.priceDifference, mode);
  const listings = generateStationListings(station, mode);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-paper/60 animate-in fade-in-50 duration-200">
      {/* Top back navigation and station header */}
      <div className="space-y-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-navy-dark transition-colors bg-white px-3 py-1.5 rounded-lg border border-hairline shadow-2xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zpět na seznam stanic</span>
        </button>

        <div className="bg-white rounded-xl border border-hairline p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-paper text-ink-muted border border-hairline">
                  {station.region}
                </span>
                {connection.isDirect ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-price-tier1 border border-price-tier1/20">
                    Přímý spoj
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-price-tier3 border border-price-tier3/20">
                    S přestupem
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight mt-1">
                {station.name}
              </h2>
            </div>

            <div className="text-right flex flex-col items-end">
              <div
                className="w-3.5 h-3.5 rounded-full mb-1 shadow-sm"
                style={{ backgroundColor: metrics.colorHex }}
                title={`Cenová kategorie`}
              />
              <span className="text-lg font-mono font-bold text-ink tabular-nums">
                {formatCzechNumber(metrics.pricePerSqm)}
              </span>
              <span className="text-[11px] text-ink-muted">Kč/m²</span>
            </div>
          </div>
        </div>

        {/* Highlighted Case Study Banner for Lovosice */}
        {station.id === 'lovosice' && onOpenCaseStudy && (
          <div className="bg-gradient-to-r from-navy to-navy-dark text-white rounded-xl p-4 shadow-md space-y-2.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Doporučený modelový příklad
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/90">
                210 m od nádraží
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Byt 2+1 (53 m²) v Lovosicích za 3 190 000 Kč</span>
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Podívejte se na kompletní kalkulaci reálného inzerátu z Terezínské ulice: splátka hypotéky,
                daňová vratka, spolubydlení, síťová jízdenka IN 100 a refinancování za 3 roky.
              </p>
            </div>

            <button
              onClick={onOpenCaseStudy}
              className="w-full mt-1 py-2 px-3 bg-white text-navy font-bold text-xs rounded-lg hover:bg-paper transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Otevřít podrobný modelový příklad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card 1 — Železniční spojení */}
      <div className="bg-white rounded-xl border border-hairline p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-hairline pb-2.5">
          <h3 className="font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
            <Train className="w-4 h-4" />
            Železniční spojení ({hub.toLabel})
          </h3>
          <span className="font-mono text-xs font-semibold text-ink bg-paper px-2 py-0.5 rounded border border-hairline">
            {connection.durationMin} min
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-paper/70 p-2.5 rounded-lg border border-hairline/80">
            <span className="text-[10px] uppercase font-bold text-ink-muted block mb-0.5">
              Cílová stanice
            </span>
            <span className="font-semibold text-ink">{connection.terminus}</span>
          </div>

          <div className="bg-paper/70 p-2.5 rounded-lg border border-hairline/80">
            <span className="text-[10px] uppercase font-bold text-ink-muted block mb-0.5">
              Četnost ve špičce
            </span>
            <span className="font-mono font-bold text-ink">
              {connection.peakTrainsPerHour}× / hod
            </span>
            <span className="text-ink-muted text-[10px] ml-1">({connection.dailyTrains} spojů/den)</span>
          </div>

          <div className="bg-paper/70 p-2.5 rounded-lg border border-hairline/80">
            <span className="text-[10px] uppercase font-bold text-ink-muted block mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              První ranní vlak {hub.toLabel}
            </span>
            <span className="font-mono font-bold text-ink">{connection.firstTrainToHub}</span>
          </div>

          <div className="bg-paper/70 p-2.5 rounded-lg border border-hairline/80">
            <span className="text-[10px] uppercase font-bold text-ink-muted block mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Poslední noční vlak {hub.fromLabel}
            </span>
            <span className="font-mono font-bold text-ink">{connection.lastTrainFromHub}</span>
          </div>
        </div>

        {/* Carriers */}
        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-ink-muted mr-1">Dopravci:</span>
          {connection.carriers.map((carrier) => (
            <span
              key={carrier}
              className="px-2 py-0.5 bg-paper text-ink font-medium rounded text-[11px] border border-hairline"
            >
              {carrier}
            </span>
          ))}
        </div>
      </div>

      {/* Card 2 — Ekonomika bydlení */}
      <div className="bg-white rounded-xl border border-hairline p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-hairline pb-2.5">
          <h3 className="font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
            <Banknote className="w-4 h-4" />
            Ekonomika bydlení ({hub.vsLabel})
          </h3>
          <span className="text-xs text-ink-muted font-medium">Byt {apartmentSize} m²</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-paper rounded-lg border border-hairline">
            <div>
              <span className="text-xs text-ink-muted block">
                Odhadovaná cena {apartmentSize}m² bytu:
              </span>
              <span className="text-lg font-mono font-bold text-ink tabular-nums">
                {formatCzechNumber(metrics.totalApartmentPrice)}&nbsp;Kč
                {mode === 'rent' && <span className="text-xs font-sans text-ink-muted font-normal"> / měs.</span>}
              </span>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border ${
                  diffBadge.isPositive
                    ? 'bg-emerald-50 text-price-tier1 border-price-tier1/20'
                    : 'bg-rose-50 text-price-tier5 border-price-tier5/20'
                }`}
              >
                {diffBadge.isPositive ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                {diffBadge.label}
              </span>
            </div>
          </div>

          {/* Baseline comparison */}
          <div className="text-xs text-ink-muted flex items-center justify-between px-1">
            <span>Základní úroveň {hub.label}:</span>
            <span className="font-mono font-medium text-ink">
              {formatCzechNumber(
                (mode === 'buy' ? hub.baselineBuyPrice : hub.baselineRentPrice) * apartmentSize
              )} Kč
              {mode === 'rent' ? '/měs.' : ''} ({formatCzechNumber(mode === 'buy' ? hub.baselineBuyPrice : hub.baselineRentPrice)} Kč/m²)
            </span>
          </div>

          {/* Buy mode: Mortgage breakdown */}
          {mode === 'buy' && metrics.monthlyMortgage && metrics.hubMonthlyMortgage && (
            <div className="border-t border-hairline pt-3 mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted flex items-center gap-1">
                  <Percent className="w-3 h-3 text-navy" />
                  Měsíční splátka hypotéky (80 % LTV, 4,8 %, 30 let):
                </span>
                <span className="font-mono font-bold text-ink tabular-nums">
                  {formatCzechNumber(metrics.monthlyMortgage)} Kč/měs.
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span>Stejný byt přímo {hub.toLabel}:</span>
                <span className="font-mono text-ink tabular-nums">
                  {formatCzechNumber(metrics.hubMonthlyMortgage)} Kč/měs.
                </span>
              </div>

              {metrics.mortgageDifference && metrics.mortgageDifference > 0 && (
                <div className="p-2.5 rounded bg-emerald-50/70 border border-price-tier1/20 text-xs text-price-tier1 font-medium flex items-center justify-between">
                  <span>Měsíční úspora na splátce:</span>
                  <span className="font-mono font-bold text-sm">
                    +{formatCzechNumber(metrics.mortgageDifference)} Kč / měsíc
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card 3 — Ukázkové nabídky v docházkové vzdálenosti */}
      <div className="bg-white rounded-xl border border-hairline p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-hairline pb-2.5">
          <h3 className="font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Ukázkové nabídky v docházkové vzdálenosti
          </h3>
          <span className="text-[11px] text-ink-muted">do 15 min od nádraží</span>
        </div>

        <div className="space-y-2.5">
          {listings.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-hairline bg-paper/40 hover:bg-paper/90 transition-colors space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-navy bg-white px-1.5 py-0.5 rounded border border-hairline">
                      {item.layout}
                    </span>
                    <span className="text-xs font-semibold text-ink">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-1">
                    <span>{item.areaSqm} m²</span>
                    <span>•</span>
                    <span>{item.condition}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-navy">
                      <Footprints className="w-3 h-3" />
                      {item.walkingMinutes} min k vlaku
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-mono font-bold text-sm text-ink block tabular-nums">
                    {formatCzechNumber(item.price)}&nbsp;Kč
                    {mode === 'rent' && <span className="text-[10px] font-sans font-normal text-ink-muted">/měs.</span>}
                  </span>
                  <span className="text-[10px] text-ink-muted font-mono tabular-nums">
                    {formatCzechNumber(item.pricePerSqm)} Kč/m²
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
