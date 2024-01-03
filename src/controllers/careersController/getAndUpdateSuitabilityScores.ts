import { Request, Response } from 'express';
import getUserSuitabilityScores from '@/services/QuestionResponse/getUserSuitabilityScores';
import updateSuitabilityScores from '@/services/QuestionResponse/updateSuitabilityScores';
import updateQuestionnaireResponse from '@/services/QuestionResponse/updateQuestionnaireResponse';
import catchAsync from '@/utils/catchAsync';

export default catchAsync(async function getAndUpdateSuitabilityScoresHandler(
  req: Request,
  res: Response,
) {
  await updateQuestionnaireResponse(req.body, req.session.userName);
  console.log(
    'going to sort it all out for you mate bear with me-------------------------<',
  );
  const suitabilityScores = await getUserSuitabilityScores(req.body);

  await updateSuitabilityScores({
    scores: suitabilityScores,
    profileId: req.session.profileId,
    userName: req.session.userName,
  });

  res.status(201).json({
    data: suitabilityScores,
  });
});
