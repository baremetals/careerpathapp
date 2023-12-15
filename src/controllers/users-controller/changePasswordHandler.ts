import * as argon2 from 'argon2';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
import { EmailService } from '../../services/NotificationService';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async function changePasswordHandler(req, res, next) {
  const user = await UserModel.findById(req.session.userId).select('+password');
  // console.log(req.body.currentPassword);

  if (!user) {
    return next(new AppError(ERROR_MESSAGES.AUTH.NO_USER_EXISTS, 404));
  }

  if (!(await argon2.verify(user.password, req.body.currentPassword))) {
    return next(
      new AppError(ERROR_MESSAGES.VALIDATION.AUTH.INVALID_PASSWORD, 401),
    );
  }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.lastModifiedBy = user.fullName;
  user.lastModifiedAt = new Date();
  await user.save();

  await new EmailService(user).sendPasswordChangeEmail();

  res.status(201).json({
    message: 'Your password has been changed',
  });
});
