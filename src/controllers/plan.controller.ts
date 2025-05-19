import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { planService, CreatePlanDTO } from '@/services/plan.service';

export async function createPlanHandler(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const dto = req.body as CreatePlanDTO;
    const plan = await planService.createPlan(dto);
    res.status(StatusCodes.CREATED).json(plan);
  } catch (err) {
    next(err);
  }
}

export async function listPlansHandler(
  _req: Request, res: Response, next: NextFunction
) {
  try {
    const plans = await planService.listPlans();
    res.status(StatusCodes.OK).json(plans);
  } catch (err) {
    next(err);
  }
}