export interface CommuteCalculationResult {
  tripsPerWeek: number;
  weeksPerYear: number;
  regularSingleTripCzk: number;
  regularReturnTripCzk: number;
  in50SingleTripCzk: number;
  in50ReturnTripCzk: number;
  in50AnnualCost: number;
  in50MonthlyCost: number;
  in100AnnualCost: number;
  in100MonthlyCost: number;
  shouldRecommendIn100: boolean;
  annualSavingsWithIn100: number;
  effectiveMonthlyCost: number;
  effectiveAnnualCost: number;
  breakEvenTable: {
    trips: number;
    in50Annual: number;
    in100Annual: number;
    recommended: 'IN 50' | 'IN 100';
    diff: number;
  }[];
}

export interface MortgageAmortizationDetails {
  loanAmount: number;
  downPaymentCzk: number;
  downPaymentPercent: number;
  interestRateAnnual: number;
  monthlyPayment: number;
  interestPaidYear1: number;
  principalPaidYear1: number;
  averageMonthlyPrincipalYear1: number;
  principalPaid36Months: number;
  remainingBalance36Months: number;
  // Year 4 / Refinanced 30-year loan
  refinancedMonthlyPayment: number;
  monthlyMortgagePaymentDrop: number;
  interestPaidYear4: number;
}

export interface EquityBuildingDetails {
  monthlyPrincipalRepaid: number;
  annualAppreciationPercent: number;
  annualAppreciationCzk: number;
  monthlyAppreciationCzk: number;
  totalMonthlyEquityCreated: number;
  totalAnnualEquityCreated: number;
}

export interface PragueComparisonDetails {
  apartmentAreaSqm: number;
  // Prague Buy
  praguePricePerSqm: number;
  praguePurchasePrice: number;
  pragueDownPayment10Percent: number;
  pragueMortgageMonthly: number;
  pragueOperatingCostsMonthly: number;
  pragueTaxRefundMonthly: number;
  pragueTotalMonthlyGross: number;
  pragueTotalMonthlyNet: number;
  // Prague Rent
  pragueRentPerSqm: number;
  praguePureRentMonthly: number;
  pragueRentOperatingCostsMonthly: number;
  pragueTotalRentMonthly: number;
  // Lovosice Own
  lovosicePurchasePrice: number;
  lovosiceDownPayment10Percent: number;
  lovosiceMortgageMonthly: number;
  // Differences
  purchasePriceSavingsCzk: number;
  downPaymentSavingsCzk: number;
  monthlyMortgageSavingsCzk: number;
  monthlyCashSavingsVsPragueRent: number;
}

export type CarPreset = 'older' | 'newer';

export interface CarProfile {
  id: CarPreset;
  name: string;
  shortLabel: string;
  carPurchasePrice: number;
  carDepreciationAnnual: number;
  carInsuranceAnnual: number;
  insuranceLabel: string;
  carMaintenanceAnnual: number;
  carFuelAnnual: number;
  carFeesAndParkingAnnual: number;
  totalCarCostAnnual: number;
  costPerKm: number;
}

export const CAR_PROFILES: Record<CarPreset, CarProfile> = {
  older: {
    id: 'older',
    name: 'Starší ojetina (150 tis. Kč)',
    shortLabel: 'Starší ojetina (150 tis. Kč)',
    carPurchasePrice: 150000,
    carDepreciationAnnual: 18000,
    carInsuranceAnnual: 8500,
    insuranceLabel: 'Povinné ručení + skla',
    carMaintenanceAnnual: 18500,
    carFuelAnnual: 31000,
    carFeesAndParkingAnnual: 4000,
    totalCarCostAnnual: 80000,
    costPerKm: 6.7,
  },
  newer: {
    id: 'newer',
    name: 'Zánovní ojetina (320 tis. Kč)',
    shortLabel: 'Zánovní ojetina (320 tis. Kč)',
    carPurchasePrice: 320000,
    carDepreciationAnnual: 38000,
    carInsuranceAnnual: 16000,
    insuranceLabel: 'Povinné + havarijní',
    carMaintenanceAnnual: 14000,
    carFuelAnnual: 31000,
    carFeesAndParkingAnnual: 5000,
    totalCarCostAnnual: 104000,
    costPerKm: 8.7,
  },
};

