import { useEffect, useState } from "react";
import { X, Shield } from "lucide-react";
import Admin from "@/pages/Admin";

const HiddenAdminTrigger = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const customHandler = () => setOpen(true);
    window.addEventListener("warborn:open-admin", customHandler);
    return () => window.removeEventListener("warborn:open-admin", customHandler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  return (
    <>
      {/* Discrete physical admin button (bottom-right) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir panel admin"
        title="Admin"
        className="fixed bottom-3 right-3 z-[150] w-9 h-9 flex items-center justify-center rounded-full bg-card/60 backdrop-blur border border-border/50 text-muted-foreground/60 hover:text-primary hover:border-primary/60 hover:bg-card transition-all"
      >
        <Shield className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Panel de administración"
          className="fixed inset-0 z-[200] bg-background overflow-y-auto"
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar panel admin"
            className="fixed top-3 right-3 z-[210] w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border hover:bg-destructive/10 hover:border-destructive transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <Admin />
        </div>
      )}
    </>
  );
};

export default HiddenAdminTrigger;
