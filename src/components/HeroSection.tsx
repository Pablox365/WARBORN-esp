import { useEffect, useState } from "react";
import Particles from "./Particles";
import bgAds from "@/assets/bg-ads.jpg";
import bgFlag from "@/assets/bg-flag.jpg";
import bgTank from "@/assets/bg-tank.jpg";
import bgHeli from "@/assets/bg-heli.jpg";
import bgSpain from "@/assets/bg-spain.jpg";
import warbornNormal from "@/assets/warborn-normal.png";
import { Crosshair, Shield, Radio, ChevronDown, Loader2 } from "lucide-react";
import { useLiveServers } from "@/hooks/useLiveServers";

const SLIDES = [bgAds, bgTank, bgHeli, bgSpain, bgFlag];

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [slide, setSlide] = useState(0);
  const fullText = "ARMA REFORGER";
  const { data, isLoading } = useLiveServers();

  const totalPlayers = (data?.normal?.players ?? 0) + (data?.hardcore?.players ?? 0);
  const totalMods = data?.normal?.modCount ?? 0;
  const onlineCount = (data?.normal?.online ? 1 : 0) + (data?.hardcore?.online ? 1 : 0);

  useEffect(() => {
    setLoaded(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 25000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${i === slide ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            style={{ transitionProperty: "opacity, transform", transitionDuration: "2000ms, 25000ms" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />
      </div>

      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-40" />
      <Particles />
      <div className="absolute inset-0 scanline pointer-events-none" />

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 pt-28 pb-16">
        <div className="max-w-4xl">
          {/* Wordmark Warborn — protagonista */}
          <div
            className={`mb-6 md:mb-8 transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative inline-block group">
              {/* Glow detrás */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-r from-primary/40 via-primary/10 to-primary/40 animate-glow-pulse"
              />
              <h2
                className="warborn-wordmark font-heading font-black tracking-[0.18em] leading-none uppercase text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10.5rem] select-none"
                data-text="WARBORN"
              >
                WARBORN
              </h2>
              {/* Línea inferior animada */}
              <div className="mt-2 h-[3px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 animate-glow-pulse" />
            </div>
          </div>

          {/* Title */}
          <div className={`mb-4 transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <span className="block text-foreground">TU COMUNIDAD DE</span>
              <span className="text-shimmer text-glow-green">{typedText}</span>
              <span className="inline-block w-0.5 h-[0.8em] bg-primary ml-1 animate-glow-pulse" />
            </h1>
          </div>

          <p
            className={`text-[10px] md:text-xs font-heading tracking-[0.3em] text-muted-foreground mb-4 transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            SIMULACIÓN TÁCTICA · COMUNIDAD HISPANOHABLANTE
          </p>

          <p
            className={`text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mb-8 font-body transition-all duration-700 delay-400 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Únete a la experiencia definitiva de Arma Reforger. Dos servidores, una comunidad.
            Desde partidas casuales hasta realismo táctico avanzado.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-3 mb-10 md:mb-12 transition-all duration-700 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="#servers"
              onClick={(e) => { e.preventDefault(); document.querySelector("#servers")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-military inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 hover:scale-[1.02] transition-all glow-green"
            >
              <Crosshair className="w-4 h-4" />
              CONECTARSE AL SERVIDOR
            </a>
            <a
              href="https://discord.com/invite/warbornesp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-border rounded-lg font-heading tracking-[0.15em] text-xs text-foreground hover:border-[#5865F2] hover:text-[#5865F2] hover:bg-[#5865F2]/5 hover:scale-[1.02] transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              ÚNETE AL DISCORD
            </a>
          </div>

          {/* Live stats */}
          <div
            className={`flex flex-wrap gap-5 md:gap-10 transition-all duration-700 delay-600 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <LiveStat icon={<Crosshair className="w-4 h-4 text-primary" />} value={isLoading ? null : totalPlayers} label="JUGADORES EN VIVO" />
            <LiveStat icon={<Shield className="w-4 h-4 text-primary" />} value={isLoading ? null : onlineCount} label="SERVIDORES ONLINE" total={2} />
            <LiveStat icon={<Radio className="w-4 h-4 text-primary" />} value={isLoading ? null : totalMods} label="MODS ACTIVOS" />
          </div>

          {/* HUD quick status */}
          <div className={`flex flex-col sm:flex-row gap-3 mt-8 transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <ServerQuickStatus name="NORMAL" players={data?.normal?.players ?? 0} maxPlayers={data?.normal?.maxPlayers ?? 0} online={!!data?.normal?.online} loading={isLoading} />
            <ServerQuickStatus name="HARDCORE" players={data?.hardcore?.players ?? 0} maxPlayers={data?.hardcore?.maxPlayers ?? 0} online={!!data?.hardcore?.online} loading={isLoading} />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-20 right-6 flex flex-col gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`w-1 transition-all duration-500 rounded-full ${i === slide ? "h-8 bg-primary" : "h-3 bg-foreground/30 hover:bg-foreground/60"}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <span className="text-[8px] font-heading tracking-[0.3em] text-muted-foreground">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-primary animate-scroll-indicator" />
      </div>
    </section>
  );
};

const LiveStat = ({ icon, value, label, total }: { icon: React.ReactNode; value: number | null; label: string; total?: number }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</div>
    <div>
      <div className="text-lg md:text-xl font-heading font-bold text-foreground flex items-center gap-1">
        {value === null ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <>{value}{total ? `/${total}` : ""}</>}
      </div>
      <div className="text-[8px] font-heading tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  </div>
);

const ServerQuickStatus = ({ name, players, maxPlayers, online, loading }: { name: string; players: number; maxPlayers: number; online: boolean; loading: boolean }) => (
  <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl animate-hud-flicker group hover:border-primary/30 transition-all duration-300">
    <div className="flex flex-col">
      <span className="text-[8px] font-heading tracking-[0.2em] text-muted-foreground">SERVIDOR</span>
      <span className={`text-xs font-heading font-bold tracking-wider ${online ? "text-primary" : "text-destructive"}`}>
        {loading ? "..." : online ? "ONLINE" : "OFFLINE"}
      </span>
    </div>
    <div className="w-px h-8 bg-border" />
    <div className="flex flex-col">
      <span className="text-[8px] font-heading tracking-[0.2em] text-muted-foreground">{name}</span>
      <span className="text-xs font-heading font-bold">{loading ? "—" : `${players}/${maxPlayers}`}</span>
    </div>
    <span className={`w-2 h-2 rounded-full ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
  </div>
);

export default HeroSection;
