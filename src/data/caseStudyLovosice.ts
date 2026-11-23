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
  in50AnnualCardCzk: number;
  in50SingleTripCzk: number;
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
      url: 'https://d18-a.sdn.cz/d_18/c_img_qG_A/kcKfrMAkFnIwlW2kIAr1Vz/195a.jpeg?fl=res,1200,800,1|shr,,20|jpg,80',
      caption: 'Světlý obývací pokoj s jižní orientací a balkonem',
    },
    {
      url: 'https://d18-a.sdn.cz/d_18/c_img_qG_A/nCR9NVflLCsdQ6PhEIAr1WV/f218.jpeg?fl=res,1200,800,1|shr,,20|jpg,80',
      caption: 'Kuchyně s jídelním koutem a výhledem do zeleně',
    },
    {
      url: 'https://d18-a.sdn.cz/d_18/c_img_qG_A/kcKfrMAkFCHDToSO0IAr1Wv/30b1.jpeg?fl=res,1200,800,1|shr,,20|jpg,80',
      caption: 'Neprůchozí ložnice / samostatný pokoj vhodný k pronájmu',
    },
    {
      url: 'https://d18-a.sdn.cz/d_18/c_img_qG_A/nCR9NVflLBaEbFOOgIAr1XK/bbcc.jpeg?fl=res,1200,800,1|shr,,20|jpg,80',
      caption: 'Vstupní chodba s přístupy do všech místností',
    },
    {
      url: 'https://d18-a.sdn.cz/d_18/c_img_qG_A/nCR9NVflLCnfP0oRSIAr1Xp/8bc7.jpeg?fl=res,1200,800,1|shr,,20|jpg,80',
      caption: 'Revitalizovaný bytový dům s novou fasádou a zateplením (třída C)',
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
  in50AnnualCardCzk: 3200,
  in50SingleTripCzk: 169, // Zpáteční jízdenka s 50% slevou IN 50
  in100AnnualCardCzk: 22000,
  in100MonthlyEquivalentCzk: 1833,
  defaultWorkingWeeksPerYear: 46,
};
