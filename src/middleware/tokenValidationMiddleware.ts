import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { TokenService } from '@/services/TokenService';
import AppError from '@/utils/appError';
import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    decoded: { email: string };
  }
}

const tokenValidationMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { token } = req.params;
  const tokenService = new TokenService();
  // console.log('tokenValidationMiddleware', token)

  if (!token) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }

  const decoded: { email: string } = tokenService.verifyToken(
    token,
    process.env.ACCOUNT_ACTIVATION_TOKEN_PUBLIC_KEY as string,
  ) as { email: string };

  if (!decoded) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      ),
    );
  }
  req.decoded = decoded;

  next();
};
export default tokenValidationMiddleware;
