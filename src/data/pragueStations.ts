import { PragueStationId, PragueTargetMode } from '../types';

export { type PragueStationId, type PragueTargetMode };

export interface PragueStation {
  id: PragueStationId;
  name: string;
  shortName: string;
  coords: [number, number];
  mhdNote: string;
  isDefault?: boolean;
  isCorridorEntry?: boolean;
}

export const PRAGUE_STATIONS: Record<PragueStationId, PragueStation> = {
  hln: {
    id: 'hln',
    name: 'Praha hl.n.',
    shortName: 'hl.n.',
    coords: [50.0831, 14.4353],
    mhdNote: 'Metro C · centrum',
    isDefault: true,
  },
  masarykovo: {
    id: 'masarykovo',
    name: 'Praha Masarykovo n.',
    shortName: 'Masarykovo n.',
    coords: [50.0880, 14.4326],
    mhdNote: 'Metro B Nám. Republiky',
  },
  smichov: {
    id: 'smichov',
    name: 'Praha-Smíchov',
    shortName: 'Smíchov',
    coords: [50.0616, 14.4086],
    mhdNote: 'Metro B · Anděl',
    isCorridorEntry: true,
  },
  podbaba: {
    id: 'podbaba',
    name: 'Praha-Podbaba',
    shortName: 'Podbaba',
    coords: [50.1112, 14.3935],
    mhdNote: 'Tram · Dejvice / Praha 6',
    isCorridorEntry: true,
  },
  holesovice: {
    id: 'holesovice',
    name: 'Praha-Holešovice',
    shortName: 'Holešovice',
    coords: [50.1099, 14.4399],
    mhdNote: 'Metro C · Praha 7',
  },
  liben: {
    id: 'liben',
    name: 'Praha-Libeň',
    shortName: 'Libeň',
    coords: [50.1008, 14.4998],
    mhdNote: 'Tram · Vysočany / Karlín',
    isCorridorEntry: true,
  },
  vysocany: {
    id: 'vysocany',
    name: 'Praha-Vysočany',
    shortName: 'Vysočany',
    coords: [50.1116, 14.4969],
    mhdNote: 'Metro B · Praha 9',
    isCorridorEntry: true,
  },
  vrsovice: {
    id: 'vrsovice',
    name: 'Praha-Vršovice',
    shortName: 'Vršovice',
    coords: [50.0663, 14.4465],
    mhdNote: 'Tram · Praha 10 / Vinohrady',
    isCorridorEntry: true,
  },
  veleslavin: {
    id: 'veleslavin',
    name: 'Praha-Veleslavín',
    shortName: 'Veleslavín',
    coords: [50.0958, 14.3474],
    mhdNote: 'Metro A · letiště / Praha 6',
    isCorridorEntry: true,
  },
};

export const PRAGUE_STATION_IDS: PragueStationId[] = [
  'hln',
  'masarykovo',
  'smichov',
  'podbaba',
  'holesovice',
  'liben',
  'vysocany',
  'vrsovice',
  'veleslavin',
];

/**
 * Realistic symmetric transfer matrix between Prague railway hubs in minutes
 * (includes rail travel or Metro/Tram ride + typical walking/transfer buffer).
 */
export const PRAGUE_TRANSFER_MIN: Record<PragueStationId, Record<PragueStationId, number>> = {
  hln: {
    hln: 0,
    masarykovo: 6,
    smichov: 12,
    podbaba: 16,
    holesovice: 12,
    liben: 11,
    vysocany: 14,
    vrsovice: 8,
    veleslavin: 20,
  },
  masarykovo: {
    hln: 6,
    masarykovo: 0,
    smichov: 14,
    podbaba: 13,
    holesovice: 12,
    liben: 8,
    vysocany: 9,
    vrsovice: 14,
    veleslavin: 16,
  },
  smichov: {
    hln: 12,
    masarykovo: 14,
    smichov: 0,
    podbaba: 24,
    holesovice: 18,
    liben: 17,
    vysocany: 20,
    vrsovice: 12,
    veleslavin: 22,
  },
  podbaba: {
    hln: 16,
    masarykovo: 13,
    smichov: 24,
    podbaba: 0,
    holesovice: 8,
    liben: 18,
    vysocany: 18,
    vrsovice: 24,
    veleslavin: 14,
  },
  holesovice: {
    hln: 12,
    masarykovo: 12,
    smichov: 18,
    podbaba: 8,
    holesovice: 0,
    liben: 10,
    vysocany: 12,
    vrsovice: 16,
    veleslavin: 22,
  },
  liben: {
    hln: 11,
    masarykovo: 8,
    smichov: 17,
    podbaba: 18,
    holesovice: 10,
    liben: 0,
    vysocany: 8,
    vrsovice: 15,
    veleslavin: 24,
  },
  vysocany: {
    hln: 14,
    masarykovo: 9,
    smichov: 20,
    podbaba: 18,
    holesovice: 12,
    liben: 8,
    vysocany: 0,
    vrsovice: 18,
    veleslavin: 25,
  },
  vrsovice: {
    hln: 8,
    masarykovo: 14,
    smichov: 12,
    podbaba: 24,
    holesovice: 16,
    liben: 15,
    vysocany: 18,
    vrsovice: 0,
    veleslavin: 22,
  },
  veleslavin: {
    hln: 20,
    masarykovo: 16,
    smichov: 22,
    podbaba: 14,
    holesovice: 22,
    liben: 24,
    vysocany: 25,
    vrsovice: 22,
    veleslavin: 0,
  },
};
