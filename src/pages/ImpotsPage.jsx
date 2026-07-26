import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FilloutStandardEmbed } from "@fillout/react";

const FAQ_SECTIONS = [
  {
    id: "particuliers",
    emoji: "👤",
    title: "Impôts des particuliers – CPA Joliette et impôts en ligne",
    items: [
      {
        id: "p1",
        q: "Quand dois-je produire ma déclaration de revenus au Québec?",
        a: "La date limite est généralement le 30 avril. Si vous ou votre conjoint(e) êtes travailleur autonome, vous avez jusqu’au 15 juin pour produire, mais tout solde d’impôt doit être payé au 30 avril.",
        note: "Notre service d’impôts en ligne au Québec permet une production rapide et sécurisée, sans déplacement.",
        keywords: ["déclaration", "date limite", "30 avril", "15 juin", "travailleur autonome"],
      },
      {
        id: "p2",
        q: "Est-il préférable de produire nos impôts en couple?",
        a: "Oui. Même si chaque personne produit sa déclaration individuellement, une analyse coordonnée permet d’optimiser :",
        bullets: ["Le transfert de crédits", "Les frais médicaux", "Les dons", "Les frais de garde", "Les crédits pour aînés"],
        note: "Un CPA en ligne peut analyser votre situation globale et maximiser votre remboursement.",
        keywords: ["couple", "crédits", "frais médicaux", "dons", "garde", "aînés"],
      },
      {
        id: "p3",
        q: "Puis-je faire mes impôts entièrement en ligne avec un CPA?",
        a: "Oui. Notre cabinet offre :",
        bullets: ["Transmission sécurisée des documents", "Signature électronique", "Rencontre virtuelle au besoin", "Dépôt direct", "Support personnalisé"],
        note: "Que vous soyez à Joliette, Lanaudière ou ailleurs au Québec, vous pouvez bénéficier d’un accompagnement professionnel à distance.",
        keywords: ["en ligne", "signature", "sécurisé", "dépôt direct"],
      },
      {
        id: "p4",
        q: "Quels documents dois-je fournir?",
        a: "Les documents les plus fréquents :",
        bullets: ["T4 / Relevé 1", "T5 / Relevé 3", "REER", "Relevé 31", "Frais médicaux", "Frais de garde", "Dons"],
        note: "Un CPA Lanaudière ou en ligne vous fournira une liste adaptée à votre situation.",
        keywords: ["documents", "t4", "relevé 1", "reer", "relevé 31"],
      },
    ],
  },
  {
    id: "autonomes",
    emoji: "👨‍💼",
    title: "Travailleurs autonomes – Comptable en ligne Québec",
    items: [
      {
        id: "a1",
        q: "Dois-je m’inscrire aux taxes (TPS/TVQ)?",
        a: "L’inscription est obligatoire si vos revenus dépassent 30 000 $ sur 12 mois consécutifs. Un CPA en ligne au Québec peut :",
        bullets: ["Vous inscrire aux taxes", "Structurer votre facturation", "Mettre en place une tenue de livres adaptée"],
        keywords: ["tps", "tvq", "30000", "taxes"],
      },
      {
        id: "a2",
        q: "Quelles dépenses puis-je déduire comme travailleur autonome?",
        a: "Exemples fréquents :",
        bullets: ["Bureau à domicile", "Internet et téléphone", "Kilométrage automobile", "Logiciels et abonnements", "Assurances professionnelles", "Honoraires comptables"],
        note: "Un comptable en ligne peut vous aider à structurer vos dépenses et éviter les erreurs.",
        keywords: ["dépenses", "déduire", "bureau", "kilométrage", "logiciels"],
      },
      {
        id: "a3",
        q: "Comment éviter les mauvaises surprises fiscales?",
        a: "Contrairement aux salariés :",
        bullets: ["Aucun impôt n’est retenu à la source", "Vous devez payer impôt + RRQ", "Des acomptes provisionnels peuvent être requis"],
        note: "Un CPA Lanaudière ou en ligne peut calculer vos acomptes et planifier votre trésorerie.",
        keywords: ["rrq", "acomptes", "retenu à la source"],
      },
      {
        id: "a4",
        q: "Est-ce avantageux de s’incorporer?",
        a: "L’incorporation peut être stratégique si :",
        bullets: ["Vos profits dépassent vos besoins personnels", "Vous souhaitez optimiser votre fiscalité", "Vous planifiez une croissance"],
        note: "Un CPA en ligne Québec peut analyser votre situation et recommander la meilleure structure.",
        keywords: ["incorporer", "incorporation", "fiscalité"],
      },
    ],
  },
  {
    id: "locatifs",
    emoji: "🏢",
    title: "Propriétaires d’immeubles – Impôts locatifs en ligne",
    items: [
      {
        id: "l1",
        q: "Comment sont imposés les revenus locatifs?",
        a: "Revenus locatifs – Dépenses admissibles = Revenu net imposable. Ce revenu s’ajoute à vos autres revenus.",
        note: "Un CPA à Joliette ou en ligne peut optimiser votre fiscalité immobilière.",
        keywords: ["revenus locatifs", "revenu net", "imposable"],
      },
      {
        id: "l2",
        q: "Quelles dépenses sont déductibles?",
        bullets: ["Intérêts hypothécaires", "Taxes municipales", "Assurances", "Entretien", "Gestion immobilière", "Honoraires professionnels"],
        note: "Certaines rénovations doivent être amorties (DPA). Un comptable Lanaudière peut structurer correctement ces déductions.",
        keywords: ["déductibles", "hypothécaires", "taxes municipales", "dpa"],
      },
      {
        id: "l3",
        q: "Comment est imposée la vente d’un immeuble locatif?",
        a: "Deux éléments peuvent être imposés :",
        bullets: ["Gain en capital (50 % imposable)", "Récupération d’amortissement (100 % imposable)"],
        note: "Une planification stratégique avant la vente est essentielle.",
        keywords: ["vente", "gain en capital", "amortissement"],
      },
    ],
  },
  {
    id: "pourquoi",
    emoji: "⭐",
    title: "Pourquoi choisir notre cabinet de CPA?",
    items: [
      {
        id: "w1",
        q: "Pourquoi choisir notre cabinet de CPA à Joliette ou en ligne?",
        bullets: ["Service en personne à Joliette", "Accompagnement partout en Lanaudière", "Service d’impôts en ligne sécurisé au Québec", "Planification fiscale proactive", "Expertise en fiscalité des particuliers et entrepreneurs"],
        note: "Nous accompagnons des clients à Joliette, partout en Lanaudière, à Montréal et partout au Québec en ligne.",
        keywords: ["joliette", "lanaudière", "en ligne", "sécurisé", "planification"],
      },
    ],
  },
];

