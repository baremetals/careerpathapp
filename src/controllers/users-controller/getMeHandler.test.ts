import { Application } from 'express';
// import Redis from 'ioredis'
import request from 'supertest';
import { AuthRoutePaths, UsersRoutePaths } from '../../enums/APIRoutPaths';
import { CookieNames } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { TEST_USER_PASSWORD } from '../../utils/test-utils/constants';
import createTestUser from '../../utils/test-utils/create-test-user';
import createTestServer from '../../utils/test-utils/createTestServer';

jest.setTimeout(30000);
describe('get me/user handler', () => {
  process.env.NODE_ENV = 'development';
  let app: Application | undefined;
  // const redis = new Redis()

  beforeAll(async () => {
    app = await createTestServer();
    // await redis.flushdb()
  });

  afterAll(async () => {
    // await redis.quit()
    // server.close()
  });
  it(`a logged in user should be able to fetch their details`, async () => {
    const { user } = await createTestUser();

    const loginResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_PASSWORD,
      });
    expect(loginResponse.status).toBe(200);
    expect(
      loginResponse.headers['set-cookie'][0].includes(CookieNames.ACCESS_TOKEN),
    ).toBeTruthy();
    // Get logged in user details
    const response = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ME}`)
      .set('x-test-user-id', loginResponse.body.user.id);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.user).not.toHaveProperty('password');
    expect(response.body.data.user).toHaveProperty('createdAt');
    expect(response.body.data.user.status).toBe('active');
    expect(response.body.data.user.firstName).toBe(user.firstName);
    expect(response.body.data.user.email).toBe(user.email);
  });

  it(`sends an error if the user doesn't  exist or user doesn't have an active session`, async () => {
    const requestWithoutActiveSessionResponse = await request(app).get(
      `/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ME}`,
    );
    expect(requestWithoutActiveSessionResponse.status).toBe(401);
    expect(requestWithoutActiveSessionResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.NOT_LOGGED_IN,
    );

    const response = await request(app)
      .get(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ME}`)
      .set('x-test-user-id', '64b91f1a220212c122b242ab');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGES.AUTH.NO_USER_EXISTS);
  });
});
