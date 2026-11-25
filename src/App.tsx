import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Layers, Leaf, Package, Recycle, Search, Sprout } from 'lucide-react';
import { BagDrawer } from './components/BagDrawer';
import { BotanicalLedgerView } from './components/BotanicalLedgerView';
import { BotanicalQuizView } from './components/BotanicalQuizView';
import { CustomerCareWidget } from './components/CustomerCareWidget';
import { Footer } from './components/Footer';
import { Header, MiniMeadowSprout, type AppView } from './components/Header';
import { IndiaSourcingMap } from './components/IndiaSourcingMap';
import { IngredientDrawer } from './components/IngredientDrawer';
import { PerfumeLayeringVisualizer } from './components/PerfumeLayeringVisualizer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { ResilientImage } from './components/ResilientImage';
import { RitualTimer } from './components/RitualTimer';
import { HERO_IMAGE, PERFUME_LINEUP_IMAGE, PRODUCTS } from './data/apothecary';
import { CartItem, OrderReceipt, Product, ProductCategory } from './types';

const STORAGE_CART_KEY = 'minimeadow_cart_v1';
const STORAGE_ORDERS_KEY = 'minimeadow_orders_v1';

function loadValidCart(): CartItem[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_CART_KEY);
    if (!saved) {
      return [{ productId: 'herbal-shampoo-bar', variantId: 'shampoo-100g', quantity: 1 }];
    }
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof (item as CartItem).productId !== 'string' ||
        typeof (item as CartItem).variantId !== 'string' ||
        typeof (item as CartItem).quantity !== 'number' ||
        (item as CartItem).quantity <= 0 ||
        (item as CartItem).quantity > 99
      ) {
        return false;
      }
      const product = PRODUCTS.find((p) => p.id === (item as CartItem).productId);
      return Boolean(product?.variants.some((v) => v.id === (item as CartItem).variantId));
    });
  } catch {
    return [{ productId: 'herbal-shampoo-bar', variantId: 'shampoo-100g', quantity: 1 }];
  }
}

