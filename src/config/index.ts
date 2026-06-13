import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  STORAGE_TYPE: z.enum(['local', 's3', 'r2']).default('local'),
  STORAGE_PATH: z.string().default('./uploads'),
  LOG_LEVEL: z.string().default('info'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const config = {
  port: parseInt(parsedEnv.data.PORT, 10),
  nodeEnv: parsedEnv.data.NODE_ENV,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  redis: {
    host: parsedEnv.data.REDIS_HOST,
    port: parseInt(parsedEnv.data.REDIS_PORT, 10),
    password: parsedEnv.data.REDIS_PASSWORD,
  },
  storage: {
    type: parsedEnv.data.STORAGE_TYPE,
    path: parsedEnv.data.STORAGE_PATH,
  },
  logLevel: parsedEnv.data.LOG_LEVEL,
};
