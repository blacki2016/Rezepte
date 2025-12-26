import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import VideoAnalyzer from './components/VideoAnalyzer';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';

function App() {
  const [recipes, setRecipes] = useState([]);

  const addRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🍳 Rezepte AI
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/analyze" className="nav-link">Video Analysieren</Link>
              </li>
              <li className="nav-item">
                <Link to="/recipes" className="nav-link">Rezepte</Link>
              </li>
              <li className="nav-item">
                <Link to="/planner" className="nav-link">Essensplaner</Link>
              </li>
              <li className="nav-item">
                <Link to="/shopping" className="nav-link">Einkaufsliste</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<VideoAnalyzer addRecipe={addRecipe} />} />
            <Route path="/recipes" element={<RecipeList recipes={recipes} />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/planner" element={<MealPlanner />} />
            <Route path="/shopping" element={<ShoppingList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
