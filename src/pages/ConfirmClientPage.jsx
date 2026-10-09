import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { confirmClientTable, getSupabaseClient } from "../lib/supabaseClient";

const inputClass = "mt-2 w-full rounded-[10px] border border-ma-separator/75 bg-white px-4 py-3.5 text-ma-text outline-none focus:border-ma-primary focus:ring-4 focus:ring-ma-primary/15";
const textareaClass = `${inputClass} min-h-28 resize-y`;
const buttonClass = "inline-flex justify-center rounded-full bg-ma-primary px-7 py-3.5 text-sm font-extrabold text-white hover:bg-ma-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ma-primary";
const secondaryButtonClass = "inline-flex justify-center rounded-full border border-ma-separator/80 bg-white px-5 py-2.5 text-sm font-extrabold text-ma-primary hover:bg-ma-bg";

const relationLabels = {
  self: "Moi-même",
  spouse: "Conjoint ou conjointe",
  child: "Enfant",
  parent: "Parent",
  other: "Autre personne déjà cliente",
};

const preparedLabels = {
  yes: "Ancien client 2025",
  no: "Ajout à valider",
  unknown: "À vérifier",
};

const particularityLabels = {
  self_employed: "Travail autonome",
  rental_income: "Revenus d’immeuble locatif",
  dependent: "Personne à charge / autre situation à signaler",
  none: "Aucune",
  unknown: "Je ne sais pas",
};

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

function Field({ label, id, required = true, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold">{label}{required ? " *" : ""}</label>
      <input id={id} name={id} required={required} className={inputClass} {...props} />
    </div>
  );
}

