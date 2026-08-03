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
