import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ShoppingBag, Check, Loader2, MapPin } from "lucide-react";
import { z } from "zod";

interface Product {
  id: string;
  name: string;
  price: number;
  sizes: string[] | null;
  image_url: string | null;
}

interface OrderDialogProps {
  product: Product | null;
  onClose: () => void;
}

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(20),
  street: z.string().trim().min(2).max(200),
  number: z.string().trim().min(1).max(20),
  floor: z.string().trim().max(30).optional(),
  postal: z.string().trim().min(3).max(10),
  city: z.string().trim().min(1).max(100),
  province: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  size: z.string().optional(),
  quantity: z.number().int().min(1).max(10),
  comments: z.string().max(500).optional(),
});

type Suggestion = { display_name: string; address?: any };

const OrderDialog = ({ product, onClose }: OrderDialogProps) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    street: "", number: "", floor: "", postal: "", city: "", province: "", country: "España",
    size: product?.sizes?.[0] || "",
    quantity: 1,
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Address autocomplete (OpenStreetMap Nominatim - free)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.length < 3) { setSuggestions([]); return; }
    debounceRef.current = window.setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`,
          { headers: { "Accept-Language": "es" } }
        );
        const data = await res.json();
        setSuggestions(data || []);
        setShowSuggest(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [query]);

  const pickSuggestion = (s: Suggestion) => {
    const a = s.address || {};
    setForm(f => ({
      ...f,
      street: a.road || a.pedestrian || a.path || f.street,
      number: a.house_number || f.number,
      postal: a.postcode || f.postal,
      city: a.city || a.town || a.village || a.municipality || f.city,
      province: a.state || a.province || f.province,
      country: a.country || f.country,
    }));
    setQuery(s.display_name);
    setShowSuggest(false);
  };

  if (!product) return null;
  const total = product.price * form.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = schema.safeParse({ ...form });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message || "Revisa los campos");
      return;
    }

    setLoading(true);
    const fullAddress = [
      `${form.street} ${form.number}`,
      form.floor && `${form.floor}`,
      `${form.postal} ${form.city}`,
      `${form.province}, ${form.country}`,
      `Tel: ${form.phone}`,
    ].filter(Boolean).join(" · ");

    const { error: insertError } = await supabase.from("orders").insert({
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      address: fullAddress,
      product_id: product.id,
      product_name: product.name,
      size: form.size || null,
      quantity: form.quantity,
      comments: form.comments.trim() || null,
      total,
    });

    if (insertError) {
      setError("Error al enviar el pedido. Verifica los campos.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-card border border-border rounded-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h3 className="font-heading text-sm tracking-[0.2em]">REALIZAR PEDIDO</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-fade-scale">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-heading text-lg tracking-wider mb-2">¡PEDIDO ENVIADO!</h4>
            <p className="text-sm text-muted-foreground mb-6 font-body">Te contactaremos por email para confirmar el pago y envío.</p>
            <button onClick={onClose} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-wider text-xs">CERRAR</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              {product.image_url && <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />}
              <div>
                <span className="font-heading text-xs tracking-wider">{product.name}</span>
                <span className="block text-sm font-heading font-bold text-primary">{product.price}€</span>
              </div>
            </div>

            {error && <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">{error}</div>}

            {/* Contact */}
            <div className="space-y-3">
              <div className="text-[9px] font-heading tracking-[0.2em] text-muted-foreground">CONTACTO</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Nombre completo *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
                <input type="tel" placeholder="Teléfono *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
              </div>
              <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <div className="text-[9px] font-heading tracking-[0.2em] text-muted-foreground">DIRECCIÓN DE ENVÍO</div>

              {/* Search */}
              <div className="relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar dirección (calle, ciudad...)"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => suggestions.length && setShowSuggest(true)}
                    className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                  />
                  {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
                </div>
                {showSuggest && suggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-card border border-border rounded-lg overflow-hidden shadow-xl max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-secondary/70 transition-colors border-b border-border/50 last:border-0 font-body"
                      >
                        {s.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Calle *" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="col-span-2 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
                <input type="text" placeholder="Número *" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
              </div>
              <input type="text" placeholder="Piso, puerta, bloque (opcional)" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Código postal *" value={form.postal} onChange={e => setForm({ ...form, postal: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
                <input type="text" placeholder="Ciudad *" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Provincia *" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
                <input type="text" placeholder="País *" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" required />
              </div>
            </div>

            {/* Order options */}
            <div className="grid grid-cols-2 gap-3">
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-[9px] font-heading tracking-[0.15em] text-muted-foreground mb-1 block">TALLA</label>
                  <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                    {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-[9px] font-heading tracking-[0.15em] text-muted-foreground mb-1 block">CANTIDAD</label>
                <input type="number" min={1} max={10} value={form.quantity} onChange={e => setForm({ ...form, quantity: Math.max(1, Math.min(10, Number(e.target.value))) })} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>

            <textarea placeholder="Comentarios (opcional)" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-none" />

            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-xs font-heading tracking-wider">TOTAL</span>
              <span className="text-lg font-heading font-bold text-primary">{total.toFixed(2)}€</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 transition-all btn-military flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
              {loading ? "ENVIANDO..." : "CONFIRMAR PEDIDO"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderDialog;
