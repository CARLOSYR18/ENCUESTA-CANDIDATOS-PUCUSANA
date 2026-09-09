import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Award, BarChart3, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Eye, FileText, Info, MapPin, MessageSquare, RotateCcw, Send, ShieldCheck, TrendingUp, Users, Vote } from "lucide-react";
import "./styles.css";
import logoPucusana from "./assets/logo-pucusana.png";
import bannerMaquinarias from "./assets/banner-maquinarias.png";
import bannerBienvenidos from "./assets/banner-bienvenidos.png";
import bannerObras from "./assets/banner-obras.png";

const COMMENTS_KEY = "pucusana-encuesta-comments";

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: "Manuel Echevarría",
    zone: "Naplo",
    date: "Hace 2 horas",
    text: "Pucusana necesita urgente un plan integral de ordenamiento costero y agua potable las 24 horas. Esperemos que quien gane cumpla con el distrito."
  },
  {
    id: 2,
    author: "Carmen Rosa Lévano",
    zone: "Pucusana Centro",
    date: "Hace 5 horas",
    text: "El muelle artesanal y el turismo deben potenciarse con transparencia. Mi voto va para quien garantice cero corrupción."
  },
  {
    id: 3,
    author: "Jorge Huamán Quispe",
    zone: "Asoc. Las Palmeras",
    date: "Ayer",
    text: "Importante esta iniciativa para ir viendo las tendencias. La seguridad ciudadana en los accesos al distrito debe ser prioridad número 1."
  }
];

const BANNERS = [
  {
    id: "bienvenidos",
    image: bannerBienvenidos,
    alt: "Bienvenidos - Municipalidad de Pucusana"
  },
  {
    id: "maquinarias",
    image: bannerMaquinarias,
    alt: "Nuevas Maquinarias - Presupuesto Participativo"
  },
  {
    id: "obras",
    image: bannerObras,
    alt: "Todos somos Pucusana - Ing. Juan José Cuya Espinoza"
  }
];

