import { createClient } from 'redis';
import { config } from '@/config';

export const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password,
});

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
  console.log('✅ Redis connected');
};
