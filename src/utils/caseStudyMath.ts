export interface CommuteCalculationResult {
  tripsPerWeek: number;
  weeksPerYear: number;
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
 */
export function calculateCommutingCosts(
  tripsPerWeek: number,
  weeksPerYear: number = 46,
  in100Optimized: boolean = true
): CommuteCalculationResult {
  const in50CardAnnual = 3200;
  const in50ReturnTicket = 169;
  const in100FixedAnnual = 22000;
  const in100Monthly = Math.round(in100FixedAnnual / 12);

  const in50AnnualCost = in50CardAnnual + tripsPerWeek * weeksPerYear * in50ReturnTicket;
  const in50MonthlyCost = Math.round(in50AnnualCost / 12);

  const shouldRecommendIn100 = in50AnnualCost > in100FixedAnnual;
  const annualSavingsWithIn100 = Math.max(0, in50AnnualCost - in100FixedAnnual);

  let effectiveAnnualCost = in50AnnualCost;
  if (in100Optimized && shouldRecommendIn100) {
    effectiveAnnualCost = in100FixedAnnual;
  }
  const effectiveMonthlyCost = Math.round(effectiveAnnualCost / 12);

  const breakEvenTable = [1, 2, 3, 4, 5, 6, 7].map((trips) => {
    const cost50 = in50CardAnnual + trips * weeksPerYear * in50ReturnTicket;
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
 */
export function calculateMortgageDetails(
  purchasePrice: number,
  downPaymentPercent: number = 10,
  interestRateAnnual: number = 4.7,
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
 * Calculates § 15 ZDP mortgage interest tax refund:
 * Capped at 150 000 Kč/year interest, 15% income tax rate, monthly equivalent.
 */
export function calculateMortgageTaxRefundMonthly(annualInterestPaid: number): {
  annualRefund: number;
  monthlyRefund: number;
  isCapped: boolean;
} {
  const cap = 150000;
  const isCapped = annualInterestPaid > cap;
  const deductibleInterest = Math.min(annualInterestPaid, cap);
  const annualRefund = Math.round(deductibleInterest * 0.15);
  const monthlyRefund = Math.round(annualRefund / 12);

  return {
    annualRefund,
    monthlyRefund,
    isCapped,
  };
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
