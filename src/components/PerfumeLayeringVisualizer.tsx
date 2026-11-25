import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  Droplets,
  Layers,
  Loader2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { PRODUCTS } from '../data/apothecary';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

export type LayeringRatio = 'balanced' | 'base-heavy' | 'veil-heavy';

interface PerfumeLayeringVisualizerProps {
  selectedPerfumeIds: string[];
  compact?: boolean;
  onChangePerfumeIds?: (ids: string[]) => void;
  onAddLayerSetToBag?: (perfumeIds: string[], variantSize: '50ml' | '100ml') => void;
  onOpenFullStudio?: (ids: string[]) => void;
  onInspectProduct?: (product: Product) => void;
}

const ALL_PERFUMES = PRODUCTS.filter((p) => p.category === 'Perfumes');

function getPerfumeFrontLabelSrc(product: Product): string {
  const frontLabel = product.galleryImages?.find((g) => g.label.includes('Front Label'));
  return frontLabel?.src ?? product.image;
}

function uniqueNotes(noteStrings: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of noteStrings) {
    for (const part of line.split(',')) {
      const cleaned = part.trim();
      const key = cleaned.toLowerCase();
      if (cleaned && !seen.has(key)) {
        seen.add(key);
        result.push(cleaned);
      }
    }
  }
  return result;
}

function getVariantIdForSize(product: Product, size: '50ml' | '100ml'): string {
  const match = product.variants.find((v) => v.id.endsWith(size));
  return match?.id ?? product.variants[0].id;
}

