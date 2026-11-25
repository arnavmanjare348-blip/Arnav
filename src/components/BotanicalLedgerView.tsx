import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { PRODUCTS } from '../data/apothecary';
import { Product, ProductCategory } from '../types';
import { IndiaSourcingMap } from './IndiaSourcingMap';

interface BotanicalLedgerViewProps {
  onSelectProduct: (product: Product) => void;
}

export function BotanicalLedgerView({ onSelectProduct }: BotanicalLedgerViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProductCategory>('All');

  const ledgerRows = useMemo(() => {
    const rows = PRODUCTS.flatMap((product) =>
      product.compounds.map((compound) => ({
        compound,
        product,
      }))
    );

    return rows.filter(({ compound, product }) => {
      const matchesCat = categoryFilter === 'All' || product.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        compound.commonName.toLowerCase().includes(q) ||
        compound.latinName.toLowerCase().includes(q) ||
        compound.origin.toLowerCase().includes(q) ||
        product.name.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const categories: Array<'All' | ProductCategory> = [
    'All',
    'Perfumes',
    'Hair & Body',
    'Home Care',
    'Infusions',
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Editorial Intro */}
      <section className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E5A27]">
          Full Compound Traceability
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#1F2421] leading-tight">
          Mini Meadow Botanical &amp; Origin Ledger
        </h1>
        <p className="text-base text-[#5C5850] leading-relaxed">
          Every herb, plant-derived surfactant, flower resin, and cold-pressed seed oil used by
          Mini Meadow is cataloged below by Latin binomial, harvest region, extraction method,
          and batch harvest date.
        </p>
      </section>

      {/* Interactive Geographical Sourcing Map */}
      <IndiaSourcingMap compact onSelectProduct={onSelectProduct} />

      {/* Filter & Search Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-[#D8CEBC] pb-2">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by formulation category">
          {categories.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-[4px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                    : 'bg-transparent text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="w-4 h-4 text-[#8C867A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search botanical or Latin name..."
            aria-label="Search botanical compounds"
            className="w-full pl-10 pr-3.5 py-2 text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
          />
        </div>
      </section>

      {/* Ledger Table (Desktop) & Cards (Mobile) */}
      {ledgerRows.length === 0 ? (
        <div className="border border-[#D8CEBC] rounded-lg bg-[#EFE9DD] p-12 text-center space-y-2">
          <p className="font-serif text-xl text-[#1F2421]">No matching botanical records</p>
          <p className="text-sm text-[#5C5850]">
            Adjust your category filter or search term to inspect all verified harvests.
          </p>
        </div>
      ) : (
        <section className="border border-[#D8CEBC] rounded-lg bg-[#FAF8F3] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D8CEBC] bg-[#EFE9DD] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  <th className="py-3.5 px-5">Botanical &amp; Latin Binomial</th>
                  <th className="py-3.5 px-5">Harvest Origin</th>
                  <th className="py-3.5 px-5">Extraction &amp; Part</th>
                  <th className="py-3.5 px-5">Batch &amp; Date</th>
                  <th className="py-3.5 px-5 text-right">Formulation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8CEBC] text-sm">
                {ledgerRows.map(({ compound, product }) => (
                  <tr
                    key={`${product.id}-${compound.id}`}
                    className="hover:bg-[#EFE9DD]/45 transition-colors"
                  >
                    <td className="py-4 px-5 align-top">
                      <p className="font-medium text-[#1F2421]">{compound.commonName}</p>
                      <p className="font-serif italic text-xs text-[#2E5A27] mt-0.5">
                        {compound.latinName}
                      </p>
                    </td>
                    <td className="py-4 px-5 align-top text-[#1F2421]">
                      <p>{compound.origin}</p>
                      <p className="text-xs text-[#5C5850] mt-0.5">{compound.harvestMethod}</p>
                    </td>
                    <td className="py-4 px-5 align-top text-[#1F2421]">
                      <p>{compound.extraction}</p>
                      <p className="text-xs text-[#5C5850] mt-0.5">{compound.partUsed}</p>
                    </td>
                    <td className="py-4 px-5 align-top tabular-nums text-xs text-[#1F2421]">
                      <p className="font-semibold text-[#1E3F20]">{compound.batchCode}</p>
                      <p className="text-[#5C5850] mt-0.5">{compound.harvestDate}</p>
                    </td>
                    <td className="py-4 px-5 align-top text-right">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3F20] hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                      >
                        <span>{product.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
