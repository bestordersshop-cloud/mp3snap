import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis.js';
import { VideoService } from '../services/video.service.js';
import logger from '../utils/logger.js';
import path from 'path';
import { config } from '../config/index.js';
import fs from 'fs/promises';

export const conversionWorker = new Worker(
  'conversion-queue',
  async (job: Job) => {
    const { jobId, url } = job.data;
    logger.info(`Processing conversion for job ${jobId}`);

    const outputDir = path.join(config.storage.path, jobId);
    const outputPath = path.join(outputDir, 'audio.mp3');

    try {
      await fs.mkdir(outputDir, { recursive: true });
      
      await VideoService.downloadAndConvert(url, outputPath);
      
      logger.info(`Successfully converted job ${jobId}`);
      
      // Update job status in DB (Implementation would go here)
      
      return { filePath: outputPath };
    } catch (error) {
      logger.error(`Failed to process job ${jobId}:`, error);
      throw error;
    }
  },
  { connection: redis }
);

conversionWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

conversionWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed with error: ${err.message}`);
});
