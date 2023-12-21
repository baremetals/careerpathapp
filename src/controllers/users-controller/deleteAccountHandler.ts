import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserStatuses } from '../../lib/auth-validation-config';
import { UserModel } from '../../models/User';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async function deleteAccountHandler(req, _res, next) {
  const user = await UserModel.findById(req.session.userId).select('+status');
  // console.log(req.body.currentPassword);
  if (!user) {
    return next(new AppError(ERROR_MESSAGES.AUTH.NO_USER_EXISTS, 404));
  }

  user.status = UserStatuses.DELETED;
  user.lastModifiedBy = user.fullName;
  user.updatedAt = new Date();
  await user.save({ validateBeforeSave: false });

  next();
});
