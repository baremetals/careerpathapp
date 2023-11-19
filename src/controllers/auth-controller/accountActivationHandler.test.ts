import * as argon2 from 'argon2';
import { signJwtAsymmetric } from 'controllers/utils/jwt';
import { Application } from 'express';
import Redis from 'ioredis';
import { ACCOUNT_CREATION_SESSION_PREFIX } from 'lib/constants';
import { ERROR_MESSAGES } from 'lib/error-messages';
import { UserModel } from 'models/User';
import request from 'supertest';
import { responseBodyIncludesCustomErrorMessage } from 'utils/test-utils';
import createTestServer from '../../utils/createTestServer';

const registerInput = {
  email: 'verib47907@iturchia.com',
  password: 'Monk£y00',
  confirmPassword: 'Monk£y00',
  firstName: 'Bad',
  lastName: 'Temper',
};

describe('user activation', () => {
  //   let server: any;
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
      { email: registerInput.email },
      process.env.ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY as string,
      {
        expiresIn: process.env.ACCOUNT_ACTIVATION_SESSION_EXPIRATION as string,
      },
    );
    const hashedPassword = await argon2.hash(registerInput.password);
    const redis = new Redis();

    await redis.set(
      ACCOUNT_CREATION_SESSION_PREFIX + registerInput.email,
      JSON.stringify({
        email: registerInput.email,
        firstNam: registerInput.firstName,
        lastNam: registerInput.lastName,
        password: hashedPassword,
      }),
      'EX',
      1000 * 60 * 60 * 48,
    ); // 48 hours
    const response = await request(app)
      .post('/api/activate/:token')
      .send(token as string);
    console.log('===============>', response.status);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).toHaveProperty('createdAt');
    expect(response.body.user).toHaveProperty('lastModifiedAt');
    expect(response.body.user.firstName).toBe(registerInput.firstName);
    expect(response.body.user.email).toBe(registerInput.email);

    const finishCount = await UserModel.count();
    expect(finishCount - startingCount).toEqual(1);

    const responseForSecondCreation = await request(app)
      .post('/api/activate/:token')
      .send({ token });
    expect(responseForSecondCreation.status).toBe(401);
    expect(
      responseBodyIncludesCustomErrorMessage(
        responseForSecondCreation,
        ERROR_MESSAGES.AUTH.USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION,
      ),
    ).toBeTruthy();
  });

  it("doesn't allow creation of an account without a valid token", async () => {
    const token = 'invalid token';
    const response = await request(app)
      .post(`/api/activate/:token`)
      .send({ token });
    expect(response.status).toBe(401);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN,
      ),
    ).toBeTruthy();
  });
});
