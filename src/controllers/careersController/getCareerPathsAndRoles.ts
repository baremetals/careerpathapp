import { Request, Response } from 'express';
import getMilvusRecommendedRoles from '@/services/Careers/getMilvusRecommendedRoles';
import saveCareerPathsAndRoles from '@/services/Careers/saveCareerPathsAndRoles';
import createQuestionnaireResponse from '@/services/QuestionResponse/createQuestionnaireResponse';
import catchAsync from '@/utils/catchAsync';
import findCareerPathsAndRoles from '@/services/Careers/findCareerPathsAndRoles';

export default catchAsync(async function getCareerPathsAndRoles(
  req: Request,
  res: Response,
) {
  await createQuestionnaireResponse(req.body, req.session.userName);
  console.log(
    'going to sort it all out for you mate bear with me-------------------------<',
  );
  const milvusRoles = await getMilvusRecommendedRoles(req.body);

  const careerPathAndRoleIds = await saveCareerPathsAndRoles({
    roles: milvusRoles.job_roles,
    profileId: req.session.profileId,
    userName: req.session.userName,
  });

  const { careerPathDocs, jobRoleDocs } = await findCareerPathsAndRoles(
    careerPathAndRoleIds,
  );

  res.status(201).json({
    data: {
      careerPaths: careerPathDocs,
      jobRoles: jobRoleDocs,
    },
  });
});
