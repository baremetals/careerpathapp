import { Router } from 'express';
import { protect, restrictTo } from '../../controllers/authController/guards';
import * as handler from '../../controllers/adminController'

const adminRouter = Router();

// Protect all routes
adminRouter.use(protect, restrictTo('admin', 'dev'));

// Questions
adminRouter.route('/question').post(handler.createQuestion);
adminRouter.route('/questions').post(handler.createManyQuestions);


// Industries
adminRouter.route('/industry').post(handler.createIndustry);
adminRouter.route('/industries').post(handler.createManyIndustries);


// Career Paths
adminRouter.route('/career-path').post(handler.createCareerPath);
adminRouter.route('/career-paths').post(handler.createManyCareerPaths);

// Decision Tree Rules
adminRouter.route('/decision-tree-rule').post(handler.createCareerPath);
adminRouter.route('/decision-tree-rules').post(handler.createManyDecisionTreeRules);

// Job roles
adminRouter.route('/job-role').post(handler.createJobRole);

export default adminRouter;