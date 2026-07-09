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
    <div className={`${dim} flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border font-bold text-primary`}>
      {initials}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10" />
            <div className="hidden sm:block font-display">
              <div className="text-base font-bold leading-none tracking-tight">Brands Era</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Save Smarter</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#stores" className="hover:text-primary">All Stores</a>
            <a href="#categories" className="hover:text-primary">Categories</a>
            <a href="#about" className="hover:text-primary">About</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search brands..." className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground" />
            </div>
            <button aria-label="Theme" className="rounded-full border border-border bg-card p-2.5 hover:bg-muted">
              <Moon className="h-4 w-4 text-primary" />
            </button>
            <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
              <Chrome className="h-4 w-4" /> Add to Chrome
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-16 text-center md:pt-28 md:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified Deals for July 2026
          </div>
          <h1 className="mt-8 font-display text-5xl font-bold tracking-tight md:text-7xl">
            The Smarter Way to
            <br />
            <span className="text-primary">Save Online.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Brands Era helps you find the latest verified promo codes and exclusive discounts from 5,000+ top brands instantly.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-card p-2 shadow-xl" style={{ boxShadow: "var(--shadow-glow)" }}>
            <Search className="ml-4 h-5 w-5 text-muted-foreground" />
            <input placeholder="Search for a brand (e.g. Amazon, Nike)..." className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Find Deals</button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {["Amazon", "Nike", "Adidas", "Shein"].map(b => (
              <a key={b} href="#" className="rounded-full border border-border bg-card px-4 py-1.5 hover:border-primary hover:text-primary">{b}</a>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card/50 p-6 md:grid-cols-4 md:p-8">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary md:text-4xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <h2 className="flex items-center justify-center gap-3 font-display text-3xl font-bold md:text-4xl">
            <Flame className="h-8 w-8 text-primary" /> Hot Deals Right Now
          </h2>
          <p className="mt-3 text-muted-foreground">Verified coupons updated daily — save big on your favorite brands.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotDeals.map((d, i) => (
            <div key={i} className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start justify-between">
                <BrandLogo name={d.brand} />
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{d.brand}</div>
              <h3 className="mt-1 text-lg font-semibold leading-snug">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  {d.type === "Code" ? <><Copy className="h-4 w-4" /> Get Code</> : <>Get Deal →</>}
                </button>
                <span className="text-xs text-muted-foreground">Ends in 30d</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary">
            View All Deals →
          </a>
        </div>
      </section>

      {/* Premium Brands */}
      <section id="stores" className="border-y border-border bg-card/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Premium Brands</h2>
              <p className="mt-2 text-muted-foreground">Hand-picked stores with the highest saving potential this week.</p>
            </div>
            <a href="#" className="text-sm font-semibold text-primary hover:underline">Explore All Stores →</a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {premiumBrands.map(b => (
              <a key={b} href="#" className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition hover:border-primary/50 hover:-translate-y-1">
                <BrandLogo name={b} size="lg" />
                <div className="font-semibold">{b}</div>
                <div className="text-xs text-muted-foreground">Verified Coupons</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Trending Now</h2>
          <p className="mt-3 text-muted-foreground">Discover the most used coupons and popular brands today.</p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 text-xl font-semibold">Top Used Coupons</h3>
            <div className="space-y-3">
              {topCoupons.map((c, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50">
                  <BrandLogo name={c.brand} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.brand} • {c.uses}</div>
                  </div>
                  <button className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-5 text-xl font-semibold">Popular Brands</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {popularBrands.map(b => (
                <a key={b} href="#" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center hover:border-primary/50">
                  <BrandLogo name={b} />
                  <div className="text-sm font-semibold">{b}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="about" className="border-t border-border bg-card/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Why Choose Brands Era?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Join thousands of smart shoppers who save money every day with verified coupon codes.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "100% Verified", desc: "Every code is rigorously tested before publishing to ensure it works." },
              { icon: Zap, title: "Daily Updates", desc: "Fresh deals and exclusive discounts added every single day." },
              { icon: Copy, title: "Easy to Use", desc: "One-click copy and seamless redirection for instant checkout savings." },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-8 text-left">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10" loading="lazy" />
                <div className="font-display font-bold">Brands Era</div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">The smarter way to save online, with verified codes from thousands of brands.</p>
            </div>
            {[
              { title: "Explore", items: ["All Stores", "Categories", "Top Coupons", "New Deals"] },
              { title: "Company", items: ["About", "Contact", "Blog", "Careers"] },
              { title: "Legal", items: ["Privacy", "Terms", "Cookie Policy", "Disclosure"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-sm font-semibold">{col.title}</div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {col.items.map(i => <li key={i}><a href="#" className="hover:text-primary">{i}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brands Era. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
