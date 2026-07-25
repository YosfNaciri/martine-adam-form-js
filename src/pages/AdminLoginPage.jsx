import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function AdminLoginPage() {
  const supabase = getSupabaseClient();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F9FB] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-extrabold text-[#24478B]">
          Connexion admin
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Connectez-vous pour consulter les soumissions.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Courriel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#24478B]"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#24478B]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#24478B] px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
}
