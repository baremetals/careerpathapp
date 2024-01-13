import { ERROR_MESSAGES } from '@/lib/error-messages';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import { UserRepo } from '@/repository/UserRepo';
import AppError from '@/utils/appError';
import catchAsync from '@/utils/catchAsync';

export default catchAsync(async function deleteAccountHandler(req, _res, next) {
  const userRepo = new UserRepo();
  const user = await userRepo.softDeleteUser(req.session.userId);
  // console.log(req.body.currentPassword)
  if (!user) {
    return next(
      new AppError(
        ERROR_MESSAGES.AUTH.NO_USER_EXISTS,
        HTTP_STATUS_CODES.NOT_FOUND,
      ),
    );
  }
  next();
});
