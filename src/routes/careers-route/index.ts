import { Router } from 'express';
import { getAllQuestionsHandler } from '../../controllers/careersController/getQuestionsHandler';
import { rootHandler } from '../../controllers/rootController';
// import { generateCareerPath } from '../../controllers/users-controller';
import { CareerRoutePaths } from '../../enums/APIRoutPaths';
import questionResponseMiddleware from '../../middleware/questionResponseMiddleware';
import getAndSaveSuitabilityScoresHandler from '../../controllers/careersController/getAndSaveSuitabilityScoresHandler';
import authMiddleware from '../../middleware/authMiddleware';
import getAndUpdateSuitabilityScoresHandler from '../../controllers/careersController/getAndUpdateSuitabilityScores';
import getMyQuestionResponsesHandler from '../../controllers/careersController/getMyQuestionResponsesHandler';

const careerPathRouter = Router();

careerPathRouter.route('/').get(rootHandler);
careerPathRouter.get(CareerRoutePaths.QUESTIONS, getAllQuestionsHandler);

careerPathRouter.use(authMiddleware);

careerPathRouter
  .route(CareerRoutePaths.QUESTION_RESPONSES)
  .get(getMyQuestionResponsesHandler)
  .post(questionResponseMiddleware, getAndSaveSuitabilityScoresHandler)
  .put(questionResponseMiddleware, getAndUpdateSuitabilityScoresHandler);

// careerPathRouter.post(,
//   generateCareerPath,
// );
// userRouter.post(
//   '/me/question-responses/:objectId',
//   handler.updateQuestionResponse,
//   handler.generateCareerPath,
// );

export default careerPathRouter;
