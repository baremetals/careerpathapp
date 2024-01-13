import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { AuthRoutePaths } from '../../enums/APIRoutPaths';
import createTestServer from '../../utils/test-utils/createTestServer';
import createTestUser from '../../utils/test-utils/create-test-user';
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '@/utils/test-utils';
import { InputFields } from '@/lib/constants';

describe('forgot password handler', () => {
  process.env.NODE_ENV = 'development';
  let app: Application | undefined;
  const redis = new Redis();

  beforeAll(async () => {
    app = await createTestServer();
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
  });
  it('calls sendEmail service', async () => {
    const { user } = await createTestUser();
    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.FORGOT_PASSWORD_RESET_EMAIL}`,
      )
      .send({
        email: user.email,
      });
    expect(response.status).toBe(200);
  });
  it('sends appropriate error when no email provided', async () => {
    const response = await request(app).post(
      `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.FORGOT_PASSWORD_RESET_EMAIL}`,
    );
    expect(response.status).toBe(400);
    expect(response.body.error);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.EMAIL),
    ).toBeTruthy();
  });
});
