import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderDialog from "./OrderDialog";
import productTshirt from "@/assets/product-tshirt.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";
import productCap from "@/assets/product-cap.jpg";
import productPatch from "@/assets/product-patch.jpg";

const fallbackImages: Record<string, string> = {
  "Camiseta Warborn": productTshirt,
  "Sudadera Tactical": productHoodie,
  "Gorra Operator": productCap,
  "Parche Warborn": productPatch,
};

const MerchSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="merch" className="relative py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="TIENDA" title="MERCH" subtitle="Representa a la comunidad." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {(products || []).map((p, i) => (
            <div
              key={p.id}
              className={`group bg-card border border-border rounded-xl overflow-hidden card-hover transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 100 + 300}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.image_url || fallbackImages[p.name] || productTshirt}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={512}
                  height={512}
                />
              </div>
              <div className="p-4">
                <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{p.type}</span>
                <h4 className="text-xs font-heading font-bold tracking-wider mt-1">{p.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 font-body">{p.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-heading font-bold text-primary">{p.price}€</span>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-heading tracking-[0.15em] bg-primary text-primary-foreground rounded-lg hover:brightness-110 hover:scale-105 transition-all btn-military"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    PEDIR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && <OrderDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};

export default MerchSection;
