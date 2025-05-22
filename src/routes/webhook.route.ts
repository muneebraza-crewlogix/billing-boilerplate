// src/routes/webhook.route.ts
import express from 'express';
import { stripeWebhookHandler } from '@/controllers/webhook.controller';

const router = express.Router();

// Stripe requires the raw body to verify signatures
router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

export default router;
