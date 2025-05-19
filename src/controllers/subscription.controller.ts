import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { subscriptionService, CreateSubscriptionDTO } from '@/services/subscription.service';

export async function createSubscriptionHandler(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const dto: CreateSubscriptionDTO = req.body;
    const sub = await subscriptionService.createSubscription(dto);
    res.status(StatusCodes.CREATED).json(sub);
  } catch (err) {
    next(err);
  }
}
