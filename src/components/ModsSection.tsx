import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Map, Crosshair, Truck, Code, Package, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useLiveServers, type LiveMod } from "@/hooks/useLiveServers";

const categorize = (name: string): string => {
  const n = name.toLowerCase();
  if (/(map|terrain|gogland|donetsk|zagoria|trenches|island|reforger\s*map)/.test(n)) return "MAPAS";
  if (/(weapon|arma|rifle|gun|rhs|nato|ammo)/.test(n)) return "ARMAS";
  if (/(vehicle|car|truck|tank|heli|transport|jet)/.test(n)) return "VEHÍCULOS";
  if (/(radio|sonar|anuncios|core|outside|tool|wcs|status\s*quo)/.test(n)) return "SCRIPTS";
  return "SCRIPTS";
};

const categories = ["TODOS", "MAPAS", "ARMAS", "VEHÍCULOS", "SCRIPTS"];

const categoryIcons: Record<string, React.ReactNode> = {
  MAPAS: <Map className="w-5 h-5" />,
  ARMAS: <Crosshair className="w-5 h-5" />,
  "VEHÍCULOS": <Truck className="w-5 h-5" />,
  SCRIPTS: <Code className="w-5 h-5" />,
};

const ModsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [filter, setFilter] = useState("TODOS");
  const { data, isLoading, isFetching, dataUpdatedAt } = useLiveServers();

  const mods: LiveMod[] = data?.normal?.mods ?? [];
  const enriched = mods.map((m) => ({ ...m, category: categorize(m.name) }));
  const filtered = filter === "TODOS" ? enriched : enriched.filter((m) => m.category === filter);
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  return (
    <section id="mods" className="relative py-20 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          visible={isVisible}
          label="WORKSHOP · LIVE"
          title="MODS ACTIVOS"
          subtitle="Sincronizado en tiempo real desde el servidor Normal."
        />

        <div className={`flex items-center justify-center gap-3 mt-6 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-status-pulse" />
            <span className="text-[9px] font-heading tracking-[0.2em] text-primary">{enriched.length} MODS</span>
          </div>
          {isFetching && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          {lastUpdate && (
            <span className="hidden sm:flex items-center gap-1 text-[9px] font-heading tracking-[0.2em] text-muted-foreground">
              <RefreshCw className="w-2.5 h-2.5" />
              {lastUpdate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <div className={`flex flex-wrap justify-center gap-2 mt-6 mb-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {categories.map((c) => {
            const count = c === "TODOS" ? enriched.length : enriched.filter((m) => m.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-[9px] font-heading tracking-[0.15em] rounded-lg border transition-all duration-300 hover:scale-105 ${
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary glow-green-sm"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {c} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground font-body py-12">No hay mods en esta categoría.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((mod, i) => (
              <a
                key={mod.modId}
                href={`https://reforger.armaplatform.com/workshop/${mod.modId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-card border border-border rounded-xl p-4 md:p-5 card-hover transition-all duration-500 hover:border-primary/40 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${Math.min(i * 50, 600) + 400}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    {categoryIcons[mod.category] || <Package className="w-5 h-5" />}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="text-xs md:text-sm font-heading font-bold tracking-wider mb-1 break-words">{mod.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{mod.category}</span>
                  <span className="text-[9px] font-mono-code text-muted-foreground">v{mod.version}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModsSection;
