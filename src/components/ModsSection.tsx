import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Map, Crosshair, Truck, Code, Package, Download } from "lucide-react";

const categories = ["TODOS", "OBLIGATORIO", "MAPAS", "ARMAS", "VEHÍCULOS", "SCRIPTS"];

const categoryIcons: Record<string, React.ReactNode> = {
  MAPAS: <Map className="w-5 h-5" />,
  ARMAS: <Crosshair className="w-5 h-5" />,
  "VEHÍCULOS": <Truck className="w-5 h-5" />,
  SCRIPTS: <Code className="w-5 h-5" />,
};

const modsData = [
  { name: "Everon Life", category: "MAPAS", required: true, desc: "Mapa principal del servidor Normal" },
  { name: "RHS Weapons", category: "ARMAS", required: true, desc: "Pack de armas realistas" },
  { name: "ACE Advanced", category: "SCRIPTS", required: true, desc: "Sistema médico y balística avanzada" },
  { name: "RHS Vehicles", category: "VEHÍCULOS", required: true, desc: "Vehículos militares realistas" },
  { name: "Arland Terrain", category: "MAPAS", required: false, desc: "Terreno alternativo para Hardcore" },
  { name: "Radio Mod", category: "SCRIPTS", required: false, desc: "Sistema de comunicación por radio" },
  { name: "NVG Enhanced", category: "ARMAS", required: false, desc: "Visión nocturna mejorada" },
  { name: "Transport Pack", category: "VEHÍCULOS", required: false, desc: "Vehículos de transporte adicionales" },
];

const ModsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [filter, setFilter] = useState("TODOS");

  const filtered = filter === "TODOS" ? modsData
    : filter === "OBLIGATORIO" ? modsData.filter(m => m.required)
    : modsData.filter(m => m.category === filter);

  return (
    <section id="mods" className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="WORKSHOP" title="MODS" subtitle="Consulta y gestiona los mods necesarios." />

        <div className={`flex flex-wrap justify-center gap-2 mt-10 mb-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 text-[9px] font-heading tracking-[0.15em] rounded-lg border transition-all duration-300 hover:scale-105 ${
                filter === c
                  ? "bg-primary text-primary-foreground border-primary glow-green-sm"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((mod, i) => (
            <div
              key={mod.name}
              className={`group bg-card border border-border rounded-xl p-5 card-hover transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100 + 400}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                {categoryIcons[mod.category] || <Package className="w-5 h-5" />}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xs font-heading font-bold tracking-wider">{mod.name}</h4>
                {mod.required && (
                  <span className="px-2 py-0.5 text-[7px] font-heading tracking-widest bg-primary/20 text-primary rounded-full">REQ</span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mb-3 font-body">{mod.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{mod.category}</span>
                <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModsSection;
