import { createFileRoute } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () =>
    seoHead({
    path: '/contact',
    title: 'Contact Brands Era',
    description: 'Get in touch with the Brands Era team about coupons, partnerships or corrections.',
    jsonLd: [collectionLd('Contact Brands Era', 'Get in touch with the Brands Era team about coupons, partnerships or corrections.', '/contact'), breadcrumbLd([{ name: "Home", path: "/" }, { name: 'Contact Brands Era', path: '/contact' }])]
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">Contact Support</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Have a question, feedback, or partnership idea? We read every message.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-md border-2 border-foreground bg-card p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-2xl font-black uppercase">Send a message</h2>
          {sent ? (
            <div className="mt-6 rounded-md border-2 border-foreground bg-accent p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 font-black uppercase">Message sent!</p>
              <p className="text-sm text-muted-foreground">We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Name</label>
                <input required className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</label>
                <input required type="email" className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea required rows={4} className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help?" />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90">
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <Mail className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg font-black uppercase">Email</h3>
            <p className="text-sm text-muted-foreground">support@brands-era.com</p>
          </div>
          <div className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <MessageSquare className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg font-black uppercase">Social</h3>
            <p className="text-sm text-muted-foreground">Find us on Twitter, Facebook, and Instagram.</p>
          </div>
          <div className="rounded-md border-2 border-foreground bg-primary p-6 text-primary-foreground">
            <h3 className="font-display text-lg font-black uppercase">Response Time</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">We aim to reply within 24 hours during business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
