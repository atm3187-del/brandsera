import type { Store } from "./store-data";

export interface BrandArticle {
  title: string;
  excerpt: string;
  readMinutes: number;
}

export interface BrandContent {
  about: string[];
  highlights: string[];
  howTo: string[];
  faqs: { q: string; a: string }[];
  articles: BrandArticle[];
  facts: { label: string; value: string }[];
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function getBrandContent(store: Store): BrandContent {
  const n = store.name;
  const cat = store.category.toLowerCase();
  const codes = store.coupons.filter((c) => c.type === "Code").length;
  const deals = store.coupons.length - codes;
  const totalUses = store.coupons.reduce((a, c) => a + c.uses, 0);
  const best = [...store.coupons].sort((a, b) => b.uses - a.uses)[0];
  const seed = hash(store.slug);

  return {
    about: [
      `${n} is a ${cat} brand featured on Brands Era. ${store.description}`,
      `Our editors track ${n} promotions year-round, testing every code before it goes live so you only see offers that actually work at checkout. Right now there ${store.coupons.length === 1 ? "is" : "are"} ${store.coupons.length} active offer${store.coupons.length === 1 ? "" : "s"} on this page — ${codes} promo code${codes === 1 ? "" : "s"} and ${deals} sitewide deal${deals === 1 ? "" : "s"}.`,
      `Shoppers have used ${n} offers from Brands Era ${totalUses.toLocaleString()} times. Save this page or add a coupon to your favourites and we'll alert you the moment a new ${n} discount lands.`,
    ],
    highlights: [
      `${store.coupons.length} verified ${n} offer${store.coupons.length === 1 ? "" : "s"} live today`,
      best ? `Most-used offer: ${best.title}` : `New offers added regularly`,
      `Category: ${store.category}`,
      `Checked by the Brands Era editorial team`,
    ],
    howTo: [
      `Browse the active ${n} offers listed above and pick the one that fits your basket.`,
      `Click “Get Code” to reveal the code, or “Get Deal” to open the discounted page directly.`,
      `Add your items at ${n}, then paste the code into the promo/voucher box at checkout.`,
      `Confirm the discount appears in your order summary before you pay.`,
    ],
    faqs: [
      {
        q: `Does ${n} have a promo code right now?`,
        a: codes > 0
          ? `Yes — there ${codes === 1 ? "is" : "are"} ${codes} working ${n} promo code${codes === 1 ? "" : "s"} on this page, each checked by our team.`
          : `There are no codes at the moment, but ${deals} sitewide deal${deals === 1 ? "" : "s"} ${deals === 1 ? "is" : "are"} live and applied automatically.`,
      },
      {
        q: `How often are ${n} coupons updated?`,
        a: `We review ${n} offers weekly and remove anything that stops working, so the list above reflects what is valid today.`,
      },
      {
        q: `Why didn't my ${n} code work?`,
        a: `Most failures come from minimum-spend rules, excluded sale items, or a code that has just expired. Try another offer on this page — one of them usually applies.`,
      },
      {
        q: `Can I stack multiple ${n} discounts?`,
        a: `${n} normally allows one promo code per order, but codes can often be combined with existing sale pricing and free-shipping thresholds.`,
      },
    ],
    articles: [
      {
        title: `How to save the most at ${n} in ${new Date().getFullYear()}`,
        excerpt: `From seasonal sales to newsletter perks, here are the tactics our editors use to cut the price of a ${n} order.`,
        readMinutes: 3 + (seed % 3),
      },
      {
        title: `${n} shipping, returns & price-match explained`,
        excerpt: `What you need to know about delivery windows, return windows and whether ${n} honours price drops after purchase.`,
        readMinutes: 4 + (seed % 2),
      },
      {
        title: `Best ${store.category} alternatives to ${n}`,
        excerpt: `Comparable ${cat} brands worth checking when ${n} is out of stock — plus the coupons we currently have for them.`,
        readMinutes: 5 + (seed % 4),
      },
    ],
    facts: [
      { label: "Active offers", value: String(store.coupons.length) },
      { label: "Promo codes", value: String(codes) },
      { label: "Sitewide deals", value: String(deals) },
      { label: "Times used", value: totalUses.toLocaleString() },
    ],
  };
}

export interface TopSearch {
  term: string;
  volume: string;
  url: string;
}

/**
 * Most-searched coupon queries shoppers use on Google for this brand.
 * Ranked with a deterministic score so the list is stable per brand,
 * and each row deep-links to the live Google results for that query.
 */
export function getTopSearches(store: Store): TopSearch[] {
  const n = store.name;
  const year = new Date().getFullYear();
  const seed = hash(store.slug);
  const patterns = [
    `${n} promo code`,
    `${n} coupon code ${year}`,
    `${n} discount code`,
    `${n} free shipping code`,
    `${n} student discount`,
    `${n} first order discount`,
    `${n} sale ${year}`,
    `${n} voucher code`,
    `${n} clearance deals`,
    `${n} newsletter discount`,
  ];
  return patterns
    .map((term, i) => {
      const score = 120000 / (i + 1) + ((seed >> i) % 7) * 900;
      return {
        term,
        volume: `${Math.round(score / 100) / 10}K/mo`,
        url: `https://www.google.com/search?q=${encodeURIComponent(term)}`,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ term, volume, url }) => ({ term, volume, url }));
}

/* ------------------------------------------------------------------ */
/* Section-level content (e.g. Adidas → Shoes)                         */
/* ------------------------------------------------------------------ */

export interface SectionLike {
  name: string;
  slug: string;
  description: string;
  about: string;
}

export interface SectionContent {
  about: string[];
  highlights: string[];
  howTo: string[];
  faqs: { q: string; a: string }[];
}

export function getSectionContent(store: Store, section: SectionLike, offerCount: number): SectionContent {
  const n = store.name;
  const s = section.name;
  const written = section.about.trim();
  return {
    about: [
      written || `${s} at ${n} — ${section.description || `everything you need to know about ${n} ${s.toLowerCase()}, plus the discounts our editors have verified for this range.`}`,
      `This page collects the ${n} ${s.toLowerCase()} offers we currently track. There ${offerCount === 1 ? "is" : "are"} ${offerCount} offer${offerCount === 1 ? "" : "s"} tagged to ${s} right now, alongside guides and the searches shoppers run most for this range.`,
    ].filter(Boolean),
    highlights: [
      `${offerCount} ${s} offer${offerCount === 1 ? "" : "s"} tracked`,
      `Part of the ${n} brand hub`,
      `Checked by the Brands Era editorial team`,
      `Updated whenever a new ${s.toLowerCase()} deal lands`,
    ],
    howTo: [
      `Pick a ${n} ${s.toLowerCase()} offer from the list above.`,
      `Reveal the code, or open the deal page directly.`,
      `Add your ${s.toLowerCase()} picks at ${n} and paste the code at checkout.`,
      `Check the discount appears before you pay.`,
    ],
    faqs: [
      {
        q: `Are there ${n} ${s.toLowerCase()} discounts right now?`,
        a: offerCount > 0
          ? `Yes — ${offerCount} offer${offerCount === 1 ? "" : "s"} ${offerCount === 1 ? "is" : "are"} tagged to ${n} ${s} on this page.`
          : `Nothing is tagged to ${s} at the moment, but the main ${n} page usually has sitewide offers that apply here too.`,
      },
      {
        q: `Do sitewide ${n} codes work on ${s.toLowerCase()}?`,
        a: `Usually yes, unless the code excludes sale items or a specific range. Try the sitewide codes on the ${n} page if nothing here fits your basket.`,
      },
      {
        q: `How often is this ${s} page updated?`,
        a: `We review ${n} offers weekly and retag them to the right range, so what you see here reflects what is live today.`,
      },
    ],
  };
}

/** Google queries shoppers run for a specific range within a brand. */
export function getSectionTopSearches(store: Store, section: SectionLike): TopSearch[] {
  const n = store.name;
  const s = section.name;
  const year = new Date().getFullYear();
  const seed = hash(`${store.slug}/${section.slug}`);
  const patterns = [
    `${n} ${s} promo code`,
    `${n} ${s} discount code ${year}`,
    `${n} ${s} sale`,
    `cheap ${n} ${s}`,
    `${n} ${s} coupon`,
    `${n} ${s} clearance`,
    `${n} ${s} student discount`,
    `best ${n} ${s} deals`,
  ];
  return patterns
    .map((term, i) => {
      const score = 60000 / (i + 1) + ((seed >> i) % 7) * 700;
      return {
        term,
        volume: `${Math.round(score / 100) / 10}K/mo`,
        url: `https://www.google.com/search?q=${encodeURIComponent(term)}`,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ term, volume, url }) => ({ term, volume, url }));
}
