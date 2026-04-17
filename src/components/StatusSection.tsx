import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Activity, Users, MapPin, Box, Globe, Wrench, ExternalLink, Loader2 } from "lucide-react";
import { useLiveServers, type LiveServer } from "@/hooks/useLiveServers";

const StatusSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data, isLoading } = useLiveServers();

  return (
    <section id="status" className="relative py-20 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          visible={isVisible}
          label="SISTEMA · TIEMPO REAL"
          title="ESTADO DE SERVIDORES"
          subtitle="Sincronizado con BattleMetrics. Actualización cada 30s."
        />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mt-10 md:mt-12">
          <ServerPanel
            title="WARBORN NORMAL"
            data={data?.normal}
            loading={isLoading}
            visible={isVisible}
            delay={300}
            bmUrl="https://www.battlemetrics.com/servers/reforger/38708697"
          />
          <ServerPanel
            title="WARBORN HARDCORE"
            data={data?.hardcore}
            loading={isLoading}
            visible={isVisible}
            delay={500}
            bmUrl="https://www.battlemetrics.com/servers/reforger/38672956"
          />
        </div>
      </div>
    </section>
  );
};

const iconMap: Record<string, React.ReactNode> = {
  JUGADORES: <Users className="w-3.5 h-3.5 text-primary" />,
  MAPA: <MapPin className="w-3.5 h-3.5 text-primary" />,
  "VERSIÓN": <Box className="w-3.5 h-3.5 text-primary" />,
  PAÍS: <Globe className="w-3.5 h-3.5 text-primary" />,
  RANK: <Activity className="w-3.5 h-3.5 text-primary" />,
  MODDED: <Wrench className="w-3.5 h-3.5 text-primary" />,
};

const ServerPanel = ({
  title,
  data,
  loading,
  visible,
  delay,
  bmUrl,
}: {
  title: string;
  data?: LiveServer;
  loading: boolean;
  visible: boolean;
  delay: number;
  bmUrl: string;
}) => {
  const online = data?.online ?? false;
  const players = data?.players ?? 0;
  const max = data?.maxPlayers ?? 0;
  const pct = max > 0 ? Math.round((players / max) * 100) : 0;

  return (
    <div
      className={`relative bg-card border border-border rounded-xl overflow-hidden animate-hud-flicker transition-all duration-700 group hover:border-primary/30 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-border gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {loading && !data ? (
            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground shrink-0" />
          ) : (
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
          )}
          <span className="font-heading tracking-[0.15em] text-[11px] md:text-xs font-bold truncate">{title}</span>
        </div>
        <span className={`text-[8px] md:text-[9px] font-heading tracking-[0.15em] px-2.5 md:px-3 py-1 rounded-full shrink-0 ${
          loading && !data
            ? "text-muted-foreground bg-muted/30"
            : online
              ? "text-primary bg-primary/10"
              : "text-destructive bg-destructive/10"
        }`}>
          {loading && !data ? "..." : online ? "OPERATIVO" : "OFFLINE"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        {[
          { label: "JUGADORES", value: data ? `${players}/${max}` : "—" },
          { label: "MAPA", value: data?.map ?? "—" },
          { label: "VERSIÓN", value: data?.version ?? "—" },
          { label: "PAÍS", value: data?.country ?? "—" },
          { label: "RANK", value: data?.rank ? `#${data.rank}` : "—" },
          { label: "MODDED", value: data ? (data.modded ? "SÍ" : "NO") : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-card p-3 md:p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              {iconMap[s.label]}
              <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-[11px] md:text-xs font-heading font-bold truncate">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="p-4 md:p-5">
        <div className="flex justify-between text-[8px] font-heading tracking-[0.15em] text-muted-foreground mb-2">
          <span>CAPACIDAD</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>

        <a
          href={bmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[9px] font-heading tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          VER EN BATTLEMETRICS
        </a>
      </div>
    </div>
  );
};

export default StatusSection;
