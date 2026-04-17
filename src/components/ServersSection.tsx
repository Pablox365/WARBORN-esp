import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import warbornNormal from "@/assets/warborn-normal.png";
import warbornHardcore from "@/assets/warborn-hardcore-clean.png";
import { Users, MapPin, Wifi, Copy, Play, ExternalLink, Loader2 } from "lucide-react";
import { useLiveServers, type LiveServer } from "@/hooks/useLiveServers";
import { toast } from "sonner";

const META = [
  {
    key: "normal" as const,
    name: "WARBORN NORMAL",
    subtitle: "CASUAL / SEMI-REALISMO",
    logo: warbornNormal,
    description: "Partidas fluidas con un equilibrio entre diversión y realismo. Ideal para nuevos jugadores y sesiones casuales.",
    isNormal: true,
    bmUrl: "https://www.battlemetrics.com/servers/reforger/38708697",
  },
  {
    key: "hardcore" as const,
    name: "WARBORN HARDCORE",
    subtitle: "REALISMO TÁCTICO AVANZADO",
    logo: warbornHardcore,
    description: "Experiencia militar inmersiva con comunicación táctica, mods avanzados y reglas estrictas de combate.",
    isNormal: false,
    bmUrl: "https://www.battlemetrics.com/servers/reforger/38672956",
  },
];

const ServersSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data, isLoading, error } = useLiveServers();

  return (
    <section id="servers" className="relative py-20 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="SERVIDORES · LIVE" title="ELIGE TU MODO" subtitle="Datos en tiempo real desde BattleMetrics." />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 mt-10 md:mt-12">
          {META.map((m, i) => {
            const live = data?.[m.key];
            return (
              <div
                key={m.name}
                className={`group relative bg-card border border-border rounded-xl overflow-hidden card-hover transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 200 + 300}ms` }}
              >
                <div className={`h-1 ${m.isNormal ? "bg-gradient-to-r from-primary/50 via-primary to-primary/50" : "bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50"}`} />

                <div className="p-5 md:p-8">
                  <div className="flex items-start justify-between gap-3 mb-5 md:mb-6">
                    <img src={m.logo} alt={m.name} loading="lazy" className="h-10 md:h-14 group-hover:scale-105 transition-transform duration-300" />
                    <LiveBadge loading={isLoading || !!error} live={live} />
                  </div>

                  <h3 className="text-base md:text-xl font-heading font-bold mb-1 break-words">{m.name}</h3>
                  <p className="text-[9px] font-heading tracking-[0.25em] text-muted-foreground mb-3 md:mb-4">{m.subtitle}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed mb-5 md:mb-6 font-body">{m.description}</p>

                  <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5 md:mb-6">
                    <StatBox
                      icon={<Users className="w-3.5 h-3.5 text-primary" />}
                      label="JUGADORES"
                      value={live ? `${live.players}/${live.maxPlayers}` : "—"}
                      pulse={!!live?.online}
                    />
                    <StatBox
                      icon={<MapPin className="w-3.5 h-3.5 text-primary" />}
                      label="MAPA"
                      value={live?.map ?? "—"}
                    />
                    <StatBox
                      icon={<Wifi className="w-3.5 h-3.5 text-primary" />}
                      label="ESTADO"
                      value={live ? (live.online ? "ONLINE" : "OFFLINE") : "..."}
                    />
                  </div>

                  <CapacityBar players={live?.players ?? 0} max={live?.maxPlayers ?? 0} />

                  <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-secondary/50 rounded-lg my-5 md:my-6 group/ip hover:bg-secondary/70 transition-colors overflow-hidden">
                    <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground shrink-0">IP:</span>
                    <code className="text-[10px] md:text-[11px] font-mono-code text-foreground truncate">{live?.address || "—"}</code>
                    <button
                      onClick={() => {
                        if (!live?.address) return;
                        navigator.clipboard.writeText(live.address);
                        toast.success("IP copiada");
                      }}
                      disabled={!live?.address}
                      className="ml-auto text-muted-foreground hover:text-primary transition-all hover:scale-110 disabled:opacity-30 shrink-0"
                      aria-label="Copiar IP"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className={`btn-military flex-1 py-3 rounded-lg font-heading tracking-[0.15em] text-[11px] md:text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] ${m.isNormal ? "bg-primary text-primary-foreground glow-green-sm" : "bg-red-600 text-foreground"} hover:brightness-110`}>
                      <Play className="w-3.5 h-3.5" />
                      CONECTARSE
                    </button>
                    <a
                      href={m.bmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-3 sm:px-4 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2 text-[10px] font-heading tracking-[0.15em]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="sm:hidden">BATTLEMETRICS</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const LiveBadge = ({ loading, live }: { loading: boolean; live?: LiveServer }) => {
  if (loading && !live) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 shrink-0">
        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
        <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">CARGANDO</span>
      </div>
    );
  }
  const online = live?.online;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${online ? "bg-primary/10" : "bg-destructive/10"}`}>
      <span className={`w-2 h-2 rounded-full ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
      <span className={`text-[8px] font-heading tracking-[0.15em] ${online ? "text-primary" : "text-destructive"}`}>
        {online ? "LIVE" : "OFFLINE"}
      </span>
    </div>
  );
};

const CapacityBar = ({ players, max }: { players: number; max: number }) => {
  const pct = max > 0 ? Math.min(100, Math.round((players / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-[8px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">
        <span>CAPACIDAD</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, pulse }: { icon: React.ReactNode; label: string; value: string; pulse?: boolean }) => (
  <div className={`text-center p-2.5 md:p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors ${pulse ? "ring-1 ring-primary/20" : ""}`}>
    <div className="flex justify-center mb-1">{icon}</div>
    <div className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground mb-0.5">{label}</div>
    <div className="text-[10px] md:text-xs font-heading font-bold truncate">{value}</div>
  </div>
);

export const SectionHeader = ({ visible, label, title, subtitle }: { visible: boolean; label: string; title: string; subtitle: string }) => (
  <div className="text-center">
    <span
      className={`inline-block text-[9px] font-heading tracking-[0.4em] text-primary mb-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      // {label}
    </span>
    <h2
      className={`text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-3 transition-all duration-700 delay-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {title}
    </h2>
    <p
      className={`text-xs sm:text-sm text-muted-foreground font-body transition-all duration-700 delay-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {subtitle}
    </p>
  </div>
);

export default ServersSection;
