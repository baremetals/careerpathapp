import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';
import { AuthRoutePaths, UsersRoutePaths } from '../../enums/APIRoutPaths';
import { CookieNames } from '../../lib/constants';
import createTestUser from '../../utils/test-utils/create-test-user';
import createTestServer from '../../utils/test-utils/createTestServer';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { TEST_USER_PASSWORD } from '../../utils/test-utils/constants';

describe('logout handler', () => {
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
  it('receives auth session in the req header upon login', async () => {
    const { user } = await createTestUser();

    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_PASSWORD,
      });

    expect(response.status).toBe(200);
    expect(
      response.headers['set-cookie'][0].includes(CookieNames.ACCESS_TOKEN),
    ).toBeTruthy();

    const logoutResponse = await request(app)
      .get(`/api${AuthRoutePaths.ROOT}${AuthRoutePaths.LOGOUT}`)
      .set('x-test-user-id', response.body.user.id);
    expect(logoutResponse.status).toBe(200);

    const getMeAfterLogoutResponse = await request(app).get(
      `/api${UsersRoutePaths.ROOT}`,
    );
    expect(getMeAfterLogoutResponse.status).toBe(401);
    expect(getMeAfterLogoutResponse.body).not.toHaveProperty('user');
    expect(getMeAfterLogoutResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.NOT_LOGGED_IN,
    );
  });
});
