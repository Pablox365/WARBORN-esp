import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ShoppingBag, Check } from "lucide-react";

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

const OrderDialog = ({ product, onClose }: OrderDialogProps) => {
  const [form, setForm] = useState({ name: "", email: "", address: "", size: product?.sizes?.[0] || "", quantity: 1, comments: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!product) return null;

  const total = product.price * form.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase.from("orders").insert({
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      address: form.address.trim(),
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
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-heading text-sm tracking-[0.2em]">REALIZAR PEDIDO</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-fade-scale">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-heading text-lg tracking-wider mb-2">¡PEDIDO ENVIADO!</h4>
            <p className="text-sm text-muted-foreground mb-6">Te contactaremos por email para confirmar el pago y envío.</p>
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

            <input type="text" placeholder="Tu nombre *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
            <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
            <input type="text" placeholder="Dirección de envío *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />

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
                <input type="number" min={1} max={10} value={form.quantity} onChange={e => setForm({ ...form, quantity: Math.max(1, Number(e.target.value)) })} className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>

            <textarea placeholder="Comentarios (opcional)" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} rows={2} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-none" />

            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-xs font-heading tracking-wider">TOTAL</span>
              <span className="text-lg font-heading font-bold text-primary">{total.toFixed(2)}€</span>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 transition-all btn-military flex items-center justify-center gap-2 disabled:opacity-50">
              <ShoppingBag className="w-4 h-4" />
              {loading ? "ENVIANDO..." : "CONFIRMAR PEDIDO"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderDialog;
