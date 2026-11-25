import { useMemo, useState } from 'react';
import { ArrowRight, Compass, Factory, MapPin, PackageCheck } from 'lucide-react';
import { PRODUCTS } from '../data/apothecary';
import { BotanicalCompound, Product } from '../types';
import { ResilientImage } from './ResilientImage';

interface IndiaSourcingMapProps {
  onSelectProduct: (product: Product) => void;
  compact?: boolean;
}

interface SourcingRegion {
  id: string;
  name: string;
  state: string;
  terrain: string;
  x: number;
  y: number;
  isHub?: boolean;
  matchOrigins: string[];
  labelPosition: 'left' | 'right' | 'top' | 'bottom';
}

const SOURCING_REGIONS: SourcingRegion[] = [
  {
    id: 'himachal',
    name: 'Kullu Valley',
    state: 'Himachal Pradesh',
    terrain: 'Western Himalayan Cedar Belt · 1,800m',
    x: 148,
    y: 84,
    matchOrigins: ['Kullu Valley, Himachal'],
    labelPosition: 'left',
  },
  {
    id: 'uttarakhand',
    name: 'Almora & Kumaon Foothills',
    state: 'Uttarakhand',
    terrain: 'High-Altitude Holy Basil Terraces · 1,650m',
    x: 180,
    y: 106,
    matchOrigins: ['Uttarakhand Foothills, India', 'Almora Terraces, India', 'Kumaon Valley, India'],
    labelPosition: 'right',
  },
  {
    id: 'uttar-pradesh',
    name: 'Kannauj & Pratapgarh',
    state: 'Uttar Pradesh',
    terrain: 'Ganga Watershed Roots & Copper-Deg Stills',
    x: 204,
    y: 152,
    matchOrigins: ['Pratapgarh Orchards, India', 'Kannauj Watershed, UP'],
    labelPosition: 'bottom',
  },
  {
    id: 'darjeeling',
    name: 'Kurseong Slopes',
    state: 'Darjeeling, West Bengal',
    terrain: 'Eastern Himalayan First-Flush Tea Gardens',
    x: 282,
    y: 142,
    matchOrigins: ['Kurseong Slopes, Darjeeling'],
    labelPosition: 'bottom',
  },
  {
    id: 'central-deccan',
    name: 'Nagpur & Central Deccan',
    state: 'Central India / Vidarbha',
    terrain: 'Dry-Land Shikakai Groves & Citrus Orchards',
    x: 176,
    y: 218,
    matchOrigins: ['Central Deccan Farms, India', 'Nagpur Citrus Groves, India'],
    labelPosition: 'right',
  },
  {
    id: 'pune-hub',
    name: 'Hinjawadi Phase 3, Pune',
    state: 'Maharashtra · Apothecary Lab & Hub',
    terrain: 'Small-Batch Blending, Batch Coding & Bio-Ferments',
    x: 114,
    y: 268,
    isHub: true,
    matchOrigins: ['Maharashtra Bio-Lab, India'],
    labelPosition: 'left',
  },
  {
    id: 'karnataka',
    name: 'Mysuru & Coorg Cooperative',
    state: 'Karnataka',
    terrain: 'Sustainable Heartwood & Coconut Glucosides',
    x: 138,
    y: 338,
    matchOrigins: ['Karnataka Cooperative, India', 'Marayoor & Mysuru Plantations'],
    labelPosition: 'left',
  },
  {
    id: 'tamil-nadu',
    name: 'Nilgiris, Coimbatore & Madurai',
    state: 'Tamil Nadu',
    terrain: 'Sunrise Jasmine Plains & Cold-Pressed Citrus Hills',
    x: 160,
    y: 386,
    matchOrigins: [
      'Nilgiri Hills, India',
      'Madurai Plains, Tamil Nadu',
      'Coimbatore Organic Collective, TN',
    ],
    labelPosition: 'right',
  },
];

