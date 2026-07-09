import { createFileRoute } from "@tanstack/react-router";
import { Search, CheckCircle2, Flame, Zap, ShieldCheck, Copy, Chrome, Moon } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brands Era — The Smarter Way to Save Online" },
      { name: "description", content: "Find verified promo codes and exclusive discounts from 5,000+ top brands, updated daily." },
      { property: "og:title", content: "Brands Era — The Smarter Way to Save Online" },
      { property: "og:description", content: "Verified promo codes from 5,000+ top brands." },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "5K+", label: "Verified Brands" },
  { value: "98%", label: "Success Rate" },
  { value: "$2M+", label: "Saved by Users" },
  { value: "100K+", label: "Happy Shoppers" },
];

const hotDeals = [
  { brand: "Regno", title: "Up to 50% Off Summer Sale", desc: "Get up to 50% off the summer collection at Regno.", type: "Deal" },
  { brand: "Regno", title: "50% Off On All Orders", desc: "Sitewide savings across every category.", type: "Code" },
  { brand: "Regno", title: "Free Shipping On U.S. Orders", desc: "Zero shipping fees on domestic orders.", type: "Deal" },
  { brand: "Clubhouse Supplements", title: "Up to 50% Off Summer Sale", desc: "Stock up on supplements for less.", type: "Code" },
  { brand: "Clubhouse Supplements", title: "30% Off On All Orders", desc: "Site-wide 30% discount on everything.", type: "Code" },
  { brand: "Lehi Mills", title: "Up to 50% Off Summer Sale", desc: "Pantry staples at half the price.", type: "Code" },
];

const premiumBrands = ["Regno", "Lehi Mills", "Enjoy The Wood", "Etha Naturals", "BA&SH", "SIRUI", "Performance Golf", "Classic T Shirt Co."];
const popularBrands = ["Enjoy The Wood", "Circle DNA", "Lavnex", "NYCmode", "Regno", "Expedia"];

const topCoupons = [
  { brand: "G2A", title: "30% Off On All Orders", uses: "4,663 uses" },
  { brand: "G2A", title: "25% Off Storewide (Mobile App)", uses: "3,468 uses" },
  { brand: "G2A", title: "20% Off Your Order", uses: "2,288 uses" },
  { brand: "G2A", title: "Limited Time Seasonal Offer", uses: "1,132 uses" },
  { brand: "G2A", title: "10% Off All Orders", uses: "1,119 uses" },
];

