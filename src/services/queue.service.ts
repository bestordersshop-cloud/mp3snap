import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';
import logger from '../utils/logger.js';

export const METADATA_QUEUE = 'metadata-queue';
export const CONVERSION_QUEUE = 'conversion-queue';
export const CLEANUP_QUEUE = 'cleanup-queue';

export const metadataQueue = new Queue(METADATA_QUEUE, { connection: redis });
export const conversionQueue = new Queue(CONVERSION_QUEUE, { connection: redis });
export const cleanupQueue = new Queue(CLEANUP_QUEUE, { connection: redis });

export const addJobToQueue = async (queue: Queue, name: string, data: any) => {
  try {
    const job = await queue.add(name, data);
    logger.info(`Job added to ${queue.name}: ${job.id}`);
    return job;
  } catch (error) {
    logger.error(`Error adding job to ${queue.name}:`, error);
    throw error;
  }
};
