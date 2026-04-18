import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import hostingLogo from "@/assets/logowithtext.png";
import alineaLogo from "@/assets/alinea-logo.png";
import { Copy, Check, Tag, ExternalLink, Code2 } from "lucide-react";
import { toast } from "sonner";

const PartnersSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [copied, setCopied] = useState(false);

  const code = "WARBORN";

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="partners" className="relative py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="COLABORADORES" title="PARTNERS" subtitle="Empresas que hacen posible esta comunidad." />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12 items-stretch">
          {/* Hosting partner */}
          <div
            className={`flex flex-col bg-card border border-border rounded-xl p-8 text-center card-hover animate-border-glow transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-heading tracking-[0.4em] text-primary">CÓDIGO DE DESCUENTO</span>
            </div>
            <div className="h-16 md:h-20 flex items-center justify-center mb-6">
              <img src={hostingLogo} alt="Hosting Partner" className="max-h-full max-w-full object-contain" />
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-body">
              Infraestructura de servidores dedicada de alto rendimiento. Usa nuestro código en su web para obtener descuento.
            </p>
            <div className="mt-auto">
              <button
                onClick={copy}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-dashed border-primary/40 hover:border-primary text-primary rounded-xl font-heading tracking-[0.4em] text-base font-bold hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                {code}
              </button>
              <p className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground mt-3">CLICK PARA COPIAR</p>
            </div>
          </div>

          {/* Alinea - web agency */}
          <div
            className={`flex flex-col bg-card border border-border rounded-xl p-8 text-center card-hover animate-border-glow transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code2 className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-heading tracking-[0.4em] text-primary">DESARROLLO WEB</span>
            </div>
            <div className="h-16 md:h-20 flex items-center justify-center mb-6 overflow-hidden">
              <img src={alineaLogo} alt="Alinea" className="h-40 md:h-52 w-auto object-contain" />
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-body">
              Empresa creadora de esta web. Desarrollo de páginas modernas, rápidas y a medida para tu proyecto.
            </p>
            <div className="mt-auto">
              <a
                href="https://alineaspain.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary/40 hover:border-primary text-primary rounded-xl font-heading tracking-[0.4em] text-base font-bold hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02]"
              >
                VISITAR WEB
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <p className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground mt-3">CLICK PARA VISITAR WEB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

