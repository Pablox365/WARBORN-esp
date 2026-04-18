import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import milsimLogo from "@/assets/warborn-milsim.png";
import { ExternalLink, Shield } from "lucide-react";

const MilsimSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="milsim" className="relative py-24 md:py-32 overflow-hidden isolate" ref={ref}>
      {/* Layer 1: Deep base color */}
      <div className="absolute inset-0 bg-[hsl(12,55%,18%)]" />

      {/* Layer 2: Radial sunset gradient (matches logo) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 35%, hsl(28, 90%, 60%) 0%, hsl(18, 80%, 50%) 30%, hsl(10, 70%, 38%) 60%, hsl(8, 60%, 22%) 100%)",
        }}
      />

      {/* Layer 3: Subtle noise/grain texture */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Layer 4: Diagonal military stripes */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 22px, #000 22px 24px)",
        }}
      />

      {/* Layer 5: Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.12] pointer-events-none" />

      {/* Layer 6: Glow accents */}
      <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-[hsl(35,95%,65%)]/25 rounded-full blur-[160px] pointer-events-none animate-glow-pulse" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-[hsl(0,75%,35%)]/35 rounded-full blur-[140px] pointer-events-none" />

      {/* Layer 7: Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.55)_100%)] pointer-events-none" />

      {/* Layer 8: Top & bottom fade into surrounding sections */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Layer 9: Scanline (subtle HUD effect) */}
      <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />


      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-5xl mx-auto bg-black/40 backdrop-blur-sm border border-black/30 rounded-2xl overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid md:grid-cols-2 items-center gap-6 md:gap-10 p-6 md:p-10">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img
                src={milsimLogo}
                alt="Warborn Milsim"
                className="w-full max-w-md object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <Shield className="w-3 h-3 text-white" />
                <span className="text-[10px] font-heading tracking-[0.4em] text-white/90">
                  EVENTOS · SIMULACIÓN MILITAR
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white mb-3 tracking-wider uppercase">
                Warborn Milsim
              </h2>

              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6 font-body">
                División de simulación militar de Warborn. Operaciones planificadas, jerarquía de mando, comunicación táctica y realismo extremo. Si buscas la experiencia más inmersiva, este es tu sitio.
              </p>

              <a
                href="https://discord.gg/VeC7aD8fzM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-black text-white rounded-lg font-heading tracking-[0.2em] text-xs font-bold hover:bg-black/80 hover:scale-[1.02] transition-all duration-300 shadow-xl"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                ÚNETE AL DISCORD MILSIM
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilsimSection;