export interface CarFreeSavingsDetails {
  carPreset: CarPreset;
  carPurchasePrice: number;
  carDepreciationAnnual: number;
  carInsuranceAnnual: number;
  insuranceLabel: string;
  carMaintenanceAnnual: number;
  carFuelAnnual: number;
  carFeesAndParkingAnnual: number;
  totalCarCostAnnual: number;
  totalCarCostMonthly: number;
  costPerKm: number;
  trainPassIn100Annual: number;
  carsharingBackupAnnual: number;
  carFreeTransitCostAnnual: number;
  netCarFreeSavingsAnnual: number;
  netCarFreeSavingsMonthly: number;
}

export interface MonthlyExpensesBreakdown {
  mortgagePayment: number;
  hoaRepairFund: number;
  heatingAndHotWater: number;
  waterAndSewer: number;
  electricity: number;
  gas: number;
  hoaServicesAndAdmin: number;
  insurancePropertyAndHome: number;
  internetAndBroadcastFees: number;
  propertyTaxMonthly: number;
  apartmentMaintenanceReserve: number;
  trainCommuteMonthly: number;
  totalGrossExpenses: number;
}

export interface MonthlyIncomeBreakdown {
  mortgageTaxRefundMonthly: number;
  roomRentGross: number;
  roomRentTaxMonthly: number;
  roomRentNet: number;
  roomPureRent?: number;
  roommateUtilitiesShare?: number;
  roommateTotalPayment?: number;
  totalIncomeAndOffsets: number;
}

export interface ThreeYearProjectionResult {
  wage2026Net: number;
  wage2029Net: number;
  wageGrowthTotalPercent: number;
  operatingExpenses2026: number;
  operatingExpenses2029: number;
  grossExpenses2026: number;
  grossExpenses2029: number;
  netCost2026: number;
  netCost2029: number;
  wageShare2026Percent: number;
  wageShare2029Percent: number;
  wageShareDiffPoints: number;
  wageShareRelativeDropPercent: number;
  disposableIncome2026: number;
  disposableIncome2029: number;
}

/**
 * Calculates IN 50 vs. IN 100 rail commuting costs.
 * Regular single trip = 169 Kč. With IN 50 = 84.50 Kč (half price).
 * Full day commute (return trip) = 169 Kč with IN 50 (vs 338 Kč without card).
 */
export function calculateCommutingCosts(
  tripsPerWeek: number,
  weeksPerYear: number = 46,
  in100Optimized: boolean = true
): CommuteCalculationResult {
  const regularSingleTripCzk = 169;
  const regularReturnTripCzk = regularSingleTripCzk * 2; // 338 Kč
  const in50SingleTripCzk = 84.5; // Polovina běžného jízdného
  const in50ReturnTripCzk = 169;   // 84.50 * 2 = 169 Kč tam i zpět
  const in50CardAnnual = 3200;
  const in100FixedAnnual = 22000;
  const in100Monthly = Math.round(in100FixedAnnual / 12);

  const in50AnnualCost = in50CardAnnual + tripsPerWeek * weeksPerYear * in50ReturnTripCzk;
  const in50MonthlyCost = Math.round(in50AnnualCost / 12);

  const shouldRecommendIn100 = in50AnnualCost > in100FixedAnnual;
  const annualSavingsWithIn100 = Math.max(0, in50AnnualCost - in100FixedAnnual);

  let effectiveAnnualCost = in50AnnualCost;
  if (in100Optimized && shouldRecommendIn100) {
    effectiveAnnualCost = in100FixedAnnual;
  }
  const effectiveMonthlyCost = Math.round(effectiveAnnualCost / 12);

  const breakEvenTable = [1, 2, 3, 4, 5, 6, 7].map((trips) => {
    const cost50 = in50CardAnnual + trips * weeksPerYear * in50ReturnTripCzk;
    const is100Better = cost50 > in100FixedAnnual;
    return {
      trips,
      in50Annual: cost50,
      in100Annual: in100FixedAnnual,
      recommended: is100Better ? ('IN 100' as const) : ('IN 50' as const),
      diff: cost50 - in100FixedAnnual,
    };
  });

  return {
    tripsPerWeek,
    weeksPerYear,
    regularSingleTripCzk,
    regularReturnTripCzk,
    in50SingleTripCzk,
    in50ReturnTripCzk,
    in50AnnualCost,
    in50MonthlyCost,
    in100AnnualCost: in100FixedAnnual,
    in100MonthlyCost: in100Monthly,
    shouldRecommendIn100,
    annualSavingsWithIn100,
    effectiveMonthlyCost,
    effectiveAnnualCost,
    breakEvenTable,
  };
}

