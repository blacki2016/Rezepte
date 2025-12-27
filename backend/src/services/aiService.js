import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

class AIService {
  constructor() {
    // Determine which AI provider to use (defaults to gemini)
    this.aiProvider = process.env.AI_PROVIDER || 'gemini';
    
    // Initialize OpenAI if API key is provided
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      this.openai = null;
    }
    
    // Initialize Gemini if API key is provided
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.geminiModel = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      console.warn('Gemini API key not found.');
      this.gemini = null;
      this.geminiModel = null;
    }
    
    // Check if any AI provider is available
    if (!this.openai && !this.geminiModel) {
      console.warn('No AI API keys configured. Using mock data for demo purposes.');
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
   * Extract recipe information from transcript using GPT or Gemini
   */
  async extractRecipeFromTranscript(transcript) {
    // Try Gemini first if available and configured as provider
    if (this.geminiModel && this.aiProvider === 'gemini') {
      try {
        return await this.extractRecipeWithGemini(transcript);
      } catch (error) {
        console.error('Gemini recipe extraction error:', error);
        // Fall back to OpenAI if available
        if (this.openai) {
          console.log('Falling back to OpenAI...');
          return await this.extractRecipeWithOpenAI(transcript);
        }
      }
    }
    
    // Try OpenAI if available
    if (this.openai) {
      try {
        return await this.extractRecipeWithOpenAI(transcript);
      } catch (error) {
        console.error('OpenAI recipe extraction error:', error);
      }
    }
    
    // Fallback to mock data
    console.log('Using mock recipe (no AI provider succeeded)');
    return this.getMockRecipe();
  }
  
  /**
   * Extract recipe using Gemini API
   */
  async extractRecipeWithGemini(transcript) {
    const prompt = `
Analysiere den folgenden Text aus einem Koch-Video und extrahiere die Rezeptinformationen.
Erstelle ein strukturiertes Rezept im JSON-Format mit folgenden Feldern:
- title: Titel des Rezepts
- description: Kurze Beschreibung (1-2 Sätze)
- prepTime: Zubereitungszeit in Minuten (nur die Zahl)
- cookTime: Kochzeit in Minuten (nur die Zahl)
- servings: Anzahl der Portionen (nur die Zahl)
- difficulty: Schwierigkeitsgrad (einfach, mittel, oder schwer)
- ingredients: Array von Zutaten mit "amount" (Menge), "unit" (Einheit), "item" (Zutat)
- instructions: Array von Schritten mit "step" (Nummer) und "text" (Anweisung)
- tags: Array von relevanten Tags
- category: Kategorie (z.B. Hauptgericht, Dessert, Vorspeise, Snack, Getränk)

Transcript:
${transcript}

Antworte NUR mit dem JSON-Objekt, ohne zusätzliche Erklärungen, Markdown-Formatierung oder Code-Blöcke.
`;

    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    let recipeText = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    recipeText = recipeText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const recipe = JSON.parse(recipeText);
    return recipe;
  }
  
  /**
   * Extract recipe using OpenAI API
   */
  async extractRecipeWithOpenAI(transcript) {
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
   * Extract recipe from video description/title
   * Useful as a fallback when audio transcription is not available
   */
  async extractRecipeFromDescription(title, description) {
    const combinedText = `Titel: ${title}\n\nBeschreibung: ${description}`;
    
    // Use Gemini or OpenAI to extract recipe from description
    if (this.geminiModel && this.aiProvider === 'gemini') {
      try {
        const prompt = `
Extrahiere ein Rezept aus dem folgenden Video-Titel und der Beschreibung.
Wenn nicht genug Informationen vorhanden sind, erstelle ein plausibles Rezept basierend auf dem Kontext.

${combinedText}

Erstelle ein strukturiertes Rezept im JSON-Format mit:
- title, description, prepTime, cookTime, servings, difficulty
- ingredients: Array mit "amount", "unit", "item"
- instructions: Array mit "step" und "text"
- tags und category

Antworte NUR mit dem JSON-Objekt.
`;
        const result = await this.geminiModel.generateContent(prompt);
        const response = await result.response;
        let recipeText = response.text().replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        return JSON.parse(recipeText);
      } catch (error) {
        console.error('Error extracting recipe from description with Gemini:', error);
      }
    }
    
    if (this.openai) {
      try {
        const prompt = `Extrahiere ein Rezept aus: ${combinedText}\n\nAntworte nur mit JSON.`;
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'Extrahiere Rezeptinformationen aus Texten als JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        });
        return JSON.parse(completion.choices[0].message.content);
      } catch (error) {
        console.error('Error extracting recipe from description with OpenAI:', error);
      }
    }
    
    return null;
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
