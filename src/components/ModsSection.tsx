import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { ExternalLink, Loader2, RefreshCw, Package, Search } from "lucide-react";
import { useLiveServers, type LiveMod } from "@/hooks/useLiveServers";

type ServerFilter = "normal" | "hardcore";

const ModsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [search, setSearch] = useState("");
  const [serverFilter, setServerFilter] = useState<ServerFilter>("normal");
  const { data, isLoading, isFetching, dataUpdatedAt } = useLiveServers();

  const mods: LiveMod[] = data?.[serverFilter]?.mods ?? [];
  const filtered = search
    ? mods.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : mods;
  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  const filters: { key: ServerFilter; label: string }[] = [
    { key: "normal", label: "NORMAL" },
    { key: "hardcore", label: "HARDCORE" },
  ];

  return (
    <section id="mods" className="relative py-20 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          visible={isVisible}
          label="WORKSHOP · LIVE"
          title="MODS ACTIVOS"
          subtitle="Sincronizado en tiempo real desde BattleMetrics. Filtra por servidor."
        />

        <div className={`flex items-center justify-center gap-3 mt-6 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-status-pulse" />
            <span className="text-[9px] font-heading tracking-[0.2em] text-primary">{mods.length} MODS</span>
          </div>
          {isFetching && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          {lastUpdate && (
            <span className="hidden sm:flex items-center gap-1 text-[9px] font-heading tracking-[0.2em] text-muted-foreground">
              <RefreshCw className="w-2.5 h-2.5" />
              {lastUpdate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-2 mt-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {filters.map((f) => {
            const active = serverFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setServerFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-[10px] font-heading tracking-[0.25em] border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className={`max-w-md mx-auto mt-4 mb-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar mod..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground font-body py-12">No se encontraron mods.</p>
        ) : (
          <div className={`max-w-3xl mx-auto bg-card border border-border rounded-xl overflow-hidden transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-2.5 border-b border-border bg-secondary/30 text-[8px] font-heading tracking-[0.2em] text-muted-foreground">
              <span>#</span>
              <span>NOMBRE</span>
              <span className="hidden sm:inline">VERSIÓN</span>
              <span></span>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filtered.map((mod, i) => (
                <a
                  key={mod.modId}
                  href={`https://reforger.armaplatform.com/workshop/${mod.modId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-4 py-3 hover:bg-secondary/40 transition-colors group"
                >
                  <span className="text-[10px] font-mono-code text-muted-foreground w-6 text-right">{i + 1}</span>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-heading tracking-wider truncate group-hover:text-primary transition-colors">{mod.name}</span>
                  </div>
                  <span className="hidden sm:inline text-[10px] font-mono-code text-muted-foreground">v{mod.version}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ModsSection;
