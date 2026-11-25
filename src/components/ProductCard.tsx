import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (productId: string, variantId: string) => void;
}

export function ProductCard({ product, onSelectProduct, onQuickAdd }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const defaultVariant = product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product.id, defaultVariant.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectProduct(product);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
      className="group flex flex-col bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
    >
      {/* Subtle inner hairline framed image slot */}
      <div className="p-3 pb-0">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-[#D8CEBC]/80 bg-[#F7F4EE]">
          <ResilientImage
            src={product.image}
            alt={product.imageAlt}
            fallbackTitle={product.name}
            style={
              product.imageCropOrigin
                ? {
                    transform: 'scale(2.15)',
                    transformOrigin: product.imageCropOrigin,
                  }
                : undefined
            }
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Editorial Product Body */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5C5850] tracking-wide mb-1.5">
          <span>
            {product.category} <span aria-hidden="true">·</span> {product.tag}
          </span>
          <span className="tabular-nums">{product.batchId}</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1F2421] leading-snug group-hover:text-[#1E3F20] transition-colors">
          {product.name}
        </h3>

        <p className="font-serif italic text-sm text-[#2E5A27] mt-0.5">
          {product.latinSubtitle}
        </p>

        <p className="text-sm text-[#5C5850] leading-relaxed mt-2.5 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Bottom-aligned Spec & INR Price + Add Action */}
        <div className="mt-5 pt-3.5 border-t border-[#D8CEBC] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[#5C5850]">{defaultVariant.weightOrVolume}</p>
            <p className="text-base font-semibold text-[#1F2421] tabular-nums mt-0.5">
              {formatINR(defaultVariant.price)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[4px] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 hover:bg-[#2E5A27] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
