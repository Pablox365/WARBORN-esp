import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Package, Box, Map, ShoppingCart, Megaphone, Plus, Pencil, Trash2, Save, X, Shield } from "lucide-react";

const Admin = () => {
  const { session, isAdmin, loading, signIn, signOut, setupAdmin } = useAdmin();
  const [tab, setTab] = useState("products");

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (!session || !isAdmin) return <AdminLogin signIn={signIn} setupAdmin={setupAdmin} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-heading text-sm tracking-[0.2em]">ADMIN PANEL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-body">{session.user.email}</span>
            <button onClick={signOut} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "products", label: "Productos", icon: <Package className="w-4 h-4" /> },
            { id: "mods", label: "Mods", icon: <Box className="w-4 h-4" /> },
            { id: "roadmap", label: "Roadmap", icon: <Map className="w-4 h-4" /> },
            { id: "orders", label: "Pedidos", icon: <ShoppingCart className="w-4 h-4" /> },
            { id: "announcements", label: "Anuncios", icon: <Megaphone className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading tracking-wider transition-all whitespace-nowrap ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "products" && <ProductsAdmin />}
        {tab === "mods" && <ModsAdmin />}
        {tab === "roadmap" && <RoadmapAdmin />}
        {tab === "orders" && <OrdersAdmin />}
        {tab === "announcements" && <AnnouncementsAdmin />}
      </div>
    </div>
  );
};

