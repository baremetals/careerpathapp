import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
  logoutHandler,
} from '../../controllers/authController';

const authRouter = Router();

authRouter.route('/register').post(registerHandler);

authRouter.route('/login').post(loginHandler);
authRouter.get('/logout', logoutHandler);

export default authRouter;
