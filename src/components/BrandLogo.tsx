export function BrandLogo({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  if (src) {
    return (
      <div className={`${dim} shrink-0 overflow-hidden rounded-md border-2 border-foreground bg-card`}>
        <img src={src} alt={`${name} logo`} className="h-full w-full object-contain p-1" loading="lazy" />
      </div>
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className={`${dim} flex shrink-0 items-center justify-center rounded-md bg-accent border-2 border-foreground font-black text-foreground`}>
      {initials}
    </div>
  );
}