function Choices({ legend, name, options, value, onChange, help }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold">{legend} *</legend>
      {help && <p className="mt-2 text-xs leading-5 text-ma-muted">{help}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map(([optionValue, label]) => (
          <label key={optionValue} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ma-separator/60 px-4 py-3 has-[:checked]:border-ma-primary has-[:checked]:bg-ma-primary/5">
            <input type="radio" name={name} value={optionValue} checked={value === optionValue} required onChange={(event) => onChange(event.target.value)} className="h-4 w-4 accent-ma-primary" />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function emptyPerson(id, relation = "child") {
  return {
    id,
    firstName: "",
    lastName: "",
    relation,
    prepared2025: "",
    sinLastThree: "",
    sinUnknown: false,
    contact: "",
  };
}

function PersonCard({ person, index, respondent, onChange, onRemove, canRemove, allowSelf }) {
  const isRespondent = person.relation === "self";
  const canSkipSin = person.relation === "child" || person.relation === "parent";

  return (
    <div className="rounded-2xl border border-ma-separator/60 bg-ma-bg/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-extrabold text-ma-primary">Personne {index + 1}</h3>
        {canRemove && (
          <button type="button" onClick={onRemove} className="rounded-full px-3 py-1.5 text-xs font-bold text-ma-danger hover:bg-ma-danger/10">
            Retirer
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isRespondent ? (
          <>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-bold text-ma-muted">Prénom</p>
              <p className="mt-1 font-bold">{respondent.firstName || "À compléter plus haut"}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-bold text-ma-muted">Nom</p>
              <p className="mt-1 font-bold">{respondent.lastName || "À compléter plus haut"}</p>
            </div>
          </>
        ) : (
          <>
            <Field label="Prénom" id={`person-${person.id}-first-name`} value={person.firstName} onChange={(event) => onChange({ firstName: event.target.value })} pattern=".*\S.*" maxLength={100} />
            <Field label="Nom" id={`person-${person.id}-last-name`} value={person.lastName} onChange={(event) => onChange({ lastName: event.target.value })} pattern=".*\S.*" maxLength={100} />
          </>
        )}

        <div>
          <label htmlFor={`person-${person.id}-relation`} className="block text-sm font-bold">Relation *</label>
          <select id={`person-${person.id}-relation`} value={person.relation} disabled={isRespondent} required onChange={(event) => onChange({ relation: event.target.value, sinUnknown: false })} className={inputClass}>
            <option value="self" disabled={!allowSelf}>Moi-même</option>
            <option value="spouse">Conjoint ou conjointe</option>
            <option value="child">Enfant</option>
            <option value="parent">Parent</option>
            <option value="other">Autre personne déjà cliente</option>
          </select>
        </div>

        <div>
          <label htmlFor={`person-${person.id}-prepared`} className="block text-sm font-bold">Avons-nous préparé ses impôts 2025 ? *</label>
          <select id={`person-${person.id}-prepared`} value={person.prepared2025} required onChange={(event) => onChange({ prepared2025: event.target.value })} className={inputClass}>
            <option value="" disabled>Sélectionnez une réponse</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
            <option value="unknown">Je ne sais pas</option>
          </select>
        </div>
      </div>

      {!["self", "spouse"].includes(person.relation) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`person-${person.id}-sin`} className="block text-sm font-bold">3 derniers chiffres du NAS{canSkipSin ? "" : " *"}</label>
            <input id={`person-${person.id}-sin`} value={person.sinLastThree} required={!canSkipSin && !person.sinUnknown} disabled={person.sinUnknown} onChange={(event) => onChange({ sinLastThree: event.target.value.replace(/\D/g, "").slice(0, 3) })} type="text" inputMode="numeric" autoComplete="off" minLength={3} maxLength={3} pattern="[0-9]{3}" className={inputClass} />
            {canSkipSin && (
              <label className="mt-3 flex items-center gap-2 text-sm text-ma-muted">
                <input type="checkbox" checked={person.sinUnknown} onChange={(event) => onChange({ sinUnknown: event.target.checked, sinLastThree: event.target.checked ? "" : person.sinLastThree })} className="h-4 w-4 accent-ma-primary" />
                Je ne les connais pas
              </label>
            )}
          </div>
          <div>
            <label htmlFor={`person-${person.id}-contact`} className="block text-sm font-bold">Coordonnées si connues</label>
            <input id={`person-${person.id}-contact`} value={person.contact} onChange={(event) => onChange({ contact: event.target.value })} className={inputClass} placeholder="Téléphone ou courriel" maxLength={200} />
            <p className="mt-2 text-xs leading-5 text-ma-muted">Si elles sont inconnues, l’équipe les demandera au répondant.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function personName(person, respondent) {
  const firstName = person?.relation === "self" ? respondent.firstName : person?.firstName;
  const lastName = person?.relation === "self" ? respondent.lastName : person?.lastName;
  return `${firstName || ""} ${lastName || ""}`.trim() || relationLabels[person?.relation] || "Personne";
}

function formatPeopleSummary(people, respondent) {
  return people.map((person) => {
    const sinText = person.sinUnknown ? "NAS inconnu" : person.sinLastThree ? `NAS ***${person.sinLastThree}` : "NAS non fourni";
    return `- ${personName(person, respondent)} (${relationLabels[person.relation]}), impôts 2025: ${person.prepared2025 ? preparedLabels[person.prepared2025] : "Non répondu"}, ${sinText}${person.contact ? `, coordonnées: ${person.contact}` : ""}`;
  }).join("\n");
}

function formatParticularities(selected, details, people, respondent) {
  if (!selected.length) return "Non répondu";
  return selected.map((key) => {
    if (key === "none" || key === "unknown") return particularityLabels[key];
    const detail = details[key] || {};
    const person = people.find((item) => item.id === detail.personId);
    return `${particularityLabels[key]}${person ? ` - ${personName(person, respondent)}` : ""}${detail.note ? `: ${detail.note}` : ""}`;
  }).join("\n");
}

function peoplePayload(people, respondent) {
  return people.map((person) => ({
    id: person.id,
    first_name: person.relation === "self" ? respondent.firstName.trim() : person.firstName.trim(),
    last_name: person.relation === "self" ? respondent.lastName.trim() : person.lastName.trim(),
    relation: person.relation,
    prepared_2025: person.prepared2025,
    sin_last_three: person.sinLastThree || null,
    sin_unknown: person.sinUnknown,
    contact: person.contact.trim() || null,
  }));
}

function particularitiesPayload(selected, details, people, respondent) {
  return selected.map((key) => {
    const detail = details[key] || {};
    const person = people.find((item) => item.id === detail.personId);
    return {
      type: key,
      person_id: detail.personId || null,
      person_name: person ? personName(person, respondent) : null,
      note: detail.note?.trim() || null,
    };
  });
}

export default function ConfirmClientPage() {
  const navigate = useNavigate();
  const [wantsService, setWantsService] = useState("");
  const [declineScope, setDeclineScope] = useState("");
  const [respondent, setRespondent] = useState({ firstName: "", lastName: "" });
  const [people, setPeople] = useState([emptyPerson(1, "self")]);
  const [nextPersonId, setNextPersonId] = useState(2);
  const [coupleSinPersonId, setCoupleSinPersonId] = useState(1);
  const [coupleSinLastThree, setCoupleSinLastThree] = useState("");
  const [particularities, setParticularities] = useState([]);
  const [particularityDetails, setParticularityDetails] = useState({});
  const [documentMethod, setDocumentMethod] = useState("");
  const [documentMethodNote, setDocumentMethodNote] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const hasSpouse = people.some((person) => person.relation === "spouse");
  const childrenCount = people.filter((person) => person.relation === "child").length;
  const oldClientsCount = people.filter((person) => person.prepared2025 === "yes").length;
  const toValidateCount = people.filter((person) => person.prepared2025 === "no" || person.prepared2025 === "unknown").length;
  const activePeople = useMemo(() => people.filter((person) => person.relation === "self" || person.firstName.trim() || person.lastName.trim()), [people]);

  useEffect(() => {
    if (wantsService !== "no") return;
    if (declineScope === "self") setPeople((current) => current.filter((person) => person.relation === "self"));
    if (declineScope === "couple" && !hasSpouse) addPerson("spouse");
  }, [declineScope, wantsService]);

  function updatePerson(id, patch) {
    setPeople((current) => current.map((person) => person.id === id ? { ...person, ...patch } : person));
  }

  function addPerson(relation = "child") {
    setPeople((current) => [...current, emptyPerson(nextPersonId, relation)]);
    setNextPersonId((current) => current + 1);
  }

  function removePerson(id) {
    setPeople((current) => current.filter((person) => person.id !== id));
    if (coupleSinPersonId === id) setCoupleSinPersonId(1);
  }

  function toggleParticularity(key) {
    setParticularities((current) => {
      if (key === "none" || key === "unknown") return current.includes(key) ? [] : [key];
      const withoutExclusive = current.filter((item) => !["none", "unknown"].includes(item));
      return withoutExclusive.includes(key) ? withoutExclusive.filter((item) => item !== key) : [...withoutExclusive, key];
    });
  }

  function detailsText() {
    const respondentName = `${respondent.firstName} ${respondent.lastName}`.trim();
    const couplePerson = people.find((person) => person.id === Number(coupleSinPersonId));
    return [
      `Répondant: ${respondentName}`,
      `Réponse impôts 2026: ${wantsService === "yes" ? "Oui" : "Non"}`,
      wantsService === "no" ? `Portée du refus: ${declineScope || "Non précisée"}` : "",
      "",
      "Personnes concernées:",
      formatPeopleSummary(activePeople, respondent),
      "",
      hasSpouse
        ? `Identification du couple: ${personName(couplePerson || activePeople[0], respondent)} - NAS ***${coupleSinLastThree}`
        : `Identification principale: NAS ***${coupleSinLastThree}`,
      "",
      wantsService === "yes" ? "Particularités 2026:" : "",
      wantsService === "yes" ? formatParticularities(particularities, particularityDetails, activePeople, respondent) : "",
      wantsService === "yes" ? "" : "",
      wantsService === "yes" ? `Remise des documents: ${documentMethod || "Non répondu"}${documentMethodNote ? ` - ${documentMethodNote}` : ""}` : "",
      `Coordonnées: ${phone}${noEmail ? " / Aucun courriel" : ` / ${email}`}`,
    ].filter((line) => line !== "").join("\n");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setSubmitError("");
    const identificationPerson = people.find((person) => person.id === Number(coupleSinPersonId)) || activePeople[0];

    const payload = {
      tax_season: "2026",
      wants_tax_service: wantsService === "yes",
      decline_scope: wantsService === "no" ? declineScope : null,
      respondent_first_name: respondent.firstName.trim(),
      respondent_last_name: respondent.lastName.trim(),
      people: peoplePayload(activePeople, respondent),
      total_people: activePeople.length,
      old_clients_count: oldClientsCount,
      to_validate_count: toValidateCount,
      is_couple: hasSpouse || declineScope === "couple",
      has_children: childrenCount > 0,
      children_count: childrenCount,
      identification_person_name: personName(identificationPerson, respondent),
      sin_last_three: coupleSinLastThree.trim() || null,
      particularities: wantsService === "yes" ? particularitiesPayload(particularities, particularityDetails, activePeople, respondent) : [],
      document_method: wantsService === "yes" ? documentMethod : "not_applicable",
      document_method_note: wantsService === "yes" ? documentMethodNote.trim() || null : null,
      phone: phone.trim(),
      email: noEmail ? null : email.trim(),
      no_email: noEmail,
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
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ma-primary">Impôts 2026</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Confirmez votre réponse</h1>
      <p className="mt-4 leading-7 text-ma-muted">Indiquez si vous souhaitez nous confier vos impôts 2026 et quelles personnes doivent être incluses dans votre réponse.</p>
      <div className="mt-6 rounded-xl border border-ma-separator/70 bg-ma-bg p-4 text-sm leading-6">
        <strong className="text-ma-primary">Votre confirmation est nécessaire.</strong> Si vous ne confirmez pas votre intention, nous ne pouvons pas garantir que votre dossier sera traité pour la prochaine saison fiscale.
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <p className="text-xs text-ma-muted">Les champs marqués d’un astérisque (*) sont obligatoires.</p>

        <Choices
          legend="Souhaitez-vous nous confier vos impôts 2026 ?"
          name="wants-service"
          value={wantsService}
          onChange={setWantsService}
          options={[["yes", "Oui"], ["no", "Non"]]}
        />

        <fieldset className="space-y-5">
          <legend className="mb-5 text-xl font-extrabold text-ma-primary">Identification du répondant</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prénom" id="first-name" value={respondent.firstName} onChange={(event) => setRespondent((current) => ({ ...current, firstName: event.target.value }))} autoComplete="given-name" pattern=".*\S.*" maxLength={100} />
            <Field label="Nom" id="last-name" value={respondent.lastName} onChange={(event) => setRespondent((current) => ({ ...current, lastName: event.target.value }))} autoComplete="family-name" pattern=".*\S.*" maxLength={100} />
          </div>
        </fieldset>

        {wantsService === "no" && (
          <Choices
            legend="Pour quelles personnes cette réponse s’applique-t-elle ?"
            name="decline-scope"
            value={declineScope}
            onChange={setDeclineScope}
            options={[["self", "Moi seulement"], ["couple", "Moi et mon conjoint ou ma conjointe"], ["all", "Toutes les personnes indiquées ci-dessous"]]}
          />
        )}

        {(wantsService === "yes" || (wantsService === "no" && declineScope)) && (
          <fieldset className="space-y-5 border-t border-ma-separator/40 pt-6">
            <legend className="pr-3 text-xl font-extrabold text-ma-primary">Personnes concernées</legend>
            <p className="text-sm leading-6 text-ma-muted">Inscrivez chaque personne une seule fois. Le nombre total est calculé automatiquement. Les nouveaux dossiers de parents ou d’enfants seront validés par notre équipe avant réservation.</p>
            {people.map((person, index) => (
              <PersonCard
                key={person.id}
                person={person}
                index={index}
                respondent={respondent}
                onChange={(patch) => updatePerson(person.id, patch)}
                onRemove={() => removePerson(person.id)}
                canRemove={person.relation !== "self"}
                allowSelf={person.relation === "self"}
              />
            ))}
            {(wantsService === "yes" || declineScope === "all") && (
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => addPerson("spouse")} className={secondaryButtonClass}>Ajouter un conjoint</button>
                <button type="button" onClick={() => addPerson("child")} className={secondaryButtonClass}>Ajouter un enfant</button>
                <button type="button" onClick={() => addPerson("parent")} className={secondaryButtonClass}>Ajouter un parent</button>
                <button type="button" onClick={() => addPerson("other")} className={secondaryButtonClass}>Ajouter une autre personne</button>
              </div>
            )}
            <p className="rounded-xl bg-white p-4 text-sm font-bold text-ma-primary">Total : {activePeople.length} personne(s)</p>
          </fieldset>
        )}

        {(wantsService === "yes" || (wantsService === "no" && declineScope)) && (
          <fieldset className="space-y-5 border-t border-ma-separator/40 pt-6">
            <legend className="pr-3 text-xl font-extrabold text-ma-primary">Identification utile</legend>
            {hasSpouse ? (
              <>
                <p className="text-sm leading-6 text-ma-muted">Indiquez les trois derniers chiffres du NAS d’une seule des deux personnes du couple.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="couple-sin-person" className="block text-sm font-bold">Ces chiffres appartiennent à *</label>
                    <select id="couple-sin-person" value={coupleSinPersonId} required onChange={(event) => setCoupleSinPersonId(event.target.value)} className={inputClass}>
                      {activePeople.filter((person) => ["self", "spouse"].includes(person.relation)).map((person) => (
                        <option key={person.id} value={person.id}>{personName(person, respondent)}</option>
                      ))}
                    </select>
                  </div>
                  <Field label="3 derniers chiffres du NAS" id="couple-sin" value={coupleSinLastThree} onChange={(event) => setCoupleSinLastThree(event.target.value.replace(/\D/g, "").slice(0, 3))} type="text" inputMode="numeric" autoComplete="off" minLength={3} maxLength={3} pattern="[0-9]{3}" title="Saisissez exactement 3 chiffres." />
                </div>
              </>
            ) : (
              <Field label="3 derniers chiffres du NAS de la personne seule" id="single-sin" value={coupleSinLastThree} onChange={(event) => setCoupleSinLastThree(event.target.value.replace(/\D/g, "").slice(0, 3))} type="text" inputMode="numeric" autoComplete="off" minLength={3} maxLength={3} pattern="[0-9]{3}" title="Saisissez exactement 3 chiffres." />
            )}
            <p className="text-xs leading-5 text-ma-muted">Pour les parents ou enfants dont les renseignements d’identification manquent, vous pouvez envoyer le formulaire quand même. La vérification se fera ensuite.</p>
          </fieldset>
        )}

        {wantsService === "yes" && (
          <fieldset className="space-y-5 border-t border-ma-separator/40 pt-6">
            <legend className="pr-3 text-xl font-extrabold text-ma-primary">Particularités à prévoir en 2026</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(particularityLabels).map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-ma-separator/60 px-4 py-3 has-[:checked]:border-ma-primary has-[:checked]:bg-ma-primary/5">
                  <input type="checkbox" checked={particularities.includes(key)} onChange={() => toggleParticularity(key)} className="mt-1 h-4 w-4 accent-ma-primary" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            {particularities.filter((key) => !["none", "unknown"].includes(key)).map((key) => (
              <div key={key} className="rounded-2xl border border-ma-separator/60 bg-ma-bg/60 p-4">
                <h3 className="font-extrabold text-ma-primary">{particularityLabels[key]}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`particularity-${key}-person`} className="block text-sm font-bold">Qui est concerné ? *</label>
                    <select id={`particularity-${key}-person`} value={particularityDetails[key]?.personId || ""} required onChange={(event) => setParticularityDetails((current) => ({ ...current, [key]: { ...current[key], personId: Number(event.target.value) } }))} className={inputClass}>
                      <option value="" disabled>Sélectionnez une personne</option>
                      {activePeople.map((person) => <option key={person.id} value={person.id}>{personName(person, respondent)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`particularity-${key}-note`} className="block text-sm font-bold">Courte précision</label>
                    <input id={`particularity-${key}-note`} value={particularityDetails[key]?.note || ""} onChange={(event) => setParticularityDetails((current) => ({ ...current, [key]: { ...current[key], note: event.target.value } }))} className={inputClass} maxLength={200} />
                  </div>
                </div>
              </div>
            ))}
          </fieldset>
        )}

        {wantsService === "yes" && (
          <fieldset className="space-y-5 border-t border-ma-separator/40 pt-6">
            <legend className="pr-3 text-xl font-extrabold text-ma-primary">Remise des documents</legend>
            <Choices
              legend="Comment prévoyez-vous nous remettre vos documents ?"
              name="document-method"
              value={documentMethod}
              onChange={setDocumentMethod}
              help="Les deux formats sont acceptés. Si le format diffère selon les personnes, vous pouvez nous le préciser ci-dessous."
              options={[["paper", "Papier"], ["electronic", "Électroniquement"], ["unknown", "Je ne sais pas encore"]]}
            />
            <div>
              <label htmlFor="document-method-note" className="block text-sm font-bold">Précision au besoin</label>
              <textarea id="document-method-note" value={documentMethodNote} onChange={(event) => setDocumentMethodNote(event.target.value)} className={textareaClass} maxLength={500} />
            </div>
          </fieldset>
        )}

        {wantsService && (
          <fieldset className="space-y-5 border-t border-ma-separator/40 pt-6">
            <legend className="pr-3 text-xl font-extrabold text-ma-primary">Vos coordonnées à jour</legend>
            <Field label="Numéro de téléphone" id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" pattern={"\\+?[ \\(]*[0-9](?:[ \\(\\).\\-]*[0-9]){9,14}[ \\).]*"} title="Saisissez de 10 à 15 chiffres. Les espaces, parenthèses, points et tirets sont acceptés." placeholder="514 555-0123" />
            <div>
              <Field label="Adresse courriel" id="email" type="email" value={email} required={!noEmail} disabled={noEmail} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="exemple@courriel.com" />
              <label className="mt-3 flex items-center gap-2 text-sm text-ma-muted">
                <input type="checkbox" checked={noEmail} onChange={(event) => { setNoEmail(event.target.checked); if (event.target.checked) setEmail(""); }} className="h-4 w-4 accent-ma-primary" />
                Je n’ai pas de courriel
              </label>
            </div>
          </fieldset>
        )}

        {wantsService && (
          <section className="rounded-2xl border border-ma-separator/60 bg-ma-bg p-5">
            <h2 className="text-xl font-extrabold text-ma-primary">Vérification avant envoi</h2>
            <p className="mt-3 text-sm leading-6 text-ma-muted">Total : <strong>{activePeople.length}</strong> personne(s). Anciens clients : <strong>{oldClientsCount}</strong>. Ajouts ou réponses à vérifier : <strong>{toValidateCount}</strong>.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {activePeople.map((person) => (
                <li key={person.id} className="rounded-xl bg-white p-3">
                  <strong>{personName(person, respondent)}</strong> · {relationLabels[person.relation]} · {person.prepared2025 ? preparedLabels[person.prepared2025] : "Impôts 2025 non répondu"}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-ma-muted">Nous vous communiquerons les dates de remise des documents. Votre dossier devra nous parvenir complet dans les délais indiqués.</p>
          </section>
        )}

        {submitError && (
          <div className="rounded-xl border border-ma-danger/40 bg-ma-danger/10 p-4 text-sm font-bold text-ma-danger">
            {submitError}
          </div>
        )}
        <button type="submit" disabled={loading || !wantsService} className={`${buttonClass} w-full disabled:cursor-not-allowed disabled:opacity-60`}>
          {loading ? "Enregistrement..." : "Envoyer ma réponse"}
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
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em]">Votre réponse est envoyée</h1>
        <p className="mt-4 leading-7 text-ma-muted">Merci d’avoir rempli le formulaire de confirmation pour les impôts 2026. Votre réponse a été enregistrée.</p>
        <p className="mt-5 rounded-xl bg-ma-bg p-4 text-sm leading-6 text-ma-muted">Un membre de l’équipe pourra communiquer avec vous si des renseignements supplémentaires sont nécessaires.</p>
        <Link to="/" className={`${buttonClass} mt-8`}>Retour à l’accueil</Link>
      </div>
    </PageLayout>
  );
}
