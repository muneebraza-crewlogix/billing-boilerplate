import express from 'express';
import expressWinston from 'express-winston';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { connectMongo } from '@/config/mongo';
import { connectRedis } from '@/config/redis';
import { swaggerOptions } from '@/config/swagger';

import billingRoutes from '@/routes/billing.route';

import webhookRouter from '@/routes/webhook.route';

import { errorHandler } from '@/middlewares/errorHandler.middleware';

import logger from '@/config/logger';

import { config } from '@/config';

const app = express();

app.use('/billing', webhookRouter);

app.use(express.json());

// Logging middleware
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: '{{req.method}} {{req.url}} → {{res.statusCode}}',
    expressFormat: true,
    colorize: true,
  }),
);

// Swagger docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to databases & Redis
connectMongo().catch((err) => console.error(err));
connectRedis().catch((err) => console.error(err));

// Mount routes
app.use('/billing', billingRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(Number(config.port), () =>
  console.log(`🚀 Billing service running on http://localhost:${config.port}`),
);
