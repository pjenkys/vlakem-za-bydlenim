import { HousingMode, HubInfo, Station, TrainConnection, StationCalculatedMetrics } from '../types';

export const PRICE_TIERS = [
  {
    hex: '#157A5B',
    name: 'Hluboký smaragd',
    buyLabel: '< 55 tis. Kč/m²',
    rentLabel: '< 210 Kč/m²',
    buyMax: 54999,
    rentMax: 209,
  },
  {
    hex: '#47A87D',
    name: 'Šalvějová zeleň',
    buyLabel: '55 – 75 tis. Kč/m²',
    rentLabel: '210 – 259 Kč/m²',
    buyMax: 74999,
    rentMax: 259,
  },
  {
    hex: '#D9822B',
    name: 'Jantarová / Okr',
    buyLabel: '75 – 95 tis. Kč/m²',
    rentLabel: '260 – 309 Kč/m²',
    buyMax: 94999,
    rentMax: 309,
  },
  {
    hex: '#D1493F',
    name: 'Terakota',
    buyLabel: '95 – 120 tis. Kč/m²',
    rentLabel: '310 – 369 Kč/m²',
    buyMax: 119999,
    rentMax: 369,
  },
  {
    hex: '#8E1C2E',
    name: 'Burgundská červeň',
    buyLabel: '≥ 120 tis. Kč/m²',
    rentLabel: '≥ 370 Kč/m²',
    buyMax: Infinity,
    rentMax: Infinity,
  },
];

/**
 * Returns the semantic hex color for a given price per m2 according to the 5-step scale.
 */
export function getPriceColor(pricePerSqm: number, mode: HousingMode): string {
  if (mode === 'buy') {
    if (pricePerSqm < 55000) return '#157A5B';
    if (pricePerSqm < 75000) return '#47A87D';
    if (pricePerSqm < 95000) return '#D9822B';
    if (pricePerSqm < 120000) return '#D1493F';
    return '#8E1C2E';
  } else {
    if (pricePerSqm < 210) return '#157A5B';
    if (pricePerSqm < 260) return '#47A87D';
    if (pricePerSqm < 310) return '#D9822B';
    if (pricePerSqm < 370) return '#D1493F';
    return '#8E1C2E';
  }
}

/**
 * Parses time string like "23:12" or "00:15" into minutes from start of day.
 * Post-midnight times (00:00 - 03:59) are mapped to 24:00 - 27:59 (1440 - 1679 minutes)
 * so that a return train at 00:15 is recognized as departing after 23:00.
 */
export function parseTrainTimeInMinutes(timeStr: string): number {
  const [hStr, mStr] = timeStr.trim().split(':');
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10) || 0;

  if (hours >= 0 && hours < 4) {
    hours += 24;
  }
  return hours * 60 + minutes;
}

/**
 * Calculates monthly mortgage payment:
 * 80% LTV, 4.99% p.a., 30 years (360 months)
 */
export function calculateMortgageMonthly(propertyPrice: number): number {
  const principal = propertyPrice * 0.8;
  const annualRate = 0.0499;
  const monthlyRate = annualRate / 12;
  const totalMonths = 360;

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.round(payment);
}

/**
 * Calculates all metrics for a station connected to the active hub.
 */
export function calculateStationMetrics(
  station: Station,
  connection: TrainConnection,
  hub: HubInfo,
  mode: HousingMode,
  sizeSqm: number
): StationCalculatedMetrics {
  const pricePerSqm = mode === 'buy' ? station.buyPricePerSqm : station.rentPricePerSqm;
  const hubBaselinePricePerSqm = mode === 'buy' ? hub.baselineBuyPrice : hub.baselineRentPrice;

  const totalApartmentPrice = pricePerSqm * sizeSqm;
  const hubTotalApartmentPrice = hubBaselinePricePerSqm * sizeSqm;

  const priceDifference = hubTotalApartmentPrice - totalApartmentPrice;
  const isCheaper = priceDifference >= 0;

  // Deterministic value score formula:
  // ((1 - price / hubBaselinePrice) * 100) - (durationMin * 0.45) + Math.min(peakTrainsPerHour, 4) * 4
  const valueScore =
    (1 - pricePerSqm / hubBaselinePricePerSqm) * 100 -
    connection.durationMin * 0.45 +
    Math.min(connection.peakTrainsPerHour, 4) * 4;

  const colorHex = getPriceColor(pricePerSqm, mode);

  if (mode === 'buy') {
    const monthlyMortgage = calculateMortgageMonthly(totalApartmentPrice);
    const hubMonthlyMortgage = calculateMortgageMonthly(hubTotalApartmentPrice);
    const mortgageDifference = hubMonthlyMortgage - monthlyMortgage;

    return {
      connection,
      pricePerSqm,
      totalApartmentPrice,
      priceDifference,
      isCheaper,
      valueScore,
      colorHex,
      monthlyMortgage,
      hubMonthlyMortgage,
      mortgageDifference,
    };
  }

  return {
    connection,
    pricePerSqm,
    totalApartmentPrice,
    priceDifference,
    isCheaper,
    valueScore,
    colorHex,
  };
}

/**
 * Czech number formatters with non-breaking spaces
 */
export function formatCzechNumber(num: number): string {
  return Math.round(num).toLocaleString('cs-CZ').replace(/\s/g, ' ');
}

export function formatPriceDiffBadge(
  diff: number,
  mode: HousingMode
): { label: string; isPositive: boolean } {
  const isPositive = diff >= 0;
  const absDiff = Math.abs(diff);

  if (mode === 'buy') {
    const inMillions = absDiff / 1_000_000;
    const formatted = inMillions.toFixed(1).replace('.', ',');
    if (isPositive) {
      return {
        label: `Úspora ${formatted} mil. Kč`,
        isPositive: true,
      };
    } else {
      return {
        label: `+${formatted} mil. Kč dražší`,
        isPositive: false,
      };
    }
  } else {
    const formatted = formatCzechNumber(absDiff);
    if (isPositive) {
      return {
        label: `Úspora ${formatted} Kč/měs.`,
        isPositive: true,
      };
    } else {
      return {
        label: `+${formatted} Kč/měs. dražší`,
        isPositive: false,
      };
    }
  }
}
