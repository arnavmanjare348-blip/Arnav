import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  History,
  Layers,
  Minus,
  PackageCheck,
  Plus,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { PRODUCTS } from '../data/apothecary';
import { CartItem, OrderReceipt, Product } from '../types';
import { FREE_SHIPPING_THRESHOLD_INR, SHIPPING_FEE_INR, formatINR } from '../utils/currency';
import { PerfumeLayeringVisualizer } from './PerfumeLayeringVisualizer';
import { ResilientImage } from './ResilientImage';

interface BagDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  orders: OrderReceipt[];
  unlockedPromoCode: string | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onAddToBag?: (productId: string, variantId: string, quantity?: number) => void;
  onOpenLayeringStudio?: (perfumeIds: string[]) => void;
  onClearCart: () => void;
  onOrderPlaced: (receipt: OrderReceipt) => void;
}

export function BagDrawer({
  isOpen,
  items,
  orders,
  unlockedPromoCode,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onAddToBag,
  onOpenLayeringStudio,
  onClearCart,
  onOrderPlaced,
}: BagDrawerProps) {
  const [step, setStep] = useState<'bag' | 'checkout' | 'receipt' | 'orders'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [packagingChoice, setPackagingChoice] = useState<'kraft-box' | 'compostable-mailer'>(
    'kraft-box'
  );
  const [promoInput, setPromoInput] = useState(unlockedPromoCode || '');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(unlockedPromoCode);
  const [promoNotice, setPromoNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    if (unlockedPromoCode) {
      setAppliedPromo(unlockedPromoCode);
      setPromoInput(unlockedPromoCode);
    }
  }, [unlockedPromoCode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'receipt') {
      setStep('bag');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const resolvedItems = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return { ...item, product, variant };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const bagPerfumes: Product[] = [];
  for (const entry of resolvedItems) {
    if (
      entry.product.category === 'Perfumes' &&
      !bagPerfumes.some((p) => p.id === entry.product.id)
    ) {
      bagPerfumes.push(entry.product);
    }
  }
  const complementaryPerfumes = PRODUCTS.filter(
    (p) => p.category === 'Perfumes' && !bagPerfumes.some((bp) => bp.id === p.id)
  );

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const discount = appliedPromo === 'MEADOW10' ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = subtotal - discount;
  const qualifiesFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD_INR;
  const shippingCost =
    resolvedItems.length === 0 || qualifiesFreeShipping ? 0 : SHIPPING_FEE_INR;
  const total = discountedSubtotal + shippingCost;
  const progressPct = Math.min(
    100,
    Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD_INR) * 100)
  );

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'MEADOW10') {
      setAppliedPromo('MEADOW10');
      setPromoNotice('MEADOW10 applied — 10% botanical craft discount active.');
    } else {
      setAppliedPromo(null);
      setPromoNotice('Try MEADOW10 (unlocked via the Botanical Craft Quiz).');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = customerName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.replace(/\s+/g, '');
    const cleanAddress = address.trim();
    const cleanPin = postalCode.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanAddress || !cleanPin) {
      setFormError('Please complete all India dispatch fields before placing your order.');
      return;
    }
    if (!/^\d{6}$/.test(cleanPin)) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!/^[+\d][\d-]{8,14}$/.test(cleanPhone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setFormError('');

    const orderNum = `MM-${Math.floor(1040 + Math.random() * 8900)}`;
    const newReceipt: OrderReceipt = {
      orderNumber: orderNum,
      customerName: cleanName.slice(0, 80),
      email: cleanEmail.slice(0, 120),
      phone: cleanPhone.slice(0, 16),
      address: cleanAddress.slice(0, 200),
      postalCode: cleanPin,
      paymentMethod,
      packagingChoice,
      items: resolvedItems.map((entry) => ({
        name: entry.product.name,
        variantLabel: entry.variant.label,
        quantity: entry.quantity,
        unitPrice: entry.variant.price,
      })),
      subtotal,
      shipping: shippingCost,
      total,
      placedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setReceipt(newReceipt);
    onOrderPlaced(newReceipt);
    onClearCart();
    setStep('receipt');
  };

  const handleResetAfterReceipt = () => {
    setReceipt(null);
    setStep('bag');
    setCustomerName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPostalCode('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bag-drawer-title"
    >
      <div
        className="fixed inset-0 bg-[#1F2421]/30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-md bg-[#FAF8F3] border-l border-[#D8CEBC] shadow-herbarium flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#D8CEBC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {(step === 'checkout' || step === 'orders') && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to bag"
                className="p-1.5 -ml-1.5 text-[#1E3F20] hover:bg-[#EFE9DD] rounded-[4px] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 id="bag-drawer-title" className="font-serif text-xl font-medium text-[#1F2421]">
              {step === 'bag' && 'Apothecary Bag'}
              {step === 'checkout' && 'Zero-Plastic Dispatch'}
              {step === 'receipt' && 'Order Confirmed'}
              {step === 'orders' && `Past Orders (${orders.length})`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && step === 'bag' && (
              <button
                type="button"
                onClick={() => setStep('orders')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#1E3F20] border border-[#D8CEBC] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer"
              >
                <History className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Orders</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bag drawer"
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center border border-[#D8CEBC] rounded-[4px] text-[#1F2421] hover:bg-[#EFE9DD] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step 1: Bag View */}
        {step === 'bag' && (
          <>
            {resolvedItems.length > 0 && (
              <div className="px-6 py-3.5 bg-[#EFE9DD] border-b border-[#D8CEBC]">
                <div className="flex items-center justify-between text-xs text-[#1F2421] mb-2">
                  <span>
                    {qualifiesFreeShipping
                      ? 'Complimentary plastic-free shipping unlocked'
                      : `Add ${formatINR(FREE_SHIPPING_THRESHOLD_INR - discountedSubtotal)} for free shipping`}
                  </span>
                  <span className="tabular-nums font-semibold text-[#1E3F20]">
                    {progressPct}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#D8CEBC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4E8A3C] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {resolvedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <p className="font-serif text-xl text-[#1F2421]">Your apothecary bag is empty</p>
                  <p className="text-sm text-[#5C5850] max-w-xs leading-relaxed">
                    Explore Mini Meadow’s herbal shampoo bars, plant-based cleaners, Tulsi
                    infusions, and botanical Eau de Parfums.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-5 py-2.5 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27]"
                  >
                    Browse Formulations
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <ul className="divide-y divide-[#D8CEBC]">
                    {resolvedItems.map(({ product, variant, quantity }) => (
                      <li key={`${product.id}-${variant.id}`} className="py-4 flex gap-4">
                        <div className="w-20 h-16 rounded-[4px] overflow-hidden border border-[#D8CEBC] shrink-0 bg-[#EFE9DD]">
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
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-base font-medium text-[#1F2421] truncate">
                              {product.name}
                            </h3>
                            <span className="text-sm font-semibold text-[#1F2421] tabular-nums shrink-0">
                              {formatINR(variant.price * quantity)}
                            </span>
                          </div>

                          <p className="text-xs text-[#5C5850] mt-0.5">{variant.label}</p>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center border border-[#D8CEBC] rounded-[4px] bg-[#F7F4EE]">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(product.id, variant.id, -1)}
                                aria-label={`Decrease quantity of ${product.name}`}
                                className="p-1.5 text-[#1F2421] hover:bg-[#EFE9DD] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-semibold tabular-nums text-[#1F2421]">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(product.id, variant.id, 1)}
                                aria-label={`Increase quantity of ${product.name}`}
                                className="p-1.5 text-[#1F2421] hover:bg-[#EFE9DD] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(product.id, variant.id)}
                              aria-label={`Remove ${product.name} from bag`}
                              className="p-1.5 text-[#5C5850] hover:text-[#BA1A1A] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Interactive Perfume Layering Visualizer when 2+ perfumes are in bag */}
                  {bagPerfumes.length >= 2 && (
                    <PerfumeLayeringVisualizer
                      compact
                      selectedPerfumeIds={bagPerfumes.map((p) => p.id)}
                      onOpenFullStudio={(ids) => {
                        onClose();
                        onOpenLayeringStudio?.(ids);
                      }}
                    />
                  )}

                  {/* Quick-pair suggestion when 1 perfume is in bag */}
                  {bagPerfumes.length === 1 && complementaryPerfumes.length > 0 && (
                    <div className="p-4 rounded-lg border border-[#D8CEBC] bg-[#EFE9DD]/75 space-y-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Perfume Layering Preview</span>
                        </div>
                        <p className="text-xs text-[#1F2421] leading-relaxed">
                          Add a second Mini Meadow Eau de Parfum to visualize how its notes stack
                          over{' '}
                          <span className="font-semibold">
                            {bagPerfumes[0].name.replace(' Eau de Parfum', '')}
                          </span>
                          .
                        </p>
                      </div>

                      <div className="space-y-2">
                        {complementaryPerfumes.map((candidate) => {
                          const fiftyMl = candidate.variants[0];
                          const labelThumb =
                            candidate.galleryImages?.find((g) => g.label.includes('Front Label'))
                              ?.src ?? candidate.image;
                          return (
                            <div
                              key={candidate.id}
                              className="p-2.5 rounded-[4px] border border-[#D8CEBC] bg-[#FAF8F3] flex items-center justify-between gap-2.5"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-11 rounded-[3px] border border-[#D8CEBC] bg-[#F7F4EE] overflow-hidden shrink-0">
                                  <ResilientImage
                                    src={labelThumb}
                                    alt={candidate.name}
                                    className="w-full h-full object-contain p-0.5"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif text-xs font-medium text-[#1F2421] truncate">
                                    {candidate.name.replace(' Eau de Parfum', '')}
                                  </p>
                                  <p className="text-[11px] text-[#5C5850] truncate">
                                    {candidate.tag}
                                  </p>
                                </div>
                              </div>

                              {onAddToBag && (
                                <button
                                  type="button"
                                  onClick={() => onAddToBag(candidate.id, fiftyMl.id, 1)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] hover:bg-[#2E5A27] cursor-pointer shrink-0 tabular-nums"
                                >
                                  <Plus className="w-3 h-3" aria-hidden="true" />
                                  <span>50 ml · {formatINR(fiftyMl.price)}</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Promo Code Box */}
                  <div className="pt-4 border-t border-[#D8CEBC] space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          className="w-3.5 h-3.5 text-[#8C867A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo code (e.g. MEADOW10)"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] uppercase focus:outline-none focus:border-[#1E3F20]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3.5 py-2 text-xs font-semibold border border-[#1E3F20] text-[#1E3F20] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoNotice && <p className="text-xs text-[#2E5A27]">{promoNotice}</p>}
                  </div>
                </div>
              )}
            </div>

            {resolvedItems.length > 0 && (
              <div className="p-6 border-t border-[#D8CEBC] bg-[#F7F4EE] space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#5C5850]">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-[#1F2421]">{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#2E5A27]">
                      <span>Botanical Quiz Discount (10%)</span>
                      <span className="tabular-nums">-{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#5C5850]">
                    <span>Plastic-Free Dispatch</span>
                    <span className="tabular-nums text-[#1F2421]">
                      {shippingCost === 0 ? 'Complimentary' : formatINR(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#D8CEBC] font-semibold text-[#1F2421]">
                    <span>Total (INR)</span>
                    <span className="tabular-nums">{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[4px] cursor-pointer transition-all duration-150 hover:bg-[#2E5A27] hover:-translate-y-px"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Zero-Waste Checkout Form (India INR + COD / UPI) */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 px-6 py-5 space-y-5">
              {formError && (
                <div
                  role="alert"
                  className="p-3 text-xs font-medium bg-[#FFDAD6] text-[#93000A] border border-[#BA1A1A]/40 rounded-[4px]"
                >
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <label className="block">
                  <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-1.5">
                    Full Name
                  </span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Aarav Kulkarni"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-1.5">
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aarav@example.in"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-1.5">
                      Mobile (+91)
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98450 12345"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-1.5">
                    Street Address
                  </span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="14 Indiranagar 100 Feet Road, Bengaluru"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-1.5">
                    PIN Code
                  </span>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="560038"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-[#1F2421] placeholder:text-[#8C867A] focus:outline-none focus:border-[1.5px] focus:border-[#1E3F20]"
                  />
                </label>
              </div>

              {/* Payment Method Selection */}
              <fieldset className="space-y-2 pt-1">
                <legend className="text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-2">
                  Payment Method
                </legend>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 border rounded-[4px] text-left cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-[#EFE9DD] border-[#1E3F20] text-[#1F2421]'
                        : 'bg-[#F7F4EE] border-[#D8CEBC] text-[#5C5850]'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-[#1F2421]">
                      UPI / Card
                    </span>
                    <span className="block text-[11px] mt-0.5">Instant verification</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 border rounded-[4px] text-left cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#EFE9DD] border-[#1E3F20] text-[#1F2421]'
                        : 'bg-[#F7F4EE] border-[#D8CEBC] text-[#5C5850]'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-[#1F2421]">
                      Cash on Delivery
                    </span>
                    <span className="block text-[11px] mt-0.5">Pay at doorstep</span>
                  </button>
                </div>
              </fieldset>

              {/* Botanical Radio Packaging Selection */}
              <fieldset className="space-y-2.5 pt-1">
                <legend className="text-xs font-semibold uppercase tracking-[0.06em] text-[#5C5850] mb-2">
                  Parcel Packaging Preference
                </legend>

                <button
                  type="button"
                  onClick={() => setPackagingChoice('kraft-box')}
                  className={`w-full text-left p-3.5 border rounded-[6px] flex items-start gap-3 cursor-pointer transition-colors ${
                    packagingChoice === 'kraft-box'
                      ? 'bg-[#EFE9DD] border-[#1E3F20]'
                      : 'bg-[#F7F4EE] border-[#D8CEBC]'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 ${
                      packagingChoice === 'kraft-box'
                        ? 'bg-[#1E3F20] border-[#1E3F20] text-[#F7F4EE]'
                        : 'bg-[#FAF8F3] border-[#2E5A27]'
                    }`}
                  >
                    {packagingChoice === 'kraft-box' && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-[#1F2421]">
                      Unbleached Kraft Box &amp; Wood Wool
                    </span>
                    <span className="block text-xs text-[#5C5850] mt-0.5">
                      Cushioned with shredded kraft fiber for Eau de Parfum &amp; glass vessels.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPackagingChoice('compostable-mailer')}
                  className={`w-full text-left p-3.5 border rounded-[6px] flex items-start gap-3 cursor-pointer transition-colors ${
                    packagingChoice === 'compostable-mailer'
                      ? 'bg-[#EFE9DD] border-[#1E3F20]'
                      : 'bg-[#F7F4EE] border-[#D8CEBC]'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 ${
                      packagingChoice === 'compostable-mailer'
                        ? 'bg-[#1E3F20] border-[#1E3F20] text-[#F7F4EE]'
                        : 'bg-[#FAF8F3] border-[#2E5A27]'
                    }`}
                  >
                    {packagingChoice === 'compostable-mailer' && (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-[#1F2421]">
                      Minimal Home-Compostable Mailer
                    </span>
                    <span className="block text-xs text-[#5C5850] mt-0.5">
                      Lightweight plant-cellulose sleeve for pouches and soap bars.
                    </span>
                  </div>
                </button>
              </fieldset>
            </div>

            <div className="p-6 border-t border-[#D8CEBC] bg-[#F7F4EE] space-y-3">
              <div className="flex justify-between text-sm font-semibold text-[#1F2421]">
                <span>Order Total ({paymentMethod === 'cod' ? 'COD' : 'UPI / Card'})</span>
                <span className="tabular-nums">{formatINR(total)}</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[4px] cursor-pointer transition-all duration-150 hover:bg-[#2E5A27]"
              >
                Place Order — {formatINR(total)}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Order Confirmation Receipt */}
        {step === 'receipt' && receipt && (
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="p-5 bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#1E3F20]">
                  <PackageCheck className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.06em]">
                    Confirmed <span aria-hidden="true">·</span> {receipt.placedAt}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1F2421]">
                  Order #{receipt.orderNumber} Confirmed — Preparing Parcel
                </h3>
                <p className="text-xs text-[#5C5850] leading-relaxed">
                  A batch traceability summary has been prepared for {receipt.customerName} (
                  {receipt.phone}). Dispatching to {receipt.address}, PIN {receipt.postalCode}.
                </p>
              </div>

              <div className="border border-[#D8CEBC] rounded-lg bg-[#F7F4EE] divide-y divide-[#D8CEBC]">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-[#1F2421]">
                        {item.quantity} × {item.name}
                      </p>
                      <p className="text-xs text-[#5C5850]">{item.variantLabel}</p>
                    </div>
                    <span className="tabular-nums font-medium text-[#1F2421]">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between text-sm font-semibold text-[#1E3F20] bg-[#EFE9DD]/50">
                  <span>
                    Total ({receipt.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'})
                  </span>
                  <span className="tabular-nums">{formatINR(receipt.total)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAfterReceipt}
              className="w-full py-3 px-4 text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27]"
            >
              Continue Exploring
            </button>
          </div>
        )}

        {/* Step 4: Persistent Order History */}
        {step === 'orders' && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="p-4 bg-[#F7F4EE] border border-[#D8CEBC] rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E3F20] tabular-nums">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-[#5C5850]">{order.placedAt}</span>
                </div>
                <p className="text-xs text-[#5C5850]">
                  {order.customerName} · {order.address}, {order.postalCode}
                </p>
                <ul className="text-xs text-[#1F2421] space-y-1 pt-1 border-t border-[#D8CEBC]/70">
                  {order.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {it.quantity} × {it.name}
                      </span>
                      <span className="tabular-nums">
                        {formatINR(it.unitPrice * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between pt-2 border-t border-[#D8CEBC] text-xs font-semibold text-[#1F2421]">
                  <span>{order.paymentMethod === 'cod' ? 'COD' : 'UPI / Card'}</span>
                  <span className="tabular-nums">{formatINR(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
