import { Application } from 'express';
import request from 'supertest';
import { AuthRoutePaths, UsersRoutePaths } from '../../enums/APIRoutPaths';
import { CookieNames } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { TEST_USER_PASSWORD } from '../../utils/test-utils/constants';
import createTestUser from '../../utils/test-utils/create-test-user';
import createTestServer from '../../utils/test-utils/createTestServer';

jest.setTimeout(30000);
describe('change password handler', () => {
  process.env.NODE_ENV = 'development';
  let app: Application | undefined;

  beforeAll(async () => {
    app = await createTestServer();
  });

  it(`provided the user is logged in and provides their current password, they should be able to change their password`, async () => {
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

    // Delete Account request
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ME}`)
      .set('x-test-user-id', loginResponse.body.user.id);
    const cookies = response.headers['set-cookie'];
    expect(response.status).toBe(200);
    expect(cookies).toBeDefined();
    const accessTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith(`${CookieNames.ACCESS_TOKEN}=`),
    );
    expect(accessTokenCookie).toBeDefined();
    expect(
      response.headers['set-cookie'][0].includes(
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      ),
    ).toBeTruthy();

    // login after deleting account shouldn't be possible
    const loginAfterDeletionResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_PASSWORD,
      });
    console.log(loginAfterDeletionResponse.body.message);
    expect(loginAfterDeletionResponse.status).toBe(401);
    expect(loginAfterDeletionResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST,
    );
  });

  it(`sends an error if the user doesn't  exist or user doesn't have an active session`, async () => {
    const requestWithoutActiveSessionResponse = await request(app).put(
      `/api${UsersRoutePaths.ROOT}${UsersRoutePaths.ME}`,
    );
    expect(requestWithoutActiveSessionResponse.status).toBe(401);
    expect(requestWithoutActiveSessionResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.NOT_LOGGED_IN,
    );

    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}`)
      .set('x-test-user-id', '64b91f1a220212c122b242ab');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGES.AUTH.NO_USER_EXISTS);
  });
});
