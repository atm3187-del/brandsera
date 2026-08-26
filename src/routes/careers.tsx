import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Work at Brands Era" },
      { name: "description", content: "Join the Brands Era team. Open roles in editorial, engineering and partnerships for people obsessed with saving shoppers money." },
      { property: "og:title", content: "Careers at Brands Era" },
      { property: "og:description", content: "Open roles in editorial, engineering and partnerships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CareersPage,
});

const roles = [
  { title: "Deals Editor", type: "Full-time · Remote", desc: "Hunt, test and publish coupon codes across our top 500 brands." },
  { title: "Frontend Engineer", type: "Full-time · Remote", desc: "Build fast, accessible shopping experiences in React and TypeScript." },
  { title: "Partnerships Manager", type: "Contract · Remote", desc: "Grow affiliate relationships with retailers and negotiate exclusive codes." },
];

function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
      <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        <Briefcase className="h-3.5 w-3.5 text-primary" /> We&apos;re hiring
      </div>
      <h1 className="mt-4 font-display text-4xl font-black uppercase md:text-6xl">Careers</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground font-medium">
        Brands Era is a small, remote-first team building the most honest coupon site on the internet. If that sounds like your thing, say hello.
      </p>

      <div className="mt-10 space-y-4">
        {roles.map((r) => (
          <div key={r.title} className="flex flex-col gap-4 rounded-md border-2 border-foreground bg-card p-6 sm:flex-row sm:items-center" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-black uppercase">{r.title}</h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">{r.type}</div>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            </div>
            <Link to="/contact" className="inline-flex shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-primary px-5 py-2.5 text-xs font-black uppercase text-primary-foreground">
              Apply
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
