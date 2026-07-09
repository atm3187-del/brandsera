export function BrandLogo({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className={`${dim} flex items-center justify-center rounded-md bg-accent border-2 border-foreground font-black text-foreground`}>
      {initials}
    </div>
  );
}