function itemMatches(item, query) {
  const haystack = [
    item.q,
    item.a,
    item.note,
    ...(item.bullets || []),
    ...(item.keywords || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function ImpotsPage() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const sections = useMemo(() => {
    return FAQ_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const matchesSection =
          activeSection === "all" || activeSection === section.id;
        const matchesQuery = query.trim() ? itemMatches(item, query.trim()) : true;

        return matchesSection && matchesQuery;
      }),
    })).filter((section) => section.items.length > 0);
  }, [activeSection, query]);

  const totalItems = FAQ_SECTIONS.reduce(
    (total, section) => total + section.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <header className="border-b border-[#C4A882]/30 bg-[#FAF8F5]/95 backdrop-blur">
        <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] items-center justify-between py-5">
          <Link to="/"  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ width: 36, height: 36, background: '#1E3A2F', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L9 4L15 14H3Z" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="5" y1="11" x2="13" y2="11" stroke="#C4A882" strokeWidth="1"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#1C1917', transition: 'color 0.4s', letterSpacing: '-0.01em' }}>Martine Adam CPA</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', fontWeight: 400, color: '#C4A882', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cabinet comptable</span>
          </div>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-[#78716C]">
            <Link to="/" className="hover:text-[#1E3A2F]">
              Accueil
            </Link>
            <Link
              to="/nous-rejoindre"
              className="rounded-[3px] bg-[#1E3A2F] px-4 py-2 text-[#FAF8F5] hover:bg-[#2A5040]"
            >
              Nous rejoindre
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto w-[min(1180px,calc(100%-40px))] py-16 ">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#C4A882]">
              Impôts 2025
            </p>
            <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl">
             Le cabinet comptable adapté à votre réalité.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#78716C]">
              Pour mieux vous servir et protéger vos informations personnelles, nous avons modernisé notre processus de préparation d’impôts.
Nos anciens clients peuvent choisir entre le portail ou le format papier, sans frais supplémentaires. Nous nous adaptons à vous.
Notre objectif est simple : vous offrir une expérience plus fluide, sécurisée et adaptée à vos besoins.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setOpen(true)}
                className="font-bold hover:underline hover:text-[#1E3A2F] mt-6 px-6 py-6 rounded-md cursor-pointer"
              >
                <a>Télécharger le guide pratique et aide-mémoire d'impôt</a>
              </button>
            </div>
            <div className="mt-8 rounded-[4px] border border-[#C4A882]/35 bg-white/70 ">

            </div>
          </div>

  
        </section>

        <section className="mx-auto w-[min(1180px,calc(100%-40px))] pb-20">
      <div
        className="h-150 bg-linear-to-br from-white via-gray-50 to-gray-100 rounded-xl shadow-xl space-y-6 mb-10"
      >
          <FilloutStandardEmbed filloutId="q7LHvaY7kXus" />
      </div>
              <h3 className="text-center leading-8 text-[#78716C]">
        👉 Attendez votre invitation : Ne transmettez rien avant de recevoir l'accès au portail, Les emails ne sont plus acceptés, sauf cas exceptionnels validés par notre équipe.
      </h3>
         <h3 className="text-center leading-8 text-[#78716C]">
        👉 Face à la forte affluence saisonnière, nous ne prenons pas de nouveaux clients pour le moment. Cependant, laissez-nous vos coordonnées : nous pourrons vous orienter vers un confrère ou vous contacter dès qu'une place se libère.
      </h3>
        </section>
      </main>
            <Footer />
                  <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Télécharger le guide pratique et aide-mémoire d'impôt"
      >
        <FilloutStandardEmbed filloutId="ghnAaEjFe8us" />
      </Modal>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#111815', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: 28, height: 28, background: '#1E3A2F', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L9 4L15 14H3Z" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="5" y1="11" x2="13" y2="11" stroke="#C4A882" strokeWidth="1"/>
            </svg>
          </div>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#FAF8F5' }}>Martine Adam CPA</span>
            <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.62rem', color: '#78716C', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Cabinet comptable · Montréal</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            ['Services', '/'],
            ['À propos', '/'],
            ['Equipe', '/'],
            ['FAQ', '/faq'],
          ].map(([label, href]) => (
            href.startsWith("/") ? (
              <Link key={label} to={href}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#78716C', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C4A882')}
                onMouseLeave={e => (e.currentTarget.style.color = '#78716C')}
              >{label}</Link>
            ) : (
              <a key={label} href={href}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', color: '#78716C', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C4A882')}
              onMouseLeave={e => (e.currentTarget.style.color = '#78716C')}
              >{label}</a>
            )
          ))}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#4A4540', textAlign: 'right' }}>
          <div>© {new Date().getFullYear()} Martine Adam CPAAdam CPA. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  )
}

function Modal({ open, onClose, title, children }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[1px] transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full h-full max-h-8/12 max-w-6/12 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-5 py-4">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
