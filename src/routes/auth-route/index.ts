import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  newActivationHandler,
} from '../../controllers/auth-controller';
import registerNewAccountHandler from 'controllers/auth-controller/registerNewAccountHandler';
import authMiddleware from '../../middleware/authMiddleware';
import { validate } from 'middleware/validate';
import { registerUserSchema } from 'user-input-validation-schema/register-user-schema';
import accountActivationHandler from 'controllers/auth-controller/accountActivationHandler';

const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerUserSchema),
  registerNewAccountHandler,
);

authRouter.route('/login').post(loginHandler);
authRouter.get('/activate/:token', accountActivationHandler);
authRouter.post('/request-activation', newActivationHandler);
authRouter.get('/logout', authMiddleware, logoutHandler);
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password/:token', resetPasswordHandler);

export default authRouter;
