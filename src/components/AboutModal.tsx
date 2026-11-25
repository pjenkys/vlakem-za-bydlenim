import React from 'react';
import { X, Train, Building2, Database, ShieldCheck, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-hairline p-6 md:p-8 text-ink"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-ink-muted hover:text-ink hover:bg-paper rounded-lg transition-colors"
          aria-label="Zavřít"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-navy text-xs font-bold uppercase tracking-wider mb-2">
          <Train className="w-4 h-4" />
          <span>Hackathon MVP · Výzkumný prototyp</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-4">
          Krize bydlení je v Česku především krizí dopravy
        </h2>

        <div className="space-y-4 text-sm leading-relaxed text-ink/90">
          <p className="font-medium text-base text-ink">
            Zatímco v Praze a Brně překračují ceny bytů 120 až 145 tisíc Kč za metr čtvereční, v obcích vzdálených 35 až 60 minut jízdy moderním vlakem klesá cena m² na třetinu až polovinu.
          </p>

          <div className="bg-paper p-4 rounded-lg border border-hairline space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Teze projektu Vlakem za bydlením
            </h3>
            <p className="text-xs text-ink-muted">
              Při standardním bytě (45–70 m²) činí rozdíl v pořizovací ceně mezi centrem metropole a příměstským satelitem s páteřní tratí často <strong>více než 3 až 5 milionů Kč</strong>. To v rodinném rozpočtu představuje úsporu na měsíční splátce hypotéky přes <strong>15 000 až 25 000 Kč každý měsíc</strong> po dobu 30 let.
            </p>
          </div>

          <h3 className="font-bold text-base text-ink pt-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-navy" />
            Datové zdroje a metodika
          </h3>

          <ul className="space-y-2 text-xs text-ink-muted list-disc list-inside">
            <li>
              <strong className="text-ink">Železniční data (JŘ 2026):</strong> Cestovní časy, intervaly ve špičce, první a poslední spoje vychází z reálných jízdních řádů Správy železnic a národních dopravců (České dráhy, RegioJet, Leo Express, Arriva, PID, IDS JMK).
            </li>
            <li>
              <strong className="text-ink">Ceny nemovitostí:</strong> Mediánové nabídkové ceny bytů (koupě a nájem) k roku 2026 ve třech cenových hladinách za m² podle velikosti bytu (1+kk 30 m², 2+kk 45 m², 3+kk 70 m²), neboť menší byty mají vyšší jednotkovou cenu za m².
            </li>
            <li>
              <strong className="text-ink">Hypoteční kalkulace:</strong> Modelováno na standardních parametrech ČNB: 80 % LTV, úroková sazba 4,99 % p.a., splatnost 30 let (360 měsíčních anuitních splátek).
            </li>
          </ul>

          <div className="border-t border-hairline pt-4 mt-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-navy mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Produkční architektura
            </h4>
            <p className="text-xs text-ink-muted">
              V plné verzi aplikace je systém napojen na automatizovaný GTFS feed z celostátního informačního systému o jízdních řádech (CIS JŘ) s automatickou synchronizací výluk a na realitní transakční databázi z Katastru nemovitostí ČR (Cenová mapa). Tento prototyp operuje nad kurátorovaným datovým setem <strong>78 klíčových železničních stanic České republiky</strong>.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-dark transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <span>Prozkoumat mapu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
