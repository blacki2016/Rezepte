import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecipeList.css';

function RecipeList({ recipes: propRecipes }) {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (propRecipes && propRecipes.length > 0) {
      setRecipes(propRecipes);
    }
  }, [propRecipes]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await axios.patch(`/api/recipes/${id}/favorite`);
      setRecipes(recipes.map(r => r.id === id ? response.data : r));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        setRecipes(recipes.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'favorites' && recipe.favorite) ||
                         (filter !== 'all' && filter !== 'favorites' && recipe.category === filter);
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="recipe-list">
      <div className="list-header">
        <h1>Meine Rezepte 📚</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rezept suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Alle
          </button>
          <button 
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilter('favorites')}
          >
            ❤️ Favoriten
          </button>
          <button 
            className={`filter-btn ${filter === 'Dessert' ? 'active' : ''}`}
            onClick={() => setFilter('Dessert')}
          >
            🍰 Dessert
          </button>
          <button 
            className={`filter-btn ${filter === 'Main' ? 'active' : ''}`}
            onClick={() => setFilter('Main')}
          >
            🍽️ Hauptgericht
          </button>
          <button 
            className={`filter-btn ${filter === 'Appetizer' ? 'active' : ''}`}
            onClick={() => setFilter('Appetizer')}
          >
            🥗 Vorspeise
          </button>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="no-recipes">
          <p>Keine Rezepte gefunden.</p>
          <Link to="/analyze" className="btn btn-primary">
            Erstes Rezept hinzufügen
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} />
                ) : (
                  <div className="placeholder-image">🍽️</div>
                )}
              </div>
              
              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                
                <div className="recipe-meta">
                  <span>⏱️ {recipe.cookingTime}</span>
                  <span>👥 {recipe.servings}</span>
                </div>

                <div className="recipe-category">
                  {recipe.category}
                </div>

                <div className="recipe-actions">
                  <Link to={`/recipe/${recipe.id}`} className="btn-view">
                    Ansehen
                  </Link>
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className="btn-favorite"
                  >
                    {recipe.favorite ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
