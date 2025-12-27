import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ytDlpExec from 'yt-dlp-exec';

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
   * Get video information including title and description
   */
  async getVideoInfo(url) {
    try {
      const output = await ytDlpExec(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        skipDownload: true
      });
      
      return {
        title: output.title || '',
        description: output.description || '',
        uploader: output.uploader || '',
        duration: output.duration || 0
      };
    } catch (error) {
      console.error('Error getting video info:', error);
      return null;
    }
  }

  /**
   * Process TikTok video URL
   */
  async processTikTokVideo(url) {
    try {
      console.log('Processing TikTok video:', url);
      const filename = `tiktok_${Date.now()}.mp4`;
      const videoPath = path.join(this.tempDir, filename);
      
      // Download video using yt-dlp
      await ytDlpExec(url, {
        output: videoPath,
        format: 'best',
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          'referer:https://www.tiktok.com/',
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ]
      });
      
      // Get video metadata
      const metadata = await this.getVideoMetadata(videoPath);
      
      // Extract audio
      const audioPath = await this.extractAudio(videoPath);
      
      console.log('TikTok video processed successfully');
      
      return {
        platform: 'tiktok',
        url,
        videoPath,
        audioPath,
        filename,
        metadata: {
          duration: metadata.format?.duration || 0,
          size: metadata.format?.size || 0
        }
      };
    } catch (error) {
      console.error('Error processing TikTok video:', error);
      throw new Error(`Failed to process TikTok video: ${error.message}`);
    }
  }

  /**
   * Process Instagram Reel URL
   */
  async processInstagramReel(url) {
    try {
      console.log('Processing Instagram Reel:', url);
      const filename = `instagram_${Date.now()}.mp4`;
      const videoPath = path.join(this.tempDir, filename);
      
      // Download video using yt-dlp
      await ytDlpExec(url, {
        output: videoPath,
        format: 'best',
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        ]
      });
      
      // Get video metadata
      const metadata = await this.getVideoMetadata(videoPath);
      
      // Extract audio
      const audioPath = await this.extractAudio(videoPath);
      
      console.log('Instagram Reel processed successfully');
      
      return {
        platform: 'instagram',
        url,
        videoPath,
        audioPath,
        filename,
        metadata: {
          duration: metadata.format?.duration || 0,
          size: metadata.format?.size || 0
        }
      };
    } catch (error) {
      console.error('Error processing Instagram Reel:', error);
      throw new Error(`Failed to process Instagram Reel: ${error.message}`);
    }
  }
}

export default new VideoProcessingService();