const PUNE_HUB = SOURCING_REGIONS.find((r) => r.id === 'pune-hub')!;

interface RegionRecord {
  region: SourcingRegion;
  entries: Array<{
    compound: BotanicalCompound;
    product: Product;
  }>;
  uniqueProducts: Product[];
}

function getBackLabelPreview(product: Product): string | null {
  const backLabel = product.galleryImages?.find(
    (g) => g.label.includes('Back Label') || g.label.includes('Spec')
  );
  return backLabel?.src ?? null;
}

export function IndiaSourcingMap({ onSelectProduct, compact = false }: IndiaSourcingMapProps) {
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('uttar-pradesh');

  const regionRecords: RegionRecord[] = useMemo(() => {
    return SOURCING_REGIONS.map((region) => {
      const entries: Array<{ compound: BotanicalCompound; product: Product }> = [];
      for (const product of PRODUCTS) {
        if (selectedProductFilter !== 'all' && product.id !== selectedProductFilter) {
          continue;
        }
        for (const compound of product.compounds) {
          if (region.matchOrigins.includes(compound.origin)) {
            entries.push({ compound, product });
          }
        }
      }
      const uniqueProducts: Product[] = [];
      for (const entry of entries) {
        if (!uniqueProducts.some((p) => p.id === entry.product.id)) {
          uniqueProducts.push(entry.product);
        }
      }
      return { region, entries, uniqueProducts };
    });
  }, [selectedProductFilter]);

  const activeRegionRecord = useMemo(() => {
    const chosen = regionRecords.find((r) => r.region.id === selectedRegionId);
    if (chosen && (chosen.entries.length > 0 || chosen.region.isHub)) {
      return chosen;
    }
    return regionRecords.find((r) => r.entries.length > 0) ?? regionRecords[0];
  }, [regionRecords, selectedRegionId]);

  const handleSelectProductFilter = (productId: string) => {
    setSelectedProductFilter(productId);
    if (productId !== 'all') {
      const prod = PRODUCTS.find((p) => p.id === productId);
      const firstCompoundOrigin = prod?.compounds[0]?.origin;
      const matchedRegion = SOURCING_REGIONS.find(
        (r) => firstCompoundOrigin && r.matchOrigins.includes(firstCompoundOrigin)
      );
      if (matchedRegion) {
        setSelectedRegionId(matchedRegion.id);
      }
    }
  };

  const activeFormulation =
    selectedProductFilter !== 'all'
      ? PRODUCTS.find((p) => p.id === selectedProductFilter) ?? null
      : null;

  return (
    <section
      aria-labelledby="traceability-map-heading"
      className="space-y-6"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#2E5A27]">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Full Batch Traceability · India Sourcing Atlas</span>
          </div>
          <h2
            id="traceability-map-heading"
            className={`font-serif font-medium text-[#1F2421] ${
              compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
            }`}
          >
            From Indian Watersheds to Hinjawadi Phase 3, Pune
          </h2>
          <p className="text-sm sm:text-base text-[#5C5850] leading-relaxed">
            Every Mini Meadow label prints its batch code and origin. Select a formulation or click
            any regional marker on the map to trace where each botanical is harvested before
            small-batch blending in Pune.
          </p>
        </div>

        <div className="text-xs text-[#5C5850] border border-[#D8CEBC] rounded-[6px] bg-[#EFE9DD]/75 px-4 py-2.5 shrink-0">
          <span className="block font-semibold uppercase tracking-[0.06em] text-[#1E3F20]">
            Blending &amp; Dispatch Facility
          </span>
          <span>Mini Meadow · Hinjawadi Phase 3, Pune - 411057</span>
        </div>
      </div>

      {/* Product Image Filter Strip (uses actual user product photos) */}
      <div className="space-y-2">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
          Filter Map by Mini Meadow Formulation
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSelectProductFilter('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-[4px] border transition-colors cursor-pointer ${
              selectedProductFilter === 'all'
                ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                : 'bg-[#FAF8F3] text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
            }`}
          >
            All 7 Formulations (8 Regions)
          </button>

          {PRODUCTS.map((product) => {
            const active = selectedProductFilter === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProductFilter(product.id)}
                className={`inline-flex items-center gap-2 pr-3 pl-1.5 py-1.5 text-xs font-semibold rounded-[4px] border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                    : 'bg-[#FAF8F3] text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
                }`}
              >
                <span className="w-6 h-6 rounded-[3px] overflow-hidden border border-[#D8CEBC]/70 bg-[#EFE9DD] shrink-0">
                  <ResilientImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </span>
                <span className="whitespace-nowrap">
                  {product.name.replace(' Eau de Parfum', '').replace('Plant-Based ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 12-Column Split: Left India Cartographic SVG / Right Batch Traceability Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Simplified Geographical Map of India */}
        <div className="lg:col-span-6 bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs border-b border-[#D8CEBC] pb-3">
            <span className="font-semibold uppercase tracking-[0.06em] text-[#1E3F20]">
              Botanical Harvest Map · India
            </span>
            <span className="text-[#5C5850] tabular-nums">
              {regionRecords.filter((r) => r.entries.length > 0).length} Active Sourcing Zones
            </span>
          </div>

          <div className="relative w-full aspect-[420/460] max-h-[480px] mx-auto bg-[#FAF8F3] border border-[#D8CEBC] rounded-[6px] overflow-hidden">
            <svg
              viewBox="0 0 420 460"
              role="img"
              aria-label="Simplified geographical map of India showing Mini Meadow botanical sourcing regions connected to Hinjawadi Phase 3, Pune"
              className="w-full h-full select-none"
            >
              {/* Subtle Herbarium Graticule Grid */}
              <g stroke="#D8CEBC" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.65">
                <line x1="0" y1="90" x2="420" y2="90" />
                <line x1="0" y1="180" x2="420" y2="180" />
                <line x1="0" y1="270" x2="420" y2="270" />
                <line x1="0" y1="360" x2="420" y2="360" />
                <line x1="105" y1="0" x2="105" y2="460" />
                <line x1="210" y1="0" x2="210" y2="460" />
                <line x1="315" y1="0" x2="315" y2="460" />
              </g>

              {/* Compass & Ocean Labels */}
              <text
                x="28"
                y="348"
                fill="#8C867A"
                fontSize="8.5"
                letterSpacing="0.14em"
                className="uppercase font-sans"
              >
                ARABIAN SEA
              </text>
              <text
                x="252"
                y="348"
                fill="#8C867A"
                fontSize="8.5"
                letterSpacing="0.14em"
                className="uppercase font-sans"
              >
                BAY OF BENGAL
              </text>

              {/* Simplified Cartographic Silhouette of India */}
              <path
                d="M145 22 L185 36 L194 64 L182 86 L202 112 L262 136 L276 118 L288 132 L335 128 L376 114 L392 138 L368 178 L354 212 L340 204 L326 178 L294 176 L294 212 L266 248 L226 294 L200 344 L188 384 L162 428 L138 388 L122 342 L110 304 L98 262 L94 234 L78 240 L42 228 L36 206 L56 196 L44 184 L78 148 L96 112 L114 88 L118 48 Z"
                fill="#EFE9DD"
                stroke="#8C867A"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Subtle Topographic / Watershed Contour Guides */}
              <path
                d="M132 68 Q170 84 205 118 M124 252 Q178 242 240 248 M124 316 Q155 322 184 352"
                fill="none"
                stroke="#D8CEBC"
                strokeWidth="1"
                strokeDasharray="2 3"
              />

              {/* Supply Route Arcs from Active Harvest Regions to Pune Hub */}
              {regionRecords.map(({ region, entries }) => {
                if (region.isHub) return null;
                const hasData = entries.length > 0;
                const isSelected = activeRegionRecord.region.id === region.id;
                if (!hasData && selectedProductFilter !== 'all') return null;

                const midX = (region.x + PUNE_HUB.x) / 2 - 14;
                const midY = (region.y + PUNE_HUB.y) / 2;

                return (
                  <path
                    key={`route-${region.id}`}
                    d={`M ${region.x} ${region.y} Q ${midX} ${midY} ${PUNE_HUB.x} ${PUNE_HUB.y}`}
                    fill="none"
                    stroke={isSelected ? '#1E3F20' : hasData ? '#4E8A3C' : '#D8CEBC'}
                    strokeWidth={isSelected ? 2 : 1.15}
                    strokeDasharray={isSelected ? '5 3' : '3 4'}
                    opacity={isSelected ? 0.95 : hasData ? 0.65 : 0.35}
                  />
                );
              })}

              {/* Interactive Regional Markers */}
              {regionRecords.map(({ region, entries }) => {
                const isActive = activeRegionRecord.region.id === region.id;
                const isIncludedInFilter = entries.length > 0 || Boolean(region.isHub);

                const labelOffsets: Record<
                  SourcingRegion['labelPosition'],
                  { dx: number; dy: number; anchor: 'start' | 'end' | 'middle' }
                > = {
                  left: { dx: -11, dy: 3, anchor: 'end' },
                  right: { dx: 11, dy: 3, anchor: 'start' },
                  top: { dx: 0, dy: -11, anchor: 'middle' },
                  bottom: { dx: 0, dy: 15, anchor: 'middle' },
                };
                const lbl = labelOffsets[region.labelPosition];

                return (
                  <g
                    key={region.id}
                    transform={`translate(${region.x}, ${region.y})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${region.name}, ${region.state} (${entries.length} botanical batches)`}
                    onClick={() => setSelectedRegionId(region.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedRegionId(region.id);
                      }
                    }}
                    className="cursor-pointer focus:outline-none"
                    opacity={isIncludedInFilter ? 1 : 0.35}
                  >
                    {/* Pulse Halo when selected */}
                    {isActive && (
                      <circle
                        r={region.isHub ? 15 : 13}
                        fill="#4E8A3C"
                        opacity="0.2"
                      />
                    )}

                    {/* Pin Circle */}
                    {region.isHub ? (
                      <>
                        <circle
                          r="8"
                          fill={isActive ? '#1E3F20' : '#6B4F35'}
                          stroke="#FAF8F3"
                          strokeWidth="2"
                        />
                        <circle r="3" fill="#FAF8F3" />
                      </>
                    ) : (
                      <circle
                        r={isActive ? 7 : 5.5}
                        fill={isActive ? '#1E3F20' : '#2E5A27'}
                        stroke="#FAF8F3"
                        strokeWidth="1.8"
                      />
                    )}

                    {/* Pin Label */}
                    <text
                      x={lbl.dx}
                      y={lbl.dy}
                      textAnchor={lbl.anchor}
                      fontSize={isActive ? '9.5' : '8.5'}
                      fontWeight={isActive ? '700' : '600'}
                      fill={isActive ? '#1E3F20' : '#1F2421'}
                      className="font-sans"
                    >
                      {region.isHub ? 'Pune Hub' : region.name.split(' & ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-[#5C5850]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E5A27] inline-block" />
                <span>Harvest Origin</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6B4F35] inline-block" />
                <span>Pune Bottling Hub</span>
              </span>
            </div>
            <span>Click any marker or region pill below</span>
          </div>
        </div>

        {/* Right: Region Batch Traceability & Formulation Imagery Dossier */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#D8CEBC] rounded-lg p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-5">
            {/* Quick Region Switcher Strip */}
            <div className="flex flex-wrap gap-1.5 pb-4 border-b border-[#D8CEBC]">
              {regionRecords.map(({ region, entries }) => {
                const isActive = activeRegionRecord.region.id === region.id;
                const enabled = entries.length > 0 || Boolean(region.isHub);
                if (!enabled) return null;
                return (
                  <button
                    key={`btn-${region.id}`}
                    type="button"
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] border cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                        : 'bg-[#F7F4EE] text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
                    }`}
                  >
                    {region.isHub ? 'Pune Hub' : region.state.split(' · ')[0]} ({entries.length})
                  </button>
                );
              })}
            </div>

            {/* Active Region Heading */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                {activeRegionRecord.region.isHub ? (
                  <Factory className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{activeRegionRecord.region.state}</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#1F2421]">
                {activeRegionRecord.region.name}
              </h3>
              <p className="text-xs text-[#5C5850]">{activeRegionRecord.region.terrain}</p>
            </div>

            {/* Harvested Botanical Batches in this Region */}
            {activeRegionRecord.entries.length > 0 ? (
              <div className="border border-[#D8CEBC] rounded-[6px] bg-[#EFE9DD]/55 divide-y divide-[#D8CEBC]">
                {activeRegionRecord.entries.map(({ compound, product }) => (
                  <div key={`${product.id}-${compound.id}`} className="p-3.5 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2421]">
                          {compound.commonName}
                        </p>
                        <p className="font-serif italic text-xs text-[#2E5A27]">
                          {compound.latinName} · {compound.partUsed}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#1E3F20] tabular-nums shrink-0">
                        Batch {compound.batchCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C5850]">
                      <span>
                        {compound.extraction} · {compound.harvestMethod}
                      </span>
                      <span className="tabular-nums">
                        Harvested {compound.harvestDate} · {compound.percentage} formula share
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-[#D8CEBC] rounded-[6px] bg-[#EFE9DD]/55 text-xs text-[#5C5850] leading-relaxed">
                All regional harvests travel to Mini Meadow’s Hinjawadi Phase 3, Pune facility for
                small-batch blending, unbleached kraft carton &amp; amber glass bottling, and
                individual batch coding.
              </div>
            )}

            {/* Formulations & User Packaging Artwork linked to this Region */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#5C5850]">
                <span className="font-semibold uppercase tracking-[0.06em]">
                  {activeFormulation
                    ? 'Filtered Formulation & Label Proof'
                    : 'Formulations Using This Origin'}
                </span>
                <span className="inline-flex items-center gap-1 text-[#1E3F20] font-medium">
                  <PackageCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Verified Batch Print</span>
                </span>
              </div>

              <div className="space-y-2.5">
                {(activeFormulation
                  ? [activeFormulation]
                  : activeRegionRecord.uniqueProducts.length > 0
                    ? activeRegionRecord.uniqueProducts
                    : PRODUCTS.slice(0, 2)
                ).map((product) => {
                  const backLabel = getBackLabelPreview(product);
                  return (
                    <div
                      key={product.id}
                      className="p-3 rounded-[6px] border border-[#D8CEBC] bg-[#F7F4EE] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-[4px] overflow-hidden border border-[#D8CEBC] bg-[#EFE9DD] shrink-0">
                          <ResilientImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {backLabel && (
                          <div className="w-12 h-12 rounded-[4px] overflow-hidden border border-[#D8CEBC] bg-[#FAF8F3] shrink-0 hidden sm:block">
                            <ResilientImage
                              src={backLabel}
                              alt={`${product.name} printed batch label`}
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-serif text-sm font-semibold text-[#1F2421] truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#5C5850] truncate">
                            Batch {product.batchId} · {product.packagingSpec.labelMaterial}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1E3F20] border border-[#1E3F20] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer shrink-0"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Packaging End-of-Life Note */}
          <div className="pt-3 border-t border-[#D8CEBC] flex items-center justify-between gap-2 text-xs text-[#5C5850]">
            <span>All batches packed in unbleached kraft &amp; glass</span>
            <span className="font-medium text-[#1E3F20]">Zero Plastic Dispatch</span>
          </div>
        </div>
      </div>
    </section>
  );
}
