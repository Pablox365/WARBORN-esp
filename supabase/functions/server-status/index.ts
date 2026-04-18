const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SERVERS = {
  normal: "38708697",
  hardcore: "38672956",
  milsim: "38109381",
};

type Mod = { modId: string; name: string; version: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchServer(id: string) {
  let lastStatus = 0;
  // Retry up to 3 times on 5xx / network errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://api.battlemetrics.com/servers/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
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
          unavailable: false,
        };
      }
      lastStatus = res.status;
      // Only retry on 5xx
      if (res.status < 500) break;
    } catch (_e) {
      lastStatus = 0;
    }
    await sleep(300 * (attempt + 1));
  }

  // Fallback placeholder so UI doesn't crash
  console.warn(`BattleMetrics ${id} unavailable (status ${lastStatus})`);
  return {
    id,
    name: "",
    players: 0,
    maxPlayers: 0,
    status: "unknown",
    online: false,
    ip: "",
    port: null,
    address: "",
    map: "—",
    version: "—",
    modded: false,
    rank: null,
    country: null,
    battleEye: false,
    password: false,
    platforms: [],
    mods: [],
    modCount: 0,
    updatedAt: null,
    unavailable: true,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const [normal, hardcore, milsim] = await Promise.all([
      fetchServer(SERVERS.normal),
      fetchServer(SERVERS.hardcore),
      fetchServer(SERVERS.milsim),
    ]);
    return new Response(JSON.stringify({ normal, hardcore, milsim, fetchedAt: new Date().toISOString() }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
