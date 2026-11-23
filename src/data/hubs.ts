import { HubId, HubInfo } from '../types';

export const HUBS: Record<HubId, HubInfo> = {
  praha: {
    id: 'praha',
    label: 'Praha',
    toLabel: 'do Prahy',
    fromLabel: 'z Prahy',
    vsLabel: 'oproti Praze',
    stationName: 'Praha hl.n.',
    coords: [50.0831, 14.4353],
    baselineBuyPrice: 145000,
    baselineRentPrice: 415,
  },
  brno: {
    id: 'brno',
    label: 'Brno',
    toLabel: 'do Brna',
    fromLabel: 'z Brna',
    vsLabel: 'oproti Brnu',
    stationName: 'Brno hl.n.',
    coords: [49.1906, 16.6128],
    baselineBuyPrice: 122000,
    baselineRentPrice: 365,
  },
  plzen: {
    id: 'plzen',
    label: 'Plzeň',
    toLabel: 'do Plzně',
    fromLabel: 'z Plzně',
    vsLabel: 'oproti Plzni',
    stationName: 'Plzeň hl.n.',
    coords: [49.7436, 13.3883],
    baselineBuyPrice: 92000,
    baselineRentPrice: 295,
  },
  ostrava: {
    id: 'ostrava',
    label: 'Ostrava',
    toLabel: 'do Ostravy',
    fromLabel: 'z Ostravy',
    vsLabel: 'oproti Ostravě',
    stationName: 'Ostrava hl.n.',
    coords: [49.8511, 18.2673],
    baselineBuyPrice: 62000,
    baselineRentPrice: 225,
  },
};

export const HUB_IDS: HubId[] = ['praha', 'brno', 'plzen', 'ostrava'];
