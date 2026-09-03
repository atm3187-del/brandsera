import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";
import { Cookie } from "lucide-react";

export const Route = createFileRoute("/cookie-policy")({
  head: () =>
    seoHead({
    path: '/cookie-policy',
    title: 'Cookie Policy — Brands Era',
    description: 'How Brands Era uses cookies and how you can control them.'
  }),
  component: CookiePolicyPage,
});

const sections = [
  { h: "What cookies are", p: "Cookies are small text files a site stores in your browser so it can remember things between visits, such as your theme choice or sign-in session." },
  { h: "Cookies we use", p: "Essential cookies keep you signed in and remember your light/dark preference. Analytics cookies help us understand which coupons people use so we can prioritise the brands you care about. Affiliate cookies may be set by retailers after you click a deal link." },
  { h: "Affiliate tracking", p: "When you click through to a brand, that retailer may set a cookie to attribute the visit to Brands Era. We may earn a commission at no extra cost to you. This never affects whether a coupon is listed or how it is ranked." },
  { h: "Managing cookies", p: "You can clear or block cookies in your browser settings at any time. Blocking essential cookies will sign you out and disable saved coupons and alerts." },
  { h: "Changes", p: "We may update this policy as our tooling changes. The date at the bottom of this page always reflects the current version." },
];

function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        <Cookie className="h-3.5 w-3.5 text-primary" /> Legal
      </div>
      <h1 className="mt-4 font-display text-4xl font-black uppercase md:text-5xl">Cookie Policy</h1>
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.h} className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="font-display text-lg font-black uppercase">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Last updated {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" })}
      </p>
    </div>
  );
}
