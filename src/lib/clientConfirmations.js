export const relationLabels = {
  self: "Moi-même",
  spouse: "Conjoint ou conjointe",
  child: "Enfant",
  parent: "Parent",
  other: "Autre personne déjà cliente",
};

export const prepared2025Labels = {
  yes: "Oui",
  no: "Non",
  unknown: "Je ne sais pas",
};

export const documentMethodLabels = {
  paper: "Papier",
  electronic: "Électroniquement",
  unknown: "Je ne sais pas encore",
  not_applicable: "Non applicable",
};

export const declineScopeLabels = {
  self: "Moi seulement",
  couple: "Moi et mon conjoint ou ma conjointe",
  all: "Toutes les personnes indiquées",
};

export const particularityLabels = {
  self_employed: "Travail autonome",
  rental_income: "Revenus d’immeuble locatif",
  dependent: "Personne à charge / autre situation à signaler",
  none: "Aucune",
  unknown: "Je ne sais pas",
};

export const confirmationColumns = [
  "id",
  "created_at",
  "tax_season",
  "wants_tax_service",
  "decline_scope",
  "respondent_first_name",
  "respondent_last_name",
  "people",
  "total_people",
  "old_clients_count",
  "to_validate_count",
  "is_couple",
  "has_children",
  "children_count",
  "identification_person_name",
  "sin_last_three",
  "particularities",
  "document_method",
  "document_method_note",
  "phone",
  "email",
  "no_email",
  "user_agent",
].join(",");

export async function loadAllConfirmations(client, table) {
  const rows = [];
  // Continue until an empty page, including when the server caps pages below 500.
  for (;;) {
    const { data, error } = await client.from(table).select(confirmationColumns)
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .range(rows.length, rows.length + 499);
    if (error) throw error;
    if (!data?.length) return rows;
    rows.push(...data);
  }
}

const yesNo = (value) => value == null ? "" : value ? "Oui" : "Non";

export function personFullName(person) {
  return `${person?.first_name || ""} ${person?.last_name || ""}`.trim() || "Personne sans nom";
}

export function formatPeopleForDisplay(people = []) {
  if (!Array.isArray(people) || !people.length) return "";
  return people.map((person, index) => {
    const relation = relationLabels[person.relation] || person.relation || "";
    const prepared = prepared2025Labels[person.prepared_2025] || person.prepared_2025 || "Non répondu";
    const sin = person.sin_unknown ? "NAS inconnu" : person.sin_last_three ? `NAS ***${person.sin_last_three}` : "NAS non fourni";
    const contact = person.contact ? `, coordonnées: ${person.contact}` : "";
    return `${index + 1}. ${personFullName(person)} (${relation}) - impôts 2025: ${prepared}, ${sin}${contact}`;
  }).join("\n");
}

export function formatParticularitiesForDisplay(particularities = []) {
  if (!Array.isArray(particularities) || !particularities.length) return "";
  return particularities.map((item) => {
    const label = particularityLabels[item.type] || item.type || "";
    const person = item.person_name ? ` - ${item.person_name}` : "";
    const note = item.note ? `: ${item.note}` : "";
    return `${label}${person}${note}`;
  }).join("\n");
}

export function confirmationExportRow(row) {
  return {
    "Identifiant": row.id,
    "Date de confirmation": row.created_at,
    "Saison fiscale": row.tax_season,
    "Prise en charge demandée": yesNo(row.wants_tax_service),
    "Portée du refus": row.wants_tax_service ? "" : declineScopeLabels[row.decline_scope] || row.decline_scope || "",
    "Prénom du répondant": row.respondent_first_name,
    "Nom du répondant": row.respondent_last_name,
    "Téléphone": row.phone,
    "Courriel": row.no_email ? "Aucun courriel" : row.email,
    "Dossier de couple": yesNo(row.is_couple),
    "Avec enfants": yesNo(row.has_children),
    "Nombre d’enfants": row.children_count || 0,
    "Nombre total de personnes": row.total_people || 0,
    "Anciens clients 2025": row.old_clients_count || 0,
    "Ajouts / à vérifier": row.to_validate_count || 0,
    "Personnes concernées": formatPeopleForDisplay(row.people),
    "Identification NAS appartient à": row.identification_person_name || "",
    "NAS (3 derniers chiffres)": row.sin_last_three == null ? "" : String(row.sin_last_three).padStart(3, "0"),
    "Particularités 2026": formatParticularitiesForDisplay(row.particularities),
    "Remise des documents": documentMethodLabels[row.document_method] || row.document_method || "",
    "Précision remise des documents": row.document_method_note || "",
  };
}

export function createConfirmationsCsv(rows) {
  if (!rows.length) throw new Error("Aucune confirmation à exporter.");
  const headers = Object.keys(rows[0]);
  function cell(value) {
    let text = String(value ?? "");
    // Prevent spreadsheet formula execution in user-provided values.
    if (/^[\s\uFEFF]*[=+@-]|^[\t\r\n]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  }
  return "\uFEFF" + [headers, ...rows.map((row) => headers.map((key) => row[key]))]
    .map((row) => row.map(cell).join(";")).join("\r\n");
}
