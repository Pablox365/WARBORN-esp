import { Radio, Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { useRadio } from "@/contexts/RadioContext";

const RadioSection = () => {
  const { tracks, currentTrack, isPlaying, isUserControlled, playTrack, togglePlayPause, nextTrack, releaseToBackground } = useRadio();

  return (
    <section id="radio" className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 30% 20%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(var(--primary)) 0%, transparent 50%)",
      }} />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-heading tracking-[0.25em] text-primary">EN DIRECTO 24/7</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3">
            WARBORN <span className="text-primary">RADIO</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            La banda sonora oficial de la comunidad. Suena de fondo mientras navegas — toma el control cuando quieras.
          </p>
        </div>

        {/* Player principal */}
        <div className="glass rounded-2xl border border-border/50 p-6 md:p-8 mb-8 shadow-2xl shadow-primary/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Visualizador / Icono */}
            <div className="relative shrink-0">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center ${isPlaying ? "animate-pulse" : ""}`}>
                <Radio className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
              {isPlaying && (
                <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 h-6 px-1.5 bg-background rounded-full border border-primary/40">
                  <span className="w-0.5 bg-primary rounded-full animate-[eq_0.8s_ease-in-out_infinite] h-2" />
                  <span className="w-0.5 bg-primary rounded-full animate-[eq_0.6s_ease-in-out_infinite] h-4" style={{ animationDelay: "0.1s" }} />
                  <span className="w-0.5 bg-primary rounded-full animate-[eq_0.7s_ease-in-out_infinite] h-3" style={{ animationDelay: "0.2s" }} />
                  <span className="w-0.5 bg-primary rounded-full animate-[eq_0.5s_ease-in-out_infinite] h-5" style={{ animationDelay: "0.15s" }} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="text-[10px] font-heading tracking-[0.25em] text-primary mb-1">
                {isUserControlled ? "REPRODUCIENDO" : "SONANDO DE FONDO"}
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold truncate">
                {currentTrack?.title ?? "Cargando..."}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1.5">
                <Volume2 className="w-3 h-3" />
                {isUserControlled ? "Control de usuario" : "Volumen bajo · ambiente"}
              </p>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 transition-all glow-green-sm"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={nextTrack}
                className="w-12 h-12 rounded-full border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50 transition-all flex items-center justify-center"
                aria-label="Siguiente"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              {isUserControlled && (
                <button
                  onClick={releaseToBackground}
                  className="hidden md:inline-flex px-3 h-12 rounded-full border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50 transition-all items-center text-[10px] font-heading tracking-[0.15em]"
                >
                  AMBIENTE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de canciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tracks.map((t, i) => {
            const active = currentTrack?.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => playTrack(t)}
                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  active
                    ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10"
                    : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card"
                }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                  active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-primary"
                }`}>
                  {active && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[9px] font-heading tracking-[0.2em] ${active ? "text-primary" : "text-muted-foreground"}`}>
                    PISTA {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-heading text-sm truncate">{t.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RadioSection;
