import { useState } from 'react';
import { ArrowLeft, Check, FlaskConical, Layers, Leaf, Minus, Plus, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';
import { RitualTimer } from './RitualTimer';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToBag: (productId: string, variantId: string, quantity: number) => void;
  onOpenIngredients: (product: Product) => void;
  onOpenLayeringStudio?: (perfumeIds: string[]) => void;
}

const COMPLEMENTARY_PAIRING: Record<string, string> = {
  'vetiver-cedar-edp': 'tulsi-neroli-edp',
  'tulsi-neroli-edp': 'vetiver-cedar-edp',
  'jasmine-sandalwood-edp': 'moringa-white-tea-edp',
  'moringa-white-tea-edp': 'jasmine-sandalwood-edp',
};

export function ProductDetailView({
  product,
  onBack,
  onAddToBag,
  onOpenIngredients,
  onOpenLayeringStudio,
}: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

  const galleryItems =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [
          {
            label: product.imageCropOrigin ? 'Bottle Spotlight' : 'Front & Back Pack',
            src: product.image,
            cropOrigin: product.imageCropOrigin,
          },
        ];

  const activeGallery = galleryItems[activeGalleryIndex] ?? galleryItems[0];
  const isLabelArtwork =
    activeGallery.label.includes('Label') || activeGallery.label.includes('Spec');

  const handleAdd = () => {
    onAddToBag(product.id, selectedVariant.id, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Back */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3F20] hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to All Formulations</span>
        </button>
      </div>

      {/* 12-Column Split: Left Sticky Gallery / Right Contiguous Purchase Module */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Sticky Vessel Imagery & Label Spec Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-4 space-y-3">
            <div
              className={`aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-[#D8CEBC] ${
                isLabelArtwork ? 'bg-[#FAF8F3]' : 'bg-[#F7F4EE]'
              }`}
            >
              <ResilientImage
                src={activeGallery.src}
                alt={`${product.name} — ${activeGallery.label}`}
                fallbackTitle={product.name}
                style={
                  activeGallery.cropOrigin
                    ? {
                        transform: 'scale(2.15)',
                        transformOrigin: activeGallery.cropOrigin,
                      }
                    : undefined
                }
                className={`w-full h-full transition-transform duration-300 ${
                  isLabelArtwork ? 'object-contain p-2' : 'object-cover'
                }`}
              />
            </div>

            {galleryItems.length > 1 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-[#5C5850]">
                  <span className="font-semibold uppercase tracking-[0.06em]">
                    Inspect Vessel &amp; Labels
                  </span>
                  <span>{activeGallery.label}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {galleryItems.map((item, idx) => {
                    const isActive = idx === activeGalleryIndex;
                    const itemIsLabel =
                      item.label.includes('Label') || item.label.includes('Spec');
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`group text-left rounded-[4px] border overflow-hidden cursor-pointer transition-colors ${
                          isActive
                            ? 'border-[#1E3F20] ring-1 ring-[#1E3F20] bg-[#FAF8F3]'
                            : 'border-[#D8CEBC] bg-[#F7F4EE] hover:border-[#2E5A27]'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF8F3]">
                          <ResilientImage
                            src={item.src}
                            alt={item.label}
                            style={
                              item.cropOrigin
                                ? {
                                    transform: 'scale(2.15)',
                                    transformOrigin: item.cropOrigin,
                                  }
                                : undefined
                            }
                            className={`w-full h-full ${
                              itemIsLabel ? 'object-contain p-0.5' : 'object-cover'
                            }`}
                          />
                        </div>
                        <span
                          className={`block px-1.5 py-1 text-[10px] font-semibold truncate ${
                            isActive ? 'bg-[#1E3F20] text-[#F7F4EE]' : 'text-[#1F2421]'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 border border-[#D8CEBC] rounded-lg bg-[#EFE9DD]/60 divide-x divide-[#D8CEBC] text-xs">
            <div className="p-3.5">
              <span className="block uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                Harvest Origin
              </span>
              <span className="text-[#1F2421] font-medium block mt-1">
                {product.originSummary}
              </span>
            </div>
            <div className="p-3.5">
              <span className="block uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                Aroma Profile
              </span>
              <span className="text-[#1F2421] font-medium block mt-1">{product.aromaProfile}</span>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#D8CEBC] pb-5">
            <div className="flex items-center justify-between gap-4 text-xs text-[#5C5850] uppercase tracking-[0.06em] font-semibold">
              <span>
                {product.category} <span aria-hidden="true">·</span> {product.tag}
              </span>
              <span className="tabular-nums">Batch {product.batchId}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1F2421] leading-tight">
              {product.name}
            </h1>

            <p className="font-serif italic text-base text-[#2E5A27]">{product.latinSubtitle}</p>
          </div>

          <p className="text-base text-[#1F2421] leading-relaxed">{product.editorialStory}</p>

          {/* Olfactory Pyramid (shown for Eau de Parfums) */}
          {product.olfactoryNotes && (
            <div className="border border-[#D8CEBC] rounded-[6px] bg-[#FAF8F3] divide-y divide-[#D8CEBC] text-xs">
              <div className="px-4 py-2.5 flex justify-between gap-4">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  Top Notes
                </span>
                <span className="text-right text-[#1F2421] font-medium">
                  {product.olfactoryNotes.top}
                </span>
              </div>
              <div className="px-4 py-2.5 flex justify-between gap-4">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  Heart Notes
                </span>
                <span className="text-right text-[#1F2421] font-medium">
                  {product.olfactoryNotes.heart}
                </span>
              </div>
              <div className="px-4 py-2.5 flex justify-between gap-4">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  Base Notes
                </span>
                <span className="text-right text-[#1F2421] font-medium">
                  {product.olfactoryNotes.base}
                </span>
              </div>
              <div className="px-4 py-2.5 flex justify-between gap-4 bg-[#EFE9DD]/50">
                <span className="font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
                  Wear &amp; Concentration
                </span>
                <span className="text-right text-[#1E3F20] font-semibold tabular-nums">
                  {product.olfactoryNotes.longevity}
                </span>
              </div>
            </div>
          )}

          {/* Variant Selector */}
          <div className="space-y-2.5">
            <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
              Vessel &amp; Size
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.variants.map((variant) => {
                const isSelected = variant.id === selectedVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`text-left p-3.5 rounded-[4px] border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                        : 'bg-[#F7F4EE] text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{variant.label}</span>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatINR(variant.price)}
                      </span>
                    </div>
                    <span
                      className={`block text-xs mt-1 ${
                        isSelected ? 'text-[#C5EDC1]' : 'text-[#5C5850]'
                      }`}
                    >
                      {variant.weightOrVolume}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price, Stepper & Primary Add to Bag */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between border-y border-[#D8CEBC] py-4">
              <div>
                <span className="block text-xs uppercase tracking-[0.06em] text-[#5C5850] font-semibold">
                  Selected Total (Incl. Taxes)
                </span>
                <span className="text-2xl font-semibold text-[#1F2421] tabular-nums">
                  {formatINR(selectedVariant.price * quantity)}
                </span>
              </div>

              <div className="inline-flex items-center border border-[#D8CEBC] rounded-[4px] bg-[#F7F4EE]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-[#1F2421] hover:bg-[#EFE9DD] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold tabular-nums text-[#1F2421]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="p-2.5 text-[#1F2421] hover:bg-[#EFE9DD] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[4px] cursor-pointer transition-all duration-150 hover:bg-[#2E5A27] hover:-translate-y-px"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag — {formatINR(selectedVariant.price * quantity)}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenIngredients(product)}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold bg-transparent text-[#1E3F20] border-[1.5px] border-[#1E3F20] rounded-[4px] cursor-pointer transition-colors hover:bg-[#F7F4EE] whitespace-nowrap shrink-0"
              >
                <FlaskConical className="w-4 h-4" aria-hidden="true" />
                <span>Ingredient Ledger</span>
              </button>
            </div>

            {product.category === 'Perfumes' && onOpenLayeringStudio && (
              <button
                type="button"
                onClick={() =>
                  onOpenLayeringStudio([
                    product.id,
                    COMPLEMENTARY_PAIRING[product.id] ?? 'tulsi-neroli-edp',
                  ])
                }
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold bg-[#FAF8F3] text-[#1E3F20] border border-[#D8CEBC] rounded-[4px] cursor-pointer transition-colors hover:border-[#1E3F20]"
              >
                <Layers className="w-4 h-4 text-[#2E5A27]" aria-hidden="true" />
                <span>Visualize Layering with Another Mini Meadow Perfume</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Packaging Back Metaphor: Spec Grid Card */}
      <section aria-labelledby="spec-grid-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
              Packaging Back Specification
            </p>
            <h2
              id="spec-grid-heading"
              className="font-serif text-2xl sm:text-3xl font-medium text-[#1F2421]"
            >
              Botanicals &amp; Zero-Waste Architecture
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenIngredients(product)}
            className="text-sm font-semibold text-[#1E3F20] hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
          >
            View full origin &amp; batch dates
          </button>
        </div>

        <div className="border border-[#D8CEBC] rounded-lg bg-[#FAF8F3] grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#D8CEBC]">
          <div className="lg:col-span-6 p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1E3F20]">
              <Leaf className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-serif text-lg font-medium">Key Botanical Compounds</h3>
            </div>
            <div className="divide-y divide-[#D8CEBC] border-t border-[#D8CEBC]">
              {product.compounds.map((c) => (
                <div key={c.id} className="py-3 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#1F2421]">{c.commonName}</p>
                    <p className="font-serif italic text-xs text-[#2E5A27]">
                      {c.latinName} · {c.origin}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#1E3F20] tabular-nums shrink-0">
                    {c.percentage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1E3F20]">
              <ShieldCheck className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              <h3 className="font-serif text-lg font-medium">Packaging &amp; Compost Spec</h3>
            </div>
            <dl className="divide-y divide-[#D8CEBC] border-t border-[#D8CEBC] text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.06em] font-semibold text-[#5C5850]">
                  Primary Vessel
                </dt>
                <dd className="text-right text-[#1F2421] max-w-xs">{product.packagingSpec.vessel}</dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.06em] font-semibold text-[#5C5850]">
                  Label &amp; Ink
                </dt>
                <dd className="text-right text-[#1F2421] max-w-xs">
                  {product.packagingSpec.labelMaterial}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.06em] font-semibold text-[#5C5850]">
                  End of Life
                </dt>
                <dd className="text-right text-[#1F2421] max-w-xs">
                  {product.packagingSpec.endOfLife}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Product-Specific Interactive Ritual Guide */}
      <section aria-label="Product preparation ritual">
        <RitualTimer
          title={`${product.name} Ritual`}
          subtitle={product.latinSubtitle}
          durationSeconds={product.ritualDurationSeconds}
          steps={product.ritualSteps}
        />
      </section>
    </main>
  );
}
