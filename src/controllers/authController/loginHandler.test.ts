import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';
import { AuthRoutePaths } from '../../enums/APIRoutPaths';
import {
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from '../../utils/test-utils/constants';
import { InputFields } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '../../utils/test-utils';
import createTestServer from '../../utils/test-utils/createTestServer';
import { CookieNames } from '../../lib/constants';
import createTestUser from '../../utils/test-utils/create-test-user';

describe('user login handler', () => {
  process.env.NODE_ENV = 'development';
  let app: Application | undefined;
  const redis = new Redis();

  beforeAll(async () => {
    app = await createTestServer();
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    // server.close();
  });
  it('should receive auth session in the header upon login', async () => {
    const { user } = await createTestUser();

    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email, // TEST_USER_EMAIL_ALTERNATE,
        password: TEST_USER_PASSWORD,
      });
    expect(response.status).toBe(200);
    expect(
      response.headers['set-cookie'][0].includes(CookieNames.ACCESS_TOKEN),
    ).toBeTruthy();
    // console.log('===============>', response.headers);
  });

  it('gets appropriate error for missing email and password', async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: '',
        password: '',
      });
    // console.log('===============>', response.body);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.EMAIL),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD),
    ).toBeTruthy();

    expect(response.status).toBe(400);
  });

  it('gets appropriate error for non existent email', async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST,
    );
  });
});
