# Quick Start Guide 🚀

Get the Rezepte app up and running in 5 minutes!

## Step 1: Clone the Repository
```bash
git clone https://github.com/blacki2016/Rezepte.git
cd Rezepte
```

## Step 2: Install Dependencies
```bash
npm run install-all
```

This will install dependencies for both the backend and frontend.

## Step 3: Set Up Environment (Optional)
```bash
cp .env.example .env
```

Edit `.env` if you want to customize settings. The defaults work fine for local development.

## Step 4: Start the Development Servers

### Option A: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Option B: Manual Start

**Backend:**
```bash
cd /path/to/Rezepte
node server/index.js
```

**Frontend:**
```bash
cd /path/to/Rezepte/client
npm start
```

## Step 5: Open the App
Open your browser and navigate to:
```
http://localhost:3000
```

The backend API runs on:
```
http://localhost:5000
```

## What's Next?

### Try These Features:

1. **Analyze a Video**
   - Go to "Video Analysieren"
   - Paste any URL (TikTok, Instagram, or other)
   - Click "Video Analysieren"
   - See the AI-extracted recipe (mock data)
   - Save it to your recipes

2. **Browse Recipes**
   - Go to "Rezepte"
   - Filter by category or favorites
   - Click on any recipe to see details

3. **Plan Your Meals**
   - Go to "Essensplaner"
   - Click "+ Mahlzeit hinzufügen"
   - Select a date, meal type, and recipe
   - View your weekly meal plan

4. **Create Shopping List**
   - Go to "Einkaufsliste"
   - Add items with quantity and category
   - Check off items as you shop

## Troubleshooting

### Port Already in Use
If you see "Port 3000 is already in use" or "Port 5000 is already in use":

**For port 3000:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

**For port 5000:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

### Dependencies Not Installing
If npm install fails:

1. Check your Node.js version:
```bash
node --version
```
Should be v16 or higher.

2. Clear npm cache:
```bash
npm cache clean --force
npm run install-all
```

### Frontend Not Loading
1. Make sure the backend is running on port 5000
2. Check browser console for errors
3. Try clearing browser cache

### API Errors
1. Check that backend server is running
2. Look at terminal for error messages
3. Verify the API is responding:
```bash
curl http://localhost:5000/api/health
```

## Running Tests

```bash
npm test
```

## Production Build

```bash
# Build the frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

The production server serves the built frontend from `client/build`.

## Next Steps

- Read [README.md](README.md) for full feature documentation
- Check [AI_INTEGRATION.md](AI_INTEGRATION.md) to add real AI capabilities
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Try the [DEMO.md](DEMO.md) API examples

## Need Help?

- Check existing issues on GitHub
- Create a new issue with:
  - Your Node.js version
  - Error messages
  - Steps to reproduce

---

**Happy Cooking! 🍳**