/**
 * Performs month-by-month mortgage amortization for initial 30 years and 3-year refinancing.
 * Default mortgage rate: 4.99% p.a.
 */
export function calculateMortgageDetails(
  purchasePrice: number,
  downPaymentPercent: number = 10,
  interestRateAnnual: number = 4.99,
  refinancingRateAnnual: number = 4.4,
  loanTermMonths: number = 360
): MortgageAmortizationDetails {
  const downPaymentCzk = Math.round((purchasePrice * downPaymentPercent) / 100);
  const loanAmount = purchasePrice - downPaymentCzk;

  const monthlyRate = (interestRateAnnual / 100) / 12;
  const monthlyPayment = Math.round(
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
  );

  let currentBalance = loanAmount;
  let interestPaidYear1 = 0;
  let principalPaidYear1 = 0;
  let principalPaid36Months = 0;

  for (let month = 1; month <= 36; month++) {
    const interest = currentBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    currentBalance -= principal;

    if (month <= 12) {
      interestPaidYear1 += interest;
      principalPaidYear1 += principal;
    }
    principalPaid36Months += principal;
  }

  const remainingBalance36Months = Math.max(0, Math.round(currentBalance));
  const averageMonthlyPrincipalYear1 = Math.round(principalPaidYear1 / 12);

  // 3-Year Refinancing back to a fresh 30 years (360 months)
  const refinancedMonthlyRate = (refinancingRateAnnual / 100) / 12;
  const refinancedMonthlyPayment = Math.round(
    (remainingBalance36Months *
      (refinancedMonthlyRate * Math.pow(1 + refinancedMonthlyRate, 360))) /
      (Math.pow(1 + refinancedMonthlyRate, 360) - 1)
  );

  const monthlyMortgagePaymentDrop = monthlyPayment - refinancedMonthlyPayment;

  // Year 4 interest (first year of refinanced mortgage)
  let refBalance = remainingBalance36Months;
  let interestPaidYear4 = 0;
  for (let m = 1; m <= 12; m++) {
    const interest = refBalance * refinancedMonthlyRate;
    const principal = refinancedMonthlyPayment - interest;
    refBalance -= principal;
    interestPaidYear4 += interest;
  }

  return {
    loanAmount,
    downPaymentCzk,
    downPaymentPercent,
    interestRateAnnual,
    monthlyPayment,
    interestPaidYear1: Math.round(interestPaidYear1),
    principalPaidYear1: Math.round(principalPaidYear1),
    averageMonthlyPrincipalYear1,
    principalPaid36Months: Math.round(principalPaid36Months),
    remainingBalance36Months,
    refinancedMonthlyPayment,
    monthlyMortgagePaymentDrop,
    interestPaidYear4: Math.round(interestPaidYear4),
  };
}

/**
 * Calculates building equity: principal repayment + property value appreciation.
 */
export function calculateEquityBuilding(
  purchasePrice: number,
  monthlyPrincipal: number,
  annualAppreciationPercent: number = 3.0
): EquityBuildingDetails {
  const annualAppreciationCzk = Math.round(purchasePrice * (annualAppreciationPercent / 100));
  const monthlyAppreciationCzk = Math.round(annualAppreciationCzk / 12);
  const totalMonthlyEquityCreated = monthlyPrincipal + monthlyAppreciationCzk;
  const totalAnnualEquityCreated = totalMonthlyEquityCreated * 12;

  return {
    monthlyPrincipalRepaid: monthlyPrincipal,
    annualAppreciationPercent,
    annualAppreciationCzk,
    monthlyAppreciationCzk,
    totalMonthlyEquityCreated,
    totalAnnualEquityCreated,
  };
}

/**
 * Calculates direct financial comparison between Lovosice 2+1 and the exact same 2+1 in Prague.
 */
