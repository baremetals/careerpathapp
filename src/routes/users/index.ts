import { Router } from 'express';
import { protect } from '../../controllers/authController/guards';
// import * as handler from '../../controllers/userController';
import * as handler from '../../controllers/userController';

import { multerUpload } from '../../lib/fileUpload';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         _id:
 *           type: string
 *           description: Autogenerated ObjectID
 *         firstName:
 *           type: string
 *           description: user first name
 *         lastName:
 *           type: string
 *           description: user last name
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users API
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Returns the logged in user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A Single user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

const userRouter = Router();

// Protect all routes after this middleware
userRouter.use(protect);

userRouter.get('/me', handler.getMe, handler.getUser);
userRouter.patch('/me/update', handler.updateMe);
userRouter.post(
  '/me/avatar',
  multerUpload.single('avatar'),
  handler.updateAvatar,
);
userRouter.post('/me/change-password', handler.changePassword);

userRouter.post(
  '/me/question-responses',
  handler.createQuestionResponse,
  handler.generateCareerPath,
);
userRouter.post(
  '/me/question-responses/:objectId',
  handler.updateQuestionResponse,
  handler.generateCareerPaths,
);

userRouter
  .route('/profile')
  .get(handler.getUserWithProfile)
  .post(handler.createProfile)
  .patch(handler.updateProfile)
  .delete(handler.deleteProfile);

userRouter.post('/profile/experience', handler.createExperience);
userRouter
  .route('/profile/experience/:objectId')
  // .get()
  .patch(handler.updateExperience)
  .delete(handler.deleteExperience);

userRouter.post('/profile/education', handler.createEducation);
userRouter
  .route('/profile/education/:objectId')
  // .get()
  .patch(handler.updateEducation)
  .delete(handler.deleteEducation);

userRouter.post('/profile/certification', handler.createCertification);
userRouter
  .route('/profile/certification/:objectId')
  // .get()
  .patch(handler.updateCertification)
  .delete(handler.deleteCertification);
// Routes for a user to an interest or skill that doesn't exist in the database
userRouter.post(
  'profile/add-interest',
  handler.createInterest,
  handler.updateProfile,
);
export default userRouter;
