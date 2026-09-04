import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Public, read-only proxy for images in the private `blog-images` bucket.
 * URL: /api/public/blog-image/<path-in-bucket>
 */
export const Route = createFileRoute("/api/public/blog-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent((params as { _splat?: string })._splat ?? "").replace(/^\/+/, "");
        // Only allow simple, safe object paths.
        if (!path || path.includes("..") || !/^[a-zA-Z0-9/_\-.]+$/.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("blog-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
