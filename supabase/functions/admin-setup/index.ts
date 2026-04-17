const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MASTER_PASSWORD = "WARBORN";
const ADMIN_EMAIL = "admin@warborn.local";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const masterPassword: string = body?.master_password ?? "";

    if (masterPassword !== MASTER_PASSWORD) {
      return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const admin = createClient(supabaseUrl, serviceKey);

    // Use the master password as the actual auth password too (deterministic)
    const internalPassword = `WARBORN_${MASTER_PASSWORD}_v1`;

    // Try to create the admin user (idempotent)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: internalPassword,
      email_confirm: true,
    });

    let userId = created?.user?.id;

    if (createErr) {
      const msg = createErr.message ?? "";
      if (!/already|registered|exists/i.test(msg)) {
        throw createErr;
      }
      // User exists -> look it up
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (!existing) throw new Error("Cuenta admin existe pero no se encuentra");
      userId = existing.id;
    }

    if (!userId) throw new Error("No se pudo obtener id de usuario admin");

    // Ensure admin role assigned
    const { data: roleRows } = await admin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRows) {
      const { error: roleErr } = await admin.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (roleErr) throw roleErr;
    }

    // Sign in to get a session for the client
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: signInData, error: signInErr } = await anonClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: internalPassword,
    });

    if (signInErr || !signInData?.session) throw signInErr ?? new Error("Login fallido");

    return new Response(
      JSON.stringify({
        success: true,
        session: signInData.session,
        user: signInData.user,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
