import { Router } from 'express';
import * as handler from '../../controllers/viewsController';

const uiRouter = Router();

uiRouter.get('/', handler.homePageHandler);
uiRouter.get('/register', handler.registerPageHandler);
uiRouter.get('/login', handler.loginPageHandler);
uiRouter.get('/activate', handler.activationPageHandler);

export default uiRouter;
