import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "Associação", to: "/associacao" },
  { label: "Programa", to: "/programa" },
  { label: "Apoiar", to: "/apoiar" },
  { label: "Contactos", to: "/contactos" },
];

export function InstitutionalNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <nav className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl">
      <div className="glass-nav rounded-full h-12 px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-semibold text-sm md:text-lg tracking-tight text-white font-display truncate">
          Associação Lusíada
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-primary text-white shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass-nav mt-2 rounded-2xl p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-body transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-primary text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
