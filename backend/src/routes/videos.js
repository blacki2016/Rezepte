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

    console.log(`Processing ${platform} video from URL: ${url}`);
    
    let videoInfo;
    let audioPath = null;
    let transcript = '';
    let recipe = null;
    
    try {
      // First, try to get video info (title, description) - this is faster
      const videoMetaInfo = await videoProcessing.getVideoInfo(url);
      console.log('Video info retrieved:', videoMetaInfo?.title);
      
      // Download and process video
      if (platform === 'tiktok') {
        videoInfo = await videoProcessing.processTikTokVideo(url);
      } else if (platform === 'instagram') {
        videoInfo = await videoProcessing.processInstagramReel(url);
      }
      
      audioPath = videoInfo.audioPath;
      
      // Process audio and extract recipe
      const result = await aiService.processVideoForRecipe(audioPath);
      transcript = result.transcript;
      recipe = result.recipe;
      
      // Enhance recipe with video metadata if available
      if (videoMetaInfo) {
        if (!recipe.title || recipe.title === 'Pasta Carbonara') {
          // If recipe title is generic, try to use video title
          recipe.title = videoMetaInfo.title || recipe.title;
        }
        recipe.videoMetadata = {
          title: videoMetaInfo.title,
          description: videoMetaInfo.description,
          uploader: videoMetaInfo.uploader
        };
      }

      // Add source information to recipe
      recipe.source = {
        platform,
        url,
        processedAt: new Date().toISOString()
      };

      // Save recipe to store
      const savedRecipe = RecipeStore.create(recipe);
      
      // Clean up temporary files
      if (videoInfo.videoPath) {
        videoProcessing.cleanup(videoInfo.videoPath);
      }
      if (audioPath) {
        videoProcessing.cleanup(audioPath);
      }

      res.json({
        message: 'Video processed successfully',
        videoInfo: {
          platform: videoInfo.platform,
          url: videoInfo.url,
          duration: videoInfo.metadata?.duration,
          title: videoMetaInfo?.title
        },
        transcript,
        recipe: savedRecipe
      });
    } catch (error) {
      // Clean up files on error
      if (audioPath) {
        videoProcessing.cleanup(audioPath);
      }
      if (videoInfo?.videoPath) {
        videoProcessing.cleanup(videoInfo.videoPath);
      }
      throw error;
    }
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to process video. Make sure the URL is valid and the video is accessible.'
    });
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