// === Admin Login ===
const AdminLogin = ({ signIn, setupAdmin }: { signIn: any; setupAdmin: any }) => {
  const [mode, setMode] = useState<"login" | "setup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPw, setMasterPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const { error, data } = await setupAdmin(email, password, masterPw);
    if (error) setError(error.message);
    else {
      setSuccess(data?.message || "Admin creado. Ahora inicia sesión.");
      setMode("login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-heading text-xl tracking-[0.2em] mb-2">ADMIN PANEL</h1>
          <p className="text-xs text-muted-foreground font-body">Panel de administración de Warborn</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode("login")} className={`flex-1 py-2 text-xs font-heading tracking-wider rounded-lg transition-all ${mode === "login" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>LOGIN</button>
            <button onClick={() => setMode("setup")} className={`flex-1 py-2 text-xs font-heading tracking-wider rounded-lg transition-all ${mode === "setup" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>SETUP</button>
          </div>

          {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">{error}</div>}
          {success && <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary">{success}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
              <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-wider text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50">
                {loading ? "CARGANDO..." : "INICIAR SESIÓN"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSetup} className="space-y-4">
              <input type="password" placeholder="Contraseña maestra (WARBORN)" value={masterPw} onChange={e => setMasterPw(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
              <input type="email" placeholder="Email del admin" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
              <input type="password" placeholder="Contraseña del admin" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" required />
              <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-wider text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50">
                {loading ? "CREANDO..." : "CREAR ADMIN"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors font-body">← Volver a la web</a>
        </div>
      </div>
    </div>
  );
};

// === Generic CRUD helpers ===
function useCrud<T extends { id: string }>(table: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data as T[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (item: Partial<T>) => {
      if ((item as any).id) {
        const { error } = await supabase.from(table).update(item).eq("id", (item as any).id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(item as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });

  return { ...query, upsert, remove };
}

// === Products Admin ===
const ProductsAdmin = () => {
  const { data: products, isLoading, upsert, remove } = useCrud<any>("products");
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg tracking-wider">PRODUCTOS</h2>
        <button onClick={() => setEditing({ name: "", description: "", price: 0, type: "Camiseta", sizes: ["S","M","L","XL"], active: true, sort_order: 0 })} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-heading tracking-wider">
          <Plus className="w-4 h-4" /> NUEVO
        </button>
      </div>

      {editing && (
        <EditForm
          item={editing}
          fields={[
            { key: "name", label: "Nombre", type: "text" },
            { key: "description", label: "Descripción", type: "textarea" },
            { key: "price", label: "Precio", type: "number" },
            { key: "type", label: "Tipo", type: "select", options: ["Camiseta", "Sudadera", "Accesorio"] },
            { key: "image_url", label: "URL Imagen", type: "text" },
            { key: "sort_order", label: "Orden", type: "number" },
            { key: "active", label: "Activo", type: "boolean" },
          ]}
          onSave={(item) => { upsert.mutate(item); setEditing(null); }}
          onCancel={() => setEditing(null)}
          saving={upsert.isPending}
        />
      )}

      <div className="grid gap-3">
        {products?.map((p: any) => (
          <div key={p.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
            {p.image_url && <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm tracking-wider">{p.name}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-heading tracking-wider ${p.active ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>{p.active ? "ACTIVO" : "INACTIVO"}</span>
              </div>
              <span className="text-xs text-muted-foreground">{p.price}€ · {p.type}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="p-2 hover:bg-secondary rounded-lg transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(p.id); }} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Mods Admin ===
const ModsAdmin = () => {
  const { data: mods, isLoading, upsert, remove } = useCrud<any>("mods");
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg tracking-wider">MODS</h2>
        <button onClick={() => setEditing({ name: "", description: "", category: "SCRIPTS", required: false, server: "both", active: true, sort_order: 0 })} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-heading tracking-wider">
          <Plus className="w-4 h-4" /> NUEVO
        </button>
      </div>

      {editing && (
        <EditForm
          item={editing}
          fields={[
            { key: "name", label: "Nombre", type: "text" },
            { key: "description", label: "Descripción", type: "textarea" },
            { key: "category", label: "Categoría", type: "select", options: ["MAPAS", "ARMAS", "VEHÍCULOS", "SCRIPTS"] },
            { key: "server", label: "Servidor", type: "select", options: ["both", "normal", "hardcore"] },
            { key: "workshop_url", label: "URL Workshop", type: "text" },
            { key: "image_url", label: "URL Imagen", type: "text" },
            { key: "required", label: "Obligatorio", type: "boolean" },
            { key: "sort_order", label: "Orden", type: "number" },
            { key: "active", label: "Activo", type: "boolean" },
          ]}
          onSave={(item) => { upsert.mutate(item); setEditing(null); }}
          onCancel={() => setEditing(null)}
          saving={upsert.isPending}
        />
      )}

      <div className="grid gap-3">
        {mods?.map((m: any) => (
          <div key={m.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm tracking-wider">{m.name}</span>
                {m.required && <span className="text-[8px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-heading tracking-wider">REQ</span>}
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-heading tracking-wider">{m.category}</span>
              </div>
              <span className="text-xs text-muted-foreground">{m.description}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(m)} className="p-2 hover:bg-secondary rounded-lg transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(m.id); }} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Roadmap Admin ===
const RoadmapAdmin = () => {
  const { data: items, isLoading, upsert, remove } = useCrud<any>("roadmap_items");
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg tracking-wider">ROADMAP</h2>
        <button onClick={() => setEditing({ title: "", description: "", status: "dev", sort_order: 0 })} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-heading tracking-wider">
          <Plus className="w-4 h-4" /> NUEVO
        </button>
      </div>

      {editing && (
        <EditForm
          item={editing}
          fields={[
            { key: "title", label: "Título", type: "text" },
            { key: "description", label: "Descripción", type: "textarea" },
            { key: "status", label: "Estado", type: "select", options: ["done", "testing", "dev"] },
            { key: "sort_order", label: "Orden", type: "number" },
          ]}
          onSave={(item) => { upsert.mutate(item); setEditing(null); }}
          onCancel={() => setEditing(null)}
          saving={upsert.isPending}
        />
      )}

      <div className="grid gap-3">
        {items?.map((item: any) => (
          <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm tracking-wider">{item.title}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-heading tracking-wider ${
                  item.status === "done" ? "bg-primary/20 text-primary" : item.status === "testing" ? "bg-yellow-400/20 text-yellow-400" : "bg-blue-400/20 text-blue-400"
                }`}>{item.status === "done" ? "COMPLETADO" : item.status === "testing" ? "EN PRUEBAS" : "EN DESARROLLO"}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(item)} className="p-2 hover:bg-secondary rounded-lg transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(item.id); }} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Orders Admin ===
const OrdersAdmin = () => {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  if (isLoading) return <Loading />;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-400/20 text-yellow-400",
    confirmed: "bg-blue-400/20 text-blue-400",
    shipped: "bg-purple-400/20 text-purple-400",
    delivered: "bg-primary/20 text-primary",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <div>
      <h2 className="font-heading text-lg tracking-wider mb-4">PEDIDOS</h2>
      {orders?.length === 0 && <p className="text-muted-foreground text-sm">No hay pedidos todavía.</p>}
      <div className="grid gap-3">
        {orders?.map((o: any) => (
          <div key={o.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-heading text-sm tracking-wider">{o.customer_name}</span>
                <span className="text-xs text-muted-foreground ml-2">{o.customer_email}</span>
              </div>
              <span className={`text-[8px] px-2 py-0.5 rounded-full font-heading tracking-wider ${statusColors[o.status] || ""}`}>{o.status.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
              <div><span className="text-muted-foreground">Producto: </span>{o.product_name}</div>
              <div><span className="text-muted-foreground">Talla: </span>{o.size || "N/A"}</div>
              <div><span className="text-muted-foreground">Cantidad: </span>{o.quantity}</div>
              <div><span className="text-muted-foreground">Total: </span>{o.total}€</div>
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              <span className="text-muted-foreground">Dirección: </span>{o.address}
              {o.comments && <><br /><span className="text-muted-foreground">Comentarios: </span>{o.comments}</>}
            </div>
            <div className="flex gap-2">
              {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus.mutate({ id: o.id, status: s })}
                  className={`px-3 py-1 text-[8px] font-heading tracking-wider rounded-lg border transition-all ${
                    o.status === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Announcements Admin ===
const AnnouncementsAdmin = () => {
  const { data: items, isLoading, upsert, remove } = useCrud<any>("announcements");
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg tracking-wider">ANUNCIOS</h2>
        <button onClick={() => setEditing({ title: "", content: "", type: "update", active: true })} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-heading tracking-wider">
          <Plus className="w-4 h-4" /> NUEVO
        </button>
      </div>

      {editing && (
        <EditForm
          item={editing}
          fields={[
            { key: "title", label: "Título", type: "text" },
            { key: "content", label: "Contenido", type: "textarea" },
            { key: "type", label: "Tipo", type: "select", options: ["update", "event", "patch", "alert"] },
            { key: "active", label: "Activo", type: "boolean" },
          ]}
          onSave={(item) => { upsert.mutate(item); setEditing(null); }}
          onCancel={() => setEditing(null)}
          saving={upsert.isPending}
        />
      )}

      <div className="grid gap-3">
        {items?.map((a: any) => (
          <div key={a.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm tracking-wider">{a.title}</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-heading tracking-wider">{a.type.toUpperCase()}</span>
              </div>
              <span className="text-xs text-muted-foreground">{a.content?.slice(0, 100)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(a)} className="p-2 hover:bg-secondary rounded-lg transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => { if (confirm("¿Eliminar?")) remove.mutate(a.id); }} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// === Reusable Edit Form ===
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "number" | "select" | "boolean"; options?: string[] };

const EditForm = ({ item, fields, onSave, onCancel, saving }: { item: any; fields: FieldDef[]; onSave: (item: any) => void; onCancel: () => void; saving: boolean }) => {
  const [form, setForm] = useState({ ...item });

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-5 mb-6 animate-fade-up">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label className="text-[9px] font-heading tracking-[0.15em] text-muted-foreground mb-1 block">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors resize-none" />
            ) : f.type === "select" ? (
              <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors">
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "boolean" ? (
              <button onClick={() => setForm({ ...form, [f.key]: !form[f.key] })} className={`px-4 py-2 rounded-lg text-xs font-heading tracking-wider border transition-all ${form[f.key] ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground"}`}>
                {form[f.key] ? "SÍ" : "NO"}
              </button>
            ) : (
              <input type={f.type} value={form[f.key] ?? ""} onChange={e => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-colors" />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => onSave(form)} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-heading tracking-wider disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "GUARDANDO..." : "GUARDAR"}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-xs font-heading tracking-wider text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" /> CANCELAR
        </button>
      </div>
    </div>
  );
};

const Loading = () => <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

export default Admin;
