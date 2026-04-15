import { useEffect, useState, useRef } from "react";
import Particles from "./Particles";
import heroBg from "@/assets/hero-bg.jpg";
import warbornNormal from "@/assets/warborn-normal.png";
import warbornHardcore from "@/assets/warborn-hardcore-clean.png";
import { Crosshair, Shield, Radio, ChevronDown } from "lucide-react";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "ARMA REFORGER";
  const counterRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({ players: 0, servers: 0, mods: 0 });

  useEffect(() => {
    setLoaded(true);
    // Typewriter effect
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else clearInterval(timer);
    }, 80);

    // Counter animation
    const duration = 2000;
    const targets = { players: 42, servers: 2, mods: 14 };
    const start = Date.now();
    const countTimer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        players: Math.round(targets.players * ease),
        servers: Math.round(targets.servers * ease),
        mods: Math.round(targets.mods * ease),
      });
      if (progress >= 1) clearInterval(countTimer);
    }, 30);

    return () => { clearInterval(timer); clearInterval(countTimer); };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG image with parallax feel */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className={`w-full h-full object-cover transition-transform duration-[2s] ${loaded ? "scale-100" : "scale-110"}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />
      </div>

      {/* Animated grid */}
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-40" />

      <Particles />

      {/* Multiple scanlines */}
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 pt-28 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 rounded-full mb-8 transition-all duration-700 ${
              loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-status-pulse" />
            <span className="text-[10px] font-heading tracking-[0.2em] text-primary">SERVIDORES ACTIVOS</span>
          </div>

          {/* Logos with float animation */}
          <div
            className={`flex items-center gap-4 md:gap-6 mb-8 transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative group">
              <img src={warbornNormal} alt="Warborn Normal" className="h-12 md:h-16 lg:h-20 animate-float transition-transform group-hover:scale-110" />
              <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
            <div className="relative group">
              <img src={warbornHardcore} alt="Warborn Hardcore" className="h-12 md:h-16 lg:h-20 animate-float transition-transform group-hover:scale-110" style={{ animationDelay: "0.5s" }} />
              <div className="absolute -inset-2 bg-red-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Title with typing effect */}
          <div className={`mb-4 transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <span className="block text-foreground">TU COMUNIDAD DE</span>
              <span className="text-shimmer text-glow-green">{typedText}</span>
              <span className="inline-block w-0.5 h-[0.8em] bg-primary ml-1 animate-glow-pulse" />
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className={`text-[10px] md:text-xs font-heading tracking-[0.3em] text-muted-foreground mb-4 transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            SIMULACIÓN TÁCTICA · COMUNIDAD HISPANOHABLANTE
          </p>

          {/* Description */}
          <p
            className={`text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mb-8 font-body transition-all duration-700 delay-400 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Únete a la experiencia definitiva de Arma Reforger. Dos servidores, una comunidad. 
            Desde partidas casuales hasta realismo táctico avanzado.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mb-12 transition-all duration-700 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="#servers"
              onClick={(e) => { e.preventDefault(); document.querySelector("#servers")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-military inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 hover:scale-[1.02] transition-all glow-green"
            >
              <Crosshair className="w-4 h-4" />
              CONECTARSE AL SERVIDOR
            </a>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-border rounded-lg font-heading tracking-[0.15em] text-xs text-foreground hover:border-[#5865F2] hover:text-[#5865F2] hover:bg-[#5865F2]/5 hover:scale-[1.02] transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              ÚNETE AL DISCORD
            </a>
          </div>

          {/* Stats counters */}
          <div
            ref={counterRef}
            className={`flex flex-wrap gap-6 md:gap-10 transition-all duration-700 delay-600 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <StatCounter icon={<Crosshair className="w-4 h-4 text-primary" />} value={counts.players} label="JUGADORES ACTIVOS" suffix="+" />
            <StatCounter icon={<Shield className="w-4 h-4 text-primary" />} value={counts.servers} label="SERVIDORES" />
            <StatCounter icon={<Radio className="w-4 h-4 text-primary" />} value={counts.mods} label="MODS ACTIVOS" suffix="+" />
          </div>

          {/* Quick HUD status */}
          <div className={`flex flex-col sm:flex-row gap-3 mt-8 transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <ServerQuickStatus name="NORMAL" players={24} maxPlayers={64} online />
            <ServerQuickStatus name="HARDCORE" players={18} maxPlayers={40} online />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <span className="text-[8px] font-heading tracking-[0.3em] text-muted-foreground">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-primary animate-scroll-indicator" />
      </div>
    </section>
  );
};

const StatCounter = ({ icon, value, label, suffix = "" }: { icon: React.ReactNode; value: number; label: string; suffix?: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-lg md:text-xl font-heading font-bold text-foreground">{value}{suffix}</div>
      <div className="text-[8px] font-heading tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  </div>
);

const ServerQuickStatus = ({ name, players, maxPlayers, online }: { name: string; players: number; maxPlayers: number; online: boolean }) => (
  <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl animate-hud-flicker group hover:border-primary/30 transition-all duration-300">
    <div className="flex flex-col">
      <span className="text-[8px] font-heading tracking-[0.2em] text-muted-foreground">SERVIDOR</span>
      <span className={`text-xs font-heading font-bold tracking-wider ${online ? "text-primary" : "text-destructive"}`}>
        {online ? "ONLINE" : "OFFLINE"}
      </span>
    </div>
    <div className="w-px h-8 bg-border" />
    <div className="flex flex-col">
      <span className="text-[8px] font-heading tracking-[0.2em] text-muted-foreground">{name}</span>
      <span className="text-xs font-heading font-bold">{players}/{maxPlayers}</span>
    </div>
    <span className={`w-2 h-2 rounded-full ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
  </div>
);

export default HeroSection;
