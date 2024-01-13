import { AuthRoutePaths } from '@/enums/APIRoutPaths';
import { CookieNames, InputFields, RESET_PASSWORD } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { signJwtAsymmetric } from '@/utils/jwt';
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '@/utils/test-utils';
import {
  TEST_USER_ALTERNATE_PASSWORD,
  // TEST_USER_EMAIL,
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_EMAIL_FAKER,
  TEST_USER_PASSWORD,
  WAVE_TEST_USER_ALTERNATE_PASSWORD,
} from '@/utils/test-utils/constants';
import createTestUser from '@/utils/test-utils/create-test-user';
import createTestServer from '@/utils/test-utils/createTestServer';
import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';

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
  });
  it(`successfully updates password when given a valid token, and matching new passwords,
  user can't log in with old password but can with new password and user cannot reuse the
  same token to change password again`, async () => {
    const { user } = await createTestUser();

    let passwordResetToken = signJwtAsymmetric(
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

    // Reset password with non matching passwords
    const nonMatchingPasswordResponse = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/${passwordResetToken}`,
      )
      .send({
        password: 'aoeu',
        confirmPassword: 'asdf',
      });

    expect(nonMatchingPasswordResponse.status).toBe(400);
    expect(
      responseBodyIncludesCustomErrorMessage(
        nonMatchingPasswordResponse,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        nonMatchingPasswordResponse,
        InputFields.AUTH.PASSWORD,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorMessage(
        nonMatchingPasswordResponse,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        nonMatchingPasswordResponse,
        InputFields.AUTH.CONFIRM_PASSWORD,
      ),
    ).toBeTruthy();

    // Reset password with valid token
    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/${passwordResetToken}`,
      )
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });
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
    const loginResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_ALTERNATE_PASSWORD,
      });
    expect(loginResponse.status).toBe(200);
    expect(
      loginResponse.headers['set-cookie'][0].includes(CookieNames.ACCESS_TOKEN),
    ).toBeTruthy();

    passwordResetToken = null;
    const secondAttemptWithSameToken = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/${passwordResetToken}`,
      )
      .send({
        password: TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: TEST_USER_ALTERNATE_PASSWORD,
      });
    expect(secondAttemptWithSameToken.status).toBe(401);
    expect(secondAttemptWithSameToken.body.message).toBe(
      ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN,
    );
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
    const { user } = await createTestUser(
      '60a7b1b9e1b9b3e6',
      TEST_USER_EMAIL_FAKER.trim().toLowerCase(),
    );
    const wrongEmailPasswordResetToken = signJwtAsymmetric(
      { email: TEST_USER_EMAIL_ALTERNATE },
      process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
      {
        expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      },
    );
    await redis.set(
      RESET_PASSWORD + wrongEmailPasswordResetToken,
      user.email,
      'EX',
      60 * 60 * 24 * 2,
    ); // 48 hours

    const response = await request(app)
      .post(
        `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.RESET_PASSWORD}/${
          wrongEmailPasswordResetToken as string
        }`,
      )
      .send({
        password: WAVE_TEST_USER_ALTERNATE_PASSWORD,
        confirmPassword: WAVE_TEST_USER_ALTERNATE_PASSWORD,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      ERROR_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN,
    );
  });
});
