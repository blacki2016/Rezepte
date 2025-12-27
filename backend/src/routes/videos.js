import express from 'express';
import videoProcessing from '../services/videoProcessing.js';
import aiService from '../services/aiService.js';
import RecipeStore from '../models/Recipe.js';

const router = express.Router();

// Process video URL and extract recipe
router.post('/process', async (req, res) => {
  try {
    const { url, platform } = req.body;

    if (!url || !platform) {
      return res.status(400).json({ 
        error: 'URL and platform are required' 
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }

    // Validate platform
    if (platform !== 'tiktok' && platform !== 'instagram') {
      return res.status(400).json({ 
        error: 'Platform must be either "tiktok" or "instagram"' 
      });
    }

    // For demo purposes, we'll use mock data
    // In production, you would:
    // 1. Validate URL is from allowed domains (tiktok.com, instagram.com)
    // 2. Download the video from TikTok/Instagram
    // 3. Extract audio from the video
    // 4. Transcribe the audio
    // 5. Use AI to extract recipe information
    
    let videoInfo;
    if (platform === 'tiktok') {
      videoInfo = await videoProcessing.processTikTokVideo(url);
    } else if (platform === 'instagram') {
      videoInfo = await videoProcessing.processInstagramReel(url);
    } else {
      return res.status(400).json({ 
        error: 'Platform must be either "tiktok" or "instagram"' 
      });
    }

    // For demo, use mock recipe
    const { transcript, recipe } = await aiService.processVideoForRecipe(null);

    // Add source information to recipe
    recipe.source = {
      platform,
      url,
      processedAt: new Date().toISOString()
    };

    // Save recipe to store
    const savedRecipe = RecipeStore.create(recipe);

    res.json({
      message: 'Video processed successfully',
      videoInfo,
      transcript,
      recipe: savedRecipe
    });
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload video file directly
router.post('/upload', async (req, res) => {
  try {
    // In production, you would use multer to handle file uploads
    // For now, this is a placeholder
    res.json({
      message: 'Video upload endpoint - implement with multer middleware',
      note: 'This endpoint will handle direct video file uploads'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
