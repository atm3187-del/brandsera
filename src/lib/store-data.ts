import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Coupon {
  id: string;
  title: string;
  description: string;
  type: "Code" | "Deal";
  code?: string;
  uses: number;
  expiryDays: number;
  verified: boolean;
  landingUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  coupons: Coupon[];
  websiteUrl?: string;
  featured?: boolean;
  popular?: boolean;
  premium?: boolean;
}

export const categories = [
  "Fashion",
  "Electronics",
  "Health & Beauty",
  "Home & Garden",
  "Sports & Outdoors",
  "Travel",
  "Food & Drink",
  "Gaming",
  "Software",
  "Pets",
];

function daysFromNow(iso: string | null): number {
  if (!iso) return 30;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export async function fetchStores(): Promise<Store[]> {
  const { data: storeRows, error } = await supabase
    .from("stores")
    .select("id,name,slug,category,description,website_url,featured,popular,premium")
    .order("name");
  if (error) throw error;
  const { data: couponRows, error: cErr } = await supabase
    .from("coupons")
    .select("id,store_id,title,description,type,code,uses,expires_at,verified,landing_url");
  if (cErr) throw cErr;
  const byStore = new Map<string, Coupon[]>();
  for (const c of couponRows ?? []) {
    const list = byStore.get(c.store_id) ?? [];
    list.push({
      id: c.id,
      title: c.title,
      description: c.description,
      type: c.type === "code" ? "Code" : "Deal",
      code: c.code ?? undefined,
      uses: c.uses,
      expiryDays: daysFromNow(c.expires_at),
      verified: c.verified,
      landingUrl: c.landing_url ?? undefined,
    });
    byStore.set(c.store_id, list);
  }
  return (storeRows ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    category: s.category,
    description: s.description,
    websiteUrl: s.website_url ?? undefined,
    featured: s.featured,
    popular: s.popular,
    premium: s.premium,
    coupons: byStore.get(s.id) ?? [],
  }));
}

export function useStoresData() {
  const q = useQuery({ queryKey: ["stores-all"], queryFn: fetchStores, staleTime: 60_000 });
  const stores = q.data ?? [];
  const allCoupons = stores.flatMap((s) => s.coupons.map((c) => ({ ...c, store: s })));
  return { stores, allCoupons, loading: q.isLoading, error: q.error };
}

// Legacy empty stubs so any lingering imports don't break at build.
export const stores: Store[] = [];
export const allCoupons: (Coupon & { store: Store })[] = [];
export function getStoreBySlug(slug: string, list: Store[] = stores) {
  return list.find((s) => s.slug === slug);
}
export function getStoresByCategory(category: string, list: Store[] = stores) {
  return list.filter((s) => s.category === category);
}
export function getStoresByLetter(letter: string, list: Store[] = stores) {
  return list.filter((s) => s.name[0].toUpperCase() === letter.toUpperCase());
}

