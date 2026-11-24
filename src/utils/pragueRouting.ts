import { Station, TrainConnection, PragueStationId, PragueTargetMode } from '../types';
import { PRAGUE_STATIONS, PRAGUE_TRANSFER_MIN } from '../data/pragueStations';

export interface PragueCorridorProfile {
  firstStationId: PragueStationId;
  directStations: Partial<Record<PragueStationId, number>>;
}

export interface ResolvedPragueConnection extends TrainConnection {
  targetStationId: PragueStationId;
  targetStationName: string;
  targetStationShortName: string;
  isFirstStationMode: boolean;
  requiresPragueTransfer: boolean;
  viaStationId?: PragueStationId;
  viaStationName?: string;
  viaStationShortName?: string;
  originalDurationMin: number;
}

export function isResolvedPragueConnection(
  conn: TrainConnection | ResolvedPragueConnection | undefined
): conn is ResolvedPragueConnection {
  return !!conn && 'targetStationId' in conn;
}

/**
 * Direct arrival travel times (in minutes) to Prague railway stations served by each corridor.
 * Based on official S-linka and R rychlík timetables.
 */
export const PRAGUE_CORRIDORS: Record<string, PragueCorridorProfile> = {
  // -------------------------------------------------------------
  // North Corridor 090 (R20 / S4) — First entry: Praha-Podbaba
  // -------------------------------------------------------------
  'lovosice': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 56, holesovice: 60, hln: 68 },
  },
  'bohusovice-nad-ohri': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 50, holesovice: 54, hln: 62 },
  },
  'roudnice-nad-labem': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 41, holesovice: 45, hln: 52 },
  },
  'hnevice': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 34, holesovice: 38, hln: 45 },
  },
  'vranany': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 27, holesovice: 32, masarykovo: 35, hln: 38 },
  },
  'libcice-nad-vltavou': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 13, holesovice: 18, masarykovo: 21, hln: 24 },
  },
  'kralupy-nad-vltavou': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 19, holesovice: 24, masarykovo: 27, hln: 30 },
  },
  'roztoky-u-prahy': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 7, holesovice: 12, masarykovo: 15, hln: 18 },
  },
  'litomerice-mesto': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 62, holesovice: 66, hln: 74 },
  },
  'usti-nad-labem': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 68, holesovice: 72, hln: 80 },
  },
  'decin': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 83, holesovice: 87, hln: 95 },
  },
  'teplice-v-cechach': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 82, holesovice: 86, hln: 94 },
  },
  'most': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 95, holesovice: 99, hln: 107 },
  },
  'chomutov': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 110, holesovice: 114, hln: 122 },
  },
  'louny': {
    firstStationId: 'podbaba',
    directStations: { podbaba: 68, holesovice: 72, hln: 80 },
  },

  // -------------------------------------------------------------
  // East Corridor 011 (S1 / R / Ex) — First entry: Praha-Libeň
  // -------------------------------------------------------------
  'kolin': {
    firstStationId: 'liben',
    directStations: { liben: 35, masarykovo: 43, hln: 42 },
  },
  'velim': {
    firstStationId: 'liben',
    directStations: { liben: 45, masarykovo: 53, hln: 52 },
  },
  'pecky': {
    firstStationId: 'liben',
    directStations: { liben: 38, masarykovo: 46, hln: 45 },
  },
  'poricany': {
    firstStationId: 'liben',
    directStations: { liben: 33, masarykovo: 41, hln: 40 },
  },
  'cesky-brod': {
    firstStationId: 'liben',
    directStations: { liben: 25, masarykovo: 33, hln: 32 },
  },
  'uvaly': {
    firstStationId: 'liben',
    directStations: { liben: 17, masarykovo: 25, hln: 24 },
  },
  'pardubice': {
    firstStationId: 'liben',
    directStations: { liben: 50, hln: 57 },
  },
  'prelouc': {
    firstStationId: 'liben',
    directStations: { liben: 62, hln: 69 },
  },
  'kutna-hora': {
    firstStationId: 'liben',
    directStations: { liben: 48, hln: 55 },
  },
  'caslav': {
    firstStationId: 'liben',
    directStations: { liben: 58, hln: 65 },
  },
  'hradec-kralove': {
    firstStationId: 'liben',
    directStations: { liben: 85, hln: 92 },
  },
  'chocen': {
    firstStationId: 'liben',
    directStations: { liben: 78, hln: 85 },
  },
  'ceska-trebova': {
    firstStationId: 'liben',
    directStations: { liben: 95, hln: 102 },
  },
  'svitavy': {
    firstStationId: 'liben',
    directStations: { liben: 105, hln: 112 },
  },
  'zabreh-na-morave': {
    firstStationId: 'liben',
    directStations: { liben: 115, hln: 122 },
  },
  'olomouc': {
    firstStationId: 'liben',
    directStations: { liben: 125, hln: 132 },
  },
  'prerov': {
    firstStationId: 'liben',
    directStations: { liben: 135, hln: 142 },
  },
  'hranice-na-morave': {
    firstStationId: 'liben',
    directStations: { liben: 148, hln: 155 },
  },
  'otrokovice': {
    firstStationId: 'liben',
    directStations: { liben: 155, hln: 162 },
  },
  'ostrava': {
    firstStationId: 'liben',
    directStations: { liben: 185, hln: 195 },
  },
  'bohumin': {
    firstStationId: 'liben',
    directStations: { liben: 195, hln: 205 },
  },
  'brno': {
    firstStationId: 'liben',
    directStations: { liben: 142, hln: 150 },
  },
  'breclav': {
    firstStationId: 'liben',
    directStations: { liben: 175, hln: 185 },
  },
  'havlickuv-brod': {
    firstStationId: 'liben',
    directStations: { liben: 100, hln: 110 },
  },
  'jihlava': {
    firstStationId: 'liben',
    directStations: { liben: 125, hln: 135 },
  },
  'zdar-nad-sazavou': {
    firstStationId: 'liben',
    directStations: { liben: 125, hln: 135 },
  },

  // -------------------------------------------------------------
  // Northeast Corridor 231 & 070 (S2 / S3 / R10 / R21) — First entry: Praha-Vysočany
  // -------------------------------------------------------------
  'mstetice': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 13, masarykovo: 22 },
  },
  'celakovice': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 18, masarykovo: 27, hln: 26 },
  },
  'lysa-nad-labem': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 26, masarykovo: 35, hln: 34 },
  },
  'milovice': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 38, masarykovo: 47, hln: 46 },
  },
  'nymburk': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 36, masarykovo: 45, hln: 45 },
  },
  'podebrady': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 44, hln: 53 },
  },
  'velky-osek': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 52, hln: 61 },
  },
  'neratovice': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 26, hln: 36 },
  },
  'vsetaty': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 32, hln: 41 },
  },
  'melnik': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 45, hln: 54 },
  },
  'mlada-boleslav': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 58, hln: 67 },
  },
  'turnov': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 95, hln: 104 },
  },
  'liberec': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 120, hln: 129 },
  },
  'chlumec-nad-cidlinou': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 68, hln: 77 },
  },
  'ceska-lipa': {
    firstStationId: 'vysocany',
    directStations: { vysocany: 85, hln: 95 },
  },

  // -------------------------------------------------------------
  // Southeast Corridor 221 (S9 / R17) — First entry: Praha-Vršovice
  // -------------------------------------------------------------
  'ricany': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 20, hln: 25 },
  },
  'strancice': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 25, hln: 30 },
  },
  'senohraby': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 32, hln: 37 },
  },
  'cercany': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 37, hln: 43 },
  },
  'benesov-u-prahy': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 41, hln: 47 },
  },
  'bystrice-u-benesova': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 46, hln: 52 },
  },
  'olbramovice': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 49, hln: 55 },
  },
  'tabor': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 60, hln: 66 },
  },
  'ceske-budejovice': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 95, hln: 101 },
  },
  'veseli-nad-luznici': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 83, hln: 89 },
  },
  'jindrichuv-hradec': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 105, hln: 112 },
  },

  // -------------------------------------------------------------
  // Southwest Corridor 171 (S7 / R16) — First entry: Praha-Smíchov
  // -------------------------------------------------------------
  'cernosice': {
    firstStationId: 'smichov',
    directStations: { smichov: 13, hln: 21 },
  },
  'dobrichovice': {
    firstStationId: 'smichov',
    directStations: { smichov: 18, hln: 26 },
  },
  'revnice': {
    firstStationId: 'smichov',
    directStations: { smichov: 22, hln: 30 },
  },
  'zadni-treban': {
    firstStationId: 'smichov',
    directStations: { smichov: 26, hln: 34 },
  },
  'karlstejn': {
    firstStationId: 'smichov',
    directStations: { smichov: 29, hln: 37 },
  },
  'beroun': {
    firstStationId: 'smichov',
    directStations: { smichov: 32, hln: 40 },
  },
  'zdice': {
    firstStationId: 'smichov',
    directStations: { smichov: 40, hln: 48 },
  },
  'horovice': {
    firstStationId: 'smichov',
    directStations: { smichov: 46, hln: 54 },
  },
  'karez': {
    firstStationId: 'smichov',
    directStations: { smichov: 52, hln: 60 },
  },
  'rokycany': {
    firstStationId: 'smichov',
    directStations: { smichov: 60, hln: 68 },
  },
  'plzen': {
    firstStationId: 'smichov',
    directStations: { smichov: 72, hln: 80 },
  },
  'cheb': {
    firstStationId: 'smichov',
    directStations: { smichov: 145, hln: 153 },
  },
  'marianske-lazne': {
    firstStationId: 'smichov',
    directStations: { smichov: 132, hln: 140 },
  },
  'karlovy-vary': {
    firstStationId: 'smichov',
    directStations: { smichov: 175, hln: 185 },
  },
  'pribram': {
    firstStationId: 'smichov',
    directStations: { smichov: 64, hln: 72 },
  },
  'pisek': {
    firstStationId: 'smichov',
    directStations: { smichov: 98, hln: 106 },
  },
  'strakonice': {
    firstStationId: 'smichov',
    directStations: { smichov: 108, hln: 116 },
  },

  // -------------------------------------------------------------
  // West Corridor 120 (S5 / R24) — First entry: Praha-Veleslavín
  // -------------------------------------------------------------
  'hostivice': {
    firstStationId: 'veleslavin',
    directStations: { veleslavin: 11, masarykovo: 27 },
  },
  'unhost': {
    firstStationId: 'veleslavin',
    directStations: { veleslavin: 20, masarykovo: 36 },
  },
  'kladno': {
    firstStationId: 'veleslavin',
    directStations: { veleslavin: 25, masarykovo: 41 },
  },
  'stochov': {
    firstStationId: 'veleslavin',
    directStations: { veleslavin: 42, masarykovo: 58 },
  },
  'nove-straseci': {
    firstStationId: 'veleslavin',
    directStations: { veleslavin: 47, masarykovo: 63 },
  },
  'rakovnik': {
    firstStationId: 'veleslavin',
    directStations: { veleslavin: 66, masarykovo: 82 },
  },

  // -------------------------------------------------------------
  // South Corridor 210 (S8) — First entry: Praha-Vršovice
  // -------------------------------------------------------------
  'vrane-nad-vltavou': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 19, hln: 26 },
  },
  'davle': {
    firstStationId: 'vrsovice',
    directStations: { vrsovice: 30, hln: 37 },
  },
};

