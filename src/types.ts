export type HubId = 'praha' | 'brno' | 'plzen' | 'ostrava';

export type HousingMode = 'buy' | 'rent';

export type ApartmentSize = 30 | 45 | 70;

export interface ApartmentSizeConfig {
  size: ApartmentSize;
  layout: string;
  label: string;
  shortLabel: string;
}

export const APARTMENT_SIZES: ApartmentSizeConfig[] = [
  { size: 30, layout: '1+kk', label: '1+kk (30 m²)', shortLabel: '1+kk' },
  { size: 45, layout: '2+kk', label: '2+kk (45 m²)', shortLabel: '2+kk' },
  { size: 70, layout: '3+kk', label: '3+kk (70 m²)', shortLabel: '3+kk' },
];

export const APARTMENT_SIZE_MAP: Record<ApartmentSize, ApartmentSizeConfig> = {
  30: APARTMENT_SIZES[0],
  45: APARTMENT_SIZES[1],
  70: APARTMENT_SIZES[2],
};

export type FrequencyFilter = 'all' | '1h' | '2h' | '4h';

export type LastTrainFilter = 'any' | 'after21' | 'after22' | 'after23';

export type SortOption = 'value' | 'price' | 'time' | 'savings';

export type PriceBySize = Record<ApartmentSize, number>;

export interface HubInfo {
  id: HubId;
  label: string;
  toLabel: string;
  fromLabel: string;
  vsLabel: string;
  stationName: string;
  coords: [number, number];
  baselineBuyPrice: number;
  baselineRentPrice: number;
  baselineBuyPriceBySize: PriceBySize;
  baselineRentPriceBySize: PriceBySize;
}

export interface TrainConnection {
  terminus: string;
  durationMin: number;
  peakTrainsPerHour: number;
  dailyTrains: number;
  firstTrainToHub: string;
  lastTrainFromHub: string;
  isDirect: boolean;
  carriers: string[];
}

export type PragueStationId =
  | 'hln'
  | 'masarykovo'
  | 'smichov'
  | 'podbaba'
  | 'holesovice'
  | 'liben'
  | 'vysocany'
  | 'vrsovice'
  | 'veleslavin';

export type PragueTargetMode = 'first' | PragueStationId;

export interface Station {
  id: string;
  name: string;
  region: string;
  coords: [number, number];
  buyPricePerSqm: number;
  rentPricePerSqm: number;
  buyPriceBySize?: PriceBySize;
  rentPriceBySize?: PriceBySize;
  connections: Partial<Record<HubId, TrainConnection>>;
  isDetailOnly?: boolean;
}

export interface Listing {
  id: string;
  title: string;
  layout: string;
  areaSqm: number;
  price: number;
  pricePerSqm: number;
  walkingMinutes: number;
  condition: string;
  mode: HousingMode;
}

export interface FilterState {
  maxDurationMin: number;
  minFrequency: FrequencyFilter;
  lastTrain: LastTrainFilter;
  maxBuyPrice: number;
  maxRentPrice: number;
  directOnly: boolean;
  sort: SortOption;
}

export interface StationCalculatedMetrics {
  connection: TrainConnection;
  pricePerSqm: number;
  totalApartmentPrice: number;
  priceDifference: number; // positive = savings compared to hub, negative = premium/more expensive
  isCheaper: boolean;
  valueScore: number;
  colorHex: string;
  monthlyMortgage?: number;
  hubMonthlyMortgage?: number;
  mortgageDifference?: number;
}
