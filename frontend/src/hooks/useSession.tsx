"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useSession(requireAuth = false) {
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof supabase.auth.getSession>
  >["data"]["session"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (requireAuth && !data.session) {
        window.location.href = "/login";
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [requireAuth]);

  return { session, loading };
}