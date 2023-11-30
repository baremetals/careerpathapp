import { Request, Response } from 'express';
import { CookieNames } from '../../lib/constants';

export default async function logoutHandler(req: Request, res: Response) {
  req.session?.destroy((err: any) => {
    if (err) {
      console.log('destroy session failed I am zod');
      return;
    }
    console.log('session destroyed', req.session?.userId);
  });
  res.clearCookie(CookieNames.ACCESS_TOKEN);
  res.status(200).json({});
}
