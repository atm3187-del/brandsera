import { CheckCircle2, Copy } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import type { Coupon, Store } from "@/lib/store-data";

export function CouponCard({ coupon, store }: { coupon: Coupon; store: Store }) {
  return (
    <div
      className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between">
        <BrandLogo name={store.name} />
        <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
          <CheckCircle2 className="h-3 w-3" /> {coupon.type}
        </span>
      </div>
      <div className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{store.name}</div>
      <h3 className="mt-1 font-display text-xl font-black leading-tight">{coupon.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{coupon.description}</p>
      <div className="mt-5 flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/30">
        <button className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground">
          {coupon.type === "Code" ? (
            <>
              <Copy className="h-4 w-4" /> Get Code
            </>
          ) : (
            <>Get Deal →</>
          )}
        </button>
        <span className="text-xs font-bold uppercase text-muted-foreground">{coupon.expiryDays}d left</span>
      </div>
    </div>
  );
}
