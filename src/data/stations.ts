import { Station, TrainConnection } from '../types';
import { PRAGUE_DETAIL_STATIONS } from './pragueDetailStations';

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

const BASE_STATIONS: Station[] = [
  // ==========================================
  // 4 MAJOR HUBS (Connected to each other)
  // ==========================================
  {
    id: 'praha',
    name: 'Praha hl.n.',
    region: 'Hlavní město Praha',
    coords: [50.0831, 14.4353],
    buyPricePerSqm: 145000,
    rentPricePerSqm: 415,
    connections: {
      brno: conn('Brno hl.n.', 150, 2, 38, '04:50', '22:15', true, ['ČD', 'RegioJet']),
      plzen: conn('Plzeň hl.n.', 75, 2, 42, '05:15', '23:45', true, ['ČD']),
      ostrava: conn('Ostrava hl.n.', 195, 2, 36, '05:18', '21:50', true, ['ČD', 'RegioJet', 'Leo Express']),
    },
  },
  {
    id: 'brno',
    name: 'Brno hl.n.',
    region: 'Jihomoravský kraj',
    coords: [49.1906, 16.6128],
    buyPricePerSqm: 122000,
    rentPricePerSqm: 365,
    connections: {
      praha: conn('Praha hl.n.', 150, 2, 38, '04:30', '22:15', true, ['ČD', 'RegioJet']),
      ostrava: conn('Ostrava hl.n.', 120, 2, 32, '05:02', '22:02', true, ['ČD', 'RegioJet']),
      plzen: conn('Plzeň hl.n.', 220, 1, 16, '05:20', '19:40', false, ['ČD']),
    },
  },
  {
    id: 'plzen',
    name: 'Plzeň hl.n.',
    region: 'Plzeňský kraj',
    coords: [49.7436, 13.3883],
    buyPricePerSqm: 92000,
    rentPricePerSqm: 295,
    connections: {
      praha: conn('Praha hl.n.', 75, 2, 42, '04:45', '23:45', true, ['ČD']),
      brno: conn('Brno hl.n.', 220, 1, 16, '05:30', '19:25', false, ['ČD']),
    },
  },
  {
    id: 'ostrava',
    name: 'Ostrava hl.n.',
    region: 'Moravskoslezský kraj',
    coords: [49.8511, 18.2673],
    buyPricePerSqm: 62000,
    rentPricePerSqm: 225,
    connections: {
      praha: conn('Praha hl.n.', 195, 2, 36, '04:12', '21:50', true, ['ČD', 'RegioJet', 'Leo Express']),
      brno: conn('Brno hl.n.', 120, 2, 32, '04:40', '22:02', true, ['ČD', 'RegioJet']),
    },
  },

  // ==========================================
  // PRAGUE COMMUTER & CENTRAL BOHEMIA RING (21)
  // ==========================================
  {
    id: 'roztoky-u-prahy',
    name: 'Roztoky u Prahy',
    region: 'Středočeský kraj',
    coords: [50.1583, 14.3975],
    buyPricePerSqm: 126000,
    rentPricePerSqm: 375,
    connections: {
      praha: conn('Praha Masarykovo n.', 14, 4, 64, '04:22', '00:15', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'cernosice',
    name: 'Černošice',
    region: 'Středočeský kraj',
    coords: [49.9608, 14.3211],
    buyPricePerSqm: 122000,
    rentPricePerSqm: 360,
    connections: {
      praha: conn('Praha hl.n.', 18, 4, 60, '04:30', '00:18', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'uvaly',
    name: 'Úvaly',
    region: 'Středočeský kraj',
    coords: [50.0758, 14.7314],
    buyPricePerSqm: 108000,
    rentPricePerSqm: 330,
    connections: {
      praha: conn('Praha Masarykovo n.', 25, 4, 58, '04:35', '00:20', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'ricany',
    name: 'Říčany',
    region: 'Středočeský kraj',
    coords: [49.9933, 14.6547],
    buyPricePerSqm: 128000,
    rentPricePerSqm: 370,
    connections: {
      praha: conn('Praha hl.n.', 28, 4, 64, '04:20', '00:25', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'kralupy-nad-vltavou',
    name: 'Kralupy nad Vltavou',
    region: 'Středočeský kraj',
    coords: [50.2417, 14.3114],
    buyPricePerSqm: 82000,
    rentPricePerSqm: 275,
    connections: {
      praha: conn('Praha Masarykovo n.', 29, 3, 52, '04:15', '00:10', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'celakovice',
    name: 'Čelákovice',
    region: 'Středočeský kraj',
    coords: [50.1603, 14.7533],
    buyPricePerSqm: 95000,
    rentPricePerSqm: 295,
    connections: {
      praha: conn('Praha Masarykovo n.', 30, 3, 50, '04:25', '00:05', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'cesky-brod',
    name: 'Český Brod',
    region: 'Středočeský kraj',
    coords: [50.0744, 14.8622],
    buyPricePerSqm: 86000,
    rentPricePerSqm: 280,
    connections: {
      praha: conn('Praha Masarykovo n.', 34, 3, 48, '04:18', '23:55', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'kolin',
    name: 'Kolín',
    region: 'Středočeský kraj',
    coords: [50.0264, 15.2017],
    buyPricePerSqm: 76000,
    rentPricePerSqm: 255,
    connections: {
      praha: conn('Praha hl.n.', 42, 4, 72, '04:10', '00:30', true, ['ČD', 'PID', 'RegioJet', 'Leo Express']),
    },
  },
  {
    id: 'beroun',
    name: 'Beroun',
    region: 'Středočeský kraj',
    coords: [49.9572, 14.0744],
    buyPricePerSqm: 88000,
    rentPricePerSqm: 285,
    connections: {
      praha: conn('Praha hl.n.', 39, 3, 54, '04:15', '00:12', true, ['ČD', 'PID']),
      plzen: conn('Plzeň hl.n.', 38, 2, 34, '05:10', '23:30', true, ['ČD']),
    },
  },
  {
    id: 'benesov-u-prahy',
    name: 'Benešov u Prahy',
    region: 'Středočeský kraj',
    coords: [49.7789, 14.6872],
    buyPricePerSqm: 84000,
    rentPricePerSqm: 275,
    connections: {
      praha: conn('Praha hl.n.', 47, 2, 44, '04:05', '23:45', true, ['ČD', 'PID', 'Arriva']),
    },
  },
  {
    id: 'lysa-nad-labem',
    name: 'Lysá nad Labem',
    region: 'Středočeský kraj',
    coords: [50.2011, 14.8344],
    buyPricePerSqm: 83000,
    rentPricePerSqm: 270,
    connections: {
      praha: conn('Praha Masarykovo n.', 37, 3, 50, '04:20', '23:55', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'kladno',
    name: 'Kladno',
    region: 'Středočeský kraj',
    coords: [50.1344, 14.1039],
    buyPricePerSqm: 78000,
    rentPricePerSqm: 260,
    connections: {
      praha: conn('Praha-Bubny / Masarykovo', 42, 3, 46, '04:30', '23:40', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'nymburk',
    name: 'Nymburk',
    region: 'Středočeský kraj',
    coords: [50.1906, 15.0442],
    buyPricePerSqm: 75000,
    rentPricePerSqm: 250,
    connections: {
      praha: conn('Praha hl.n.', 46, 2, 42, '04:25', '23:35', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'podebrady',
    name: 'Poděbrady',
    region: 'Středočeský kraj',
    coords: [50.1472, 15.1231],
    buyPricePerSqm: 92000,
    rentPricePerSqm: 290,
    connections: {
      praha: conn('Praha hl.n.', 50, 2, 42, '04:30', '23:25', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'roudnice-nad-labem',
    name: 'Roudnice nad Labem',
    region: 'Ústecký kraj',
    coords: [50.4267, 14.2603],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 235,
    connections: {
      praha: conn('Praha hl.n.', 49, 2, 38, '04:35', '23:15', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'horovice',
    name: 'Hořovice',
    region: 'Středočeský kraj',
    coords: [49.8394, 13.9022],
    buyPricePerSqm: 74000,
    rentPricePerSqm: 245,
    connections: {
      praha: conn('Praha hl.n.', 52, 2, 36, '04:20', '23:20', true, ['ČD']),
      plzen: conn('Plzeň hl.n.', 26, 2, 34, '05:15', '23:40', true, ['ČD']),
    },
  },
  {
    id: 'kutna-hora',
    name: 'Kutná Hora hl.n.',
    region: 'Středočeský kraj',
    coords: [49.9575, 15.2958],
    buyPricePerSqm: 77000,
    rentPricePerSqm: 250,
    connections: {
      praha: conn('Praha hl.n.', 55, 2, 38, '04:30', '23:10', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'melnik',
    name: 'Mělník',
    region: 'Středočeský kraj',
    coords: [50.3547, 14.4842],
    buyPricePerSqm: 73000,
    rentPricePerSqm: 245,
    connections: {
      praha: conn('Praha hl.n.', 58, 1, 28, '04:40', '22:50', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'mlada-boleslav',
    name: 'Mladá Boleslav hl.n.',
    region: 'Středočeský kraj',
    coords: [50.4128, 14.8986],
    buyPricePerSqm: 79000,
    rentPricePerSqm: 265,
    connections: {
      praha: conn('Praha hl.n.', 68, 1, 26, '04:35', '22:30', true, ['ČD', 'Arriva']),
    },
  },
  {
    id: 'rakovnik',
    name: 'Rakovník',
    region: 'Středočeský kraj',
    coords: [50.1039, 13.7333],
    buyPricePerSqm: 62000,
    rentPricePerSqm: 220,
    connections: {
      praha: conn('Praha hl.n.', 78, 1, 22, '04:25', '21:55', true, ['ČD', 'PID']),
    },
  },
  {
    id: 'pribram',
    name: 'Příbram',
    region: 'Středočeský kraj',
    coords: [49.6897, 14.0044],
    buyPricePerSqm: 66000,
    rentPricePerSqm: 230,
    connections: {
      praha: conn('Praha hl.n.', 72, 1, 24, '04:30', '22:15', true, ['ČD', 'Arriva']),
    },
  },

  // ==========================================
  // NORTH & NORTHWEST BOHEMIA (11)
  // ==========================================
  {
    id: 'lovosice',
    name: 'Lovosice',
    region: 'Ústecký kraj',
    coords: [50.5147, 14.0536],
    buyPricePerSqm: 54000,
    rentPricePerSqm: 205,
    connections: {
      praha: conn('Praha hl.n.', 58, 2, 36, '04:45', '22:55', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'litomerice-mesto',
    name: 'Litoměřice město',
    region: 'Ústecký kraj',
    coords: [50.5336, 14.1356],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 235,
    connections: {
      praha: conn('Praha hl.n.', 72, 1, 24, '04:35', '22:10', true, ['ČD']),
    },
  },
  {
    id: 'usti-nad-labem',
    name: 'Ústí nad Labem hl.n.',
    region: 'Ústecký kraj',
    coords: [50.6586, 14.0436],
    buyPricePerSqm: 46000,
    rentPricePerSqm: 185,
    connections: {
      praha: conn('Praha hl.n.', 71, 2, 42, '04:30', '23:10', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'decin',
    name: 'Děčín hl.n.',
    region: 'Ústecký kraj',
    coords: [50.7739, 14.2014],
    buyPricePerSqm: 44000,
    rentPricePerSqm: 180,
    connections: {
      praha: conn('Praha hl.n.', 86, 2, 38, '04:15', '22:45', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'teplice-v-cechach',
    name: 'Teplice v Čechách',
    region: 'Ústecký kraj',
    coords: [50.6439, 13.8272],
    buyPricePerSqm: 47000,
    rentPricePerSqm: 190,
    connections: {
      praha: conn('Praha hl.n.', 89, 1, 24, '04:20', '21:40', false, ['ČD']),
    },
  },
  {
    id: 'most',
    name: 'Most',
    region: 'Ústecký kraj',
    coords: [50.5097, 13.6492],
    buyPricePerSqm: 38000,
    rentPricePerSqm: 165,
    connections: {
      praha: conn('Praha hl.n.', 105, 1, 22, '04:25', '21:15', false, ['ČD', 'RegioJet']),
      plzen: conn('Plzeň hl.n.', 115, 1, 14, '05:00', '20:10', false, ['ČD']),
    },
  },
  {
    id: 'chomutov',
    name: 'Chomutov',
    region: 'Ústecký kraj',
    coords: [50.4639, 13.4144],
    buyPricePerSqm: 39000,
    rentPricePerSqm: 170,
    connections: {
      praha: conn('Praha hl.n.', 118, 1, 20, '04:10', '21:00', false, ['ČD']),
      plzen: conn('Plzeň hl.n.', 100, 1, 16, '05:15', '20:30', false, ['ČD']),
    },
  },
  {
    id: 'louny',
    name: 'Louny',
    region: 'Ústecký kraj',
    coords: [50.3581, 13.7997],
    buyPricePerSqm: 53000,
    rentPricePerSqm: 200,
    connections: {
      praha: conn('Praha hl.n.', 76, 1, 20, '04:40', '21:30', true, ['ČD', 'Die Länderbahn']),
    },
  },
  {
    id: 'ceska-lipa',
    name: 'Česká Lípa hl.n.',
    region: 'Liberecký kraj',
    coords: [50.6808, 14.5367],
    buyPricePerSqm: 56000,
    rentPricePerSqm: 210,
    connections: {
      praha: conn('Praha hl.n.', 98, 1, 18, '04:30', '21:05', false, ['ČD', 'Arriva']),
    },
  },
  {
    id: 'turnov',
    name: 'Turnov',
    region: 'Liberecký kraj',
    coords: [50.5847, 15.1481],
    buyPricePerSqm: 78000,
    rentPricePerSqm: 260,
    connections: {
      praha: conn('Praha hl.n.', 102, 1, 20, '04:45', '21:20', true, ['ČD', 'Arriva']),
    },
  },
  {
    id: 'liberec',
    name: 'Liberec',
    region: 'Liberecký kraj',
    coords: [50.7606, 15.0475],
    buyPricePerSqm: 86000,
    rentPricePerSqm: 275,
    connections: {
      praha: conn('Praha hl.n.', 135, 1, 18, '04:30', '20:45', false, ['ČD', 'Arriva']),
    },
  },

  // ==========================================
  // WEST BOHEMIA & PLZEŇ COMMUTER RING (10)
  // ==========================================
  {
    id: 'nyrany',
    name: 'Nýřany',
    region: 'Plzeňský kraj',
    coords: [49.7119, 13.2039],
    buyPricePerSqm: 64000,
    rentPricePerSqm: 225,
    connections: {
      plzen: conn('Plzeň hl.n.', 14, 2, 36, '04:45', '23:30', true, ['ČD']),
    },
  },
  {
    id: 'prestice',
    name: 'Přeštice',
    region: 'Plzeňský kraj',
    coords: [49.5744, 13.3325],
    buyPricePerSqm: 66000,
    rentPricePerSqm: 230,
    connections: {
      plzen: conn('Plzeň hl.n.', 19, 2, 34, '04:50', '23:20', true, ['ČD']),
    },
  },
  {
    id: 'stribro',
    name: 'Stříbro',
    region: 'Plzeňský kraj',
    coords: [49.7522, 13.0036],
    buyPricePerSqm: 61000,
    rentPricePerSqm: 215,
    connections: {
      plzen: conn('Plzeň hl.n.', 28, 2, 30, '04:40', '23:05', true, ['ČD']),
    },
  },
  {
    id: 'domazlice',
    name: 'Domažlice',
    region: 'Plzeňský kraj',
    coords: [49.4394, 12.9367],
    buyPricePerSqm: 67000,
    rentPricePerSqm: 235,
    connections: {
      plzen: conn('Plzeň hl.n.', 48, 1, 24, '04:30', '22:40', true, ['ČD', 'Die Länderbahn']),
    },
  },
  {
    id: 'rokycany',
    name: 'Rokycany',
    region: 'Plzeňský kraj',
    coords: [49.7431, 13.5956],
    buyPricePerSqm: 76000,
    rentPricePerSqm: 255,
    connections: {
      plzen: conn('Plzeň hl.n.', 11, 3, 48, '04:55', '00:10', true, ['ČD']),
      praha: conn('Praha hl.n.', 64, 2, 40, '04:45', '23:30', true, ['ČD']),
    },
  },
  {
    id: 'klatovy',
    name: 'Klatovy',
    region: 'Plzeňský kraj',
    coords: [49.4003, 13.2928],
    buyPricePerSqm: 69000,
    rentPricePerSqm: 240,
    connections: {
      plzen: conn('Plzeň hl.n.', 42, 2, 32, '04:35', '22:50', true, ['ČD']),
    },
  },
  {
    id: 'marianske-lazne',
    name: 'Mariánské Lázně',
    region: 'Karlovarský kraj',
    coords: [49.9639, 12.7075],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 235,
    connections: {
      plzen: conn('Plzeň hl.n.', 52, 2, 30, '04:40', '22:35', true, ['ČD', 'RegioJet']),
      praha: conn('Praha hl.n.', 125, 1, 22, '05:10', '21:15', true, ['ČD']),
    },
  },
  {
    id: 'karlovy-vary',
    name: 'Karlovy Vary',
    region: 'Karlovarský kraj',
    coords: [50.2358, 12.8719],
    buyPricePerSqm: 71000,
    rentPricePerSqm: 245,
    connections: {
      plzen: conn('Plzeň hl.n.', 88, 1, 22, '04:45', '21:30', true, ['ČD']),
      praha: conn('Praha hl.n.', 175, 1, 16, '04:35', '19:40', true, ['ČD']),
    },
  },
  {
    id: 'sokolov',
    name: 'Sokolov',
    region: 'Karlovarský kraj',
    coords: [50.1814, 12.6467],
    buyPricePerSqm: 49000,
    rentPricePerSqm: 190,
    connections: {
      plzen: conn('Plzeň hl.n.', 74, 1, 24, '04:30', '21:45', true, ['ČD']),
    },
  },
  {
    id: 'cheb',
    name: 'Cheb',
    region: 'Karlovarský kraj',
    coords: [50.0767, 12.3789],
    buyPricePerSqm: 56000,
    rentPricePerSqm: 205,
    connections: {
      plzen: conn('Plzeň hl.n.', 69, 2, 28, '04:20', '22:15', true, ['ČD']),
      praha: conn('Praha hl.n.', 142, 1, 20, '04:50', '20:50', true, ['ČD']),
    },
  },

  // ==========================================
  // SOUTH BOHEMIA & VYSOČINA (9)
  // ==========================================
  {
    id: 'tabor',
    name: 'Tábor',
    region: 'Jihočeský kraj',
    coords: [49.4144, 14.6739],
    buyPricePerSqm: 74000,
    rentPricePerSqm: 250,
    connections: {
      praha: conn('Praha hl.n.', 59, 2, 38, '04:35', '23:15', true, ['ČD']),
    },
  },
  {
    id: 'ceske-budejovice',
    name: 'České Budějovice',
    region: 'Jihočeský kraj',
    coords: [48.9744, 14.4883],
    buyPricePerSqm: 88000,
    rentPricePerSqm: 280,
    connections: {
      praha: conn('Praha hl.n.', 98, 2, 34, '04:20', '22:35', true, ['ČD']),
      plzen: conn('Plzeň hl.n.', 115, 1, 20, '04:40', '21:05', true, ['ČD']),
    },
  },
  {
    id: 'pisek',
    name: 'Písek',
    region: 'Jihočeský kraj',
    coords: [49.3039, 14.1356],
    buyPricePerSqm: 72000,
    rentPricePerSqm: 245,
    connections: {
      praha: conn('Praha hl.n.', 95, 1, 22, '04:30', '21:40', false, ['ČD']),
      plzen: conn('Plzeň hl.n.', 70, 1, 24, '04:50', '22:10', true, ['ČD']),
    },
  },
  {
    id: 'strakonice',
    name: 'Strakonice',
    region: 'Jihočeský kraj',
    coords: [49.2561, 13.9103],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 235,
    connections: {
      praha: conn('Praha hl.n.', 108, 1, 20, '04:20', '21:20', false, ['ČD']),
      plzen: conn('Plzeň hl.n.', 54, 2, 26, '04:45', '22:30', true, ['ČD']),
    },
  },
  {
    id: 'jindrichuv-hradec',
    name: 'Jindřichův Hradec',
    region: 'Jihočeský kraj',
    coords: [49.1494, 15.0069],
    buyPricePerSqm: 69000,
    rentPricePerSqm: 235,
    connections: {
      praha: conn('Praha hl.n.', 118, 1, 18, '04:15', '21:00', false, ['ČD']),
      brno: conn('Brno hl.n.', 125, 1, 16, '04:30', '20:45', false, ['ČD']),
    },
  },
  {
    id: 'caslav',
    name: 'Čáslav',
    region: 'Středočeský kraj',
    coords: [49.9142, 15.3992],
    buyPricePerSqm: 69000,
    rentPricePerSqm: 240,
    connections: {
      praha: conn('Praha hl.n.', 58, 2, 34, '04:40', '23:05', true, ['ČD']),
    },
  },
  {
    id: 'havlickuv-brod',
    name: 'Havlíčkův Brod',
    region: 'Kraj Vysočina',
    coords: [49.6053, 15.5861],
    buyPricePerSqm: 67000,
    rentPricePerSqm: 235,
    connections: {
      praha: conn('Praha hl.n.', 92, 1, 24, '04:30', '22:10', true, ['ČD']),
      brno: conn('Brno hl.n.', 88, 1, 26, '04:35', '22:20', true, ['ČD']),
    },
  },
  {
    id: 'jihlava',
    name: 'Jihlava',
    region: 'Kraj Vysočina',
    coords: [49.4069, 15.5975],
    buyPricePerSqm: 74000,
    rentPricePerSqm: 255,
    connections: {
      praha: conn('Praha hl.n.', 115, 1, 20, '04:20', '21:30', false, ['ČD']),
      brno: conn('Brno hl.n.', 98, 1, 22, '04:40', '21:50', true, ['ČD']),
    },
  },
  {
    id: 'zdar-nad-sazavou',
    name: 'Žďár nad Sázavou',
    region: 'Kraj Vysočina',
    coords: [49.5608, 15.9389],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 235,
    connections: {
      praha: conn('Praha hl.n.', 110, 1, 22, '04:25', '21:40', true, ['ČD']),
      brno: conn('Brno hl.n.', 62, 2, 32, '04:45', '22:45', true, ['ČD']),
    },
  },

  // ==========================================
  // EAST BOHEMIA, MORAVIA & BRNO COMMUTER RING (16)
  // ==========================================
  {
    id: 'pardubice',
    name: 'Pardubice hl.n.',
    region: 'Pardubický kraj',
    coords: [50.0317, 15.7567],
    buyPricePerSqm: 89000,
    rentPricePerSqm: 285,
    connections: {
      praha: conn('Praha hl.n.', 54, 4, 76, '04:15', '00:20', true, ['ČD', 'RegioJet', 'Leo Express']),
      brno: conn('Brno hl.n.', 89, 2, 38, '04:40', '23:10', true, ['ČD', 'RegioJet']),
      ostrava: conn('Ostrava hl.n.', 140, 2, 34, '05:00', '22:30', true, ['ČD', 'RegioJet', 'Leo Express']),
    },
  },
  {
    id: 'hradec-kralove',
    name: 'Hradec Králové hl.n.',
    region: 'Královéhradecký kraj',
    coords: [50.2144, 15.8114],
    buyPricePerSqm: 92000,
    rentPricePerSqm: 290,
    connections: {
      praha: conn('Praha hl.n.', 68, 2, 38, '04:25', '23:15', true, ['ČD']),
    },
  },
  {
    id: 'chocen',
    name: 'Choceň',
    region: 'Pardubický kraj',
    coords: [50.0017, 16.2208],
    buyPricePerSqm: 69000,
    rentPricePerSqm: 240,
    connections: {
      praha: conn('Praha hl.n.', 74, 2, 42, '04:20', '23:35', true, ['ČD']),
      brno: conn('Brno hl.n.', 78, 1, 26, '04:35', '22:40', false, ['ČD']),
    },
  },
  {
    id: 'ceska-trebova',
    name: 'Česká Třebová',
    region: 'Pardubický kraj',
    coords: [49.9011, 16.4447],
    buyPricePerSqm: 62000,
    rentPricePerSqm: 220,
    connections: {
      praha: conn('Praha hl.n.', 88, 3, 50, '04:10', '23:45', true, ['ČD', 'RegioJet']),
      brno: conn('Brno hl.n.', 58, 2, 38, '04:30', '23:20', true, ['ČD', 'RegioJet']),
      ostrava: conn('Ostrava hl.n.', 108, 2, 36, '04:45', '22:50', true, ['ČD', 'RegioJet', 'Leo Express']),
    },
  },
  {
    id: 'svitavy',
    name: 'Svitavy',
    region: 'Pardubický kraj',
    coords: [49.7586, 16.4739],
    buyPricePerSqm: 64000,
    rentPricePerSqm: 225,
    connections: {
      brno: conn('Brno hl.n.', 48, 2, 34, '04:45', '23:15', true, ['ČD']),
      praha: conn('Praha hl.n.', 102, 2, 36, '04:20', '23:00', true, ['ČD']),
    },
  },
  {
    id: 'zabreh-na-morave',
    name: 'Zábřeh na Moravě',
    region: 'Olomoucký kraj',
    coords: [49.8822, 16.8797],
    buyPricePerSqm: 63000,
    rentPricePerSqm: 225,
    connections: {
      praha: conn('Praha hl.n.', 112, 2, 40, '04:15', '23:15', true, ['ČD', 'RegioJet']),
      brno: conn('Brno hl.n.', 76, 1, 26, '04:35', '22:30', false, ['ČD']),
      ostrava: conn('Ostrava hl.n.', 82, 2, 34, '04:40', '23:10', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'olomouc',
    name: 'Olomouc hl.n.',
    region: 'Olomoucký kraj',
    coords: [49.5897, 17.2783],
    buyPricePerSqm: 88000,
    rentPricePerSqm: 280,
    connections: {
      praha: conn('Praha hl.n.', 128, 3, 56, '04:10', '23:00', true, ['ČD', 'RegioJet', 'Leo Express']),
      brno: conn('Brno hl.n.', 58, 2, 36, '04:30', '23:15', true, ['ČD', 'RegioJet']),
      ostrava: conn('Ostrava hl.n.', 56, 3, 48, '04:35', '23:40', true, ['ČD', 'RegioJet', 'Leo Express']),
    },
  },
  {
    id: 'prerov',
    name: 'Přerov',
    region: 'Olomoucký kraj',
    coords: [49.4508, 17.4589],
    buyPricePerSqm: 63000,
    rentPricePerSqm: 225,
    connections: {
      praha: conn('Praha hl.n.', 142, 2, 38, '04:15', '22:30', true, ['ČD', 'RegioJet']),
      brno: conn('Brno hl.n.', 48, 2, 36, '04:40', '23:10', true, ['ČD', 'RegioJet']),
      ostrava: conn('Ostrava hl.n.', 46, 3, 44, '04:45', '23:35', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'otrokovice',
    name: 'Otrokovice (Zlín)',
    region: 'Zlínský kraj',
    coords: [49.2089, 17.5303],
    buyPricePerSqm: 72000,
    rentPricePerSqm: 245,
    connections: {
      praha: conn('Praha hl.n.', 160, 2, 32, '04:20', '22:00', true, ['ČD', 'RegioJet']),
      brno: conn('Brno hl.n.', 56, 2, 34, '04:40', '23:00', true, ['ČD', 'RegioJet']),
      ostrava: conn('Ostrava hl.n.', 64, 2, 32, '04:50', '23:05', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'kurim',
    name: 'Kuřim',
    region: 'Jihomoravský kraj',
    coords: [49.2997, 16.5336],
    buyPricePerSqm: 118000,
    rentPricePerSqm: 350,
    connections: {
      brno: conn('Brno hl.n.', 16, 4, 62, '04:35', '00:15', true, ['ČD', 'IDS JMK']),
    },
  },
  {
    id: 'blansko',
    name: 'Blansko',
    region: 'Jihomoravský kraj',
    coords: [49.3628, 16.6436],
    buyPricePerSqm: 86000,
    rentPricePerSqm: 275,
    connections: {
      brno: conn('Brno hl.n.', 22, 3, 52, '04:30', '00:10', true, ['ČD', 'IDS JMK']),
    },
  },
  {
    id: 'tisnov',
    name: 'Tišnov',
    region: 'Jihomoravský kraj',
    coords: [49.3486, 16.4258],
    buyPricePerSqm: 89000,
    rentPricePerSqm: 280,
    connections: {
      brno: conn('Brno hl.n.', 26, 3, 50, '04:25', '23:55', true, ['ČD', 'IDS JMK']),
    },
  },
  {
    id: 'vyskov-na-morave',
    name: 'Vyškov na Moravě',
    region: 'Jihomoravský kraj',
    coords: [49.2789, 16.9997],
    buyPricePerSqm: 76000,
    rentPricePerSqm: 255,
    connections: {
      brno: conn('Brno hl.n.', 34, 2, 42, '04:35', '23:30', true, ['ČD', 'IDS JMK']),
    },
  },
  {
    id: 'breclav',
    name: 'Břeclav',
    region: 'Jihomoravský kraj',
    coords: [48.7558, 16.8906],
    buyPricePerSqm: 82000,
    rentPricePerSqm: 265,
    connections: {
      brno: conn('Brno hl.n.', 31, 3, 56, '04:20', '00:20', true, ['ČD', 'IDS JMK', 'RegioJet']),
      praha: conn('Praha hl.n.', 185, 2, 32, '04:10', '21:30', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'hodonin',
    name: 'Hodonín',
    region: 'Jihomoravský kraj',
    coords: [48.8572, 17.1356],
    buyPricePerSqm: 68000,
    rentPricePerSqm: 235,
    connections: {
      brno: conn('Brno hl.n.', 48, 2, 38, '04:30', '23:15', true, ['ČD', 'IDS JMK']),
    },
  },
  {
    id: 'znojmo',
    name: 'Znojmo',
    region: 'Jihomoravský kraj',
    coords: [48.8544, 16.0597],
    buyPricePerSqm: 74000,
    rentPricePerSqm: 250,
    connections: {
      brno: conn('Brno hl.n.', 78, 1, 24, '04:20', '22:10', true, ['ČD', 'IDS JMK']),
    },
  },

  // ==========================================
  // SILESIA & OSTRAVA COMMUTER RING (7)
  // ==========================================
  {
    id: 'bohumin',
    name: 'Bohumín',
    region: 'Moravskoslezský kraj',
    coords: [49.9044, 18.3589],
    buyPricePerSqm: 51000,
    rentPricePerSqm: 195,
    connections: {
      ostrava: conn('Ostrava hl.n.', 8, 4, 68, '04:30', '00:25', true, ['ČD', 'RegioJet', 'Leo Express']),
      praha: conn('Praha hl.n.', 205, 2, 32, '04:05', '21:35', true, ['ČD', 'RegioJet', 'Leo Express']),
      brno: conn('Brno hl.n.', 130, 2, 28, '04:30', '21:50', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'havirov',
    name: 'Havířov',
    region: 'Moravskoslezský kraj',
    coords: [49.7914, 18.4239],
    buyPricePerSqm: 48000,
    rentPricePerSqm: 185,
    connections: {
      ostrava: conn('Ostrava hl.n.', 16, 3, 52, '04:35', '00:15', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'karvina',
    name: 'Karviná hl.n.',
    region: 'Moravskoslezský kraj',
    coords: [49.8661, 18.5528],
    buyPricePerSqm: 42000,
    rentPricePerSqm: 175,
    connections: {
      ostrava: conn('Ostrava hl.n.', 22, 3, 48, '04:25', '00:05', true, ['ČD', 'RegioJet']),
    },
  },
  {
    id: 'opava-vychod',
    name: 'Opava východ',
    region: 'Moravskoslezský kraj',
    coords: [49.9344, 17.9086],
    buyPricePerSqm: 63000,
    rentPricePerSqm: 225,
    connections: {
      ostrava: conn('Ostrava hl.n.', 27, 3, 44, '04:30', '23:45', true, ['ČD']),
    },
  },
  {
    id: 'frydek-mistek',
    name: 'Frýdek-Místek',
    region: 'Moravskoslezský kraj',
    coords: [49.6897, 18.3497],
    buyPricePerSqm: 59000,
    rentPricePerSqm: 215,
    connections: {
      ostrava: conn('Ostrava hl.n.', 24, 3, 46, '04:35', '23:50', true, ['ČD']),
    },
  },
  {
    id: 'cesky-tesin',
    name: 'Český Těšín',
    region: 'Moravskoslezský kraj',
    coords: [49.7461, 18.6258],
    buyPricePerSqm: 54000,
    rentPricePerSqm: 205,
    connections: {
      ostrava: conn('Ostrava hl.n.', 32, 2, 40, '04:20', '23:30', true, ['ČD', 'RegioJet', 'Leo Express']),
    },
  },
  {
    id: 'hranice-na-morave',
    name: 'Hranice na Moravě',
    region: 'Olomoucký kraj',
    coords: [49.5614, 17.7478],
    buyPricePerSqm: 59000,
    rentPricePerSqm: 215,
    connections: {
      ostrava: conn('Ostrava hl.n.', 32, 3, 48, '04:40', '00:05', true, ['ČD', 'RegioJet', 'Leo Express']),
      brno: conn('Brno hl.n.', 68, 2, 34, '04:45', '22:50', true, ['ČD', 'RegioJet']),
      praha: conn('Praha hl.n.', 162, 2, 36, '04:20', '22:15', true, ['ČD', 'RegioJet', 'Leo Express']),
    },
  },
];

export const STATIONS: Station[] = [...BASE_STATIONS, ...PRAGUE_DETAIL_STATIONS];

