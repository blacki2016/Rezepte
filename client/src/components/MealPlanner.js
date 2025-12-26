import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MealPlanner.css';

function MealPlanner() {
  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    date: '',
    mealType: 'breakfast',
    recipeId: '',
    recipeName: ''
  });

  useEffect(() => {
    fetchMeals();
    fetchRecipes();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get('/api/planner/meals');
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/planner/meals', newMeal);
      setMeals([...meals, response.data]);
      setNewMeal({ date: '', mealType: 'breakfast', recipeId: '', recipeName: '' });
      setShowAddMeal(false);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const handleRecipeChange = (e) => {
    const selectedRecipe = recipes.find(r => r.id === parseInt(e.target.value));
    setNewMeal({
      ...newMeal,
      recipeId: e.target.value,
      recipeName: selectedRecipe ? selectedRecipe.title : ''
    });
  };

  const deleteMeal = async (id) => {
    try {
      await axios.delete(`/api/planner/meals/${id}`);
      setMeals(meals.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const getMealsByDate = () => {
    const grouped = {};
    meals.forEach(meal => {
      if (!grouped[meal.date]) {
        grouped[meal.date] = [];
      }
      grouped[meal.date].push(meal);
    });
    return grouped;
  };

  const groupedMeals = getMealsByDate();
  const dates = Object.keys(groupedMeals).sort();

  const getMealTypeIcon = (type) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeName = (type) => {
    switch (type) {
      case 'breakfast': return 'Frühstück';
      case 'lunch': return 'Mittagessen';
      case 'dinner': return 'Abendessen';
      case 'snack': return 'Snack';
      default: return type;
    }
  };

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h1>Essensplaner 📅</h1>
        <button onClick={() => setShowAddMeal(!showAddMeal)} className="btn btn-primary">
          {showAddMeal ? 'Abbrechen' : '+ Mahlzeit hinzufügen'}
        </button>
      </div>

      {showAddMeal && (
        <div className="add-meal-form">
          <h3>Neue Mahlzeit planen</h3>
          <form onSubmit={handleAddMeal}>
            <div className="form-group">
              <label>Datum:</label>
              <input
                type="date"
                value={newMeal.date}
                onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Mahlzeit:</label>
              <select
                value={newMeal.mealType}
                onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                className="form-control"
              >
                <option value="breakfast">Frühstück</option>
                <option value="lunch">Mittagessen</option>
                <option value="dinner">Abendessen</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rezept:</label>
              <select
                value={newMeal.recipeId}
                onChange={handleRecipeChange}
                required
                className="form-control"
              >
                <option value="">Rezept auswählen</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Hinzufügen
            </button>
          </form>
        </div>
      )}

      <div className="planner-content">
        {dates.length === 0 ? (
          <div className="no-meals">
            <p>Noch keine Mahlzeiten geplant.</p>
            <p>Füge deine erste Mahlzeit hinzu!</p>
          </div>
        ) : (
          <div className="meals-timeline">
            {dates.map(date => (
              <div key={date} className="date-group">
                <h2 className="date-header">
                  {new Date(date + 'T00:00:00').toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
                <div className="meals-list">
                  {groupedMeals[date].map(meal => (
                    <div key={meal.id} className="meal-card">
                      <div className="meal-icon">
                        {getMealTypeIcon(meal.mealType)}
                      </div>
                      <div className="meal-info">
                        <div className="meal-type">{getMealTypeName(meal.mealType)}</div>
                        <div className="meal-name">{meal.recipeName}</div>
                      </div>
                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="btn-delete-meal"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MealPlanner;
