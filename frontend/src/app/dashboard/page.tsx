"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      setEmail(session.user.email ?? null);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Sesión iniciada como: <b>{email}</b></p>
      <button onClick={handleLogout} className="bg-gray-800 text-white rounded px-4 py-2">
        Cerrar sesión
      </button>
    </main>
  );
}