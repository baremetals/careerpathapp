import { Router } from 'express';
import * as handler from '../../controllers/viewsController';

const uiRouter = Router();

uiRouter.get('/activate', handler.activationPageHandler);

export default uiRouter;
