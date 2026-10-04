export const occupationLabels = {
  employee: "Salarié(e)", "self-employed": "Travailleur autonome",
  retired: "Retraité(e)", student: "Étudiant(e)", unemployed: "Sans emploi",
  "business-owner": "Propriétaire d’entreprise", other: "Autre / plusieurs situations",
};

export const confirmationColumns = "id,created_at,first_name,last_name,is_couple,has_children,children_count,occupation_type,occupation_details,sin_last_three,phone,email,follow_up_preference,wants_tax_service,tax_season";

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

export function confirmationExportRow(row) {
  return {
    "Identifiant": row.id,
    "Date de confirmation": row.created_at,
    "Saison fiscale": row.tax_season,
    "Prénom": row.first_name,
    "Nom": row.last_name,
    "Dossier de couple": yesNo(row.is_couple),
    "Avec enfants": yesNo(row.has_children),
    "Nombre d’enfants": row.has_children ? row.children_count : 0,
    "Occupation / type de client": occupationLabels[row.occupation_type] || row.occupation_type,
    "Précisions": row.occupation_details || "",
    "NAS (3 derniers chiffres)": row.sin_last_three == null ? "" : String(row.sin_last_three).padStart(3, "0"),
    "Téléphone": row.phone,
    "Courriel": row.email,
    "Mode de suivi": ({ paper: "Papier", electronic: "Électronique" })[row.follow_up_preference] || row.follow_up_preference,
    "Prise en charge demandée": yesNo(row.wants_tax_service),
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
