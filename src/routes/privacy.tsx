import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seoHead({
    path: '/privacy',
    title: 'Privacy Policy — Brands Era',
    description: 'How Brands Era collects, uses and protects your personal data.'
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <h1 className="font-display text-4xl font-black md:text-5xl uppercase">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-foreground/80">
        <section>
          <h2 className="font-display text-xl font-black uppercase">1. Information We Collect</h2>
          <p className="mt-2 text-sm leading-relaxed">
            We collect information you provide directly to us, such as your name and email when you contact us or subscribe to our newsletter. We also collect usage data and cookies to improve your experience.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">2. How We Use Information</h2>
          <p className="mt-2 text-sm leading-relaxed">
            We use your information to operate and improve our website, respond to inquiries, send newsletters, and analyze trends. We do not sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">3. Cookies</h2>
          <p className="mt-2 text-sm leading-relaxed">
            Cookies help us understand how visitors interact with Brands Era. You can disable cookies in your browser settings at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">4. Third-Party Links</h2>
          <p className="mt-2 text-sm leading-relaxed">
            Our website contains links to third-party stores. We are not responsible for their privacy practices or content.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black uppercase">5. Contact</h2>
          <p className="mt-2 text-sm leading-relaxed">
            If you have questions about this Privacy Policy, contact us at support@brands-era.com.
          </p>
        </section>
      </div>
    </div>
  );
}
