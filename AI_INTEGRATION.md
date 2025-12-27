# AI Integration Guide 🤖

This guide explains how to integrate real AI audio analysis capabilities into the Rezepte app.

## Current Implementation

Currently, the app uses a **mock AI implementation** that returns placeholder data. This is located in `server/routes/audio.js`.

## Integrating Real AI Analysis

### Option 1: OpenAI Whisper API (Recommended)

OpenAI's Whisper model is excellent for speech-to-text conversion.

#### Setup:

1. **Get an API key** from [OpenAI Platform](https://platform.openai.com/)

2. **Add to environment variables:**
```bash
OPENAI_API_KEY=your_api_key_here
```

3. **Update `server/routes/audio.js`:**

```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function transcribeAudio(audioBuffer) {
  const file = new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' });
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  });
  
  return transcription.text;
}

async function parseRecipeFromText(text) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a recipe extraction assistant. Parse the following recipe description and return a JSON object with: title, ingredients (array of {name, amount}), steps (array of strings), cookingTime, servings, and category.`
      },
      {
        role: 'user',
        content: text
      }
    ],
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

async function analyzeAudioForRecipe(audioData, videoUrl) {
  let transcription;
  
  if (audioData) {
    // Transcribe uploaded audio
    transcription = await transcribeAudio(audioData);
  } else if (videoUrl) {
    // Download video, extract audio, then transcribe
    // This requires additional packages: ytdl-core, fluent-ffmpeg
    const audioBuffer = await extractAudioFromVideo(videoUrl);
    transcription = await transcribeAudio(audioBuffer);
  }
  
  const parsedRecipe = await parseRecipeFromText(transcription);
  
  return {
    transcription,
    parsedRecipe
  };
}
```

### Option 2: Google Cloud Speech-to-Text

Google's Speech-to-Text API is another excellent option.

#### Setup:

1. **Enable the API** in [Google Cloud Console](https://console.cloud.google.com/)

2. **Create service account** and download credentials JSON

3. **Install the client library:**
```bash
npm install @google-cloud/speech
```

4. **Update code:**
```javascript
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient({
  keyFilename: './path-to-credentials.json'
});

async function transcribeAudio(audioBuffer) {
  const audio = {
    content: audioBuffer.toString('base64'),
  };
  
  const config = {
    encoding: 'MP3',
    sampleRateHertz: 16000,
    languageCode: 'de-DE', // German
  };
  
  const request = {
    audio: audio,
    config: config,
  };
  
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    
  return transcription;
}
```

### Option 3: AssemblyAI

AssemblyAI offers specialized audio transcription with good accuracy.

#### Setup:

1. **Get API key** from [AssemblyAI](https://www.assemblyai.com/)

2. **Install axios** (already included)

3. **Update code:**
```javascript
const axios = require('axios');

async function transcribeAudio(audioBuffer) {
  // Upload audio
  const uploadResponse = await axios.post(
    'https://api.assemblyai.com/v2/upload',
    audioBuffer,
    {
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY,
        'content-type': 'application/octet-stream',
      },
    }
  );
  
  const audioUrl = uploadResponse.data.upload_url;
  
  // Start transcription
  const transcriptResponse = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    {
      audio_url: audioUrl,
      language_code: 'de'
    },
    {
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY,
      },
    }
  );
  
  const transcriptId = transcriptResponse.data.id;
  
  // Poll for completion
  let transcript;
  while (true) {
    const pollingResponse = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          'authorization': process.env.ASSEMBLYAI_API_KEY,
        },
      }
    );
    
    transcript = pollingResponse.data;
    
    if (transcript.status === 'completed') {
      break;
    } else if (transcript.status === 'error') {
      throw new Error('Transcription failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return transcript.text;
}
```

## Video Processing

To extract audio from TikTok/Instagram videos:

### Using yt-dlp (Python tool)

1. **Install yt-dlp:**
```bash
pip install yt-dlp
```

2. **Extract audio in Node.js:**
```javascript
const { spawn } = require('child_process');

async function extractAudioFromVideo(videoUrl) {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', [
      '-x',
      '--audio-format', 'mp3',
      '-o', '/tmp/%(id)s.%(ext)s',
      videoUrl
    ]);
    
    let filename;
    
    ytdlp.stdout.on('data', (data) => {
      const output = data.toString();
      const match = output.match(/\[download\] Destination: (.+)/);
      if (match) {
        filename = match[1];
      }
    });
    
    ytdlp.on('close', (code) => {
      if (code === 0 && filename) {
        const audioBuffer = fs.readFileSync(filename);
        fs.unlinkSync(filename); // Clean up
        resolve(audioBuffer);
      } else {
        reject(new Error('Failed to extract audio'));
      }
    });
  });
}
```

### Using fluent-ffmpeg

1. **Install dependencies:**
```bash
npm install fluent-ffmpeg ytdl-core
```

2. **Extract audio:**
```javascript
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

async function extractAudioFromVideo(videoUrl) {
  const stream = ytdl(videoUrl, { quality: 'highestaudio' });
  
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    ffmpeg(stream)
      .format('mp3')
      .on('error', reject)
      .pipe()
      .on('data', chunk => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks)));
  });
}
```

## Recipe Parsing Strategies

### Using GPT-4 (Recommended)

As shown in Option 1 above, GPT-4 can parse natural language into structured recipe data.

### Using regex and NLP

For a non-API solution:

```javascript
const nlp = require('compromise');

function parseRecipeFromText(text) {
  const doc = nlp(text);
  
  // Extract ingredients (lines with measurements)
  const ingredientPattern = /(\d+(?:\/\d+)?)\s*(cup|tablespoon|teaspoon|gram|kg|ml|oz|pound|pinch)s?\s+(.+)/gi;
  const ingredients = [];
  let match;
  
  while ((match = ingredientPattern.exec(text)) !== null) {
    ingredients.push({
      amount: `${match[1]} ${match[2]}`,
      name: match[3].trim()
    });
  }
  
  // Extract steps (numbered or bulleted lists)
  const steps = text
    .split(/\n/)
    .filter(line => /^\d+\.|\-/.test(line.trim()))
    .map(line => line.replace(/^\d+\.|\-/, '').trim());
  
  // Extract cooking time
  const timeMatch = text.match(/(\d+)\s*(minute|min|hour|hr)/i);
  const cookingTime = timeMatch ? `${timeMatch[1]} ${timeMatch[2]}` : '';
  
  // Extract servings
  const servingsMatch = text.match(/(\d+)\s*(?:servings|portions|people)/i);
  const servings = servingsMatch ? parseInt(servingsMatch[1]) : 1;
  
  return {
    title: 'Recipe from Video',
    ingredients,
    steps,
    cookingTime,
    servings,
    category: 'Other'
  };
}
```

## Cost Considerations

- **OpenAI Whisper**: ~$0.006 per minute of audio
- **OpenAI GPT-4**: ~$0.03 per 1K tokens
- **Google Speech-to-Text**: ~$0.016 per minute
- **AssemblyAI**: ~$0.00025 per second

## Testing

Test your AI integration with sample audio files:

```bash
curl -X POST http://localhost:5000/api/audio/analyze-audio \
  -F "audio=@sample-recipe.mp3"
```

## Best Practices

1. **Cache results** to avoid re-processing the same videos
2. **Add rate limiting** to prevent API cost overruns
3. **Handle errors gracefully** (timeouts, invalid audio, etc.)
4. **Support multiple languages** for international users
5. **Add confidence scores** to let users verify extracted data
6. **Allow manual editing** of AI-extracted recipes
