import { createFileRoute } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { useState } from "react";
import { MapPin, Send, CheckCircle2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () =>
    seoHead({
      path: "/contact",
      title: "Contact Brands Era",
      description: "Get in touch with the Brands Era team about coupons, partnerships or corrections.",
      jsonLd: [
        collectionLd("Contact Brands Era", "Get in touch with the Brands Era team about coupons, partnerships or corrections.", "/contact"),
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact Brands Era", path: "/contact" }]),
      ],
    }),
  component: ContactPage,
});

const inputCls =
  "mt-1 w-full rounded-md border-2 border-foreground bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim().slice(0, 120),
      email: form.email.trim().slice(0, 255),
      message: form.message.trim().slice(0, 5000),
    });
    setBusy(false);
    if (error) setError("Sorry, your message couldn't be sent. Please try again.");
    else setSent(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Have a question, a correction, or a brand takedown request? Send us a message.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-md border-2 border-foreground bg-card p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-display text-2xl font-black uppercase">Send a message</h2>
          {sent ? (
            <div className="mt-6 rounded-md border-2 border-foreground bg-accent p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 font-black uppercase">Message received</p>
              <p className="text-sm text-muted-foreground">We will reply to the email you entered.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Name</label>
                <input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</label>
                <input required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea required rows={4} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} placeholder="How can we help?" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button disabled={busy} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90 disabled:opacity-60">
                <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <Users className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg font-black uppercase">Operated by</h3>
            <p className="text-sm text-muted-foreground">Humayun Babar and Ahtasham Ali</p>
          </div>
          <div className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <MapPin className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg font-black uppercase">Location</h3>
            <p className="text-sm text-muted-foreground">Rawalpindi, Pakistan</p>
          </div>
          <div className="rounded-md border-2 border-foreground bg-primary p-6 text-primary-foreground">
            <h3 className="font-display text-lg font-black uppercase">Response Time</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">We aim to reply within a few business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
