import { Application } from 'express';
// import Redis from 'ioredis'
import request from 'supertest';
import { AuthRoutePaths, UsersRoutePaths } from '../../enums/APIRoutPaths';
import { CookieNames, InputFields } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
// import { EmailService } from '../../services/EmailService'
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '../../utils/test-utils';
import {
  TEST_USER_ALTERNATE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
} from '../../utils/test-utils/constants';
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

    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.CHANGE_PASSWORD}`)
      .send({
        currentPassword: TEST_USER_PASSWORD,
        newPassword: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      })
      .set('x-test-user-id', loginResponse.body.user.id);

    expect(response.status).toBe(200);

    const loginWithOldPasswordResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_PASSWORD,
      });

    expect(loginWithOldPasswordResponse.status).toBe(401);
    expect(loginWithOldPasswordResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
    );

    // should be able to log in with new password
    const loginWithNewPasswordResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_ALTERNATE_PASSWORD,
      });
    expect(loginWithNewPasswordResponse.status).toBe(200);
    expect(
      loginWithNewPasswordResponse.headers['set-cookie'][0].includes(
        CookieNames.ACCESS_TOKEN,
      ),
    ).toBeTruthy();
  });

  it('sends error for non-matching passwords and password short', async () => {
    const { user } = await createTestUser(
      'hyitsvhjliugutro98iujgfkk',
      TEST_USER_EMAIL,
    );
    const loginResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_PASSWORD,
      });
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.CHANGE_PASSWORD}`)
      .send({
        currentPassword: 'aoeuPRIMETIM3',
        newPassword: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      })
      .set('x-test-user-id', loginResponse.body.user.id);
    const loginWithBadPasswordsResponse = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.CHANGE_PASSWORD}`)
      .send({
        currentPassword: 'aoeu',
        newPassword: 'aoeu',
        confirmPassword: 'asdf',
      })
      .set('x-test-user-id', loginResponse.body.user.id);

    console.log('THE HEADERS HERE=======>', response.body.message);

    expect(loginWithBadPasswordsResponse.status).toBe(400);
    expect(
      responseBodyIncludesCustomErrorMessage(
        loginWithBadPasswordsResponse,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        loginWithBadPasswordsResponse,
        InputFields.AUTH.NEW_PASSWORD,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorMessage(
        loginWithBadPasswordsResponse,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        loginWithBadPasswordsResponse,
        InputFields.AUTH.CONFIRM_PASSWORD,
      ),
    ).toBeTruthy();
  });

  it(`sends an error if the user doesn't  exist`, async () => {
    const requestWithoutActiveSessionResponse = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.CHANGE_PASSWORD}`)
      .send({
        currentPassword: TEST_USER_PASSWORD,
        newPassword: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });

    expect(requestWithoutActiveSessionResponse.status).toBe(401);
    expect(requestWithoutActiveSessionResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.NOT_LOGGED_IN,
    );

    // const { user } = await createTestUser(TEST_USER_EMAIL.trim().toLowerCase());
    const response = await request(app)
      .put(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.CHANGE_PASSWORD}`)
      .send({
        currentPassword: TEST_USER_PASSWORD,
        newPassword: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      })
      .set('x-test-user-id', '64b91f1a220212c122b242ab');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGES.AUTH.NO_USER_EXISTS);
  });
});
