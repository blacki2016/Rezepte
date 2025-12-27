import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import PlannerPage from './pages/PlannerPage';
import ImportPage from './pages/ImportPage';
import { ChefHat, Calendar, Upload, BookOpen } from 'lucide-react';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div className="nav-content">
              <Link to="/" className="logo" onClick={() => setActiveTab('home')}>
                <ChefHat size={32} />
                <span>Rezepte</span>
              </Link>
              
              <div className="nav-links">
                <Link 
                  to="/" 
                  className={activeTab === 'home' ? 'active' : ''}
                  onClick={() => setActiveTab('home')}
                >
                  <BookOpen size={20} />
                  Home
                </Link>
                <Link 
                  to="/recipes" 
                  className={activeTab === 'recipes' ? 'active' : ''}
                  onClick={() => setActiveTab('recipes')}
                >
                  <ChefHat size={20} />
                  Rezepte
                </Link>
                <Link 
                  to="/planner" 
                  className={activeTab === 'planner' ? 'active' : ''}
                  onClick={() => setActiveTab('planner')}
                >
                  <Calendar size={20} />
                  Planer
                </Link>
                <Link 
                  to="/import" 
                  className={activeTab === 'import' ? 'active' : ''}
                  onClick={() => setActiveTab('import')}
                >
                  <Upload size={20} />
                  Importieren
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/import" element={<ImportPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 Rezepte - AI-powered Recipe App</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
