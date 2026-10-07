import { Link } from "@tanstack/react-router";
import { Twitter, Facebook, Instagram, Youtube, Linkedin, Globe, Music2, type LucideIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSocialLinks } from "@/lib/social-links";

const socialIcons: Record<string, LucideIcon> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music2,
  pinterest: Globe,
  website: Globe,
};


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
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Cookie Policy", to: "/cookie-policy" },
      { label: "Disclosure", to: "/disclosure" },
    ],
  },
];


function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 0 0-3.65 19.31c-.09-.79-.17-2 .03-2.86.19-.79 1.2-5.04 1.2-5.04s-.31-.61-.31-1.52c0-1.42.83-2.49 1.85-2.49.87 0 1.29.66 1.29 1.44 0 .88-.56 2.19-.85 3.41-.24 1.02.51 1.85 1.52 1.85 1.83 0 3.23-1.93 3.23-4.71 0-2.46-1.77-4.18-4.3-4.18-2.93 0-4.65 2.2-4.65 4.47 0 .89.34 1.84.77 2.35.08.1.09.19.07.29-.08.32-.25.98-.28 1.12-.05.19-.15.23-.35.14-1.29-.6-2.1-2.48-2.1-4 0-3.25 2.36-6.24 6.81-6.24 3.57 0 6.35 2.55 6.35 5.95 0 3.55-2.24 6.41-5.34 6.41-1.04 0-2.02-.54-2.36-1.18l-.64 2.45c-.23.89-.86 2.01-1.28 2.69A10 10 0 1 0 12 2z" />
    </svg>
  );
}

export function Footer() {
  const { data: socials = [] } = useSocialLinks();
  const active = socials.filter((s) => s.enabled && s.url);

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
              Coupons and deals from popular brands. Operated by Humayun Babar and Ahtasham Ali, Rawalpindi, Pakistan.
            </p>
            {active.length > 0 && (
              <>
                <div className="mt-5 text-xs font-black uppercase tracking-widest text-accent">Follow us</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {active.map((s) => {
                    const Icon = socialIcons[s.platform] ?? Globe;
                    const label = s.label || s.platform;
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="rounded-md border border-background/30 p-2 hover:bg-background/10"
                      >
                        {s.platform === "pinterest" ? (
                          <PinterestIcon className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
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
              New offers are added as brands release them.
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
