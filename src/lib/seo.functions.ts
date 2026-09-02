import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchPostSeo, fetchSectionSeo, fetchStoreSeo } from "./seo.server";

export const getStoreSeo = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => fetchStoreSeo(data.slug));

export const getSectionSeo = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(120), section: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => fetchSectionSeo(data.slug, data.section));

export const getPostSeo = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(160) }).parse(d))
  .handler(async ({ data }) => fetchPostSeo(data.slug));
