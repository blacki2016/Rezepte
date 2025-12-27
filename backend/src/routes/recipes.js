import express from 'express';
import RecipeStore from '../models/Recipe.js';

const router = express.Router();

// Get all recipes
router.get('/', (req, res) => {
  try {
    const { category, tags, search } = req.query;
    
    let recipes;
    if (search) {
      recipes = RecipeStore.search(search);
    } else if (category) {
      recipes = RecipeStore.findByCategory(category);
    } else if (tags) {
      const tagArray = tags.split(',');
      recipes = RecipeStore.findByTags(tagArray);
    } else {
      recipes = RecipeStore.findAll();
    }
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single recipe
router.get('/:id', (req, res) => {
  try {
    const recipe = RecipeStore.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new recipe
router.post('/', (req, res) => {
  try {
    const recipe = RecipeStore.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update recipe
router.put('/:id', (req, res) => {
  try {
    const recipe = RecipeStore.update(req.params.id, req.body);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete recipe
router.delete('/:id', (req, res) => {
  try {
    const recipe = RecipeStore.delete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
