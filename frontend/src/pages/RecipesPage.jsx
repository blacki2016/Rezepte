import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import { ChefHat, Search, Clock, Users } from 'lucide-react';
import './RecipesPage.css';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await recipeAPI.getAll();
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchRecipes();
      return;
    }

    try {
      const response = await recipeAPI.getAll({ search: searchQuery });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const filterRecipes = () => {
    if (selectedCategory === 'all') {
      return recipes;
    }
    return recipes.filter(recipe => recipe.category === selectedCategory);
  };

  const categories = ['all', 'Hauptgericht', 'Dessert', 'Vorspeise', 'Snack', 'Getränk'];

  const filteredRecipes = filterRecipes();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Rezepte werden geladen...</div>
      </div>
    );
  }

  return (
    <div className="recipes-page">
      <div className="container">
        <div className="recipes-header">
          <h1>
            <ChefHat size={32} />
            Alle Rezepte
          </h1>
          <p>Entdecke und verwalte deine Rezeptsammlung</p>
        </div>

        <div className="recipes-controls">
          <div className="search-bar">
            <input
              type="text"
              className="input"
              placeholder="Rezepte suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <Search size={20} />
              Suchen
            </button>
          </div>

          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Alle' : category}
              </button>
            ))}
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="no-recipes card">
            <ChefHat size={64} />
            <h2>Keine Rezepte gefunden</h2>
            <p>Importiere dein erstes Rezept-Video, um loszulegen!</p>
            <Link to="/import" className="btn btn-primary mt-3">
              Video importieren
            </Link>
          </div>
        ) : (
          <div className="recipes-grid">
            {filteredRecipes.map(recipe => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card card">
                <div className="recipe-card-header">
                  <h3>{recipe.title}</h3>
                  {recipe.difficulty && (
                    <span className={`difficulty ${recipe.difficulty}`}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
                
                <p className="recipe-description">{recipe.description}</p>
                
                <div className="recipe-meta">
                  {recipe.prepTime && (
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{recipe.prepTime + (recipe.cookTime || 0)} Min</span>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{recipe.servings} Portionen</span>
                    </div>
                  )}
                </div>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="recipe-tags">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                {recipe.source && (
                  <div className="recipe-source">
                    <small>Aus {recipe.source.platform}</small>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipesPage;
