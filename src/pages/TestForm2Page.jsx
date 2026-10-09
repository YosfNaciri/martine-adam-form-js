import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const inputClass = "mt-2 w-full rounded-xl border border-ma-separator/70 bg-white px-4 py-3 text-ma-text outline-none transition focus:border-ma-primary focus:ring-4 focus:ring-ma-primary/15";
const textareaClass = `${inputClass} min-h-28 resize-y`;
const cardClass = "rounded-[24px] border border-ma-separator/60 bg-white p-5 shadow-[0_18px_45px_rgba(30,58,47,0.08)] sm:p-7";

const serviceOptions = [
  "Comptabilité et tenue de livres",
  "Déclarations fiscales",
  "Audit et certification",
  "Services de paie",
  "Services-conseils",
  "Autres",
];

const softwareOptions = ["QuickBooks", "Sage", "Acomba", "Taxprep", "CaseWare", "Autres"];
const revenueServiceOptions = ["Tenue de livres", "Déclarations fiscales", "Audit et certification", "Services de paie", "Services-conseils", "Autres"];

const ratingFields = [
  ["profitability", "Rentabilité du cabinet"],
  ["growth", "Croissance des revenus"],
  ["loyalty", "Fidélité de la clientèle"],
  ["facilities", "État des installations"],
  ["organization", "Organisation interne"],
];

function Field({ label, id, required = false, className = "", ...props }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-sm font-bold text-ma-text">{label}{required ? " *" : ""}</span>
      <input id={id} name={id} required={required} className={inputClass} {...props} />
    </label>
  );
}

function TextareaField({ label, id, required = false, className = "", ...props }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-sm font-bold text-ma-text">{label}{required ? " *" : ""}</span>
      <textarea id={id} name={id} required={required} className={textareaClass} {...props} />
    </label>
  );
}

