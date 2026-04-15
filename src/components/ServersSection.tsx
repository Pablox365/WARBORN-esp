import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import warbornNormal from "@/assets/warborn-normal.png";
import warbornHardcore from "@/assets/warborn-hardcore-clean.png";
import { Users, MapPin, Wifi, Copy, Play } from "lucide-react";

const servers = [
  {
    name: "WARBORN NORMAL",
    subtitle: "CASUAL / SEMI-REALISMO",
    logo: warbornNormal,
    description: "Partidas fluidas con un equilibrio entre diversión y realismo. Ideal para nuevos jugadores y sesiones casuales.",
    ip: "0.0.0.0:2001",
    players: 24,
    maxPlayers: 64,
    map: "Everon",
    online: true,
    isNormal: true,
  },
  {
    name: "WARBORN HARDCORE",
    subtitle: "REALISMO TÁCTICO AVANZADO",
    logo: warbornHardcore,
    description: "Experiencia militar inmersiva con comunicación táctica, mods avanzados y reglas estrictas de combate.",
    ip: "0.0.0.0:2002",
    players: 18,
    maxPlayers: 40,
    map: "Arland",
    online: true,
    isNormal: false,
  },
];

const ServersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="servers" className="relative py-24 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="SERVIDORES" title="ELIGE TU MODO" subtitle="Dos experiencias, una comunidad." />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-12">
          {servers.map((s, i) => (
            <div
              key={s.name}
              className={`group relative bg-card border border-border rounded-xl overflow-hidden card-hover transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 200 + 300}ms` }}
            >
              {/* Top accent bar with gradient */}
              <div className={`h-1 ${s.isNormal ? "bg-gradient-to-r from-primary/50 via-primary to-primary/50" : "bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50"}`} />

              <div className="p-6 md:p-8">
                {/* Logo + status */}
                <div className="flex items-start justify-between mb-6">
                  <img src={s.logo} alt={s.name} className="h-10 md:h-14 group-hover:scale-105 transition-transform duration-300" />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                    <span className={`w-2 h-2 rounded-full ${s.online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
                    <span className={`text-[9px] font-heading tracking-[0.15em] ${s.online ? "text-primary" : "text-destructive"}`}>
                      {s.online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-heading font-bold mb-1">{s.name}</h3>
                <p className="text-[9px] font-heading tracking-[0.3em] text-muted-foreground mb-4">{s.subtitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-body">{s.description}</p>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <StatBox icon={<Users className="w-3.5 h-3.5 text-primary" />} label="JUGADORES" value={`${s.players}/${s.maxPlayers}`} />
                  <StatBox icon={<MapPin className="w-3.5 h-3.5 text-primary" />} label="MAPA" value={s.map} />
                  <StatBox icon={<Wifi className="w-3.5 h-3.5 text-primary" />} label="PING" value="32ms" />
                </div>

                {/* IP */}
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg mb-6 group/ip hover:bg-secondary/70 transition-colors">
                  <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">IP:</span>
                  <code className="text-[11px] font-mono-code text-foreground">{s.ip}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(s.ip)}
                    className="ml-auto text-muted-foreground hover:text-primary transition-all hover:scale-110"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* CTA */}
                <button className={`w-full btn-military py-3 rounded-lg font-heading tracking-[0.15em] text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] ${s.isNormal ? "bg-primary text-primary-foreground glow-green-sm" : "bg-red-600 text-foreground"} hover:brightness-110`}>
                  <Play className="w-3.5 h-3.5" />
                  CONECTARSE
                </button>
              </div>

              {/* HUD corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/20 group-hover:border-primary/50 transition-colors" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/20 group-hover:border-primary/50 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="text-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
    <div className="flex justify-center mb-1">{icon}</div>
    <div className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground mb-0.5">{label}</div>
    <div className="text-xs font-heading font-bold">{value}</div>
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
