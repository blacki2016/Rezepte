import React, { useState } from 'react';
import axios from 'axios';
import './VideoAnalyzer.css';

function VideoAnalyzer({ addRecipe }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/audio/analyze-video', {
        videoUrl,
        platform
      });

      setResult(response.data);
    } catch (err) {
      setError('Fehler beim Analysieren des Videos. Bitte versuchen Sie es erneut.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!result || !result.parsedRecipe) return;

    try {
      const recipeData = {
        ...result.parsedRecipe,
        videoUrl: result.videoUrl,
        ingredients: result.parsedRecipe.ingredients.map(ing => 
          `${ing.amount} ${ing.name}`
        )
      };

      const response = await axios.post('/api/recipes', recipeData);
      addRecipe(response.data);
      alert('Rezept erfolgreich gespeichert!');
      setResult(null);
      setVideoUrl('');
    } catch (err) {
      alert('Fehler beim Speichern des Rezepts');
      console.error(err);
    }
  };

  return (
    <div className="video-analyzer">
      <div className="analyzer-container">
        <h1 className="analyzer-title">Video Analysieren 🎥</h1>
        <p className="analyzer-subtitle">
          Füge einen Link zu deinem TikTok oder Instagram Reel hinzu und lass die KI das Rezept extrahieren
        </p>

        <form onSubmit={handleAnalyze} className="analyzer-form">
          <div className="form-group">
            <label htmlFor="platform">Plattform:</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="form-control"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="other">Andere</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="videoUrl">Video URL:</label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@user/video/..."
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analysiere...' : 'Video Analysieren'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && result.parsedRecipe && (
          <div className="result-container">
            <h2 className="result-title">Extrahiertes Rezept</h2>
            
            <div className="recipe-preview">
              <h3>{result.parsedRecipe.title}</h3>
              
              <div className="recipe-meta">
                <span>⏱️ {result.parsedRecipe.cookingTime}</span>
                <span>👥 {result.parsedRecipe.servings} Portionen</span>
                <span>🏷️ {result.parsedRecipe.category}</span>
              </div>

              <div className="recipe-section">
                <h4>Zutaten:</h4>
                <ul>
                  {result.parsedRecipe.ingredients.map((ing, index) => (
                    <li key={index}>{ing.amount} {ing.name}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h4>Anleitung:</h4>
                <ol>
                  {result.parsedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="recipe-section">
                <h4>Transkription:</h4>
                <p className="transcription">{result.transcription}</p>
              </div>

              <button onClick={handleSaveRecipe} className="btn btn-success">
                Rezept Speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoAnalyzer;
