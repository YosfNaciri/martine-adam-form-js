import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function ProtectedAdminRoute({ children }) {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    }

    checkSession();
  }, [supabase]);

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}