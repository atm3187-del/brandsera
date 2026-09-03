import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { CouponCard } from "@/components/CouponCard";
import { useStoresData } from "@/lib/store-data";

export const Route = createFileRoute("/_authenticated/dashboard/saved")({
  head: () => ({ meta: [{ title: "Saved coupons — Brands Era" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SavedPage,
});

function SavedPage() {
  const { user } = useAuth();
  const { stores, loading: storesLoading } = useStoresData();

  const favQ = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("favorites").select("coupon_id").eq("user_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.coupon_id));
    },
  });

  const savedCoupons = stores.flatMap((s) =>
    s.coupons.filter((c) => favQ.data?.has(c.id)).map((c) => ({ coupon: c, store: s })),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary" />
        <h1 className="font-display text-4xl font-black uppercase tracking-tight">Saved coupons</h1>
      </div>
      {(storesLoading || favQ.isLoading) ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : savedCoupons.length === 0 ? (
        <div className="rounded-md border-2 border-dashed border-foreground/40 bg-card p-10 text-center">
          <p className="text-sm font-bold uppercase text-muted-foreground">No saved coupons yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart icon on any coupon to save it here.</p>
          <Link to="/stores" className="mt-4 inline-block rounded-md border-2 border-foreground bg-primary px-4 py-2 text-xs font-black uppercase text-primary-foreground">Browse stores</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedCoupons.map(({ coupon, store }) => (
            <CouponCard key={coupon.id} coupon={coupon} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}