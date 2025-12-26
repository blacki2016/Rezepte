import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">Willkommen bei Rezepte AI 🍳</h1>
        <p className="hero-subtitle">
          Teile deine TikTok und Instagram Reels - Wir verwandeln sie durch KI Audio-Analyse in wunderschöne Rezepte!
        </p>
        <div className="hero-buttons">
          <Link to="/analyze" className="btn btn-primary">
            Video analysieren
          </Link>
          <Link to="/recipes" className="btn btn-secondary">
            Rezepte durchsuchen
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎥</div>
          <h3>Video Sharing</h3>
          <p>Teile TikTok und Instagram Reels direkt in der App</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>KI Audio-Analyse</h3>
          <p>Automatische Extraktion von Rezeptinformationen aus Videos</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Schöne Rezepte</h3>
          <p>Übersichtliche und ansprechende Rezeptdarstellung</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Essensplaner</h3>
          <p>Plane deine Mahlzeiten für die ganze Woche</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛒</div>
          <h3>Einkaufsliste</h3>
          <p>Automatische Einkaufslisten aus deinen Rezepten</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">❤️</div>
          <h3>Favoriten</h3>
          <p>Speichere deine Lieblingsrezepte</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
