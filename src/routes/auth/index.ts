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

const authRouter = Router();

authRouter.route('/register').post(registerHandler);

authRouter.route('/login').post(loginHandler);
authRouter.get('/activate/:token', activateUserHandler);
authRouter.post('/request-activation', newActivationHandler);
authRouter.get('/logout', logoutHandler);
authRouter.post('/forgotPassword', forgotPasswordHandler);
authRouter.post('resetPassword', resetPasswordHandler);

export default authRouter;
