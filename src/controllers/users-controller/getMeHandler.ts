import { NextFunction, Request, Response } from 'express';

export default function getMeHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.params.id = req.session.userId;
  next();
}
