import { Request, Response, NextFunction } from 'express';
import { CommonError } from '../models/error.model';

/**
 * serialize the error object
 */
function errorHandler(
  err: TypeError | CommonError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let commonError = err;
  const statusCode = res.statusCode ? res.statusCode : 500

  if (!(err instanceof CommonError)) {
    commonError = new CommonError('this error is not commonError');
  }

  res.status(statusCode).json(
    {
      message: err.message
    }
  );
}
export default errorHandler;
