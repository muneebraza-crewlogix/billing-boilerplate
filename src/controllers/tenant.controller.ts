import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { tenantService } from '@/services/tenant.service';

export async function onboardTenantHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, type, reloadThreshold } = req.body;

    const result = await tenantService.onboardTenant({ name, email, type, reloadThreshold });
    // result has both the saved tenant fields and an `onboardingUrl`
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createSetupIntentHandler(req: Request, res: Response) {
  const { tenantId } = req.params;
  const clientSecret = await tenantService.createSetupIntent(tenantId);
  res.json({ clientSecret });
}

export async function createPayoutOnboardHandler(req: Request, res: Response) {
  const { tenantId } = req.params;
  const url = await tenantService.createPayoutOnboardingLink(tenantId);
  res.json({ url });
}