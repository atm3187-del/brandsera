import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Brands Era" },
      { name: "description", content: "Brands Era terms of service. Rules and guidelines for using our website." },
      { property: "og:title", content: "Terms of Service — Brands Era" },
      { property: "og:description", content: "Terms and conditions for using Brands Era." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <h1 className="font-display text-4xl font-black md:text-5xl uppercase">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-foreground/80">
        <section>
          <h2 className="font-display text-xl font-black uppercase">1. Acceptance</h2>
          <p className="mt-2 text-sm leading-relaxed">
            By accessing or using Brands Era, you agree to these Terms of Service. If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">2. Use of the Service</h2>
          <p className="mt-2 text-sm leading-relaxed">
            Brands Era provides links to third-party deals and coupons. We do not guarantee availability, pricing, or accuracy of third-party offers. Always verify the final price at checkout.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">3. Intellectual Property</h2>
          <p className="mt-2 text-sm leading-relaxed">
            All content, trademarks, and branding on Brands Era are owned by Brands Era or its licensors. You may not reproduce or distribute content without permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">4. Limitation of Liability</h2>
          <p className="mt-2 text-sm leading-relaxed">
            Brands Era is not liable for any losses related to third-party transactions, expired coupons, or website unavailability. Use deals at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">5. Changes</h2>
          <p className="mt-2 text-sm leading-relaxed">
            We may update these terms at any time. Continued use of the site after changes constitutes acceptance.
          </p>
        </section>
      </div>
    </div>
  );
}
