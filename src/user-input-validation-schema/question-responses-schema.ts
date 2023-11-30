import { Types } from 'mongoose';
import { z } from 'zod';
import { ERROR_MESSAGES } from '../lib/error-messages';

export const questionResponseSchema = z.object({
  selectedIndustries: z
    .array(z.string())
    .min(1, ERROR_MESSAGES.CAREER_PATH.INDUSTRY_MISSING),
  selectedSkills: z
    .array(z.string())
    .min(0, ERROR_MESSAGES.CAREER_PATH.SKILLS_MISSING),
  responses: z
    .array(
      z.object({
        questionId: z.instanceof(Types.ObjectId).or(z.string()),
        questionVersion: z.number(),
        questionNumber: z.number(),
        responseId: z.instanceof(Types.ObjectId).or(z.string()),
        responseToQuestion: z.string(),
      }),
    )
    .min(20, ERROR_MESSAGES.CAREER_PATH.MISSING_RESPONSE),
});
