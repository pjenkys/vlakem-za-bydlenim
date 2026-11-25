import React, { useState, useMemo } from 'react';
import {
  Train,
  Home,
  MapPin,
  Sparkles,
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
} from '../data/caseStudyLovosice';
import {
  CarPreset,
  calculateCommutingCosts,
  calculateMortgageDetails,
  calculateMortgageTaxRefundMonthly,
  calculateThreeYearProjection,
  calculateEquityBuilding,
  calculatePragueComparison,
  calculateCarFreeSavings,
  formatDaysCz,
  MonthlyExpensesBreakdown,
  MonthlyIncomeBreakdown,
} from '../utils/caseStudyMath';
import { CaseStudyWalkingMap } from './CaseStudyWalkingMap';
import { formatCzechNumber } from '../utils/calculations';

interface CaseStudyPageProps {
  onBackToMap: () => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ onBackToMap }) => {
  // --- Progressive Disclosure State (clean overview by default) ---
  const [showGalleryDetails, setShowGalleryDetails] = useState(false);
  const [showPragueDetails, setShowPragueDetails] = useState(false);
  const [showCommuteDetails, setShowCommuteDetails] = useState(false);
  const [showExpensesEdit, setShowExpensesEdit] = useState(false);
  const [showIncomeEquityDetails, setShowIncomeEquityDetails] = useState(false);
  const [showProjectionDetails, setShowProjectionDetails] = useState(false);
  const [showCarDetails, setShowCarDetails] = useState(false);

  // --- Photo Gallery State ---
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // --- Commute State ---
  const [tripsPerWeek, setTripsPerWeek] = useState(3);
  const [workingWeeks, setWorkingWeeks] = useState<46 | 50>(46);
  const [in100Optimized, setIn100Optimized] = useState(true);

  // --- Financing & Mortgage State ---
  const [purchasePrice, setPurchasePrice] = useState(CASE_STUDY_LISTING.priceCzk);
  const [priceInputStr, setPriceInputStr] = useState(formatCzechNumber(CASE_STUDY_LISTING.priceCzk));
  const [downPaymentPercent, setDownPaymentPercent] = useState<10 | 20>(10);
  const [interestRate, setInterestRate] = useState(4.99);

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
  const [appreciationPercent, setAppreciationPercent] = useState(3.0);

  // --- Operating Expenses State ---
  const [hoaRepairFund, setHoaRepairFund] = useState(CASE_STUDY_LISTING.hoaRepairFundCzk);
  const [heatingAndHotWater, setHeatingAndHotWater] = useState(1800);
  const [waterAndSewer, setWaterAndSewer] = useState(700);
  const [electricity, setElectricity] = useState(1300);
  const [gas, setGas] = useState(0);
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

  // --- Car-free Preset State ---
  const [carPreset, setCarPreset] = useState<CarPreset>('older');

  // --- 3-Year Projection State ---
  const [wagePreset, setWagePreset] = useState<'prague' | 'cr' | 'custom'>('prague');
  const [customNetWage, setCustomNetWage] = useState(51060);
  const [wageGrowthRate, setWageGrowthRate] = useState(5.5);
  const [refinancingRate, setRefinancingRate] = useState(4.4);
  const [costInflationRate] = useState(2.5);

  const activeNetWage = useMemo(() => {
    if (wagePreset === 'prague') return 51060;
    if (wagePreset === 'cr') return 40710;
    return customNetWage;
  }, [wagePreset, customNetWage]);

  const dynamicPricePerSqm = useMemo(() => {
    return Math.round(purchasePrice / CASE_STUDY_LISTING.usableAreaSqm);
  }, [purchasePrice]);

  // 1. Commute Calculations
  const commute = useMemo(() => {
    return calculateCommutingCosts(tripsPerWeek, workingWeeks, in100Optimized);
  }, [tripsPerWeek, workingWeeks, in100Optimized]);

  // 2. Mortgage Calculations
  const mortgage = useMemo(() => {
    return calculateMortgageDetails(
      purchasePrice,
      downPaymentPercent,
      interestRate,
      refinancingRate,
      360
    );
  }, [purchasePrice, downPaymentPercent, interestRate, refinancingRate]);

  // 3. Equity Building
  const equity = useMemo(() => {
    return calculateEquityBuilding(
      purchasePrice,
      mortgage.averageMonthlyPrincipalYear1,
      appreciationPercent
    );
  }, [purchasePrice, mortgage.averageMonthlyPrincipalYear1, appreciationPercent]);

  // Proportional ratio for § 15 ZDP mortgage interest deduction
  const ownerOccupiedRatio = rentOutRoom && deductRoomRentTax ? 0.70 : 1.0;

  // 4. Tax Refunds (§ 15 ZDP)
  const taxRefund = useMemo(() => {
    return calculateMortgageTaxRefundMonthly(mortgage.interestPaidYear1, ownerOccupiedRatio);
  }, [mortgage.interestPaidYear1, ownerOccupiedRatio]);

  const taxRefundAlone = useMemo(() => {
    return calculateMortgageTaxRefundMonthly(mortgage.interestPaidYear1, 1.0);
  }, [mortgage.interestPaidYear1]);

  const year4TaxRefund = useMemo(() => {
    return calculateMortgageTaxRefundMonthly(mortgage.interestPaidYear4, ownerOccupiedRatio);
  }, [mortgage.interestPaidYear4, ownerOccupiedRatio]);

  // 5. Shared Operating Expenses & Roommate Utility Share (50/50)
  const sharedOperatingExpenses = useMemo(() => {
    return (
      heatingAndHotWater +
      waterAndSewer +
      electricity +
      gas +
      hoaServicesAndAdmin +
      insurance +
      internetAndFees
    );
  }, [
    heatingAndHotWater,
    waterAndSewer,
    electricity,
    gas,
    hoaServicesAndAdmin,
    insurance,
    internetAndFees,
  ]);

  const totalOperatingExpenses = useMemo(() => {
    return (
      hoaRepairFund +
      sharedOperatingExpenses +
      propertyTaxMonthly +
      maintenanceReserveAmount
    );
  }, [hoaRepairFund, sharedOperatingExpenses, propertyTaxMonthly, maintenanceReserveAmount]);

  const roommateUtilitiesShare = useMemo(() => {
    return rentOutRoom ? Math.round(sharedOperatingExpenses / 2) : 0;
  }, [rentOutRoom, sharedOperatingExpenses]);

  const simRoommateUtilitiesShare = useMemo(() => {
    return Math.round(sharedOperatingExpenses / 2);
  }, [sharedOperatingExpenses]);

  // 6. Room Rental Net Income (§ 9 ZDP: tax exclusively on pure rent)
  const roomPureRent = roomRentAmount;

  const roomRentTaxMonthly = useMemo(() => {
    if (!rentOutRoom || !deductRoomRentTax) return 0;
    return Math.round(roomPureRent * 0.70 * 0.15);
  }, [rentOutRoom, deductRoomRentTax, roomPureRent]);

  const roomPureRentNet = useMemo(() => {
    return roomPureRent - roomRentTaxMonthly;
  }, [roomPureRent, roomRentTaxMonthly]);

  const roommateTotalPayment = useMemo(() => {
    if (!rentOutRoom) return 0;
    return roomPureRent + roommateUtilitiesShare;
  }, [rentOutRoom, roomPureRent, roommateUtilitiesShare]);

  const roomRentNet = useMemo(() => {
    if (!rentOutRoom) return 0;
    return roomPureRentNet + roommateUtilitiesShare;
  }, [rentOutRoom, roomPureRentNet, roommateUtilitiesShare]);

  // 7. Monthly Expenses & Incomes Summaries
  const monthlyExpenses: MonthlyExpensesBreakdown = useMemo(() => {
    const total =
      mortgage.monthlyPayment +
      totalOperatingExpenses +
      commute.effectiveMonthlyCost;

    return {
      mortgagePayment: mortgage.monthlyPayment,
      hoaRepairFund,
      heatingAndHotWater,
      waterAndSewer,
      electricity,
      gas,
      hoaServicesAndAdmin,
      insurancePropertyAndHome: insurance,
      internetAndBroadcastFees: internetAndFees,
      propertyTaxMonthly,
      apartmentMaintenanceReserve: maintenanceReserveAmount,
      trainCommuteMonthly: commute.effectiveMonthlyCost,
      totalGrossExpenses: total,
    };
  }, [
    mortgage.monthlyPayment,
    totalOperatingExpenses,
    hoaRepairFund,
    heatingAndHotWater,
    waterAndSewer,
    electricity,
    gas,
    hoaServicesAndAdmin,
    insurance,
    internetAndFees,
    propertyTaxMonthly,
    maintenanceReserveAmount,
    commute.effectiveMonthlyCost,
  ]);

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

  const netMonthlyCost = useMemo(() => {
    return monthlyExpenses.totalGrossExpenses - monthlyIncomes.totalIncomeAndOffsets;
  }, [monthlyExpenses.totalGrossExpenses, monthlyIncomes.totalIncomeAndOffsets]);

  const netCostAlone = useMemo(() => {
    return monthlyExpenses.totalGrossExpenses - taxRefundAlone.monthlyRefund;
  }, [monthlyExpenses.totalGrossExpenses, taxRefundAlone.monthlyRefund]);

  const netCostWithRoommate = useMemo(() => {
    const taxWithRoom = calculateMortgageTaxRefundMonthly(
      mortgage.interestPaidYear1,
      deductRoomRentTax ? 0.70 : 1.0
    );
    const taxMonthly = deductRoomRentTax ? Math.round(roomRentAmount * 0.70 * 0.15) : 0;
    const simNetRent = roomRentAmount - taxMonthly + simRoommateUtilitiesShare;
    return monthlyExpenses.totalGrossExpenses - (taxWithRoom.monthlyRefund + simNetRent);
  }, [
    mortgage.interestPaidYear1,
    deductRoomRentTax,
    roomRentAmount,
    simRoommateUtilitiesShare,
    monthlyExpenses.totalGrossExpenses,
  ]);

  // 8. Prague Comparison
  const pragueComparison = useMemo(() => {
    return calculatePragueComparison(
      CASE_STUDY_LISTING.usableAreaSqm,
      purchasePrice,
      netMonthlyCost,
      interestRate
    );
  }, [purchasePrice, netMonthlyCost, interestRate]);

  // 9. Car-free Savings
  const carSavings = useMemo(() => {
    return calculateCarFreeSavings(commute.effectiveAnnualCost, carPreset);
  }, [commute.effectiveAnnualCost, carPreset]);

  const netCarSavingsYearly = carSavings.netCarFreeSavingsAnnual;
  const netCarSavingsMonthly = carSavings.netCarFreeSavingsMonthly;
  const mortgageCoveragePct =
    mortgage.monthlyPayment > 0
      ? Math.round((netCarSavingsMonthly / mortgage.monthlyPayment) * 100)
      : 0;

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

  const savingsVsPragueRent = pragueComparison.pragueTotalRentMonthly - netMonthlyCost;

  return (
    <div className="w-full h-full overflow-y-auto bg-paper text-ink pb-16 selection:bg-navy selection:text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* HERO SECTION: EXECUTIVE SUMMARY */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-navy text-white">
              Modelový příklad
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-ink-muted border border-hairline">
              Lovosice · Ústecký kraj
            </span>
            <a
              href={CASE_STUDY_LISTING.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1 ml-auto"
            >
              <span>Inzerát na Sreality.cz</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink font-sans">
              Byt 2+1 (53 m²) 3 minuty pěšky od nádraží Lovosice
            </h1>
            <p className="text-sm text-ink-muted mt-1 max-w-3xl leading-relaxed">
              Přehledná analýza reálného bytu u železničního koridoru: porovnání s Prahou, rozpočet hypotéky,
              dojíždění vlakem a výhled po refinancování. U každé části si můžete rozkliknout podrobný výpočet.
            </p>
          </div>

          {/* 4 Hero KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Kupní cena bytu
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-ink tabular-nums">
                {formatCzechNumber(purchasePrice)}&nbsp;Kč
              </div>
              <div className="text-[11px] font-mono text-price-tier2 font-semibold mt-0.5">
                {formatCzechNumber(dynamicPricePerSqm)} Kč / m²
              </div>
            </div>

            <div className="bg-white rounded-xl border border-price-tier1/40 p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-price-tier1 block mb-1">
                Čistý náklad z kapsy
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-price-tier1 tabular-nums">
                {formatCzechNumber(netMonthlyCost)}&nbsp;Kč
                <span className="text-xs font-sans font-normal text-ink-muted"> / měs.</span>
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                {rentOutRoom ? 'vč. spolubydlícího, energií i vlaku' : 'bydlení o samotě + energie + vlak'}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1 flex items-center gap-1">
                <Gem className="w-3.5 h-3.5 text-price-tier1" />
                Tvorba vlastního majetku
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-navy tabular-nums">
                +{formatCzechNumber(equity.totalMonthlyEquityCreated)}&nbsp;Kč
                <span className="text-xs font-sans font-normal text-ink-muted"> / měs.</span>
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                jistina + růst hodnoty ({appreciationPercent.toFixed(1).replace('.', ',')} % ročně)
              </div>
            </div>

            <div className="bg-white rounded-xl border border-hairline p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1 flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-navy" />
                Vlakem do Prahy
              </span>
              <div className="text-xl md:text-2xl font-mono font-extrabold text-navy tabular-nums">
                56–68 min
              </div>
              <div className="text-[11px] text-ink-muted mt-0.5">
                Podbaba 56 min · hl.n. 68 min (posl. 00:15)
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PHOTO GALLERY & CORE LISTING PARAMS */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
              <Home className="w-4 h-4 text-navy" />
              <span>Byt v Lovosicích a volba spolubydlení</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5">
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
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
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

            {/* Specifications & Roommate Toggle Column (5 cols) */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Dispozice & plocha</span>
                  <span className="font-bold text-ink text-sm">2+1 (53 m²)</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">+ balkon + sklep 4,7 m²</span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Podlaží & budova</span>
                  <span className="font-bold text-ink text-sm">2. NP ze 4</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">Zateplený dům po revitalizaci</span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Vlastnictví & PENB</span>
                  <span className="font-bold text-ink text-sm">Osobní · Třída C</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Úsporný provoz</span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] uppercase font-bold text-ink-muted block">Fond oprav (SVJ)</span>
                  <span className="font-mono font-bold text-ink text-sm">1 400 Kč / měs.</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">Stabilní SVJ</span>
                </div>
              </div>

              {/* Clean Room Rental Toggle */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  rentOutRoom
                    ? 'bg-emerald-50/80 border-price-tier1/40 shadow-xs'
                    : 'bg-paper/70 border-hairline hover:border-ink/20'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rentOutRoom}
                    onChange={(e) => setRentOutRoom(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-navy focus:ring-navy border-hairline accent-navy cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Users className={`w-3.5 h-3.5 ${rentOutRoom ? 'text-price-tier1' : 'text-navy'}`} />
                        Pronajímat neprůchozí pokoj kamarádovi?
                      </span>
                    </div>
                    {rentOutRoom ? (
                      <p className="text-[11px] text-ink-muted leading-relaxed">
                        <strong className="text-price-tier1">Zapnuto:</strong> Kamarád platí{' '}
                        <strong className="text-ink">{formatCzechNumber(roomRentAmount)} Kč holý nájem + {formatCzechNumber(roommateUtilitiesShare)} Kč</strong> (50 % energií).
                        Řeší to bydlení 2 lidem a váš čistý výdaj klesá na{' '}
                        <strong className="text-price-tier1 font-mono">{formatCzechNumber(netMonthlyCost)} Kč/měs.</strong>
                      </p>
                    ) : (
                      <p className="text-[11px] text-ink-muted leading-relaxed">
                        <strong>Vypnuto:</strong> Bydlíte v celém 2+1 sami (čistý náklad{' '}
                        <strong className="text-ink font-mono">{formatCzechNumber(netCostAlone)} Kč/měs.</strong>).
                        Zaškrtnutím můžete pronajmout 1 samostatný pokoj a snížit si náklad na{' '}
                        <strong className="text-price-tier1 font-mono">{formatCzechNumber(netCostWithRoommate)} Kč/měs.</strong>
                      </p>
                    )}
                  </div>
                </label>
              </div>

              {/* Expandable Listing Details & Broker Description */}
              <div className="border border-hairline rounded-lg bg-paper/40 overflow-hidden">
                <button
                  onClick={() => setShowGalleryDetails(!showGalleryDetails)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-bold text-navy hover:bg-paper transition-colors"
                >
                  <span>Další parametry bytu a původní popis makléře</span>
                  {showGalleryDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showGalleryDetails && (
                  <div className="px-3 pb-3 pt-2 border-t border-hairline space-y-2.5 text-[11px] text-ink-muted">
                    <div className="grid grid-cols-2 gap-2 text-ink">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-ink-muted block">Vytápění & TUV</span>
                        <span>Dálkové ústřední vytápění</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-ink-muted block">Orientace & Kód</span>
                        <span>Jižní okna · ID {CASE_STUDY_LISTING.id}</span>
                      </div>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line pt-2 border-t border-hairline">
                      {CASE_STUDY_LISTING.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: PRAGUE VS LOVOSICE COMPARISON */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Building2 className="w-4 h-4 text-navy" />
                <span>Přímé srovnání: Byt 2+1 (53 m²) v Praze vs. v Lovosicích</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Metodicky shodná velikost i úroková sazba ({interestRate.toFixed(2)} %)
              </p>
            </div>
          </div>

          {/* 3 Clean Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Prague Buy */}
            <div className="p-4 rounded-xl border border-hairline bg-paper/50 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">Varianta 1</span>
                <h3 className="font-bold text-sm text-ink">Koupě 2+1 v Praze</h3>
              </div>

              <div className="pt-1 space-y-1 font-mono tabular-nums">
                <div className="flex justify-between text-ink-muted">
                  <span className="font-sans">Kupní cena / základ 10 %:</span>
                  <span className="font-bold text-ink">
                    {formatCzechNumber(pragueComparison.praguePurchasePrice)} Kč
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-ink-muted">
                  <span className="font-sans">Potřebná hotovost (10 %):</span>
                  <span>{formatCzechNumber(pragueComparison.pragueDownPayment10Percent)} Kč</span>
                </div>
              </div>

              <div className="pt-2 border-t border-hairline flex items-baseline justify-between">
                <span className="font-semibold text-ink">Čistý náklad po daních:</span>
                <span className="font-mono font-extrabold text-base text-rose-700">
                  {formatCzechNumber(pragueComparison.pragueTotalMonthlyNet)} Kč/měs.
                </span>
              </div>

              {showPragueDetails && (
                <div className="pt-2 border-t border-hairline/70 space-y-1 text-[11px] font-mono tabular-nums text-ink-muted">
                  <div className="flex justify-between">
                    <span className="font-sans">Cena za m² (Praha průměr):</span>
                    <span>145 000 Kč/m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Splátka hypotéky:</span>
                    <span className="text-ink">{formatCzechNumber(pragueComparison.pragueMortgageMonthly)} Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Energie a SVJ:</span>
                    <span className="text-ink">{formatCzechNumber(pragueComparison.pragueOperatingCostsMonthly)} Kč</span>
                  </div>
                  <div className="flex justify-between text-price-tier1 font-semibold">
                    <span className="font-sans">Daňová vratka § 15 ZDP:</span>
                    <span>-{formatCzechNumber(pragueComparison.pragueTaxRefundMonthly)} Kč</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Prague Rent */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">Varianta 2</span>
                <h3 className="font-bold text-sm text-ink">Nájem 2+1 v Praze</h3>
              </div>

              <div className="pt-1 space-y-1">
                <div className="text-[11px] text-rose-800 font-medium">
                  100% utopený náklad bez tvorby majetku
                </div>
                <div className="text-[11px] text-ink-muted font-mono">
                  Praha průměr: 415 Kč / m² + poplatky
                </div>
              </div>

              <div className="pt-2 border-t border-rose-200 flex items-baseline justify-between">
                <span className="font-semibold text-ink">Celkem nájemné:</span>
                <span className="font-mono font-extrabold text-base text-rose-800">
                  {formatCzechNumber(pragueComparison.pragueTotalRentMonthly)} Kč/měs.
                </span>
              </div>

              {showPragueDetails && (
                <div className="pt-2 border-t border-rose-200/70 space-y-1.5 text-[11px]">
                  <div className="flex justify-between font-mono text-ink-muted">
                    <span className="font-sans">Čistý nájem:</span>
                    <span className="text-ink">{formatCzechNumber(pragueComparison.praguePureRentMonthly)} Kč</span>
                  </div>
                  <div className="flex justify-between font-mono text-ink-muted">
                    <span className="font-sans">Poplatky a zálohy:</span>
                    <span className="text-ink">{formatCzechNumber(pragueComparison.pragueRentOperatingCostsMonthly)} Kč</span>
                  </div>
                  <p className="text-rose-700 leading-snug pt-1">
                    Za 10 let zaplatíte téměř <strong>3,3 mil. Kč bez inflace</strong> (při 3% růstu nájmu přes 3,7 mil. Kč) a nevlastníte nic.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Lovosice Own */}
            <div className="p-4 rounded-xl border border-price-tier1 bg-emerald-50/50 space-y-2.5 text-xs shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-price-tier1 block">
                  Vítězná varianta
                </span>
                <h3 className="font-bold text-sm text-ink">Vlastní 2+1 v Lovosicích + vlak</h3>
              </div>

              <div className="pt-1 space-y-1 font-mono tabular-nums">
                <div className="flex justify-between text-ink-muted">
                  <span className="font-sans">Kupní cena ({formatCzechNumber(dynamicPricePerSqm)} Kč/m²):</span>
                  <span className="font-bold text-ink">{formatCzechNumber(purchasePrice)} Kč</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800">
                  <span className="font-sans">Potřebná hotovost ({downPaymentPercent} %):</span>
                  <span className="font-bold">{formatCzechNumber(mortgage.downPaymentCzk)} Kč</span>
                </div>
              </div>

              <div className="pt-2 border-t border-price-tier1/30 flex items-baseline justify-between">
                <span className="font-bold text-price-tier1">Čistý náklad z kapsy:</span>
                <span className="font-mono font-extrabold text-base text-price-tier1">
                  {formatCzechNumber(netMonthlyCost)} Kč/měs.
                </span>
              </div>

              <div className="text-[11px] text-price-tier1 font-semibold leading-snug">
                {savingsVsPragueRent >= 0
                  ? `✓ O ${formatCzechNumber(savingsVsPragueRent)} Kč/měs. levnější než nájem v Praze + tvoříte vlastní majetek.`
                  : `O ${formatCzechNumber(Math.abs(savingsVsPragueRent))} Kč/měs. více než nájem v Praze, ale tvoříte vlastní majetek.`}
              </div>

              {showPragueDetails && (
                <div className="pt-2 border-t border-price-tier1/30 space-y-1 text-[11px]">
                  <div className="flex justify-between font-mono text-ink-muted">
                    <span className="font-sans">Splátka hypotéky ({interestRate.toFixed(2)} %):</span>
                    <span className="text-ink">{formatCzechNumber(mortgage.monthlyPayment)} Kč</span>
                  </div>
                  <div className="text-emerald-900 bg-white/80 p-1.5 rounded border border-price-tier1/20 leading-snug mt-1">
                    {rentOutRoom ? (
                      <>
                        Včetně spolubydlení ({formatCzechNumber(roomRentAmount)} Kč + 50 % energií). Bez spolubydlícího:{' '}
                        <strong>{formatCzechNumber(netCostAlone)} Kč/měs.</strong> (stále o{' '}
                        <strong>{formatCzechNumber(pragueComparison.pragueTotalRentMonthly - netCostAlone)} Kč</strong> levnější než nájem v Praze).
                      </>
                    ) : (
                      <>
                        Bydlíte sami. Se spolubydlícím by čistý náklad klesl na{' '}
                        <strong>{formatCzechNumber(netCostWithRoommate)} Kč/měs.</strong>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowPragueDetails(!showPragueDetails)}
            className="w-full py-2 px-3 rounded-lg border border-hairline bg-paper/60 hover:bg-paper text-xs font-semibold text-navy flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>
              {showPragueDetails
                ? 'Skrýt podrobný rozpad srovnání'
                : 'Zobrazit podrobný rozpad srovnání (hypotéka, SVJ, § 15 ZDP, 10letý nájem)'}
            </span>
            {showPragueDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: VERIFIED LOCATION & 210 M WALKING MAP */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3 gap-2 flex-wrap">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <MapPin className="w-4 h-4 text-price-tier1" />
                <span>Pěší trasa: 3 minuty z perónu až do bytu</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                {CASE_STUDY_LOCATION.address} — ušetříte 15–25 minut denního přesunu na MHD oproti okrajům Prahy
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-price-tier1 bg-emerald-50 px-2.5 py-1 rounded-md border border-price-tier1/20">
              210 m po rovině
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-7">
              <CaseStudyWalkingMap />
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs text-ink-muted leading-relaxed">
              <div className="flex items-start gap-2.5 p-3 bg-paper rounded-xl border border-hairline">
                <CheckCircle2 className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink block">Nulové náklady na místní MHD</strong>
                  Žádné čekání na příměstský autobus ani parkovné u nádraží — z bytu jste ve vlaku za 180 sekund.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-paper rounded-xl border border-hairline">
                <CheckCircle2 className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink block">Práce ve vlaku i noční návraty</strong>
                  Rychlíky R20 mají Wi-Fi a zásuvky 230 V. Večerní spoje z Prahy odjíždí až ve 23:10 (R20) a 00:15 (Os).
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-paper rounded-xl border border-hairline">
                <CheckCircle2 className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink block">Občanská vybavenost v okolí</strong>
                  Obchody, lékárna, lékaři i školy jsou v okruhu do 500 metrů od domu.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: INTERACTIVE COMMUTING CALCULATOR */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Train className="w-4 h-4 text-navy" />
                <span>Náklady na vlak do Prahy (IN 50 vs. IN 100)</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Plná jízdenka stojí 169 Kč · S kartou IN 50 stojí jedna cesta polovinu (84,50 Kč)
              </p>
            </div>
            <div className="text-right font-mono font-bold text-sm text-navy">
              Aktuálně: {formatCzechNumber(commute.effectiveMonthlyCost)} Kč / měs.
            </div>
          </div>

          <div className="p-4 bg-paper rounded-xl border border-hairline space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-ink">
                Počet dnů v Praze týdně (tam i zpět):
              </label>
              <span className="text-xs font-mono font-bold text-navy bg-white px-2.5 py-1 rounded-md border border-hairline">
                {formatDaysCz(tripsPerWeek)}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={tripsPerWeek}
              onChange={(e) => setTripsPerWeek(Number(e.target.value))}
              className="w-full h-2 bg-hairline rounded-lg appearance-none cursor-pointer accent-navy"
            />
            <div className="flex justify-between text-[10px] text-ink-muted font-mono">
              <span>1 den / týden</span>
              <span>3 dny (hybrid)</span>
              <span>5 dní (denně)</span>
              <span>7 dní</span>
            </div>
          </div>

          {commute.shouldRecommendIn100 && (
            <div className="p-3.5 bg-emerald-50 border border-price-tier1/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-price-tier1 flex-shrink-0 mt-0.5" />
                <span className="text-ink/85 leading-snug">
                  Od 3 dnů týdně se vyplatí síťová <strong>IN 100 za 22 000 Kč/rok</strong> — ušetříte{' '}
                  <strong className="text-price-tier1">{formatCzechNumber(commute.annualSavingsWithIn100)} Kč ročně</strong> a jezdíte neomezeně po celé ČR.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-price-tier1/30 font-bold text-price-tier1 flex-shrink-0 select-none">
                <input
                  type="checkbox"
                  checked={in100Optimized}
                  onChange={(e) => setIn100Optimized(e.target.checked)}
                  className="accent-emerald-700 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Zastropovat na IN 100</span>
              </label>
            </div>
          )}

          {/* Side-by-side cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                !commute.shouldRecommendIn100 || !in100Optimized
                  ? 'bg-white border-navy ring-1 ring-navy/20 shadow-xs'
                  : 'bg-paper/60 border-hairline text-ink-muted'
              }`}
            >
              <div>
                <div className="font-bold text-ink">Varianta A: In Karta 50</div>
                <div className="text-[11px] font-mono mt-0.5">
                  84,50 Kč/jízda · {formatCzechNumber(commute.in50AnnualCost)} Kč/rok
                </div>
              </div>
              <div className="font-mono font-bold text-sm text-ink">
                {formatCzechNumber(commute.in50MonthlyCost)} Kč/měs.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                commute.shouldRecommendIn100 && in100Optimized
                  ? 'bg-white border-price-tier1 ring-1 ring-price-tier1/20 shadow-xs'
                  : 'bg-paper/60 border-hairline text-ink-muted'
              }`}
            >
              <div>
                <div className="font-bold text-price-tier1 flex items-center gap-1.5">
                  <span>Varianta B: Celosíťová IN 100</span>
                  {commute.shouldRecommendIn100 && (
                    <span className="text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">Doporučeno</span>
                  )}
                </div>
                <div className="text-[11px] font-mono mt-0.5">
                  Neomezeně ČD po ČR · {formatCzechNumber(commute.in100AnnualCost)} Kč/rok
                </div>
              </div>
              <div className="font-mono font-bold text-sm text-price-tier1">
                {formatCzechNumber(commute.in100MonthlyCost)} Kč/měs.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCommuteDetails(!showCommuteDetails)}
            className="w-full py-2 px-3 rounded-lg border border-hairline bg-paper/60 hover:bg-paper text-xs font-semibold text-navy flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>
              {showCommuteDetails
                ? 'Skrýt srovnávací tabulku a nastavení týdnů'
                : 'Zobrazit srovnávací tabulku (1–7 dní) a délku pracovního roku'}
            </span>
            {showCommuteDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCommuteDetails && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted font-medium">Počet pracovních týdnů v roce (mimo dovolenou):</span>
                <div className="flex items-center gap-1 bg-paper p-1 rounded-lg border border-hairline font-semibold">
                  <button
                    onClick={() => setWorkingWeeks(46)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      workingWeeks === 46 ? 'bg-navy text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    46 týdnů (standard)
                  </button>
                  <button
                    onClick={() => setWorkingWeeks(50)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      workingWeeks === 50 ? 'bg-navy text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    50 týdnů
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-hairline rounded-lg">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-paper text-ink-muted border-b border-hairline font-semibold">
                    <tr>
                      <th className="py-2 px-3">Dní v Praze týdně</th>
                      <th className="py-2 px-3">IN 50 ročně</th>
                      <th className="py-2 px-3">IN 100 ročně</th>
                      <th className="py-2 px-3">Výhodnější</th>
                      <th className="py-2 px-3 text-right">Rozdíl</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline font-mono tabular-nums">
                    {commute.breakEvenTable.map((row) => (
                      <tr key={row.trips} className={row.trips === tripsPerWeek ? 'bg-navy/5 font-bold' : ''}>
                        <td className="py-1.5 px-3">{row.trips}× / týden</td>
                        <td className="py-1.5 px-3">{formatCzechNumber(row.in50Annual)} Kč</td>
                        <td className="py-1.5 px-3">{formatCzechNumber(row.in100Annual)} Kč</td>
                        <td className="py-1.5 px-3 font-sans font-semibold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              row.recommended === 'IN 100'
                                ? 'bg-emerald-50 text-price-tier1'
                                : 'bg-paper text-ink'
                            }`}
                          >
                            {row.recommended}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          {row.diff > 0 ? (
                            <span className="text-price-tier1 font-semibold">+{formatCzechNumber(row.diff)} Kč úspora s IN 100</span>
                          ) : row.diff < 0 ? (
                            <span className="text-slate-600 font-semibold">úspora {formatCzechNumber(Math.abs(row.diff))} Kč s IN 50</span>
                          ) : (
                            <span className="text-ink-muted">0 Kč</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: MONTHLY CASHFLOW & MORTGAGE (EXECUTIVE SUMMARY + DETAILS) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Sliders className="w-4 h-4 text-navy" />
                <span>Měsíční rozpočet: Výdaje vs. Příjmy a hypotéka</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Hlavní finanční páky hypotéky a přehledné součty měsíčních nákladů i úlev
              </p>
            </div>
          </div>

          {/* 3 Main Financial Levers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-paper rounded-xl border border-hairline text-xs">
            <div className="space-y-1">
              <label className="font-bold text-ink block">Kupní cena bytu:</label>
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

            <div className="space-y-1">
              <label className="font-bold text-ink block">Vlastní zdroje (LTV):</label>
              <div className="grid grid-cols-2 gap-1 bg-white p-0.5 rounded-lg border border-hairline">
                <button
                  onClick={() => setDownPaymentPercent(10)}
                  className={`py-1.5 px-2 font-semibold rounded text-[11px] transition-all ${
                    downPaymentPercent === 10 ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  10 % (do 36 let)
                </button>
                <button
                  onClick={() => setDownPaymentPercent(20)}
                  className={`py-1.5 px-2 font-semibold rounded text-[11px] transition-all ${
                    downPaymentPercent === 20 ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  20 % (standard)
                </button>
              </div>
              <span className="text-[10px] text-ink-muted block mt-0.5">
                Potřebná hotovost: <strong>{formatCzechNumber(mortgage.downPaymentCzk)} Kč</strong>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-bold text-ink">Úrok hypotéky:</label>
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
                <span>4.99 % (výchozí)</span>
                <span>6.5 %</span>
              </div>
            </div>
          </div>

          {/* Two Clean Columns: Summary First, Expandable Detail Inside */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-xs">
            {/* LEFT COLUMN: EXPENSES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <h3 className="font-bold uppercase tracking-wider text-price-tier4">Měsíční výdaje celkem</h3>
                <span className="font-mono font-bold text-sm text-price-tier4 tabular-nums">
                  {formatCzechNumber(monthlyExpenses.totalGrossExpenses)} Kč / měs.
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-paper rounded-lg border border-hairline flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ink block">1. Splátka hypotéky ({interestRate.toFixed(2)} %)</span>
                    <span className="text-[10px] text-price-tier1 font-mono font-semibold">
                      z toho splátka jistiny (tvorba majetku): +{formatCzechNumber(mortgage.averageMonthlyPrincipalYear1)} Kč
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-ink">
                    {formatCzechNumber(mortgage.monthlyPayment)} Kč
                  </span>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-hairline flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ink block">2. Provoz bytu celkem (SVJ + energie + fond oprav)</span>
                    <span className="text-[10px] text-ink-muted">
                      Fond oprav {formatCzechNumber(hoaRepairFund)} Kč · Energie a služby {formatCzechNumber(sharedOperatingExpenses)} Kč
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-ink">
                    {formatCzechNumber(totalOperatingExpenses)} Kč
                  </span>
                </div>

                <div className="p-3 bg-navy/5 rounded-lg border border-navy/20 flex items-center justify-between text-navy">
                  <span className="font-bold">3. Dojíždění vlakem ({formatDaysCz(tripsPerWeek)})</span>
                  <span className="font-mono font-bold text-sm">
                    {formatCzechNumber(commute.effectiveMonthlyCost)} Kč
                  </span>
                </div>
              </div>

              {/* Expandable Expenses Editor */}
              <div className="border border-hairline rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowExpensesEdit(!showExpensesEdit)}
                  className="w-full px-3 py-2 bg-paper/60 hover:bg-paper flex items-center justify-between font-semibold text-navy transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{showExpensesEdit ? 'Skrýt položky provozu a energií' : 'Upravit položky energií, fondu oprav a rezervy'}</span>
                  </span>
                  {showExpensesEdit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showExpensesEdit && (
                  <div className="p-3 bg-white border-t border-hairline space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Fond oprav SVJ (100 % majitel):</span>
                      <input type="number" step={50} value={hoaRepairFund} onChange={(e) => setHoaRepairFund(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Dálkové teplo & ohřev TUV (50/50):</span>
                      <input type="number" step={100} value={heatingAndHotWater} onChange={(e) => setHeatingAndHotWater(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Vodné a stočné (50/50):</span>
                      <input type="number" step={50} value={waterAndSewer} onChange={(e) => setWaterAndSewer(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Elektřina byt (50/50):</span>
                      <input type="number" step={50} value={electricity} onChange={(e) => setElectricity(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Plyn (vaření – 50/50):</span>
                      <input type="number" step={50} value={gas} onChange={(e) => setGas(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Služby SVJ (úklid, správa – 50/50):</span>
                      <input type="number" step={50} value={hoaServicesAndAdmin} onChange={(e) => setHoaServicesAndAdmin(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Pojištění bytu & domácnosti (50/50):</span>
                      <input type="number" step={50} value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Internet + poplatky (50/50):</span>
                      <input type="number" step={50} value={internetAndFees} onChange={(e) => setInternetAndFees(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink">Daň z nemovitostí (100 % majitel):</span>
                      <input type="number" step={10} value={propertyTaxMonthly} onChange={(e) => setPropertyTaxMonthly(Number(e.target.value))} className="w-24 bg-paper border border-hairline rounded px-2 py-0.5 font-mono text-right font-bold" />
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-hairline">
                      <label className="flex items-center gap-1.5 cursor-pointer text-ink font-semibold">
                        <input
                          type="checkbox"
                          checked={includeMaintenanceReserve}
                          onChange={(e) => setIncludeMaintenanceReserve(e.target.checked)}
                          className="accent-navy"
                        />
                        <span>Rezerva na údržbu bytu (majitel):</span>
                      </label>
                      <span className="font-mono font-bold">{formatCzechNumber(maintenanceReserveAmount)} Kč</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: INCOMES, TAX OFFSETS & EQUITY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <h3 className="font-bold uppercase tracking-wider text-price-tier1">Příjmy, úlevy a tvorba majetku</h3>
                <span className="font-mono font-bold text-sm text-price-tier1 tabular-nums">
                  -{formatCzechNumber(monthlyIncomes.totalIncomeAndOffsets)} Kč / měs.
                </span>
              </div>

              <div className="space-y-2">
                {/* 1. Tax refund */}
                <div className="p-3 bg-emerald-50/70 rounded-lg border border-price-tier1/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-price-tier1 block">1. Daňová vratka z úroků (§ 15 ZDP)</span>
                    <span className="text-[10px] text-ink-muted">
                      Ročně stát vrátí {formatCzechNumber(taxRefund.annualRefund)} Kč ({rentOutRoom && deductRoomRentTax ? '70% poměr' : '100% odpočet'})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-price-tier1">
                    +{formatCzechNumber(taxRefund.monthlyRefund)} Kč
                  </span>
                </div>

                {/* 2. Roommate summary + inline toggle */}
                <div className="p-3 bg-white rounded-lg border border-hairline flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={rentOutRoom}
                      onChange={(e) => setRentOutRoom(e.target.checked)}
                      className="w-4 h-4 accent-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-ink block">2. Spolubydlící (pronájem 1 pokoje)</span>
                      <span className="text-[10px] text-ink-muted">
                        {rentOutRoom
                          ? `Holý nájem ${formatCzechNumber(roomRentAmount)} Kč + 50 % energií − daň`
                          : 'Vypnuto (bydlíte v celém bytě sami)'}
                      </span>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-sm ${rentOutRoom ? 'text-price-tier1' : 'text-ink-muted'}`}>
                    {rentOutRoom ? `+${formatCzechNumber(roomRentNet)} Kč` : '0 Kč'}
                  </span>
                </div>

                {/* 3. Equity building summary */}
                <div className="p-3 bg-emerald-50/90 rounded-lg border border-price-tier1/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-price-tier1 flex items-center gap-1">
                      <Gem className="w-3.5 h-3.5" />
                      <span>Tvorba majetku (nejde do spotřeby)</span>
                    </span>
                    <span className="text-[10px] text-ink-muted font-mono">
                      Jistina +{formatCzechNumber(equity.monthlyPrincipalRepaid)} Kč · Růst bytu ({appreciationPercent.toFixed(1).replace('.', ',')} %) +{formatCzechNumber(equity.monthlyAppreciationCzk)} Kč
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-price-tier1">
                    +{formatCzechNumber(equity.totalMonthlyEquityCreated)} Kč
                  </span>
                </div>
              </div>

              {/* Expandable Tax, Room Rent & Appreciation Controls */}
              <div className="border border-hairline rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowIncomeEquityDetails(!showIncomeEquityDetails)}
                  className="w-full px-3 py-2 bg-paper/60 hover:bg-paper flex items-center justify-between font-semibold text-navy transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>
                      {showIncomeEquityDetails
                        ? 'Skrýt nastavení nájmu, daní a růstu cen'
                        : 'Detail daní (§ 9 a § 15 ZDP), výše nájmu pokoje a růstu cen'}
                    </span>
                  </span>
                  {showIncomeEquityDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showIncomeEquityDetails && (
                  <div className="p-3.5 bg-white border-t border-hairline space-y-4">
                    {/* Room rent controls */}
                    {rentOutRoom && (
                      <div className="space-y-2.5 pb-3 border-b border-hairline">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-ink">Holý nájem za pokoj (bez energií):</span>
                          <span className="font-mono font-bold text-price-tier1">{formatCzechNumber(roomRentAmount)} Kč / měs.</span>
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

                        <div className="p-2.5 bg-paper/70 rounded-lg border border-hairline space-y-1 text-[11px] font-mono">
                          <div className="flex justify-between">
                            <span className="font-sans text-ink-muted">Holý nájem (zdanitelný):</span>
                            <span>{formatCzechNumber(roomPureRent)} Kč</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sans text-ink-muted">50 % energií a služeb (nezdaňuje se):</span>
                            <span className="text-navy">+{formatCzechNumber(roommateUtilitiesShare)} Kč</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-hairline pt-1">
                            <span className="font-sans">Spolubydlící posílá celkem:</span>
                            <span>{formatCzechNumber(roommateTotalPayment)} Kč</span>
                          </div>
                        </div>

                        <label className="flex items-center justify-between cursor-pointer text-[11px]">
                          <span className="flex items-center gap-1.5 font-semibold text-ink">
                            <input
                              type="checkbox"
                              checked={deductRoomRentTax}
                              onChange={(e) => setDeductRoomRentTax(e.target.checked)}
                              className="accent-navy"
                            />
                            <span>Daň z příjmu § 9 ZDP (30% paušál → 10,5 % z holého nájmu)</span>
                          </span>
                          {deductRoomRentTax && (
                            <span className="font-mono text-rose-700 font-bold">-{formatCzechNumber(roomRentTaxMonthly)} Kč</span>
                          )}
                        </label>
                      </div>
                    )}

                    {/* § 15 ZDP explanation */}
                    <div className="text-[11px] text-ink-muted space-y-1 pb-3 border-b border-hairline">
                      <div className="font-bold text-ink">Výpočet odpočtu úroků hypotéky (§ 15 ZDP):</div>
                      <p>
                        Úroky v 1. roce ({formatCzechNumber(mortgage.interestPaidYear1)} Kč) se při oficiálním pronájmu pokoje krátí poměrem vlastní bytové potřeby ({rentOutRoom && deductRoomRentTax ? '70 %' : '100 %'}) a snižují daňový základ až do limitu 150 000 Kč.
                      </p>
                    </div>

                    {/* Appreciation slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-ink">Očekávaný roční růst ceny bytu:</span>
                        <span className="font-mono font-bold text-price-tier1">+{appreciationPercent.toFixed(1)} % p.a.</span>
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
                        <span>3,0 % (dlouhodobý průměr)</span>
                        <span>6,0 %</span>
                      </div>
                      <p className="text-[11px] text-ink-muted pt-1">
                        Při růstu {appreciationPercent.toFixed(1).replace('.', ',')} % ročně vzroste hodnota bytu o{' '}
                        <strong className="text-ink">{formatCzechNumber(equity.annualAppreciationCzk)} Kč/rok</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUMMARY HERO BAR */}
          <div className="p-5 bg-navy text-white rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-white/70 block">
                  Výsledek měsíčního rozpočtu
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
                    ? 'vč. příjmu ze spolubydlení, všech energií, fondu oprav i vlaku do Prahy'
                    : 'bydlení o samotě, vč. všech energií, fondu oprav i vlaku do Prahy'}
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
                  {rentOutRoom ? 'Příjmy (pokoj + daňová vratka):' : 'Daňová vratka (§ 15 ZDP):'}
                </span>
                <span className="font-mono font-bold text-sm text-emerald-300">
                  -{formatCzechNumber(monthlyIncomes.totalIncomeAndOffsets)} Kč/měs.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                <span className="text-[11px] text-emerald-200 font-bold block flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  Tvorba vlastního majetku:
                </span>
                <span className="font-mono font-bold text-sm text-emerald-100">
                  +{formatCzechNumber(equity.totalMonthlyEquityCreated)} Kč/měs.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: 3-YEAR HORIZON (2026 -> 2029) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
            <div>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span>Výhled za 3 roky (2029): Refinancování a růst mezd</span>
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Hypotéka je nejtěžší první 3 roky — pak klesne zůstatek dluhu a vzrostou příjmy
              </p>
            </div>

            {/* Compact Wage Benchmark Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink-muted font-medium hidden sm:inline">Mzda 2026:</span>
              <div className="inline-flex bg-paper p-0.5 rounded-lg border border-hairline text-[11px]">
                <button
                  onClick={() => setWagePreset('prague')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    wagePreset === 'prague' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Praha ({formatCzechNumber(51060)} Kč)
                </button>
                <button
                  onClick={() => setWagePreset('cr')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    wagePreset === 'cr' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  ČR ({formatCzechNumber(40710)} Kč)
                </button>
                <button
                  onClick={() => setWagePreset('custom')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    wagePreset === 'custom' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Vlastní
                </button>
              </div>
              {wagePreset === 'custom' && (
                <input
                  type="number"
                  step={1000}
                  value={customNetWage}
                  onChange={(e) => setCustomNetWage(Number(e.target.value))}
                  className="w-24 bg-paper border border-hairline rounded px-2 py-1 font-mono font-bold text-ink"
                />
              )}
            </div>
          </div>

          {/* 3 Visual Key Metrics (2026 -> 2029) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-paper border border-hairline space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
                Splátka hypotéky
              </span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-ink-muted line-through">{formatCzechNumber(mortgage.monthlyPayment)} Kč</span>
                <span className="text-lg font-extrabold text-price-tier1">
                  {formatCzechNumber(mortgage.refinancedMonthlyPayment)} Kč
                </span>
              </div>
              <span className="text-[11px] text-price-tier1 font-semibold block">
                {mortgage.monthlyMortgagePaymentDrop >= 0
                  ? `Pokles o ${formatCzechNumber(mortgage.monthlyMortgagePaymentDrop)} Kč/měs.`
                  : `Změna +${formatCzechNumber(Math.abs(mortgage.monthlyMortgagePaymentDrop))} Kč/měs.`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-price-tier1/30 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-price-tier1 block">
                Podíl nákladu z čisté mzdy
              </span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-ink-muted">{projection.wageShare2026Percent.toFixed(1)} %</span>
                <span className="text-ink-muted">→</span>
                <span className="text-xl font-extrabold text-price-tier1">
                  {projection.wageShare2029Percent.toFixed(1)} % mzdy
                </span>
              </div>
              <span className="text-[11px] text-price-tier1 font-semibold block">
                {projection.wageShareDiffPoints <= 0
                  ? `Pokles zátěže rozpočtu o ${Math.abs(projection.wageShareDiffPoints).toFixed(1)} p.b.`
                  : `Nárůst o ${projection.wageShareDiffPoints.toFixed(1)} p.b.`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-paper border border-hairline space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
                Zbývá na život po zaplacení
              </span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-ink-muted">{formatCzechNumber(projection.disposableIncome2026)} Kč</span>
                <span className="text-ink-muted">→</span>
                <span className="text-lg font-extrabold text-navy">
                  {formatCzechNumber(projection.disposableIncome2029)} Kč
                </span>
              </div>
              <span className="text-[11px] text-price-tier1 font-semibold block">
                +{formatCzechNumber(projection.disposableIncome2029 - projection.disposableIncome2026)} Kč/měs. navíc k útratě
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowProjectionDetails(!showProjectionDetails)}
            className="w-full py-2 px-3 rounded-lg border border-hairline bg-paper/60 hover:bg-paper text-xs font-semibold text-navy flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>
              {showProjectionDetails
                ? 'Skrýt nastavení projekce a podrobnou tabulku'
                : 'Upravit růst mezd, sazbu refinancování a zobrazit kompletní tabulku 2026 vs. 2029'}
            </span>
            {showProjectionDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showProjectionDetails && (
            <div className="space-y-4 pt-1">
              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-paper rounded-xl border border-hairline text-xs">
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

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="font-bold text-ink">Sazba při refinancování (2029):</label>
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
                    <button onClick={() => setRefinancingRate(interestRate)} className="text-navy underline">
                      Stejná jako dnes ({interestRate.toFixed(2)} %)
                    </button>
                    <span>6.5 %</span>
                  </div>
                </div>
              </div>

              {/* Refinancing mechanism card */}
              <div className="p-3.5 rounded-xl bg-paper/70 border border-hairline text-xs space-y-1">
                <h4 className="font-bold text-navy flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" />
                  Matematika refinancování zpět na 30 let:
                </h4>
                <p className="text-ink-muted leading-relaxed">
                  Za 3 roky splatíte <strong>{formatCzechNumber(mortgage.principalPaid36Months)} Kč jistiny</strong> a dluh klesne na{' '}
                  <strong>{formatCzechNumber(mortgage.remainingBalance36Months)} Kč</strong>. Refinancováním sníženého zůstatku zpět na 30 let splátka hypotéky{' '}
                  {mortgage.monthlyMortgagePaymentDrop >= 0 ? 'klesne' : 'vzroste'} na{' '}
                  <strong className="text-price-tier1">{formatCzechNumber(mortgage.refinancedMonthlyPayment)} Kč/měs.</strong>
                </p>
              </div>

              {/* Full Table */}
              <div className="border border-hairline rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-paper text-ink-muted border-b border-hairline font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 text-left">Metrika</th>
                      <th className="py-2.5 px-4 text-right">Dnes (2026)</th>
                      <th className="py-2.5 px-4 text-right bg-emerald-50/50 text-price-tier1">Za 3 roky (2029)</th>
                      <th className="py-2.5 px-4 text-right">Změna</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline font-mono tabular-nums">
                    <tr>
                      <td className="py-2 px-4 font-sans font-semibold text-ink">Zůstatek hypotéky:</td>
                      <td className="py-2 px-4 text-right">{formatCzechNumber(mortgage.loanAmount)} Kč</td>
                      <td className="py-2 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                        {formatCzechNumber(mortgage.remainingBalance36Months)} Kč
                      </td>
                      <td className="py-2 px-4 text-right text-price-tier1">
                        -{formatCzechNumber(mortgage.principalPaid36Months)} Kč
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-sans font-semibold text-ink">Splátka hypotéky:</td>
                      <td className="py-2 px-4 text-right">{formatCzechNumber(mortgage.monthlyPayment)} Kč</td>
                      <td className="py-2 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                        {formatCzechNumber(mortgage.refinancedMonthlyPayment)} Kč
                      </td>
                      <td className="py-2 px-4 text-right text-price-tier1">
                        {mortgage.monthlyMortgagePaymentDrop >= 0
                          ? `-${formatCzechNumber(mortgage.monthlyMortgagePaymentDrop)} Kč`
                          : `+${formatCzechNumber(Math.abs(mortgage.monthlyMortgagePaymentDrop))} Kč`}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-sans font-semibold text-ink">Čistá mzda:</td>
                      <td className="py-2 px-4 text-right">{formatCzechNumber(projection.wage2026Net)} Kč</td>
                      <td className="py-2 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                        {formatCzechNumber(projection.wage2029Net)} Kč
                      </td>
                      <td className="py-2 px-4 text-right text-price-tier1">+{projection.wageGrowthTotalPercent.toFixed(1)} %</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-sans font-semibold text-ink">Čistý náklad (bydlení+vlak):</td>
                      <td className="py-2 px-4 text-right">{formatCzechNumber(projection.netCost2026)} Kč</td>
                      <td className="py-2 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                        {formatCzechNumber(projection.netCost2029)} Kč
                      </td>
                      <td className="py-2 px-4 text-right text-price-tier1">
                        {projection.netCost2026 - projection.netCost2029 >= 0
                          ? `-${formatCzechNumber(projection.netCost2026 - projection.netCost2029)} Kč`
                          : `+${formatCzechNumber(Math.abs(projection.netCost2026 - projection.netCost2029))} Kč`}
                      </td>
                    </tr>
                    <tr className="bg-navy/5 font-bold">
                      <td className="py-2.5 px-4 font-sans text-navy">Podíl nákladu z čisté mzdy:</td>
                      <td className="py-2.5 px-4 text-right text-ink">{projection.wageShare2026Percent.toFixed(1)} %</td>
                      <td className="py-2.5 px-4 text-right bg-emerald-100/70 text-price-tier1 font-extrabold">
                        {projection.wageShare2029Percent.toFixed(1)} %
                      </td>
                      <td className="py-2.5 px-4 text-right text-price-tier1 font-extrabold">
                        {projection.wageShareDiffPoints <= 0
                          ? `${projection.wageShareDiffPoints.toFixed(1)} p.b.`
                          : `+${projection.wageShareDiffPoints.toFixed(1)} p.b.`}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-sans font-semibold text-ink">Zbývá na život:</td>
                      <td className="py-2 px-4 text-right">{formatCzechNumber(projection.disposableIncome2026)} Kč</td>
                      <td className="py-2 px-4 text-right bg-emerald-50/30 font-bold text-price-tier1">
                        {formatCzechNumber(projection.disposableIncome2029)} Kč
                      </td>
                      <td className="py-2 px-4 text-right text-price-tier1">
                        +{formatCzechNumber(projection.disposableIncome2029 - projection.disposableIncome2026)} Kč
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] font-mono text-ink-muted">
                * Projekce 2029 započítává 2,5% roční inflaci provozu a vlaku ({formatCzechNumber(projection.operatingExpenses2029)} Kč/měs.) a aktualizovanou daňovou vratku ({formatCzechNumber(year4TaxRefund.monthlyRefund)} Kč/měs.).
              </p>
            </div>
          )}

          {/* Bottom Conclusion Callout with Single CTA */}
          <div className="p-4 rounded-xl bg-paper border border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-navy">Závěr případové studie</span>
              <p className="text-xs text-ink-muted max-w-2xl leading-relaxed">
                Zatímco nájem v Praze roste s inflací a nevytváří žádný majetek, vlastní byt u vlaku v Lovosicích fixuje hlavní náklad, buduje kapitál a jeho zátěž klesne ze{' '}
                <strong>{projection.wageShare2026Percent.toFixed(1)} %</strong> na{' '}
                <strong>{projection.wageShare2029Percent.toFixed(1)} %</strong> mzdy.
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

        {/* ========================================================================= */}
        {/* SECTION 7: SUPPLEMENTAL ANALYSIS — LIFE WITHOUT A CAR (COMPACT BY DEFAULT) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-hairline p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-paper text-ink-muted border border-hairline inline-block">
                Doplňková analýza
              </span>
              <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
                <Car className="w-4 h-4 text-navy" />
                <span>Život bez auta: Úspora {formatCzechNumber(netCarSavingsYearly)} Kč ročně ({formatCzechNumber(netCarSavingsMonthly)} Kč / měs.)</span>
              </h2>
              <p className="text-xs text-ink-muted">
                Vzdálenost 210 m od nádraží umožňuje obejít se bez auta — úspora zaplatí{' '}
                <strong className="text-price-tier1">{mortgageCoveragePct} % splátky hypotéky</strong> a cena ojetiny pokryje{' '}
                <strong className="text-price-tier1">{downPaymentCoveragePct} % základu</strong> ({formatCzechNumber(carPurchasePrice)} Kč).
              </p>
            </div>

            <button
              onClick={() => setShowCarDetails(!showCarDetails)}
              className="px-3.5 py-2 rounded-lg border border-hairline bg-paper/70 hover:bg-paper text-xs font-bold text-navy inline-flex items-center gap-1.5 flex-shrink-0 self-start sm:self-center transition-colors"
            >
              <span>{showCarDetails ? 'Skrýt kalkulaci auta' : 'Rozbalit kalkulaci auta'}</span>
              {showCarDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showCarDetails && (
            <div className="space-y-4 pt-3 border-t border-hairline">
              {/* Car Preset Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex p-1 bg-paper rounded-lg border border-hairline text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCarPreset('older')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      carPreset === 'older' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Starší ojetina (150 tis. Kč)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarPreset('newer')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      carPreset === 'newer' ? 'bg-navy text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Zánovní ojetina (320 tis. Kč)
                  </button>
                </div>

                <span className="text-xs font-mono text-ink-muted">
                  Nájezd 12 000 km/rok (~{carSavings.costPerKm.toFixed(1).replace('.', ',')} Kč/km)
                </span>
              </div>

              {/* 6-box Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono tabular-nums">
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] font-sans text-ink-muted block">Ztráta hodnoty:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(carSavings.carDepreciationAnnual)} Kč</span>
                </div>
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] font-sans text-ink-muted block">{carSavings.insuranceLabel}:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(carSavings.carInsuranceAnnual)} Kč</span>
                </div>
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] font-sans text-ink-muted block">Servis, STK, pneu:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(carSavings.carMaintenanceAnnual)} Kč</span>
                </div>
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] font-sans text-ink-muted block">Palivo (12 tis. km):</span>
                  <span className="font-bold text-ink">{formatCzechNumber(carSavings.carFuelAnnual)} Kč</span>
                </div>
                <div className="p-2.5 bg-paper rounded-lg border border-hairline">
                  <span className="text-[10px] font-sans text-ink-muted block">Dálnice & parkování:</span>
                  <span className="font-bold text-ink">{formatCzechNumber(carSavings.carFeesAndParkingAnnual)} Kč</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-800">
                  <span className="text-[10px] font-sans text-rose-800 block font-bold">Celkem auto/rok:</span>
                  <span className="font-extrabold">{formatCzechNumber(carSavings.totalCarCostAnnual)} Kč</span>
                </div>
              </div>

              {/* Equation */}
              <div className="p-2.5 bg-paper rounded-lg border border-hairline font-mono text-[11px] text-ink flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-navy" />
                  <strong className="text-rose-700">{formatCzechNumber(carSavings.totalCarCostAnnual)} Kč</strong> (auto) −{' '}
                  <strong className="text-navy">{formatCzechNumber(commute.effectiveAnnualCost)} Kč</strong> (vlak) =
                </span>
                <span className="font-bold text-price-tier1">
                  +{formatCzechNumber(netCarSavingsYearly)} Kč / rok čistá úspora
                </span>
              </div>

              {/* Down Payment Progress Bar */}
              <div className="p-4 rounded-xl bg-paper/60 border border-hairline space-y-2.5 text-xs">
                <div className="flex justify-between items-center font-mono text-[11px]">
                  <span>Kupní cena auta: <strong>{formatCzechNumber(carPurchasePrice)} Kč</strong></span>
                  <span>Základ hypotéky ({downPaymentPercent} %): <strong>{formatCzechNumber(mortgage.downPaymentCzk)} Kč</strong></span>
                </div>

                <div className="w-full bg-white rounded-full h-3 border border-hairline overflow-hidden p-0.5">
                  <div
                    className="bg-price-tier1 h-full rounded-full transition-all duration-500"
                    style={{ width: `${downPaymentCoveragePct}%` }}
                  />
                </div>

                <p className="text-ink/85 leading-relaxed">
                  {carPurchasePrice < mortgage.downPaymentCzk ? (
                    <>
                      Místo koupě ojetiny za <strong>{formatCzechNumber(carPurchasePrice)} Kč</strong> pokryjete hned{' '}
                      <strong>{downPaymentCoveragePct} %</strong> potřebných vlastních zdrojů a zbytek ({formatCzechNumber(remainingDownPayment)} Kč) našetříte díky provozní úspoře za cca{' '}
                      <strong className="text-price-tier1">{yearsToSaveRest} roku</strong>.
                    </>
                  ) : (
                    <>
                      Cena vozu (<strong>{formatCzechNumber(carPurchasePrice)} Kč</strong>) pokryje kompletní {downPaymentPercent}% základ hypotéky ({formatCzechNumber(mortgage.downPaymentCzk)} Kč).
                    </>
                  )}
                </p>

                <div className="pt-2 border-t border-hairline flex items-center gap-2 text-[11px] text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>Pozor na úvěr/operák:</strong> splátka 5 000 Kč/měs. snižuje maximální dostupnou hypotéku v bance zhruba o 930 000 Kč.
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
