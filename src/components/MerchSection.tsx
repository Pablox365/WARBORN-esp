import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { ShoppingBag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderDialog from "./OrderDialog";
import productTshirt from "@/assets/product-tshirt.jpg";
import productHoodie from "@/assets/product-hoodie.jpg";
import productCap from "@/assets/product-cap.jpg";
import productPatch from "@/assets/product-patch.jpg";

const fallbackImages: Record<string, string> = {
  "Camiseta Warborn (bordada)": productTshirt,
  "Sudadera Warborn (bordada)": productHoodie,
  "Gorra Warborn (bordada)": productCap,
  "Gorro Warborn (bordado)": productCap,
  "Parche Warborn (bordado)": productPatch,
  "Alfombrilla Warborn": productPatch,
};

const getImages = (p: any): string[] => {
  const arr: string[] = [];
  if (p.image_url) arr.push(p.image_url);
  if (Array.isArray(p.images)) arr.push(...p.images.filter((x: string) => x && x !== p.image_url));
  if (arr.length === 0) arr.push(fallbackImages[p.name] || productTshirt);
  return arr;
};

const MerchSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [orderProduct, setOrderProduct] = useState<any>(null);
  const [detailProduct, setDetailProduct] = useState<any>(null);

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-12">
          {(products || []).map((p, i) => {
            const imgs = getImages(p);
            return (
              <div
                key={p.id}
                className={`group bg-card border border-border rounded-xl overflow-hidden card-hover transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 80 + 300}ms` }}
              >
                <button
                  onClick={() => setDetailProduct(p)}
                  className="aspect-square overflow-hidden block w-full relative"
                  aria-label={`Ver detalles de ${p.name}`}
                >
                  <img
                    src={imgs[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    width={512}
                    height={512}
                  />
                  {imgs.length > 1 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-[9px] font-heading tracking-wider text-foreground">
                      +{imgs.length - 1}
                    </span>
                  )}
                </button>
                <div className="p-4">
                  <span className="text-[8px] font-heading tracking-[0.15em] text-muted-foreground">{p.type}</span>
                  <h4 className="text-xs font-heading font-bold tracking-wider mt-1">{p.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 font-body">{p.description}</p>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <span className="text-base font-heading font-bold text-primary">{p.price}€</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setDetailProduct(p)}
                        className="px-3 py-1.5 text-[9px] font-heading tracking-[0.15em] border border-border rounded-lg hover:border-primary/50 hover:text-primary transition-all"
                      >
                        VER
                      </button>
                      <button
                        onClick={() => setOrderProduct(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-heading tracking-[0.15em] bg-primary text-primary-foreground rounded-lg hover:brightness-110 hover:scale-105 transition-all btn-military"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        PEDIR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {orderProduct && <OrderDialog product={orderProduct} onClose={() => setOrderProduct(null)} />}
      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          images={getImages(detailProduct)}
          onClose={() => setDetailProduct(null)}
          onOrder={() => { setOrderProduct(detailProduct); setDetailProduct(null); }}
        />
      )}
    </section>
  );
};

const ProductDetail = ({ product, images, onClose, onOrder }: { product: any; images: string[]; onClose: () => void; onOrder: () => void }) => {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 bg-background/80 hover:bg-secondary rounded-lg transition-colors" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-secondary/30 group">
            <img src={images[idx]} alt={product.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-all opacity-0 group-hover:opacity-100" aria-label="Anterior">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background rounded-full transition-all opacity-0 group-hover:opacity-100" aria-label="Siguiente">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-foreground/40"}`} aria-label={`Imagen ${i+1}`} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-[9px] font-heading tracking-[0.25em] text-muted-foreground">{product.type}</span>
            <h2 className="text-xl md:text-2xl font-heading font-bold tracking-wider mt-2 mb-3">{product.name}</h2>
            <div className="text-3xl font-heading font-bold text-primary mb-5">{product.price}€</div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <span className="text-[9px] font-heading tracking-[0.2em] text-muted-foreground block mb-2">TALLAS DISPONIBLES</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: string) => (
                    <span key={s} className="px-3 py-1.5 border border-border rounded-lg text-xs font-heading tracking-wider">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {images.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={onOrder}
              className="mt-auto w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 transition-all btn-military flex items-center justify-center gap-2 glow-green-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              PEDIR AHORA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchSection;
