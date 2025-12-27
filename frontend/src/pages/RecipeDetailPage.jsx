import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react';
import './RecipeDetailPage.css';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeAPI.getById(id);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Rezept wird geladen...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container">
        <div className="error-message card">
          <h2>Rezept nicht gefunden</h2>
          <button onClick={() => navigate('/recipes')} className="btn btn-primary mt-3">
            Zurück zu Rezepten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="container">
        <button onClick={() => navigate('/recipes')} className="back-button">
          <ArrowLeft size={20} />
          Zurück zu Rezepten
        </button>

        <div className="recipe-detail">
          <div className="recipe-header">
            <div className="recipe-title-section">
              <h1>{recipe.title}</h1>
              <p className="recipe-description-full">{recipe.description}</p>
            </div>

            <div className="recipe-info-bar">
              {recipe.prepTime && (
                <div className="info-item">
                  <Clock size={24} />
                  <div>
                    <span className="info-label">Zubereitungszeit</span>
                    <span className="info-value">{recipe.prepTime} Min</span>
                  </div>
                </div>
              )}

              {recipe.cookTime && (
                <div className="info-item">
                  <Clock size={24} />
                  <div>
                    <span className="info-label">Kochzeit</span>
                    <span className="info-value">{recipe.cookTime} Min</span>
                  </div>
                </div>
              )}

              {recipe.servings && (
                <div className="info-item">
                  <Users size={24} />
                  <div>
                    <span className="info-label">Portionen</span>
                    <span className="info-value">{recipe.servings}</span>
                  </div>
                </div>
              )}

              {recipe.difficulty && (
                <div className="info-item">
                  <ChefHat size={24} />
                  <div>
                    <span className="info-label">Schwierigkeit</span>
                    <span className="info-value">{recipe.difficulty}</span>
                  </div>
                </div>
              )}
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="recipe-tags-detail">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="recipe-content">
            <div className="recipe-section card">
              <h2>Zutaten</h2>
              <ul className="ingredients-list">
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <span className="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span className="ingredient-item">{ingredient.item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="recipe-section card">
              <h2>Zubereitung</h2>
              <ol className="instructions-list">
                {recipe.instructions && recipe.instructions.map((instruction, index) => (
                  <li key={index}>
                    <span className="step-number">Schritt {instruction.step}</span>
                    <p>{instruction.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            {recipe.source && (
              <div className="recipe-source-info card">
                <h3>Quelle</h3>
                <p>
                  Dieses Rezept wurde von {recipe.source.platform} importiert
                  {recipe.source.url && (
                    <>
                      {' - '}
                      <a href={recipe.source.url} target="_blank" rel="noopener noreferrer">
                        Zum Original
                      </a>
                    </>
                  )}
                </p>
                <small className="text-gray">
                  Verarbeitet am: {new Date(recipe.source.processedAt).toLocaleDateString('de-DE')}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;
