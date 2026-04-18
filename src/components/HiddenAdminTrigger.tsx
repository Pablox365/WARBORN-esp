import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Admin from "@/pages/Admin";

const HiddenAdminTrigger = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden border-primary/30">
        <div className="h-full overflow-y-auto">
          <Admin />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HiddenAdminTrigger;
