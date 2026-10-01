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
      className="group flex flex-col gap-5 rounded-md border-2 border-foreground bg-card p-5 transition hover:-translate-y-0.5 md:flex-row md:items-center md:gap-6 md:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Brand block */}
      <div className="flex items-center gap-4 md:w-56 md:shrink-0 md:flex-col md:items-start md:gap-3 md:border-r-2 md:border-dashed md:border-foreground/25 md:pr-6">
        <BrandLogo name={store.name} src={store.logoUrl} />
        <div className="min-w-0">
          <Link
            to="/store/$slug"
            params={{ slug: store.slug }}
            className="block truncate text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          >
            {store.name}
          </Link>
          <span className="mt-1 inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-secondary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
            <CheckCircle2 className="h-3 w-3 text-primary" /> {coupon.type}
          </span>
        </div>
      </div>

      {/* Offer body */}
      <div className="min-w-0 flex-1">
        <Link to="/store/$slug" params={{ slug: store.slug }} className="block">
          <h3 className="font-display text-xl font-black leading-tight hover:underline md:text-2xl">{coupon.title}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{coupon.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold uppercase text-muted-foreground">
          <span>{coupon.expiryDays}d left</span>
          <a
            href={shopUrl(store, coupon)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Shop {store.name} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:w-48 md:shrink-0 md:justify-end">
        {user && (
          <button
            onClick={toggle}
            disabled={pending}
            aria-label={isFavorite ? "Remove from favorites" : "Save coupon"}
            className="rounded-md border-2 border-foreground bg-card p-2 hover:bg-accent"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          </button>
        )}
        {coupon.type === "Code" ? (
          <Link
            to="/store/$slug"
            params={{ slug: store.slug }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-sm font-black uppercase text-primary-foreground hover:opacity-90 md:flex-none"
          >
            <Copy className="h-4 w-4" /> Get Code
          </Link>
        ) : (
          <a
            href={shopUrl(store, coupon)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-2.5 text-sm font-black uppercase text-primary-foreground hover:opacity-90 md:flex-none"
          >
            <ExternalLink className="h-4 w-4" /> Get Deal
          </a>
        )}
      </div>
    </div>
  );
}
