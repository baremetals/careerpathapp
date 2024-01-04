import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';
import { AuthRoutePaths } from '@/enums/APIRoutPaths';
import { CookieNames, RESET_PASSWORD, InputFields } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
// import { EmailService } from '@/services/EmailService';
import { signJwtAsymmetric } from '@/utils/jwt';
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '@/utils/test-utils';
import {
  TEST_USER_ALTERNATE_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_PASSWORD,
} from '@/utils/test-utils/constants';
import createTestUser from '@/utils/test-utils/create-test-user';
import createTestServer from '@/utils/test-utils/createTestServer';

describe('reset password handler', () => {
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
  it(`successfully updates password when given a valid token, and matching new passwords,
  user can't log in with old password but can with new password and user cannot reuse the
  same token to change password again`, async () => {
    const { user } = await createTestUser();

    const passwordResetToken = signJwtAsymmetric(
      { email: user.email },
      process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
      {
        expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      },
    );
    await redis.set(
      RESET_PASSWORD + passwordResetToken,
      user.email,
      'EX',
      60 * 60 * 24 * 2,
    ); // 48 hours
    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/${passwordResetToken}`,
      )
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });
    // expect(EmailService).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');

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
    const loginResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_ALTERNATE_PASSWORD,
      });
    expect(loginResponse.status).toBe(201);
    expect(
      loginResponse.headers['set-cookie'][0].includes(CookieNames.ACCESS_TOKEN),
    ).toBeTruthy();

    const secondAttemptWithSameToken = await request(app)
      .post(`/api/auth${AuthRoutePaths.RESET_PASSWORD}/${passwordResetToken}`)
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });
    console.log(secondAttemptWithSameToken.body);
    expect(secondAttemptWithSameToken.status).toBe(401);
    expect(secondAttemptWithSameToken.body.message).toBe(
      ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN,
    );
  });

  it('sends error for non-matching passwords and password short', async () => {
    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/passwordResetToken`,
      )
      .send({
        password: 'aoeu',
        confirmPassword: 'asdf',
      });

    expect(response.status).toBe(400);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        response,
        InputFields.AUTH.CONFIRM_PASSWORD,
      ),
    ).toBeTruthy();
  });

  it('sends error for an invalid token', async () => {
    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/passwordResetToken`,
      )
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });

    expect(response.status).toBe(401);
  });

  it('sends error for non-existent email/user', async () => {
    const { user } = await createTestUser(TEST_USER_EMAIL.trim().toLowerCase());
    const passwordResetToken = signJwtAsymmetric(
      { email: TEST_USER_EMAIL_ALTERNATE },
      process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
      {
        expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      },
    );
    await redis.set(
      RESET_PASSWORD + passwordResetToken,
      user.email,
      'EX',
      60 * 60 * 24 * 2,
    ); // 48 hours

    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/${passwordResetToken}`,
      )
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      ERROR_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN,
    );
  });
});
