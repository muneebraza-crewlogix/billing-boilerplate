import { Router } from 'express';
import { body, param } from 'express-validator';

import { onboardTenantHandler, attachPaymentMethodHandler } from '@/controllers/tenantController';

import { validateRequest } from '@/middlewares/validateRequest';

import { TENANT_TYPES } from '@/constants/billingConstants';

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

export default router;
