const request = require('supertest');
const app = require('../server/index');

describe('API Tests', () => {
  describe('Health Check', () => {
    test('GET /api/health should return status ok', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Recipe Routes', () => {
    test('GET /api/recipes should return empty array initially', async () => {
      const response = await request(app).get('/api/recipes');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/recipes should create a new recipe', async () => {
      const newRecipe = {
        title: 'Test Recipe',
        ingredients: ['Flour', 'Sugar'],
        steps: ['Mix ingredients', 'Bake'],
        cookingTime: '30 min',
        servings: 4,
        category: 'Dessert'
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(newRecipe);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Recipe');
      expect(response.body.id).toBeDefined();
    });
  });

  describe('Audio Analysis Routes', () => {
    test('POST /api/audio/analyze-video should return parsed recipe', async () => {
      const response = await request(app)
        .post('/api/audio/analyze-video')
        .send({
          videoUrl: 'https://www.tiktok.com/@user/video/123',
          platform: 'tiktok'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.parsedRecipe).toBeDefined();
    });
  });

  describe('Planner Routes', () => {
    test('GET /api/planner/meals should return empty array initially', async () => {
      const response = await request(app).get('/api/planner/meals');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/planner/shopping-list should return empty array initially', async () => {
      const response = await request(app).get('/api/planner/shopping-list');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
