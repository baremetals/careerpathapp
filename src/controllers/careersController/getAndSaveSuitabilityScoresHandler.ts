import { Request, Response } from 'express';
import createQuestionnaireResponse from '@/services/QuestionResponse/createQuestionnaireResponse';
import getUserSuitabilityScores from '@/services/QuestionResponse/getUserSuitabilityScores';
import saveSuitabilityScores from '@/services/QuestionResponse/saveSuitabilityScores';
import catchAsync from '@/utils/catchAsync';

export default catchAsync(async function getAndSaveSuitabilityScoresHandler(
  req: Request,
  res: Response,
) {
  await createQuestionnaireResponse(req.body, req.session.userName);
  console.log(
    'going to sort it all out for you mate bear with me-------------------------<',
  );
  const suitabilityScores = await getUserSuitabilityScores(req.body);

  await saveSuitabilityScores({
    scores: suitabilityScores,
    profileId: req.session.profileId,
    userName: req.session.userName,
  });

  res.status(201).json({
    data: suitabilityScores,
  });
});
