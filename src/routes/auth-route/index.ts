import { Router } from 'express';
import accountActivationHandler from '../../controllers/authController/accountActivationHandler';
import forgotPasswordRequestHandler from '../../controllers/authController/forgotPasswordRequestHandler';
import loginHandler from '../../controllers/authController/loginHandler';
import logoutHandler from '../../controllers/authController/logoutHandler';
import registerNewAccountHandler from '../../controllers/authController/registerNewAccountHandler';
import resetPasswordRequestHandler from '../../controllers/authController/resetPasswordRequestHandler';
import { AuthRoutePaths } from '../../enums/APIRoutPaths';
import { ROUTE_TOKEN } from '../../lib/constants';
import authMiddleware from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { loginSchema } from '../../user-input-validation-schema/login-schema';
import { registerUserSchema } from '../../user-input-validation-schema/register-user-schema';
import { resetPasswordSchema } from '../../user-input-validation-schema/reset-password-schema';

const authRouter = Router();

authRouter.post(
  AuthRoutePaths.REGISTER,
  validate(registerUserSchema),
  registerNewAccountHandler,
);

authRouter.post('/', validate(loginSchema), loginHandler);
authRouter.get(
  `${AuthRoutePaths.ACCOUNT_ACTIVATION}/:${ROUTE_TOKEN}`,
  accountActivationHandler,
);
authRouter.get(AuthRoutePaths.LOGOUT, authMiddleware, logoutHandler);
authRouter.post(
  AuthRoutePaths.FORGOT_PASSWORD_RESET_EMAIL,
  forgotPasswordRequestHandler,
);
authRouter.post(
  `${AuthRoutePaths.RESET_PASSWORD}/:${ROUTE_TOKEN}`,
  validate(resetPasswordSchema),
  resetPasswordRequestHandler,
);

export default authRouter;
