# Rezepte - AI-Powered Recipe App

Eine moderne Web-Anwendung, mit der du Rezept-Videos von TikTok und Instagram Reels teilen kannst. Die App nutzt KI-Audio-Analyse, um automatisch vollständige, schön formatierte Rezepte zu erstellen und bietet einen integrierten Essensplaner.

## ✨ Features

### 🎥 Social Media Integration
- Importiere Rezept-Videos direkt von TikTok und Instagram Reels
- Automatischer Video-Download mit yt-dlp
- Einfach URL einfügen - die App erledigt den Rest

### 🤖 KI-Powered Rezept-Extraktion
- Automatische Audio-Extraktion aus Videos mit FFmpeg
- Speech-to-Text Transkription (OpenAI Whisper - optional)
- Intelligente Rezept-Extraktion mit Google Gemini oder GPT-4
- Fallback auf Video-Titel/Beschreibung wenn Audio nicht verfügbar
- Strukturierte Ausgabe mit Zutaten, Schritten, Zeiten und mehr

### 📖 Rezept-Verwaltung
- Vollständig formatierte Rezepte mit schöner UI
- Suche und Filterung nach Kategorien und Tags
- Detaillierte Rezeptansicht mit allen Informationen
- Zutaten und Schritt-für-Schritt-Anleitungen

### 📅 Essensplaner
- Wochenplaner für Mahlzeiten
- Plane Frühstück, Mittagessen, Abendessen und Snacks
- Automatische Einkaufslisten-Generierung aus geplanten Mahlzeiten
- Übersichtliche Kalenderansicht

### 🎨 Moderne Benutzeroberfläche
- Clean und intuitives Design
- Responsive für Desktop und Mobile
- Schnelle und flüssige Navigation
- Ansprechende Animationen und Übergänge

## 🏗️ Technologie-Stack

### Backend
- **Node.js** mit Express
- **Google Gemini API** (primär) oder **OpenAI API** (fallback) für KI-Funktionen
  - Gemini 1.5 Flash für Rezept-Extraktion aus Text
  - OpenAI Whisper für Audio-Transkription (optional)
- **yt-dlp** für Video-Downloads von TikTok und Instagram
- **FFmpeg** für Video- und Audio-Verarbeitung
- In-Memory-Speicher (kann leicht auf MongoDB umgestellt werden)
- RESTful API-Design

### Frontend
- **React 18** mit Hooks
- **React Router** für Navigation
- **Vite** als Build-Tool
- **Lucide React** für Icons
- **Axios** für API-Kommunikation
- Moderne CSS mit Flexbox und Grid

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ und npm
- Google Gemini API Key (empfohlen) oder OpenAI API Key
- yt-dlp wird automatisch installiert

### Backend Setup

```bash
cd backend
npm install

# Erstelle .env Datei
cp .env.example .env

# Füge deinen API Key in .env hinzu:
# Für Gemini (empfohlen):
# GEMINI_API_KEY=your-gemini-api-key-here
# AI_PROVIDER=gemini

# Oder für OpenAI:
# OPENAI_API_KEY=your-openai-key-here
# AI_PROVIDER=openai

# Starte den Server
npm start

# Oder für Entwicklung mit Auto-Reload
npm run dev
```

Der Backend-Server läuft auf `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install

# Starte den Dev-Server
npm run dev
```

Der Frontend-Server läuft auf `http://localhost:3000`

## 📁 Projektstruktur

