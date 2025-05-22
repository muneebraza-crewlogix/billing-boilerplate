import 'dotenv/config';

export const config = {
  port: process.env.PORT ?? '4000',
  mongoUri: process.env.MONGO_URI!,
  redis: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  appUrl: process.env.APP_URL ?? 'http://localhost:4000',
};
