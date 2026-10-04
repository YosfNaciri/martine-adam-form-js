import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const intakeTable =
  import.meta.env.VITE_SUPABASE_INTAKE_TABLE || "client_intake_submissions";

export const intakeDocumentsTable =
  import.meta.env.VITE_SUPABASE_INTAKE_DOCUMENTS_TABLE ||
  "client_intake_documents";

export const intakeFilesBucket =
  import.meta.env.VITE_SUPABASE_INTAKE_BUCKET || "intake-documents";

export const confirmClientTable =
  import.meta.env.VITE_SUPABASE_CONFIRM_CLIENT_TABLE ||
  "client_tax_season_confirmations";

let supabaseClient = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variables Supabase manquantes.");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}
