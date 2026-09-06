import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Menu, X, Chrome, Moon, Sun, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/stores", label: "All Stores" },
  { to: "/categories", label: "Categories" },
  { to: "/blog", label: "Blogs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const iconBtn =
  "rounded-md border border-background/30 bg-background/5 p-2 text-background transition hover:bg-accent hover:text-accent-foreground hover:border-accent";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const signOut = async () => {
    setAccountOpen(false);
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Brands Era" width={40} height={40} className="h-10 w-10 rounded-md border-2 border-accent" />
          <div className="hidden sm:block font-display">
            <div className="text-base font-black leading-none tracking-tight uppercase">Brands Era</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mt-0.5">Save Loudly.</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 transition"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              inactiveProps={{ className: "text-background/80 hover:bg-background/10 hover:text-background" }}
              activeOptions={{ exact: true }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/search" search={{ q: undefined }} className={`hidden sm:inline-flex items-center justify-center ${iconBtn}`} aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <button aria-label="Toggle theme" onClick={toggleTheme} className={iconBtn}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className={`flex items-center gap-2 px-3 text-sm font-bold uppercase ${iconBtn}`}
                aria-label="Account menu"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-md border-2 border-foreground bg-card p-2 text-foreground"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 rounded px-3 py-2 text-sm font-bold hover:bg-accent"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-bold hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black uppercase text-primary-foreground transition hover:-translate-y-0.5"
            >
              <Chrome className="h-4 w-4" /> Sign in
            </Link>
          )}
          <button className={`md:hidden ${iconBtn}`} aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-background/20 bg-foreground px-4 py-4 md:hidden animate-rise">
          <nav className="flex flex-col gap-1 text-sm font-bold uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                inactiveProps={{ className: "text-background/80 hover:bg-background/10" }}
                activeOptions={{ exact: true }}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="mt-2 rounded-md bg-primary px-3 py-2 text-center text-primary-foreground">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
