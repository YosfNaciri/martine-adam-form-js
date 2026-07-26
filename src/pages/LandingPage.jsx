import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── Parallax hook ────────────────────────────────────────────────────────────
function useParallax(speed = 0.4) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * speed)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return offset
}

// ─── Intersection observer for reveal animations ──────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'À propos', href: '#apropos' },
    { label: 'Equipe', href: '#equipe' },
    { label: 'FAQ', to: '/faq' },
  ]

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'background 0.5s, backdrop-filter 0.5s, box-shadow 0.5s',
      background: scrolled ? 'rgba(250,248,245,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(196,168,130,0.2)' : 'none',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ width: 36, height: 36, background: '#1E3A2F', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L9 4L15 14H3Z" fill="none" stroke="#C4A882" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="5" y1="11" x2="13" y2="11" stroke="#C4A882" strokeWidth="1"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: scrolled ? '#1C1917' : '#FAF8F5', transition: 'color 0.4s', letterSpacing: '-0.01em' }}>Martine Adam CPA</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', fontWeight: 400, color: '#C4A882', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cabinet comptable</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
          {links.map(link => (
            link.to ? (
              <Link key={link.label} to={link.to}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.84rem', fontWeight: 400, color: scrolled ? '#1C1917' : 'rgba(250,248,245,0.85)', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C4A882')}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#1C1917' : 'rgba(250,248,245,0.85)')}
              >{link.label}</Link>
            ) : (
              <a key={link.label} href={link.href}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.84rem', fontWeight: 400, color: scrolled ? '#1C1917' : 'rgba(250,248,245,0.85)', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C4A882')}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#1C1917' : 'rgba(250,248,245,0.85)')}
              >{link.label}</a>
            )
          ))}
          <Link to="/nous-rejoindre" style={{ padding: '0.55rem 1.4rem', background: '#1E3A2F', color: '#FAF8F5', fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.05em', textDecoration: 'none', borderRadius: 2, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2A5040')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1E3A2F')}
          >Nous rejoindre</Link>
        </nav>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(o => !o)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }}
          className="mobile-burger" aria-label="Menu">
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: scrolled ? '#1C1917' : '#FAF8F5', transition: 'transform 0.3s, background 0.4s', transformOrigin: 'center',
              transform: menuOpen ? (i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)') : 'none' }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ overflow: 'hidden', maxHeight: menuOpen ? 300 : 0, transition: 'max-height 0.4s ease', background: 'rgba(250,248,245,0.97)', backdropFilter: 'blur(12px)' }}>
        <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {links.map(link => (
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#1C1917', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#1C1917', textDecoration: 'none' }}
              >{link.label}</a>
            )
          ))}
          <Link
            to="/nous-rejoindre"
            onClick={() => setMenuOpen(false)}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#1E3A2F', fontWeight: 700, textDecoration: 'none' }}
          >
            Nous rejoindre
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const parallax = useParallax(0.32)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${parallax}px)`, willChange: 'transform' }}>
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1800&h=1100&fit=crop&auto=format"
          alt="Cabinet comptable moderne"
          style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(15,25,20,0.82) 0%, rgba(20,35,28,0.55) 55%, rgba(30,58,47,0.35) 100%)' }} />
      </div>

      {/* Subtle grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: '200px' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(28px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.8rem' }}>
              <div style={{ width: 32, height: 1, background: '#C4A882' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A882' }}>CPA · Expert-comptable agréé</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.8rem, 6.5vw, 5rem)', fontWeight: 700, color: '#FAF8F5', lineHeight: 1.08, letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>
              La rigueur au service<br />de votre <em style={{ fontStyle: 'italic', color: '#C4A882' }}>réussite.</em>
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 300, color: 'rgba(250,248,245,0.78)', lineHeight: 1.8, maxWidth: 500, marginBottom: '2.5rem' }}>
              Comptabilité, fiscalité et conseil stratégique pour les entreprises et particuliers. Un accompagnement personnalisé, des résultats concrets.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link   to="/nous-rejoindre"
                style={{ padding: '0.85rem 2rem', background: '#C4A882', color: '#1C1917', fontFamily: "'Inter', sans-serif", fontSize: '0.83rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, transition: 'background 0.25s, transform 0.25s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D4B892'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#C4A882'; e.currentTarget.style.transform = 'none' }}
              >Nous rejoindre </Link>
                <Link   to="/impots"
                style={{ padding: '0.85rem 2rem', border: '1px solid rgba(250,248,245,0.35)', color: '#FAF8F5', fontFamily: "'Inter', sans-serif", fontSize: '0.83rem', fontWeight: 400, letterSpacing: '0.05em', textDecoration: 'none', borderRadius: 2, transition: 'border-color 0.25s, transform 0.25s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(250,248,245,0.75)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,248,245,0.35)'; e.currentTarget.style.transform = 'none' }}
              >Impôts 2025</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: loaded ? 0.55 : 0, transition: 'opacity 1.2s 1s' }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.62rem', letterSpacing: '0.2em', color: '#FAF8F5', textTransform: 'uppercase' }}>Défiler</span>
        <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(250,248,245,0.8), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes scrollPulse { 0%,100%{opacity:.55;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.18)} }`}</style>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function StatsBand() {
  const { ref, visible } = useReveal()
  const stats = [
    { value: '25+', label: 'Années d\'expérience' },
    { value: '800+', label: 'Clients accompagnés' },
    { value: '100%', label: 'Dossiers conformes' },
    { value: '3', label: 'Associés CPA' },
  ]
  return (
    <div ref={ref} style={{ background: '#1E3A2F', padding: '3.5rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(18px)', transition: `opacity 0.6s ${i * 0.11}s, transform 0.6s ${i * 0.11}s` }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#C4A882', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 300, color: 'rgba(250,248,245,0.5)', letterSpacing: '0.07em', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:640px){.stats-inner{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
const services = [
  {
    num: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="20" height="17" rx="1" stroke="#C4A882" strokeWidth="1.4"/>
        <line x1="8" y1="11" x2="20" y2="11" stroke="#C4A882" strokeWidth="1.2"/>
        <line x1="8" y1="15" x2="16" y2="15" stroke="#C4A882" strokeWidth="1.2"/>
        <line x1="8" y1="19" x2="13" y2="19" stroke="#C4A882" strokeWidth="1.2"/>
      </svg>
    ),
    title: 'Comptabilité & Tenue de livres',
    desc: 'Gestion rigoureuse de vos comptes, états financiers mensuels ou annuels, et production des rapports dont vous avez besoin pour prendre les bonnes décisions.',
    details: ['États financiers', 'Tenue de livres mensuelle', 'Conciliation bancaire', 'Rapports de gestion'],
  },
  {
    num: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L24 9V19L14 24L4 19V9L14 4Z" stroke="#C4A882" strokeWidth="1.4"/>
        <path d="M14 4V24M4 9L24 19M24 9L4 19" stroke="#C4A882" strokeWidth="0.8" opacity="0.5"/>
      </svg>
    ),
    title: 'Fiscalité & Déclarations',
    desc: 'Optimisation fiscale légale pour particuliers et sociétés. Production des déclarations de revenus fédérale et provinciale, taxes TPS/TVQ, et planification proactive.',
    details: ['Déclarations de revenus', 'TPS/TVQ', 'Planification fiscale', 'Fiducies et successions'],
  },
  {
    num: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polyline points="4,20 10,13 15,16 22,8" stroke="#C4A882" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="8" r="2.5" stroke="#C4A882" strokeWidth="1.2"/>
      </svg>
    ),
    title: 'Conseil financier & Stratégie',
    desc: 'Accompagnement dans vos décisions financières importantes : achat d\'entreprise, financement, restructuration, planification de la relève et croissance.',
    details: ['Analyse de rentabilité', 'Planification de relève', 'Financement bancaire', 'Évaluation d\'entreprise'],
  },
  {
    num: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#C4A882" strokeWidth="1.4"/>
        <path d="M14 8V14L18 17" stroke="#C4A882" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Paie & Ressources humaines',
    desc: 'Gestion complète de votre paie, production des relevés d\'emploi, déclarations annuelles T4/Relevé 1 et conformité aux obligations légales employeur.',
    details: ['Traitement de la paie', 'T4 / Relevé 1', 'Relevés d\'emploi', 'CNESST & RQAP'],
  },
  {
    num: '05',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="9" height="9" rx="1" stroke="#C4A882" strokeWidth="1.4"/>
        <rect x="15" y="4" width="9" height="9" rx="1" stroke="#C4A882" strokeWidth="1.4"/>
        <rect x="4" y="15" width="9" height="9" rx="1" stroke="#C4A882" strokeWidth="1.4"/>
        <rect x="15" y="15" width="9" height="9" rx="1" stroke="#C4A882" strokeWidth="1.4"/>
      </svg>
    ),
    title: 'Incorporation & Démarrage',
    desc: 'Structuration optimale de votre entreprise dès le départ. Incorporation, choix du régime fiscal, mise en place des systèmes comptables et accompagnement dans les premières années.',
    details: ['Incorporation au Québec', 'Structure corporative', 'Convention entre actionnaires', 'Démarrage entreprise'],
  },
  {
    num: '06',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 22L6 16M11 22L11 12M16 22L16 8M21 22L21 4" stroke="#C4A882" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Audit & Certification',
    desc: 'Missions de compilation, d\'examen et d\'audit pour répondre aux exigences de vos prêteurs, actionnaires ou partenaires d\'affaires.',
    details: ['Compilation', 'Mission d\'examen', 'Audit', 'Due diligence'],
  },
]

