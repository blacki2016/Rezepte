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

    // Validate platform-specific URL format
    if (platform === 'tiktok' && !videoProcessing.isValidTikTokUrl(url)) {
      return res.status(400).json({
        error: 'Invalid TikTok URL. Please use a valid TikTok video link.',
        example: 'https://www.tiktok.com/@username/video/1234567890'
      });
    }

    if (platform === 'instagram' && !videoProcessing.isValidInstagramUrl(url)) {
      return res.status(400).json({
        error: 'Invalid Instagram URL. Please use a valid Instagram Reel or Post link.',
        example: 'https://www.instagram.com/reel/ABC123xyz/'
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
    
    // Provide more helpful error messages
    let errorMessage = error.message;
    let errorDetails = 'Failed to process video. Please try again.';
    
    if (error.message.includes('yt-dlp')) {
      errorDetails = 'Unable to download video. The video might be private, deleted, or the URL is incorrect.';
    } else if (error.message.includes('ffmpeg')) {
      errorDetails = 'Failed to extract audio from video.';
    } else if (error.message.includes('API')) {
      errorDetails = 'AI service error. Please check API configuration.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails
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