```
Rezepte/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express Server
│   │   ├── routes/
│   │   │   ├── recipes.js         # Rezept-Endpunkte
│   │   │   ├── videos.js          # Video-Verarbeitung
│   │   │   └── planner.js         # Essensplaner
│   │   ├── services/
│   │   │   ├── aiService.js       # OpenAI Integration
│   │   │   └── videoProcessing.js # Video/Audio Verarbeitung
│   │   ├── models/
│   │   │   ├── Recipe.js          # Rezept-Modell
│   │   │   └── MealPlan.js        # Essensplan-Modell
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Haupt-App-Komponente
│   │   ├── main.jsx               # Einstiegspunkt
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Startseite
│   │   │   ├── RecipesPage.jsx    # Rezepte-Übersicht
│   │   │   ├── RecipeDetailPage.jsx # Rezept-Details
│   │   │   ├── ImportPage.jsx     # Video-Import
│   │   │   └── PlannerPage.jsx    # Essensplaner
│   │   ├── services/
│   │   │   └── api.js             # API-Client
│   │   └── styles/
│   │       ├── index.css          # Globale Styles
│   │       └── App.css            # App-Styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔌 API-Endpunkte

### Rezepte
- `GET /api/recipes` - Alle Rezepte abrufen (mit optionalen Filtern)
- `GET /api/recipes/:id` - Einzelnes Rezept abrufen
- `POST /api/recipes` - Neues Rezept erstellen
- `PUT /api/recipes/:id` - Rezept aktualisieren
- `DELETE /api/recipes/:id` - Rezept löschen

### Video-Verarbeitung
- `POST /api/videos/process` - Video-URL verarbeiten und Rezept extrahieren
- `POST /api/videos/upload` - Video-Datei hochladen

### Essensplaner
- `GET /api/planner` - Alle Essenspläne abrufen
- `GET /api/planner/:id` - Einzelnen Plan abrufen
- `POST /api/planner` - Neuen Essensplan erstellen
- `PUT /api/planner/:id` - Essensplan aktualisieren
- `DELETE /api/planner/:id` - Essensplan löschen
- `POST /api/planner/shopping-list` - Einkaufsliste generieren

## 🎯 Verwendung

### 1. Video importieren
1. Gehe zur "Importieren"-Seite
2. Wähle die Plattform (TikTok oder Instagram)
3. Füge die Video-URL ein
4. Klicke auf "Video analysieren"
5. Die KI extrahiert automatisch das Rezept

### 2. Rezepte verwalten
1. Durchsuche alle Rezepte auf der "Rezepte"-Seite
2. Nutze die Suchfunktion oder filtere nach Kategorien
3. Klicke auf ein Rezept für Details
4. Bearbeite oder lösche Rezepte nach Bedarf

### 3. Mahlzeiten planen
1. Gehe zur "Planer"-Seite
2. Klicke auf "Mahlzeit hinzufügen"
3. Wähle Datum, Mahlzeittyp und optional ein Rezept
4. Generiere eine Einkaufsliste aus allen geplanten Mahlzeiten

## 🔧 Konfiguration

### KI-Provider Setup

Die App unterstützt sowohl Google Gemini als auch OpenAI:

**Option 1: Google Gemini (Empfohlen)**
1. Erstelle einen API Key bei [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Füge den Key in `.env` hinzu: `GEMINI_API_KEY=dein-key`
3. Setze `AI_PROVIDER=gemini`

**Option 2: OpenAI**
1. Erstelle einen API Key bei [OpenAI](https://platform.openai.com/api-keys)
2. Füge den Key in `.env` hinzu: `OPENAI_API_KEY=sk-...`
3. Setze `AI_PROVIDER=openai`

**Demo-Modus**: Ohne API Keys verwendet die App Mock-Daten.

### Umgebungsvariablen

```env
PORT=3001
GEMINI_API_KEY=your-gemini-api-key-here
AI_PROVIDER=gemini
NODE_ENV=development

# Optional: OpenAI als Fallback
OPENAI_API_KEY=sk-...
```

## 🚧 Produktions-Hinweise

Für eine Produktionsumgebung solltest du:

1. **Datenbank**: MongoDB oder PostgreSQL statt In-Memory-Speicher
2. **Authentifizierung**: User-Login und Session-Management hinzufügen
3. **Social Media APIs**: Offizielle APIs oder Tools wie yt-dlp integrieren
4. **File Storage**: Cloud-Storage (AWS S3, Cloudinary) für Videos/Bilder
5. **Rate Limiting**: API-Rate-Limiting implementieren
6. **Error Handling**: Verbessertes Error-Handling und Logging
7. **Testing**: Unit- und Integration-Tests hinzufügen
8. **Deployment**: Docker-Container und CI/CD-Pipeline

## 🤝 Mitwirken

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## 📝 Lizenz

ISC

## 👨‍💻 Entwicklung

Entwickelt als moderne Full-Stack-Anwendung mit React und Node.js, die zeigt, wie KI-Technologien in praktische Web-Apps integriert werden können.

---

**Hinweis**: Dies ist eine Demo-Implementierung. Die Social-Media-Integration erfordert offizielle API-Zugriffe oder Drittanbieter-Tools.