function BrandLogo({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return (
    <div className={`${dim} flex items-center justify-center rounded-md bg-accent border-2 border-foreground font-black text-foreground`}>
      {initials}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10 rounded-md border-2 border-foreground" />
            <div className="hidden sm:block font-display">
              <div className="text-base font-black leading-none tracking-tight uppercase">Brands Era</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-0.5">Save Loudly.</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold uppercase tracking-wide">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#stores" className="hover:text-primary">All Stores</a>
            <a href="#categories" className="hover:text-primary">Categories</a>
            <a href="#about" className="hover:text-primary">About</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button aria-label="Theme" className="rounded-md border-2 border-foreground bg-card p-2 hover:bg-accent">
              <Moon className="h-4 w-4" />
            </button>
            <button className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary border-2 border-foreground px-4 py-2 text-sm font-black uppercase text-primary-foreground hover:-translate-y-0.5 transition" style={{ boxShadow: "var(--shadow-card)" }}>
              <Chrome className="h-4 w-4" /> Add to Chrome
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-16 text-center md:pt-28 md:pb-24">
          <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Verified · July 2026
          </div>
          <h1 className="mt-8 font-display text-5xl font-black tracking-tight md:text-8xl leading-[0.95] uppercase">
            Save Loud.
            <br />
            <span className="text-primary italic">Shop Smart.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-foreground/80 md:text-lg font-medium">
            5,000+ hand-verified codes. Zero fluff. Brands Era is the loud, honest coupon feed for people who refuse to pay full price.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-md border-2 border-foreground bg-card p-2" style={{ boxShadow: "var(--shadow-glow)" }}>
            <Search className="ml-4 h-5 w-5 text-muted-foreground" />
            <input placeholder="Search for a brand (e.g. Amazon, Nike)..." className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <button className="rounded-md bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90">Find Deals</button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground font-semibold uppercase tracking-wide">Popular:</span>
            {["Amazon", "Nike", "Adidas", "Shein"].map(b => (
              <a key={b} href="#" className="rounded-md border-2 border-foreground bg-card px-4 py-1 font-bold hover:bg-accent">{b}</a>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-0 rounded-md border-2 border-foreground bg-card p-0 md:grid-cols-4 divide-x-2 divide-y-2 md:divide-y-0 divide-foreground overflow-hidden" style={{ boxShadow: "var(--shadow-glow)" }}>
            {stats.map(s => (
              <div key={s.label} className="p-6 text-left">
                <div className="font-display text-4xl font-black text-primary md:text-5xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b-2 border-foreground pb-4">
          <h2 className="flex items-center gap-3 font-display text-3xl font-black md:text-5xl uppercase">
            <Flame className="h-8 w-8 text-primary" /> Hot Deals Right Now
          </h2>
          <p className="text-muted-foreground font-semibold uppercase text-xs tracking-widest">Updated Daily · 07/09/2026</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotDeals.map((d, i) => (
            <div key={i} className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-x-0.5 hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start justify-between">
                <BrandLogo name={d.brand} />
                <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
                  <CheckCircle2 className="h-3 w-3" /> {d.type}
                </span>
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{d.brand}</div>
              <h3 className="mt-1 font-display text-xl font-black leading-tight">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
              <div className="mt-5 flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/30">
                <button className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground">
                  {d.type === "Code" ? <><Copy className="h-4 w-4" /> Get Code</> : <>Get Deal →</>}
                </button>
                <span className="text-xs font-bold uppercase text-muted-foreground">30d left</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-6 py-3 text-sm font-black uppercase hover:bg-accent" style={{ boxShadow: "var(--shadow-card)" }}>
            View All Deals →
          </a>
        </div>
      </section>

      {/* Premium Brands */}
      <section id="stores" className="border-y-2 border-foreground bg-accent/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-black md:text-5xl uppercase">Premium Brands</h2>
              <p className="mt-2 text-foreground/80 font-medium">Hand-picked stores with the highest saving potential this week.</p>
            </div>
            <a href="#" className="text-sm font-black uppercase text-primary hover:underline">Explore All Stores →</a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {premiumBrands.map(b => (
              <a key={b} href="#" className="group flex flex-col items-center gap-3 rounded-md border-2 border-foreground bg-card p-6 text-center transition hover:-translate-x-0.5 hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
                <BrandLogo name={b} size="lg" />
                <div className="font-display font-black uppercase">{b}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Verified</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="border-b-2 border-foreground pb-4">
          <h2 className="font-display text-3xl font-black md:text-5xl uppercase">Trending Now</h2>
          <p className="mt-2 text-muted-foreground font-medium">Most-clicked coupons this week.</p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 font-display text-xl font-black uppercase tracking-wide">Top Used Coupons</h3>
            <div className="space-y-3">
              {topCoupons.map((c, i) => (
                <div key={i} className="flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
                  <BrandLogo name={c.brand} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-black truncate">{c.title}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.brand} · {c.uses}</div>
                  </div>
                  <button className="rounded-md border-2 border-foreground bg-primary px-4 py-2 text-xs font-black uppercase text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-display text-xl font-black uppercase tracking-wide">Popular Brands</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {popularBrands.map(b => (
                <a key={b} href="#" className="flex flex-col items-center gap-2 rounded-md border-2 border-foreground bg-card p-5 text-center hover:bg-accent" style={{ boxShadow: "var(--shadow-card)" }}>
                  <BrandLogo name={b} />
                  <div className="text-sm font-display font-black uppercase">{b}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="about" className="border-t-2 border-foreground bg-primary text-primary-foreground py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-black md:text-6xl uppercase">Why Brands Era?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/80 font-medium">
            Join thousands of smart shoppers who save money every day with verified coupon codes.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "100% Verified", desc: "Every code is rigorously tested before publishing to ensure it works." },
              { icon: Zap, title: "Daily Updates", desc: "Fresh deals and exclusive discounts added every single day." },
              { icon: Copy, title: "Easy to Use", desc: "One-click copy and seamless redirection for instant checkout savings." },
            ].map(f => (
              <div key={f.title} className="rounded-md border-2 border-foreground bg-card text-card-foreground p-8 text-left" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-foreground bg-accent text-accent-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-black uppercase">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10 rounded-md" loading="lazy" />
                <div className="font-display font-black uppercase text-lg">Brands Era</div>
              </div>
              <p className="mt-4 text-sm text-background/70">Save loud. Shop smart. Verified codes from thousands of brands.</p>
            </div>
            {[
              { title: "Explore", items: ["All Stores", "Categories", "Top Coupons", "New Deals"] },
              { title: "Company", items: ["About", "Contact", "Blog", "Careers"] },
              { title: "Legal", items: ["Privacy", "Terms", "Cookie Policy", "Disclosure"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-black uppercase tracking-widest text-accent">{col.title}</div>
                <ul className="mt-4 space-y-2 text-sm text-background/70">
                  {col.items.map(i => <li key={i}><a href="#" className="hover:text-accent">{i}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-background/20 pt-6 text-center text-xs uppercase tracking-widest text-background/60">
            © {new Date().getFullYear()} Brands Era. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
