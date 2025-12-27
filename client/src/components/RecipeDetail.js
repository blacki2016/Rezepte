import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Lädt...</div>;
  }

  if (!recipe) {
    return <div className="error">Rezept nicht gefunden</div>;
  }

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate('/recipes')} className="back-button">
        ← Zurück zur Liste
      </button>

      <div className="detail-container">
        <div className="detail-header">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} className="detail-image" />
          ) : (
            <div className="detail-placeholder">🍽️</div>
          )}
          
          <h1>{recipe.title}</h1>
          
          <div className="detail-meta">
            <span>⏱️ {recipe.cookingTime}</span>
            <span>👥 {recipe.servings} Portionen</span>
            <span>🏷️ {recipe.category}</span>
          </div>

          {recipe.videoUrl && (
            <div className="video-link">
              <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer">
                🎥 Original Video ansehen
              </a>
            </div>
          )}
        </div>

        <div className="detail-content">
          <div className="ingredients-section">
            <h2>Zutaten</h2>
            <ul>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="steps-section">
            <h2>Zubereitung</h2>
            <ol>
              {recipe.steps && recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
