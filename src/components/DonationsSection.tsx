import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Server, Wrench, Settings, Heart } from "lucide-react";

const uses = [
  { icon: <Server className="w-6 h-6" />, title: "Hosting", desc: "Servidores dedicados de alto rendimiento" },
  { icon: <Wrench className="w-6 h-6" />, title: "Desarrollo de Mods", desc: "Creación y mantenimiento de mods propios" },
  { icon: <Settings className="w-6 h-6" />, title: "Mantenimiento", desc: "Actualizaciones y soporte técnico continuo" },
];

const DonationsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="APOYO" title="DONACIONES" subtitle="Ayuda a mantener los servidores activos." />

        <div className="max-w-2xl mx-auto mt-12">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {uses.map((u, i) => (
              <div
                key={u.title}
                className={`bg-card border border-border rounded-xl p-5 text-center card-hover transition-all duration-700 group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 100 + 300}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  {u.icon}
                </div>
                <h4 className="text-xs font-heading font-bold tracking-wider mb-1">{u.title}</h4>
                <p className="text-[11px] text-muted-foreground font-body">{u.desc}</p>
              </div>
            ))}
          </div>

          <div className={`text-center transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <a
              href="https://ko-fi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-xl font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 hover:scale-[1.02] transition-all btn-military glow-green"
            >
              <Heart className="w-4 h-4" />
              APOYAR EN KO-FI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationsSection;