function ServiceCard({ s, i }) {
  const { ref, visible } = useReveal(0.08)
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: `opacity 0.65s ${(i % 3) * 0.12}s, transform 0.65s ${(i % 3) * 0.12}s` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: '#FAF8F5', border: '1px solid', borderColor: hovered ? '#C4A882' : '#E8E4DD', borderRadius: 3, padding: '2rem', height: '100%',
          transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
          boxShadow: hovered ? '0 12px 40px rgba(30,58,47,0.1)' : '0 2px 6px rgba(0,0,0,0.03)',
          transform: hovered ? 'translateY(-5px)' : 'none', cursor: 'default' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
          <div style={{ width: 48, height: 48, background: hovered ? '#1E3A2F' : '#EAE6DF', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
            {s.icon}
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#EAE6DF', lineHeight: 1 }}>{s.num}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, color: '#1C1917', lineHeight: 1.25, margin: '0 0 0.7rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.86rem', fontWeight: 300, color: '#78716C', lineHeight: 1.78, margin: '0 0 1.4rem' }}>{s.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {s.details.map(d => (
            <span key={d} style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 400, color: '#1E3A2F', background: hovered ? 'rgba(30,58,47,0.08)' : '#EAE6DF', padding: '0.25rem 0.65rem', borderRadius: 2, transition: 'background 0.3s' }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Services() {
  const { ref, visible } = useReveal(0.05)
  return (
    <section id="services" style={{ padding: 'clamp(5rem, 10vw, 9rem) 2rem', background: '#EAE6DF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{ marginBottom: '3.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'end' }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(18px)', transition: 'opacity 0.6s, transform 0.6s' }}>
            <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1rem' }}>Expertise</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1C1917', lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0 }}>
              Nos domaines<br /><em>d'expertise</em>
            </h2>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.92rem', fontWeight: 300, color: '#78716C', lineHeight: 1.82, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(18px)', transition: 'opacity 0.6s 0.15s, transform 0.6s 0.15s', margin: 0 }}>
            De la tenue de livres à la planification stratégique, Martine Adam CPA offre une gamme complète de services comptables adaptés à la réalité des PME québécoises et des particuliers.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
          {services.map((s, i) => <ServiceCard key={s.num} s={s} i={i} />)}
        </div>
      </div>
      <style>{`@media(max-width:900px){#services .svc-grid{grid-template-columns:1fr!important}#services .hdr-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const { ref, visible } = useReveal(0.08)
  const imgParallax = useParallax(0.12)

  return (
    <section id="apropos" style={{ padding: 'clamp(5rem, 10vw, 9rem) 2rem', background: '#FAF8F5' }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 8vw, 7rem)', alignItems: 'center' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-28px)', transition: 'opacity 0.8s, transform 0.8s' }}>
          <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1.2rem' }}>À propos du cabinet</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1C1917', lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 0 1.4rem' }}>
            Plus qu'un comptable,<br /><em>un partenaire de confiance</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 300, color: '#78716C', lineHeight: 1.85, marginBottom: '1.2rem' }}>
            Pour mieux vous servir et protéger vos informations personnelles, nous avons modernisé notre processus de préparation d’impôts.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 300, color: '#78716C', lineHeight: 1.85, marginBottom: '2.5rem' }}>
            Nos anciens clients peuvent choisir entre le portail ou le format papier, sans frais supplémentaires. Nous nous adaptons à vous.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 300, color: '#78716C', lineHeight: 1.85, marginBottom: '2.5rem' }}>
Notre objectif est simple : vous offrir une expérience plus fluide, sécurisée et adaptée à vos besoins.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              'Cabinet agréé pour l\'audit et la certification',
              'Service en français et en anglais',
              'Disponibilité année-round, pas seulement en saison',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(30,58,47,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><polyline points="1,4 4,7 9,1" stroke="#1E3A2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 400, color: '#1C1917' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(28px)', transition: 'opacity 0.8s 0.2s, transform 0.8s 0.2s', position: 'relative' }}>
          <div style={{ position: 'relative', paddingTop: '120%', borderRadius: 3, overflow: 'hidden', background: '#EAE6DF' }}>
            <img
              src="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlzt7dzKtguyOULJRTaA5Tk8c4NXdky_ffmv42UzAvyz8zH5F50bMXAWbzmZRNMyPkPnfRoCuHqbrde_N1CBqKnsrD_ivyeqB1NtUrBnJ9y9x68vvNH2IqFCv1vHh0ap3RjbgatWg=s1360-w1360-h1020-rw"
              alt="Martine Adam CPA"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center top', transform: `translateY(${imgParallax * 0.3}px)` }}
            />
            {/* Overlay badge */}
            <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(30,58,47,0.92)', backdropFilter: 'blur(8px)', borderRadius: 3, padding: '1rem 1.2rem' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#FAF8F5' }}>Martine Adam</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#C4A882', letterSpacing: '0.1em', marginTop: 2 }}>CPA, CGA</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -20, right: -20, width: 160, height: 160, border: '1px solid #C4A882', borderRadius: 3, zIndex: -1, opacity: 0.4 }} />
        </div>
      </div>
      <style>{`@media(max-width:768px){#approche>div{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── Parallax quote ───────────────────────────────────────────────────────────
function QuoteSection() {
  const parallax = useParallax(0.22)
  return (
    <section style={{ position: 'relative', height: 480, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${parallax * 0.6}px)`, willChange: 'transform' }}>
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&h=600&fit=crop&auto=format&sat=-20"
          alt=""
          style={{ width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,22,18,0.78)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 740, padding: '0 2rem' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontStyle: 'italic', fontWeight: 400, color: '#1C1917', lineHeight: 1.45, margin: '0 0 1.4rem', letterSpacing: '-0.01em' }}>
          "Un bon comptable ne se contente pas de regarder dans le rétroviseur. Il vous aide à voir la route devant vous."
        </p>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.18em', color: '#1C1917', textTransform: 'uppercase' }}>— Martine Adam, CPA</span>
      </div>
    </section>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────────
const team = [
  {
    name: 'Gabriel Surprenant',
    title: 'CPA, CA — Associé principal',
    spec: 'Fiscalité corporative & planification',
    img: 'https://www.gsstrategies.ca/wp-content/uploads/2023/06/Pinpoint_I2A5832-440x550.jpg',
  },
  {
    name: 'Gabriel Surprenant',
    title: 'CPA, CA — Associé principal',
    spec: 'Audit, certification & financement',
    img: 'https://www.gsstrategies.ca/wp-content/uploads/2023/06/Pinpoint_I2A5832-440x550.jpg',
  },
  {
    name: 'Gabriel Surprenant',
    title: 'CPA, CA — Associé principal',
    spec: 'PME, démarrage & restructuration',
    img: 'https://www.gsstrategies.ca/wp-content/uploads/2023/06/Pinpoint_I2A5832-440x550.jpg',
  },
]

function TeamMember({ m, i }) {
  const { ref, visible } = useReveal(0.1)
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: `opacity 0.65s ${i * 0.14}s, transform 0.65s ${i * 0.14}s` }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'default' }}>
        <div style={{ position: 'relative', paddingTop: '130%', borderRadius: 3, overflow: 'hidden', background: '#EAE6DF', marginBottom: '1.2rem' }}>
          <img src={m.img} alt={m.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,22,18,0.55) 0%, transparent 50%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s' }} />
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#1C1917', marginBottom: 4 }}>{m.name}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', fontWeight: 400, color: '#C4A882', letterSpacing: '0.04em', marginBottom: 4 }}>{m.title}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 300, color: '#78716C' }}>{m.spec}</div>
      </div>
    </div>
  )
}

function Team() {
  const { ref, visible } = useReveal(0.05)
  return (
    <section id="equipe" style={{ padding: 'clamp(5rem, 10vw, 9rem) 2rem', background: '#EAE6DF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '3.5rem', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(18px)', transition: 'opacity 0.6s, transform 0.6s' }}>
          <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1rem' }}>Notre équipe</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1C1917', lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0 }}>
            Des experts à votre service
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
          {team.map((m, i) => <TeamMember key={i} m={m} i={i} />)}
        </div>
      </div>
      <style>{`@media(max-width:768px){#processus .team-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "Martine Adam CPA nous accompagne depuis l'incorporation de notre entreprise. Grâce à leur planification fiscale, nous avons économisé des dizaines de milliers de dollars en impôts légalement. Un partenaire essentiel.",
    name: 'Jean-Pierre Dubois',
    role: 'Président, Groupe Dubois Construction',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
  },
  {
    quote: "J'étais intimidée par tout ce qui touche aux finances. Martine et son équipe ont pris le temps de tout m'expliquer clairement. Maintenant je comprends mes états financiers et je prends de meilleures décisions.",
    name: 'Caroline Fortier',
    role: 'Propriétaire, Studio CF Design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
  },
  {
    quote: "Disponibles, proactifs et toujours à jour sur les nouvelles règles fiscales. Nous avons changé de comptable après 10 ans et le contraste est frappant. On ne retournera plus jamais en arrière.",
    name: 'Marc Thibodeau',
    role: 'Co-fondateur, TechNord Solutions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
  },
]

function Testimonials() {
  const { ref, visible } = useReveal(0.05)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 6500)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ padding: 'clamp(5rem, 10vw, 9rem) 2rem', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(18px)', transition: 'opacity 0.6s, transform 0.6s', textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1rem' }}>Témoignages</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1C1917', lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0 }}>Ce que nos clients disent</h2>
        </div>

        <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto 3rem', minHeight: 240 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              position: i === 0 ? 'relative' : 'absolute',
              top: 0, left: 0, right: 0,
              opacity: active === i ? 1 : 0,
              transform: active === i ? 'none' : 'translateY(10px)',
              transition: 'opacity 0.55s, transform 0.55s',
              pointerEvents: active === i ? 'auto' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {[0,1,2,3,4].map(s => (
                  <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="#C4A882" style={{ margin: '0 1px' }}>
                    <path d="M8 1L10.06 5.26L14.72 5.97L11.36 9.24L12.12 13.88L8 11.72L3.88 13.88L4.64 9.24L1.28 5.97L5.94 5.26L8 1Z"/>
                  </svg>
                ))}
              </div>
              <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)', fontStyle: 'italic', fontWeight: 400, color: '#1C1917', lineHeight: 1.65, margin: '0 0 2rem' }}>
                "{t.quote}"
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem' }}>
                <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 600, color: '#1C1917' }}>{t.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.76rem', fontWeight: 300, color: '#78716C' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem' }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? '#1E3A2F' : '#C9C3BB', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }}
              aria-label={`Témoignage ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const { ref, visible } = useReveal(0.05)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const inputStyle = {
    width: '100%', padding: '0.88rem 1rem',
    border: '1px solid #E0DBD3', borderRadius: 2,
    fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', fontWeight: 300, color: '#1C1917',
    background: '#FAF8F5', outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" style={{ padding: 'clamp(5rem, 10vw, 9rem) 2rem', background: '#1E3A2F' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(3rem, 8vw, 7rem)' }}>
          {/* Left */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-24px)', transition: 'opacity 0.7s, transform 0.7s' }}>
            <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1.2rem' }}>Contactez-nous</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#FAF8F5', lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 0 1.4rem' }}>
              Parlons de votre<br /><em>situation financière</em>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.92rem', fontWeight: 300, color: 'rgba(250,248,245,0.65)', lineHeight: 1.82, marginBottom: '3rem' }}>
              La première consultation est gratuite et sans engagement. Nous prenons le temps de comprendre votre situation avant de vous proposer quoi que ce soit.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {[
                { label: 'Adresse', value: '1000, rue De La Gauchetière O., Bureau 2400\nMontréal, QC H3B 4W5' },
                { label: 'Téléphone', value: '+1 (514) 555-0198' },
                { label: 'Courriel', value: 'info@adamcpa.ca' },
                { label: 'Heures', value: 'Lun–Ven : 8h30 – 17h30\nSamedi sur rendez-vous' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.66rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C4A882', marginBottom: 5 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: 'rgba(250,248,245,0.75)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(24px)', transition: 'opacity 0.7s 0.15s, transform 0.7s 0.15s' }}>
            <div style={{ background: '#FAF8F5', borderRadius: 3, padding: 'clamp(2rem, 4vw, 3rem)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1E3A2F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1C1917', margin: '0 0 0.8rem' }}>Demande reçue</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.88rem', color: '#78716C', lineHeight: 1.75, maxWidth: 340, margin: '0 auto' }}>Merci pour votre message. Un membre de notre équipe vous contactera dans les 24 heures ouvrables.</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', color: '#78716C', textTransform: 'uppercase', marginBottom: 5 }}>Nom complet *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        style={inputStyle} placeholder="Jean Dupont"
                        onFocus={e => (e.target.style.borderColor = '#1E3A2F')}
                        onBlur={e => (e.target.style.borderColor = '#E0DBD3')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', color: '#78716C', textTransform: 'uppercase', marginBottom: 5 }}>Courriel *</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle} placeholder="jean@exemple.com"
                        onFocus={e => (e.target.style.borderColor = '#1E3A2F')}
                        onBlur={e => (e.target.style.borderColor = '#E0DBD3')}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', color: '#78716C', textTransform: 'uppercase', marginBottom: 5 }}>Téléphone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        style={inputStyle} placeholder="(514) 555-0000"
                        onFocus={e => (e.target.style.borderColor = '#1E3A2F')}
                        onBlur={e => (e.target.style.borderColor = '#E0DBD3')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', color: '#78716C', textTransform: 'uppercase', marginBottom: 5 }}>Service souhaité</label>
                      <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                        style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                        onFocus={e => (e.target.style.borderColor = '#1E3A2F')}
                        onBlur={e => (e.target.style.borderColor = '#E0DBD3')}
                      >
                        <option value="">Sélectionner...</option>
                        <option>Comptabilité & Tenue de livres</option>
                        <option>Fiscalité & Déclarations</option>
                        <option>Conseil financier & Stratégie</option>
                        <option>Paie & Ressources humaines</option>
                        <option>Incorporation & Démarrage</option>
                        <option>Audit & Certification</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', color: '#78716C', textTransform: 'uppercase', marginBottom: 5 }}>Décrivez votre situation *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Ex : PME de 12 employés, cherche à optimiser notre charge fiscale et mettre en place une comptabilité mensuelle..."
                      onFocus={e => (e.target.style.borderColor = '#1E3A2F')}
                      onBlur={e => (e.target.style.borderColor = '#E0DBD3')}
                    />
                  </div>
                  <button type="submit" style={{ padding: '0.95rem 2rem', background: '#1E3A2F', color: '#FAF8F5', fontFamily: "'Inter', sans-serif", fontSize: '0.83rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', border: 'none', borderRadius: 2, cursor: 'pointer', transition: 'background 0.2s, transform 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2A5040'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.transform = 'none' }}
                  >Envoyer ma demande</button>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#A8A29E', textAlign: 'center', margin: 0 }}>Consultation initiale gratuite · Réponse en moins de 24h</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#contact>div>div{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
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
            ['Services', '#services'],
            ['À propos', '#apropos'],
            ['Equipe', '#equipe'],
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

// ─── App ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <StatsBand />
      <Services />
      <About />
      <QuoteSection />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
