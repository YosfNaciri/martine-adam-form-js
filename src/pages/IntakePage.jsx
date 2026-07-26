import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient, intakeDocumentsTable, intakeFilesBucket, intakeTable } from "../lib/supabaseClient";
const L_TYPE_CLIENT = [
    { v: "particulier", l: "Particulier" },
    { v: "travailleur_autonome", l: "Travailleur autonome" },
    { v: "societe", l: "Société par actions" },
    { v: "osbl", l: "OSBL / organisme" },
    { v: "succession", l: "Succession" },
];
const L_LANGUE = [
    { v: "fr", l: "Français" },
    { v: "en", l: "Anglais" },
];
const L_ETAT_CIVIL = [
    { v: "celibataire", l: "Célibataire" },
    { v: "marie", l: "Marié(e)" },
    { v: "conjoint_fait", l: "Conjoint(e) de fait" },
    { v: "separe", l: "Séparé(e)" },
    { v: "divorce", l: "Divorcé(e)" },
    { v: "veuf", l: "Veuf / veuve" },
];
const L_OUI_NON = [
    { v: "oui", l: "Oui" },
    { v: "non", l: "Non" },
];
const L_OUI_NON_SO = [
    { v: "oui", l: "Oui" },
    { v: "non", l: "Non" },
    { v: "so", l: "Sans objet" },
];
const L_STATUT_AUTORISATION = [
    { v: "en_cours", l: "Demande en cours" },
    { v: "complete", l: "Complétée" },
    { v: "a_faire", l: "À faire par le cabinet" },
];
const L_LOGICIEL = [
    { v: "qbo", l: "QuickBooks Online" },
    { v: "sage", l: "Sage" },
    { v: "excel", l: "Excel" },
    { v: "acomba", l: "Acomba" },
    { v: "aucun", l: "Aucun" },
    { v: "autre", l: "Autre" },
];
const L_SERVICES = [
    { v: "tenue_livres", l: "Tenue de livres" },
    { v: "paie", l: "Paie" },
    { v: "tps_tvq", l: "Déclarations TPS/TVQ" },
    { v: "impot_personnel", l: "Impôt personnel" },
    { v: "impot_societe", l: "Impôt des sociétés" },
    { v: "etats_financiers", l: "États financiers" },
    { v: "planification", l: "Planification fiscale" },
    { v: "demarrage", l: "Accompagnement démarrage" },
    { v: "autre", l: "Autre" },
];
const L_FREQUENCE = [
    { v: "hebdo", l: "Hebdomadaire" },
    { v: "mensuelle", l: "Mensuelle" },
    { v: "trimestrielle", l: "Trimestrielle" },
    { v: "annuelle", l: "Annuelle" },
    { v: "ponctuelle", l: "Ponctuelle" },
];
const L_VOLUME = [
    { v: "faible", l: "Moins de 50 transactions / mois" },
    { v: "moyen", l: "50 à 200 transactions / mois" },
    { v: "eleve", l: "200 à 500 transactions / mois" },
    { v: "tres_eleve", l: "Plus de 500 transactions / mois" },
];
const steps = [
    { num: "01", label: "Identification", desc: "Coordonnées et type de client", title: "Identification et coordonnées", intro: "Ces renseignements s’appliquent à tous les nouveaux dossiers, peu importe le type de client." },
    { num: "02", label: "Profil du client", desc: "Selon le type sélectionné", title: "Profil du client", intro: "Cette section s’adapte selon le type de client choisi à l’étape précédente." },
    { num: "03", label: "Documents comptables", desc: "Historique fiscal et financier", title: "Documents comptables et fiscaux", intro: "Joignez les documents disponibles. Vous pourrez compléter cette section plus tard si certains documents manquent." },
    { num: "04", label: "Accès et conformité", desc: "Autorisations et consentements", title: "Accès, autorisations et conformité", intro: "Ces autorisations permettent au cabinet d’agir en votre nom auprès des autorités fiscales." },
    { num: "05", label: "Mandat", desc: "Services et besoins", title: "Détail des besoins et du mandat", intro: "Décrivez les services recherchés afin que nous puissions préparer une proposition adaptée." },
    { num: "06", label: "Confirmation", desc: "Révision et envoi", title: "Révision du dossier", intro: "Vérifiez les renseignements ci-dessous avant l’envoi." },
];
const repeatConfigs = {
    personnes_charge: { addLabel: "+ Ajouter une personne à charge", fields: [{ id: "nom", label: "Nom" }, { id: "date_naissance", label: "Date de naissance", type: "date" }, { id: "nas", label: "NAS" }] },
    administrateurs: { addLabel: "+ Ajouter un administrateur", fields: [{ id: "nom", label: "Nom" }, { id: "titre", label: "Titre" }] },
    actionnaires: { addLabel: "+ Ajouter un actionnaire", fields: [{ id: "nom", label: "Nom" }, { id: "pourcentage", label: "% de détention", type: "number" }, { id: "categorie", label: "Catégorie d’actions" }] },
    composition_ca: { addLabel: "+ Ajouter un membre", fields: [{ id: "nom", label: "Nom" }, { id: "titre", label: "Titre" }] },
};
const makeUuid = () => {
    if (globalThis.crypto?.randomUUID)
        return globalThis.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = Math.floor(Math.random() * 16);
        const value = char === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
};
const TYPE_CLIENT_LABELS = {
    particulier: "Particulier",
    travailleur_autonome: "Travailleur autonome",
    societe: "Société",
    osbl: "OSBL",
    succession: "Succession",
};
const sanitizeFileName = (name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "document";
const cleanFormData = (formData) => Object.fromEntries(Object.entries(formData).filter(([key]) => !key.startsWith("_")));
const buildFileSummary = (files) => Object.fromEntries(Object.entries(files).filter(([, file]) => Boolean(file)).map(([field, file]) => [field, {
    name: file.name,
    type: file.type,
    size: file.size,
}]));
async function uploadSubmissionDocuments(supabase, submissionId, files) {
    const documents = [];
    for (const [field, file] of Object.entries(files)) {
        if (!file)
            continue;
        const path = `${submissionId}/${field}-${Date.now()}-${sanitizeFileName(file.name)}`;
        const { data, error } = await supabase.storage.from(intakeFilesBucket).upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
        });
        if (error)
            throw error;
        documents.push({
            submission_id: submissionId,
            document_type: field,
            original_filename: file.name,
            storage_path: data.path,
            mime_type: file.type || null,
            file_size: file.size || null,
            status: "Reçu",
        });
    }
    if (documents.length > 0) {
        const { error } = await supabase.from(intakeDocumentsTable).insert(documents);
        if (error)
            throw error;
    }
    return documents;
}
export default function IntakePage() {
    const [data, setData] = useState({ date_ouverture: new Date().toISOString().slice(0, 10) });
    const [files, setFiles] = useState({});
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [repeats, setRepeats] = useState({ personnes_charge: [], administrateurs: [], actionnaires: [], composition_ca: [] });
    const progress = useMemo(() => Math.round((currentStep / (steps.length - 1)) * 100), [currentStep]);
    const setValue = (id, value) => {
        setData((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: false, adresse_civique: false }));
    };
    const setFile = (id, file) => {
        setFiles((prev) => ({ ...prev, [id]: file }));
        setErrors((prev) => ({ ...prev, [id]: false }));
    };
    const isFileField = (id) => ["piece_identite", "lettre_mission", "certificat_deces", "lettres_patentes"].includes(id);
    const getRequiredFieldsForStep = (stepIdx) => {
        const type = data.type_client;
        const req = [];
        if (stepIdx === 0) {
            req.push("type_client", "nom_legal", "telephone", "courriel", "langue", "piece_identite", "date_ouverture");
            if (type && type !== "particulier")
                req.push("contact_principal");
        }
        if (stepIdx === 1) {
            if (type === "particulier" || type === "travailleur_autonome") {
                req.push("nas", "date_naissance", "etat_civil");
                if (type === "travailleur_autonome")
                    req.push("activite_nature", "activite_date_debut", "inscrit_taxes");
            }
            if (type === "societe")
                req.push("ne_federal", "neq_societe", "fin_exercice");
            if (type === "osbl")
                req.push("lettres_patentes", "neq_osbl", "osbl_activites");
            if (type === "succession")
                req.push("certificat_deces", "date_deces", "nas_defunt");
        }
        if (stepIdx === 3)
            req.push("autorisation_arc", "procuration_mr69", "lettre_mission", "consentement", "verif_identite");
        if (stepIdx === 4)
            req.push("services_demandes", "frequence");
        return req;
    };
    const validateStep = (stepIdx) => {
        const required = getRequiredFieldsForStep(stepIdx);
        const nextErrors = {};
        let valid = true;
        required.forEach((id) => {
            let value = isFileField(id) ? files[id] : data[id];
            if (id === "services_demandes")
                value = Array.isArray(data[id]) && data[id].length > 0 ? "ok" : "";
            const empty = value === undefined || value === null || value === "" || value === false;
            if (empty) {
                nextErrors[id] = true;
                valid = false;
            }
        });
        if (stepIdx === 0 && (!data.adresse_civique_rue || !data.adresse_civique_ville || !data.adresse_civique_cp)) {
            nextErrors.adresse_civique = true;
            valid = false;
        }
        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return valid;
    };
    const goNext = () => {
        if (currentStep < steps.length - 1) {
            if (!validateStep(currentStep))
                return;
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        submitToSupabase();
    };
    const submitToSupabase = async () => {
        if (!validateStep(currentStep) || submitting)
            return;
        setSubmitting(true);
        setSubmitError("");
        try {
            const supabase = getSupabaseClient();
            const submissionId = makeUuid();
            const formData = cleanFormData(data);
            const fileSummary = buildFileSummary(files);
            const payload = {
                id: submissionId,
                type_client: TYPE_CLIENT_LABELS[formData.type_client] || formData.type_client,
                nom_legal: formData.nom_legal,
                nom_commercial: formData.nom_commercial || null,
                courriel: formData.courriel,
                telephone: formData.telephone,
                langue: formData.langue || null,
                contact_principal: formData.contact_principal || null,
                date_ouverture: formData.date_ouverture || null,
                status: "Nouveau",
                payload: {
                    form_data: formData,
                    repeat_data: repeats,
                    files: fileSummary,
                    submitted_at: new Date().toISOString(),
                },
                user_agent: navigator.userAgent || null,
            };
            const { error } = await supabase.from(intakeTable).insert(payload);
            if (error)
                throw error;
            await uploadSubmissionDocuments(supabase, submissionId, files);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        catch (error) {
            setSubmitError(error.message || "Une erreur est survenue pendant l’envoi du dossier.");
        }
        finally {
            setSubmitting(false);
        }
    };
    const goPrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    const goToStep = (index) => {
        if (index <= currentStep || validateStep(currentStep)) {
            setCurrentStep(index);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    const addRepeatRow = (key) => setRepeats((prev) => ({ ...prev, [key]: [...prev[key], {}] }));
    const removeRepeatRow = (key, index) => setRepeats((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
    const updateRepeatRow = (key, index, field, value) => setRepeats((prev) => ({ ...prev, [key]: prev[key].map((row, i) => (i === index ? { ...row, [field]: value } : row)) }));
    const current = steps[currentStep];
    return (<div className="ma-form-theme flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.22),transparent_32%),linear-gradient(180deg,#ffffff_0%,#FAF8F5_100%)] text-ma-text lg:flex-row">
      <aside className="relative h-auto w-full shrink-0 overflow-y-auto border-r border-ma-separator bg-linear-to-b from-ma-primary to-ma-primary-dark p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-75 lg:p-9">
        <Link to="/" className="mb-1 block text-2xl font-extrabold">Martine Adam CPA</Link>
        <div className="mb-10 text-[11px] uppercase tracking-[0.16em] text-white/80">Ouverture de dossier client</div>
        <ul className="flex flex-wrap gap-0 lg:block">
          {steps.map((step, index) => {
            const active = index === currentStep;
            const done = index < currentStep;
            return (<li key={step.num} onClick={() => goToStep(index)} className={["flex cursor-pointer items-start gap-3 border-white/20 py-2 pr-4 transition lg:border-b lg:py-4 lg:pr-0", active || done ? "opacity-100" : "opacity-55 hover:opacity-90"].join(" ")}>
                <div className="w-8 shrink-0 font-mono text-xs text-white/85">{step.num}{done && <span className="ml-1">✓</span>}</div>
                <div><div className="text-sm font-bold">{step.label}</div><div className="hidden text-xs text-white/60 lg:block">{step.desc}</div></div>
              </li>);
        })}
        </ul>
        <div className="mt-12 hidden border-t border-white/20 pt-5 text-xs leading-7 text-white/60 lg:block">Vos renseignements sont transmis de façon sécurisée et traités conformément à nos obligations de confidentialité professionnelle.</div>
      </aside>

      <main className="flex flex-1 justify-center px-4 py-8 lg:px-10 lg:py-14">
        <div className="w-full max-w-180 rounded-[22px] border border-ma-separator/55 bg-white/80 p-5 shadow-[0_18px_45px_rgba(30,58,47,0.08)] backdrop-blur lg:p-9">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-ma-separator/45"><div className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-ma-primary to-ma-primary-dark transition-all" style={{ width: `${progress}%` }}/></div>
            <div className="whitespace-nowrap font-mono text-xs text-ma-muted">Étape {currentStep + 1} / {steps.length}</div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} noValidate>
            {!submitted && <><div className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-ma-primary">{current.num} — {current.label}</div><h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-ma-text">{current.title}</h1><p className="mb-9 mt-3 max-w-2xl text-[15px] leading-7 text-ma-muted">{current.intro}</p></>}
            {submitted ? <SubmittedMessage /> : <>
              {currentStep === 0 && <Step1 data={data} files={files} errors={errors} setValue={setValue} setFile={setFile}/>}
              {currentStep === 1 && <Step2 data={data} files={files} errors={errors} repeats={repeats} setValue={setValue} setFile={setFile} addRepeatRow={addRepeatRow} removeRepeatRow={removeRepeatRow} updateRepeatRow={updateRepeatRow}/>}
              {currentStep === 2 && <Step3 data={data} files={files} errors={errors} setValue={setValue} setFile={setFile}/>}
              {currentStep === 3 && <Step4 data={data} files={files} errors={errors} setValue={setValue} setFile={setFile}/>}
              {currentStep === 4 && <Step5 data={data} errors={errors} setValue={setValue}/>}
              {currentStep === 5 && <Step6 data={data} files={files}/>}
              {submitError && <div className="mt-8 rounded-[10px] border border-ma-danger/40 bg-ma-danger/10 px-4 py-3 text-sm font-bold text-ma-danger">{submitError}</div>}
              <div className="mt-12 flex items-center justify-between border-t border-ma-separator/60 pt-6">
                <button type="button" onClick={goPrev} className="rounded-full border border-ma-separator/80 bg-white px-6 py-3 text-sm font-extrabold text-ma-muted hover:border-ma-primary hover:text-ma-primary" style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}>← Précédent</button>
                <button type="button" onClick={goNext} disabled={submitting} className="rounded-full bg-ma-primary px-7 py-3 text-sm font-extrabold text-white hover:bg-ma-primary-dark disabled:cursor-not-allowed disabled:opacity-65">{submitting ? "Envoi en cours..." : currentStep === steps.length - 1 ? "Envoyer le dossier" : "Continuer →"}</button>
              </div>
            </>}
          </form>
        </div>
      </main>
    </div>);
}
function fieldBase(error) { return ["w-full rounded-[10px] border bg-white px-3.5 py-3 text-[14.5px] text-ma-text outline-none transition", error ? "border-ma-danger" : "border-ma-separator/75 focus:border-ma-primary focus:ring-4 focus:ring-ma-primary/15"].join(" "); }
function FieldGroup({ id, label, required, error, note, children }) {
    return <div className="mb-6"><label htmlFor={id} className="mb-2 block text-sm font-bold text-ma-text">{label}{required && <span className="ml-0.5 text-ma-danger">*</span>}</label>{children}{note && <div className="mt-1.5 text-xs text-ma-muted">{note}</div>}{error && <div className="mt-1.5 text-xs text-ma-danger">Ce champ est requis.</div>}</div>;
}
function TextField({ id, label, required, type = "text", placeholder, note, data, errors, setValue }) {
    return <FieldGroup id={id} label={label} required={required} error={errors[id]} note={note}><input id={id} type={type} value={data[id] || ""} placeholder={placeholder} className={fieldBase(errors[id])} onChange={(e) => setValue(id, e.target.value)}/></FieldGroup>;
}
function TextAreaField({ id, label, required, note, maxLength, data, errors, setValue }) {
    return <FieldGroup id={id} label={label} required={required} error={errors[id]} note={note}><textarea id={id} value={data[id] || ""} maxLength={maxLength} className={`${fieldBase(errors[id])} min-h-24 resize-y`} onChange={(e) => setValue(id, e.target.value)}/></FieldGroup>;
}
function SelectField({ id, label, required, list, note, data, errors, setValue }) {
    return <FieldGroup id={id} label={label} required={required} error={errors[id]} note={note}><select id={id} value={data[id] || ""} className={fieldBase(errors[id])} onChange={(e) => setValue(id, e.target.value)}><option value="">— Sélectionner —</option>{list.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select></FieldGroup>;
}
function PillGroup({ id, label, required, list, multi = false, note, data, errors, setValue }) {
    const selected = data[id] || (multi ? [] : "");
    const toggle = (value) => {
        if (multi) {
            const arr = Array.isArray(selected) ? selected : [];
            setValue(id, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
            return;
        }
        setValue(id, value);
    };
    return <div className="mb-6"><label className="mb-2 block text-sm font-bold text-ma-text">{label}{required && <span className="ml-0.5 text-ma-danger">*</span>}</label><div className="flex flex-wrap gap-2.5">{list.map((o) => { const checked = multi ? selected.includes(o.v) : selected === o.v; return <button key={o.v} type="button" onClick={() => toggle(o.v)} className={["rounded-full border px-4 py-2.5 text-sm transition", checked ? "border-ma-primary bg-ma-primary font-bold text-white" : "border-ma-separator/75 bg-white text-ma-text hover:border-ma-primary hover:bg-ma-bg"].join(" ")}>{o.l}</button>; })}</div>{note && <div className="mt-1.5 text-xs text-ma-muted">{note}</div>}{errors[id] && <div className="mt-1.5 text-xs text-ma-danger">Veuillez faire un choix.</div>}</div>;
}
function CheckboxField({ id, label, required, data, errors, setValue }) {
    return <div className="mb-6"><label className="flex items-start gap-2.5 text-sm font-medium text-ma-text"><input id={id} type="checkbox" checked={Boolean(data[id])} className="mt-1 h-4 w-4 accent-ma-primary" onChange={(e) => setValue(id, e.target.checked)}/><span>{label}{required && <span className="ml-0.5 text-ma-danger">*</span>}</span></label>{errors[id] && <div className="mt-1.5 text-xs text-ma-danger">Cette case doit être cochée.</div>}</div>;
}
function UploadField({ id, label, required, spec, files, errors, setFile }) {
    const file = files[id];
    return <div className="mb-6"><label className="mb-2 block text-sm font-bold text-ma-text">{label}{required && <span className="ml-0.5 text-ma-danger">*</span>}</label><label htmlFor={id} className={["block cursor-pointer rounded-[10px] border-2 p-6 text-center transition hover:-translate-y-0.5", file ? "border-ma-primary bg-ma-primary/10" : "border-dashed border-ma-separator/85 bg-white hover:border-ma-primary hover:bg-ma-bg"].join(" ")}><div className="mb-1 text-lg">{file ? "📎" : "⬆"}</div><div className={file ? "text-sm font-extrabold text-ma-primary" : "text-sm text-ma-muted"}>{file ? file.name : "Cliquer pour téléverser ou glisser un fichier"}</div><div className="mt-1.5 text-xs text-ma-muted">{spec}</div></label><input id={id} type="file" className="hidden" onChange={(e) => setFile(id, e.target.files?.[0] || null)}/>{errors[id] && <div className="mt-1.5 text-xs text-ma-danger">Ce document est requis.</div>}</div>;
}
function Section({ title, children }) {
    return <fieldset className="mb-7"><legend className="mb-5 w-full border-b border-ma-separator/65 pb-2 text-xl font-extrabold text-ma-text">{title}</legend>{children}</fieldset>;
}
function RepeatBlock({ repeatKey, rows, addRepeatRow, removeRepeatRow, updateRepeatRow }) {
    const config = repeatConfigs[repeatKey];
    return <>{rows.length === 0 && <p className="mb-3 text-sm text-ma-muted">Aucune entrée pour le moment.</p>}{rows.map((row, index) => <div className="relative mb-3 rounded-2xl border border-ma-separator/60 bg-white p-5 shadow-[0_10px_24px_rgba(30,58,47,0.05)]" key={index}><button type="button" className="absolute right-4 top-4 text-xs text-ma-muted hover:text-ma-danger" onClick={() => removeRepeatRow(repeatKey, index)}>Retirer ✕</button><div className="grid gap-4 pt-4 md:grid-cols-3">{config.fields.map((field) => <div key={field.id}><label className="mb-2 block text-sm font-bold">{field.label}</label><input type={field.type || "text"} value={row[field.id] || ""} className={fieldBase(false)} onChange={(e) => updateRepeatRow(repeatKey, index, field.id, e.target.value)}/></div>)}</div></div>)}<button type="button" className="rounded-full border border-dashed border-ma-primary bg-white px-4 py-2.5 text-sm font-extrabold text-ma-primary hover:bg-ma-bg" onClick={() => addRepeatRow(repeatKey)}>{config.addLabel}</button></>;
}
function Step1({ data, files, errors, setValue, setFile }) {
    const isParticulier = data.type_client === "particulier";
    return <><SelectField id="type_client" label="Type de client" required list={L_TYPE_CLIENT} note="Détermine les renseignements demandés aux étapes suivantes." data={data} errors={errors} setValue={setValue}/><TextField id="nom_legal" label="Nom légal complet" required placeholder="Ex. : Jean Tremblay ou 9876-5432 Québec inc." data={data} errors={errors} setValue={setValue}/><TextField id="nom_commercial" label="Nom commercial, si différent" data={data} errors={errors} setValue={setValue}/>
  <div className="mb-6"><label className="mb-2 block text-sm font-bold">Adresse civique<span className="ml-0.5 text-ma-danger">*</span></label><input type="text" placeholder="Numéro et rue" value={data.adresse_civique_rue || ""} className={fieldBase(errors.adresse_civique)} onChange={(e) => setValue("adresse_civique_rue", e.target.value)}/><div className="mt-3 grid gap-3 md:grid-cols-3"><input type="text" placeholder="Ville" value={data.adresse_civique_ville || ""} className={fieldBase(errors.adresse_civique)} onChange={(e) => setValue("adresse_civique_ville", e.target.value)}/><input type="text" placeholder="Province" value={data.adresse_civique_province || ""} className={fieldBase(errors.adresse_civique)} onChange={(e) => setValue("adresse_civique_province", e.target.value)}/><input type="text" placeholder="Code postal" value={data.adresse_civique_cp || ""} className={fieldBase(errors.adresse_civique)} onChange={(e) => setValue("adresse_civique_cp", e.target.value)}/></div>{errors.adresse_civique && <div className="mt-1.5 text-xs text-ma-danger">Veuillez compléter l’adresse.</div>}</div>
  <div className="mb-6"><label className="flex items-start gap-2.5 text-sm font-medium"><input type="checkbox" checked={Boolean(data._togglePostale)} className="mt-1 h-4 w-4 accent-ma-primary" onChange={(e) => setValue("_togglePostale", e.target.checked)}/><span>L’adresse postale diffère de l’adresse civique</span></label>{data._togglePostale && <div className="mt-4"><TextField id="adresse_postale" label="Adresse postale" placeholder="Numéro, rue, ville, province, code postal" data={data} errors={errors} setValue={setValue}/></div>}</div>
  <div className="grid gap-5 md:grid-cols-2"><TextField id="telephone" label="Téléphone" required type="tel" placeholder="(000) 000-0000" data={data} errors={errors} setValue={setValue}/><TextField id="courriel" label="Courriel" required type="email" placeholder="nom@exemple.com" data={data} errors={errors} setValue={setValue}/></div>{!isParticulier && data.type_client && <TextField id="contact_principal" label="Personne-ressource principale" required placeholder="Nom de la personne à contacter" data={data} errors={errors} setValue={setValue}/>}<div className="grid gap-5 md:grid-cols-2"><SelectField id="langue" label="Langue de correspondance" required list={L_LANGUE} data={data} errors={errors} setValue={setValue}/><TextField id="refere_par" label="Référé par" placeholder="Nom de la personne ou de l’entreprise" data={data} errors={errors} setValue={setValue}/></div><UploadField id="piece_identite" label="Pièce d’identité" required spec="PDF, JPG ou PNG — 10 Mo max" files={files} errors={errors} setFile={setFile}/><TextField id="date_ouverture" label="Date d’ouverture du dossier" required type="date" data={data} errors={errors} setValue={setValue}/></>;
}
function Step2(props) {
    const { data, files, errors, repeats, setValue, setFile, addRepeatRow, removeRepeatRow, updateRepeatRow } = props;
    const type = data.type_client;
    if (!type)
        return <p className="text-sm text-ma-muted">Veuillez d’abord sélectionner un type de client à l’étape 1.</p>;
    const isPerson = type === "particulier" || type === "travailleur_autonome";
    const isCouple = data.etat_civil === "marie" || data.etat_civil === "conjoint_fait";
    return <>{isPerson && <><Section title="Renseignements personnels"><TextField id="nas" label="NAS" required placeholder="000 000 000" note="Numéro à 9 chiffres — donnée chiffrée au repos." data={data} errors={errors} setValue={setValue}/><TextField id="date_naissance" label="Date de naissance" required type="date" data={data} errors={errors} setValue={setValue}/><SelectField id="etat_civil" label="État civil" required list={L_ETAT_CIVIL} data={data} errors={errors} setValue={setValue}/><TextField id="date_chgmt_etat_civil" label="Date du changement d’état civil" type="date" note="À remplir si votre état civil a changé récemment." data={data} errors={errors} setValue={setValue}/>{isCouple && <div className="grid gap-5 md:grid-cols-2"><TextField id="conjoint_nom" label="Nom du conjoint" data={data} errors={errors} setValue={setValue}/><TextField id="conjoint_nas" label="NAS du conjoint" placeholder="000 000 000" note="Donnée chiffrée au repos." data={data} errors={errors} setValue={setValue}/></div>}</Section><Section title="Personnes à charge"><RepeatBlock repeatKey="personnes_charge" rows={repeats.personnes_charge} addRepeatRow={addRepeatRow} removeRepeatRow={removeRepeatRow} updateRepeatRow={updateRepeatRow}/></Section></>}
  {type === "travailleur_autonome" && <Section title="Activité autonome"><TextAreaField id="activite_nature" label="Nature de l’activité autonome" required note="Max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/><TextField id="activite_date_debut" label="Date de début des activités" required type="date" data={data} errors={errors} setValue={setValue}/><TextField id="neq" label="NEQ, si enregistré" placeholder="10 chiffres" data={data} errors={errors} setValue={setValue}/><PillGroup id="inscrit_taxes" label="Inscrit aux TPS/TVQ" required list={L_OUI_NON} data={data} errors={errors} setValue={setValue}/>{data.inscrit_taxes === "oui" && <TextField id="num_taxes" label="Numéros TPS/TVQ" placeholder="NE + RT / numéro TQ" data={data} errors={errors} setValue={setValue}/>}</Section>}
  {type === "societe" && <><Section title="Numéros d’entreprise"><div className="grid gap-5 md:grid-cols-2"><TextField id="ne_federal" label="Numéro d’entreprise fédéral, NE" required placeholder="9 chiffres" data={data} errors={errors} setValue={setValue}/><TextField id="neq_societe" label="NEQ, Québec" required placeholder="10 chiffres" data={data} errors={errors} setValue={setValue}/></div><div className="grid gap-5 md:grid-cols-2"><TextField id="compte_rc" label="Compte impôt société, RC" placeholder="NE + RC + 4 chiffres" data={data} errors={errors} setValue={setValue}/><TextField id="compte_taxes_soc" label="Comptes TPS / TVQ, RT / TQ" data={data} errors={errors} setValue={setValue}/></div><div className="grid gap-5 md:grid-cols-2"><TextField id="compte_rp" label="Compte retenues à la source, RP" placeholder="NE + RP + 4 chiffres" data={data} errors={errors} setValue={setValue}/><TextField id="fin_exercice" label="Date de fin d’exercice" required placeholder="MM-JJ" data={data} errors={errors} setValue={setValue}/></div></Section><Section title="Documents constitutifs"><UploadField id="statuts_constitution" label="Statuts de constitution" spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="convention_actionnaires" label="Convention entre actionnaires" spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="proces_verbaux" label="Procès-verbaux / résolutions récents" spec="PDF — 25 Mo max" files={files} errors={errors} setFile={setFile}/></Section><Section title="Administrateurs"><RepeatBlock repeatKey="administrateurs" rows={repeats.administrateurs} addRepeatRow={addRepeatRow} removeRepeatRow={removeRepeatRow} updateRepeatRow={updateRepeatRow}/></Section><Section title="Actionnaires et % de détention"><RepeatBlock repeatKey="actionnaires" rows={repeats.actionnaires} addRepeatRow={addRepeatRow} removeRepeatRow={removeRepeatRow} updateRepeatRow={updateRepeatRow}/><div className="mt-2 text-xs text-ma-muted">Le total des pourcentages devrait égaler 100 %.</div></Section><Section title="Structure corporative"><TextAreaField id="societes_liees" label="Sociétés liées / associées" note="Max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/><PillGroup id="req_a_jour" label="Rapport annuel REQ à jour" list={L_OUI_NON} data={data} errors={errors} setValue={setValue}/></Section></>}
  {type === "osbl" && <><Section title="Constitution"><UploadField id="lettres_patentes" label="Lettres patentes / constitution" required spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="reglements_generaux" label="Règlements généraux" spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><div className="grid gap-5 md:grid-cols-2"><TextField id="neq_osbl" label="NEQ" required placeholder="10 chiffres" data={data} errors={errors} setValue={setValue}/><TextField id="num_bienfaisance" label="Numéro d’organisme de bienfaisance, RR" placeholder="NE + RR + 4 chiffres" data={data} errors={errors} setValue={setValue}/></div></Section><Section title="Conseil d’administration"><RepeatBlock repeatKey="composition_ca" rows={repeats.composition_ca} addRepeatRow={addRepeatRow} removeRepeatRow={removeRepeatRow} updateRepeatRow={updateRepeatRow}/></Section><Section title="Activités et financement"><TextAreaField id="osbl_activites" label="Nature des activités" required note="Max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/><TextAreaField id="sources_financement" label="Sources de financement" note="Subventions, dons, cotisations — max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/><UploadField id="etats_budget_osbl" label="États financiers / budget approuvé" spec="PDF ou Excel — 25 Mo max" files={files} errors={errors} setFile={setFile}/></Section></>}
  {type === "succession" && <><Section title="Renseignements sur le décès"><UploadField id="certificat_deces" label="Certificat de décès" required spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><TextField id="date_deces" label="Date de décès" required type="date" data={data} errors={errors} setValue={setValue}/><div className="grid gap-5 md:grid-cols-2"><TextField id="nas_defunt" label="NAS du défunt" required placeholder="000 000 000" note="Donnée chiffrée au repos." data={data} errors={errors} setValue={setValue}/><TextField id="nas_succession" label="NAS de la succession" placeholder="Format compte de fiducie" data={data} errors={errors} setValue={setValue}/></div></Section><Section title="Documents de succession"><UploadField id="testament" label="Testament" spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="liquidateur_doc" label="Lettres de vérification / liquidateur" spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="inventaire_succession" label="Inventaire des biens et dettes" spec="PDF ou Excel — 25 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="declarations_defunt" label="Déclarations antérieures du défunt" spec="PDF — 25 Mo max" files={files} errors={errors} setFile={setFile}/></Section></>}
  </>;
}
function Step3({ data, files, errors, setValue, setFile }) { return <><Section title="Historique"><UploadField id="declarations_anterieures" label="Déclarations de revenus antérieures, 2-3 ans" spec="T1/TP-1 ou T2/CO-17 — PDF, 50 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="etats_financiers_ant" label="États financiers antérieurs" spec="PDF ou Excel — 50 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="avis_cotisation" label="Avis de cotisation récents" spec="Fédéral et provincial — PDF, 25 Mo max" files={files} errors={errors} setFile={setFile}/><TextAreaField id="soldes_fisc" label="Soldes ARC / Revenu Québec" note="Acomptes, soldes dus, crédits — max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/></Section><Section title="Système comptable actuel"><SelectField id="logiciel_actuel" label="Logiciel comptable actuel" list={L_LOGICIEL} data={data} errors={errors} setValue={setValue}/><UploadField id="fichier_comptable" label="Fichier comptable actuel" spec="Sauvegarde QBO/Sage/Excel — 100 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="releves_bancaires" label="Conciliations bancaires / relevés" spec="PDF ou CSV — 50 Mo max" files={files} errors={errors} setFile={setFile}/><UploadField id="registre_immo" label="Registre des immobilisations, DPA" spec="Tableau d’amortissement — Excel/PDF, 25 Mo max" files={files} errors={errors} setFile={setFile}/><TextField id="inventaire_fin_exercice" label="Inventaire de fin d’exercice" placeholder="S’il y a lieu" data={data} errors={errors} setValue={setValue}/></Section><Section title="Transfert de dossier"><TextAreaField id="comptable_precedent" label="Coordonnées du comptable précédent" note="Nom, cabinet, courriel, téléphone" data={data} errors={errors} setValue={setValue}/></Section></>; }
function Step4({ data, files, errors, setValue, setFile }) { return <><Section title="Autorisations fiscales"><SelectField id="autorisation_arc" label="Autorisation ARC, Représenter un client" required list={L_STATUT_AUTORISATION} data={data} errors={errors} setValue={setValue}/><SelectField id="procuration_mr69" label="Procuration Revenu Québec, MR-69" required list={L_STATUT_AUTORISATION} note="Joindre le MR-69 signé si déjà complété." data={data} errors={errors} setValue={setValue}/><PillGroup id="acces_qbo" label="Accès QBO accordé au cabinet" list={L_OUI_NON_SO} note="Invitation comptable" data={data} errors={errors} setValue={setValue}/></Section><Section title="Renseignements sensibles"><TextField id="depot_direct" label="Renseignements de dépôt direct" placeholder="Au besoin seulement" note="Transmis de façon sécurisée." data={data} errors={errors} setValue={setValue}/></Section><Section title="Mandat et consentements"><UploadField id="lettre_mission" label="Lettre de mission signée" required spec="PDF — 10 Mo max" files={files} errors={errors} setFile={setFile}/><CheckboxField id="consentement" label="Je consens à la collecte de mes renseignements personnels conformément à la politique de confidentialité du cabinet." required data={data} errors={errors} setValue={setValue}/><CheckboxField id="verif_identite" label="Je confirme que la vérification d’identité a été complétée." required data={data} errors={errors} setValue={setValue}/></Section></>; }
function Step5({ data, errors, setValue }) { return <><PillGroup id="services_demandes" label="Services demandés" required list={L_SERVICES} multi data={data} errors={errors} setValue={setValue}/><SelectField id="frequence" label="Fréquence souhaitée" required list={L_FREQUENCE} data={data} errors={errors} setValue={setValue}/><TextAreaField id="echeances" label="Échéances critiques connues" note="Fin d’exercice, dépôts en retard, financement — max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/><TextAreaField id="logiciels_en_place" label="Logiciels et systèmes en place" note="Max. 300 caractères" maxLength={300} data={data} errors={errors} setValue={setValue}/><SelectField id="volume_transactions" label="Volume approximatif de transactions" list={L_VOLUME} data={data} errors={errors} setValue={setValue}/><TextField id="nb_employes" label="Nombre d’employés" type="number" placeholder="0" note="Pertinent pour la paie." data={data} errors={errors} setValue={setValue}/><TextAreaField id="attentes_communication" label="Attentes de communication et délais" note="Max. 500 caractères" maxLength={500} data={data} errors={errors} setValue={setValue}/><TextField id="budget" label="Budget / attentes tarifaires" data={data} errors={errors} setValue={setValue}/><TextAreaField id="enjeux" label="Enjeux particuliers" note="Litige fiscal, redressement, restructuration — max. 1000 caractères" maxLength={1000} data={data} errors={errors} setValue={setValue}/></>; }
function Step6({ data, files }) { const typeLabel = L_TYPE_CLIENT.find((item) => item.v === data.type_client)?.l || "—"; const services = Array.isArray(data.services_demandes) && data.services_demandes.length ? data.services_demandes.map((v) => L_SERVICES.find((s) => s.v === v)?.l).filter(Boolean).join(", ") : "—"; const frequence = L_FREQUENCE.find((item) => item.v === data.frequence)?.l || "—"; return <div><div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-ma-primary/10 text-2xl text-ma-primary">✓</div><p className="max-w-xl text-[15px] leading-7 text-ma-muted">Voici un résumé des principaux renseignements fournis. Vérifiez-les avant l’envoi du dossier au cabinet.</p><div className="mt-6 rounded-2xl border border-ma-separator/60 bg-white p-6 shadow-[0_12px_28px_rgba(30,58,47,0.05)]"><SummaryRow label="Type de client" value={typeLabel}/><SummaryRow label="Nom légal" value={data.nom_legal || "—"}/><SummaryRow label="Courriel" value={data.courriel || "—"}/><SummaryRow label="Téléphone" value={data.telephone || "—"}/><SummaryRow label="Services demandés" value={services}/><SummaryRow label="Fréquence souhaitée" value={frequence}/><SummaryRow label="Pièce d’identité" value={files.piece_identite?.name || "Non téléversée"}/><SummaryRow label="Lettre de mission" value={files.lettre_mission?.name || "Non téléversée"}/></div></div>; }
function SummaryRow({ label, value }) { return <div className="flex justify-between gap-6 border-b border-ma-separator/45 py-2.5 text-sm last:border-b-0"><span className="text-ma-muted">{label}</span><span className="max-w-[60%] text-right font-extrabold text-ma-text">{value}</span></div>; }
function SubmittedMessage() { return <div><div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-ma-primary/10 text-2xl text-ma-primary">✓</div><h1 className="text-4xl font-extrabold tracking-[-0.04em] text-ma-text">Dossier envoyé</h1><p className="mt-4 max-w-xl text-[15px] leading-7 text-ma-muted">Merci. Votre dossier a été transmis au cabinet. Un membre de l’équipe communiquera avec vous sous peu pour les prochaines étapes.</p><Link to="/" className="mt-8 inline-flex rounded-full bg-ma-primary px-6 py-3 text-sm font-extrabold text-white hover:bg-ma-primary-dark">Retour à l’accueil</Link></div>; }
