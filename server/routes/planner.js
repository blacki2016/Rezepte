const express = require('express');
const router = express.Router();

// In-memory storage for meal plans
let mealPlans = [];
let shoppingLists = [];

// Get all meal plans
router.get('/meals', (req, res) => {
  res.json(mealPlans);
});

// Add meal to plan
router.post('/meals', (req, res) => {
  const { date, mealType, recipeId, recipeName } = req.body;
  
  const newMeal = {
    id: Date.now(),
    date,
    mealType, // breakfast, lunch, dinner, snack
    recipeId,
    recipeName,
    completed: false
  };
  
  mealPlans.push(newMeal);
  res.status(201).json(newMeal);
});

// Update meal plan
router.put('/meals/:id', (req, res) => {
  const mealIndex = mealPlans.findIndex(m => m.id === parseInt(req.params.id));
  if (mealIndex === -1) {
    return res.status(404).json({ error: 'Meal plan not found' });
  }
  
  mealPlans[mealIndex] = {
    ...mealPlans[mealIndex],
    ...req.body,
    id: mealPlans[mealIndex].id
  };
  
  res.json(mealPlans[mealIndex]);
});

// Delete meal from plan
router.delete('/meals/:id', (req, res) => {
  const mealIndex = mealPlans.findIndex(m => m.id === parseInt(req.params.id));
  if (mealIndex === -1) {
    return res.status(404).json({ error: 'Meal plan not found' });
  }
  
  mealPlans.splice(mealIndex, 1);
  res.json({ message: 'Meal plan deleted successfully' });
});

// Get shopping list
router.get('/shopping-list', (req, res) => {
  res.json(shoppingLists);
});

// Add item to shopping list
router.post('/shopping-list', (req, res) => {
  const { item, quantity, category } = req.body;
  
  const newItem = {
    id: Date.now(),
    item,
    quantity: quantity || '',
    category: category || 'Other',
    checked: false
  };
  
  shoppingLists.push(newItem);
  res.status(201).json(newItem);
});

// Toggle shopping list item
router.patch('/shopping-list/:id/toggle', (req, res) => {
  const item = shoppingLists.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  item.checked = !item.checked;
  res.json(item);
});

// Delete shopping list item
router.delete('/shopping-list/:id', (req, res) => {
  const itemIndex = shoppingLists.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  shoppingLists.splice(itemIndex, 1);
  res.json({ message: 'Item deleted successfully' });
});

// Generate shopping list from meal plan
router.post('/generate-shopping-list', (req, res) => {
  const { startDate, endDate, recipes } = req.body;
  
  // In production, this would aggregate ingredients from selected recipes
  // For now, return a success message
  res.json({
    success: true,
    message: 'Shopping list generated from meal plan',
    itemsAdded: 0
  });
});

module.exports = router;
