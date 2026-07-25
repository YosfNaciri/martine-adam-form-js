import { Link } from "react-router-dom";
import heroImage from "../assets/hero-accounting-office.png";

const services = [
  {
    title: "Fiscalité personnelle",
    text: "Déclarations, optimisation, suivis ARC et Revenu Québec avec une lecture claire de votre situation.",
  },
  {
    title: "Entreprises",
    text: "Tenue de livres, taxes, états financiers et accompagnement pour prendre de meilleures décisions.",
  },
  {
    title: "Travailleurs autonomes",
    text: "Structure, dépenses admissibles, obligations fiscales et organisation comptable simple à maintenir.",
  },
  {
    title: "OSBL et successions",
    text: "Dossiers particuliers traités avec méthode, confidentialité et attention aux exigences spécifiques.",
  },
];

const processSteps = [
  "Ouverture du dossier",
  "Analyse des besoins",
  "Documents et autorisations",
  "Suivi comptable et fiscal",
];

const highlights = [
  ["01", "Accompagnement humain"],
  ["02", "Processus sécurisé"],
  ["03", "Vision claire des priorités"],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] text-ma-text">
      <header className="sticky top-0 z-40 border-b border-white/35 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Martine Adam CPA">
            <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-ma-primary font-extrabold tracking-wider text-white shadow-[0_10px_25px_rgba(36,71,139,0.22)]">
              MA
            </div>

            <div>
              <strong className="block text-base">Martine Adam CPA</strong>
              <small className="mt-0.5 block text-xs font-semibold text-ma-muted">
                Cabinet comptable professionnel
              </small>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-ma-muted md:flex">
            <a href="#services" className="transition hover:text-ma-primary">
              Services
            </a>
            <a href="#approche" className="transition hover:text-ma-primary">
              Approche
            </a>
            <a href="#processus" className="transition hover:text-ma-primary">
              Processus
            </a>
            <Link
              to="/nous-rejoindre"
              className="rounded-full bg-ma-primary px-5 py-2.5 text-white shadow-[0_14px_28px_rgba(36,71,139,0.2)] transition hover:-translate-y-0.5 hover:bg-ma-primary-dark"
            >
              Ouvrir un dossier
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section
          className="ma-hero-parallax relative isolate min-h-[78svh] overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,250,248,0.97)_0%,rgba(247,250,248,0.86)_38%,rgba(247,250,248,0.38)_70%,rgba(247,250,248,0.12)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent_0%,#f7faf8_100%)]" />

          <div className="relative mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col justify-center pb-20 pt-24 md:pb-24 md:pt-28">
            <div className="ma-reveal max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-ma-separator/45 bg-white/72 px-4 py-2 text-xs font-extrabold uppercase text-ma-primary shadow-[0_12px_34px_rgba(29,38,48,0.08)] backdrop-blur">
                Comptabilité, fiscalité et accompagnement
              </p>

              <h1 className="text-5xl font-extrabold leading-[1.02] text-ma-text md:text-7xl">
                Martine Adam CPA
              </h1>

              <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-ma-text/82">
                Un cabinet comptable moderne pour structurer vos chiffres,
                clarifier vos obligations et avancer avec confiance.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/nous-rejoindre"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-ma-primary px-6 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(36,71,139,0.22)] transition hover:-translate-y-0.5 hover:bg-ma-primary-dark"
                >
                  Commencer mon dossier
                </Link>

                <a
                  href="#services"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-ma-separator/70 bg-white/82 px-6 text-sm font-extrabold text-ma-primary shadow-[0_12px_28px_rgba(29,38,48,0.06)] backdrop-blur transition hover:-translate-y-0.5 hover:border-ma-primary"
                >
                  Voir les services
                </a>
              </div>
            </div>

            <div className="ma-reveal ma-reveal-delay mt-16 grid gap-3 sm:grid-cols-3">
              {highlights.map(([number, label]) => (
                <div
                  key={number}
                  className="border-l border-ma-primary/30 bg-white/58 px-4 py-3 shadow-[0_12px_30px_rgba(29,38,48,0.07)] backdrop-blur"
                >
                  <div className="text-xs font-black text-ma-primary">
                    {number}
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-ma-text">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-10 py-20 lg:grid-cols-[0.82fr_1.18fr]"
        >
          <div className="ma-reveal">
            <p className="mb-4 text-xs font-extrabold uppercase text-ma-primary">
              Services
            </p>
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Une expertise complète, présentée simplement.
            </h2>
            <p className="mt-5 text-lg leading-8 text-ma-muted">
              Chaque dossier est traité avec une approche structurée: comprendre
              votre réalité, sécuriser les informations importantes et vous
              guider vers les prochaines décisions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} index={index} />
            ))}
          </div>
        </section>

        <section id="approche" className="overflow-hidden bg-white py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="ma-parallax-panel relative min-h-[430px] overflow-hidden rounded-[8px] bg-ma-text p-8 text-white shadow-[0_24px_70px_rgba(29,38,48,0.2)]">
              <div className="absolute inset-0 opacity-35 ma-grid-texture" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase text-white/70">
                    Vision de cabinet
                  </p>
                  <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight md:text-5xl">
                    Des chiffres lisibles, des suivis nets, des décisions mieux
                    préparées.
                  </h2>
                </div>

                <div className="mt-14 grid gap-3 sm:grid-cols-3">
                  <Metric value="4" label="profils accompagnés" />
                  <Metric value="100%" label="processus numérique" />
                  <Metric value="1" label="dossier clair" />
                </div>
              </div>
            </div>

            <div className="ma-reveal">
              <p className="mb-4 text-xs font-extrabold uppercase text-ma-primary">
                Approche
              </p>
              <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
                Professionnel sans devenir froid. Rigoureux sans devenir lourd.
              </h2>
              <p className="mt-6 text-lg leading-8 text-ma-muted">
                Le formulaire d’ouverture de dossier permet de rassembler les
                renseignements essentiels avant le premier suivi. Vous gagnez du
                temps, le cabinet reçoit un dossier mieux organisé, et les
                échanges commencent sur des bases solides.
              </p>

              <div className="mt-8 space-y-3">
                <CheckItem text="Collecte sécurisée des documents comptables et fiscaux" />
                <CheckItem text="Priorisation claire des obligations et échéances" />
                <CheckItem text="Communication simple avec un suivi professionnel" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="processus"
          className="mx-auto w-[min(1180px,calc(100%-40px))] py-20"
        >
          <div className="ma-reveal mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-extrabold uppercase text-ma-primary">
                Processus
              </p>
              <h2 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
                De l’information brute vers un dossier prêt à traiter.
              </h2>
            </div>
            <Link
              to="/nous-rejoindre"
              className="w-fit rounded-full border border-ma-separator/70 bg-white px-5 py-3 text-sm font-extrabold text-ma-primary transition hover:-translate-y-0.5 hover:border-ma-primary"
            >
              Remplir le formulaire
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                key={step}
                className="ma-reveal rounded-[8px] border border-ma-separator/45 bg-white p-5 shadow-[0_16px_38px_rgba(36,71,139,0.06)]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-8 text-sm font-black text-ma-primary">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-extrabold">{step}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="border-t border-ma-separator/35 bg-ma-text py-10 text-white"
      >
        <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="text-lg">Martine Adam CPA</strong>
            <p className="mt-1 text-sm text-white/68">
              Cabinet comptable professionnel
            </p>
          </div>

          <Link
            to="/nous-rejoindre"
            className="w-fit rounded-full bg-white px-5 py-3 text-sm font-extrabold text-ma-primary transition hover:-translate-y-0.5"
          >
            Ouvrir un dossier
          </Link>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ title, text, index }) {
  return (
    <article
      className="ma-reveal rounded-[8px] border border-ma-separator/45 bg-white p-6 shadow-[0_16px_38px_rgba(36,71,139,0.06)] transition hover:-translate-y-1 hover:border-ma-primary/45 hover:shadow-[0_22px_52px_rgba(36,71,139,0.12)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="mb-6 h-1.5 w-12 rounded-full bg-ma-primary" />
      <h3 className="mb-3 text-xl font-extrabold">{title}</h3>
      <p className="text-sm leading-7 text-ma-muted">{text}</p>
    </article>
  );
}

function Metric({ value, label }) {
  return (
    <div className="border-t border-white/24 pt-4">
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase text-white/62">
        {label}
      </div>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div className="flex gap-3 rounded-[8px] border border-ma-separator/35 bg-white p-4 shadow-[0_10px_24px_rgba(36,71,139,0.05)]">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
        ✓
      </span>
      <span className="text-sm font-bold leading-6 text-ma-text">{text}</span>
    </div>
  );
}
