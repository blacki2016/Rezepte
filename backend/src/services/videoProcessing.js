import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegStatic);

class VideoProcessingService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Download video from URL
   */
  async downloadVideo(videoUrl, filename) {
    const filePath = path.join(this.tempDir, filename);
    
    try {
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }

  /**
   * Extract audio from video file
   */
  async extractAudio(videoPath) {
    const audioPath = videoPath.replace(/\.[^/.]+$/, '.mp3');

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .audioCodec('libmp3lame')
        .on('end', () => resolve(audioPath))
        .on('error', reject)
        .run();
    });
  }

  /**
   * Get video metadata
   */
  async getVideoMetadata(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }

  /**
   * Clean up temporary files
   */
  cleanup(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  }

  /**
   * Process TikTok video URL
   */
  async processTikTokVideo(url) {
    // Note: In production, you'd need to use TikTok API or a service like yt-dlp
    // For now, this is a placeholder that assumes you have the video URL
    const filename = `tiktok_${Date.now()}.mp4`;
    
    return {
      platform: 'tiktok',
      url,
      filename,
      note: 'TikTok video processing requires API access or third-party tools'
    };
  }

  /**
   * Process Instagram Reel URL
   */
  async processInstagramReel(url) {
    // Note: In production, you'd need to use Instagram API or a service like yt-dlp
    // For now, this is a placeholder that assumes you have the video URL
    const filename = `instagram_${Date.now()}.mp4`;
    
    return {
      platform: 'instagram',
      url,
      filename,
      note: 'Instagram Reel processing requires API access or third-party tools'
    };
  }
}

export default new VideoProcessingService();
