import { NextFunction, Request, Response } from 'express';

export default function redirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
}
