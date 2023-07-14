import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { UserModel } from '../../models/User';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { isPasswordValid } from '../../utils/validators/PasswordValidators';
import { createUserInitialProfile } from '../../services/UserService';
import { EmailService } from '../../services/EmailService';
import { v4 } from 'uuid';
import { ACCOUNT_ACTIVATED } from '../../lib/constants';
import { IUserDocument } from '../../interfaces/user';

const createActivationToken = async (
  user: IUserDocument,
  req: Request,
  res: Response,
) => {
  const redis = new Redis();
  try {
    const token = v4();
    await redis.set(
      ACCOUNT_ACTIVATED + token,
      user._id,
      'EX',
      1000 * 60 * 60 * 24,
    ); // 24 hours
    const url = `${req.protocol}://${req.get(
      'host',
    )}/api/auth/activate/${token}`;
    await new EmailService(user, url).sendWelcomeEmail();
    res.status(201).json({
      status: 'success',
      message:
        'Your user account has been created, please activate your account to begin.',
    });
  } catch (error) {}
};

export const registerHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log('===============>', req.body)
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (user && user?.isDisabled) {
      return next(
        new AppError(
          'Your account has been deactivated. Please reactivate your account',
          400,
        ),
      );
    }

    const result = isPasswordValid(req.body.password);
    if (!result.isValid) {
      return next(new AppError(result.message, 400));
    }
    const fullName = `${req.body.firstName} ${req.body.lastName}`;
    const newUser = await UserModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName,
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      createdBy: fullName,
      lastModifiedBy: fullName,
    });

    const profile = await createUserInitialProfile(newUser._id);

    if (!profile) {
      // TODO:
      // this will be a good use case for sentry.
      console.log(
        '======>: something happened the profile failed to create',
        profile,
      );
      // return next(
      //   new AppError(
      //     'Your account has been created',
      //     400,
      //   ),
      // );
    }
    // const createdUser = await UserModel.findById(newUser._id).select(
    //   '-password -createdAt -lastModifiedAt -createdBy -lastModifiedBy',
    // );
    newUser.profile = profile._id;
    newUser.save({ validateBeforeSave: false });
    newUser.password = '';
    createActivationToken(newUser, req, res);
  },
);

export const activateUserHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redis = new Redis();
    const key = ACCOUNT_ACTIVATED + req.params.token;
    const userId = await redis.get(key);

    if (!userId) {
      return next(
        new AppError('this token has expired. Please request a new token', 401),
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    if (user.isActive) {
      return 'Your account is already activated.';
    }

    user.isActive = true;
    user.lastModifiedBy = user.fullName;
    user.lastModifiedAt = new Date();
    user.save({ validateBeforeSave: false });

    await redis.del(key);

    res.status(201).json({
      status: 'success',
      message: 'Your user account has been activated you may now log in.',
    });
  },
);

export const newActivationHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) {
      return next(new AppError('Please provide your email!', 400));
    }

    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return next(new AppError('User not found.', 404));
    }
    createActivationToken(user, req, res);
  },
);

export const loginHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log('===============>', req.body)
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // Check if user exists && password is correct
    const user = await UserModel.findOne({
      email,
    }).select('+password');
    // console.log(user.password)

    // if (!user || !(await argon2.verify(user!.password as string, password))) {
    //   return next(new AppError('Incorrect email or password', 401));
    // }

    if (
      !user ||
      !user.correctPassword(password as string, user.password as string)
    ) {
      return next(new AppError('Incorrect email or password', 401));
    }

    if (!user?.isActive) {
      return next(
        new AppError('User has not confirmed their registration email.', 400),
      );
    }

    if (user?.isDisabled) {
      return next(
        new AppError(
          'Your account has been deactivated. Please register again with the same email address',
          400,
        ),
      );
    }

    user.password = '';

    req.session.userId = user._id;
    req.session.role = user.role ? user.role : 'user';

    res.status(201).json({
      status: 'success',
      message: 'Your user account has been created',
      data: { user },
    });
  },
);

export const logoutHandler = (req: Request, res: Response) => {
  req.session?.destroy((err: any) => {
    if (err) {
      console.log('destroy session failed');
      return;
    }
    console.log('session destroyed', req.session?.userId);
  });
  res.clearCookie('connect.sid');
  res.status(200).json({ status: 'success' });
};

export const forgotPasswordHandler = catchAsync(async (req, res, next) => {
  const redis = new Redis();

  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found.', 404));
  }
  const token = v4();

  await redis.set(
    'RESET_PASSWORD' + token,
    user._id,
    'EX',
    1000 * 60 * 60 * 24 * 2,
  ); // 48 hours

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/users/resetPassword/${token}`;
    await new EmailService(user, resetURL).sendPasswordResetEmail();

    res.status(200).json({
      status: 'success',
      message: 'Please check your email for the reset password link',
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

export const resetPasswordHandler = catchAsync(async (req, res, next) => {
  const redis = new Redis();
  const key = 'RESET_PASSWORD' + req.params.token;
  const userId = await redis.get(key);

  const user = await UserModel.findById(userId);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(
      new AppError('Token has expired, please request new token', 400),
    );
  }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.lastModifiedBy = user.fullName;
  user.lastModifiedAt = new Date();
  await user.save();

  await redis.del(key);
  await new EmailService(user).sendPasswordChangeEmail();

  res.status(201).json({
    status: 'success',
    message: 'Your password has been changed, you may now log in',
  });
});
