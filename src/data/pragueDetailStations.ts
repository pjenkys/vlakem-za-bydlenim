import { Station, TrainConnection } from '../types';

function conn(
  terminus: string,
  durationMin: number,
  peakTrainsPerHour: number,
  dailyTrains: number,
  firstTrainToHub: string,
  lastTrainFromHub: string,
  isDirect: boolean = true,
  carriers: string[] = ['ČD']
): TrainConnection {
  return {
    terminus,
    durationMin,
    peakTrainsPerHour,
    dailyTrains,
    firstTrainToHub,
    lastTrainFromHub,
    isDirect,
    carriers,
  };
}

/**
 * 32 Intermediate corridor commuter stations around Prague for "Detailní mapa".
 * All marked with isDetailOnly: true.
 */
export const PRAGUE_DETAIL_STATIONS: Station[] = [
  // ==========================================
  // NORTH CORRIDOR 090 (R20 / S4)
  // ==========================================
  {
    id: 'bohusovice-nad-ohri',
    name: 'Bohušovice nad Ohří',
    region: 'Ústecký kraj',
    coords: [50.4925, 14.1528],
    buyPricePerSqm: 54000,
    rentPricePerSqm: 190,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 62, 1, 24, '04:42', '23:41', true, ['ČD']),
    },
  },
  {
    id: 'hnevice',
    name: 'Hněvice',
    region: 'Ústecký kraj',
    coords: [50.4533, 14.3644],
    buyPricePerSqm: 52000,
    rentPricePerSqm: 180,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 45, 2, 34, '04:54', '23:41', true, ['ČD']),
    },
  },
  {
    id: 'vranany',
    name: 'Vraňany',
    region: 'Středočeský kraj',
    coords: [50.3150, 14.3589],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 230,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 35, 2, 38, '04:38', '00:15', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'libcice-nad-vltavou',
    name: 'Libčice nad Vltavou',
    region: 'Středočeský kraj',
    coords: [50.1983, 14.3683],
    buyPricePerSqm: 96000,
    rentPricePerSqm: 310,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 21, 4, 58, '04:30', '00:20', true, ['ČD', 'PID']),
    },
  },

  // ==========================================
  // EAST CORRIDOR 011 (S1 / R)
  // ==========================================
  {
    id: 'poricany',
    name: 'Poříčany',
    region: 'Středočeský kraj',
    coords: [50.1067, 14.9211],
    buyPricePerSqm: 84000,
    rentPricePerSqm: 270,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 41, 2, 42, '04:25', '00:20', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'pecky',
    name: 'Pečky',
    region: 'Středočeský kraj',
    coords: [50.0883, 15.0347],
    buyPricePerSqm: 78000,
    rentPricePerSqm: 250,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 46, 2, 42, '04:20', '00:20', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'velim',
    name: 'Velim',
    region: 'Středočeský kraj',
    coords: [50.0578, 15.1056],
    buyPricePerSqm: 74000,
    rentPricePerSqm: 240,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 53, 2, 40, '04:15', '00:20', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'prelouc',
    name: 'Přelouč',
    region: 'Pardubický kraj',
    coords: [50.0408, 15.5786],
    buyPricePerSqm: 76000,
    rentPricePerSqm: 245,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 69, 2, 36, '04:45', '23:15', true, ['ČD', 'RegioJet']),
    },
  },

  // ==========================================
  // NORTHEAST CORRIDOR 231 & 070 (S2 / S3 / R10 / R21)
  // ==========================================
  {
    id: 'mstetice',
    name: 'Mstětice',
    region: 'Středočeský kraj',
    coords: [50.1342, 14.6986],
    buyPricePerSqm: 105000,
    rentPricePerSqm: 330,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 22, 2, 46, '04:40', '00:10', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'milovice',
    name: 'Milovice',
    region: 'Středočeský kraj',
    coords: [50.2247, 14.8872],
    buyPricePerSqm: 85000,
    rentPricePerSqm: 275,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 47, 2, 44, '04:30', '00:10', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'neratovice',
    name: 'Neratovice',
    region: 'Středočeský kraj',
    coords: [50.2592, 14.5161],
    buyPricePerSqm: 86000,
    rentPricePerSqm: 280,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 36, 2, 42, '04:35', '23:45', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'vsetaty',
    name: 'Všetaty',
    region: 'Středočeský kraj',
    coords: [50.2828, 14.5881],
    buyPricePerSqm: 79000,
    rentPricePerSqm: 255,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 41, 2, 38, '04:30', '23:45', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'velky-osek',
    name: 'Velký Osek',
    region: 'Středočeský kraj',
    coords: [50.0983, 15.1883],
    buyPricePerSqm: 73000,
    rentPricePerSqm: 235,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 61, 2, 36, '04:40', '23:10', true, ['ČD']),
    },
  },
  {
    id: 'chlumec-nad-cidlinou',
    name: 'Chlumec nad Cidlinou',
    region: 'Královéhradecký kraj',
    coords: [50.1558, 15.4542],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 220,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 77, 1, 24, '04:50', '22:50', true, ['ČD']),
    },
  },

  // ==========================================
  // SOUTHEAST CORRIDOR 221 (S9 / R17)
  // ==========================================
  {
    id: 'strancice',
    name: 'Strančice',
    region: 'Středočeský kraj',
    coords: [49.9483, 14.6789],
    buyPricePerSqm: 104000,
    rentPricePerSqm: 325,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 30, 4, 56, '04:25', '00:25', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'senohraby',
    name: 'Senohraby',
    region: 'Středočeský kraj',
    coords: [49.8911, 14.7214],
    buyPricePerSqm: 95000,
    rentPricePerSqm: 300,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 37, 2, 44, '04:30', '00:25', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'cercany',
    name: 'Čerčany',
    region: 'Středočeský kraj',
    coords: [49.8519, 14.7042],
    buyPricePerSqm: 86000,
    rentPricePerSqm: 275,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 43, 2, 46, '04:25', '00:25', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'bystrice-u-benesova',
    name: 'Bystřice u Benešova',
    region: 'Středočeský kraj',
    coords: [49.7347, 14.6736],
    buyPricePerSqm: 79000,
    rentPricePerSqm: 255,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 52, 2, 34, '04:45', '23:25', true, ['ČD']),
    },
  },
  {
    id: 'olbramovice',
    name: 'Olbramovice',
    region: 'Středočeský kraj',
    coords: [49.6789, 14.6347],
    buyPricePerSqm: 72000,
    rentPricePerSqm: 235,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 55, 1, 26, '04:50', '23:25', true, ['ČD']),
    },
  },
  {
    id: 'veseli-nad-luznici',
    name: 'Veselí nad Lužnicí',
    region: 'Jihočeský kraj',
    coords: [49.1836, 14.6978],
    buyPricePerSqm: 64000,
    rentPricePerSqm: 210,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 89, 1, 24, '05:00', '22:30', true, ['ČD']),
    },
  },

  // ==========================================
  // SOUTHWEST CORRIDOR 171 (S7 / R16)
  // ==========================================
  {
    id: 'dobrichovice',
    name: 'Dobřichovice',
    region: 'Středočeský kraj',
    coords: [49.9272, 14.2889],
    buyPricePerSqm: 116000,
    rentPricePerSqm: 350,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 26, 4, 58, '04:30', '00:18', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'revnice',
    name: 'Řevnice',
    region: 'Středočeský kraj',
    coords: [49.9144, 14.2389],
    buyPricePerSqm: 106000,
    rentPricePerSqm: 325,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 30, 4, 58, '04:26', '00:18', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'zadni-treban',
    name: 'Zadní Třebaň',
    region: 'Středočeský kraj',
    coords: [49.9172, 14.2044],
    buyPricePerSqm: 96000,
    rentPricePerSqm: 295,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 34, 2, 46, '04:30', '00:18', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'karlstejn',
    name: 'Karlštejn',
    region: 'Středočeský kraj',
    coords: [49.9333, 14.1750],
    buyPricePerSqm: 94000,
    rentPricePerSqm: 290,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 37, 2, 46, '04:35', '00:18', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'zdice',
    name: 'Zdice',
    region: 'Středočeský kraj',
    coords: [49.9094, 13.9772],
    buyPricePerSqm: 74000,
    rentPricePerSqm: 240,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 48, 2, 38, '04:45', '23:45', true, ['ČD']),
    },
  },
  {
    id: 'karez',
    name: 'Kařez',
    region: 'Plzeňský kraj',
    coords: [49.8319, 13.7936],
    buyPricePerSqm: 66000,
    rentPricePerSqm: 215,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 60, 1, 26, '04:55', '23:15', true, ['ČD']),
    },
  },

  // ==========================================
  // WEST CORRIDOR 120 (S5 / R24)
  // ==========================================
  {
    id: 'hostivice',
    name: 'Hostivice',
    region: 'Středočeský kraj',
    coords: [50.0789, 14.2575],
    buyPricePerSqm: 118000,
    rentPricePerSqm: 355,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 27, 3, 48, '04:35', '23:45', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'unhost',
    name: 'Unhošť',
    region: 'Středočeský kraj',
    coords: [50.1114, 14.1481],
    buyPricePerSqm: 92000,
    rentPricePerSqm: 285,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 36, 2, 40, '04:40', '23:45', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'stochov',
    name: 'Stochov',
    region: 'Středočeský kraj',
    coords: [50.1500, 13.9639],
    buyPricePerSqm: 66000,
    rentPricePerSqm: 215,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 58, 1, 24, '04:50', '22:45', true, ['ČD']),
    },
  },
  {
    id: 'nove-straseci',
    name: 'Nové Strašecí',
    region: 'Středočeský kraj',
    coords: [50.1603, 13.9056],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 220,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha Masarykovo n.', 63, 1, 24, '04:45', '22:45', true, ['ČD']),
    },
  },

  // ==========================================
  // SOUTH CORRIDOR 210 (S8)
  // ==========================================
  {
    id: 'vrane-nad-vltavou',
    name: 'Vrané nad Vltavou',
    region: 'Středočeský kraj',
    coords: [49.9392, 14.3853],
    buyPricePerSqm: 104000,
    rentPricePerSqm: 320,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 26, 2, 42, '04:40', '00:15', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'davle',
    name: 'Davle',
    region: 'Středočeský kraj',
    coords: [49.8886, 14.3986],
    buyPricePerSqm: 90000,
    rentPricePerSqm: 280,
    isDetailOnly: true,
    connections: {
      praha: conn('Praha hl.n.', 37, 2, 36, '04:35', '00:15', true, ['ČD', 'PID']),
    },
  },
];
