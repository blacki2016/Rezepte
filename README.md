# Rezepte - AI-Powered Recipe App 🍳

Eine moderne Rezept- und Foodplaner-App, die TikTok und Instagram Reels durch KI Audio-Analyse in wunderschöne, komplette Rezepte umwandelt.

## Features ✨

- **Video Sharing Integration**: Teile TikToks und Instagram Reels direkt in der App
- **KI Audio-Analyse**: Automatische Extraktion von Rezeptinformationen aus Video-Audio
- **Schöne Rezeptdarstellung**: Übersichtliche und ansprechende Präsentation von Rezepten
- **Essensplaner**: Plane deine Mahlzeiten für die ganze Woche
- **Einkaufsliste**: Automatische Einkaufslisten aus deinen Rezepten
- **Favoriten**: Speichere und verwalte deine Lieblingsrezepte

## Technologie-Stack 🛠️

### Backend
- Node.js & Express
- Multer für Datei-Uploads
- OpenAI API Integration (für echte Audio-Analyse)

### Frontend
- React 18
- React Router für Navigation
- Axios für API-Aufrufe
- Modernes, responsives Design

## Installation 📦

### Voraussetzungen
- Node.js (v16 oder höher)
- npm oder yarn

### Schritte

1. Repository klonen:
```bash
git clone https://github.com/blacki2016/Rezepte.git
cd Rezepte
```

2. Abhängigkeiten installieren:
```bash
npm run install-all
```

3. Umgebungsvariablen einrichten:
```bash
cp .env.example .env
```

Optional: Füge deinen OpenAI API-Schlüssel in `.env` hinzu für echte KI-Analyse:
```
OPENAI_API_KEY=your_api_key_here
```

## Verwendung 🚀

### Development Mode

1. Server starten:
```bash
npm run dev
```

2. In einem neuen Terminal, Client starten:
```bash
npm run client
```

Die App läuft unter:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

```bash
npm run build
npm start
```

## API Endpoints 📡

### Rezepte
- `GET /api/recipes` - Alle Rezepte abrufen
- `GET /api/recipes/:id` - Einzelnes Rezept abrufen
- `POST /api/recipes` - Neues Rezept erstellen
- `PUT /api/recipes/:id` - Rezept aktualisieren
- `DELETE /api/recipes/:id` - Rezept löschen
- `PATCH /api/recipes/:id/favorite` - Favorit umschalten

### Audio-Analyse
- `POST /api/audio/analyze-video` - Video-URL analysieren
- `POST /api/audio/analyze-audio` - Audio-Datei hochladen und analysieren

### Essensplaner
- `GET /api/planner/meals` - Alle geplanten Mahlzeiten abrufen
- `POST /api/planner/meals` - Neue Mahlzeit planen
- `PUT /api/planner/meals/:id` - Mahlzeit aktualisieren
- `DELETE /api/planner/meals/:id` - Mahlzeit löschen

### Einkaufsliste
- `GET /api/planner/shopping-list` - Einkaufsliste abrufen
- `POST /api/planner/shopping-list` - Artikel hinzufügen
- `PATCH /api/planner/shopping-list/:id/toggle` - Artikel abhaken
- `DELETE /api/planner/shopping-list/:id` - Artikel löschen

## Projektstruktur 📁

```
Rezepte/
├── server/              # Backend-Code
│   ├── index.js        # Express Server
│   └── routes/         # API Routes
│       ├── recipes.js  # Rezept-Endpoints
│       ├── audio.js    # Audio-Analyse Endpoints
│       └── planner.js  # Planner & Shopping List Endpoints
├── client/             # Frontend-Code
│   ├── public/         # Statische Dateien
│   └── src/           
│       ├── components/ # React Komponenten
│       ├── App.js     # Haupt-App-Komponente
│       └── index.js   # Entry Point
├── package.json       # Projekt-Dependencies
└── README.md          # Diese Datei
```

## Zukünftige Erweiterungen 🔮

- **Echte KI-Integration**: Integration mit OpenAI Whisper für Speech-to-Text
- **Video-Download**: Automatisches Herunterladen und Verarbeiten von Videos
- **Benutzer-Authentifizierung**: User-Login und Profile
- **Datenbank-Integration**: MongoDB für persistente Datenspeicherung
- **Social Features**: Rezepte mit Freunden teilen
- **Mobile App**: React Native Version
- **Nährwertinformationen**: Automatische Berechnung von Kalorien und Nährwerten
- **Smart Einkaufsliste**: Automatische Aggregation von Zutaten aus Wochenplan

## Beitragen 🤝

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## Lizenz 📄

MIT License

## Kontakt 📧

Für Fragen oder Feedback, erstelle bitte ein Issue im Repository.