export function calculatePragueComparison(
  apartmentAreaSqm: number = 53,
  lovosicePurchasePrice: number = 3190000,
  lovosiceNetMonthlyCost: number = 7800,
  interestRateAnnual: number = 4.99
): PragueComparisonDetails {
  const praguePricePerSqm = 145000;
  const praguePurchasePrice = apartmentAreaSqm * praguePricePerSqm; // 7 685 000 Kč
  const pragueDownPayment10Percent = Math.round(praguePurchasePrice * 0.1); // 768 500 Kč
  const pragueLoan = praguePurchasePrice - pragueDownPayment10Percent; // 6 916 500 Kč

  const monthlyRate = (interestRateAnnual / 100) / 12;
  const pragueMortgageMonthly = Math.round(
    (pragueLoan * (monthlyRate * Math.pow(1 + monthlyRate, 360))) /
      (Math.pow(1 + monthlyRate, 360) - 1)
  ); // ~37 080 Kč/měs.
  const pragueOperatingCostsMonthly = 5500;
  const pragueTaxRefundMonthly = 1875; // § 15 ZDP: strop 150 000 Kč úroků * 15 % / 12 měsíců
  const pragueTotalMonthlyGross = pragueMortgageMonthly + pragueOperatingCostsMonthly; // ~42 580 Kč/měs.
  const pragueTotalMonthlyNet = pragueTotalMonthlyGross - pragueTaxRefundMonthly; // ~40 705 Kč/měs.

  // Prague Rent
  const pragueRentPerSqm = 415;
  const praguePureRentMonthly = apartmentAreaSqm * pragueRentPerSqm; // ~21 995 Kč
  const pragueRentOperatingCostsMonthly = 5500;
  const pragueTotalRentMonthly = praguePureRentMonthly + pragueRentOperatingCostsMonthly; // ~27 495 Kč

  // Lovosice values
  const lovosiceDownPayment10Percent = Math.round(lovosicePurchasePrice * 0.1);
  const lovosiceLoan = lovosicePurchasePrice - lovosiceDownPayment10Percent;
  const lovosiceMortgageMonthly = Math.round(
    (lovosiceLoan * (monthlyRate * Math.pow(1 + monthlyRate, 360))) /
      (Math.pow(1 + monthlyRate, 360) - 1)
  );

  return {
    apartmentAreaSqm,
    praguePricePerSqm,
    praguePurchasePrice,
    pragueDownPayment10Percent,
    pragueMortgageMonthly,
    pragueOperatingCostsMonthly,
    pragueTaxRefundMonthly,
    pragueTotalMonthlyGross,
    pragueTotalMonthlyNet,
    pragueRentPerSqm,
    praguePureRentMonthly,
    pragueRentOperatingCostsMonthly,
    pragueTotalRentMonthly,
    lovosicePurchasePrice,
    lovosiceDownPayment10Percent,
    lovosiceMortgageMonthly,
    purchasePriceSavingsCzk: praguePurchasePrice - lovosicePurchasePrice,
    downPaymentSavingsCzk: pragueDownPayment10Percent - lovosiceDownPayment10Percent,
    monthlyMortgageSavingsCzk: pragueMortgageMonthly - lovosiceMortgageMonthly,
    monthlyCashSavingsVsPragueRent: pragueTotalRentMonthly - lovosiceNetMonthlyCost,
  };
}

/**
 * Calculates realistic annual car ownership savings vs. rail commuting.
 * Linked dynamically to the live annual rail commuting cost and chosen car preset.
 */
export function calculateCarFreeSavings(
  annualCommuteCost: number = 22000,
  carPreset: CarPreset = 'older'
): CarFreeSavingsDetails {
  const profile = CAR_PROFILES[carPreset] || CAR_PROFILES.older;
  const totalCarCostAnnual = profile.totalCarCostAnnual;
  const totalCarCostMonthly = Math.round(totalCarCostAnnual / 12);

  const carFreeTransitCostAnnual = annualCommuteCost;
  const netCarFreeSavingsAnnual = totalCarCostAnnual - carFreeTransitCostAnnual;
  const netCarFreeSavingsMonthly = Math.round(netCarFreeSavingsAnnual / 12);

  return {
    carPreset: profile.id,
    carPurchasePrice: profile.carPurchasePrice,
    carDepreciationAnnual: profile.carDepreciationAnnual,
    carInsuranceAnnual: profile.carInsuranceAnnual,
    insuranceLabel: profile.insuranceLabel,
    carMaintenanceAnnual: profile.carMaintenanceAnnual,
    carFuelAnnual: profile.carFuelAnnual,
    carFeesAndParkingAnnual: profile.carFeesAndParkingAnnual,
    totalCarCostAnnual,
    totalCarCostMonthly,
    costPerKm: profile.costPerKm,
    trainPassIn100Annual: annualCommuteCost,
    carsharingBackupAnnual: 0,
    carFreeTransitCostAnnual,
    netCarFreeSavingsAnnual,
    netCarFreeSavingsMonthly,
  };
}

/**
 * Calculates § 15 ZDP mortgage interest tax refund:
 * Capped at 150 000 Kč/year interest, 15% income tax rate, monthly equivalent.
 * When renting out part of apartment under § 9, ownerOccupiedRatio scales the deductible interest (e.g., 0.70).
 */
