import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Shirt, ShoppingBag } from "lucide-react";

const products = [
  { name: "Camiseta Warborn", price: "24.99€", type: "Camiseta" },
  { name: "Sudadera Tactical", price: "49.99€", type: "Sudadera" },
  { name: "Gorra Operator", price: "19.99€", type: "Accesorio" },
  { name: "Parche Warborn", price: "9.99€", type: "Accesorio" },
];

const MerchSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="merch" className="relative py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="TIENDA" title="MERCH" subtitle="Representa a la comunidad." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {products.map((p, i) => (
            <div
              key={p.name}
              className={`group bg-card border border-border rounded-xl overflow-hidden card-hover transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 100 + 300}ms` }}
            >
              <div className="aspect-square bg-secondary/30 flex items-center justify-center">
                <Shirt className="w-16 h-16 text-muted-foreground/30 group-hover:text-primary/30 group-hover:scale-110 transition-all duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{p.type}</span>
                <h4 className="text-xs font-heading font-bold tracking-wider mt-1">{p.name}</h4>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-heading font-bold text-primary">{p.price}</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-heading tracking-[0.15em] bg-primary text-primary-foreground rounded-lg hover:brightness-110 hover:scale-105 transition-all btn-military">
                    <ShoppingBag className="w-3 h-3" />
                    PEDIR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSection;
