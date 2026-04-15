import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { CheckCircle2, FlaskConical, Cog } from "lucide-react";

const items = [
  { status: "done", title: "Servidor Normal", desc: "Lanzamiento del servidor casual/semi-realismo" },
  { status: "done", title: "Servidor Hardcore", desc: "Modo realismo táctico avanzado" },
  { status: "done", title: "Sistema de Mods", desc: "Workshop propio con mods curados" },
  { status: "testing", title: "Web Oficial", desc: "Plataforma central de la comunidad" },
  { status: "testing", title: "Bot Discord Avanzado", desc: "Gestión automática del estado de servidores" },
  { status: "dev", title: "Sistema de Eventos", desc: "Operaciones militares organizadas" },
  { status: "dev", title: "Panel de Usuario", desc: "Perfil, estadísticas y logros" },
  { status: "dev", title: "Tienda Avanzada", desc: "Merch con integración de pagos" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  done: { label: "COMPLETADO", color: "text-primary", bg: "bg-primary", icon: <CheckCircle2 className="w-4 h-4" /> },
  testing: { label: "EN PRUEBAS", color: "text-yellow-400", bg: "bg-yellow-400", icon: <FlaskConical className="w-4 h-4" /> },
  dev: { label: "EN DESARROLLO", color: "text-blue-400", bg: "bg-blue-400", icon: <Cog className="w-4 h-4 animate-rotate-slow" /> },
};

const RoadmapSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="roadmap" className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="PROGRESO" title="ROADMAP" subtitle="Nuestro plan de desarrollo activo." />

        <div className={`flex flex-wrap justify-center gap-6 mt-10 mb-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {Object.entries(statusConfig).map(([, v]) => (
            <div key={v.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${v.bg}`} />
              <span className="text-[9px] font-heading tracking-[0.15em] text-muted-foreground">{v.label}</span>
            </div>
          ))}
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-border md:-translate-x-px" />

          {items.map((item, i) => {
            const cfg = statusConfig[item.status];
            const isLeft = i % 2 === 0;
            return (
              <div
                key={item.title}
                className={`relative flex items-start mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                style={{ transitionDelay: `${i * 150 + 400}ms` }}
              >
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-3 h-3 rounded-full ${cfg.bg} ring-4 ring-background`} />
                </div>

                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <div className="bg-card border border-border rounded-xl p-4 card-hover group">
                    <div className={`flex items-center gap-2 ${isLeft ? "md:justify-end" : ""}`}>
                      <span className={cfg.color}>{cfg.icon}</span>
                      <span className={`text-[8px] font-heading tracking-[0.15em] ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <h4 className="text-xs font-heading font-bold tracking-wider mt-1">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 font-body">{item.desc}</p>
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

export default RoadmapSection;
