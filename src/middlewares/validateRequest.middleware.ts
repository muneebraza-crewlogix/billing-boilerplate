import { RequestHandler } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (
  validations: ValidationChain[]
): RequestHandler => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array().map((e) => ({
        field: (e as any).param,
        message: e.msg,
      })),
    });
    return;
  };
};
