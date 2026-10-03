import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function ProtectedClientRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [clientEmail, setClientEmail] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let mounted = true;

    function applySession(session) {
      if (!mounted) return;
      setAllowed(Boolean(session));
      setClientEmail(session?.user?.email || null);
      setLoading(false);
    }

    async function checkAccess() {
      const code = new URLSearchParams(window.location.search).get("code");
      let result = await supabase.auth.getSession();

      if (!result.data.session && code) {
        const exchanged = await supabase.auth.exchangeCodeForSession(code);
        if (!exchanged.error) result = exchanged;
      }

      applySession(result.data.session || null);
    }

    checkAccess();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        applySession(nextSession);
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="ma-form-theme grid min-h-screen place-items-center bg-ma-bg px-4 text-ma-text">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-ma-separator border-t-ma-primary" />
          <p className="mt-4 text-sm font-bold text-ma-muted">
            Vérification de votre accès...
          </p>
        </div>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="ma-form-theme grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.25),transparent_34%),linear-gradient(180deg,#ffffff_0%,#FAF8F5_100%)] px-4 text-ma-text">
        <section className="w-full max-w-lg rounded-[22px] border border-ma-separator/60 bg-white p-8 text-center shadow-[0_22px_55px_rgba(30,58,47,0.10)]">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ma-primary/10 text-2xl text-ma-primary">
            ✉
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.04em]">
            Accès non autorisé
          </h1>
          <p className="mt-4 leading-7 text-ma-muted">
            Ce formulaire est accessible uniquement depuis le lien sécurisé
            reçu par email.
          </p>
          <Link
            to="/demande-acces"
            className="mt-7 inline-flex rounded-full bg-ma-primary px-7 py-3 text-sm font-extrabold text-white hover:bg-ma-primary-dark"
          >
            Demander un lien d’accès
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="ma-form-theme min-h-screen bg-ma-bg text-ma-text">
      <div className="border-b border-ma-separator/60 bg-white px-4 py-3 text-sm text-ma-muted shadow-[0_4px_16px_rgba(30,58,47,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span>
            Connecté avec :{" "}
            <strong className="font-extrabold text-ma-text">
              {clientEmail || "adresse email vérifiée"}
            </strong>
          </span>
          <span className="hidden rounded-full bg-ma-primary/10 px-3 py-1 text-xs font-bold text-ma-primary sm:inline-flex">
            Accès sécurisé
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
