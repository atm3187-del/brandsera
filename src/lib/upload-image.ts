import { supabase } from "@/integrations/supabase/client";

/** Upload an image to the private image bucket and return its public proxy URL. Admin-only (enforced by storage policies). */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return `/api/public/blog-image/${path}`;
}
