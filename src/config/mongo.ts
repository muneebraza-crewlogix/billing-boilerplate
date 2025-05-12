import mongoose from 'mongoose';
import { config } from '@/config';

export const connectMongo = async (): Promise<void> => {
  await mongoose.connect(config.mongoUri);
  console.log('✅ MongoDB connected');
};
