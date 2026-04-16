import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Activity, Users, MapPin, Box, HardDrive, Clock } from "lucide-react";

const StatusSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="status" className="relative py-24 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="SISTEMA" title="ESTADO EN TIEMPO REAL" subtitle="Monitorización avanzada de la infraestructura." />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <ServerPanel name="NORMAL" online players={24} maxPlayers={64} map="Everon" version="1.2.0.42" mods={6} uptime="99.8%" visible={isVisible} delay={300} />
          <ServerPanel name="HARDCORE" online players={18} maxPlayers={40} map="Arland" version="1.2.0.42" mods={8} uptime="99.5%" visible={isVisible} delay={500} />
        </div>
      </div>
    </section>
  );
};

const iconMap: Record<string, React.ReactNode> = {
  JUGADORES: <Users className="w-3.5 h-3.5 text-primary" />,
  MAPA: <MapPin className="w-3.5 h-3.5 text-primary" />,
  "VERSIÓN": <Box className="w-3.5 h-3.5 text-primary" />,
  "MODS ACTIVOS": <HardDrive className="w-3.5 h-3.5 text-primary" />,
  UPTIME: <Clock className="w-3.5 h-3.5 text-primary" />,
  LATENCIA: <Activity className="w-3.5 h-3.5 text-primary" />,
};

const ServerPanel = ({ name, online, players, maxPlayers, map, version, mods, uptime, visible, delay }: {
  name: string; online: boolean; players: number; maxPlayers: number; map: string; version: string; mods: number; uptime: string; visible: boolean; delay: number;
}) => (
  <div
    className={`relative bg-card border border-border rounded-xl overflow-hidden animate-hud-flicker transition-all duration-700 group hover:border-primary/30 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between p-5 border-b border-border">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
        <span className="font-heading tracking-[0.15em] text-xs font-bold">{name}</span>
      </div>
      <span className={`text-[9px] font-heading tracking-[0.15em] px-3 py-1 rounded-full ${online ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
        {online ? "OPERATIVO" : "OFFLINE"}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-px bg-border">
      {[
        { label: "JUGADORES", value: `${players}/${maxPlayers}` },
        { label: "MAPA", value: map },
        { label: "VERSIÓN", value: version },
        { label: "MODS ACTIVOS", value: String(mods) },
        { label: "UPTIME", value: uptime },
        { label: "LATENCIA", value: "32ms" },
      ].map(s => (
        <div key={s.label} className="bg-card p-4 hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            {iconMap[s.label]}
            <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{s.label}</span>
          </div>
          <div className="text-xs font-heading font-bold">{s.value}</div>
        </div>
      ))}
    </div>

    <div className="p-5">
      <div className="flex justify-between text-[8px] font-heading tracking-[0.15em] text-muted-foreground mb-2">
        <span>CAPACIDAD</span>
        <span>{Math.round((players / maxPlayers) * 100)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000" style={{ width: `${(players / maxPlayers) * 100}%` }} />
      </div>
    </div>
  </div>
);

export default StatusSection;
