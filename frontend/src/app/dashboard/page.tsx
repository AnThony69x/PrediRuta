"use client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const { session, loading } = useSession(true);

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>
        Sesión iniciada como:{" "}
        <strong>{session?.user.email || "Desconocido"}</strong>
      </p>
      <Button
        variant="outline"
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
      >
        Cerrar sesión
      </Button>
    </main>
  );
}