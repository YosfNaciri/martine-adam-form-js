import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { confirmClientTable, getSupabaseClient } from "../lib/supabaseClient";

const inputClass = "mt-2 w-full rounded-[10px] border border-ma-separator/75 bg-white px-4 py-3.5 text-ma-text outline-none focus:border-ma-primary focus:ring-4 focus:ring-ma-primary/15";
const buttonClass = "inline-flex justify-center rounded-full bg-ma-primary px-7 py-3.5 text-sm font-extrabold text-white hover:bg-ma-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ma-primary";

function PageLayout({ children }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="ma-form-theme min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.25),transparent_34%),linear-gradient(180deg,#ffffff_0%,#FAF8F5_100%)] px-4 py-8 text-ma-text sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-2xl font-extrabold text-ma-primary">Martine Adam CPA</Link>
        <section className="mt-8 rounded-[22px] border border-ma-separator/60 bg-white/90 p-6 shadow-[0_22px_55px_rgba(30,58,47,0.10)] sm:p-10">
          {children}
        </section>
        <p className="mt-6 text-center text-sm text-ma-muted">Martine Adam CPA · Préparation de votre prochaine saison fiscale</p>
      </div>
    </main>
  );
}

function Field({ label, id, ...props }) {
  return <div><label htmlFor={id} className="block text-sm font-bold">{label} *</label><input id={id} name={id} required className={inputClass} {...props} /></div>;
}

