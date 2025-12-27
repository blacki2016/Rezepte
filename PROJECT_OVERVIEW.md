# Project Overview 📊

## What This App Does

**Rezepte** is a modern recipe and food planning application that uses AI to transform TikTok and Instagram Reels into beautiful, structured recipes.

### User Journey

```
1. User shares TikTok/Instagram Reel URL
         ↓
2. AI analyzes video audio
         ↓
3. AI extracts recipe information
   - Title
   - Ingredients
   - Steps
   - Time & Servings
         ↓
4. User saves beautiful recipe
         ↓
5. User plans meals for the week
         ↓
6. App generates shopping list
         ↓
7. User goes shopping ✓
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│              React 18 + Router                   │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Home    │ │  Video   │ │ Recipes  │        │
│  │  Page    │ │ Analyzer │ │  List    │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Recipe  │ │   Meal   │ │ Shopping │        │
│  │  Detail  │ │  Planner │ │   List   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────┘
                      ↕ HTTP/JSON
┌─────────────────────────────────────────────────┐
│                   Backend                        │
│              Node.js + Express                   │
│                                                   │
│  ┌──────────────────────────────────────────┐  │
│  │           API Routes                      │  │
│  │                                            │  │
│  │  /api/recipes      - Recipe CRUD          │  │
│  │  /api/audio        - AI Analysis          │  │
│  │  /api/planner      - Meal Planning        │  │
│  │                      Shopping List         │  │
│  └──────────────────────────────────────────┘  │
│                      ↕                           │
│  ┌──────────────────────────────────────────┐  │
│  │        In-Memory Storage                  │  │
│  │    (Ready for DB integration)             │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Project Structure

```
Rezepte/
├── 📄 Documentation
│   ├── README.md           # Main documentation
│   ├── QUICKSTART.md       # 5-minute setup guide
│   ├── DEPLOYMENT.md       # Production deployment
│   ├── AI_INTEGRATION.md   # Real AI setup guide
│   ├── DEMO.md            # API examples
│   ├── SECURITY.md        # Security best practices
│   └── PROJECT_OVERVIEW.md # This file
│
├── 🔧 Configuration
│   ├── package.json        # Root dependencies
│   ├── .env.example       # Environment template
│   ├── .gitignore         # Git ignore rules
│   └── jest.config.js     # Test configuration
│
├── 🖥️ Backend (server/)
│   ├── index.js           # Express server
│   └── routes/
│       ├── recipes.js     # Recipe CRUD
│       ├── audio.js       # AI analysis
│       └── planner.js     # Meal planning
│
├── 🎨 Frontend (client/)
│   ├── package.json       # Client dependencies
│   ├── public/
│   │   └── index.html     # HTML template
│   └── src/
│       ├── index.js       # React entry point
│       ├── App.js         # Main app component
│       └── components/
│           ├── Home.js           # Landing page
│           ├── VideoAnalyzer.js  # Video input
│           ├── RecipeList.js     # Recipe grid
│           ├── RecipeDetail.js   # Recipe view
│           ├── MealPlanner.js    # Meal calendar
│           └── ShoppingList.js   # Shopping list
│
└── 🧪 Tests (tests/)
    └── api.test.js        # API integration tests
