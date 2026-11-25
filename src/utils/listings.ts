import { ApartmentSize, HousingMode, Listing, Station } from '../types';
import { getStationPricePerSqm } from './calculations';

// Simple deterministic hash for PRNG seeding
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Simple seeded Linear Congruential Generator
function createSeededRandom(seed: number) {
  let current = seed;
  return function () {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
}

const CONDITIONS = [
  { label: 'Novostavba', factor: 1.07 },
  { label: 'Po rekonstrukci', factor: 1.04 },
  { label: 'Udržovaný stav', factor: 0.97 },
  { label: 'Před rekonstrukcí', factor: 0.93 },
];

const TEMPLATES = [
  {
    layout: '2+kk',
    area: 52,
    titles: [
      'Světlý byt 2+kk s lodžií',
      'Moderní 2+kk kousek od nádraží',
      'Praktický byt 2+kk s výhledem',
      'Útulný byt 2+kk v klidné čtvrti',
    ],
  },
  {
    layout: '3+1',
    area: 68,
    titles: [
      'Prostorný rodinný byt 3+1',
      'Kompletně zařízený byt 3+1',
      'Byt 3+1 s balkonem a sklepem',
      'Slunný cihlový byt 3+1',
    ],
  },
  {
    layout: '1+kk',
    area: 36,
    titles: [
      'Kompaktní startovací byt 1+kk',
      'Útulná garsoniéra v cihlovém domě',
      'Nově zrekonstruovaný 1+kk',
      'Nízkonákladový byt 1+kk',
    ],
  },
  {
    layout: '3+kk',
    area: 74,
    titles: [
      'Nový byt 3+kk s terasou',
      'Stylový 3+kk v centru',
      'Komfortní 3+kk po rekonstrukci',
      'Reprezentativní 3+kk u parku',
    ],
  },
];

function mapLayoutToSizeTier(layout: string): ApartmentSize {
  if (layout === '1+kk') return 30;
  if (layout === '2+kk') return 45;
  return 70;
}

export function generateStationListings(station: Station, mode: HousingMode): Listing[] {
  const seed = hashCode(`${station.id}_${mode}_listings`);
  const rng = createSeededRandom(seed);

  // We generate 3 listings with distinct layouts and realistic Czech titles
  const listings: Listing[] = [];
  const chosenIndices = [2, 0, 3]; // 1+kk, 2+kk, 3+kk

  chosenIndices.forEach((templateIdx, i) => {
    const template = TEMPLATES[templateIdx % TEMPLATES.length];
    const condition = CONDITIONS[Math.floor(rng() * CONDITIONS.length)];
    const title = template.titles[Math.floor(rng() * template.titles.length)];

    // Slight variance in area (+/- 4 sqm)
    const areaVariation = Math.floor(rng() * 9) - 4;
    const areaSqm = template.area + areaVariation;

    // Layout-specific unit price tier (1+kk vs 2+kk vs 3+kk) adjusted by condition
    const sizeTierPricePerSqm = getStationPricePerSqm(station, mode, mapLayoutToSizeTier(template.layout));
    const pricePerSqm = Math.round(sizeTierPricePerSqm * condition.factor);

    let totalPrice = Math.round(pricePerSqm * areaSqm);
    if (mode === 'buy') {
      // Round to nearest 50 000 Kč
      totalPrice = Math.round(totalPrice / 50000) * 50000;
    } else {
      // Round to nearest 100 Kč
      totalPrice = Math.round(totalPrice / 100) * 100;
    }

    // Walking minutes: 3 to 14 min
    const walkingMinutes = 3 + Math.floor(rng() * 12);

    listings.push({
      id: `${station.id}-${mode}-${i}`,
      title,
      layout: template.layout,
      areaSqm,
      price: totalPrice,
      pricePerSqm,
      walkingMinutes,
      condition: condition.label,
      mode,
    });
  });

  return listings;
}
