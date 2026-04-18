import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Star, Loader2, Quote } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Pon tu nombre").max(60),
  rating: z.number().int().min(1, "Selecciona estrellas").max(5),
  message: z.string().trim().min(5, "Mínimo 5 caracteres").max(1000),
});

const FeedbackSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const qc = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ["feedback-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("id,name,rating,message,created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse({ name, rating, message });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message);
      }
      const { error } = await supabase.from("feedback").insert({
        name: parsed.data.name,
        rating: parsed.data.rating,
        message: parsed.data.message,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("¡Gracias por tu reseña!");
      setName(""); setRating(0); setMessage(""); setError("");
      qc.invalidateQueries({ queryKey: ["feedback-public"] });
    },
    onError: (e: any) => setError(e.message ?? "Error al enviar"),
  });

  const avg = reviews && reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="COMUNIDAD" title="RESEÑAS" subtitle="Lo que dicen los miembros de Warborn." />

        {avg && (
          <div className={`flex items-center justify-center gap-3 mt-6 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="flex">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={`w-5 h-5 ${n <= Math.round(Number(avg)) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-xl font-heading font-bold">{avg}</span>
            <span className="text-xs text-muted-foreground font-body">({reviews?.length} reseñas)</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          {/* Form */}
          <div className={`bg-card border border-border rounded-xl p-6 md:p-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h3 className="font-heading text-sm tracking-[0.2em] mb-1">DEJA TU RESEÑA</h3>
            <p className="text-xs text-muted-foreground mb-5 font-body">Tu opinión ayuda a mejorar Warborn.</p>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="p-1 transition-transform hover:scale-125"
                  aria-label={`${n} estrellas`}
                >
                  <Star className={`w-7 h-7 transition-colors ${(hover || rating) >= n ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} />
                </button>
              ))}
              <span className="ml-2 text-xs text-muted-foreground font-body">{rating > 0 ? `${rating}/5` : "Selecciona"}</span>
            </div>

            {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">{error}</div>}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Cuenta tu experiencia..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />
              <button
                onClick={() => submit.mutate()}
                disabled={submit.isPending}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 transition-all btn-military disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submit.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                ENVIAR RESEÑA
              </button>
            </div>
          </div>

          {/* Reviews list */}
          <div className={`space-y-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {!reviews && <Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" />}
            {reviews && reviews.length === 0 && (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Quote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-body">Sé el primero en dejar una reseña</p>
              </div>
            )}
            {reviews?.map((r, i) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-5 card-hover" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading text-xs font-bold shrink-0">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading text-xs tracking-wider truncate">{r.name}</div>
                      <div className="text-[9px] text-muted-foreground font-body">
                        {new Date(r.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{r.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
