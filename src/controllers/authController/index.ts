import { NextFunction, Request, Response } from 'express';
// import Redis from 'ioredis';
// import argon2 from 'argon2';
import { UserModel } from '../../models/User';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { isPasswordValid } from '../../utils/validators/PasswordValidators';
import { createUserInitialProfile } from '../../services/UserService';
// import { IUserDocument } from 'interfaces/users';

export const registerHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const redis = new Redis();
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
      passwordConfirm: req.body.passwordConfirm,
      createdBy: fullName,
      lastModifiedBy: fullName,
    });

    const profile = await createUserInitialProfile(newUser._id);

    if (!profile) {
      // TODO:
      // this will be a good use case for sentry.
      console.log('======>: something happened the profile failed to create', profile)
      // return next(
      //   new AppError(
      //     'Your account has been created',
      //     400,
      //   ),
      // );
    }

    //   const token = v4();
    //   await redis.set(
    //     ACCOUNT_ACTIVATED + token,
    //     newUser._id,
    //     'EX',
    //     1000 * 60 * 60 * 24 * 2,
    //   ); // 48 hours

    req.session!.userId = newUser._id;
    const createdUser = await UserModel.findById(newUser._id).select(
      '-password -createdAt -lastModifiedAt -createdBy -lastModifiedBy',
    );

    res.status(201).json({
      status: 'success',
      message: 'Your user account has been created',
      data: createdUser,
    });
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

    if (!user || !user.correctPassword((user.password as string), password)) {
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

    req.session!.userId = user._id;
    req.session!.role = user.role? user.role : 'user';

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
