import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { ShieldCheck, Zap, Copy, MapPin } from "lucide-react";

const TITLE = "About Brands Era — Who We Are";
const DESC = "Brands Era is a coupon and deals website run by Humayun Babar and Ahtasham Ali from Rawalpindi, Pakistan.";

export const Route = createFileRoute("/about")({
  head: () =>
    seoHead({
      path: "/about",
      title: TITLE,
      description: DESC,
      jsonLd: [collectionLd(TITLE, DESC, "/about"), breadcrumbLd([{ name: "Home", path: "/" }, { name: "About Brands Era", path: "/about" }])],
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">About Brands Era</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Brands Era is a small coupon and deals website. We collect promo codes and offers from popular brands and link you
          straight to the retailer&apos;s own website, where you complete your purchase. We don&apos;t sell products ourselves.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Honest Listings", desc: "We list offers as we find them and remove ones that are reported as expired or not working." },
          { icon: Zap, title: "Regular Updates", desc: "New offers are added as brands release them." },
          { icon: Copy, title: "Easy to Use", desc: "Copy a code, then continue to the brand's official site. Always confirm the final price at checkout." },
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
            <h2 className="font-display text-3xl font-black uppercase">Who runs Brands Era</h2>
            <p className="mt-4 text-primary-foreground/80 font-medium">
              Brands Era is operated by Humayun Babar and Ahtasham Ali. We are not affiliated with, or endorsed by, the brands
              listed on this site unless clearly stated. Some links are affiliate links — see our{" "}
              <Link to="/disclosure" className="underline">affiliate disclosure</Link>.
            </p>
          </div>
          <div className="rounded-md border-2 border-foreground bg-card p-5 text-card-foreground">
            <MapPin className="h-6 w-6 text-primary" />
            <div className="mt-2 font-display text-xl font-black uppercase">Rawalpindi, Pakistan</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Questions, corrections or brand takedown requests? Use our <Link to="/contact" className="underline">contact form</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
