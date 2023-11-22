import { Router } from 'express';
import registerNewAccountHandler from '../../controllers/auth-controller/registerNewAccountHandler';
import authMiddleware from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { registerUserSchema } from '../../user-input-validation-schema/register-user-schema';
import accountActivationHandler from '../../controllers/auth-controller/accountActivationHandler';
import loginHandler from '../../controllers/auth-controller/loginHandler';
import logoutHandler from '../../controllers/auth-controller/logoutHandler';
import forgotPasswordRequestHandler from '../../controllers/auth-controller/forgotPasswordRequestHandler';
import resetPasswordRequestHandler from '../../controllers/auth-controller/resetPasswordRequestHandler';
import { AuthRoutePaths } from '../../enums/APIRoutPaths';
import { loginSchema } from '../../user-input-validation-schema/login-schema';
import { changePasswordSchema } from '../../user-input-validation-schema/change-password-schema';
import { ROUTE_TOKEN } from '../../lib/constants';

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
  validate(changePasswordSchema),
  resetPasswordRequestHandler,
);

export default authRouter;