/**
 * Resolves a dynamic Prague connection based on selected PragueTargetMode.
 * If targetMode === 'first', picks the earliest Prague entry station on that line.
 * If targetMode is a specific Prague station, checks for direct trains or calculates
 * the optimal cross-Prague transfer with realistic transfer buffer.
 */
export function resolvePragueConnection(
  station: Station,
  baseConn: TrainConnection,
  targetMode: PragueTargetMode
): ResolvedPragueConnection {
  const corridor = PRAGUE_CORRIDORS[station.id];

  // 1. "První stanice v Praze" mode
  if (targetMode === 'first') {
    if (corridor) {
      const firstId = corridor.firstStationId;
      const firstStation = PRAGUE_STATIONS[firstId];
      const directDuration = corridor.directStations[firstId];
      const durationMin =
        directDuration !== undefined
          ? directDuration
          : Math.max(1, baseConn.durationMin - 10);

      return {
        ...baseConn,
        durationMin,
        terminus: firstStation.name,
        targetStationId: firstId,
        targetStationName: firstStation.name,
        targetStationShortName: firstStation.shortName,
        isFirstStationMode: true,
        requiresPragueTransfer: false,
        isDirect: baseConn.isDirect,
        originalDurationMin: baseConn.durationMin,
      };
    }

    // Default fallback if no corridor mapped: use base connection
    return {
      ...baseConn,
      targetStationId: 'hln',
      targetStationName: PRAGUE_STATIONS.hln.name,
      targetStationShortName: PRAGUE_STATIONS.hln.shortName,
      isFirstStationMode: true,
      requiresPragueTransfer: false,
      originalDurationMin: baseConn.durationMin,
    };
  }

  // 2. Specific Prague station mode
  const targetStation = PRAGUE_STATIONS[targetMode];

  if (corridor) {
    const directDuration = corridor.directStations[targetMode];

    // Case A: Direct train stop at the selected station
    if (directDuration !== undefined) {
      return {
        ...baseConn,
        durationMin: directDuration,
        terminus: targetStation.name,
        targetStationId: targetMode,
        targetStationName: targetStation.name,
        targetStationShortName: targetStation.shortName,
        isFirstStationMode: false,
        requiresPragueTransfer: false,
        isDirect: baseConn.isDirect,
        originalDurationMin: baseConn.durationMin,
      };
    }

    // Case B: No direct train — find shortest route with transfer in Prague
    let minTotal = Infinity;
    let bestVia: PragueStationId = corridor.firstStationId;

    const directEntries = Object.entries(corridor.directStations) as [PragueStationId, number][];

    for (const [k, dur] of directEntries) {
      const transferTime = PRAGUE_TRANSFER_MIN[k]?.[targetMode] ?? 20;
      const total = dur + transferTime;
      if (total < minTotal) {
        minTotal = total;
        bestVia = k;
      }
    }

    const viaStation = PRAGUE_STATIONS[bestVia];

    return {
      ...baseConn,
      durationMin: minTotal,
      terminus: targetStation.name,
      targetStationId: targetMode,
      targetStationName: targetStation.name,
      targetStationShortName: targetStation.shortName,
      isFirstStationMode: false,
      requiresPragueTransfer: true,
      viaStationId: bestVia,
      viaStationName: viaStation.name,
      viaStationShortName: viaStation.shortName,
      isDirect: false, // requires transfer in Prague
      originalDurationMin: baseConn.durationMin,
    };
  }

  // Fallback for unmapped stations
  if (targetMode === 'hln') {
    return {
      ...baseConn,
      targetStationId: 'hln',
      targetStationName: targetStation.name,
      targetStationShortName: targetStation.shortName,
      isFirstStationMode: false,
      requiresPragueTransfer: false,
      originalDurationMin: baseConn.durationMin,
    };
  }

  const transferMin = PRAGUE_TRANSFER_MIN.hln[targetMode] ?? 15;
  return {
    ...baseConn,
    durationMin: baseConn.durationMin + transferMin,
    terminus: targetStation.name,
    targetStationId: targetMode,
    targetStationName: targetStation.name,
    targetStationShortName: targetStation.shortName,
    isFirstStationMode: false,
    requiresPragueTransfer: true,
    viaStationId: 'hln',
    viaStationName: PRAGUE_STATIONS.hln.name,
    viaStationShortName: PRAGUE_STATIONS.hln.shortName,
    isDirect: false,
    originalDurationMin: baseConn.durationMin,
  };
}
