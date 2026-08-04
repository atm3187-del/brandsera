import { Link } from "@tanstack/react-router";
import { Twitter, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = [
  {
    title: "Explore",
    items: [
      { label: "All Stores", to: "/stores" },
      { label: "Categories", to: "/categories" },
      { label: "Featured Brands", to: "/featured-stores" },
      { label: "Popular Stores", to: "/popular-stores" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Blog", to: "/" },
      { label: "Careers", to: "/" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Cookie Policy", to: "/privacy" },
      { label: "Disclosure", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10 rounded-md" loading="lazy" />
              <div className="font-display font-black uppercase text-lg">Brands Era</div>
            </div>
            <p className="mt-4 text-sm text-background/70">
              Save loud. Shop smart. Verified codes from thousands of brands.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Twitter" className="rounded-md border border-background/30 p-2 hover:bg-background/10">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-md border border-background/30 p-2 hover:bg-background/10">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-md border border-background/30 p-2 hover:bg-background/10">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          {footerLinks.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-black uppercase tracking-widest text-accent">{col.title}</div>
              <ul className="mt-4 space-y-2 text-sm text-background/70">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-4 rounded-md border-2 border-background/30 bg-background/5 p-6 text-center sm:grid-cols-[minmax(0,1fr)_auto] sm:text-left">
          <div className="min-w-0">
            <div className="font-display text-lg font-black uppercase">Never pay full price again</div>
            <p className="mt-1 text-sm text-background/70">
              New verified codes land daily across 5,000+ brands.
            </p>
          </div>
          <Link
            to="/stores"
            className="inline-flex items-center justify-center self-center rounded-md border-2 border-background bg-accent px-6 py-3 text-sm font-black uppercase text-accent-foreground hover:opacity-90"
          >
            Browse Deals
          </Link>
        </div>
        <div className="mt-10 border-t border-background/20 pt-6 text-center text-xs uppercase tracking-widest text-background/60">
          © {new Date().getFullYear()} Brands Era. All rights reserved.
        </div>
        {/* Breathing room so the floating badge never overlaps footer content */}
        <div aria-hidden className="h-16 md:h-12" />
      </div>
    </footer>
  );
}
