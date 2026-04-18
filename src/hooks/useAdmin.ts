import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkRole = async (s: any) => {
      if (!s?.user) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      try {
        const { data } = await supabase.rpc("has_role", {
          _user_id: s.user.id,
          _role: "admin",
        });
        if (mounted) setIsAdmin(!!data);
      } catch {
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      // Defer role check to avoid deadlocks inside the auth callback
      setTimeout(() => checkRole(s), 0);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      checkRole(s);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // Safety net: never stay loading more than 5s
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const loginWithMaster = async (masterPassword: string) => {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ master_password: masterPassword }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { error: { message: data?.error || "Error de autenticación" } };
      }

      if (data?.error) return { error: { message: data.error } };

      if (data?.session) {
        setSession(data.session);
        setIsAdmin(true);
        setLoading(false);

        void supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      return { data };
    } catch (error) {
      const message = error instanceof Error
        ? error.name === "AbortError"
          ? "El login admin tardó demasiado. Inténtalo otra vez."
          : error.message
        : "Error de autenticación";
      return { error: { message } };
    }
  };

  return { session, isAdmin, loading, signOut, loginWithMaster };
}
