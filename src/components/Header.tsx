import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Menu, X, Chrome, Moon, Sun } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/stores", label: "All Stores" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10 rounded-md border-2 border-foreground" />
          <div className="hidden sm:block font-display">
            <div className="text-base font-black leading-none tracking-tight uppercase">Brands Era</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-0.5">Save Loudly.</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-bold uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "hover:text-primary" }}
              activeOptions={{ exact: true }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/stores"
            className="hidden sm:inline-flex items-center justify-center rounded-md border-2 border-foreground bg-card p-2 hover:bg-accent"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-md border-2 border-foreground bg-card p-2 hover:bg-accent"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="https://chromewebstore.google.com"
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary border-2 border-foreground px-4 py-2 text-sm font-black uppercase text-primary-foreground hover:-translate-y-0.5 transition"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Chrome className="h-4 w-4" /> Add to Chrome
          </a>
          <button
            className="md:hidden rounded-md border-2 border-foreground bg-card p-2 hover:bg-accent"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t-2 border-foreground bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-bold uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
