import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { uploadImage } from "@/lib/upload-image";

/** Drag & drop / click-to-upload image field. Also accepts a pasted image URL. */
export function ImageDropField({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handle = async (file?: File | null) => {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-1 text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handle(e.dataTransfer.files?.[0]);
        }}
        className={`flex items-center gap-4 rounded-md border-2 border-dashed p-3 ${dragging ? "border-primary bg-accent" : "border-foreground bg-background"}`}
      >
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 border-foreground bg-card">
            <img src={value} alt="Preview" className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-0 top-0 rounded-bl-md bg-foreground p-0.5 text-background"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-secondary">
            <ImagePlus className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-md border-2 border-foreground bg-secondary px-3 py-1.5 text-xs font-black uppercase">
              {busy ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void handle(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <span className="text-xs text-muted-foreground">or drag & drop here</span>
          </div>
          <input
            type="text"
            placeholder="…or paste an image link"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border-2 border-foreground bg-background px-3 py-1.5 text-xs"
          />
          {err && <div className="text-xs font-bold text-destructive">{err}</div>}
        </div>
      </div>
    </div>
  );
}
