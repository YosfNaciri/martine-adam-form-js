import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const inputClass = "mt-2 w-full rounded-xl border border-ma-separator/70 bg-white px-4 py-3 text-ma-text outline-none transition focus:border-ma-primary focus:ring-4 focus:ring-ma-primary/15";
const textareaClass = `${inputClass} min-h-28 resize-y`;
const cardClass = "rounded-[22px] border border-ma-separator/60 bg-white p-5 shadow-[0_18px_45px_rgba(30,58,47,0.08)] sm:p-7";
const sectionTitleClass = "text-2xl font-extrabold tracking-[-0.035em] text-ma-primary";

const designationOptions = ["CPA", "Audit-Révision", "Tenue de livres", "Paie", "Autres"];
const ratingFields = [
  {
    id: "location",
    label: "Emplacement",
    help: "1 = Très petite rue / 5 = Grande route métropolitaine",
  },
  {
    id: "neighborhood",
    label: "Quartier",
    help: "1 = Moins désirable / 5 = Zone privilégiée, haut de gamme (0 = pas dans une ville)",
  },
  {
    id: "profitability",
    label: "Rentabilité",
    help: "1 = Très faible / 5 = Supérieur à 10%",
  },
  {
    id: "financing",
    label: "Financement",
    help: "1 = Paiement intégral / 5 = Généreux financement du propriétaire",
  },
  {
    id: "appearance",
    label: "Apparence",
    help: "1 = Peu attrayant / 5 = Haut de gamme, professionnel",
  },
  {
    id: "revenueTrend",
    label: "Revenus",
    help: "1 = En baisse / 5 = En hausse",
  },
  {
    id: "longevity",
    label: "Longévité",
    help: "1 = 5 ans ou moins / 5 = Plus de 5 ans",
  },
];

const revenueRows = [
  ["monthly", "Clients mensuels"],
  ["quarterly", "Clients trimestriels"],
  ["yearly", "Clients annuels"],
  ["individualReturns", "Impôts particuliers"],
  ["businessReturns", "Impôts entreprise"],
  ["otherReturns", "Autres - Impôts"],
  ["consulting", "Consultation"],
  ["payroll", "Traitement de paie"],
  ["auditReview", "Audit & révision"],
];

function Field({ label, id, className = "", required = false, ...props }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-sm font-bold text-ma-text">{label}{required ? " *" : ""}</span>
      <input id={id} name={id} required={required} className={inputClass} {...props} />
    </label>
  );
}

function TextareaField({ label, id, className = "", ...props }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-sm font-bold text-ma-text">{label}</span>
      <textarea id={id} name={id} className={textareaClass} {...props} />
    </label>
  );
}

function YesNo({ legend, name, extra = null }) {
  return (
    <fieldset className="rounded-2xl bg-ma-bg p-4">
      <legend className="text-sm font-bold text-ma-text">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {["Oui", "Non"].map((value) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 rounded-full border border-ma-separator/60 bg-white px-4 py-2 text-sm font-bold has-[:checked]:border-ma-primary has-[:checked]:bg-ma-primary/10 has-[:checked]:text-ma-primary">
            <input type="radio" name={name} value={value} className="h-4 w-4 accent-ma-primary" />
            {value}
          </label>
        ))}
        {extra}
      </div>
    </fieldset>
  );
}

