import * as argon2 from 'argon2';
import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';
import { AuthRoutePaths } from '../../enums/APIRoutPaths';
import { ACCOUNT_CREATION_SESSION_PREFIX } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
import { signJwtAsymmetric } from '../../utils/jwt';
import {
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_FIRST_NAME,
  TEST_USER_LAST_NAME,
  TEST_USER_PASSWORD,
} from '../../utils/test-utils/constants';
import createTestServer from '../../utils/test-utils/createTestServer';

jest.setTimeout(30000);
describe('user activation', () => {
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
  it(`upon visiting /account-activation with proper token while a valid session is active creates user account
    and doesn't allow reuse of the same token/session`, async () => {
    const startingCount = await UserModel.count();

    const token = signJwtAsymmetric(
      { email: TEST_USER_EMAIL_ALTERNATE },
      process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
      {
        expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      },
    );

    const hashedPassword = await argon2.hash(TEST_USER_PASSWORD);

    await redis.set(
      ACCOUNT_CREATION_SESSION_PREFIX + TEST_USER_EMAIL_ALTERNATE,
      JSON.stringify({
        email: TEST_USER_EMAIL_ALTERNATE,
        firstName: TEST_USER_FIRST_NAME,
        lastName: TEST_USER_LAST_NAME,
        password: hashedPassword,
      }),
      'EX',
      60 * 60 * 24 * 2,
    ); // 48 hours

    const response = await request(app).get(
      `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.ACCOUNT_ACTIVATION}/${token}`,
    );
    // console.log('===============>', response.status)
    expect(response.status).toBe(201);

    const finishCount = await UserModel.count();
    expect(finishCount - startingCount).toEqual(1);

    const responseForSecondCreation = await request(app).get(
      `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.ACCOUNT_ACTIVATION}/${token}`,
    );
    // console.log('REDIS SECOND CALL:===============>')
    expect(responseForSecondCreation.status).toBe(401);
    expect(responseForSecondCreation.body.message).toBe(
      ERROR_MESSAGES.AUTH.USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION,
    );
  });

  it("doesn't allow creation of an account without a valid token", async () => {
    const response = await request(app).get(
      `/api${AuthRoutePaths.ROOT}${AuthRoutePaths.ACCOUNT_ACTIVATION}/token`,
    );
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN,
    );
  });
});
