import { Router } from 'express';
import { rootHandler } from '../../controllers/rootController';

const careerPathRouter = Router();

careerPathRouter.route('/').get(rootHandler);

export default careerPathRouter;