const _legacyStores: Store[] = [
  {
    id: "1",
    name: "Regno",
    slug: "regno",
    category: "Fashion",
    description: "Premium fashion essentials with verified discounts every week.",
    featured: true,
    premium: true,
    popular: true,
    coupons: [
      { id: "c1", title: "Up to 50% Off Summer Sale", description: "Get up to 50% off the summer collection at Regno.", type: "Deal", uses: 2840, expiryDays: 30, verified: true },
      { id: "c2", title: "50% Off On All Orders", description: "Sitewide savings across every category.", type: "Code", code: "REGNO50", uses: 4210, expiryDays: 45, verified: true },
      { id: "c3", title: "Free Shipping On U.S. Orders", description: "Zero shipping fees on domestic orders.", type: "Deal", uses: 1530, expiryDays: 60, verified: true },
    ],
  },
  {
    id: "2",
    name: "Clubhouse Supplements",
    slug: "clubhouse-supplements",
    category: "Health & Beauty",
    description: "Clean supplements and wellness products at the best prices.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c4", title: "Up to 50% Off Summer Sale", description: "Stock up on supplements for less.", type: "Code", code: "SUMMER50", uses: 1980, expiryDays: 21, verified: true },
      { id: "c5", title: "30% Off On All Orders", description: "Site-wide 30% discount on everything.", type: "Code", code: "CLUB30", uses: 3150, expiryDays: 60, verified: true },
    ],
  },
  {
    id: "3",
    name: "Lehi Mills",
    slug: "lehi-mills",
    category: "Food & Drink",
    description: "High-quality pantry staples and baking mixes delivered fresh.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c6", title: "Up to 50% Off Summer Sale", description: "Pantry staples at half the price.", type: "Code", code: "LEHI50", uses: 960, expiryDays: 45, verified: true },
    ],
  },
  {
    id: "4",
    name: "Enjoy The Wood",
    slug: "enjoy-the-wood",
    category: "Home & Garden",
    description: "Handcrafted wooden maps and home decor from sustainable sources.",
    featured: true,
    premium: true,
    popular: true,
    coupons: [
      { id: "c7", title: "20% Off Storewide", description: "Save on every wooden map and home accent.", type: "Code", code: "WOOD20", uses: 2400, expiryDays: 30, verified: true },
    ],
  },
  {
    id: "5",
    name: "Etha Naturals",
    slug: "etha-naturals",
    category: "Health & Beauty",
    description: "Natural kratom alternatives with lab-tested purity.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c8", title: "15% Off First Order", description: "New customers save on their first purchase.", type: "Code", code: "ETHA15", uses: 880, expiryDays: 90, verified: true },
    ],
  },
  {
    id: "6",
    name: "BA&SH",
    slug: "ba-sh",
    category: "Fashion",
    description: "Parisian ready-to-wear for the modern wardrobe.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c9", title: "Free Express Shipping", description: "Receive free express delivery on all orders.", type: "Deal", uses: 740, expiryDays: 14, verified: true },
    ],
  },
  {
    id: "7",
    name: "SIRUI",
    slug: "sirui",
    category: "Electronics",
    description: "Professional tripods, lenses, and camera accessories.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c10", title: "10% Off Camera Gear", description: "Reliable savings on tripods and lenses.", type: "Code", code: "SIRUI10", uses: 1120, expiryDays: 60, verified: true },
    ],
  },
  {
    id: "8",
    name: "Performance Golf",
    slug: "performance-golf",
    category: "Sports & Outdoors",
    description: "Golf training aids and gear trusted by amateurs and pros.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c11", title: "25% Off Training Aids", description: "Improve your game for less.", type: "Code", code: "GOLF25", uses: 630, expiryDays: 30, verified: true },
    ],
  },
  {
    id: "9",
    name: "The Classic T Shirt Company",
    slug: "the-classic-t-shirt-company",
    category: "Fashion",
    description: "Organic cotton t-shirts made ethically in the USA.",
    featured: true,
    premium: true,
    coupons: [
      { id: "c12", title: "Buy 2 Get 1 Free", description: "Stock up on sustainable basics.", type: "Deal", uses: 510, expiryDays: 21, verified: true },
    ],
  },
  {
    id: "10",
    name: "G2A",
    slug: "g2a",
    category: "Gaming",
    description: "Global marketplace for games, keys, and digital goods.",
    featured: true,
    popular: true,
    coupons: [
      { id: "c13", title: "30% Off On All Orders", description: "Huge discount on marketplace orders.", type: "Code", code: "G2A30", uses: 4663, expiryDays: 7, verified: true },
      { id: "c14", title: "25% Off Storewide (Mobile App)", description: "App-only savings on the go.", type: "Code", code: "APP25", uses: 3468, expiryDays: 14, verified: true },
      { id: "c15", title: "20% Off Your Order", description: "Standard discount code for all users.", type: "Code", code: "SAVE20", uses: 2288, expiryDays: 30, verified: true },
      { id: "c16", title: "Limited Time Seasonal Offer", description: "Seasonal markdown on select titles.", type: "Deal", uses: 1132, expiryDays: 5, verified: true },
      { id: "c17", title: "10% Off All Orders", description: "Works on every order with no minimum.", type: "Code", code: "G2A10", uses: 1119, expiryDays: 60, verified: true },
    ],
  },
  {
    id: "11",
    name: "Amazon",
    slug: "amazon",
    category: "Electronics",
    description: "The world's largest online retailer.",
    popular: true,
    coupons: [
      { id: "c18", title: "Free Shipping on Prime", description: "Fast, free shipping for Prime members.", type: "Deal", uses: 8900, expiryDays: 365, verified: true },
    ],
  },
  {
    id: "12",
    name: "Nike",
    slug: "nike",
    category: "Fashion",
    description: "Iconic athletic footwear, apparel, and equipment.",
    popular: true,
    coupons: [
      { id: "c19", title: "25% Off Members Exclusives", description: "Members-only styles at a discount.", type: "Code", code: "NIKE25", uses: 3200, expiryDays: 21, verified: true },
    ],
  },
  {
    id: "13",
    name: "Adidas",
    slug: "adidas",
    category: "Fashion",
    description: "Sportswear and sneakers for athletes and creators.",
    popular: true,
    coupons: [
      { id: "c20", title: "30% Off Select Styles", description: "Discount applied automatically at checkout.", type: "Deal", uses: 4100, expiryDays: 18, verified: true },
    ],
  },
  {
    id: "14",
    name: "Shein",
    slug: "shein",
    category: "Fashion",
    description: "Trendy fashion at affordable prices.",
    popular: true,
    coupons: [
      { id: "c21", title: "20% Off Orders Over $49", description: "Save on your next fashion haul.", type: "Code", code: "SHEIN20", uses: 5600, expiryDays: 12, verified: true },
    ],
  },
  {
    id: "15",
    name: "Circle DNA",
    slug: "circle-dna",
    category: "Health & Beauty",
    description: "At-home DNA and health testing kits.",
    popular: true,
    coupons: [
      { id: "c22", title: "$50 Off Premium Kits", description: "Save on comprehensive health reports.", type: "Code", code: "CIRCLE50", uses: 780, expiryDays: 30, verified: true },
    ],
  },
  {
    id: "16",
    name: "Lavnex",
    slug: "lavnex",
    category: "Home & Garden",
    description: "Smart home devices and cleaning robots.",
    popular: true,
    coupons: [
      { id: "c23", title: "15% Off Robot Vacuums", description: "Automate your cleaning for less.", type: "Code", code: "LAVNEX15", uses: 940, expiryDays: 25, verified: true },
    ],
  },
  {
    id: "17",
    name: "NYCmode",
    slug: "nycmode",
    category: "Fashion",
    description: "Curated streetwear from New York designers.",
    popular: true,
    coupons: [
      { id: "c24", title: "Buy One Get One 50% Off", description: "Mix and match NYC styles.", type: "Deal", uses: 670, expiryDays: 20, verified: true },
    ],
  },
  {
    id: "18",
    name: "Expedia",
    slug: "expedia",
    category: "Travel",
    description: "Book flights, hotels, and vacation packages worldwide.",
    popular: true,
    coupons: [
      { id: "c25", title: "Up to 40% Off Hotel Stays", description: "Last-minute hotel deals worldwide.", type: "Deal", uses: 2100, expiryDays: 10, verified: true },
    ],
  },
  {
    id: "19",
    name: "Aelfric Eden",
    slug: "aelfric-eden",
    category: "Fashion",
    description: "Vintage streetwear and bold graphic designs.",
    coupons: [
      { id: "c26", title: "15% Off New Arrivals", description: "Save on the latest drop.", type: "Code", code: "EDEN15", uses: 540, expiryDays: 14, verified: true },
    ],
  },
  {
    id: "20",
    name: "Anbernic",
    slug: "anbernic",
    category: "Gaming",
    description: "Retro handheld gaming consoles.",
    coupons: [
      { id: "c27", title: "10% Off Handhelds", description: "Save on retro gaming devices.", type: "Code", code: "ANBER10", uses: 890, expiryDays: 30, verified: true },
    ],
  },
];
void _legacyStores;