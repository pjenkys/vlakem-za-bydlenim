export type HubId = 'praha' | 'brno' | 'plzen' | 'ostrava';

export type HousingMode = 'buy' | 'rent';

export type ApartmentSize = 45 | 65 | 85;

export type FrequencyFilter = 'all' | '1h' | '2h' | '4h';

export type LastTrainFilter = 'any' | 'after21' | 'after22' | 'after23';

export type SortOption = 'value' | 'price' | 'time' | 'savings';

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

export interface Station {
  id: string;
  name: string;
  region: string;
  coords: [number, number];
  buyPricePerSqm: number;
  rentPricePerSqm: number;
  connections: Partial<Record<HubId, TrainConnection>>;
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
