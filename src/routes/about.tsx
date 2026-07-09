import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Zap, Copy, Users, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Brands Era" },
      { name: "description", content: "Learn how Brands Era tests and verifies coupons to help shoppers save money every day." },
      { property: "og:title", content: "About — Brands Era" },
      { property: "og:description", content: "Verified coupon codes and exclusive discounts from thousands of brands." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">About Brands Era</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          We are a premier online coupon and deal platform. Our dedicated editorial team manually tests and verifies thousands of promo codes daily, ensuring you always get the highest active discounts at checkout without the hassle of expired codes.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "100% Verified", desc: "Every code is rigorously tested before publishing to ensure it works." },
          { icon: Zap, title: "Daily Updates", desc: "Fresh deals and exclusive discounts added every single day." },
          { icon: Copy, title: "Easy to Use", desc: "One-click copy and seamless redirection for instant checkout savings." },
        ].map((f) => (
          <div key={f.title} className="rounded-md border-2 border-foreground bg-card p-8 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-foreground bg-accent text-accent-foreground">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-black uppercase">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-md border-2 border-foreground bg-primary p-8 text-primary-foreground md:p-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-black uppercase">Our Mission</h2>
            <p className="mt-4 text-primary-foreground/80 font-medium">
              Brands Era exists to make saving money simple, honest, and loud. We cut through the noise of expired codes and fake deals so shoppers can trust every click.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border-2 border-foreground bg-card p-5 text-card-foreground">
              <Users className="h-6 w-6 text-primary" />
              <div className="mt-2 font-display text-3xl font-black">100K+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Happy Shoppers</div>
            </div>
            <div className="rounded-md border-2 border-foreground bg-card p-5 text-card-foreground">
              <Award className="h-6 w-6 text-primary" />
              <div className="mt-2 font-display text-3xl font-black">98%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
