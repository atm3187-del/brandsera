import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () =>
    seoHead({
      path: "/careers",
      title: "Careers at Brands Era",
      description: "Brands Era is a small team based in Rawalpindi, Pakistan. We are not hiring right now.",
      jsonLd: [
        collectionLd("Careers at Brands Era", "Brands Era is a small team based in Rawalpindi, Pakistan. We are not hiring right now.", "/careers"),
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Careers at Brands Era", path: "/careers" }]),
      ],
    }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
      <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest">
        <Briefcase className="h-3.5 w-3.5 text-primary" /> Careers
      </div>
      <h1 className="mt-4 font-display text-4xl font-black uppercase md:text-6xl">Careers</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground font-medium">
        Brands Era is a small team based in Rawalpindi, Pakistan. We don&apos;t have any open positions right now. If you&apos;d
        still like to introduce yourself, send us a message through the{" "}
        <Link to="/contact" className="underline">contact form</Link>.
      </p>
    </div>
  );
}
