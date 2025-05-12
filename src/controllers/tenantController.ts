import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { tenantService } from '@/services/tenantService';

export async function onboardTenantHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, type, email, reloadThreshold } = req.body;
    const tenant = await tenantService.onboardTenant({
      name,
      type,
      email,
      reloadThreshold,
    });

    res.status(StatusCodes.CREATED).json(tenant);
  } catch (err) {
    next(err);
  }
}

export async function attachPaymentMethodHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { tenantId } = req.params;
    const { email, paymentMethodId } = req.body;
    const customer = await tenantService.attachPaymentMethod(tenantId, email, paymentMethodId);

    res.status(StatusCodes.OK).json({ stripeCustomerId: customer.id });
  } catch (err) {
    next(err);
  }
}
