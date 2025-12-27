import express from 'express';
import MealPlanStore from '../models/MealPlan.js';
import RecipeStore from '../models/Recipe.js';

const router = express.Router();

// Get all meal plans
router.get('/', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let plans;
    if (startDate && endDate) {
      plans = MealPlanStore.findByDateRange(startDate, endDate);
    } else {
      plans = MealPlanStore.findAll();
    }
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single meal plan
router.get('/:id', (req, res) => {
  try {
    const plan = MealPlanStore.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new meal plan
router.post('/', (req, res) => {
  try {
    const { date, mealType, recipeId } = req.body;
    
    if (!date || !mealType) {
      return res.status(400).json({ 
        error: 'Date and meal type are required' 
      });
    }

    // Get recipe details if recipeId is provided
    let recipe = null;
    if (recipeId) {
      recipe = RecipeStore.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
    }

    const plan = MealPlanStore.create({
      date,
      mealType, // breakfast, lunch, dinner, snack
      recipeId: recipeId || null,
      recipe: recipe || null
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meal plan
router.put('/:id', (req, res) => {
  try {
    const { recipeId, ...updates } = req.body;
    
    // Get recipe details if recipeId is updated
    if (recipeId) {
      const recipe = RecipeStore.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      updates.recipe = recipe;
      updates.recipeId = recipeId;
    }

    const plan = MealPlanStore.update(req.params.id, updates);
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete meal plan
router.delete('/:id', (req, res) => {
  try {
    const plan = MealPlanStore.delete(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate shopping list from meal plans
router.post('/shopping-list', (req, res) => {
  try {
    const { planIds } = req.body;
    
    if (!planIds || !Array.isArray(planIds)) {
      return res.status(400).json({ 
        error: 'planIds array is required' 
      });
    }

    const shoppingList = MealPlanStore.generateShoppingList(planIds);
    
    res.json({
      items: shoppingList,
      totalItems: shoppingList.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
