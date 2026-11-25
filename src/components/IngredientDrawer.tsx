import { useEffect } from 'react';
import { Leaf, MapPin, ShieldCheck, X } from 'lucide-react';
import { Product } from '../types';

interface IngredientDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IngredientDrawer({ product, isOpen, onClose }: IngredientDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2421]/30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Sheet on #FAF8F3 with ambient herbarium shadow */}
      <aside className="relative z-10 w-full max-w-lg bg-[#FAF8F3] border-l border-[#D8CEBC] shadow-herbarium flex flex-col h-full">
        <div className="px-6 py-5 border-b border-[#D8CEBC] flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
              Ingredient Transparency Ledger
            </p>
            <h2
              id="ingredient-drawer-title"
              className="font-serif text-2xl font-medium text-[#1F2421] mt-1"
            >
              {product.name}
            </h2>
            <p className="text-xs text-[#5C5850] mt-1 tabular-nums">
              Batch {product.batchId} <span aria-hidden="true">·</span> {product.compounds.length}{' '}
              Verified Botanicals
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ingredient drawer"
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center border border-[#D8CEBC] rounded-[4px] text-[#1F2421] hover:bg-[#EFE9DD] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Raw Compound Breakdown */}
          <div className="border border-[#D8CEBC] rounded-lg divide-y divide-[#D8CEBC] bg-[#F7F4EE]">
            {product.compounds.map((compound) => (
              <div key={compound.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1F2421]">
                      {compound.commonName}
                    </h3>
                    <p className="font-serif italic text-sm text-[#2E5A27]">
                      {compound.latinName}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#1E3F20] tabular-nums shrink-0">
                    {compound.percentage}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2 border-t border-[#D8CEBC]/70 text-xs">
                  <div>
                    <span className="block uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                      Origin
                    </span>
                    <span className="text-[#1F2421] inline-flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#4E8A3C]" aria-hidden="true" />
                      {compound.origin}
                    </span>
                  </div>
                  <div>
                    <span className="block uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                      Plant Part
                    </span>
                    <span className="text-[#1F2421] block mt-0.5">{compound.partUsed}</span>
                  </div>
                  <div>
                    <span className="block uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                      Extraction
                    </span>
                    <span className="text-[#1F2421] block mt-0.5">{compound.extraction}</span>
                  </div>
                  <div>
                    <span className="block uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                      Harvest Date
                    </span>
                    <span className="text-[#1F2421] tabular-nums block mt-0.5">
                      {compound.harvestDate} ({compound.batchCode})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5C5850] pt-1">
                  Purity note: {compound.purityNote}
                </p>
              </div>
            ))}
          </div>

          {/* Packaging & Certification Spec */}
          <div className="border border-[#D8CEBC] rounded-lg bg-[#EFE9DD] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#1E3F20]">
              <ShieldCheck className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-serif text-base font-medium">Zero-Waste Vessel &amp; Marks</h3>
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4 py-1.5 border-b border-[#D8CEBC]">
                <dt className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">Vessel</dt>
                <dd className="text-right text-[#1F2421] max-w-[260px]">
                  {product.packagingSpec.vessel}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-[#D8CEBC]">
                <dt className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  Closure
                </dt>
                <dd className="text-right text-[#1F2421] max-w-[260px]">
                  {product.packagingSpec.closure}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5">
                <dt className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  End of Life
                </dt>
                <dd className="text-right text-[#1F2421] max-w-[260px]">
                  {product.packagingSpec.endOfLife}
                </dd>
              </div>
            </dl>

            <div className="pt-2 flex flex-wrap gap-2">
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1E3F20]"
                >
                  <Leaf className="w-3 h-3 text-[#4E8A3C]" aria-hidden="true" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#D8CEBC] bg-[#F7F4EE] flex items-center justify-between gap-4">
          <span className="text-xs text-[#5C5850]">100% disclosed botanical compound weights</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27]"
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  );
}
