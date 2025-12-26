const express = require('express');
const router = express.Router();

// In-memory storage for recipes (replace with database in production)
let recipes = [];
let nextId = 1;

// Get all recipes
router.get('/', (req, res) => {
  res.json(recipes);
});

// Get recipe by ID
router.get('/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

// Create new recipe
router.post('/', (req, res) => {
  const { title, ingredients, steps, cookingTime, servings, category, imageUrl, videoUrl } = req.body;
  
  const newRecipe = {
    id: nextId++,
    title,
    ingredients: ingredients || [],
    steps: steps || [],
    cookingTime: cookingTime || '',
    servings: servings || 1,
    category: category || 'Other',
    imageUrl: imageUrl || '',
    videoUrl: videoUrl || '',
    createdAt: new Date().toISOString(),
    favorite: false
  };
  
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// Update recipe
router.put('/:id', (req, res) => {
  const recipeIndex = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (recipeIndex === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  recipes[recipeIndex] = {
    ...recipes[recipeIndex],
    ...req.body,
    id: recipes[recipeIndex].id,
    createdAt: recipes[recipeIndex].createdAt
  };
  
  res.json(recipes[recipeIndex]);
});

// Delete recipe
router.delete('/:id', (req, res) => {
  const recipeIndex = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (recipeIndex === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  recipes.splice(recipeIndex, 1);
  res.json({ message: 'Recipe deleted successfully' });
});

// Toggle favorite
router.patch('/:id/favorite', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  recipe.favorite = !recipe.favorite;
  res.json(recipe);
});

module.exports = router;
