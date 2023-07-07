import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { IQuestionDocument, IQuestionResponseDocument } from '../../interfaces';
import { DecisionTreeRuleModel } from '../../models/DecisionTreeRule';
import { QuestionResponseModel } from '../../models/QuestionResponse';
import AppError from '../../utils/appError';
import { IndustryModel } from '../../models/Industry';
import { ICareerPathDocument } from '../../interfaces/careerPath';
import { CareerPathModel } from '../../models/CareerPath';
import { JobRoleModel } from '../../models/JobRole';
import { IJobRoleDocument } from 'interfaces/careerPath';


async function getRulesForQuestion(industryId: Types.ObjectId) {
  return DecisionTreeRuleModel.find({
    industry: industryId,
  }).exec();
}

async function traverseDecisionTree(
  // userId: string,
  selectedIndustries: Types.ObjectId[],
  questions: IQuestionDocument[],
  next: NextFunction,
  userResponses: IQuestionResponseDocument[],
): Promise<{ industry: string; score: number }[]> {
  try {
    // const userResponses = await getUserResponse(userId);
    const industryScores: { industry: string; score: number }[] = [];
    console.log('the length of user responses', userResponses.length);
    console.log('the length of the questions', questions.length);

    if (userResponses.length !== questions.length) {
      // throw new Error(
      //   'Number of user responses does not match the number of questions',
      // );
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
  return QuestionResponseModel.find({ user: userId }).exec();
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


// async function fetchCareerPathRoles(
//   industryScores: { industry: string; score: number }[],
//   next: NextFunction,
// ) {
//   try {
//     console.log(industryScores);
//     // const industryScores: { industry: string; score: number }[] = [];
//     // const careerPaths: any[] = [];
//     const careerPaths: { industry: string; paths: ICareerPathDocument[] }[] =
//       [];
//     const roles: { myPaths: string; jobs: IJobRoleDocument[] }[] = [];

//     for (const industry of industryScores) {
//       // console.log(industry);
//       if (industry.score >= 0.5) {
//         const ind = await IndustryModel.findById(industry.industry).exec();
//         const paths = await CareerPathModel.find({
//           industries: { $in: [industry.industry] },
//         }).exec();
//         // console.log('=============The Paths========>', paths);
//         if (paths) {
//           console.log('=============The Path========>', typeof paths);
//           careerPaths.push({industry: ind?.name as string, paths  });
//           for (const path of paths) {

//             const jobRoles = await JobRoleModel.find({
//               careerPath: path._id,
//             }).exec();
            
//             roles.push({ myPaths: path?.title as string, jobs: jobRoles });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     throw next(
//       new AppError(
//         'Your account has been deactivated. Please reactivate your account',
//         400,
//       ),
//     );
//   }
// }

async function fetchCareerPathRoles(
  industryScores: { industry: string; score: number }[],
  userResponses: IQuestionResponseDocument[],
  // _next: NextFunction,
) {
  try {
    const careerPaths: { industry: string; paths: ICareerPathDocument[] }[] =
      [];
    const roles: { myPaths: string; jobs: IJobRoleDocument[] }[] = [];

    for (const industry of industryScores) {
      if (industry.score >= 0.5) {
        const industryDoc = await IndustryModel.findById(
          industry.industry,
        ).exec();
        console.log('====the industryDoc', industryDoc)
        if (industryDoc) {
          const paths = await CareerPathModel.find({
            industries: { $in: [industry.industry] },
          }).exec();
          console.log('====the career paths', paths);
          if (paths.length > 0) {
            careerPaths.push({ industry: industryDoc.name as string, paths });
            for (const path of paths) {
              const jobRoles = await JobRoleModel.find({
                careerPath: path._id,
              }).exec();
              const matchedRoles = await filterJobRoles(jobRoles, userResponses);
              console.log(matchedRoles);
              roles.push({ myPaths: path.title as string, jobs: matchedRoles });
            }
          }
        }
      }
    }

    return { careerPaths, roles };
  } catch (error) {
    throw new AppError(
      'Your account has been deactivated. Please reactivate your account',
      400,
    );
  }
}

async function filterJobRoles(
  roles: IJobRoleDocument[],
  userResponses: IQuestionResponseDocument[],
): Promise<IJobRoleDocument[]> {
  //requiredResponses
  console.log('========the roles length========>:', roles.length);
  const selectedRoles: IJobRoleDocument[] = [];
  const userResponsesMap = new Map<string, IQuestionResponseDocument>();

  for (const response of userResponses) {
    userResponsesMap.set(response.question.toString(), response);
  }

  for (const role of roles) {
    const { requiredResponses } = role;
    const requiredQuestions = new Set(requiredResponses.map((r) => r.question));
    let totalScore = 0;
    console.log('========the roles========>:', role);

    for (const question of requiredQuestions) {
      const matchingResponse = userResponsesMap.get(question.toString());
      if (matchingResponse?.response === 'irrelevant') {
        totalScore++;
      }
        if (
          matchingResponse &&
          matchingResponse.response ===
            requiredResponses.find((r) => r.question === question)?.response
        ) {
          console.log('the responses required========>:', requiredResponses);
          totalScore++;
        }
    }
    if (totalScore >= 5) {
      selectedRoles.push(role);
    }
  }
  return selectedRoles;
}


export {
  fetchCareerPathRoles,
  getRulesForQuestion,
  getUserResponse,
  traverseDecisionTree,
};
