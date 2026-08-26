import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeInfo } from "lucide-react";

export const Route = createFileRoute("/disclosure")({
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure — Brands Era" },
      { name: "description", content: "How Brands Era makes money, how affiliate commissions work, and why they never influence which coupons we publish." },
      { property: "og:title", content: "Affiliate Disclosure — Brands Era" },
      { property: "og:description", content: "How Brands Era makes money and stays editorially independent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DisclosurePage,
});

function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        <BadgeInfo className="h-3.5 w-3.5 text-primary" /> Transparency
      </div>
      <h1 className="mt-4 font-display text-4xl font-black uppercase md:text-5xl">Affiliate Disclosure</h1>
      <div className="mt-8 space-y-6">
        {[
          { h: "How we make money", p: "Brands Era is free to use. When you click a deal and buy something, the retailer may pay us a small commission. That commission funds the team that tests every code." },
          { h: "It never changes our listings", p: "Offers are ranked by how useful they are to shoppers — verification status, savings size and how often they work. Paying us more does not buy a higher position." },
          { h: "Brand names and logos", p: "Brand names and marks belong to their respective owners and are used to identify the retailer whose offers we list. Brands Era is not affiliated with or endorsed by those brands unless stated." },
          { h: "Questions or takedowns", p: "If you represent a brand and want an offer or reference changed, contact us and we will respond promptly." },
        ].map((s) => (
          <section key={s.h} className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="font-display text-lg font-black uppercase">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
      <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2.5 text-sm font-black uppercase text-primary-foreground">
        Contact us
      </Link>
    </div>
  );
}
