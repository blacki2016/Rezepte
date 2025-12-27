import React, { useState } from 'react';
import { videoAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Video, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './ImportPage.css';

function ImportPage() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Bitte gib eine Video-URL ein');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await videoAPI.processUrl(url, platform);
      setResult(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Verarbeiten des Videos');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = () => {
    if (result && result.recipe) {
      navigate(`/recipes/${result.recipe.id}`);
    }
  };

  return (
    <div className="import-page">
      <div className="container">
        <div className="import-header">
          <h1>
            <Upload size={32} />
            Video importieren
          </h1>
          <p>Teile einen Link zu einem Rezept-Video von TikTok oder Instagram</p>
        </div>

        <div className="import-content">
          <div className="import-form-container card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="platform">Plattform auswählen</label>
                <div className="platform-selector">
                  <button
                    type="button"
                    className={`platform-btn ${platform === 'tiktok' ? 'active' : ''}`}
                    onClick={() => setPlatform('tiktok')}
                  >
                    <Video size={20} />
                    TikTok
                  </button>
                  <button
                    type="button"
                    className={`platform-btn ${platform === 'instagram' ? 'active' : ''}`}
                    onClick={() => setPlatform('instagram')}
                  >
                    <Video size={20} />
                    Instagram Reels
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="url">Video-URL</label>
                <input
                  type="text"
                  id="url"
                  className="input"
                  placeholder={
                    platform === 'tiktok' 
                      ? 'https://www.tiktok.com/@user/video/...' 
                      : 'https://www.instagram.com/reel/...'
                  }
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Video wird verarbeitet...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Video analysieren
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="alert alert-success">
                <CheckCircle size={20} />
                <div>
                  <strong>Erfolgreich!</strong>
                  <p>Das Video wurde analysiert und das Rezept wurde erstellt.</p>
                  <button onClick={handleViewRecipe} className="btn btn-outline mt-2">
                    Rezept anzeigen
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="info-section">
            <div className="info-card card">
              <h3>Wie funktioniert's?</h3>
              <ol>
                <li>Wähle die Platform (TikTok oder Instagram)</li>
                <li>Kopiere die URL des Rezept-Videos</li>
                <li>Füge die URL ein und klicke auf "Video analysieren"</li>
                <li>Unsere KI extrahiert automatisch das Rezept aus dem Audio</li>
              </ol>
            </div>

            <div className="info-card card">
              <h3>Demo-Modus</h3>
              <p>
                Diese Demo-Version zeigt, wie die App funktionieren würde. 
                Da TikTok und Instagram API-Zugriff erfordern, wird ein 
                Beispiel-Rezept generiert.
              </p>
              <p className="text-sm text-gray mt-2">
                In der Produktionsversion würde die App:
              </p>
              <ul className="text-sm text-gray">
                <li>Das Video von der URL herunterladen</li>
                <li>Audio aus dem Video extrahieren</li>
                <li>Audio mit Whisper API transkribieren</li>
                <li>Rezept mit GPT-4 aus dem Transkript extrahieren</li>
              </ul>
            </div>

            <div className="info-card card">
              <h3>Tipps</h3>
              <ul>
                <li>Wähle Videos mit klarer Audio-Qualität</li>
                <li>Videos sollten deutliche Rezeptanweisungen enthalten</li>
                <li>Du kannst das extrahierte Rezept später bearbeiten</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportPage;
