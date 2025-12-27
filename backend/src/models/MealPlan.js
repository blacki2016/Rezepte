// In-memory storage for meal plans
class MealPlanStore {
  constructor() {
    this.mealPlans = [];
    this.nextId = 1;
  }

  create(planData) {
    const plan = {
      id: this.nextId++,
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mealPlans.push(plan);
    return plan;
  }

  findAll() {
    return this.mealPlans;
  }

  findById(id) {
    return this.mealPlans.find(p => p.id === parseInt(id));
  }

  findByDateRange(startDate, endDate) {
    return this.mealPlans.filter(p => {
      const planDate = new Date(p.date);
      return planDate >= new Date(startDate) && planDate <= new Date(endDate);
    });
  }

  update(id, updates) {
    const index = this.mealPlans.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.mealPlans[index] = {
        ...this.mealPlans[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.mealPlans[index];
    }
    return null;
  }

  delete(id) {
    const index = this.mealPlans.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.mealPlans.splice(index, 1);
      return deleted[0];
    }
    return null;
  }

  generateShoppingList(planIds) {
    const plans = this.mealPlans.filter(p => planIds.includes(p.id));
    const ingredientsMap = new Map();

    plans.forEach(plan => {
      if (plan.recipe && plan.recipe.ingredients) {
        plan.recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.item}_${ingredient.unit}`;
          if (ingredientsMap.has(key)) {
            const existing = ingredientsMap.get(key);
            existing.amount = parseFloat(existing.amount) + parseFloat(ingredient.amount);
          } else {
            ingredientsMap.set(key, { ...ingredient });
          }
        });
      }
    });

    return Array.from(ingredientsMap.values());
  }
}

export default new MealPlanStore();
