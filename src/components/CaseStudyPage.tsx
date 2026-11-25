import React, { useState, useMemo } from 'react';
import {
  Train,
  Home,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Users,
  Sliders,
  ArrowRight,
  Settings2,
  Car,
  Fuel,
  Building2,
  Coins,
  Gem,
  AlertTriangle,
} from 'lucide-react';
import {
  CASE_STUDY_LISTING,
  CASE_STUDY_LOCATION,
  CASE_STUDY_RAIL,
} from '../data/caseStudyLovosice';
import {
  CarPreset,
  calculateMortgageDetails,
  calculateMortgageTaxRefundMonthly,
  calculateThreeYearProjection,
  calculateEquityBuilding,
  calculatePragueComparison,
  calculateCarFreeSavings,
  MonthlyExpensesBreakdown,
  MonthlyIncomeBreakdown,
} from '../utils/caseStudyMath';
import { CaseStudyWalkingMap } from './CaseStudyWalkingMap';
import { formatCzechNumber } from '../utils/calculations';

interface CaseStudyPageProps {
  onBackToMap: () => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ onBackToMap }) => {
  // --- Photo Gallery State ---
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // --- Commute Constants (fixed IN 100 unlimited pass: 22 000 Kč / rok) ---
  const trainCommuteAnnual = CASE_STUDY_RAIL.in100AnnualCardCzk; // 22 000 Kč
  const trainCommuteMonthly = CASE_STUDY_RAIL.in100MonthlyEquivalentCzk; // 1 833 Kč

  // --- Financing & Mortgage State ---
  const [purchasePrice, setPurchasePrice] = useState(CASE_STUDY_LISTING.priceCzk);
  const [priceInputStr, setPriceInputStr] = useState(formatCzechNumber(CASE_STUDY_LISTING.priceCzk));
  const [downPaymentPercent, setDownPaymentPercent] = useState<10 | 20>(10);
  const [interestRate, setInterestRate] = useState(4.99); // Default 4.99% p.a.

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^\d]/g, '');
    if (rawDigits === '') {
      setPriceInputStr('');
      return;
    }
    const val = parseInt(rawDigits, 10);
    setPriceInputStr(formatCzechNumber(val));
    setPurchasePrice(val);
  };

  // --- Property Appreciation State ---
  const [appreciationPercent, setAppreciationPercent] = useState(3.0); // Default 3.0% p.a.

  const lovosicePricePerSqm = useMemo(() => {
    return Math.round(purchasePrice / CASE_STUDY_LISTING.usableAreaSqm);
  }, [purchasePrice]);

  // --- Operating Expenses State (defaults based on listing & Lovosice reality) ---
  const [expensesCollapsed, setExpensesCollapsed] = useState(false);
  const [hoaRepairFund, setHoaRepairFund] = useState(CASE_STUDY_LISTING.hoaRepairFundCzk);
  const [heatingAndHotWater, setHeatingAndHotWater] = useState(1800);
  const [waterAndSewer, setWaterAndSewer] = useState(700);
  const [electricity, setElectricity] = useState(1300);
  const [hoaServicesAndAdmin, setHoaServicesAndAdmin] = useState(650);
  const [insurance, setInsurance] = useState(300);
  const [internetAndFees, setInternetAndFees] = useState(700);
  const [propertyTaxMonthly, setPropertyTaxMonthly] = useState(120);
  const [includeMaintenanceReserve, setIncludeMaintenanceReserve] = useState(true);
  const maintenanceReserveAmount = includeMaintenanceReserve ? 500 : 0;

  // --- Room Rental State ---
  const [rentOutRoom, setRentOutRoom] = useState(true);
  const [roomRentAmount, setRoomRentAmount] = useState(6000);
  const [deductRoomRentTax, setDeductRoomRentTax] = useState(true);

  // --- Car-free Preset State (Default: Starší ojetina 150 tis. Kč) ---
  const [carPreset, setCarPreset] = useState<CarPreset>('older');
  const [carFreeExpanded, setCarFreeExpanded] = useState(false);

  // --- 3-Year Projection State ---
  const [wagePreset, setWagePreset] = useState<'prague' | 'cr' | 'custom'>('prague');
  const [customNetWage, setCustomNetWage] = useState(51060);
  const [wageGrowthRate, setWageGrowthRate] = useState(5.5);
  const [refinancingRate, setRefinancingRate] = useState(4.4);
  const [costInflationRate] = useState(2.5);

  // Active net wage in 2026
  const activeNetWage = useMemo(() => {
    if (wagePreset === 'prague') return 51060; // 66 459 Kč hrubého (ČSÚ 2Q 2026 Praha)
    if (wagePreset === 'cr') return 40710; // 51 966 Kč hrubého (ČSÚ 2Q 2026 ČR)
    return customNetWage;
  }, [wagePreset, customNetWage]);

  // 1. Mortgage Calculations (Default 4.99%)
  const mortgage = useMemo(() => {
    return calculateMortgageDetails(
      purchasePrice,
      downPaymentPercent,
      interestRate,
      refinancingRate,
      360
    );
  }, [purchasePrice, downPaymentPercent, interestRate, refinancingRate]);

  // 3. Equity Building (Principal + Property Appreciation)
  const equity = useMemo(() => {
    return calculateEquityBuilding(
      purchasePrice,
      mortgage.averageMonthlyPrincipalYear1,
      appreciationPercent
    );
  }, [purchasePrice, mortgage.averageMonthlyPrincipalYear1, appreciationPercent]);

  // Proportional ratio for mortgage interest deduction under § 15 ZDP:
  // 70% when 1 room is officially rented out under § 9 with shared common spaces; 100% when living alone
  const ownerOccupiedRatio = rentOutRoom && deductRoomRentTax ? 0.70 : 1.0;

  // 4. Tax Refund (§ 15 ZDP)
  const taxRefund = useMemo(() => {
    return calculateMortgageTaxRefundMonthly(mortgage.interestPaidYear1, ownerOccupiedRatio);
  }, [mortgage.interestPaidYear1, ownerOccupiedRatio]);

  const taxRefundAlone = useMemo(() => {
    return calculateMortgageTaxRefundMonthly(mortgage.interestPaidYear1, 1.0);
  }, [mortgage.interestPaidYear1]);

  const year4TaxRefund = useMemo(() => {
    return calculateMortgageTaxRefundMonthly(mortgage.interestPaidYear4, ownerOccupiedRatio);
  }, [mortgage.interestPaidYear4, ownerOccupiedRatio]);

  // 5. Shared Operating Expenses & Roommate Utility Share (50/50 split of consumable services)
  // Shared items: dálkové vytápění & TUV, vodné a stočné, elektřina byt, služby SVJ (úklid, osvětlení, správa), pojištění, internet & koncese.
  // Owner-only items: fond oprav SVJ (1 400 Kč), daň z nemovitosti (120 Kč), rezerva na údržbu (500 Kč) hradí 100 % majitel.
  const sharedOperatingExpenses = useMemo(() => {
    return (
      heatingAndHotWater +
      waterAndSewer +
      electricity +
      hoaServicesAndAdmin +
      insurance +
      internetAndFees
    );
  }, [
    heatingAndHotWater,
    waterAndSewer,
    electricity,
    hoaServicesAndAdmin,
    insurance,
    internetAndFees,
  ]);

  // Podíl spolubydlícího na energiích a provozu (přesně 50 % ze sdílených položek)
  const roommateUtilitiesShare = useMemo(() => {
    return rentOutRoom ? Math.round(sharedOperatingExpenses / 2) : 0;
  }, [rentOutRoom, sharedOperatingExpenses]);

  // Teoretický podíl spolubydlícího na energiích pro zobrazení, i když je pokoj vypnutý
  const simRoommateUtilitiesShare = useMemo(() => {
    return Math.round(sharedOperatingExpenses / 2);
  }, [sharedOperatingExpenses]);

  // 6. Room Rental Net Income (§ 9 ZDP: zdanění výhradně holého nájmu, energie se nedaní)
  const roomPureRent = roomRentAmount; // Default 6 000 Kč / měs.

  // § 9 ZDP: 30% výdajový paušál, 15% daň z příjmu ze 70 % zdanitelného holého nájmu
  const roomRentTaxMonthly = useMemo(() => {
    if (!rentOutRoom || !deductRoomRentTax) return 0;
    return Math.round(roomPureRent * 0.70 * 0.15); // e.g. 6 000 * 0.70 * 0.15 = 630 Kč / měs.
  }, [rentOutRoom, deductRoomRentTax, roomPureRent]);

  // Čistý holý nájem po zdanění
  const roomPureRentNet = useMemo(() => {
    return roomPureRent - roomRentTaxMonthly; // e.g. 6 000 - 630 = 5 370 Kč / měs.
  }, [roomPureRent, roomRentTaxMonthly]);

  // Celková platba spolubydlícího majiteli (holý nájem + 50 % energií a provozu)
  const roommateTotalPayment = useMemo(() => {
    if (!rentOutRoom) return 0;
    return roomPureRent + roommateUtilitiesShare; // e.g. 6 000 + 2 725 = 8 725 Kč / měs.
  }, [rentOutRoom, roomPureRent, roommateUtilitiesShare]);

  // Čistý měsíční přínos do rozpočtu majitele (čistý nájem po dani + polovina energií)
  const roomRentNet = useMemo(() => {
    if (!rentOutRoom) return 0;
    return roomPureRentNet + roommateUtilitiesShare; // e.g. 5 370 + 2 725 = 8 095 Kč / měs.
  }, [rentOutRoom, roomPureRentNet, roommateUtilitiesShare]);

  // 7. Monthly Expenses Summary
  const monthlyExpenses: MonthlyExpensesBreakdown = useMemo(() => {
    const total =
      mortgage.monthlyPayment +
      hoaRepairFund +
      heatingAndHotWater +
      waterAndSewer +
      electricity +
      hoaServicesAndAdmin +
      insurance +
      internetAndFees +
      propertyTaxMonthly +
      maintenanceReserveAmount +
      trainCommuteMonthly;

    return {
      mortgagePayment: mortgage.monthlyPayment,
      hoaRepairFund,
      heatingAndHotWater,
      waterAndSewer,
      electricity,
      gas: 0,
      hoaServicesAndAdmin,
      insurancePropertyAndHome: insurance,
      internetAndBroadcastFees: internetAndFees,
      propertyTaxMonthly,
      apartmentMaintenanceReserve: maintenanceReserveAmount,
      trainCommuteMonthly,
      totalGrossExpenses: total,
    };
  }, [
    mortgage.monthlyPayment,
    hoaRepairFund,
    heatingAndHotWater,
    waterAndSewer,
    electricity,
    hoaServicesAndAdmin,
    insurance,
    internetAndFees,
    propertyTaxMonthly,
    maintenanceReserveAmount,
    trainCommuteMonthly,
  ]);

  // 8. Monthly Incomes Summary
  const monthlyIncomes: MonthlyIncomeBreakdown = useMemo(() => {
    const total = taxRefund.monthlyRefund + roomRentNet;
    return {
      mortgageTaxRefundMonthly: taxRefund.monthlyRefund,
      roomRentGross: rentOutRoom ? roommateTotalPayment : 0,
      roomRentTaxMonthly,
      roomRentNet,
      roomPureRent,
      roommateUtilitiesShare,
      roommateTotalPayment,
      totalIncomeAndOffsets: total,
    };
  }, [
    taxRefund.monthlyRefund,
    rentOutRoom,
    roommateTotalPayment,
    roomRentTaxMonthly,
    roomRentNet,
    roomPureRent,
    roommateUtilitiesShare,
  ]);

  // Net monthly out-of-pocket cost
  const netMonthlyCost = useMemo(() => {
    return monthlyExpenses.totalGrossExpenses - monthlyIncomes.totalIncomeAndOffsets;
  }, [monthlyExpenses.totalGrossExpenses, monthlyIncomes.totalIncomeAndOffsets]);

  // Net cost alone (when living alone in Lovosice without room rental)
  const netCostAlone = useMemo(() => {
    return monthlyExpenses.totalGrossExpenses - taxRefundAlone.monthlyRefund;
  }, [monthlyExpenses.totalGrossExpenses, taxRefundAlone.monthlyRefund]);

  // Net cost with roommate (when renting out room, for comparison notes if toggled off)
  const netCostWithRoommate = useMemo(() => {
    const taxWithRoom = calculateMortgageTaxRefundMonthly(
      mortgage.interestPaidYear1,
      deductRoomRentTax ? 0.70 : 1.0
    );
    const taxMonthly = deductRoomRentTax ? Math.round(roomRentAmount * 0.70 * 0.15) : 0;
    const simNetRent = (roomRentAmount - taxMonthly) + simRoommateUtilitiesShare;
    return monthlyExpenses.totalGrossExpenses - (taxWithRoom.monthlyRefund + simNetRent);
  }, [
    mortgage.interestPaidYear1,
    deductRoomRentTax,
    roomRentAmount,
    simRoommateUtilitiesShare,
    monthlyExpenses.totalGrossExpenses,
  ]);

  // 8. Direct Prague Comparison (Buy vs Rent vs Lovosice)
  const pragueComparison = useMemo(() => {
    return calculatePragueComparison(
      CASE_STUDY_LISTING.usableAreaSqm,
      purchasePrice,
      netMonthlyCost,
      interestRate
    );
  }, [purchasePrice, netMonthlyCost, interestRate]);

  // 9. Car-free Savings Math (linked dynamically to fixed IN 100 annual cost and car preset)
  const carSavings = useMemo(() => {
    return calculateCarFreeSavings(trainCommuteAnnual, carPreset);
  }, [trainCommuteAnnual, carPreset]);

  const netCarSavingsYearly = carSavings.netCarFreeSavingsAnnual;
  const netCarSavingsMonthly = carSavings.netCarFreeSavingsMonthly;
  const mortgageCoveragePct =
    mortgage.monthlyPayment > 0
      ? Math.round((netCarSavingsMonthly / mortgage.monthlyPayment) * 100)
      : 0;

  // Car Purchase Price as Mortgage Down Payment ("Vstupní kapitál")
  const carPurchasePrice = carSavings.carPurchasePrice;
  const requiredDownPayment = mortgage.downPaymentCzk;
  const downPaymentCoveragePct =
    requiredDownPayment > 0
      ? Math.min(100, Math.round((carPurchasePrice / requiredDownPayment) * 100))
      : 100;
  const remainingDownPayment = Math.max(0, requiredDownPayment - carPurchasePrice);
  const yearsToSaveRestVal =
    remainingDownPayment > 0
      ? remainingDownPayment / Math.max(1, netCarSavingsYearly)
      : 0;
  const yearsToSaveRest = yearsToSaveRestVal.toFixed(1).replace('.', ',');

  // 10. 3-Year Horizon Projection
  const projection = useMemo(() => {
    return calculateThreeYearProjection(
      activeNetWage,
      wageGrowthRate,
      monthlyExpenses,
      monthlyIncomes,
      mortgage.refinancedMonthlyPayment,
      year4TaxRefund.monthlyRefund,
      costInflationRate
    );
  }, [
    activeNetWage,
    wageGrowthRate,
    monthlyExpenses,
    monthlyIncomes,
    mortgage.refinancedMonthlyPayment,
    year4TaxRefund.monthlyRefund,
    costInflationRate,
  ]);

  return (
    <div className="w-full h-full overflow-y-auto bg-paper text-ink pb-20 selection:bg-navy selection:text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-navy text-white">
              Hloubková případová studie
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-ink-muted border border-hairline">
              Ústecký kraj · okres Litoměřice
            </span>
            <a
              href={CASE_STUDY_LISTING.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1 ml-auto"
            >
              <span>Zobrazit inzerát na Sreality.cz</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-ink font-sans">
              Byt 2+1 (53 m²) 3 minuty pěšky od nádraží Lovosice
            </h1>
            <p className="text-sm md:text-base text-ink-muted mt-1 max-w-3xl leading-relaxed">
              Kompletní rozpad osobních financí, daňových úlev, nákladů na dojíždění rychlíkem do Prahy,
              spolubydlení, života bez auta a 3letého refinancování.
            </p>
          </div>

          {/* 4 Hero KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Kupní cena nemovitosti
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-ink tabular-nums">
                {formatCzechNumber(purchasePrice)}&nbsp;Kč
              </div>
              <div className="text-[11px] font-mono text-price-tier2 font-semibold mt-0.5">
                {formatCzechNumber(lovosicePricePerSqm)} Kč / m²
              </div>
            </div>

            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1 flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-navy" />
                Dojezd do Prahy
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-navy tabular-nums">
                56–68 min
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                Rychlík R20 Labe (Podbaba 56 min · hl.n. 68 min)
              </div>
            </div>

            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Vzdálenost k vlaku
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-price-tier1 tabular-nums">
                3 minuty
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                Přesně 210 m po rovině
              </div>
            </div>

            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-navy" />
                Poslední vlak z Prahy
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-navy tabular-nums">
                00:15
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                R20 ve 23:10, noční Os v 00:15 — stíháte večeři i divadlo
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: REAL PHOTO GALLERY & SREALITY DATA SNAPSHOT */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
              <Home className="w-4 h-4 text-navy" />
              <span>Reálné fotografie bytu a parametry nabídky</span>
            </h2>
            <span className="text-xs font-mono font-semibold text-ink-muted bg-paper px-2 py-0.5 rounded border border-hairline">
              Kód: {CASE_STUDY_LISTING.id}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-paper border border-hairline">
                <img
                  src={CASE_STUDY_LISTING.images[selectedPhotoIdx].url}
                  alt={CASE_STUDY_LISTING.images[selectedPhotoIdx].caption}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent p-3 text-white text-xs">
                  <span className="font-bold mr-1.5">{selectedPhotoIdx + 1} / {CASE_STUDY_LISTING.images.length}:</span>
                  {CASE_STUDY_LISTING.images[selectedPhotoIdx].caption}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {CASE_STUDY_LISTING.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPhotoIdx === idx
                        ? 'border-navy shadow-sm scale-[1.03]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Structured Specifications Grid (5 cols) */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">
                    Dispozice & plocha
                  </span>
                  <span className="font-bold text-ink text-sm">2+1 (53 m²)</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">
                    + sklep 4,7 m² + balkon
                  </span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">
                    Podlaží & budova
                  </span>
                  <span className="font-bold text-ink text-sm">2. NP ze 4</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">
                    Revitalizovaný dům, nová fasáda
                  </span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">
                    Vlastnictví & PENB
                  </span>
                  <span className="font-bold text-ink text-sm">Osobní · Třída C</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    Nízké energetické ztráty
                  </span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">
                    Fond oprav (SVJ)
                  </span>
                  <span className="font-mono font-bold text-ink text-sm">1 400 Kč / měs.</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">
                    Zdravé SVJ, bez plánu navýšení
                  </span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline col-span-2">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">
                    Vytápění & orientace
                  </span>
                  <span className="font-semibold text-ink">
                    Dálkové ústřední vytápění a ohřev TUV · Jižní orientace oken
                  </span>
                </div>
              </div>

              {/* Checkbox: Pronajímat neprůchozí pokoj kamarádovi? */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  rentOutRoom
                    ? 'bg-emerald-50/80 border-price-tier1/40 shadow-xs'
                    : 'bg-paper/70 border-hairline hover:border-ink/20'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={rentOutRoom}
                      onChange={(e) => setRentOutRoom(e.target.checked)}
                      className="w-4 h-4 rounded text-navy focus:ring-navy border-hairline accent-navy cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Users className={`w-3.5 h-3.5 ${rentOutRoom ? 'text-price-tier1' : 'text-navy'}`} />
                        Pronajímat neprůchozí pokoj kamarádovi?
                      </span>
                      {rentOutRoom && (
                        <span className="text-[10px] font-mono font-bold text-price-tier1 bg-white px-2 py-0.5 rounded border border-price-tier1/20">
                          +{formatCzechNumber(roomRentAmount)} Kč holý nájem + energie
                        </span>
                      )}
                    </div>

                    {rentOutRoom ? (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-price-tier1 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Také to vyřeší bytovou situaci hned 2 lidem :)</span>
                        </div>
                        <p className="text-[11px] text-ink-muted leading-relaxed">
                          Byt má 2 samostatné neprůchozí pokoje a oddělenou kuchyň. Kamarád získá férové bydlení 3 minuty od vlaku za{' '}
                          <strong className="text-ink">
                            holý nájem {formatCzechNumber(roomRentAmount)} Kč + energie a služby napůl ({formatCzechNumber(roommateUtilitiesShare)} Kč, celkem {formatCzechNumber(roommateTotalPayment)} Kč/měs. all-inclusive)
                          </strong>{' '}
                          a vám klesne čistý výdaj z kapsy na pouhých{' '}
                          <strong className="text-price-tier1 font-mono">{formatCzechNumber(netMonthlyCost)} Kč/měs.</strong>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-[11px] text-ink-muted leading-relaxed">
                          Bydlíte v celém 2+1 sami (čistý náklad <strong className="text-ink">{formatCzechNumber(netCostAlone)} Kč/měs.</strong>, 100% daňový odpočet).{' '}
                          <span className="text-navy font-semibold">
                            Zaškrtnutím zapojíte spolubydlícího (holý nájem {formatCzechNumber(roomRentAmount)} Kč + energie napůl) a také to vyřeší bytovou situaci hned 2 lidem :)
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Collapsible Original Description */}
              <div className="border border-hairline rounded-lg p-3 bg-paper/40 space-y-2">
                <button
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="w-full flex items-center justify-between text-xs font-bold text-navy hover:text-navy-dark"
                >
                  <span>Původní popis makléře z inzerátu</span>
                  {descriptionExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                {descriptionExpanded && (
                  <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line pt-1 border-t border-hairline">
                    {CASE_STUDY_LISTING.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* NEW SECTION: PRAGUE VS LOVOSICE COMPARISON (BUY vs RENT vs LOVOSICE) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Building2 className="w-4 h-4 text-navy" />
                <span>Přímé srovnání: Byt 2+1 (53 m²) v Praze vs. v Lovosicích</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Kolik by stála koupě a nájem stejného bytu přímo v Praze při současných cenách (metodicky shodné parametry)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Prague Buy */}
            <div className="p-4 rounded-xl border border-hairline bg-paper/50 space-y-3 text-xs">
              <div className="pb-2 border-b border-hairline">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                  Varianta 1
                </span>
                <h3 className="font-bold text-sm text-ink">Koupě 2+1 (53 m²) v Praze</h3>
                <span className="text-[11px] font-mono text-ink-muted">145 000 Kč / m²</span>
              </div>

              <div className="space-y-1.5 font-mono tabular-nums">
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Kupní cena:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(pragueComparison.praguePurchasePrice)} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Vlastní zdroje (10 %):</span>
                  <span className="font-bold text-ink">{formatCzechNumber(pragueComparison.pragueDownPayment10Percent)} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Splátka hypotéky (4,99 %):</span>
                  <span className="font-bold text-rose-700">{formatCzechNumber(pragueComparison.pragueMortgageMonthly)} Kč / měs.</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Energie a SVJ (53 m²):</span>
                  <span className="text-ink">{formatCzechNumber(pragueComparison.pragueOperatingCostsMonthly)} Kč / měs.</span>
                </div>
                <div className="flex justify-between text-price-tier1 font-semibold">
                  <span className="font-sans">Daňová vratka § 15 ZDP:</span>
                  <span>-{formatCzechNumber(pragueComparison.pragueTaxRefundMonthly)} Kč / měs.</span>
                </div>
                <div className="pt-2 border-t border-hairline flex justify-between font-bold text-sm">
                  <span className="font-sans text-ink">Čistý náklad po daních:</span>
                  <span className="text-rose-700">{formatCzechNumber(pragueComparison.pragueTotalMonthlyNet)} Kč / měs.</span>
                </div>
              </div>
            </div>

            {/* 2. Prague Rent */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3 text-xs">
              <div className="pb-2 border-b border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                  Varianta 2
                </span>
                <h3 className="font-bold text-sm text-ink">Nájem 2+1 (53 m²) v Praze</h3>
                <span className="text-[11px] font-mono text-ink-muted">415 Kč / m²</span>
              </div>

              <div className="space-y-1.5 font-mono tabular-nums">
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Čistý nájem měsíčně:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(pragueComparison.praguePureRentMonthly)} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Poplatky a zálohy:</span>
                  <span className="text-ink">{formatCzechNumber(pragueComparison.pragueRentOperatingCostsMonthly)} Kč</span>
                </div>
                <div className="flex justify-between text-rose-800 font-bold">
                  <span className="font-sans">Celkem nájemné:</span>
                  <span className="text-sm">{formatCzechNumber(pragueComparison.pragueTotalRentMonthly)} Kč / měs.</span>
                </div>
                <div className="pt-2 border-t border-rose-200 text-[11px] text-rose-700 leading-tight">
                  ⚠️ 100% utopený náklad. Za 10 let zaplatíte téměř <strong>3,3 mil. Kč bez inflace</strong> (při 3% růstu nájmu přes <strong>3,7 mil. Kč</strong>) a nevlastníte nic.
                </div>
              </div>
            </div>

            {/* 3. Lovosice Own */}
            <div className="p-4 rounded-xl border border-price-tier1 bg-emerald-50/50 space-y-3 text-xs shadow-xs">
              <div className="pb-2 border-b border-price-tier1/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-price-tier1 block">
                  Vítězná varianta
                </span>
                <h3 className="font-bold text-sm text-ink">Vlastní 2+1 v Lovosicích + vlak</h3>
                <span className="text-[11px] font-mono text-price-tier1 font-bold">
                  {formatCzechNumber(lovosicePricePerSqm)} Kč / m²
                </span>
              </div>

              <div className="space-y-1.5 font-mono tabular-nums">
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Kupní cena:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(purchasePrice)} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Vlastní zdroje (10 %):</span>
                  <span className="font-bold text-emerald-800">{formatCzechNumber(mortgage.downPaymentCzk)} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-ink-muted">Splátka hypotéky (4,99 %):</span>
                  <span className="font-bold text-ink">{formatCzechNumber(mortgage.monthlyPayment)} Kč / měs.</span>
                </div>
                <div className="flex justify-between text-price-tier1 font-bold">
                  <span className="font-sans">Čistý náklad z kapsy:</span>
                  <span className="text-sm">{formatCzechNumber(netMonthlyCost)} Kč / měs.</span>
                </div>
                <div className="pt-2 border-t border-price-tier1/30 space-y-1.5">
                  <div className="text-[11px] text-price-tier1 font-semibold leading-tight">
                    ✓ Úspora <strong>{formatCzechNumber(pragueComparison.pragueTotalRentMonthly - netMonthlyCost)} Kč měsíčně</strong> oproti nájmu v Praze + tvorba vlastního majetku!
                  </div>
                  {rentOutRoom ? (
                    <div className="text-[10.5px] text-emerald-800 bg-white/75 p-1.5 rounded border border-price-tier1/20 font-medium leading-tight">
                      Včetně pronájmu 1 pokoje kamarádovi (holý nájem {formatCzechNumber(roomRentAmount)} Kč + energie napůl · řeší bydlení 2 lidem najednou · bez spolubydlícího: <strong>{formatCzechNumber(netCostAlone)} Kč/měs.</strong> — stále o <strong>{formatCzechNumber(pragueComparison.pragueTotalRentMonthly - netCostAlone)} Kč</strong> levnější než nájem v Praze!)
                    </div>
                  ) : (
                    <div className="text-[10.5px] text-navy bg-white/75 p-1.5 rounded border border-navy/20 font-medium leading-tight">
                      Bydlíte v celém 2+1 sami. Pokud pokoj pronajmete kamarádovi (holý nájem {formatCzechNumber(roomRentAmount)} Kč + energie napůl), náklad klesne na <strong>{formatCzechNumber(netCostWithRoommate)} Kč/měs.</strong> a vyřešíte bytovou situaci hned 2 lidem :)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: VERIFIED LOCATION, 210 M WALKING MAP & IN 100 RAIL PASS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <MapPin className="w-4 h-4 text-price-tier1" />
                <span>Pěší trasa a dojíždění vlakem: 3 minuty na perón + jízdenka IN 100</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {CASE_STUDY_LOCATION.address} ({CASE_STUDY_LOCATION.svjName})
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono font-bold text-price-tier1 bg-emerald-50 px-2.5 py-1 rounded-md border border-price-tier1/20">
                210 m po rovině
              </span>
              <span className="text-xs font-mono font-bold text-navy bg-navy/5 px-2.5 py-1 rounded-md border border-navy/20">
                {formatCzechNumber(trainCommuteMonthly)} Kč / měs.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <CaseStudyWalkingMap />
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-paper border border-hairline space-y-1.5">
                <h3 className="font-bold text-sm text-navy flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Proč jsou 3 minuty chůze zásadní faktor?
                </h3>
                <p className="text-ink-muted">
                  Většina dojíždějících v Praze stráví 15 až 25 minut pouhou cestou na stanici metra
                  nebo čekáním na autobus. Zde vyjdete z bytu a za 180 sekund sedíte ve vlaku.
                </p>
              </div>

              <div className="space-y-2 text-ink-muted">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Nulové náklady na MHD v Lovosicích:</strong> Žádné auto, žádné parkovné
                    u nádraží, žádná místní lítačka.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Komfortní noční návrat:</strong> Poslední rychlík R20 z Prahy hl.n. odjíždí
                    ve <strong>23:10</strong> (v Lovosicích 00:10) a noční Os z Masarykova n. v{' '}
                    <strong>00:15</strong> (v Lovosicích 01:29).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Práce ve vlaku:</strong> Rychlíky R20 nabízejí 230V zásuvky a Wi-Fi. Cesta
                    (56 min Podbaba, 68 min hl.n.) je produktivní čas.
                  </span>
                </div>
              </div>

              {/* Integrated IN 100 Card */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-price-tier1/30 space-y-1.5">
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-price-tier1/20">
                  <span className="font-bold text-xs text-price-tier1 flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5" />
                    Celosíťová jízdenka IN 100 (ČD)
                  </span>
                  <span className="font-mono font-extrabold text-sm text-price-tier1">
                    {formatCzechNumber(trainCommuteMonthly)} Kč / měs.
                  </span>
                </div>
                <p className="text-[11px] text-ink/85 leading-relaxed">
                  Neomezené dojíždění do Prahy i všechny ostatní cesty vlaky ČD po celé ČR (včetně víkendů) za pevných{' '}
                  <strong className="font-mono">{formatCzechNumber(trainCommuteAnnual)} Kč/rok</strong>.
                </p>
                <p className="text-[10.5px] text-ink-muted leading-snug">
                  Od 3 jízd týdně vychází výhodněji než IN 50 (kde zpáteční cesta stojí 169 Kč + karta 3 200 Kč/rok).
                </p>
              </div>
            </div>
          </div>

          {/* Collapsible Car-Free Supplementary Detail inside Walking & Rail Section */}
          <div className="pt-2 border-t border-hairline">
            <div className="rounded-xl border border-hairline bg-paper/70 overflow-hidden">
              <button
                type="button"
                onClick={() => setCarFreeExpanded(!carFreeExpanded)}
                className="w-full p-3.5 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left hover:bg-paper transition-colors"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Car className="w-4 h-4 text-navy flex-shrink-0" />
                  <span className="font-bold text-xs md:text-sm text-ink">
                    Doplňková analýza: Život bez auta vs. vlak IN 100
                  </span>
                  <span className="text-[11px] font-mono font-bold text-price-tier1 bg-emerald-50 px-2 py-0.5 rounded border border-price-tier1/20">
                    Úspora +{formatCzechNumber(netCarSavingsYearly)} Kč/rok ({mortgageCoveragePct} % splátky hypotéky)
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-navy flex-shrink-0">
                  <span>{carFreeExpanded ? 'Skrýt detail bez auta' : 'Rozbalit detail bez auta'}</span>
                  {carFreeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {carFreeExpanded && (
                <div className="p-4 md:p-5 border-t border-hairline bg-white space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-4">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-ink flex items-center gap-2">
                        <Car className="w-4 h-4 text-navy" />
                        <span>Život bez auta: Úspora přes {formatCzechNumber(netCarSavingsYearly)} Kč ročně ({formatCzechNumber(netCarSavingsMonthly)} Kč / měs.)</span>
                      </h3>
                      <p className="text-xs text-ink-muted mt-0.5">
                        Vzdálenost 210 metrů od nádraží v Lovosicích eliminuje nutnost vlastnit osobní automobil
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
                      {/* Segmented Toggle for Car Profile */}
                      <div className="inline-flex p-1 bg-paper rounded-lg border border-hairline text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setCarPreset('older')}
                          className={`px-2.5 py-1 rounded transition-all ${
                            carPreset === 'older'
                              ? 'bg-navy text-white shadow-2xs'
                              : 'text-ink-muted hover:text-ink'
                          }`}
                        >
                          Starší ojetina (150 tis. Kč)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCarPreset('newer')}
                          className={`px-2.5 py-1 rounded transition-all ${
                            carPreset === 'newer'
                              ? 'bg-navy text-white shadow-2xs'
                              : 'text-ink-muted hover:text-ink'
                          }`}
                        >
                          Zánovní ojetina (320 tis. Kč)
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base md:text-lg font-mono font-extrabold text-price-tier1 tabular-nums block">
                          +{formatCzechNumber(netCarSavingsYearly)} Kč / rok
                        </span>
                        <span className="text-[10px] text-ink-muted block">čistá roční úspora v peněžence</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-xs">
                    {/* Car Cost Breakdown */}
                    <div className="lg:col-span-7 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-ink uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 text-navy" />
                          Roční provoz ({carPreset === 'older' ? 'starší ojetina' : 'zánovní ojetina'}, 12 000 km/rok):
                        </h4>
                        <span className="text-[10px] font-mono text-ink-muted">
                          ~{carSavings.costPerKm.toFixed(1).replace('.', ',')} Kč / km
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono tabular-nums">
                        <div className="p-2.5 bg-paper/40 rounded-lg border border-hairline">
                          <span className="text-[10px] font-sans text-ink-muted block">Ztráta hodnoty:</span>
                          <span className="font-bold text-ink">{formatCzechNumber(carSavings.carDepreciationAnnual)} Kč/rok</span>
                        </div>
                        <div className="p-2.5 bg-paper/40 rounded-lg border border-hairline">
                          <span className="text-[10px] font-sans text-ink-muted block">{carSavings.insuranceLabel}:</span>
                          <span className="font-bold text-ink">{formatCzechNumber(carSavings.carInsuranceAnnual)} Kč/rok</span>
                        </div>
                        <div className="p-2.5 bg-paper/40 rounded-lg border border-hairline">
                          <span className="text-[10px] font-sans text-ink-muted block">Servis, STK, pneu:</span>
                          <span className="font-bold text-ink">{formatCzechNumber(carSavings.carMaintenanceAnnual)} Kč/rok</span>
                        </div>
                        <div className="p-2.5 bg-paper/40 rounded-lg border border-hairline">
                          <span className="text-[10px] font-sans text-ink-muted block">Pohonné hmoty (12 tis. km):</span>
                          <span className="font-bold text-ink">{formatCzechNumber(carSavings.carFuelAnnual)} Kč/rok</span>
                        </div>
                        <div className="p-2.5 bg-paper/40 rounded-lg border border-hairline">
                          <span className="text-[10px] font-sans text-ink-muted block">Dálnice & parkování:</span>
                          <span className="font-bold text-ink">{formatCzechNumber(carSavings.carFeesAndParkingAnnual)} Kč/rok</span>
                        </div>
                        <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-800">
                          <span className="text-[10px] font-sans text-rose-800 block font-bold">Celkem auto:</span>
                          <span className="font-extrabold text-sm">{formatCzechNumber(carSavings.totalCarCostAnnual)} Kč/rok</span>
                        </div>
                      </div>

                      {/* Crisp 1-line equation linking car costs to IN 100 rail commute */}
                      <div className="p-2.5 bg-paper rounded-lg border border-hairline font-mono text-[11px] text-ink flex items-center justify-between flex-wrap gap-2">
                        <span>
                          <strong className="text-rose-700">{formatCzechNumber(carSavings.totalCarCostAnnual)} Kč</strong> (provoz auta) − <strong className="text-navy">{formatCzechNumber(trainCommuteAnnual)} Kč</strong> (vlak IN 100) =
                        </span>
                        <span className="font-bold text-price-tier1 text-xs">
                          {formatCzechNumber(netCarSavingsYearly)} Kč / rok čistá úspora ({formatCzechNumber(netCarSavingsMonthly)} Kč / měs.)
                        </span>
                      </div>

                      {/* Mileage honesty note */}
                      <p className="text-[10.5px] text-ink-muted leading-relaxed">
                        * Konzervativní výpočet pro běžný nájezd 12 000 km/rok. Při pravidelném dojíždění Lovosice–Praha autem (18–30 tis. km/rok) jsou reálné náklady ještě výrazně vyšší.
                      </p>
                    </div>

                    {/* Car-free verdict */}
                    <div className="lg:col-span-5 p-4 rounded-xl bg-paper/40 border border-hairline space-y-2.5">
                      <h4 className="font-bold text-sm text-navy flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-price-tier1" />
                        Jak to funguje v Lovosicích v praxi?
                      </h4>
                      <p className="text-ink-muted leading-relaxed">
                        Nádraží je za rohem, nákupy i lékaři jsou do 500 metrů. V Praze jste vlakem přímo v centru (žádné modré parkovací zóny ani kolony na D8).
                      </p>
                      <div className="pt-2 border-t border-hairline flex items-center justify-between text-[11px] text-price-tier1 font-semibold">
                        <span>Úspora bez auta zaplatí:</span>
                        <span className="font-bold font-mono text-xs">
                          {mortgageCoveragePct} % splátky hypotéky!
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Block: Pořizovací cena auta = základ na hypotéku */}
                  <div className="p-4 rounded-xl bg-paper/40 border border-hairline space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-navy/10 text-navy">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-ink">
                            Pořizovací cena auta = základ na hypotéku
                          </h4>
                          <span className="text-[11px] text-ink-muted">
                            Vstupní kapitál na vlastní zdroje ({downPaymentPercent} % LTV = {formatCzechNumber(mortgage.downPaymentCzk)} Kč)
                          </span>
                        </div>
                      </div>

                      <div>
                        {carPurchasePrice < mortgage.downPaymentCzk ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-price-tier1 bg-emerald-50 px-2.5 py-1 rounded-md border border-price-tier1/20">
                            Pokryje {downPaymentCoveragePct} % vlastních zdrojů
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-white bg-price-tier1 px-2.5 py-1 rounded-md shadow-2xs">
                            ✓ Pokryje 100 % vlastních zdrojů
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Horizontal Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono tabular-nums">
                        <span className="text-ink font-semibold flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-navy" />
                          Kupní cena auta: <strong>{formatCzechNumber(carPurchasePrice)} Kč</strong>
                        </span>
                        <span className="text-ink font-semibold flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5 text-price-tier1" />
                          Potřebný základ LTV ({downPaymentPercent} %): <strong>{formatCzechNumber(mortgage.downPaymentCzk)} Kč</strong>
                        </span>
                      </div>

                      <div className="w-full bg-white rounded-full h-3.5 border border-hairline overflow-hidden p-0.5">
                        <div
                          className="bg-price-tier1 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1.5"
                          style={{ width: `${downPaymentCoveragePct}%` }}
                        >
                          {downPaymentCoveragePct >= 20 && (
                            <span className="text-[9px] font-mono font-bold text-white leading-none">
                              {downPaymentCoveragePct} %
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                        <span>0 Kč</span>
                        <span>{downPaymentCoveragePct} % splněno</span>
                        <span>{formatCzechNumber(mortgage.downPaymentCzk)} Kč (cíl)</span>
                      </div>
                    </div>

                    {/* Narrative Explanation */}
                    <div className="text-xs leading-relaxed text-ink/85">
                      {carPurchasePrice < mortgage.downPaymentCzk ? (
                        <p>
                          Místo koupě ojetiny za <strong className="text-ink font-mono">{formatCzechNumber(carPurchasePrice)} Kč</strong> vložíte peníze do základu hypotéky — máte hned {downPaymentCoveragePct >= 40 && downPaymentCoveragePct <= 55 ? 'téměř polovinu' : `${downPaymentCoveragePct} %`} potřebných {downPaymentPercent} % ({formatCzechNumber(mortgage.downPaymentCzk)} Kč). Zbývajících <strong className="text-ink font-mono">{formatCzechNumber(remainingDownPayment)} Kč</strong> našetříte díky úspoře na provozu auta za cca <strong className="text-price-tier1 font-mono">{yearsToSaveRest} roku</strong> (a v páru bez dvou aut máte téměř celý základ hned).
                        </p>
                      ) : (
                        <p>
                          Cena jedné slušné 5leté ojetiny (<strong className="text-ink font-mono">{formatCzechNumber(carPurchasePrice)} Kč</strong>) pokryje kompletní {downPaymentPercent}% základ hypotéky na tento byt ({formatCzechNumber(mortgage.downPaymentCzk)} Kč). Bariéra vstupního kapitálu u mladých často není o tom, že peníze nemají — ale že stojí zaparkované před domem.
                        </p>
                      )}
                    </div>

                    {/* Bonus Note: Auto na úvěr / operák */}
                    <div className="flex items-start sm:items-center gap-2 text-[11px] text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span>
                        <strong>Pozor na auto na úvěr/operák:</strong> splátka 5 000 Kč/měs. snižuje maximální dostupnou hypotéku v bance (kvůli bonitě) zhruba o 930 000 Kč.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: FULL MONTHLY CASHFLOW BREAKDOWN */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Sliders className="w-4 h-4 text-navy" />
                <span>Podrobný rozpad měsíčního cashflow (Výdaje vs. Příjmy)</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Všechny reálné položky nákladů na vlastnictví bytu 2+1 v Lovosicích a dojíždění
              </p>
            </div>
          </div>

          {/* Financing Setup Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-paper rounded-xl border border-hairline text-xs">
            {/* Purchase price */}
            <div className="space-y-1">
              <label className="font-bold text-ink block">Kupní cena nemovitosti:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={priceInputStr}
                  onChange={handlePriceChange}
                  className="w-full bg-white border border-hairline rounded-lg px-3 py-1.5 font-mono font-bold text-ink focus:outline-none focus:border-navy"
                />
                <span className="text-ink-muted font-medium">Kč</span>
              </div>
            </div>

            {/* Down payment LTV toggle */}
            <div className="space-y-1">
              <label className="font-bold text-ink block">Vlastní zdroje (LTV):</label>
              <div className="grid grid-cols-2 gap-1 bg-white p-0.5 rounded-lg border border-hairline">
                <button
                  onClick={() => setDownPaymentPercent(10)}
                  className={`py-1.5 px-2 font-semibold rounded text-[11px] transition-all ${
                    downPaymentPercent === 10
                      ? 'bg-navy text-white shadow-2xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  10 % (LTV 90 % do 36 let)
                </button>
                <button
                  onClick={() => setDownPaymentPercent(20)}
                  className={`py-1.5 px-2 font-semibold rounded text-[11px] transition-all ${
                    downPaymentPercent === 20
                      ? 'bg-navy text-white shadow-2xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  20 % (LTV 80 % standard)
                </button>
              </div>
              <span className="text-[10px] text-ink-muted block mt-0.5">
                Vlastní hotovost: <strong>{formatCzechNumber(mortgage.downPaymentCzk)} Kč</strong> + katastr 2 000 Kč
              </span>
            </div>

            {/* Interest rate slider (default 4.99%) */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-bold text-ink">Úroková sazba hypotéky:</label>
                <span className="font-mono font-bold text-navy">{interestRate.toFixed(2)} % p.a.</span>
              </div>
              <input
                type="range"
                min={3.5}
                max={6.5}
                step={0.01}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-navy"
              />
              <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                <span>3.5 %</span>
                <span>4.99 % (aktuální průměr)</span>
                <span>6.5 %</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: EXPENSES vs INCOMES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Column A: EXPENSES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <h3 className="font-bold text-xs uppercase tracking-wider text-price-tier4 flex items-center gap-1.5">
                  <span>Měsíční výdaje (bydlení + vlak)</span>
                </h3>
                <span className="font-mono font-bold text-sm text-price-tier4 tabular-nums">
                  {formatCzechNumber(monthlyExpenses.totalGrossExpenses)} Kč / měs.
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Mortgage payment */}
                <div className="p-3 bg-paper rounded-lg border border-hairline space-y-1">
                  <div className="flex justify-between font-bold text-ink">
                    <span>1. Splátka hypotéky (anuitní při {interestRate.toFixed(2)} %):</span>
                    <span className="font-mono text-sm">
                      {formatCzechNumber(mortgage.monthlyPayment)} Kč / měs.
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-muted flex justify-between font-mono">
                    <span>Z toho úrok v 1. roce (průměr):</span>
                    <span>{formatCzechNumber(Math.round(mortgage.interestPaidYear1 / 12))} Kč</span>
                  </div>
                  <div className="text-[10px] text-price-tier1 flex justify-between font-mono font-semibold">
                    <span>Z toho splátka jistiny (tvorba majetku):</span>
                    <span>+{formatCzechNumber(mortgage.averageMonthlyPrincipalYear1)} Kč / měs.</span>
                  </div>
                </div>

                {/* HOA & Utilities List */}
                <div className="p-3 bg-white rounded-lg border border-hairline space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-hairline">
                    <span className="text-[10px] uppercase font-bold text-ink-muted">
                      Provozní poplatky & energie
                    </span>
                    <button
                      onClick={() => setExpensesCollapsed(!expensesCollapsed)}
                      className="text-[11px] font-semibold text-navy hover:underline flex items-center gap-1"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span>{expensesCollapsed ? 'Zobrazit editaci částek' : 'Upravit částky'}</span>
                    </button>
                  </div>

                  {expensesCollapsed ? (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-ink">2. Fond oprav SVJ (majitel):</span>
                        <input
                          type="number"
                          step={50}
                          value={hoaRepairFund}
                          onChange={(e) => setHoaRepairFund(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">3. Dálkové teplo (50/50):</span>
                        <input
                          type="number"
                          step={100}
                          value={heatingAndHotWater}
                          onChange={(e) => setHeatingAndHotWater(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">4. Vodné a stočné (50/50):</span>
                        <input
                          type="number"
                          step={50}
                          value={waterAndSewer}
                          onChange={(e) => setWaterAndSewer(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">5. Elektřina byt (50/50):</span>
                        <input
                          type="number"
                          step={50}
                          value={electricity}
                          onChange={(e) => setElectricity(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">6. Služby SVJ (úklid, správa – 50/50):</span>
                        <input
                          type="number"
                          step={50}
                          value={hoaServicesAndAdmin}
                          onChange={(e) => setHoaServicesAndAdmin(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">7. Pojištění (50/50):</span>
                        <input
                          type="number"
                          step={50}
                          value={insurance}
                          onChange={(e) => setInsurance(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">8. Internet & koncese (50/50):</span>
                        <input
                          type="number"
                          step={50}
                          value={internetAndFees}
                          onChange={(e) => setInternetAndFees(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink">9. Daň z nemovitostí (majitel):</span>
                        <input
                          type="number"
                          step={10}
                          value={propertyTaxMonthly}
                          onChange={(e) => setPropertyTaxMonthly(Number(e.target.value))}
                          className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">2. Fond oprav SVJ (100 % hradí majitel):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(hoaRepairFund)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">3. Dálkové teplo a ohřev TUV (dělí se 50/50):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(heatingAndHotWater)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">4. Vodné a stočné (dělí se 50/50):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(waterAndSewer)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">5. Elektřina byt (dělí se 50/50):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(electricity)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">6. Služby SVJ & správa (úklid, osvětlení – 50/50):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(hoaServicesAndAdmin)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">7. Pojištění nemovitosti & domácnosti (dělí se 50/50):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(insurance)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">8. Internet + TV/rozhlas poplatky (dělí se 50/50):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(internetAndFees)} Kč</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">9. Daň z nemovitých věcí (100 % hradí majitel):</span>
                        <span className="font-mono font-medium">{formatCzechNumber(propertyTaxMonthly)} Kč</span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-hairline">
                    <label className="flex items-center gap-1.5 cursor-pointer text-ink font-semibold">
                      <input
                        type="checkbox"
                        checked={includeMaintenanceReserve}
                        onChange={(e) => setIncludeMaintenanceReserve(e.target.checked)}
                        className="accent-navy"
                      />
                      <span>10. Rezerva na údržbu bytu (100 % hradí majitel):</span>
                    </label>
                    <span className="font-mono font-medium">{formatCzechNumber(maintenanceReserveAmount)} Kč</span>
                  </div>
                </div>

                {/* Train commute item */}
                <div className="p-3 bg-navy/5 rounded-lg border border-navy/20 flex items-center justify-between font-bold text-navy">
                  <span>11. Dojíždění vlakem do Prahy (celosíťová IN 100):</span>
                  <span className="font-mono text-sm">
                    {formatCzechNumber(trainCommuteMonthly)} Kč / měs.
                  </span>
                </div>

                {/* Equity Building Card (moved to Left Column below expenses to balance layout) */}
                <div className="p-4 bg-emerald-50/90 rounded-xl border border-price-tier1/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-price-tier1 flex items-center gap-1.5">
                      <Gem className="w-4 h-4 text-price-tier1" />
                      Budování majetku (Jistina + Růst cen nemovitostí)
                    </span>
                    <span className="font-mono font-extrabold text-sm text-price-tier1">
                      +{formatCzechNumber(equity.totalMonthlyEquityCreated)} Kč / měs.
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Splácení jistiny úvěru (1. rok průměr):</span>
                      <span className="font-mono font-bold text-ink">
                        +{formatCzechNumber(equity.monthlyPrincipalRepaid)} Kč / měs.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-ink-muted">
                          Očekávaný roční růst cen nemovitostí ({appreciationPercent.toFixed(1)} % p.a.):
                        </span>
                        <span className="font-mono font-bold text-price-tier1">
                          +{formatCzechNumber(equity.monthlyAppreciationCzk)} Kč / měs.
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={6}
                        step={0.5}
                        value={appreciationPercent}
                        onChange={(e) => setAppreciationPercent(Number(e.target.value))}
                        className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-emerald-700"
                      />
                      <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                        <span>0 % (stagnace)</span>
                        <span>3.0 % (dlouhodobý průměr)</span>
                        <span>6.0 %</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-price-tier1/20 text-ink/80 leading-relaxed text-[11px]">
                      Při{' '}
                      {appreciationPercent % 1 === 0
                        ? `${appreciationPercent}%`
                        : `${appreciationPercent.toFixed(1).replace('.', ',')}%`}{' '}
                      ročním zhodnocení byt naroste o <strong>{formatCzechNumber(equity.annualAppreciationCzk)} Kč ročně</strong>.
                      Spolu se splátkou jistiny se vám každý měsíc zhodnotí majetek o <strong>{formatCzechNumber(equity.totalMonthlyEquityCreated)} Kč</strong>!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column B: INCOMES & TAX OFFSETS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <h3 className="font-bold text-xs uppercase tracking-wider text-price-tier1 flex items-center gap-1.5">
                  <span>Příjmy a daňové úlevy</span>
                </h3>
                <span className="font-mono font-bold text-sm text-price-tier1 tabular-nums">
                  -{formatCzechNumber(monthlyIncomes.totalIncomeAndOffsets)} Kč / měs.
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Mortgage tax refund (§ 15 ZDP) */}
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-price-tier1/20 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-price-tier1 text-sm">
                      1. Daňová vratka z úroků hypotéky (§ 15 ZDP):
                    </span>
                    <span className="font-mono font-bold text-price-tier1 text-sm">
                      +{formatCzechNumber(taxRefund.monthlyRefund)} Kč / měs.
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/80 leading-relaxed">
                    Zaplacené úroky v 1. roce ({formatCzechNumber(mortgage.interestPaidYear1)} Kč) si odečtete
                    ze základu daně z příjmů (strop 150 000 Kč). Stát vám vrátí{' '}
                    <strong>{formatCzechNumber(taxRefund.annualRefund)} Kč ročně</strong>.
                  </p>
                  {rentOutRoom && deductRoomRentTax ? (
                    <div className="text-[10px] font-semibold text-price-tier1 bg-white/70 px-2 py-1 rounded border border-price-tier1/20 mt-1">
                      ℹ️ Kráceno na 70 % (poměr vlastní bytové potřeby při oficiálním pronájmu 1 pokoje dle § 15 ZDP).
                    </div>
                  ) : (
                    <div className="text-[10px] font-semibold text-emerald-800 bg-white/70 px-2 py-1 rounded border border-emerald-300 mt-1">
                      ℹ️ Plný 100% odpočet úroků (celý byt slouží výhradně pro vlastní bytovou potřebu bez pronájmu dle § 15 ZDP).
                    </div>
                  )}
                </div>

                {/* 2. Room rental */}
                <div className="p-4 bg-white rounded-xl border border-hairline space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-ink flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-navy" />
                        <span>2. Pronájem 1 neprůchozího pokoje (spolubydlení)</span>
                      </h4>
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        Dispozice 2+1 má dva samostatné pokoje a oddělenou kuchyň — ideální pro spolubydlícího.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer ml-2">
                      <input
                        type="checkbox"
                        checked={rentOutRoom}
                        onChange={(e) => setRentOutRoom(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-hairline peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-hairline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-price-tier1"></div>
                    </label>
                  </div>

                  {rentOutRoom ? (
                    <div className="space-y-3 pt-2 border-t border-hairline">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-ink">Čistý holý nájem za pokoj (bez energií):</span>
                          <span className="font-mono font-bold text-price-tier1 text-sm">
                            {formatCzechNumber(roomRentAmount)} Kč / měs.
                          </span>
                        </div>
                        <input
                          type="range"
                          min={4000}
                          max={9000}
                          step={250}
                          value={roomRentAmount}
                          onChange={(e) => setRoomRentAmount(Number(e.target.value))}
                          className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-emerald-700"
                        />
                        <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                          <span>4 000 Kč</span>
                          <span>6 000 Kč (standard Lovosice)</span>
                          <span>9 000 Kč</span>
                        </div>
                      </div>

                      {/* Itemized Roommate Split Breakdown */}
                      <div className="p-3 bg-paper/70 rounded-lg border border-hairline space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-ink">
                          <span className="font-sans text-ink-muted">1. Holý nájem za pokoj (zdanitelný):</span>
                          <span className="font-bold">{formatCzechNumber(roomRentAmount)} Kč / měs.</span>
                        </div>
                        <div className="flex justify-between text-ink">
                          <span className="font-sans text-ink-muted">2. Podíl na energiích & službách (50 %):</span>
                          <span className="font-bold text-navy">+{formatCzechNumber(roommateUtilitiesShare)} Kč / měs.</span>
                        </div>
                        <div className="text-[10px] font-sans text-ink-muted leading-relaxed pl-2 border-l-2 border-navy/40">
                          Polovina tepla, vody, elektřiny, úklidu domu, osvětlení chodeb, správy SVJ, pojištění a internetu (50 % z celkových {formatCzechNumber(sharedOperatingExpenses)} Kč).
                          Fond oprav ({formatCzechNumber(hoaRepairFund)} Kč), daň z nemovitosti a rezerva jdou 100 % za majitelem.
                        </div>
                        <div className="pt-1.5 border-t border-hairline flex justify-between font-bold text-ink text-xs">
                          <span className="font-sans">Celková platba spolubydlícího (vše včetně energií):</span>
                          <span className="text-navy">{formatCzechNumber(roommateTotalPayment)} Kč / měs.</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-ink font-semibold">
                            <input
                              type="checkbox"
                              checked={deductRoomRentTax}
                              onChange={(e) => setDeductRoomRentTax(e.target.checked)}
                              className="accent-navy"
                            />
                            <span>Zohlednit 15% daň z příjmu (§ 9 ZDP, 30% paušál)</span>
                          </label>
                          {deductRoomRentTax && (
                            <span className="font-mono text-[11px] text-rose-700 font-bold">
                              -{formatCzechNumber(roomRentTaxMonthly)} Kč daň
                            </span>
                          )}
                        </div>
                        {deductRoomRentTax && (
                          <span className="text-[10px] text-ink-muted block font-mono pl-5">
                            (zdaňuje se výhradně holý nájem {formatCzechNumber(roomPureRent)} Kč: 70 % základ = {formatCzechNumber(Math.round(roomPureRent * 0.70))} Kč, daň 15 % = {formatCzechNumber(roomRentTaxMonthly)} Kč; podíl na energiích {formatCzechNumber(roommateUtilitiesShare)} Kč se nedaní)
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 text-xs font-semibold text-price-tier1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Čistý měsíční přínos z pokoje do rozpočtu majitele:</span>
                          <span className="font-mono font-bold text-sm">
                            +{formatCzechNumber(roomRentNet)} Kč / měs.
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-800/80 font-normal flex justify-between font-mono">
                          <span>(čistý holý nájem po dani {formatCzechNumber(roomPureRentNet)} Kč + úhrada energií {formatCzechNumber(roommateUtilitiesShare)} Kč)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-paper rounded-lg border border-hairline text-xs space-y-1.5 pt-2">
                      <div className="font-semibold text-ink flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-navy" />
                        <span>Pronájem pokoje kamarádovi je vypnutý (bydlíte sami)</span>
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed">
                        Veškeré náklady na byt hradíte sami (čistý náklad <strong>{formatCzechNumber(netCostAlone)} Kč/měs.</strong>).
                        Zapnutím spolubydlení (holý nájem {formatCzechNumber(roomRentAmount)} Kč + energie napůl) snížíte své výdaje na pouhých{' '}
                        <strong className="text-price-tier1">{formatCzechNumber(netCostWithRoommate)} Kč/měs.</strong> a také vyřešíte bytovou situaci hned 2 lidem :)
                      </p>
                      <button
                        onClick={() => setRentOutRoom(true)}
                        className="text-[11px] font-bold text-navy hover:underline pt-0.5 block"
                      >
                        + Zapnout pronájem pokoje kamarádovi (+{formatCzechNumber(roomRentAmount)} Kč holý nájem + energie napůl)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SUMMARY HERO BAR */}
          {/* ========================================================================= */}
          <div className="p-5 bg-navy text-white rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-white/70 block">
                  Výsledek rodinného rozpočtu
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                  Čistý měsíční náklad z vlastní kapsy
                </h3>
              </div>

              <div className="text-right">
                <div className="text-3xl md:text-4xl font-mono font-extrabold text-white tabular-nums tracking-tight">
                  {formatCzechNumber(netMonthlyCost)}&nbsp;Kč&nbsp;
                  <span className="text-sm font-sans font-normal text-white/80">/ měsíc</span>
                </div>
                <span className="text-xs text-white/75 font-medium">
                  {rentOutRoom
                    ? "včetně spolubydlícího (řeší dostupné bydlení 2 lidem), všech energií, fondu oprav i vlaku do Prahy"
                    : "při bydlení o samotě (1 člověk v bytě), včetně všech energií, fondu oprav i vlaku do Prahy"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/90">
              <div className="p-2.5 rounded-lg bg-white/10">
                <span className="text-[11px] text-white/70 block">Celkové hrubé výdaje:</span>
                <span className="font-mono font-bold text-sm">
                  {formatCzechNumber(monthlyExpenses.totalGrossExpenses)} Kč/měs.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white/10">
                <span className="text-[11px] text-white/70 block">
                  {rentOutRoom ? "Příjmy (pokoj + daňová vratka):" : "Daňová vratka (§ 15 ZDP):"}
                </span>
                <span className="font-mono font-bold text-sm text-emerald-300">
                  -{formatCzechNumber(monthlyIncomes.totalIncomeAndOffsets)} Kč/měs.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                <span className="text-[11px] text-emerald-200 font-bold block flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  Celková tvorba vlastního majetku:
                </span>
                <span className="font-mono font-bold text-sm text-emerald-100">
                  +{formatCzechNumber(equity.totalMonthlyEquityCreated)} Kč/měs.
                </span>
                <span className="text-[10px] text-emerald-200 block mt-0.5">
                  jistina ({formatCzechNumber(equity.monthlyPrincipalRepaid)} Kč) + růst ({formatCzechNumber(equity.monthlyAppreciationCzk)} Kč)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: 3-YEAR REFINANCING & WAGE GROWTH HORIZON (2026 vs 2029) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span>Výhled za 3 roky (2029): Refinancování hypotéky + růst mezd</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Proč je hypotéka nejtěžší první 3 roky a jak se zátěž rozpočtu v čase radikálně snižuje
              </p>
            </div>
          </div>

          {/* Controls Bar for Projection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-paper rounded-xl border border-hairline text-xs">
            {/* Wage benchmark switcher */}
            <div className="space-y-1">
              <label className="font-bold text-ink block">Výchozí čistá mzda (2026):</label>
              <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded-lg border border-hairline text-[11px]">
                <button
                  onClick={() => setWagePreset('prague')}
                  className={`py-1 rounded font-semibold transition-all ${
                    wagePreset === 'prague' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Praha průměr
                </button>
                <button
                  onClick={() => setWagePreset('cr')}
                  className={`py-1 rounded font-semibold transition-all ${
                    wagePreset === 'cr' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  ČR průměr
                </button>
                <button
                  onClick={() => setWagePreset('custom')}
                  className={`py-1 rounded font-semibold transition-all ${
                    wagePreset === 'custom' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Vlastní
                </button>
              </div>

              {wagePreset === 'custom' ? (
                <input
                  type="number"
                  step={1000}
                  value={customNetWage}
                  onChange={(e) => setCustomNetWage(Number(e.target.value))}
                  className="w-full mt-1 bg-white border border-hairline rounded px-2 py-1 font-mono font-bold text-ink"
                />
              ) : (
                <div className="text-[11px] text-ink-muted font-mono pt-0.5">
                  {formatCzechNumber(activeNetWage)} Kč čistého / měs.
                </div>
              )}
            </div>

            {/* Annual Wage Growth Slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-bold text-ink">Roční růst mezd:</label>
                <span className="font-mono font-bold text-navy">+{wageGrowthRate.toFixed(1)} % p.a.</span>
              </div>
              <input
                type="range"
                min={3.0}
                max={8.0}
                step={0.5}
                value={wageGrowthRate}
                onChange={(e) => setWageGrowthRate(Number(e.target.value))}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-navy"
              />
              <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                <span>3.0 %</span>
                <span>5.5 % (ČBA / MF ČR)</span>
                <span>8.0 %</span>
              </div>
            </div>

            {/* Refinancing Rate at 3 years */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-bold text-ink">Sazba při refinancování (za 3 roky):</label>
                <span className="font-mono font-bold text-navy">{refinancingRate.toFixed(2)} % p.a.</span>
              </div>
              <input
                type="range"
                min={3.0}
                max={6.5}
                step={0.05}
                value={refinancingRate}
                onChange={(e) => setRefinancingRate(Number(e.target.value))}
                className="w-full h-1.5 bg-hairline rounded-lg appearance-none cursor-pointer accent-navy"
              />
              <div className="flex justify-between text-[10px] text-ink-muted font-mono">
                <span>3.0 %</span>
                <button
                  onClick={() => setRefinancingRate(interestRate)}
                  className="text-navy underline hover:text-navy-dark"
                >
                  Stejná jako dnes ({interestRate.toFixed(2)} %)
                </button>
                <span>6.5 %</span>
              </div>
            </div>
          </div>

          {/* Refinancing Mechanism Explanation Card */}
          <div className="p-4 rounded-xl bg-paper/70 border border-hairline text-xs space-y-2">
            <h4 className="font-bold text-navy flex items-center gap-1.5">
              <Percent className="w-4 h-4" />
              Matematika refinancování zpět na 30 let:
            </h4>
            <p className="text-ink-muted leading-relaxed">
              Za první 3 roky splatíte{' '}
              <strong className="text-ink">
                {formatCzechNumber(mortgage.principalPaid36Months)} Kč jistiny
              </strong>
              . Dluh bance klesne z {formatCzechNumber(mortgage.loanAmount)} Kč na{' '}
              <strong className="text-ink">{formatCzechNumber(mortgage.remainingBalance36Months)} Kč</strong>.
              Při konci 3leté fixace se tento snížený zůstatek refinancuje znovu na 30 let (360 měsíců).
              Tím měsíční splátka hypotéky {mortgage.monthlyMortgagePaymentDrop >= 0 ? 'klesne' : 'vzroste'} o{' '}
              <strong className="text-price-tier1">
                {formatCzechNumber(Math.abs(mortgage.monthlyMortgagePaymentDrop))} Kč měsíčně
              </strong>{' '}
              (z {formatCzechNumber(mortgage.monthlyPayment)} Kč na{' '}
              {formatCzechNumber(mortgage.refinancedMonthlyPayment)} Kč).
            </p>
          </div>

          {/* Side-by-Side Comparison Table: NOW (2026) vs IN 3 YEARS (2029) */}
          <div className="border border-hairline rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-paper text-ink-muted border-b border-hairline font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 text-left">Metrika</th>
                  <th className="py-3 px-4 text-right">Dnes (rok 2026)</th>
                  <th className="py-3 px-4 text-right bg-emerald-50/50 text-price-tier1">
                    Za 3 roky (rok 2029)
                  </th>
                  <th className="py-3 px-4 text-right">Změna</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono tabular-nums">
                <tr>
                  <td className="py-2.5 px-4 font-sans font-semibold text-ink">Zůstatek hypotéky:</td>
                  <td className="py-2.5 px-4 text-right">{formatCzechNumber(mortgage.loanAmount)} Kč</td>
                  <td className="py-2.5 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                    {formatCzechNumber(mortgage.remainingBalance36Months)} Kč
                  </td>
                  <td className="py-2.5 px-4 text-right text-price-tier1">
                    -{formatCzechNumber(mortgage.principalPaid36Months)} Kč
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-semibold text-ink">Splátka hypotéky:</td>
                  <td className="py-2.5 px-4 text-right">{formatCzechNumber(mortgage.monthlyPayment)} Kč</td>
                  <td className="py-2.5 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                    {formatCzechNumber(mortgage.refinancedMonthlyPayment)} Kč
                  </td>
                  <td className="py-2.5 px-4 text-right text-price-tier1">
                    {mortgage.monthlyMortgagePaymentDrop >= 0
                      ? `-${formatCzechNumber(mortgage.monthlyMortgagePaymentDrop)} Kč/měs.`
                      : `+${formatCzechNumber(Math.abs(mortgage.monthlyMortgagePaymentDrop))} Kč/měs.`}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-semibold text-ink">Čistá mzda:</td>
                  <td className="py-2.5 px-4 text-right">{formatCzechNumber(projection.wage2026Net)} Kč</td>
                  <td className="py-2.5 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                    {formatCzechNumber(projection.wage2029Net)} Kč
                  </td>
                  <td className="py-2.5 px-4 text-right text-price-tier1">
                    +{projection.wageGrowthTotalPercent.toFixed(1)} %
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-semibold text-ink">
                    <span>Čistý náklad (bydlení+vlak):</span>
                    <span className="block text-[10px] font-normal text-ink-muted">
                      {rentOutRoom ? 'Včetně spolubydlení (2 lidé v bytě)' : 'Bydlení o samotě (1 člověk)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">{formatCzechNumber(projection.netCost2026)} Kč</td>
                  <td className="py-2.5 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                    {formatCzechNumber(projection.netCost2029)} Kč
                  </td>
                  <td className="py-2.5 px-4 text-right text-price-tier1">
                    {projection.netCost2026 - projection.netCost2029 >= 0
                      ? `-${formatCzechNumber(projection.netCost2026 - projection.netCost2029)} Kč`
                      : `+${formatCzechNumber(Math.abs(projection.netCost2026 - projection.netCost2029))} Kč`}
                  </td>
                </tr>

                {/* HERO ROW: SHARE OF NET SALARY */}
                <tr className="bg-navy/5 text-sm font-bold">
                  <td className="py-3 px-4 font-sans text-navy">
                    Podíl čistého nákladu z čisté mzdy:
                  </td>
                  <td className="py-3 px-4 text-right text-ink">
                    {projection.wageShare2026Percent.toFixed(1)} % mzdy
                  </td>
                  <td className="py-3 px-4 text-right bg-emerald-100/70 text-price-tier1 font-extrabold text-base">
                    {projection.wageShare2029Percent.toFixed(1)} % mzdy
                  </td>
                  <td className="py-3 px-4 text-right text-price-tier1 font-extrabold">
                    {projection.wageShareDiffPoints <= 0
                      ? `${projection.wageShareDiffPoints.toFixed(1)} p.b. (${projection.wageShareRelativeDropPercent.toFixed(1)} % pokles zátěže)`
                      : `+${projection.wageShareDiffPoints.toFixed(1)} p.b.`}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-semibold text-ink">Zbývá na život po zaplacení:</td>
                  <td className="py-2.5 px-4 text-right">{formatCzechNumber(projection.disposableIncome2026)} Kč</td>
                  <td className="py-2.5 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                    {formatCzechNumber(projection.disposableIncome2029)} Kč
                  </td>
                  <td className="py-2.5 px-4 text-right text-price-tier1">
                    +{formatCzechNumber(projection.disposableIncome2029 - projection.disposableIncome2026)} Kč/měs.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtle methodology strip directly beneath the 2029 comparison table */}
          <div className="p-3 bg-paper/60 border border-hairline rounded-lg text-[11px] font-mono text-ink-muted leading-relaxed">
            * Výpočet 2029 zahrnuje 2,5 % roční inflaci provozních nákladů{rentOutRoom ? ', vlaku i nájmu pokoje' : ' a vlaku'} ({formatCzechNumber(projection.operatingExpenses2029)} Kč/měs. provoz + vlak) a přepočtenou {rentOutRoom ? '70% daňovou vratku' : 'plnou 100% daňovou vratku'} z nižších úroků po refinancování ({formatCzechNumber(year4TaxRefund.monthlyRefund)} Kč/měs.).
          </div>

          {/* Bottom Conclusion Callout */}
          <div className="p-4 rounded-xl bg-paper border border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-navy">
                Závěr případové studie
              </span>
              <p className="text-xs text-ink-muted max-w-2xl leading-relaxed">
                Zatímco nájem v Praze v čase neustále stoupá s inflací a po 30 letech vám nezůstane nic,
                vlastní byt v Lovosicích u nádraží fixuje hlavní náklad, vytváří majetek a díky
                refinancování a růstu mezd klesne jeho zátěž na rozpočet ze{' '}
                <strong>{projection.wageShare2026Percent.toFixed(1)} %</strong> na pouhých{' '}
                <strong>{projection.wageShare2029Percent.toFixed(1)} %</strong> vaší mzdy
                {rentOutRoom ? ' (při spolubydlení se 2 lidmi v bytě).' : ' (při bydlení o samotě).'}
              </p>
            </div>

            <button
              onClick={onBackToMap}
              className="px-5 py-2.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-dark transition-colors inline-flex items-center gap-2 shadow-sm flex-shrink-0"
            >
              <span>Prozkoumat další stanice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
