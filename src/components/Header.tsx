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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-3 py-2 text-sm font-bold uppercase hover:bg-accent"
                aria-label="Account menu"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.email?.split("@")[0]}
                </span>
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-md border-2 border-foreground bg-card p-2"
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
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary border-2 border-foreground px-4 py-2 text-sm font-black uppercase text-primary-foreground hover:-translate-y-0.5 transition"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <Chrome className="h-4 w-4" /> Sign in
            </Link>
          )}
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
