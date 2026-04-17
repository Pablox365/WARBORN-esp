import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        }).then(({ data }) => {
          setIsAdmin(!!data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // One-step login: only requires the master password "WARBORN"
  const loginWithMaster = async (masterPassword: string) => {
    const { data, error } = await supabase.functions.invoke("admin-setup", {
      body: { master_password: masterPassword },
    });
    if (error) return { error };
    if (data?.error) return { error: { message: data.error } };
    if (data?.session) {
      const { error: setErr } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (setErr) return { error: setErr };
    }
    return { data };
  };

  return { session, isAdmin, loading, signOut, loginWithMaster };
}
