# Demo Script for Rezepte App

This script provides a quick walkthrough of the app's features using curl commands.

## Prerequisites
- Server running on http://localhost:5000

## Start the Server
```bash
npm run dev
```

## API Demo

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected output:
```json
{
  "status": "ok",
  "message": "Rezepte API is running"
}
```

### 2. Analyze a Video URL
```bash
curl -X POST http://localhost:5000/api/audio/analyze-video \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.tiktok.com/@chef/video/123456",
    "platform": "tiktok"
  }'
```

Expected output:
```json
{
  "success": true,
  "videoUrl": "https://www.tiktok.com/@chef/video/123456",
  "platform": "tiktok",
  "transcription": "Mock transcription: Mix 2 cups flour, 1 cup sugar, 3 eggs. Bake at 180°C for 30 minutes.",
  "parsedRecipe": {
    "title": "Delicious Cake from Video",
    "ingredients": [
      {"name": "Flour", "amount": "2 cups"},
      {"name": "Sugar", "amount": "1 cup"},
      {"name": "Eggs", "amount": "3"}
    ],
    "steps": [
      "Mix flour and sugar together",
      "Add eggs and mix well",
      "Bake at 180°C for 30 minutes"
    ],
    "cookingTime": "30 minutes",
    "servings": 8,
    "category": "Dessert"
  }
}
```

### 3. Create a Recipe
```bash
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chocolate Cake",
    "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs", "1 cup cocoa powder"],
    "steps": ["Mix dry ingredients", "Add eggs", "Bake at 180°C for 30 minutes"],
    "cookingTime": "30 minutes",
    "servings": 8,
    "category": "Dessert"
  }'
```

### 4. Get All Recipes
```bash
curl http://localhost:5000/api/recipes
```

### 5. Get Recipe by ID
```bash
curl http://localhost:5000/api/recipes/1
```

### 6. Toggle Recipe Favorite
```bash
curl -X PATCH http://localhost:5000/api/recipes/1/favorite
```

### 7. Plan a Meal
```bash
curl -X POST http://localhost:5000/api/planner/meals \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-27",
    "mealType": "dinner",
    "recipeId": 1,
    "recipeName": "Chocolate Cake"
  }'
```

### 8. Get Meal Plan
```bash
curl http://localhost:5000/api/planner/meals
```

### 9. Add Shopping List Item
```bash
curl -X POST http://localhost:5000/api/planner/shopping-list \
  -H "Content-Type: application/json" \
  -d '{
    "item": "Flour",
    "quantity": "2 cups",
    "category": "Pantry"
  }'
```

### 10. Get Shopping List
```bash
curl http://localhost:5000/api/planner/shopping-list
```

### 11. Toggle Shopping List Item
```bash
curl -X PATCH http://localhost:5000/api/planner/shopping-list/1/toggle
```

### 12. Delete Recipe
```bash
curl -X DELETE http://localhost:5000/api/recipes/1
```

## Frontend Demo

1. Start the client:
```bash
npm run client
```

2. Open http://localhost:3000 in your browser

3. Navigate through the features:
   - **Home**: See all features overview
   - **Video Analyzer**: Paste a video URL and analyze it
   - **Recipes**: View all recipes, filter by category or favorites
   - **Meal Planner**: Plan your meals for the week
   - **Shopping List**: Create and manage your shopping list

## Complete Workflow Demo

```bash
# 1. Analyze a TikTok video
VIDEO_RESPONSE=$(curl -s -X POST http://localhost:5000/api/audio/analyze-video \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.tiktok.com/@chef/video/123456",
    "platform": "tiktok"
  }')

echo "Video Analysis Result:"
echo $VIDEO_RESPONSE | jq .

# 2. Create recipe from analysis
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Delicious Cake from Video",
    "ingredients": ["2 cups Flour", "1 cup Sugar", "3 Eggs"],
    "steps": ["Mix flour and sugar together", "Add eggs and mix well", "Bake at 180°C for 30 minutes"],
    "cookingTime": "30 minutes",
    "servings": 8,
    "category": "Dessert",
    "videoUrl": "https://www.tiktok.com/@chef/video/123456"
  }'

# 3. Plan it for dinner tomorrow
curl -X POST http://localhost:5000/api/planner/meals \
  -H "Content-Type: application/json" \
  -d "{
    \"date\": \"$(date -d tomorrow '+%Y-%m-%d')\",
    \"mealType\": \"dinner\",
    \"recipeId\": 1,
    \"recipeName\": \"Delicious Cake from Video\"
  }"

# 4. Add ingredients to shopping list
curl -X POST http://localhost:5000/api/planner/shopping-list \
  -H "Content-Type: application/json" \
  -d '{"item": "Flour", "quantity": "2 cups", "category": "Pantry"}'

curl -X POST http://localhost:5000/api/planner/shopping-list \
  -H "Content-Type: application/json" \
  -d '{"item": "Sugar", "quantity": "1 cup", "category": "Pantry"}'

curl -X POST http://localhost:5000/api/planner/shopping-list \
  -H "Content-Type: application/json" \
  -d '{"item": "Eggs", "quantity": "3", "category": "Dairy"}'

# 5. View everything
echo "\n=== All Recipes ==="
curl -s http://localhost:5000/api/recipes | jq .

echo "\n=== Meal Plan ==="
curl -s http://localhost:5000/api/planner/meals | jq .

echo "\n=== Shopping List ==="
curl -s http://localhost:5000/api/planner/shopping-list | jq .
```

## Notes
- All data is stored in-memory and will be lost when the server restarts
- For production use, integrate with a database (see DEPLOYMENT.md)
- For real AI analysis, follow AI_INTEGRATION.md
