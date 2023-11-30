import { IIndustryDocument } from '../../interfaces/careerPath';
import { TSuitabilityScoreType } from '../../interfaces/userProfile';

export interface ISuitabilityScoreReturnType {
  errors: any;
  selected_industries_scores: [];
  suitability_scores: [];
  version: string;
}

type ScoreToIndustryMappingFunction = (
  score: TSuitabilityScoreType,
  industry: IIndustryDocument,
) => boolean;

type MappedScoreType = TSuitabilityScoreType & { industryId: string };

export function mapScoresToIndustries(
  industries: IIndustryDocument[],
  scores: TSuitabilityScoreType[],
  scoreToIndustryMappingFunc: ScoreToIndustryMappingFunction,
): MappedScoreType[] {
  const mappedScores: MappedScoreType[] = [];

  for (const industry of industries) {
    scores.forEach((score) => {
      if (scoreToIndustryMappingFunc(score, industry)) {
        mappedScores.push({
          ...score,
          industryId: industry._id,
        });
      }
    });
  }

  return mappedScores;
}