export function calculateMortgageTaxRefundMonthly(
  annualInterestPaid: number,
  ownerOccupiedRatio: number = 1.0
): {
  annualRefund: number;
  monthlyRefund: number;
  isCapped: boolean;
  effectiveDeductibleInterest: number;
  ownerOccupiedRatio: number;
} {
  const cap = 150000;
  const eligibleInterest = Math.round(annualInterestPaid * ownerOccupiedRatio);
  const isCapped = eligibleInterest > cap;
  const effectiveDeductibleInterest = Math.min(eligibleInterest, cap);
  const annualRefund = Math.round(effectiveDeductibleInterest * 0.15);
  const monthlyRefund = Math.round(annualRefund / 12);

  return {
    annualRefund,
    monthlyRefund,
    isCapped,
    effectiveDeductibleInterest,
    ownerOccupiedRatio,
  };
}

/**
 * Czech pluralization helper for days of the week:
 * 1 -> "1 den v týdnu"
 * 2, 3, 4 -> "2 dny v týdnu", "3 dny v týdnu", "4 dny v týdnu"
 * 5, 6, 7 -> "5 dní v týdnu", "6 dní v týdnu", "7 dní v týdnu"
 */
export function formatDaysCz(n: number): string {
  if (n === 1) return '1 den v týdnu';
  if (n >= 2 && n <= 4) return `${n} dny v týdnu`;
  return `${n} dní v týdnu`;
}

export function formatDaysCountCz(n: number): string {
  if (n === 1) return '1 den';
  if (n >= 2 && n <= 4) return `${n} dny`;
  return `${n} dní`;
}

/**
 * Calculates 3-year projection combining refinancing and wage growth.
 */
export function calculateThreeYearProjection(
  netWageNow: number,
  wageGrowthAnnualPercent: number,
  expensesNow: MonthlyExpensesBreakdown,
  incomesNow: MonthlyIncomeBreakdown,
  refinancedMortgagePayment: number,
  year4TaxRefundMonthly: number,
  operatingCostInflationAnnualPercent: number = 2.5
): ThreeYearProjectionResult {
  const wageMultiplier = Math.pow(1 + wageGrowthAnnualPercent / 100, 3);
  const costMultiplier = Math.pow(1 + operatingCostInflationAnnualPercent / 100, 3);

  const wage2026Net = netWageNow;
  const wage2029Net = Math.round(netWageNow * wageMultiplier);
  const wageGrowthTotalPercent = ((wageMultiplier - 1) * 100);

  // Operating expenses (excluding mortgage which gets refinanced, and train which is indexed or capped)
  const nonMortgageExpenses2026 =
    expensesNow.totalGrossExpenses - expensesNow.mortgagePayment;
  const nonMortgageExpenses2029 = Math.round(nonMortgageExpenses2026 * costMultiplier);

  const grossExpenses2026 = expensesNow.totalGrossExpenses;
  const grossExpenses2029 = refinancedMortgagePayment + nonMortgageExpenses2029;

  // Incomes 2029
  // Room rent also inflates with market
  const roomRentNet2029 = Math.round(incomesNow.roomRentNet * costMultiplier);
  const totalIncome2029 = year4TaxRefundMonthly + roomRentNet2029;

  const netCost2026 = grossExpenses2026 - incomesNow.totalIncomeAndOffsets;
  const netCost2029 = grossExpenses2029 - totalIncome2029;

  const wageShare2026Percent = (netCost2026 / wage2026Net) * 100;
  const wageShare2029Percent = (netCost2029 / wage2029Net) * 100;
  const wageShareDiffPoints = wageShare2029Percent - wageShare2026Percent;
  const wageShareRelativeDropPercent =
    ((wageShare2026Percent - wageShare2029Percent) / wageShare2026Percent) * 100;

  const disposableIncome2026 = wage2026Net - netCost2026;
  const disposableIncome2029 = wage2029Net - netCost2029;

  return {
    wage2026Net,
    wage2029Net,
    wageGrowthTotalPercent,
    operatingExpenses2026: nonMortgageExpenses2026,
    operatingExpenses2029: nonMortgageExpenses2029,
    grossExpenses2026,
    grossExpenses2029,
    netCost2026,
    netCost2029,
    wageShare2026Percent,
    wageShare2029Percent,
    wageShareDiffPoints,
    wageShareRelativeDropPercent,
    disposableIncome2026,
    disposableIncome2029,
  };
}
