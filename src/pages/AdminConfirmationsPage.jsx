import { useEffect, useRef, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { confirmClientTable, getSupabaseClient } from "../lib/supabaseClient";
import { confirmationExportRow, createConfirmationsCsv, loadAllConfirmations } from "../lib/clientConfirmations";
import { createRowsExcel } from "../lib/createSubmissionExcel";

const panel = "rounded-[22px] border border-ma-separator/60 bg-white p-6 shadow-[0_18px_45px_rgba(36,71,139,0.08)]";
const button = "rounded-full bg-ma-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-ma-primary-dark disabled:cursor-not-allowed disabled:opacity-50";
const input = "w-full rounded-[10px] border border-ma-separator/75 bg-white px-3.5 py-3 text-sm outline-none focus:border-ma-primary focus:ring-4 focus:ring-ma-primary/15";

export default function AdminConfirmationsPage() {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const exportDialogRef = useRef(null);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await loadAllConfirmations(getSupabaseClient(), confirmClientTable);
      setRows(data);
      setSelectedId((id) => data.some((row) => row.id === id) ? id : data[0]?.id);
    } catch {
      setRows([]);
      setSelectedId(null);
      setError("Impossible de charger les confirmations. Vérifiez votre connexion et les droits de lecture de la table des confirmations dans Supabase, puis réessayez.");
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function exportAll(format) {
    if (exporting) return;
    exportDialogRef.current?.close();
    setExporting(true);
    setError("");
    try {
      // Reload all pages so exports include all confirmations, regardless of filters.
      const data = await loadAllConfirmations(getSupabaseClient(), confirmClientTable);
      const exportRows = data.map(confirmationExportRow);
      if (!exportRows.length) throw new Error("Aucune confirmation à exporter.");
      const blob = format === "xlsx" ? createRowsExcel(exportRows)
        : new Blob([createConfirmationsCsv(exportRows)], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `confirmations-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Impossible d’exporter les confirmations. Vérifiez qu’il existe des confirmations accessibles, puis réessayez.");
    } finally { setExporting(false); }
  }

  const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtered = rows.filter((row) => (!season || String(row.tax_season) === season)
    && normalize(`${row.first_name} ${row.last_name} ${row.email} ${row.phone}`).includes(normalize(search.trim())));
  const selected = filtered.find((row) => row.id === selectedId) || filtered[0];
  const seasons = [...new Set(rows.map((row) => String(row.tax_season ?? "")).filter(Boolean))].sort().reverse();

  return (
    <AdminLayout subtitle="Confirmations pour la prochaine saison">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-extrabold tracking-[-0.04em]">Confirmations clients</h1><p className="mt-2 text-sm text-ma-muted">Consultez les réponses et les coordonnées pour la prochaine saison fiscale.</p></div>
          <button type="button" onClick={refresh} disabled={loading || exporting} className={button}>Actualiser</button>
        </div>
        <section className={`${panel} mb-6 flex flex-wrap items-center justify-between gap-4`}>
          <div><h2 className="font-extrabold">Exporter toutes les confirmations</h2><p className="mt-1 text-sm text-ma-muted">Un seul fichier, toutes les saisons, indépendamment des filtres. Excel conserve les zéros initiaux du NAS et du téléphone.</p></div>
          <button type="button" onClick={() => exportDialogRef.current?.showModal()} disabled={loading || exporting || !rows.length} aria-haspopup="dialog" className={button}>
            {exporting ? "Export en cours…" : "Exporter"}
          </button>
          {exporting && <p role="status" className="text-sm text-ma-muted">Préparation de l’export complet…</p>}
        </section>
        <dialog ref={exportDialogRef} aria-labelledby="export-format-title" aria-describedby="export-format-description" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-[22px] border border-ma-separator/60 bg-white p-6 text-ma-text shadow-xl backdrop:bg-black/40">
          <h2 id="export-format-title" className="text-xl font-extrabold">Choisir le format d’export</h2>
          <p id="export-format-description" className="mt-2 text-sm text-ma-muted">Toutes les confirmations seront regroupées dans un seul fichier.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => exportAll("csv")} className={button}>CSV (.csv)</button>
            <button type="button" onClick={() => exportAll("xlsx")} className={button}>Excel (.xlsx)</button>
          </div>
          <form method="dialog" className="mt-4 text-center">
            <button type="submit" className="rounded-full px-5 py-2.5 text-sm font-bold text-ma-muted hover:bg-ma-bg">Annuler</button>
          </form>
        </dialog>
        {error && <p role="alert" className="mb-6 rounded-xl border border-ma-danger/40 bg-ma-danger/10 p-4 text-sm text-ma-danger">{error}</p>}
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className={panel}>
            <p className="mb-4 text-sm font-bold text-ma-muted">{filtered.length} confirmation(s) affichée(s) sur {rows.length}</p>
            <label htmlFor="confirmation-search" className="text-sm font-bold">Rechercher un client</label>
            <input id="confirmation-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, courriel, téléphone…" className={`${input} mt-2 mb-4`} />
            <label htmlFor="confirmation-season" className="text-sm font-bold">Saison fiscale</label>
            <select id="confirmation-season" value={season} onChange={(event) => setSeason(event.target.value)} className={`${input} mt-2 mb-5`}><option value="">Toutes les saisons</option>{seasons.map((value) => <option key={value}>{value}</option>)}</select>
            {loading ? <p role="status">Chargement des confirmations…</p> : (
              <div className="max-h-[65vh] space-y-3 overflow-y-auto">
                {filtered.map((row) => <button type="button" key={row.id} onClick={() => setSelectedId(row.id)} aria-pressed={selected?.id === row.id} className={`w-full rounded-2xl border p-4 text-left ${selected?.id === row.id ? "border-ma-primary bg-ma-primary/10" : "border-ma-separator/60 hover:bg-ma-bg"}`}>
                  <span className="block font-extrabold">{row.first_name} {row.last_name}</span>
                  <span className="mt-1 block break-all text-xs text-ma-muted">{row.email}</span>
                  <span className="mt-3 block text-xs text-ma-muted">Saison {row.tax_season} · {new Date(row.created_at).toLocaleDateString("fr-CA")}</span>
                </button>)}
                {!filtered.length && <p className="rounded-xl bg-ma-bg p-5 text-sm text-ma-muted">{rows.length ? "Aucune confirmation ne correspond aux filtres." : "Aucune confirmation reçue pour le moment."}</p>}
              </div>
            )}
          </aside>
          <section className={panel}>
            {!loading && selected ? <>
              <h2 className="text-2xl font-extrabold">{selected.first_name} {selected.last_name}</h2>
              <p className="mt-2 text-sm text-ma-muted">Confirmation du {new Date(selected.created_at).toLocaleString("fr-CA")}</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">{Object.entries(confirmationExportRow(selected)).filter(([key]) => !["Identifiant", "Date de confirmation"].includes(key)).map(([label, value]) => <div key={label} className="rounded-xl bg-ma-bg p-4"><dt className="text-xs font-bold text-ma-muted">{label}</dt><dd className="mt-2 whitespace-pre-wrap break-words text-sm font-bold">{value === "" || value == null ? "—" : value}</dd></div>)}</dl>
            </> : <p className="rounded-xl bg-ma-bg p-6 text-sm text-ma-muted">{loading ? "Chargement…" : "Sélectionnez une confirmation pour consulter les renseignements."}</p>}
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}
