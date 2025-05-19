import { Router } from 'express';
import { body, param } from 'express-validator';

import { onboardTenantHandler, attachPaymentMethodHandler } from '@/controllers/tenant.controller';

import { validateRequest } from '@/middlewares/validateRequest.middleware';

import { TENANT_TYPES } from '@/constants/billing.constant';

import {
  createPlanHandler,
  listPlansHandler,
} from '@/controllers/plan.controller';
import { PLAN_INTERVALS } from '@/constants/billing.constant';

import { createSubscriptionHandler } from '@/controllers/subscription.controller';
import {
  createProductHandler,
  listProductsHandler,
} from '@/controllers/product.controller';


const router = Router();

// 1️⃣ Tenant onboarding
router.post(
  '/tenants',
  validateRequest([
    body('name')
      .exists()
      .withMessage('name is required')
      .isString()
      .withMessage('name must be a string'),
    body('type')
      .exists()
      .withMessage('type is required')
      .isIn(TENANT_TYPES)
      .withMessage(`type must be one of ${TENANT_TYPES.join(', ')}`),
    body('email')
      .exists()
      .withMessage('email is required')
      .isEmail()
      .withMessage('email must be a valid email'),
    body('reloadThreshold').optional().isObject().withMessage('reloadThreshold must be an object'),
    body('reloadThreshold.percent')
      .optional()
      .isInt({ min: 0 })
      .withMessage('percent must be a non-negative integer'),
    body('reloadThreshold.absolute')
      .optional()
      .isInt({ min: 0 })
      .withMessage('absolute must be a non-negative integer'),
  ]),
  onboardTenantHandler,
);

// 2️⃣ Attach payment method
router.post(
  '/tenants/:tenantId/customer',
  validateRequest([
    param('tenantId')
      .exists()
      .withMessage('tenantId is required')
      .isMongoId()
      .withMessage('tenantId must be a valid Mongo ID'),
    body('email')
      .exists()
      .withMessage('email is required')
      .isEmail()
      .withMessage('email must be a valid email'),
    body('paymentMethodId')
      .exists()
      .withMessage('paymentMethodId is required')
      .isString()
      .withMessage('paymentMethodId must be a string'),
  ]),
  attachPaymentMethodHandler,
);

// ─── Product CRUD ────────────────────────────────────
router.post(
  '/products',
  validateRequest([
    body('key')
      .exists().withMessage('key is required')
      .isString(),
    body('name')
      .exists().withMessage('name is required')
      .isString(),
    body('metadata').optional().isObject(),
  ]),
  createProductHandler
);
router.get('/products', listProductsHandler);

// ─── Plan CRUD (programmatic Price) ─────────────────
router.post(
  '/plans',
  validateRequest([
    body('productId')
      .exists().withMessage('productId is required')
      .isMongoId().withMessage('productId must be a valid Mongo ID'),
    body('name')
      .exists().withMessage('name is required')
      .isString(),
    body('creditsIncluded')
      .exists().withMessage('creditsIncluded is required')
      .isInt({ min: 0 }),
    body('interval')
      .exists().withMessage('interval is required')
      .isIn(PLAN_INTERVALS)
      .withMessage(`interval must be one of ${PLAN_INTERVALS.join(', ')}`),
    body('overagePrice')
      .exists().withMessage('overagePrice is required')
      .isNumeric(),
    body('costPerCredit')
      .exists().withMessage('costPerCredit is required')
      .isNumeric(),
    body('tenantPricePerCredit').optional().isNumeric(),
    body('tierMetadata').optional().isObject(),
  ]),
  createPlanHandler
);
router.get('/plans', listPlansHandler);



// ─── Subscription Creation ────────────────────────────
router.post(
  '/subscriptions',
  validateRequest([
    body('tenantId')
      .exists().withMessage('tenantId is required')
      .isMongoId().withMessage('tenantId must be a valid Mongo ID'),
    body('planId')
      .exists().withMessage('planId is required')
      .isMongoId().withMessage('planId must be a valid Mongo ID'),
  ]),
  createSubscriptionHandler
);



export default router;
