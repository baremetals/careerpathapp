import { Router } from 'express';
import authMiddleware from '@/middleware/authMiddleware';

import { requestPresignedUrlHandler } from '@/controllers/uploadController';

const uploadRouter = Router();

// Protect all routes after this middleware
uploadRouter.use(authMiddleware);

uploadRouter.route('/').post(requestPresignedUrlHandler);

export default uploadRouter;