function loadValidOrders(): OrderReceipt[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (o): o is OrderReceipt =>
        Boolean(o) &&
        typeof o === 'object' &&
        typeof (o as OrderReceipt).orderNumber === 'string' &&
        typeof (o as OrderReceipt).total === 'number' &&
        Array.isArray((o as OrderReceipt).items)
    );
  } catch {
    return [];
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [activeCategory, setActiveCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRitualProductId, setActiveRitualProductId] = useState<string>(PRODUCTS[0].id);

  const [cartItems, setCartItems] = useState<CartItem[]>(loadValidCart);
  const [orders, setOrders] = useState<OrderReceipt[]>(loadValidOrders);
  const [unlockedPromoCode, setUnlockedPromoCode] = useState<string | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [ingredientDrawerProduct, setIngredientDrawerProduct] = useState<Product | null>(null);
  const [layeringPerfumeIds, setLayeringPerfumeIds] = useState<string[]>([
    'vetiver-cedar-edp',
    'tulsi-neroli-edp',
  ]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore storage quota errors
    }
  }, [orders]);

  const bagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCat = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.latinSubtitle.toLowerCase().includes(q) ||
        product.aromaProfile.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const activeRitualProduct =
    PRODUCTS.find((p) => p.id === activeRitualProductId) ?? PRODUCTS[0];

  const handleNavigateHome = (sectionId?: string) => {
    setActiveView('home');
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateLedger = () => {
    setActiveView('ledger');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateQuiz = () => {
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLayeringStudio = (ids?: string[]) => {
    if (ids && ids.length >= 2) {
      setLayeringPerfumeIds(ids);
    }
    setActiveView('layering');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToBag = (productId: string, variantId: string, quantity = 1) => {
    const safeQty = Math.min(99, Math.max(1, Math.floor(quantity)));
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(99, item.quantity + safeQty) }
            : item
        );
      }
      return [...prev, { productId, variantId, quantity: safeQty }];
    });
  };

  const handleUpdateQuantity = (productId: string, variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(99, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const categories: Array<'All' | ProductCategory> = [
    'All',
    'Perfumes',
    'Hair & Body',
    'Home Care',
    'Infusions',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1F2421]">
      <Header
        activeView={activeView}
        bagCount={bagCount}
        onNavigateHome={handleNavigateHome}
        onNavigateLedger={handleNavigateLedger}
        onNavigateQuiz={handleNavigateQuiz}
        onOpenBag={() => setIsBagOpen(true)}
      />

      {activeView === 'product' && (
        <div className="flex-1">
          <ProductDetailView
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => handleNavigateHome('formulations')}
            onAddToBag={handleAddToBag}
            onOpenIngredients={(p) => setIngredientDrawerProduct(p)}
            onOpenLayeringStudio={handleOpenLayeringStudio}
          />
        </div>
      )}

      {activeView === 'ledger' && (
        <div className="flex-1">
          <BotanicalLedgerView onSelectProduct={handleSelectProduct} />
        </div>
      )}

      {activeView === 'quiz' && (
        <div className="flex-1">
          <BotanicalQuizView
            onSelectProduct={handleSelectProduct}
            onAddToBag={handleAddToBag}
            onUnlockPromo={(code) => setUnlockedPromoCode(code)}
          />
        </div>
      )}

      {activeView === 'layering' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8CEBC] pb-6">
            <div className="space-y-2 max-w-2xl">
              <button
                type="button"
                onClick={() => handleNavigateHome('formulations')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3F20] hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Formulations</span>
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27] pt-2">
                Mini Meadow Perfumery
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1F2421]">
                Botanical Perfume Layering Studio
              </h1>
              <p className="text-sm sm:text-base text-[#5C5850] leading-relaxed">
                Combine two or more Mini Meadow Eau de Parfums to preview their stacked Top,
                Heart, and Base notes, tune the mist ratio, and compose a layering summary.
              </p>
            </div>
          </div>

          <PerfumeLayeringVisualizer
            selectedPerfumeIds={layeringPerfumeIds}
            onChangePerfumeIds={setLayeringPerfumeIds}
            onInspectProduct={handleSelectProduct}
            onAddLayerSetToBag={(ids, variantSize) => {
              for (const perfumeId of ids) {
                const perfume = PRODUCTS.find((p) => p.id === perfumeId);
                const variant =
                  perfume?.variants.find((v) => v.id.endsWith(variantSize)) ?? perfume?.variants[0];
                if (perfume && variant) {
                  handleAddToBag(perfume.id, variant.id, 1);
                }
              }
              setIsBagOpen(true);
            }}
          />
        </main>
      )}

      {activeView === 'home' && (
        <main className="flex-1">
          {/* Section 1: Storefront Hero Split + 4-Column Packaging Spec Row */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Editorial Focal Anchor with Mini Meadow Brand Lockup */}
              <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6 space-y-6">
                <div className="inline-flex items-center gap-3">
                  <MiniMeadowSprout className="w-7 h-7 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E5A27]">
                      Mini Meadow <span aria-hidden="true">·</span> Zero-Plastic Botanical Care
                    </p>
                    <p className="font-serif italic text-sm text-[#5C5850]">
                      Small Products. Big Changes. A Greener Tomorrow.
                    </p>
                  </div>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-[#1F2421] leading-[1.12] tracking-[-0.02em]">
                  Botanical Eau de Parfums &amp; daily essentials in kraft and glass.
                </h1>

                <p className="text-base sm:text-lg text-[#5C5850] leading-relaxed max-w-xl">
                  From small-batch Vetiver &amp; Jasmine Eau de Parfums to AYUSH-compliant
                  Shikakai shampoo bars and organic Tulsi infusions—crafted cleanly in India.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNavigateHome('formulations')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[4px] cursor-pointer transition-all duration-150 hover:bg-[#2E5A27] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
                  >
                    <span>Explore Formulations</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNavigateQuiz}
                    className="inline-flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-[1.5px] border-[#1E3F20] text-[#1E3F20] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer"
                  >
                    <span>Take Scent &amp; Ritual Quiz</span>
                  </button>
                </div>
              </div>

              {/* Hero Media Framed on Pressed Oatmeal Kraft */}
              <div className="lg:col-span-6">
                <div
                  onClick={() => {
                    setActiveCategory('Perfumes');
                    handleNavigateHome('formulations');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveCategory('Perfumes');
                      handleNavigateHome('formulations');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Explore Mini Meadow Botanical Eau de Parfum Collection"
                  className="h-full bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-3.5 flex flex-col cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-[#D8CEBC] bg-[#1F2421]">
                    <ResilientImage
                      src={PERFUME_LINEUP_IMAGE}
                      alt="Mini Meadow Botanical Eau de Parfum Quartet: Vetiver and Cedar, Tulsi and Neroli, Jasmine and Sandalwood, Moringa and White Tea"
                      fallbackTitle="Mini Meadow Botanical Eau de Parfum Collection"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                  </div>
                  <div className="pt-3 flex items-center justify-between text-xs text-[#5C5850]">
                    <span className="font-serif italic text-[#2E5A27]">
                      Botanical Eau de Parfum Quartet · 50 ml &amp; 100 ml
                    </span>
                    <span className="tabular-nums">From ₹499</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Column Packaging Spec Bar directly below Hero Split */}
            <div className="mt-10 border border-[#D8CEBC] rounded-lg bg-[#EFE9DD]/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D8CEBC]">
              <div className="p-5 flex items-start gap-3">
                <Recycle
                  className="w-4 h-4 text-[#2E5A27] stroke-[1.5] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-serif text-base font-medium text-[#1F2421]">
                    100% Zero Plastic
                  </h2>
                  <p className="text-xs text-[#5C5850] mt-1 leading-relaxed">
                    Unbleached kraft cartons and refillable glass replace disposable plastics.
                  </p>
                </div>
              </div>

              <div className="p-5 flex items-start gap-3">
                <Sprout
                  className="w-4 h-4 text-[#2E5A27] stroke-[1.5] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-serif text-base font-medium text-[#1F2421]">
                    Botanical Eau de Parfums
                  </h2>
                  <p className="text-xs text-[#5C5850] mt-1 leading-relaxed">
                    Copper-distilled Kannauj vetiver, Madurai jasmine &amp; Mysuru sandalwood.
                  </p>
                </div>
              </div>

              <div className="p-5 flex items-start gap-3">
                <Leaf
                  className="w-4 h-4 text-[#2E5A27] stroke-[1.5] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-serif text-base font-medium text-[#1F2421]">
                    Biodegradable &amp; Safe
                  </h2>
                  <p className="text-xs text-[#5C5850] mt-1 leading-relaxed">
                    Pet- and child-safe home care free from synthetic dyes or harsh fumes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigateHome('batch-traceability')}
                className="p-5 flex items-start gap-3 text-left hover:bg-[#FAF8F3]/60 transition-colors cursor-pointer"
              >
                <Package
                  className="w-4 h-4 text-[#2E5A27] stroke-[1.5] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-serif text-base font-medium text-[#1F2421] underline decoration-[#D8CEBC] underline-offset-4">
                    Full Batch Traceability
                  </h2>
                  <p className="text-xs text-[#5C5850] mt-1 leading-relaxed">
                    Explore our India sourcing map, Latin nomenclature, and batch dates on every pack.
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* Section 2: Featured Collection Grid */}
          <section
            id="formulations"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#D8CEBC] space-y-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                  Mini Meadow Shelf
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1F2421]">
                    Small-Batch Formulations
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleOpenLayeringStudio()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E3F20] bg-[#EFE9DD] border border-[#D8CEBC] rounded-[4px] hover:border-[#1E3F20] cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#2E5A27]" aria-hidden="true" />
                    <span>Perfume Layering Studio</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs + Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div
                  className="flex flex-wrap items-center gap-1.5"
                  role="group"
                  aria-label="Filter formulations by category"
                >
                  {categories.map((cat) => {
                    const active = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
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

                <div className="relative w-full sm:w-56">
                  <Search
                    className="w-4 h-4 text-[#8C867A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter herbs or scents..."
                    aria-label="Search formulations"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
                  />
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="border border-[#D8CEBC] rounded-lg bg-[#EFE9DD] p-12 text-center space-y-3">
                <p className="font-serif text-xl text-[#1F2421]">No matching formulations</p>
                <p className="text-sm text-[#5C5850]">
                  Clear your search query or select All to view the complete Mini Meadow shelf.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectProduct}
                    onQuickAdd={(productId, variantId) =>
                      handleAddToBag(productId, variantId, 1)
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* Section 2.5: Geographical Batch Traceability Map */}
          <section
            id="batch-traceability"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#D8CEBC]"
          >
            <IndiaSourcingMap onSelectProduct={handleSelectProduct} />
          </section>

          {/* Section 3: Interactive Quiz Callout + Ritual Guide */}
          <section
            id="ritual-guide"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#D8CEBC] space-y-8"
          >
            {/* Interactive Quiz Consultation Strip */}
            <div className="bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="w-20 h-16 rounded-[4px] overflow-hidden border border-[#D8CEBC] shrink-0 hidden sm:block bg-[#F7F4EE]">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt="Mini Meadow Herbal Shampoo Bar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                    Apothecary Consultation &amp; Trivia
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-[#1F2421]">
                    Unsure which Eau de Parfum or bar suits your routine?
                  </h2>
                  <p className="text-sm text-[#5C5850] leading-relaxed">
                    Take our 4-step Scent &amp; Ritual Finder for a matched pairing, or complete the
                    5-question Botanical Craft Quiz to unlock 10% off (
                    <span className="font-mono font-semibold text-[#1E3F20]">MEADOW10</span>).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNavigateQuiz}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27] whitespace-nowrap shrink-0"
              >
                <span>Open Scent &amp; Craft Quiz</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-4">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                  Packaging Back Guide
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1F2421]">
                  How-To Use &amp; Daily Rituals
                </h2>
                <p className="text-sm sm:text-base text-[#5C5850] leading-relaxed">
                  Select a formulation below to follow the three-step instructions printed on the
                  back of every Mini Meadow pack.
                </p>
              </div>

              <div
                className="flex flex-wrap items-center gap-2"
                role="tablist"
                aria-label="Select ritual guide"
              >
                {[
                  { id: 'herbal-shampoo-bar', label: 'Shampoo Bar (2m)' },
                  { id: 'all-purpose-cleaner', label: 'Surface Spray (1m)' },
                  { id: 'tulsi-leaf-infusion', label: 'Tulsi Steep (4m)' },
                  { id: 'vetiver-cedar-edp', label: 'Eau de Parfum (1m)' },
                ].map((tab) => {
                  const active = activeRitualProductId === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveRitualProductId(tab.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-[4px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#1E3F20] text-[#F7F4EE] border-[#1E3F20]'
                          : 'bg-transparent text-[#1F2421] border-[#D8CEBC] hover:border-[#2E5A27]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <RitualTimer
              title={activeRitualProduct.name}
              subtitle={activeRitualProduct.latinSubtitle}
              durationSeconds={activeRitualProduct.ritualDurationSeconds}
              steps={activeRitualProduct.ritualSteps}
            />
          </section>
        </main>
      )}

      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateLedger={handleNavigateLedger}
        onNavigateQuiz={handleNavigateQuiz}
      />

      <IngredientDrawer
        product={ingredientDrawerProduct}
        isOpen={ingredientDrawerProduct !== null}
        onClose={() => setIngredientDrawerProduct(null)}
      />

      <BagDrawer
        isOpen={isBagOpen}
        items={cartItems}
        orders={orders}
        unlockedPromoCode={unlockedPromoCode}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddToBag={handleAddToBag}
        onOpenLayeringStudio={handleOpenLayeringStudio}
        onClearCart={() => setCartItems([])}
        onOrderPlaced={(newOrder) => setOrders((prev) => [newOrder, ...prev])}
      />

      <CustomerCareWidget />
    </div>
  );
}
