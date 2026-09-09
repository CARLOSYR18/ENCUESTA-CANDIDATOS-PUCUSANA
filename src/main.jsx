import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Award, BarChart3, CheckCircle2, ChevronLeft, ChevronRight, Info, RotateCcw, ShieldCheck, TrendingUp, Users, Vote } from "lucide-react";
import "./styles.css";
import logoPucusana from "./assets/logo-pucusana.png";
import bannerMaquinarias from "./assets/banner-maquinarias.png";
import bannerBienvenidos from "./assets/banner-bienvenidos.png";
import bannerObras from "./assets/banner-obras.png";

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  }, [candidates]);

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

        <footer>
          <span>Proyecto demo · Pucusana 2026</span>
          <button onClick={resetDemo}><RotateCcw size={14}/> Reiniciar demo</button>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
