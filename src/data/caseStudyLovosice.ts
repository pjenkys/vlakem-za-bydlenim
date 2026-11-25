export interface SrealityListingSnapshot {
  id: string;
  sourceUrl: string;
  title: string;
  priceCzk: number;
  priceCzkPerSqm: number;
  layout: string;
  usableAreaSqm: number;
  totalAreaSqm: number;
  cellarAreaSqm: number;
  floor: number;
  totalFloors: number;
  buildingType: string;
  buildingCondition: string;
  ownership: string;
  energyRating: string;
  hasBalcony: boolean;
  hasCellar: boolean;
  hasElevator: boolean;
  heatingType: string;
  hoaRepairFundCzk: number;
  orientation: string;
  description: string;
  images: {
    url: string;
    caption: string;
  }[];
}

export interface VerifiedLocationData {
  address: string;
  svjName: string;
  apartmentCoords: [number, number];
  stationCoords: [number, number];
  walkingDistanceMeters: number;
  walkingMinutes: number;
  walkingRouteNote: string;
  routePolyline: [number, number][];
}

export interface RailConnectionData {
  trainLine: string;
  carrier: string;
  destination: string;
  durationMinutes: number;
  lastDirectTrainFromPrague: string;
  peakFrequencyNote: string;
  regularSingleTripCzk: number;
  in50SingleTripCzk: number;
  in50ReturnTripCzk: number;
  in50AnnualCardCzk: number;
  in100AnnualCardCzk: number;
  in100MonthlyEquivalentCzk: number;
  defaultWorkingWeeksPerYear: number;
}

export const CASE_STUDY_LISTING: SrealityListingSnapshot = {
  id: '3449294924',
  sourceUrl: 'https://www.sreality.cz/detail/prodej/byt/2+1/lovosice-lovosice-terezinska/3449294924',
  title: 'Prodej bytu 2+1 53 m², Terezínská, Lovosice',
  priceCzk: 3190000,
  priceCzkPerSqm: 60189,
  layout: '2+1 s balkonem',
  usableAreaSqm: 53,
  totalAreaSqm: 53.45,
  cellarAreaSqm: 4.7,
  floor: 2,
  totalFloors: 4,
  buildingType: 'Smíšená (zateplený dům po revitalizaci)',
  buildingCondition: 'Dobrý / Velmi udržovaný stav',
  ownership: 'Osobní',
  energyRating: 'C - Úsporná',
  hasBalcony: true,
  hasCellar: true,
  hasElevator: false,
  heatingType: 'Dálkové ústřední vytápění a ohřev TUV',
  hoaRepairFundCzk: 1400,
  orientation: 'Jižní orientace oken (obou pokojů i kuchyně)',
  description:
    'Ve výhradním zastoupení majitelů vám nabízíme ke koupi byt v osobním vlastnictví o dispozici 2+1 s balkonem. Celková výměra podle prohlášení vlastníka včetně sklepa (bez balkonu) je 53,45 m2. Byt se nachází ve 2. NP čtyřpatrového domu starší bytové zástavby v Lovosicích, ulici Terezínská.\n\nByt je v původním, přesto velmi udržovaném stavu. Je kompletně vyklizený, nově vymalovaný a pro nenáročné zájemce je připravený k okamžitému nastěhování. Pro ostatní představuje skvělou příležitost k rekonstrukci a vytvoření moderního domova podle vlastních představ. Vzhledem k lokalitě je byt vhodný také jako zajímavá investiční příležitost.\n\nVelkou předností bytu je jižní orientace oken obou pokojů i kuchyně, která zaručuje dostatek slunečního světla po celý den. Vytápění a ohřev teplé vody jsou zajištěny z dálkového zdroje. Aktuální fond oprav je necelých 1.400 Kč a v nejbližší době se nepředpokládá zvyšování. K bytu náleží prostorná sklepní kóje (4,7 m2). Samotný dům je ve velmi udržovaném stavu, prošel kompletní revitalizací (zateplení, plastová okna, nová fasáda) a spadá do energetické třídy C.\n\nTato lokalita nabízí perfektní zázemí. Veškerá občanská vybavenost, jako jsou obchody, škola, školka, zdravotnická zařízení i restaurace, je v docházkové vzdálenosti. Skvělá je také dopravní dostupnost díky nedalekému vlakovému a autobusovému nádraží.',
  images: [
    {
      url: './images/case-study/01-dum-fasada.webp',
      caption: 'Revitalizovaný bytový dům s vyznačeným bytem a balkonem v 2. NP (třída PENB C)',
    },
    {
      url: './images/case-study/02-pudorys-3d.webp',
      caption: '3D půdorys bytu 2+1 (53 m²) – dva samostatné neprůchozí pokoje a oddělená kuchyně',
    },
    {
      url: './images/case-study/03-obyvaci-pokoj.webp',
      caption: 'Prosluněný obývací pokoj s jižní orientací, parketami a vstupem na balkon',
    },
    {
      url: './images/case-study/04-druhy-pokoj.webp',
      caption: 'Druhý samostatný pokoj / ložnice (ideální pro spolubydlícího za 6 000 Kč/měs.)',
    },
    {
      url: './images/case-study/05-kuchyn.webp',
      caption: 'Kuchyně s jídelním koutem a výhledem do zeleně',
    },
    {
      url: './images/case-study/06-chodba.webp',
      caption: 'Vstupní chodba s vestavěnými úložnými prostory a přístupy do všech místností',
    },
    {
      url: './images/case-study/07-koupelna.webp',
      caption: 'Koupelna s vanou, umyvadlem a keramickým obkladem',
    },
    {
      url: './images/case-study/08-wc.webp',
      caption: 'Samostatná toaleta se servisní skříňkou',
    },
  ],
};

export const CASE_STUDY_LOCATION: VerifiedLocationData = {
  address: 'Terezínská 351/83, 410 02 Lovosice',
  svjName: 'SVJ Terezínská 351',
  apartmentCoords: [50.5129, 14.0568],
  stationCoords: [50.5112, 14.0575],
  walkingDistanceMeters: 210,
  walkingMinutes: 3,
  walkingRouteNote: '210 m po rovině přes ulici Nádražní přímo do nádražní haly',
  // Verified walking polyline between station and apartment building entrance
  routePolyline: [
    [50.5112, 14.0575], // Lovosice nádraží vestibulu
    [50.5115, 14.0572], // Přednádražní prostor
    [50.5121, 14.0570], // Ulice Nádražní
    [50.5126, 14.0569], // Křižovatka s Terezínskou
    [50.5129, 14.0568], // Vchod Terezínská 351/83
  ],
};

export const CASE_STUDY_RAIL: RailConnectionData = {
  trainLine: 'R20 Labe (rychlík)',
  carrier: 'České dráhy',
  destination: 'Praha hl.n.',
  durationMinutes: 68,
  lastDirectTrainFromPrague: '23:41',
  peakFrequencyNote: 'Přímý rychlík každých 60 min, posilové vlaky ve špičce každých 30 min',
  regularSingleTripCzk: 169, // Jedna cesta plné jízdné bez karty
  in50SingleTripCzk: 84.5,   // S In Kartou 50 stojí jedna cesta polovinu (84,50 Kč)
  in50ReturnTripCzk: 169,    // Tam a zpět s In Kartou 50 = 169 Kč
  in50AnnualCardCzk: 3200,   // Roční poplatek za aplikaci IN 50
  in100AnnualCardCzk: 22000, // Celoroční síťová jízdenka IN 100
  in100MonthlyEquivalentCzk: 1833,
  defaultWorkingWeeksPerYear: 46,
};