function SelectField({ label, id, options, required = false, className = "" }) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-sm font-bold text-ma-text">{label}{required ? " *" : ""}</span>
      <select id={id} name={id} required={required} className={inputClass} defaultValue="">
        <option value="" disabled>Sélectionnez une réponse</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function CheckboxGroup({ legend, name, options, required = false }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-ma-text">{legend}{required ? " *" : ""}</legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 rounded-full border border-ma-separator/60 bg-white px-4 py-2 text-sm font-bold has-[:checked]:border-ma-primary has-[:checked]:bg-ma-primary/10 has-[:checked]:text-ma-primary">
            <input type="checkbox" name={name} value={option} required={required ? undefined : false} className="h-4 w-4 accent-ma-primary" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Section({ number, title, children }) {
  return (
    <section className={cardClass}>
      <div className="mb-6 flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ma-primary text-sm font-extrabold text-white">{number}</span>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ma-muted">Section {number}</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-ma-primary">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function RatingRow({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className="rounded-2xl border border-ma-separator/60 bg-ma-bg p-4">
      <span className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-extrabold text-ma-primary">{label}</span>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold">{value} / 5</span>
      </span>
      <input id={id} name={id} type="range" min="1" max="5" value={value} onChange={(event) => onChange(event.target.value)} className="mt-4 w-full accent-ma-primary" />
    </label>
  );
}

export default function TestForm2Page() {
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState(() => Object.fromEntries(ratingFields.map(([id]) => [id, "3"])));
  const [clientMix, setClientMix] = useState({ individuals: "", selfEmployed: "", businesses: "", other: "" });

  const clientMixTotal = useMemo(() => Object.values(clientMix).reduce((sum, value) => sum + Number(value || 0), 0), [clientMix]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="ma-form-theme min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.24),transparent_32%),linear-gradient(180deg,#fff_0%,#FAF8F5_100%)] px-4 py-8 text-ma-text sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="text-2xl font-extrabold text-ma-primary">GS Stratégies</Link>

        <header className="mt-8 overflow-hidden rounded-[28px] border border-ma-separator/60 bg-ma-primary text-white shadow-[0_26px_70px_rgba(30,58,47,0.18)]">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">Questionnaire de vente de cabinet</h1>
            </div>
            <aside className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-bold text-white/70">Aperçu</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt>Questions</dt><dd className="font-extrabold">26</dd></div>
                <div className="flex justify-between gap-4"><dt>Sections</dt><dd className="font-extrabold">10</dd></div>
                <div className="flex justify-between gap-4"><dt>Clientèle</dt><dd className={`font-extrabold ${clientMixTotal === 100 ? "text-white" : "text-white/70"}`}>{clientMixTotal}%</dd></div>
              </dl>
            </aside>
          </div>
        </header>

        {submitted && (
          <p role="status" className="mt-6 rounded-2xl border border-ma-primary/30 bg-ma-primary/10 p-4 text-sm font-bold text-ma-primary">
            Formulaire de test validé visuellement. Aucun envoi externe n’est configuré sur cette page.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Section number="1" title="Informations du vendeur">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Prénom et nom" id="sellerName" required autoComplete="name" />
              <Field label="Adresse courriel" id="sellerEmail" type="email" required autoComplete="email" />
              <Field label="Numéro de téléphone" id="sellerPhone" type="tel" required autoComplete="tel" />
              <SelectField label="Votre rôle au sein du cabinet" id="sellerRole" required options={["Propriétaire / Associé", "Gestionnaire", "Représentant autorisé", "Autre"]} />
            </div>
          </Section>

          <Section number="2" title="Informations sur le cabinet">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nom du cabinet" id="firmName" required />
              <Field label="Ville et province du cabinet" id="firmLocation" required />
              <SelectField label="Depuis combien d’années le cabinet est-il en activité ?" id="yearsActive" required options={["Moins de 5 ans", "5 à 10 ans", "11 à 20 ans", "Plus de 20 ans"]} />
              <CheckboxGroup legend="Quels sont les principaux services offerts ?" name="mainServices" options={serviceOptions} required />
            </div>
          </Section>

          <Section number="3" title="Profil du cabinet">
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField label="Quel est le chiffre d’affaires annuel approximatif de votre cabinet ?" id="annualRevenue" options={["Moins de 250 000 $", "250 000 $ à 500 000 $", "500 001 $ à 1 000 000 $", "1 000 001 $ à 2 000 000 $", "Plus de 2 000 000 $", "Préfère ne pas préciser"]} />
              <SelectField label="Combien de clients actifs compte votre cabinet ?" id="activeClients" required options={["Moins de 50", "50 à 100", "101 à 250", "251 à 500", "Plus de 500"]} />
              <SelectField label="Combien d’employés travaillent dans votre cabinet, incluant les propriétaires actifs ?" id="employeeCount" required options={["Aucun employé", "1 à 5", "6 à 10", "11 à 20", "Plus de 20"]} />
            </div>
          </Section>

          <Section number="4" title="Votre projet de vente">
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField label="Quelle est la principale raison de votre vente ?" id="saleReason" required options={["Départ à la retraite", "Changement de carrière", "Nouveaux projets professionnels", "Raisons personnelles", "Autre"]} />
              <SelectField label="Quand envisagez-vous de vendre votre cabinet ?" id="saleTiming" required options={["Dès que possible", "Dans les 6 prochains mois", "Dans les 6 à 12 prochains mois", "Dans plus d’un an", "Je souhaite simplement explorer mes options"]} />
              <Field label="Avez-vous une idée du prix de vente souhaité ?" id="askingPrice" type="number" min="0" step="0.01" inputMode="decimal" placeholder="$ CAD" />
              <SelectField label="Seriez-vous disposé à accompagner le nouvel acquéreur pendant la transition ?" id="transitionSupport" required options={["Oui", "Non", "À discuter"]} />
            </div>
          </Section>

          <Section number="5" title="Informations complémentaires">
            <TextareaField label="Souhaitez-vous ajouter des informations ou poser des questions concernant votre projet de vente ?" id="additionalInfo" />
          </Section>

          <Section number="6" title="Informations financières">
            <div className="space-y-5">
              <div className="grid gap-4 rounded-2xl bg-ma-bg p-4 md:grid-cols-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="rounded-2xl bg-white p-4">
                    <Field label={`Exercice financier ${index} - Année`} id={`financialYear${index}`} type="number" min="1900" max="2100" />
                    <Field label="Montant $" id={`financialAmount${index}`} type="number" min="0" step="0.01" inputMode="decimal" />
                  </div>
                ))}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField label="Quelle est la marge bénéficiaire nette approximative de votre cabinet ?" id="profitMargin" options={["Moins de 10 %", "Entre 10 % et 20 %", "Entre 21 % et 30 %", "Plus de 30 %", "Je ne sais pas / Préfère ne pas préciser"]} />
                <SelectField label="Votre cabinet a-t-il des dettes ou des engagements financiers importants ?" id="debts" options={["Non", "Oui, moins de 50 000 $", "Oui, entre 50 000 $ et 150 000 $", "Oui, plus de 150 000 $", "Préfère ne pas préciser"]} />
              </div>
            </div>
          </Section>

          <Section number="7" title="Organisation et fonctionnement">
            <div className="grid gap-5 md:grid-cols-2">
              <CheckboxGroup legend="Quels logiciels comptables utilisez-vous principalement ?" name="software" options={softwareOptions} />
              <SelectField label="Quelle est la situation actuelle de vos locaux ?" id="premises" required options={["Locaux en propriété", "Locaux en location", "Travail entièrement à distance", "Autre"]} />
              <SelectField label="Quel est l’état général des équipements et des installations du cabinet ?" id="equipmentState" options={["Excellent", "Bon", "Moyen", "Nécessite des investissements"]} />
            </div>
          </Section>

          <Section number="8" title="Clientèle et activités">
            <div className="space-y-5">
              <div className="rounded-2xl bg-ma-bg p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-extrabold text-ma-primary">Répartition approximative de votre clientèle</h3>
                  <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${clientMixTotal === 100 ? "bg-ma-primary text-white" : "bg-white text-ma-muted"}`}>{clientMixTotal}% / 100%</span>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  {[
                    ["individuals", "Particuliers"],
                    ["selfEmployed", "Travailleurs autonomes"],
                    ["businesses", "PME / Entreprises"],
                    ["other", "Autres"],
                  ].map(([id, label]) => (
                    <Field key={id} label={`${label} (%)`} id={id} type="number" min="0" max="100" inputMode="numeric" value={clientMix[id]} onChange={(event) => setClientMix((current) => ({ ...current, [id]: event.target.value }))} />
                  ))}
                </div>
              </div>
              <CheckboxGroup legend="Quels services représentent la majorité de vos revenus ?" name="revenueServices" options={revenueServiceOptions} />
            </div>
          </Section>

          <Section number="9" title="Évaluation générale du cabinet">
            <p className="mb-5 text-sm leading-6 text-ma-muted">Échelle de 1 à 5 : 1 = Très faible, 5 = Excellent.</p>
            <div className="grid gap-4">
              {ratingFields.map(([id, label]) => (
                <RatingRow key={id} id={id} label={label} value={ratings[id]} onChange={(value) => setRatings((current) => ({ ...current, [id]: value }))} />
              ))}
            </div>
          </Section>

          <Section number="10" title="Situation juridique et consentement">
            <div className="space-y-5">
              <SelectField label="Votre cabinet fait-il actuellement l’objet de litiges ou de procédures juridiques pouvant avoir un impact sur sa vente ?" id="legalSituation" required options={["Non", "Oui", "Préfère en discuter directement"]} />
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ma-separator/60 bg-ma-bg p-4 text-sm leading-6">
                <input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-ma-primary" />
                <span>J’accepte que GS Stratégies me contacte concernant mon projet de vente et que les informations fournies soient utilisées pour traiter ma demande, conformément à sa politique de confidentialité. *</span>
              </label>
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