function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  return (
    <section
      className="hero-banner-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrusel institucional Pucusana"
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {BANNERS.map((banner, index) => (
          <div className="carousel-slide" key={banner.id}>
            <img
              src={banner.image}
              alt={banner.alt}
              className="carousel-img"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-arrow prev"
        onClick={prevSlide}
        aria-label="Anterior"
      >
        <ChevronLeft size={26} />
      </button>

      <button
        type="button"
        className="carousel-arrow next"
        onClick={nextSlide}
        aria-label="Siguiente"
      >
        <ChevronRight size={26} />
      </button>

      <div className="carousel-counter">
        <span>{String(currentIndex + 1).padStart(2, "0")}</span>
        <small>/ {String(BANNERS.length).padStart(2, "0")}</small>
      </div>

      <div className="carousel-dots">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`carousel-dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

const INITIAL_CANDIDATES = [
  { id: 1, name: "Rocio Del Pilar Del Valle Morales", party: "Partido Político Prin", votes: 118, color: "#159fe8", logo: "PRIN" },
  { id: 2, name: "Pedro Pablo Florian Huari", party: "Alianza Para El Progreso", votes: 32, color: "#51bf61", logo: "A" },
  { id: 3, name: "Cecilia Acosta Cajaleon", party: "Renovación Popular Perú", votes: 21, color: "#ef426f", logo: "R" },
  { id: 4, name: "Sandra Paola Chanchaya Espinoza", party: "Partido Político Perú Primero", votes: 10, color: "#f2bd12", logo: "1" },
  { id: 5, name: "Jhonel Jorge Leguia Jamis", party: "Partido Democrático Somos Perú", votes: 8, color: "#9a62c8", logo: "SP" },
  { id: 6, name: "Jose Luis Casas Carrion", party: "Avanza País - Partido de Integración", votes: 5, color: "#24b979", logo: "AP" },
  { id: 7, name: "Luis Martin Koc Lem Moya", party: "Fuerza Popular", votes: 4, color: "#f04465", logo: "K" },
  { id: 8, name: "Fabiola Lucero Silva Montero", party: "Partido Frente De La Esperanza 2021", votes: 1, color: "#52a96a", logo: "F" }
];

const STORAGE_KEY = "pucusana-encuesta-2026";
const VOTED_KEY = "pucusana-encuesta-voted";

function loadCandidates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  } catch {
    return INITIAL_CANDIDATES;
  }
}

function App() {
  const [candidates, setCandidates] = useState(loadCandidates);
  const [selected, setSelected] = useState(null);
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem(VOTED_KEY) === "true");
  const [view, setView] = useState("poll");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem(COMMENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });
  const [newComment, setNewComment] = useState({ name: "", zone: "", text: "" });
  const [commentSent, setCommentSent] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim()) return;
    const item = {
      id: Date.now(),
      author: newComment.name.trim(),
      zone: newComment.zone.trim() || "Vecino de Pucusana",
      date: "Hace un momento",
      text: newComment.text.trim()
    };
    const updated = [item, ...comments];
    setComments(updated);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
    setNewComment({ name: "", zone: "", text: "" });
    setCommentSent(true);
    setTimeout(() => setCommentSent(false), 4000);
  };

  const totalVotes = useMemo(
    () => candidates.reduce((sum, candidate) => sum + candidate.votes, 0),
    [candidates]
  );

  const ranked = useMemo(
    () => [...candidates].sort((a, b) => b.votes - a.votes),
    [candidates]
  );

  const vote = () => {
    if (!selected || hasVoted) return;
    setCandidates(current =>
      current.map(candidate =>
        candidate.id === selected ? { ...candidate, votes: candidate.votes + 1 } : candidate
      )
    );
    localStorage.setItem(VOTED_KEY, "true");
    setHasVoted(true);
    setMessage("Tu voto fue registrado correctamente.");
    setView("results");
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VOTED_KEY);
    setCandidates(INITIAL_CANDIDATES);
    setHasVoted(false);
    setSelected(null);
    setMessage("La encuesta de demostración fue reiniciada.");
    setView("poll");
  };

  return (
    <div className="app">
      <header className="main-navbar">
        <div className="navbar-inner">
          <div className="nav-brand" onClick={() => setView("poll")}>
            <div className="nav-logo-wrap">
              <img
                src={logoPucusana}
                alt="Escudo Municipalidad Distrital de Pucusana"
                className="nav-logo-img"
              />
            </div>
            <div className="nav-brand-text">
              <div className="nav-brand-tag">ELECCIONES PUCUSANA 2026</div>
              <strong className="nav-brand-title">Encuesta de Intención de Voto</strong>
              <span className="nav-brand-subtitle">Distrito Turístico y Pesquero de Pucusana</span>
            </div>
          </div>

          <nav className="nav-actions" aria-label="Navegación principal">
            <button
              type="button"
              className={`nav-link-btn ${view === "poll" ? "active" : ""}`}
              onClick={() => setView("poll")}
            >
              <Vote size={17} />
              <span>Emitir Voto</span>
            </button>
            <button
              type="button"
              className={`nav-link-btn ${view === "results" ? "active" : ""}`}
              onClick={() => setView("results")}
            >
              <TrendingUp size={17} />
              <span>¿Quién va ganando?</span>
            </button>
          </nav>

          <div className="nav-right-group">
            {ranked.length > 0 && totalVotes > 0 && (
              <div
                className="nav-leader-chip"
                onClick={() => setView("results")}
                title="Ver quién va ganando en la encuesta"
              >
                <Award size={16} className="leader-icon" />
                <div className="leader-text">
                  <span className="leader-label">1.º LUGAR ACTUAL</span>
                  <strong className="leader-name">
                    {ranked[0].name.split(" ").slice(0, 2).join(" ")}
                  </strong>
                </div>
                <span className="leader-pct">
                  {((ranked[0].votes / totalVotes) * 100).toFixed(1)}%
                </span>
              </div>
            )}

            <div className="nav-live">
              <span className="nav-live-dot"></span>
              <span>EN VIVO</span>
            </div>
          </div>
        </div>
      </header>

      <BannerCarousel />

      <main className="container">
        {/* Encabezado Periodístico Editorial (Diseño Captura 1) */}
        <article className="news-post-header">
          <nav className="news-breadcrumbs" aria-label="Navegación de migas">
            <span className="crumb-link">Inicio</span>
            <span className="crumb-sep">›</span>
            <span className="crumb-link">Encuestas</span>
            <span className="crumb-sep">›</span>
            <span className="crumb-current">SEPTIEMBRE 2026 | ¿Por cuál candidato a la Alcaldía de PUCUSANA votaría?...</span>
          </nav>

          <div className="news-category-badge">ENCUESTAS</div>

          <h1 className="news-title">
            SEPTIEMBRE 2026 | ¿POR CUÁL CANDIDATO A LA ALCALDÍA DE PUCUSANA VOTARÍA? — PUCUSANA
          </h1>

          <div className="news-meta-row">
            <span className="meta-byline">Por <strong>Pulso Municipal</strong></span>
            <span className="meta-dot">-</span>
            <span className="meta-date">8 septiembre, 2026</span>
            <span className="meta-item"><Eye size={15} /> 1,480</span>
            <span className="meta-item"><MessageSquare size={14} /> {comments.length}</span>
          </div>
        </article>

        <section className="title-card">
          <div>
            <p className="eyebrow">ENCUESTA CIUDADANA</p>
            <h1>¿Por quién votaría para alcalde de Pucusana 2026?</h1>
            <p className="subtitle">Selecciona una opción y registra tu voto.</p>
          </div>
          <div className="total-box">
            <Users size={20} />
            <div><b>{totalVotes}</b><span>votos registrados</span></div>
          </div>
        </section>

        <div className="notice">
          <Info size={18} />
          <span><b>Encuesta no oficial.</b> Este sitio es un proyecto de demostración y no representa resultados oficiales de ONPE, JNE ni otra autoridad electoral.</span>
        </div>

        <nav className="tabs">
          <button className={view === "poll" ? "active" : ""} onClick={() => setView("poll")}>Votar</button>
          <button className={view === "results" ? "active" : ""} onClick={() => setView("results")}>Ver resultados</button>
        </nav>

        {message && <div className="success"><CheckCircle2 size={19}/>{message}</div>}

        {view === "poll" ? (
          <section>
            {hasVoted && (
              <div className="already">
                <ShieldCheck size={19}/>
                Ya registraste un voto en este navegador. Puedes consultar los resultados.
              </div>
            )}

            <div className="candidate-list">
              {ranked.map((candidate, index) => {
                const percent = totalVotes ? (candidate.votes / totalVotes) * 100 : 0;
                const isSelected = selected === candidate.id;
                return (
                  <article
                    key={candidate.id}
                    className={`candidate ${isSelected ? "selected" : ""} ${hasVoted ? "disabled" : ""}`}
                    onClick={() => !hasVoted && setSelected(candidate.id)}
                  >
                    <div className="rank">{index + 1}</div>
                    <div className="avatar">{candidate.logo}</div>
                    <div className="candidate-info">
                      <div className="candidate-name">{candidate.name}</div>
                      <div className="party">{candidate.party}</div>
                      <div className="progress"><span style={{ width: `${Math.max(percent, 1)}%`, background: candidate.color }} /></div>
                    </div>
                    <div className="stats">
                      <strong>{percent.toFixed(1)}%</strong>
                      <span>{candidate.votes} votos</span>
                    </div>
                  </article>
                );
              })}
            </div>

            <button className="vote-button" disabled={!selected || hasVoted} onClick={vote}>
              {hasVoted ? "Voto ya registrado" : selected ? "Confirmar mi voto" : "Selecciona un candidato"}
            </button>
          </section>
        ) : (
          <section className="results">
            <div className="results-head">
              <div>
                <p className="eyebrow">RESULTADOS ACTUALES</p>
                <h2>Así va la encuesta</h2>
              </div>
              <div className="updated">Actualizado localmente</div>
            </div>

            <div className="winner">
              <div className="winner-label">1.º LUGAR</div>
              <div>
                <h3>{ranked[0].name}</h3>
                <p>{ranked[0].party}</p>
              </div>
              <b>{((ranked[0].votes / totalVotes) * 100).toFixed(1)}%</b>
            </div>

            <div className="bar-list">
              {ranked.map((candidate, index) => {
                const percent = totalVotes ? (candidate.votes / totalVotes) * 100 : 0;
                return (
                  <div className="bar-row" key={candidate.id}>
                    <div className="bar-label"><span>{index + 1}. {candidate.name}</span><b>{percent.toFixed(1)}%</b></div>
                    <div className="big-bar"><span style={{ width: `${percent}%`, background: candidate.color }} /></div>
                    <small>{candidate.votes} votos</small>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECCIONES INFORMATIVAS Y EDITORIALES (DESPUÉS DE LA SEGUNDA CAPTURA)     */}
        {/* ========================================================================= */}
        <section className="editorial-content-section">
          {/* Ficha Técnica del Sondeo */}
          <article className="editorial-card sheet-card">
            <div className="section-badge"><FileText size={15} /> FICHA TÉCNICA INFORMATIVA</div>
            <h2 className="editorial-heading">Metodología y Alcance del Sondeo Digital</h2>
            <p className="editorial-lead">
              Este sondeo de opinión ciudadana en línea es realizado con fines estadísticos e informativos para pulsar la preferencia vecinal en el distrito de Pucusana hacia las Elecciones Municipales 2026.
            </p>

            <div className="sheet-grid">
              <div className="sheet-box">
                <span className="sheet-box-label">Medio Organizador</span>
                <strong>Pulso Municipal · Sondeo Ciudadano</strong>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">Ámbito Geográfico</span>
                <strong>Distrito de Pucusana (Provincia de Lima, Perú)</strong>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">Universo Objetivo</span>
                <strong>Ciudadanos y vecinas mayores de 18 años</strong>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">Participación Verificada</span>
                <strong>{totalVotes} votos registrados en tiempo real</strong>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">Control de Votación</span>
                <strong>Control de voto único por navegador y sesión</strong>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">Periodo del Sondeo</span>
                <strong>Septiembre 2026 (Monitoreo continuo en vivo)</strong>
              </div>
            </div>
          </article>

          {/* Contexto y Ejes Decisivos */}
          <article className="editorial-card">
            <div className="section-badge"><MapPin size={15} /> CONTEXTO ELECTORAL 2026</div>
            <h2 className="editorial-heading">Los Retos y Prioridades de Pucusana para el Próximo Periodo</h2>
            <p className="editorial-text">
              Pucusana, reconocido como un distrito con vocación turística, pesquera y gastronómica en el sur de Lima, enfrenta desafíos urgentes que marcarán el debate de las Elecciones 2026. Los vecinos demandan que las agrupaciones políticas presenten planes concretos con presupuestos reales en las siguientes áreas:
            </p>

            <div className="pillars-grid">
              <div className="pillar-item">
                <div className="pillar-badge">01</div>
                <h3>Seguridad Ciudadana Integral</h3>
                <p>Fortalecimiento del serenazgo con videovigilancia interconectada, patrullaje en el borde costero y control seguro en los ingresos desde la Panamericana Sur.</p>
              </div>
              <div className="pillar-item">
                <div className="pillar-badge">02</div>
                <h3>Pesca Artesanal y Puerto</h3>
                <p>Protección y modernización del muelle artesanal de Pucusana, cadena de frío y apoyo a las cooperativas pesqueras locales.</p>
              </div>
              <div className="pillar-item">
                <div className="pillar-badge">03</div>
                <h3>Turismo Sostenible y Playas</h3>
                <p>Puesta en valor de la bahía, Naplo, el Boquerón del Diablo y fomento turístico durante los 12 meses del año con orden y limpieza.</p>
              </div>
              <div className="pillar-item">
                <div className="pillar-badge">04</div>
                <h3>Servicios Básicos y Vías</h3>
                <p>Abastecimiento garantizado de agua potable, alcantarillado y pavimentación en las zonas altas y nuevos asentamientos del distrito.</p>
              </div>
            </div>
          </article>

          {/* Candidatos en Contienda */}
          <article className="editorial-card">
            <div className="section-badge"><Users size={15} /> LISTA DE CANDIDATURAS</div>
            <h2 className="editorial-heading">Candidatos a la Alcaldía Distrital de Pucusana</h2>
            <p className="editorial-text">
              Conoce a los postulantes inscritos y las organizaciones políticas que compiten por el sillón municipal de Pucusana en este sondeo de septiembre 2026:
            </p>

            <div className="candidates-overview-grid">
              {ranked.map((cand, idx) => {
                const pct = totalVotes ? ((cand.votes / totalVotes) * 100).toFixed(1) : 0;
                return (
                  <div className="candidate-overview-card" key={cand.id}>
                    <div className="cand-top">
                      <span className="cand-rank-num">#{idx + 1}</span>
                      <div className="cand-avatar-logo" style={{ borderColor: cand.color }}>
                        {cand.logo}
                      </div>
                      <div className="cand-main-data">
                        <h4>{cand.name}</h4>
                        <span className="cand-party-name">{cand.party}</span>
                      </div>
                    </div>
                    <div className="cand-bottom-metric">
                      <div className="cand-metric-bar">
                        <span style={{ width: `${pct}%`, backgroundColor: cand.color }}></span>
                      </div>
                      <div className="cand-metric-values">
                        <span><b>{cand.votes}</b> votos</span>
                        <strong>{pct}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Foro de Participación y Comentarios de Vecinos */}
          <article className="editorial-card comments-card">
            <div className="comments-card-header">
              <div>
                <div className="section-badge"><MessageSquare size={15} /> FORO VECINAL</div>
                <h2 className="editorial-heading">Opinión y Voces Ciudadanas ({comments.length})</h2>
              </div>
              <span className="forum-status-pill">Abierto a la Comunidad</span>
            </div>

            <p className="editorial-text">
              ¿Qué esperas del próximo alcalde o alcaldesa de Pucusana? Comparte tu opinión con los vecinos del distrito:
            </p>

            <form className="comment-form-box" onSubmit={handleCommentSubmit}>
              <div className="form-inputs-row">
                <input
                  type="text"
                  placeholder="Tu nombre o seudónimo *"
                  value={newComment.name}
                  onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Zona o sector (ej. Naplo, Casco Central, Gruta)"
                  value={newComment.zone}
                  onChange={(e) => setNewComment({ ...newComment, zone: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Escribe aquí tu comentario, propuesta vecinal o motivo de voto..."
                rows={3}
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                required
              />
              <button type="submit" className="comment-post-btn">
                <Send size={15} /> Publicar opinión vecinal
              </button>
              {commentSent && (
                <div className="comment-post-alert">
                  <CheckCircle2 size={16} /> ¡Tu comentario ha sido publicado en el foro!
                </div>
              )}
            </form>

            <div className="comments-feed">
              {comments.map((comment) => (
                <div className="comment-feed-item" key={comment.id}>
                  <div className="comment-avatar-circle">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-feed-content">
                    <div className="comment-feed-top">
                      <strong className="comment-feed-author">{comment.author}</strong>
                      <span className="comment-feed-zone"><MapPin size={11} /> {comment.zone}</span>
                      <span className="comment-feed-time">{comment.date}</span>
                    </div>
                    <p className="comment-feed-paragraph">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <footer>
          <span>Proyecto demo · Pucusana 2026</span>
          <button onClick={resetDemo}><RotateCcw size={14}/> Reiniciar demo</button>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
