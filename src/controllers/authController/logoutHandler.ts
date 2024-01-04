import { Request, Response } from 'express';
import { CookieNames } from '@/lib/constants';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';

export default function logoutHandler(req: Request, res: Response) {
  req.session?.destroy((err: any) => {
    if (err) {
      console.log('destroy session failed I am zod');
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: 'Logout failed' });
    }
    console.log(`Session destroyed for user ${req.session?.userId}`);
  });
  res.clearCookie(CookieNames.ACCESS_TOKEN);
  res.status(HTTP_STATUS_CODES.OK).json({});
}
