export type ProductCategory = 'Hair & Body' | 'Home Care' | 'Infusions' | 'Perfumes';

export interface ProductVariant {
  id: string;
  label: string;
  weightOrVolume: string;
  price: number;
  packagingNote: string;
}

export interface RitualStep {
  stepNumber: string;
  title: string;
  metric: string;
  instruction: string;
  iconName: 'measure' | 'temperature' | 'timer' | 'droplet' | 'hand' | 'flame';
}

export interface BotanicalCompound {
  id: string;
  commonName: string;
  latinName: string;
  partUsed: string;
  origin: string;
  harvestMethod: string;
  extraction: string;
  batchCode: string;
  harvestDate: string;
  purityNote: string;
  percentage: string;
}

export interface OlfactoryNotes {
  top: string;
  heart: string;
  base: string;
  longevity: string;
  concentration: string;
}

export interface ProductGalleryItem {
  label: string;
  src: string;
  cropOrigin?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  latinSubtitle: string;
  category: ProductCategory;
  tag: string;
  shortDescription: string;
  editorialStory: string;
  image: string;
  imageAlt: string;
  imageCropOrigin?: string;
  galleryImages?: ProductGalleryItem[];
  aromaProfile: string;
  originSummary: string;
  batchId: string;
  olfactoryNotes?: OlfactoryNotes;
  packagingSpec: {
    vessel: string;
    closure: string;
    labelMaterial: string;
    endOfLife: string;
  };
  certifications: string[];
  variants: ProductVariant[];
  ritualDurationSeconds: number;
  ritualSteps: RitualStep[];
  compounds: BotanicalCompound[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface OrderReceipt {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: 'upi' | 'cod';
  packagingChoice: 'kraft-box' | 'compostable-mailer';
  items: Array<{
    name: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: string;
}