```

## Technology Stack

### Frontend
| Technology      | Purpose                    | Version |
|----------------|----------------------------|---------|
| React          | UI Framework               | 18.2.0  |
| React Router   | Navigation                 | 6.20.1  |
| Axios          | HTTP Client                | 1.6.2   |
| CSS            | Styling (Custom)           | -       |

### Backend
| Technology      | Purpose                    | Version |
|----------------|----------------------------|---------|
| Node.js        | Runtime                    | 16+     |
| Express        | Web Framework              | 4.18.2  |
| Multer         | File Upload                | 1.4.5   |
| Axios          | HTTP Client                | 1.6.2   |
| CORS           | Cross-Origin Support       | 2.8.5   |

### Development
| Technology      | Purpose                    | Version |
|----------------|----------------------------|---------|
| Nodemon        | Auto-restart               | 3.0.2   |
| Jest           | Testing Framework          | 29.7.0  |
| Supertest      | API Testing                | 6.3.3   |

## Key Features Detail

### 1. Video Analysis 🎥
- **Input**: TikTok/Instagram Reel URL
- **Process**: Mock AI extraction (production-ready for real AI)
- **Output**: Structured recipe data
- **Technologies**: Express route, multer for file upload

### 2. Recipe Management 📚
- **CRUD Operations**: Create, Read, Update, Delete
- **Features**: Favorites, categories, search
- **Storage**: In-memory (production: MongoDB/PostgreSQL)
- **UI**: Card grid with responsive design

### 3. Meal Planning 📅
- **Organization**: By date and meal type
- **Meal Types**: Breakfast, Lunch, Dinner, Snack
- **Display**: Timeline view with icons
- **Integration**: Links to recipe database

### 4. Shopping List 🛒
- **Features**: Categories, quantities, checkboxes
- **Categories**: Vegetables, Fruits, Dairy, Meat, etc.
- **Persistence**: In-memory (production: database)
- **UX**: Category grouping for easy shopping

## Data Flow Example

### Creating a Recipe from Video

```javascript
// 1. User submits video URL
POST /api/audio/analyze-video
{
  "videoUrl": "https://tiktok.com/@chef/video/123",
  "platform": "tiktok"
}

// 2. Server analyzes (mock)
↓
{
  "parsedRecipe": {
    "title": "Chocolate Cake",
    "ingredients": [...],
    "steps": [...],
    "cookingTime": "30 min",
    "servings": 8
  }
}

// 3. User saves recipe
POST /api/recipes
{
  "title": "Chocolate Cake",
  "ingredients": ["2 cups flour", "1 cup sugar"],
  "steps": ["Mix ingredients", "Bake"],
  ...
}

// 4. Recipe stored with ID
↓
{
  "id": 1,
  "title": "Chocolate Cake",
  ...
}

// 5. User plans meal
POST /api/planner/meals
{
  "date": "2025-12-27",
  "mealType": "dinner",
  "recipeId": 1
}

// 6. User adds to shopping list
POST /api/planner/shopping-list
{
  "item": "Flour",
  "quantity": "2 cups",
  "category": "Pantry"
}
```

## State Management

### Frontend State
- **Local State**: React useState for component state
- **Props**: Parent-child data flow
- **No Redux**: Keep it simple for this app size

### Backend State
- **In-Memory**: Arrays for development
- **Production**: Replace with database queries
- **Session**: No session state (stateless API)

## API Design Principles

1. **RESTful**: Standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
2. **JSON**: All requests and responses use JSON
3. **Status Codes**: Proper HTTP status codes
4. **Error Handling**: Consistent error response format
5. **Validation**: Input validation on all endpoints

## Performance Considerations

### Current (Development)
- In-memory storage = fast reads/writes
- No database queries = no latency
- No caching needed for development

### Production Recommendations
- Add Redis for caching
- Database indexing on commonly queried fields
- CDN for static assets
- Lazy loading for React components
- Image optimization

## Scalability Path

### Phase 1: MVP (Current)
- In-memory storage
- Mock AI
- Single server

### Phase 2: Production
- Database (MongoDB/PostgreSQL)
- Real AI integration (OpenAI/Google)
- Authentication
- Rate limiting

### Phase 3: Scale
- Load balancing
- Caching layer (Redis)
- CDN for assets
- Microservices (if needed)

### Phase 4: Enterprise
- Kubernetes deployment
- Multiple regions
- Advanced analytics
- Mobile apps

## Testing Strategy

### Unit Tests
- Individual functions
- Component rendering
- Route handlers

### Integration Tests
- API endpoints (current)
- Full user workflows
- Database operations (production)

### E2E Tests (Future)
- Cypress/Playwright
- Full user journeys
- Cross-browser testing

## Monitoring & Observability

### Development
- Console logs
- Browser DevTools
- Node.js debugger

### Production (Recommended)
- **Logging**: Winston
- **Errors**: Sentry
- **Uptime**: UptimeRobot
- **Analytics**: Google Analytics
- **Performance**: New Relic

## Contributing

See the project on GitHub:
```
https://github.com/blacki2016/Rezepte
```

## License

MIT License - See README.md

---

**Built with ❤️ for food lovers and home cooks**
