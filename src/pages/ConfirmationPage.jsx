export default function ConfirmationPage() {
  return (
    <main className="ma-form-theme grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.25),transparent_34%),linear-gradient(180deg,#ffffff_0%,#FAF8F5_100%)] px-4 py-12 text-ma-text">
      <section className="w-full max-w-lg rounded-[22px] border border-ma-separator/60 bg-white/90 p-8 text-center shadow-[0_22px_55px_rgba(30,58,47,0.10)] backdrop-blur sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ma-primary/10 text-3xl text-ma-primary">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-ma-text">
          Formulaire envoyé
        </h1>
        <p className="mt-4 leading-7 text-ma-muted">
          Votre formulaire d’ouverture de dossier a bien été transmis. Un email
          de confirmation vous a été envoyé.
        </p>
      </section>
    </main>
  );
}
