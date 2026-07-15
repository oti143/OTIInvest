
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Search, Menu, X, Home, TrendingUp, BookOpen, Settings2, ChevronRight } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isApplyPage = location.pathname === "/apply";
  const isAgreementPage = location.pathname === "/agreement";

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/register", icon: BookOpen, label: "Register" },
    { to: "/status", icon: Search, label: "Status" },
    { to: "/admin", icon: Shield, label: "Admin" },
    { to: "/technical-department", icon: Settings2, label: "Tech Assist" },
    { to: "/apply", icon: TrendingUp, label: "Apply Now", highlight: true },
  ];

  // Close menus on route change
  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleNavSelect = () => {
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-navy-dark/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 gold-gradient rounded-sm flex items-center justify-center">
            <span className="text-navy-dark font-serif font-bold text-sm">OTI</span>
          </div>
          <div className="hidden sm:block">
            <p className="gold-text font-serif font-semibold text-sm leading-tight">One Time Invest</p>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Plan</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
              aria-label="Open navigation menu"
            >
              <Menu size={16} />
              <span>Menu</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-xl border border-gold/20 bg-navy-dark/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-md">
                {navLinks.map(({ to, icon: Icon, label, highlight }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleNavSelect}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${
                      highlight
                        ? "gold-gradient text-navy-dark font-semibold"
                        : location.pathname === to
                        ? "bg-gold/10 text-gold"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={15} />
                      {label}
                    </span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {!isApplyPage && !isAgreementPage && (
            <Link
              to="/apply"
              className="text-sm px-4 py-2 rounded gold-gradient text-navy-dark font-semibold hover:opacity-90 transition-opacity"
            >
              Apply Now
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded border border-border text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 sm:hidden flex flex-col transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#060d1c", borderLeft: "1px solid rgba(201,168,76,0.35)" }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gold-gradient rounded-sm flex items-center justify-center">
              <span className="text-navy-dark font-serif font-bold text-xs">OTI</span>
            </div>
            <span className="gold-text font-serif font-semibold text-sm">One Time Invest</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
          {navLinks.map(({ to, icon: Icon, label, highlight }) => (
            <Link
              key={to}
              to={to}
              onClick={handleNavSelect}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-medium text-base transition-all ${
                highlight
                  ? "gold-gradient text-navy-dark font-bold shadow-lg shadow-gold/20"
                  : location.pathname === to
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 py-5 border-t border-gold/15">
          <Link
            to="/technical-department"
            className="flex items-center gap-2 text-xs text-gold hover:text-gold/80"
          >
            <Settings2 size={12} />
            <span>Tech Assist</span>
          </Link>
          <p className="text-muted-foreground text-xs mt-2">© {new Date().getFullYear()} OTI One Time Invest</p>
        </div>
      </div>
    </nav>
  );
}