export function PerfumeLayeringVisualizer({
  selectedPerfumeIds,
  compact = false,
  onChangePerfumeIds,
  onAddLayerSetToBag,
  onOpenFullStudio,
  onInspectProduct,
}: PerfumeLayeringVisualizerProps) {
  const [orderedIds, setOrderedIds] = useState<string[]>(selectedPerfumeIds);
  const [ratio, setRatio] = useState<LayeringRatio>('balanced');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bundleSize, setBundleSize] = useState<'50ml' | '100ml'>('50ml');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setOrderedIds((prev) => {
      const stillValid = prev.filter((id) => selectedPerfumeIds.includes(id));
      const newlyAdded = selectedPerfumeIds.filter((id) => !stillValid.includes(id));
      const next = [...stillValid, ...newlyAdded];
      if (next.length === prev.length && next.every((id, idx) => id === prev[idx])) {
        return prev;
      }
      return next;
    });
  }, [selectedPerfumeIds]);

  const orderedPerfumes = useMemo(
    () =>
      orderedIds
        .map((id) => ALL_PERFUMES.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [orderedIds]
  );

  // Reset AI summary when layer order, perfumes, or ratio change
  useEffect(() => {
    setAiSummary(null);
    setAiError(null);
  }, [orderedIds, ratio]);

  const combinedNotes = useMemo(() => {
    const top = uniqueNotes(orderedPerfumes.map((p) => p.olfactoryNotes?.top ?? ''));
    const heart = uniqueNotes(orderedPerfumes.map((p) => p.olfactoryNotes?.heart ?? ''));
    const base = uniqueNotes(orderedPerfumes.map((p) => p.olfactoryNotes?.base ?? ''));
    const traits = uniqueNotes(
      orderedPerfumes.map((p) => p.aromaProfile.split('·').map((s) => s.trim()).join(', '))
    );
    return { top, heart, base, traits };
  }, [orderedPerfumes]);

  const handleSwapOrder = () => {
    if (orderedIds.length < 2) return;
    const next = [...orderedIds];
    const first = next.shift();
    if (first) next.push(first);
    setOrderedIds(next);
    onChangePerfumeIds?.(next);
  };

  const handleTogglePerfumeInStudio = (id: string) => {
    const exists = orderedIds.includes(id);
    if (exists) {
      if (orderedIds.length <= 2) return; // keep at least 2 perfumes active
      const next = orderedIds.filter((item) => item !== id);
      setOrderedIds(next);
      onChangePerfumeIds?.(next);
    } else {
      if (orderedIds.length >= 4) return;
      const next = [...orderedIds, id];
      setOrderedIds(next);
      onChangePerfumeIds?.(next);
    }
  };

  const handleGenerateSummary = async () => {
    if (orderedPerfumes.length < 2 || isGenerating) return;
    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch('/api/layering-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfumeIds: orderedPerfumes.map((p) => p.id),
          ratio,
        }),
      });
      const data = (await response.json()) as { summary?: string; error?: string };
      if (!response.ok || !data.summary) {
        setAiError(data.error ?? 'Could not generate a layering summary right now.');
        return;
      }
      setAiSummary(data.summary);
    } catch {
      setAiError('Network error while connecting to Mini Meadow perfumer service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddBundle = () => {
    if (!onAddLayerSetToBag || orderedPerfumes.length < 2) return;
    onAddLayerSetToBag(
      orderedPerfumes.map((p) => p.id),
      bundleSize
    );
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  const bundlePrice = orderedPerfumes.reduce((sum, p) => {
    const variantId = getVariantIdForSize(p, bundleSize);
    const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
    return sum + variant.price;
  }, 0);

  if (orderedPerfumes.length < 2) {
    return null;
  }

  const ratioLabelMap: Record<LayeringRatio, { title: string; sprays: string }> = {
    balanced: {
      title: 'Balanced 1:1',
      sprays: '2 mists Base + 2 mists Veil',
    },
    'base-heavy': {
      title: 'Base-Heavy 2:1',
      sprays: '3 mists Base + 1 mist Veil',
    },
    'veil-heavy': {
      title: 'Airy Veil 1:2',
      sprays: '1 mist Base + 3 mists Veil',
    },
  };

  return (
    <section
      aria-label="Perfume Layering Visualizer"
      className={`border border-[#D8CEBC] rounded-lg bg-[#FAF8F3] ${
        compact ? 'p-4 space-y-4' : 'p-6 sm:p-8 space-y-6'
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D8CEBC] pb-3.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2E5A27]">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Scent Layering Architecture</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1F2421]">
            {orderedPerfumes.length === 2
              ? `${orderedPerfumes[0].name.replace(' Eau de Parfum', '')} × ${orderedPerfumes[1].name.replace(' Eau de Parfum', '')}`
              : `${orderedPerfumes.length}-Scent Custom Accord`}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleSwapOrder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E3F20] bg-[#EFE9DD] border border-[#D8CEBC] rounded-[4px] hover:border-[#1E3F20] cursor-pointer"
        >
          <ArrowDownUp className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Cycle Layer Order</span>
        </button>
      </div>

      {/* Studio Perfume Multi-Picker (full view only) */}
      {!compact && onChangePerfumeIds && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#5C5850]">
            <span className="font-semibold uppercase tracking-[0.06em]">
              Select 2 to 4 Eau de Parfums to Layer
            </span>
            <span className="tabular-nums">{orderedPerfumes.length} of 4 active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ALL_PERFUMES.map((perfume) => {
              const activeIndex = orderedIds.indexOf(perfume.id);
              const isSelected = activeIndex !== -1;
              return (
                <button
                  key={perfume.id}
                  type="button"
                  onClick={() => handleTogglePerfumeInStudio(perfume.id)}
                  className={`text-left p-3 rounded-[6px] border transition-colors cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#EFE9DD] border-[#1E3F20] text-[#1F2421]'
                      : 'bg-[#F7F4EE] border-[#D8CEBC] text-[#5C5850] hover:border-[#2E5A27]'
                  }`}
                >
                  <div className="w-12 h-14 rounded-[4px] overflow-hidden border border-[#D8CEBC] bg-[#FAF8F3] shrink-0">
                    <ResilientImage
                      src={getPerfumeFrontLabelSrc(perfume)}
                      alt={`${perfume.name} label`}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                        {isSelected
                          ? activeIndex === 0
                            ? 'Layer 01 · Base'
                            : `Layer 0${activeIndex + 1} · Veil`
                          : 'Add Scent'}
                      </span>
                      {!isSelected && <Plus className="w-3.5 h-3.5 text-[#1E3F20]" />}
                    </div>
                    <p className="font-serif text-sm font-medium text-[#1F2421] truncate mt-0.5">
                      {perfume.name.replace(' Eau de Parfum', '')}
                    </p>
                    <p className="text-[11px] text-[#5C5850] truncate">{perfume.tag}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Stacked Layers Card */}
      <div className="space-y-2.5">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
          Application Order &amp; Accord Stack
        </span>
        <div className="border border-[#D8CEBC] rounded-[6px] bg-[#EFE9DD]/55 divide-y divide-[#D8CEBC]">
          {orderedPerfumes.map((perfume, idx) => {
            const isBase = idx === 0;
            const barWidthPct =
              ratio === 'balanced'
                ? Math.round(100 / orderedPerfumes.length)
                : ratio === 'base-heavy'
                  ? isBase
                    ? 60
                    : Math.round(40 / (orderedPerfumes.length - 1))
                  : isBase
                    ? 25
                    : Math.round(75 / (orderedPerfumes.length - 1));

            return (
              <div
                key={perfume.id}
                className={`p-3 flex items-center gap-3 ${compact ? '' : 'sm:p-4 sm:gap-4'}`}
              >
                <div
                  className={`${
                    compact ? 'w-12 h-14' : 'w-14 h-16'
                  } rounded-[4px] overflow-hidden border border-[#D8CEBC] bg-[#FAF8F3] shrink-0`}
                >
                  <ResilientImage
                    src={getPerfumeFrontLabelSrc(perfume)}
                    alt={`${perfume.name} front botanical label`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#1E3F20]">
                      Layer 0{idx + 1} · {isBase ? 'Anchor Base (Spray First)' : 'Upper Veil (Mist Over)'}
                    </span>
                    <span className="text-[11px] font-semibold tabular-nums text-[#5C5850]">
                      {barWidthPct}% accord share
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-sm sm:text-base font-medium text-[#1F2421] truncate">
                      {perfume.name.replace(' Eau de Parfum', '')}
                    </p>
                    {!compact && onInspectProduct && (
                      <button
                        type="button"
                        onClick={() => onInspectProduct(perfume)}
                        className="text-xs font-medium text-[#1E3F20] hover:underline shrink-0 cursor-pointer"
                      >
                        Inspect Flacon
                      </button>
                    )}
                  </div>

                  <div className="h-1.5 w-full bg-[#D8CEBC] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isBase ? 'bg-[#1E3F20]' : idx === 1 ? 'bg-[#4E8A3C]' : 'bg-[#6B4F35]'
                      }`}
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ratio Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#5C5850]">
          <span className="font-semibold uppercase tracking-[0.06em]">Mist Ratio Balance</span>
          <span>{ratioLabelMap[ratio].sprays}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['balanced', 'base-heavy', 'veil-heavy'] as LayeringRatio[]).map((r) => {
            const active = ratio === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRatio(r)}
                className={`py-2 px-2 text-xs font-semibold rounded-[4px] border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                    : 'bg-[#F7F4EE] text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
                }`}
              >
                {ratioLabelMap[r].title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Combined Olfactory Pyramid Summary */}
      <div className="border border-[#D8CEBC] rounded-[6px] bg-[#F7F4EE] divide-y divide-[#D8CEBC] text-xs">
        <div className="px-3.5 py-2.5 flex items-center justify-between bg-[#EFE9DD]/60">
          <span className="font-semibold uppercase tracking-[0.06em] text-[#1E3F20]">
            Combined Notes Summary
          </span>
          <span className="text-[#5C5850] font-medium">
            {combinedNotes.traits.slice(0, 4).join(' · ')}
          </span>
        </div>

        <div className="px-3.5 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-3">
          <span className="sm:col-span-3 font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
            Opening Top
          </span>
          <span className="sm:col-span-9 text-[#1F2421] font-medium leading-relaxed">
            {combinedNotes.top.join(' · ')}
          </span>
        </div>

        <div className="px-3.5 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-3">
          <span className="sm:col-span-3 font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
            Merged Heart
          </span>
          <span className="sm:col-span-9 text-[#1F2421] font-medium leading-relaxed">
            {combinedNotes.heart.join(' · ')}
          </span>
        </div>

        <div className="px-3.5 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-3">
          <span className="sm:col-span-3 font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
            Dry-Down Base
          </span>
          <span className="sm:col-span-9 text-[#1F2421] font-medium leading-relaxed">
            {combinedNotes.base.join(' · ')}
          </span>
        </div>

        <div className="px-3.5 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-3 bg-[#EFE9DD]/35">
          <span className="sm:col-span-3 font-semibold uppercase tracking-[0.06em] text-[#2E5A27] flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ritual Order</span>
          </span>
          <span className="sm:col-span-9 text-[#5C5850] leading-relaxed">
            Mist <strong className="text-[#1F2421]">{orderedPerfumes[0].name.replace(' Eau de Parfum', '')}</strong>{' '}
            onto pulse points from 15 cm, wait 30 seconds without rubbing, then veil{' '}
            <strong className="text-[#1F2421]">
              {orderedPerfumes
                .slice(1)
                .map((p) => p.name.replace(' Eau de Parfum', ''))
                .join(' & ')}
            </strong>{' '}
            over top ({ratioLabelMap[ratio].sprays}).
          </span>
        </div>
      </div>

      {/* Bespoke AI Perfumer Layering Summary */}
      <div className="space-y-2.5">
        {aiSummary ? (
          <div className="p-4 rounded-[6px] border border-[#2E5A27]/40 bg-[#EFE9DD] space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#1E3F20]">
                <Sparkles className="w-3.5 h-3.5 text-[#2E5A27]" aria-hidden="true" />
                <span>Mini Meadow Perfumer Note</span>
              </span>
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="text-[11px] font-semibold text-[#1E3F20] hover:underline cursor-pointer disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#1F2421] leading-relaxed">{aiSummary}</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] hover:bg-[#2E5A27] disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Composing Layering Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Generate Combined Layering Summary</span>
                </>
              )}
            </button>

            {compact && onOpenFullStudio && (
              <button
                type="button"
                onClick={() => onOpenFullStudio(orderedIds)}
                className="inline-flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border border-[#1E3F20] text-[#1E3F20] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer"
              >
                <span>Layer Studio</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {aiError && (
          <p role="alert" className="text-xs text-[#93000A] bg-[#FFDAD6] px-3 py-2 rounded-[4px]">
            {aiError}
          </p>
        )}
      </div>

      {/* Add Layered Pair/Set to Bag (full Studio mode) */}
      {!compact && onAddLayerSetToBag && (
        <div className="pt-4 border-t border-[#D8CEBC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850]">
              Flacon Edition:
            </span>
            <div className="inline-flex border border-[#D8CEBC] rounded-[4px] bg-[#F7F4EE] p-0.5">
              <button
                type="button"
                onClick={() => setBundleSize('50ml')}
                className={`px-3 py-1 text-xs font-semibold rounded-[3px] cursor-pointer ${
                  bundleSize === '50ml' ? 'bg-[#1E3F20] text-[#F7F4EE]' : 'text-[#1F2421]'
                }`}
              >
                50 ml Kraft (₹499 ea)
              </button>
              <button
                type="button"
                onClick={() => setBundleSize('100ml')}
                className={`px-3 py-1 text-xs font-semibold rounded-[3px] cursor-pointer ${
                  bundleSize === '100ml' ? 'bg-[#1E3F20] text-[#F7F4EE]' : 'text-[#1F2421]'
                }`}
              >
                100 ml Flacon (₹999 ea)
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBundle}
            className="inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] hover:bg-[#2E5A27] cursor-pointer tabular-nums"
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Layered Set Added to Bag</span>
              </>
            ) : (
              <span>
                Add {orderedPerfumes.length}-Scent Layer Set — {formatINR(bundlePrice)}
              </span>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
