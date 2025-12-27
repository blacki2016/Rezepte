import OpenAI from 'openai';
import fs from 'fs';

class AIService {
  constructor() {
    // Only initialize OpenAI if API key is provided
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('OpenAI API key not found. Using mock data for demo purposes.');
      this.openai = null;
    }
  }

  /**
   * Transcribe audio to text using Whisper API
   */
  async transcribeAudio(audioPath) {
    // Use mock data if OpenAI is not available
    if (!this.openai) {
      console.log('Using mock transcription (OpenAI API key not configured)');
      return this.getMockTranscription();
    }

    try {
      const audioFile = fs.createReadStream(audioPath);
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'de' // German, change as needed
      });

      return transcription.text;
    } catch (error) {
      console.error('Transcription error:', error);
      // Fallback for demo purposes
      return this.getMockTranscription();
    }
  }

  /**
   * Extract recipe information from transcript using GPT
   */
  async extractRecipeFromTranscript(transcript) {
    // Use mock data if OpenAI is not available
    if (!this.openai) {
      console.log('Using mock recipe (OpenAI API key not configured)');
      return this.getMockRecipe();
    }

    try {
      const prompt = `
Analysiere den folgenden Text aus einem Koch-Video und extrahiere die Rezeptinformationen.
Erstelle ein strukturiertes Rezept im JSON-Format mit folgenden Feldern:
- title: Titel des Rezepts
- description: Kurze Beschreibung
- prepTime: Zubereitungszeit in Minuten
- cookTime: Kochzeit in Minuten
- servings: Anzahl der Portionen
- difficulty: Schwierigkeitsgrad (einfach, mittel, schwer)
- ingredients: Array von Zutaten mit "amount" (Menge), "unit" (Einheit), "item" (Zutat)
- instructions: Array von Schritten mit "step" (Nummer) und "text" (Anweisung)
- tags: Array von relevanten Tags
- category: Kategorie (z.B. Hauptgericht, Dessert, Vorspeise)

Transcript:
${transcript}

Antworte nur mit dem JSON-Objekt, ohne zusätzliche Erklärungen.
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein Experte für Rezeptanalyse. Extrahiere strukturierte Rezeptinformationen aus Texten.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const recipeText = completion.choices[0].message.content;
      const recipe = JSON.parse(recipeText);
      
      return recipe;
    } catch (error) {
      console.error('Recipe extraction error:', error);
      // Fallback for demo purposes
      return this.getMockRecipe();
    }
  }

  /**
   * Mock transcription for demo/testing
   */
  getMockTranscription() {
    return `
Heute zeige ich euch wie man eine leckere Pasta Carbonara macht.
Ihr braucht 400 Gramm Spaghetti, 200 Gramm Guanciale oder Speck,
4 Eigelb, 100 Gramm Parmesan, Salz und schwarzen Pfeffer.
Zuerst kocht ihr die Pasta in Salzwasser al dente.
Dann bratet ihr den Speck knusprig an.
Vermengt die Eigelbe mit geriebenem Parmesan.
Gebt die heiße Pasta zum Speck, nehmt sie vom Herd und rührt die Ei-Käse-Mischung unter.
Mit Pfeffer würzen und sofort servieren.
    `.trim();
  }

  /**
   * Mock recipe for demo/testing
   */
  getMockRecipe() {
    return {
      title: 'Pasta Carbonara',
      description: 'Klassisches italienisches Pasta-Gericht mit cremiger Ei-Käse-Sauce',
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: 'mittel',
      ingredients: [
        { amount: '400', unit: 'g', item: 'Spaghetti' },
        { amount: '200', unit: 'g', item: 'Guanciale oder Speck' },
        { amount: '4', unit: 'Stück', item: 'Eigelb' },
        { amount: '100', unit: 'g', item: 'Parmesan' },
        { amount: '1', unit: 'Prise', item: 'Salz' },
        { amount: '1', unit: 'TL', item: 'Schwarzer Pfeffer' }
      ],
      instructions: [
        { step: 1, text: 'Spaghetti in reichlich Salzwasser al dente kochen.' },
        { step: 2, text: 'Guanciale oder Speck in kleine Würfel schneiden und in einer Pfanne knusprig anbraten.' },
        { step: 3, text: 'Eigelbe mit geriebenem Parmesan vermengen und mit Pfeffer würzen.' },
        { step: 4, text: 'Gekochte Pasta abgießen (etwas Nudelwasser aufbewahren) und zum Speck in die Pfanne geben.' },
        { step: 5, text: 'Pfanne vom Herd nehmen und die Ei-Käse-Mischung unter die heiße Pasta rühren. Bei Bedarf etwas Nudelwasser hinzufügen.' },
        { step: 6, text: 'Sofort servieren und mit extra Parmesan und Pfeffer garnieren.' }
      ],
      tags: ['Pasta', 'Italienisch', 'Hauptgericht', 'Schnell'],
      category: 'Hauptgericht'
    };
  }

  /**
   * Process video and extract recipe
   */
  async processVideoForRecipe(audioPath) {
    // Transcribe audio
    const transcript = await this.transcribeAudio(audioPath);
    
    // Extract recipe from transcript
    const recipe = await this.extractRecipeFromTranscript(transcript);
    
    return {
      transcript,
      recipe
    };
  }
}

export default new AIService();
