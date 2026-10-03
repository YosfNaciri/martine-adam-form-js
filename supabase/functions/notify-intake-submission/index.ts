import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Méthode non autorisée." }, 405);
  }

  try {
    const supabaseUrl = getRequiredEnv("SUPABASE_URL");
    const supabaseAnonKey = getRequiredEnv("SUPABASE_ANON_KEY");
    const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = getRequiredEnv("RESEND_API_KEY");
    const adminEmail = getRequiredEnv("ADMIN_EMAIL");
    const fromEmail = getRequiredEnv("FROM_EMAIL");

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse({ error: "Non authentifié." }, 401);
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ error: "Session invalide." }, 401);
    }

    let requestBody: { submissionId?: string };
    try {
      requestBody = await req.json();
    } catch {
      return jsonResponse({ error: "Corps JSON invalide." }, 400);
    }

    const submissionId = requestBody.submissionId?.trim();
    if (!submissionId) {
      return jsonResponse({ error: "submissionId manquant." }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: submission, error: submissionError } = await adminClient
      .from("client_intake_submissions")
      .select("*")
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .single();

    if (submissionError || !submission) {
      return jsonResponse({ error: "Soumission introuvable." }, 404);
    }

    const { data: documents, error: documentsError } = await adminClient
      .from("client_intake_documents")
      .select("original_filename, document_type")
      .eq("submission_id", submissionId)
      .order("uploaded_at", { ascending: true });

    if (documentsError) {
      throw new Error(`Lecture des documents impossible: ${documentsError.message}`);
    }

    const payload = isRecord(submission.payload) ? submission.payload : {};
    const formData = isRecord(payload.form_data) ? payload.form_data : {};
    const authenticatedUser = isRecord(payload.authenticated_user)
      ? payload.authenticated_user
      : {};

    const clientName = firstString(
      submission.nom_legal,
      formData.nom_legal,
      submission.nom_complet,
      formData.fullName,
      formData.nom,
    ) || "Client";
    const clientEmail = firstString(
      submission.courriel,
      submission.email,
      formData.courriel,
      authenticatedUser.email,
      user.email,
    );
    const submittedAt = firstString(
      payload.submitted_at,
      submission.submitted_at,
      submission.created_at,
    ) || new Date().toISOString();

    const fileListHtml = (documents || [])
      .map((document) => {
        const name = firstString(
          document.original_filename,
          document.document_type,
        ) || "Document";
        return `<li>${escapeHtml(name)}</li>`;
      })
      .join("");

    const resend = new Resend(resendApiKey);
    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "Nouvelle ouverture de dossier - Martine Adam CPA",
      html: `
        <h2>Nouvelle ouverture de dossier</h2>
        <p><strong>Client :</strong> ${escapeHtml(clientName)}</p>
        <p><strong>Email :</strong> ${escapeHtml(clientEmail || "Non fourni")}</p>
        <p><strong>Date :</strong> ${escapeHtml(submittedAt)}</p>
        <h3>Fichiers reçus</h3>
        <ul>${fileListHtml || "<li>Aucun fichier</li>"}</ul>
        <p>La soumission est disponible dans Supabase.</p>
        <p>ID de soumission : ${escapeHtml(submission.id)}</p>
      `,
    });

    if (adminResult.error) {
      throw new Error(`Email administrateur non envoyé: ${adminResult.error.message}`);
    }

    if (clientEmail) {
      const clientResult = await resend.emails.send({
        from: fromEmail,
        to: clientEmail,
        subject: "Confirmation de réception - Ouverture de dossier",
        html: `
          <p>Bonjour ${escapeHtml(clientName)},</p>
          <p>Nous confirmons la bonne réception de votre formulaire d’ouverture de dossier.</p>
          <p>Votre dossier sera analysé prochainement. Si des informations complémentaires sont nécessaires, nous reviendrons vers vous.</p>
          <p>Cordialement,<br />Martine Adam CPA</p>
        `,
      });

      if (clientResult.error) {
        throw new Error(`Email client non envoyé: ${clientResult.error.message}`);
      }
    }

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error("notify-intake-submission", error);
    return jsonResponse(
      { error: "Erreur serveur.", details: getErrorMessage(error) },
      500,
    );
  }
});

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Variable d’environnement manquante: ${name}`);
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
