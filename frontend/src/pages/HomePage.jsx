import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <h1>
            <Sparkles className="hero-icon" />
            AI-Powered Rezepte App
          </h1>
          <p className="hero-subtitle">
            Teile deine Lieblings-Rezept-Videos von TikTok und Instagram - 
            unsere KI verwandelt sie in wunderschön formatierte Rezepte!
          </p>
          <div className="hero-actions">
            <Link to="/import" className="btn btn-primary btn-large">
              Video importieren
            </Link>
            <Link to="/recipes" className="btn btn-outline btn-large">
              Rezepte durchsuchen
            </Link>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">Features</h2>
          <div className="grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">
                <TrendingUp size={40} />
              </div>
              <h3>Social Media Import</h3>
              <p>
                Importiere Rezept-Videos direkt von TikTok und Instagram Reels. 
                Einfach URL einfügen und fertig!
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <Sparkles size={40} />
              </div>
              <h3>KI-Audio-Analyse</h3>
              <p>
                Unsere fortschrittliche KI analysiert das Audio aus deinen Videos
                und extrahiert automatisch alle Rezeptinformationen.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <ChefHat size={40} />
              </div>
              <h3>Schöne Rezepte</h3>
              <p>
                Erhalte vollständig formatierte Rezepte mit Zutaten, 
                Schritt-für-Schritt-Anleitungen und allen Details.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <Calendar size={40} />
              </div>
              <h3>Essensplaner</h3>
              <p>
                Plane deine Mahlzeiten für die Woche und generiere automatisch
                Einkaufslisten basierend auf deinen Plänen.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <ChefHat size={40} />
              </div>
              <h3>Rezept-Verwaltung</h3>
              <p>
                Speichere, organisiere und durchsuche all deine Lieblingsrezepte
                an einem Ort.
              </p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <TrendingUp size={40} />
              </div>
              <h3>Moderne UI</h3>
              <p>
                Genieße eine moderne, intuitive Benutzeroberfläche, die das
                Kochen zum Vergnügen macht.
              </p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2 className="section-title">So funktioniert's</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Video teilen</h3>
              <p>Kopiere den Link zu einem Rezept-Video von TikTok oder Instagram</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>KI-Analyse</h3>
              <p>Unsere KI analysiert das Audio und extrahiert das Rezept</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Rezept erhalten</h3>
              <p>Erhalte ein vollständig formatiertes, schönes Rezept zum Kochen</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-card card">
            <h2>Bereit anzufangen?</h2>
            <p>Importiere dein erstes Rezept-Video und erlebe die Magie der KI!</p>
            <Link to="/import" className="btn btn-primary btn-large">
              Jetzt starten
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
