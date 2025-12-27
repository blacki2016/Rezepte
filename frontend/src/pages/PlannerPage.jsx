import React, { useState, useEffect } from 'react';
import { plannerAPI, recipeAPI } from '../services/api';
import { Calendar, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import './PlannerPage.css';

function PlannerPage() {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const [selectedRecipe, setSelectedRecipe] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansResponse, recipesResponse] = await Promise.all([
        plannerAPI.getAll(),
        recipeAPI.getAll()
      ]);
      setMealPlans(plansResponse.data);
      setRecipes(recipesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMealPlan = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedMealType) {
      return;
    }

    try {
      await plannerAPI.create({
        date: selectedDate,
        mealType: selectedMealType,
        recipeId: selectedRecipe || null
      });
      
      await fetchData();
      setShowAddModal(false);
      setSelectedDate('');
      setSelectedRecipe('');
    } catch (error) {
      console.error('Error adding meal plan:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Möchtest du diesen Essensplan wirklich löschen?')) {
      return;
    }

    try {
      await plannerAPI.delete(planId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    }
  };

  const handleGenerateShoppingList = async () => {
    try {
      const planIds = mealPlans.map(plan => plan.id);
      const response = await plannerAPI.getShoppingList(planIds);
      setShoppingList(response.data);
    } catch (error) {
      console.error('Error generating shopping list:', error);
    }
  };

  const groupPlansByDate = () => {
    const grouped = {};
    mealPlans.forEach(plan => {
      if (!grouped[plan.date]) {
        grouped[plan.date] = [];
      }
      grouped[plan.date].push(plan);
    });
    return grouped;
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'Frühstück',
      lunch: 'Mittagessen',
      dinner: 'Abendessen',
      snack: 'Snack'
    };
    return labels[type] || type;
  };

  const groupedPlans = groupPlansByDate();
  const dates = Object.keys(groupedPlans).sort();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Essensplan wird geladen...</div>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <div className="container">
        <div className="planner-header">
          <h1>
            <Calendar size={32} />
            Essensplaner
          </h1>
          <p>Plane deine Mahlzeiten und generiere Einkaufslisten</p>
        </div>

        <div className="planner-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Mahlzeit hinzufügen
          </button>
          {mealPlans.length > 0 && (
            <button className="btn btn-outline" onClick={handleGenerateShoppingList}>
              <ShoppingCart size={20} />
              Einkaufsliste generieren
            </button>
          )}
        </div>

        {mealPlans.length === 0 ? (
          <div className="no-plans card">
            <Calendar size={64} />
            <h2>Keine Essenpläne vorhanden</h2>
            <p>Füge deine erste geplante Mahlzeit hinzu!</p>
          </div>
        ) : (
          <div className="meal-plans">
            {dates.map(date => (
              <div key={date} className="date-group card">
                <h3 className="date-header">
                  {new Date(date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="meals-grid">
                  {groupedPlans[date].map(plan => (
                    <div key={plan.id} className="meal-plan-item">
                      <div className="meal-header">
                        <span className="meal-type">{getMealTypeLabel(plan.mealType)}</span>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {plan.recipe ? (
                        <div className="meal-recipe">
                          <h4>{plan.recipe.title}</h4>
                          <p>{plan.recipe.description}</p>
                        </div>
                      ) : (
                        <p className="no-recipe">Kein Rezept zugewiesen</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {shoppingList && (
          <div className="shopping-list-modal" onClick={() => setShoppingList(null)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>
                <ShoppingCart size={24} />
                Einkaufsliste
              </h2>
              <p className="text-gray mb-3">
                {shoppingList.totalItems} Artikel
              </p>
              <ul className="shopping-items">
                {shoppingList.items.map((item, index) => (
                  <li key={index}>
                    <span className="item-amount">{item.amount} {item.unit}</span>
                    <span className="item-name">{item.item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary mt-3" onClick={() => setShoppingList(null)}>
                Schließen
              </button>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="add-modal" onClick={() => setShowAddModal(false)}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
              <h2>Mahlzeit hinzufügen</h2>
              <form onSubmit={handleAddMealPlan}>
                <div className="form-group">
                  <label htmlFor="date">Datum</label>
                  <input
                    type="date"
                    id="date"
                    className="input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mealType">Mahlzeit</label>
                  <select
                    id="mealType"
                    className="input"
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    required
                  >
                    <option value="breakfast">Frühstück</option>
                    <option value="lunch">Mittagessen</option>
                    <option value="dinner">Abendessen</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="recipe">Rezept (optional)</label>
                  <select
                    id="recipe"
                    className="input"
                    value={selectedRecipe}
                    onChange={(e) => setSelectedRecipe(e.target.value)}
                  >
                    <option value="">Kein Rezept</option>
                    {recipes.map(recipe => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Abbrechen
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Hinzufügen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlannerPage;
