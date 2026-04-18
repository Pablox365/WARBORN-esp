import { useState, useEffect } from "react";
import warbornNormal from "@/assets/warborn-normal.png";

const navLinks = [
  { label: "INICIO", href: "#hero" },
  { label: "SERVIDORES", href: "#servers" },
  { label: "MODS", href: "#mods" },
  { label: "ESTADO", href: "#status" },
  { label: "MERCH", href: "#merch" },
  { label: "PARTNERS", href: "#partners" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(`#${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Triple-click on logo opens admin (hidden fallback)
  useEffect(() => {
    if (logoClicks === 0) return;
    if (logoClicks >= 3) {
      window.dispatchEvent(new CustomEvent("warborn:open-admin"));
      setLogoClicks(0);
      return;
    }
    const t = setTimeout(() => setLogoClicks(0), 800);
    return () => clearTimeout(t);
  }, [logoClicks]);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogoClick = () => {
    setLogoClicks((c) => c + 1);
    handleClick("#hero");
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-6xl ${
        scrolled
          ? "glass rounded-2xl shadow-lg shadow-black/20"
          : "bg-background/30 backdrop-blur-sm rounded-2xl border border-border/30"
      }`}
    >
      <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        {/* Logo as button (triple-click opens admin) */}
        <button onClick={handleLogoClick} className="flex items-center group" aria-label="Inicio Warborn">
          <img src={warbornNormal} alt="Warborn" className="h-8 md:h-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_hsl(142_70%_45%/0.4)]" />
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className={`px-3 py-1.5 text-[10px] font-heading tracking-[0.15em] transition-all duration-300 rounded-lg relative group ${
                activeSection === l.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {l.label}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-300 ${
                activeSection === l.href ? "w-4" : "w-0 group-hover:w-4"
              }`} />
            </button>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="https://discord.com/invite/warbornesp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-heading tracking-[0.15em] text-muted-foreground hover:text-[#5865F2] hover:bg-[#5865F2]/10 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            DISCORD
          </a>
          <button
            onClick={() => handleClick("#servers")}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-heading tracking-[0.15em] font-bold hover:brightness-110 transition-all duration-300 glow-green-sm btn-military"
          >
            JUGAR
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileOpen ? "max-h-[500px]" : "max-h-0"}`}>
        <div className="px-4 py-4 flex flex-col gap-1 border-t border-border/30">
          {navLinks.map((l, i) => (
            <button
              key={l.href}
              onClick={() => handleClick(l.href)}
              className={`text-left px-4 py-2.5 font-heading tracking-[0.15em] text-xs rounded-lg transition-all duration-300 ${
                activeSection === l.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {l.label}
            </button>
          ))}
          <div className="flex gap-2 mt-3 px-2">
            <a href="https://discord.com/invite/warbornesp" target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-4 py-2.5 border border-border rounded-lg font-heading tracking-[0.15em] text-[10px] hover:border-[#5865F2] hover:text-[#5865F2] transition-all">DISCORD</a>
            <button onClick={() => handleClick("#servers")} className="flex-1 text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-[10px] font-bold">JUGAR</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
