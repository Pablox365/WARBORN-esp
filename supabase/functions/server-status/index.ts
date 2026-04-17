const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SERVERS = {
  normal: "38708697",
  hardcore: "38672956",
};

type Mod = { modId: string; name: string; version: string };

async function fetchServer(id: string) {
  const res = await fetch(`https://api.battlemetrics.com/servers/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`BattleMetrics ${id}: ${res.status}`);
  const json = await res.json();
  const a = json?.data?.attributes ?? {};
  const det = a.details ?? {};
  const reforger = det.reforger ?? {};
  const mods: Mod[] = Array.isArray(reforger.mods) ? reforger.mods : [];
  return {
    id,
    name: a.name ?? "",
    players: a.players ?? 0,
    maxPlayers: a.maxPlayers ?? 0,
    status: a.status ?? "offline",
    online: a.status === "online",
    ip: a.ip ?? "",
    port: a.port ?? null,
    address: a.ip && a.port ? `${a.ip}:${a.port}` : "",
    map: reforger.scenarioName ?? det.map ?? "—",
    version: det.version ?? "—",
    modded: mods.length > 0,
    rank: a.rank ?? null,
    country: det.country ?? a.country ?? null,
    battleEye: !!reforger.battlEye,
    password: !!det.password,
    platforms: reforger.supportedGameClientTypes ?? [],
    mods,
    modCount: mods.length,
    updatedAt: a.updatedAt ?? null,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const [normal, hardcore] = await Promise.all([
      fetchServer(SERVERS.normal),
      fetchServer(SERVERS.hardcore),
    ]);
    return new Response(JSON.stringify({ normal, hardcore, fetchedAt: new Date().toISOString() }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
