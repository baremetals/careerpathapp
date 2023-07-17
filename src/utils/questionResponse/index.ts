import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { IQuestionDocument } from '../../interfaces/question';
import { CareerPathResponseAndWeightModel } from '../../models/CareerPathResponseAndWeight';
import { IndustryModel } from '../../models/Industry';
import { UserQuestionResponseModel } from '../../models/UserQuestionResponse';
import AppError from '../../utils/appError';
// import { ICareerPathDocument } from '../../interfaces/careerPath';
import { CareerPathModel } from '../../models/CareerPath';
import { JobRoleModel } from '../../models/JobRole';
import { IUserQuestionResponseDocument } from '../../interfaces/user';
// import { IJobRoleDocument } from 'interfaces/careerPath';

async function getRulesForQuestion(industryId: Types.ObjectId) {
  return CareerPathResponseAndWeightModel.find({
    industry: industryId,
  }).exec();
}

async function traverseDecisionTree(
  // userId: string,
  selectedIndustries: Types.ObjectId[],
  questions: IQuestionDocument[],
  next: NextFunction,
  userResponses: IUserQuestionResponseDocument[],
): Promise<{ industry: string; score: number }[]> {
  try {
    // const userResponses = await getUserResponse(userId);
    const industryScores: { industry: string; score: number }[] = [];
    // console.log('the length of user responses', userResponses.length);
    // console.log('the length of the questions', questions.length);

    if (userResponses.length !== questions.length) {
      throw next(
        new AppError(
          'Number of user responses does not match the number of questions',
          401,
        ),
      );
    }

    for (const industry of selectedIndustries) {
      const objectId = new Types.ObjectId(industry);
      const rulesForQuestion = await getRulesForQuestion(objectId);
      let score = 0;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        // console.log('==============>: the question!!!!', question);
        const response = userResponses[i].response;
        // console.log('==============>: the user response!!!!', response);

        const matchRules = rulesForQuestion.filter(
          (rule) =>
            rule.response === response &&
            rule.questionId.toString() === question._id.toString(),
        );
        // console.log('==============>: matching the rules!!!!', matchRules);

        if (matchRules.length > 0) {
          // console.log(
          //   '==============>: matching the rules is greater than 0!!!!',
          //   matchRules,
          // );
          matchRules.forEach((matchRule) => {
            score += matchRule.weight;
            // console.log('==============>: the score here!!!!', score);
          });
        }
        const nextQuestionId = await getNextQuestionId(questions, question._id);
        const nextQuestionIndex = questions.findIndex(
          (q) => q._id === nextQuestionId,
        );
        if (nextQuestionIndex === -1) {
          break;
        }
      }
      industryScores.push({ industry: industry.toString(), score });
      console.log('Final=============================>Score:', industryScores);
    }
    return industryScores;
  } catch (error) {
    console.error('========fucking error!!!', error);
    // return error;
    throw next(
      new AppError('Something is wrong, please check back later', 401),
    );
  }
}

async function getUserResponse(userId: string) {
  return UserQuestionResponseModel.find({ user: userId }).exec();
}

async function getNextQuestionId(
  questions: IQuestionDocument[],
  currentQuestionId: string,
): Promise<string> {
  const currentIndex = questions.findIndex(
    (question) => question._id === currentQuestionId,
  );
  if (currentIndex === questions.length - 1) {
    return ''; // return empty string if at the end of the array
  }
  const nextQuestion = questions[currentIndex + 1];
  return nextQuestion._id;
}

async function fetchCareerPathRoles(
  industryScores: { industry: string; score: number }[],
  page = 1,
  limit = 5,
) {
  try {
    const skip = (page - 1) * limit;
    const industryIds: string[] = industryScores
      .filter((industry) => industry.score >= 0.5)
      .map((industry) => industry.industry);

    const industryDocs = await IndustryModel.find({ _id: { $in: industryIds } })
      .select('name')
      .lean()
      .exec();

    const careerPathPromises = industryDocs.map(async (industryDoc) => {
      const industryScoreObj = industryScores.find(
        (industry) => industry.industry === industryDoc._id.toString(),
      );

      if (!industryScoreObj) {
        return null; // Handle case when industry score object is not found
      }

      const industryScore = industryScoreObj.score;

      const paths = await CareerPathModel.find({
        industries: industryDoc._id,
      })
        .select(
          '-industries -requiredWeight -createdAt -lastModifiedAt -createdBy -lastModifiedBy',
        )
        .lean()
        .exec();

      if (paths.length > 0) {
        const pathPromises = paths.map(async (path) => {
          const jobRoles = await JobRoleModel.find({
            careerPath: path._id,
            requiredWeight: { $lte: industryScore / 10 },
          })
            .select(
              '-careerPath -educationRequirements -skills -progressPaths -relatedCareers -aliasTitles -requiredWeight',
            )
            .lean()
            .exec();

          return {
            myPaths: path.title,
            jobs: jobRoles,
          };
        });

        const roles = await Promise.all(pathPromises);

        const paginatedRoles = roles.map((role) => {
          return role.jobs.slice(skip, skip + limit);
          // return {
          //   myPaths: role.myPaths,
          //   jobs: paginatedJobs,
          // };
        });

        return {
          industry: industryDoc.name,
          paths,
          // ...paginatedRoles,
          jobs: paginatedRoles[0],
        };
      } else {
        return null; //
      }
    });

    const careerPathResults = await Promise.all(careerPathPromises);
    const filteredResults = careerPathResults.filter(
      (result) => result !== null,
    );

    return { careerPaths: filteredResults };
  } catch (error) {
    throw new AppError(
      'Your account has been deactivated. Please reactivate your account',
      400,
    );
  }
}

export {
  fetchCareerPathRoles,
  getRulesForQuestion,
  getUserResponse,
  traverseDecisionTree,
};