function Section({ eyebrow, title, children }) {
  return (
    <section className={cardClass}>
      <div className="mb-6 flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ma-primary text-sm font-extrabold text-white">{eyebrow}</span>
        <div>
          <h2 className={sectionTitleClass}>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function RevenueRow({ id, label, onChange }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-ma-separator/50 bg-white p-4 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
      <p className="self-center text-sm font-extrabold text-ma-primary">{label}</p>
      <Field label="Nombre de clients" id={`${id}-count`} type="number" min="0" inputMode="numeric" onChange={onChange} />
      <Field label="Frais $" id={`${id}-fee`} type="number" min="0" step="0.01" inputMode="decimal" onChange={onChange} />
      <Field label="Total $" id={`${id}-total`} type="number" min="0" step="0.01" inputMode="decimal" onChange={onChange} />
    </div>
  );
}

export default function TestFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState(() => Object.fromEntries(ratingFields.map((field) => [field.id, "3"])));
  const [revenueVersion, setRevenueVersion] = useState(0);

  const grandTotal = useMemo(() => {
    if (typeof document === "undefined") return 0;
    return revenueRows.reduce((sum, [id]) => {
      const value = Number(document.getElementById(`${id}-total`)?.value || 0);
      return sum + value;
    }, Number(document.getElementById("otherServicesTotal")?.value || 0));
  }, [revenueVersion]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="ma-form-theme min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.24),transparent_32%),linear-gradient(180deg,#fff_0%,#FAF8F5_100%)] px-4 py-8 text-ma-text sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="text-2xl font-extrabold text-ma-primary">GS Strategies</Link>

        <header className="mt-8 overflow-hidden rounded-[28px] border border-ma-separator/60 bg-ma-primary text-white shadow-[0_26px_70px_rgba(30,58,47,0.18)]">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">Questionnaire de vente de cabinet</h1>

            </div>
            <aside className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-bold text-white/70">Résumé</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt>Sections</dt><dd className="font-extrabold">9</dd></div>
                <div className="flex justify-between gap-4"><dt>Évaluation</dt><dd className="font-extrabold">0 à 5</dd></div>
                <div className="flex justify-between gap-4"><dt>Total revenus</dt><dd className="font-extrabold">{grandTotal.toLocaleString("fr-CA", { style: "currency", currency: "CAD" })}</dd></div>
              </dl>
            </aside>
          </div>
        </header>

        {submitted && (
          <p role="status" className="mt-6 rounded-2xl border border-ma-primary/30 bg-ma-primary/10 p-4 text-sm font-bold text-ma-primary">
            Le formulaire est prêt visuellement. Aucun envoi externe n’est configuré pour cette page de test.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Section eyebrow="1" title="Coordonnées du cabinet et du vendeur">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nom du propriétaire" id="ownerName" required />
              <Field label="Courriel confidentiel du vendeur" id="sellerEmail" type="email" />
              <Field label="Tél. maison" id="homePhone" type="tel" />
              <Field label="Cellulaire" id="cellPhone" type="tel" />
              <Field label="Tél. bureau" id="officePhone" type="tel" />
              <Field label="Fax" id="fax" />
              <Field label="Nom du cabinet" id="firmName" required />
              <Field label="Web" id="website" type="url" placeholder="https://" />
              <Field label="Adresse cabinet" id="firmAddress" className="md:col-span-2" />
              <Field label="Ville" id="city" />
              <Field label="Province" id="province" />
              <Field label="Code postal" id="postalCode" />
            </div>
          </Section>

          <Section eyebrow="2" title="Profil professionnel">
            <div className="grid gap-5 md:grid-cols-2">
              <fieldset className="md:col-span-2">
                <legend className="text-sm font-bold text-ma-text">Désignation</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {designationOptions.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 rounded-full border border-ma-separator/60 bg-white px-4 py-2 text-sm font-bold has-[:checked]:border-ma-primary has-[:checked]:bg-ma-primary/10 has-[:checked]:text-ma-primary">
                      <input type="checkbox" name="designation" value={option} className="h-4 w-4 accent-ma-primary" />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field label="Autres désignations" id="otherDesignation" />
              <Field label="Entité légale" id="legalEntity" />
              <Field label="Cabinet établi depuis" id="yearEstablished" type="number" min="1800" max="2100" />
              <TextareaField label="Permis & certifications" id="licenses" />
              <TextareaField label="Ordres professionnels" id="professionalOrganizations" />
              <TextareaField label="Logiciels utilisés" id="software" />
              <TextareaField label="Bref historique du cabinet" id="firmHistory" />
            </div>
          </Section>

          <Section eyebrow="3" title="Vente du cabinet">
            <div className="grid gap-5 md:grid-cols-2">
              <TextareaField label="Raison de la vente" id="sellingReason" className="md:col-span-2" />
              <Field label="Quand envisagez-vous de vendre votre cabinet ?" id="saleTimeline" placeholder="Cette année, l’an prochain, autre..." />
              <Field label="Prix demandé $" id="askingPrice" type="number" min="0" step="0.01" inputMode="decimal" />
              <Field label="Termes financement" id="financingTerms" />
              <TextareaField label="Dettes à assumer par l’acheteur (emprunts, etc.)" id="liabilities" />
            </div>
          </Section>

          <Section eyebrow="4" title="Revenus et flux de trésorerie">
            <div className="grid gap-5 md:grid-cols-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="rounded-2xl bg-ma-bg p-4 md:col-span-1">
                  <Field label={`Année ${index}`} id={`grossYear${index}`} type="number" min="1900" max="2100" />
                  <Field label="Revenu brut $" id={`grossRevenue${index}`} type="number" min="0" step="0.01" inputMode="decimal" />
                </div>
              ))}
              <div className="rounded-2xl bg-ma-bg p-4 md:col-span-1">
                <Field label="Année projetée" id="projectedYear" type="number" min="1900" max="2100" />
                <Field label="Projection $" id="projectedRevenue" type="number" min="0" step="0.01" inputMode="decimal" />
              </div>
              <TextareaField
                label="Flux de trésorerie"
                id="cashFlow"
                className="md:col-span-4"
                placeholder="Revenu net avant impôts, intérêts, amortissement et dépréciation, incluant les avantages du propriétaire."
              />
              <YesNo legend="Avez-vous des clients qui contribuent à plus de 10% de vos revenus ?" name="largeClientShare" />
            </div>
          </Section>

          <Section eyebrow="5" title="Installations et bail">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Valeur estimée du mobilier et des équipements $" id="equipmentValue" type="number" min="0" step="0.01" inputMode="decimal" />
              <Field label="Prix du loyer $ / mois" id="monthlyRent" type="number" min="0" step="0.01" inputMode="decimal" />
              <Field label="Grandeur du loyer en pi²" id="rentSquareFeet" type="number" min="0" inputMode="numeric" />
              <Field label="Date d’expiration du bail" id="leaseExpiration" type="date" />
              <TextareaField label="Description des installations" id="facilitiesDescription" className="md:col-span-2" />
              <YesNo legend="Le bail est-il transférable ?" name="leaseTransferable" />
              <YesNo legend="Y a-t-il des litiges avec le propriétaire ?" name="landlordDisputes" />
            </div>
          </Section>

          <Section eyebrow="6" title="Revenus par service">
            <div className="space-y-4 rounded-2xl bg-ma-bg p-4">
              <p className="text-sm font-bold text-ma-primary">Revenus de comptabilité, tenue de livres, compilations, impôts et autres services</p>
              {revenueRows.map(([id, label]) => (
                <RevenueRow key={id} id={id} label={label} onChange={() => setRevenueVersion((value) => value + 1)} />
              ))}
              <div className="grid gap-3 rounded-2xl border border-ma-separator/50 bg-white p-4 md:grid-cols-[1.3fr_2fr_1fr]">
                <p className="self-center text-sm font-extrabold text-ma-primary">Autres services</p>
                <Field label="Description" id="otherServicesDescription" />
                <Field label="Total $" id="otherServicesTotal" type="number" min="0" step="0.01" inputMode="decimal" onChange={() => setRevenueVersion((value) => value + 1)} />
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-ma-primary p-5 text-white">
                <span className="text-sm font-bold text-white/75">Total</span>
                <strong className="text-2xl">{grandTotal.toLocaleString("fr-CA", { style: "currency", currency: "CAD" })}</strong>
              </div>
            </div>
          </Section>

          <Section eyebrow="7" title="Évaluation du cabinet">
            <p className="mb-5 text-sm leading-6 text-ma-muted">Veuillez évaluer votre cabinet selon les critères suivants sur une échelle de 0 à 5.</p>
            <div className="grid gap-4">
              {ratingFields.map((field) => (
                <label key={field.id} htmlFor={field.id} className="rounded-2xl border border-ma-separator/60 bg-ma-bg p-4">
                  <span className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-extrabold text-ma-primary">{field.label}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold">{ratings[field.id]} / 5</span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-ma-muted">{field.help}</span>
                  <input
                    id={field.id}
                    name={field.id}
                    type="range"
                    min="0"
                    max="5"
                    value={ratings[field.id]}
                    onChange={(event) => setRatings((current) => ({ ...current, [field.id]: event.target.value }))}
                    className="mt-4 w-full accent-ma-primary"
                  />
                </label>
              ))}
            </div>
          </Section>

          <Section eyebrow="8" title="Historique de vente et litiges">
            <div className="grid gap-5 md:grid-cols-2">
              <YesNo legend="Avez-vous déjà tenté de vendre ?" name="previousSaleAttempt" />
              <TextareaField label="Si oui, expliquez ce qui a été fait" id="previousSaleAttemptDetails" />
              <YesNo legend="Y a-t-il des litiges en cours ?" name="currentDisputes" />
              <TextareaField label="Précisions sur les litiges, s’il y a lieu" id="currentDisputesDetails" />
            </div>
          </Section>

          <Section eyebrow="9" title="Employés et questions finales">
            <div className="space-y-5">
              <div className="grid gap-4 rounded-2xl bg-ma-bg p-4 md:grid-cols-4">
                <p className="self-center font-extrabold text-ma-primary">Nombre d’employés permanents</p>
                <Field label="Temps plein" id="permanentFullTime" type="number" min="0" inputMode="numeric" />
                <Field label="Temps partiel" id="permanentPartTime" type="number" min="0" inputMode="numeric" />
                <Field label="Contrat" id="permanentContract" type="number" min="0" inputMode="numeric" />
              </div>
              <div className="grid gap-4 rounded-2xl bg-ma-bg p-4 md:grid-cols-4">
                <p className="self-center font-extrabold text-ma-primary">Pendant la saison d’impôt</p>
                <Field label="Temps plein" id="taxSeasonFullTime" type="number" min="0" inputMode="numeric" />
                <Field label="Temps partiel" id="taxSeasonPartTime" type="number" min="0" inputMode="numeric" />
                <Field label="Contrat" id="taxSeasonContract" type="number" min="0" inputMode="numeric" />
              </div>
              <TextareaField label="Avez-vous des questions concernant la valeur de votre cabinet ?" id="valuationQuestions" />
            </div>
          </Section>

          <div className="sticky bottom-4 z-10 rounded-[22px] border border-ma-separator/60 bg-white/95 p-4 shadow-[0_18px_50px_rgba(30,58,47,0.16)] backdrop-blur">
            <button type="submit" className="w-full rounded-full bg-ma-primary px-7 py-3.5 text-sm font-extrabold text-white hover:bg-ma-primary-dark">
              Valider le formulaire de test
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
