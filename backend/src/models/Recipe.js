// In-memory storage (replace with MongoDB in production)
class RecipeStore {
  constructor() {
    this.recipes = [];
    this.nextId = 1;
  }

  create(recipeData) {
    const recipe = {
      id: this.nextId++,
      ...recipeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.recipes.push(recipe);
    return recipe;
  }

  findAll() {
    return this.recipes;
  }

  findById(id) {
    return this.recipes.find(r => r.id === parseInt(id));
  }

  findByCategory(category) {
    return this.recipes.filter(r => r.category === category);
  }

  findByTags(tags) {
    return this.recipes.filter(r => 
      r.tags && r.tags.some(tag => tags.includes(tag))
    );
  }

  update(id, updates) {
    const index = this.recipes.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      this.recipes[index] = {
        ...this.recipes[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.recipes[index];
    }
    return null;
  }

  delete(id) {
    const index = this.recipes.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.recipes.splice(index, 1);
      return deleted[0];
    }
    return null;
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.recipes.filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      (r.tags && r.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }
}

export default new RecipeStore();
