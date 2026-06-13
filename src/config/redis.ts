import Redis from 'ioredis';
import { config } from './index.js';
import logger from '../utils/logger.js';

export const redisConnection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null
};

export const redis = new Redis(redisConfig);

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redis.on('connect', () => {
  logger.info('Successfully connected to Redis');
});