function Choices({ legend, name, options, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold">{legend} *</legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map(([value, label]) => (
          <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ma-separator/60 px-4 py-3 has-[:checked]:border-ma-primary has-[:checked]:bg-ma-primary/5">
            <input type="radio" name={name} value={value} required onChange={onChange} className="h-4 w-4 accent-ma-primary" />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ConfirmClientPage() {
  const navigate = useNavigate();
  const [hasChildren, setHasChildren] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      first_name: String(formData.get("first-name") || "").trim(),
      last_name: String(formData.get("last-name") || "").trim(),
      is_couple: formData.get("couple") === "yes",
      has_children: formData.get("children") === "yes",
      children_count:
        formData.get("children") === "yes"
          ? Number(formData.get("children-count") || 0)
          : null,
      occupation_type: String(formData.get("occupation") || ""),
      occupation_details:
        String(formData.get("occupation") || "") === "other"
          ? String(formData.get("occupation-details") || "").trim()
          : null,
      sin_last_three: String(formData.get("sin-last-three") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      follow_up_preference: String(formData.get("follow-up") || ""),
      wants_tax_service: true,
      tax_season: String(new Date().getFullYear() + 1),
      user_agent: navigator.userAgent || null,
    };

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from(confirmClientTable).insert(payload);

      if (error) throw error;

      navigate("/confirm-client/confirmation", { state: { validated: true } });
    } catch (error) {
      setSubmitError(
        error.message ||
          "Une erreur est survenue pendant l’enregistrement de votre confirmation."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ma-primary">Prochaine saison des impôts</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Confirmez votre retour</h1>
      <p className="mt-4 leading-7 text-ma-muted">Souhaitez-vous nous confier la préparation de vos impôts pour la prochaine saison fiscale ? Confirmez votre intention et mettez vos coordonnées à jour.</p>
      <div className="mt-6 rounded-xl border border-ma-separator/70 bg-ma-bg p-4 text-sm leading-6">
        <strong className="text-ma-primary">Votre confirmation est nécessaire.</strong> Si vous ne confirmez pas votre intention, nous ne pouvons pas garantir que votre dossier sera traité pour la prochaine saison fiscale.
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <p className="text-xs text-ma-muted">Les champs marqués d’un astérisque (*) sont obligatoires.</p>
        <fieldset className="space-y-5">
          <legend className="mb-5 text-xl font-extrabold text-ma-primary">Vos renseignements</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prénom" id="first-name" autoComplete="given-name" pattern=".*\S.*" maxLength={100} />
            <Field label="Nom" id="last-name" autoComplete="family-name" pattern=".*\S.*" maxLength={100} />
          </div>
          <Choices legend="S’agit-il d’un dossier de couple ?" name="couple" options={[["yes", "Oui"], ["no", "Non"]]} />
          <Choices legend="Votre dossier familial comprend-il des enfants ?" name="children" options={[["yes", "Oui"], ["no", "Non"]]} onChange={(event) => setHasChildren(event.target.value === "yes")} />
          {hasChildren && <Field label="Nombre d’enfants" id="children-count" type="number" min="1" step="1" inputMode="numeric" />}
          <div>
            <label htmlFor="occupation" className="block text-sm font-bold">Occupation ou type de client *</label>
            <select id="occupation" name="occupation" required value={occupation} onChange={(event) => setOccupation(event.target.value)} className={inputClass}>
              <option value="" disabled>Sélectionnez votre situation</option>
              <option value="employee">Salarié(e)</option>
              <option value="self-employed">Travailleur ou travailleuse autonome</option>
              <option value="retired">Retraité(e)</option>
              <option value="student">Étudiant(e)</option>
              <option value="unemployed">Sans emploi</option>
              <option value="business-owner">Propriétaire d’entreprise</option>
              <option value="other">Autre / plusieurs situations</option>
            </select>
          </div>
          {occupation === "other" && <Field label="Précisez votre situation" id="occupation-details" pattern=".*\S.*" maxLength={200} />}
          <div>
            <Field label="Les 3 derniers chiffres de votre NAS" id="sin-last-three" type="text" inputMode="numeric" autoComplete="off" minLength={3} maxLength={3} pattern="[0-9]{3}" title="Saisissez exactement 3 chiffres." aria-describedby="sin-help" />
            <p id="sin-help" className="mt-2 text-xs text-ma-muted">Indiquez uniquement les 3 derniers chiffres, jamais votre NAS complet.</p>
          </div>
        </fieldset>

        <fieldset className="space-y-5 border-t border-ma-separator/40 pt-6">
          <legend className="pr-3 text-xl font-extrabold text-ma-primary">Vos coordonnées à jour</legend>
          <Field label="Numéro de téléphone à jour" id="phone" type="tel" autoComplete="tel" pattern={"\\+?[ \\(]*[0-9](?:[ \\(\\).\\-]*[0-9]){9,14}[ \\).]*"} title="Saisissez de 10 à 15 chiffres. Les espaces, parenthèses, points et tirets sont acceptés." placeholder="514 555-0123" />
          <Field label="Adresse courriel à jour" id="email" type="email" autoComplete="email" placeholder="exemple@courriel.com" />
          <Choices legend="Quel mode de suivi préférez-vous ?" name="follow-up" options={[["paper", "Papier"], ["electronic", "Électronique"]]} />
        </fieldset>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-ma-bg p-4 text-sm leading-6">
          <input type="checkbox" name="confirmation" required className="mt-1 h-4 w-4 shrink-0 accent-ma-primary" />
          <span>Je souhaite confier mes impôts à Martine Adam CPA pour la prochaine saison fiscale et je confirme que les renseignements fournis sont à jour. *</span>
        </label>
        {submitError && (
          <div className="rounded-xl border border-ma-danger/40 bg-ma-danger/10 p-4 text-sm font-bold text-ma-danger">
            {submitError}
          </div>
        )}
        <button type="submit" disabled={loading} className={`${buttonClass} w-full disabled:cursor-not-allowed disabled:opacity-60`}>
          {loading ? "Enregistrement..." : "Valider ma confirmation"}
        </button>
      </form>
    </PageLayout>
  );
}

export function ConfirmClientSuccessPage() {
  const { state } = useLocation();
  if (!state?.validated) return <Navigate to="/confirm-client" replace />;
  return (
    <PageLayout>
      <div className="text-center">
        <div aria-hidden="true" className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ma-primary/10 text-3xl text-ma-primary">✓</div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em]">Votre formulaire est validé</h1>
        <p className="mt-4 leading-7 text-ma-muted">Merci d’avoir rempli le formulaire de confirmation pour la prochaine saison fiscale. Votre réponse a été enregistrée.</p>
        <p className="mt-5 rounded-xl bg-ma-bg p-4 text-sm leading-6 text-ma-muted">Un membre de l’équipe pourra communiquer avec vous si des renseignements supplémentaires sont nécessaires.</p>
        <Link to="/" className={`${buttonClass} mt-8`}>Retour à l’accueil</Link>
      </div>
    </PageLayout>
  );
}
