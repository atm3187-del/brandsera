import { CheckCircle2, Copy, ExternalLink, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "./BrandLogo";
import { shopUrl, type Coupon, type Store } from "@/lib/store-data";
import { useFavorite } from "@/hooks/use-favorite";
import { useAuth } from "@/hooks/use-auth";

export function CouponCard({ coupon, store }: { coupon: Coupon; store: Store }) {
  const { user } = useAuth();
  const { isFavorite, toggle, pending } = useFavorite(coupon.id);
  return (
    <div
      className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between">
        <BrandLogo name={store.name} />
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={toggle}
              disabled={pending}
              aria-label={isFavorite ? "Remove from favorites" : "Save coupon"}
              className="rounded-md border-2 border-foreground bg-card p-1.5 hover:bg-accent"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            </button>
          )}
          <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
            <CheckCircle2 className="h-3 w-3" /> {coupon.type}
          </span>
        </div>
      </div>
      <Link
        to="/store/$slug"
        params={{ slug: store.slug }}
        className="mt-4 block text-xs font-bold uppercase tracking-widest text-primary hover:underline"
      >
        {store.name}
      </Link>
      <Link to="/store/$slug" params={{ slug: store.slug }} className="block">
        <h3 className="mt-1 font-display text-xl font-black leading-tight hover:underline">{coupon.title}</h3>
      </Link>
      <p className="mt-2 text-sm text-muted-foreground">{coupon.description}</p>
      <div className="mt-5 flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/30">
        {coupon.type === "Code" ? (
          <Link
            to="/store/$slug"
            params={{ slug: store.slug }}
            className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <Copy className="h-4 w-4" /> Get Code
          </Link>
        ) : (
          <a
            href={shopUrl(store, coupon)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="h-4 w-4" /> Get Deal
          </a>
        )}
        <div className="flex items-center gap-3">
          <a
            href={shopUrl(store, coupon)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 text-xs font-black uppercase text-primary hover:underline"
          >
            Shop <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-xs font-bold uppercase text-muted-foreground">{coupon.expiryDays}d left</span>
        </div>
      </div>
    </div>
  );
}
