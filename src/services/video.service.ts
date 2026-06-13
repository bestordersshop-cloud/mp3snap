import { exec } from 'child_process';
import { promisify } from 'util';
import logger from '../utils/logger.js';

const execPromise = promisify(exec);

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  formats: any[];
}

export class VideoService {
  static async analyze(url: string): Promise<VideoMetadata> {
    try {
      // Using yt-dlp to get metadata in JSON format
      const { stdout } = await execPromise(`yt-dlp -j "${url}"`);
      const info = JSON.parse(stdout);

      return {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        uploader: info.uploader,
        formats: info.formats.map((f: any) => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.resolution,
          filesize: f.filesize,
        })),
      };
    } catch (error) {
      logger.error('Error analyzing video URL:', error);
      throw new Error('Failed to analyze video URL');
    }
  }

  static async downloadAndConvert(url: string, outputPath: string): Promise<string> {
    try {
      // Download best audio and convert to mp3 using ffmpeg
      // yt-dlp can handle the conversion if ffmpeg is installed
      const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;
      await execPromise(command);
      return outputPath;
    } catch (error) {
      logger.error('Error downloading/converting video:', error);
      throw new Error('Failed to convert video to MP3');
    }
  }
}
