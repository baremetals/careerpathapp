import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
  logoutHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  activateUserHandler,
  newActivationHandler,
} from '../../controllers/authController';
import authMiddleware from '../../middleware/authMiddleware';

const authRouter = Router();

authRouter.route('/register').post(registerHandler);

authRouter.route('/login').post(loginHandler);
authRouter.get('/activate/:token', activateUserHandler);
authRouter.post('/request-activation', newActivationHandler);
authRouter.get('/logout', authMiddleware, logoutHandler);
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password/:token', resetPasswordHandler);

export default authRouter;
