import { AuthRoutePaths } from '@/enums/APIRoutPaths';
import { InputFields, ACCOUNT_CREATION_SESSION_PREFIX } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/error-messages';
import { UserModel } from '@/models/User';
import dotenv from 'dotenv';
import { Application } from 'express';
import request from 'supertest';

import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '@/utils/test-utils';
import {
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_FIRST_NAME,
  TEST_USER_LAST_NAME,
  TEST_USER_PASSWORD,
} from '@/utils/test-utils/constants';
import createTestServer from '@/utils/test-utils/createTestServer';
import { createClient } from 'redis';
dotenv.config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});
const registerInput = {
  email: TEST_USER_EMAIL_ALTERNATE,
  password: TEST_USER_PASSWORD,
  confirmPassword: TEST_USER_PASSWORD,
  firstName: TEST_USER_FIRST_NAME,
  lastName: TEST_USER_LAST_NAME,
};

jest.setTimeout(30000);
describe('user registration', () => {
  //   let server: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let app: Application | undefined;
  redisClient.on('error', (err: any) => console.log(err));
  redisClient.connect();
  redisClient.on('connect', () => console.log('Redis connection successful!'));

  beforeAll(async () => {
    process.env.NODE_ENV = 'development';
    app = await createTestServer();
    await redisClient.flushDb();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('given the registration information are valid, sends an account creation verification email and creates an account creation attempt session', async () => {
    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}${AuthRoutePaths.REGISTER}`)
      .send({
        email: TEST_USER_EMAIL_ALTERNATE,
        password: TEST_USER_PASSWORD,
        confirmPassword: TEST_USER_PASSWORD,
        firstName: TEST_USER_FIRST_NAME,
        lastName: TEST_USER_LAST_NAME,
      });
    expect(response.status).toBe(202);
    const registrationAttemptSession = await redisClient.get(
      ACCOUNT_CREATION_SESSION_PREFIX + TEST_USER_EMAIL_ALTERNATE,
    );
    console.log('registrationAttemptSession=====>', registrationAttemptSession);
    const parsedSession = JSON.parse(registrationAttemptSession as string);
    expect(parsedSession.firstName).toBe(registerInput.firstName);
    expect(parsedSession.lastName).toBe(registerInput.lastName);
    expect(parsedSession.email).toBe(TEST_USER_EMAIL_ALTERNATE);
    expect(parsedSession.password).toBe(TEST_USER_PASSWORD);
    await redisClient.del(
      ACCOUNT_CREATION_SESSION_PREFIX + TEST_USER_EMAIL_ALTERNATE,
    );
  });

  it('gets errors for missing email or password', async () => {
    const startingCount = await UserModel.countDocuments();
    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}${AuthRoutePaths.REGISTER}`)
      .send({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    expect(response.status).toBe(400);
    expect(response.body.error);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.INVALID_EMAIL,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.EMAIL),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.PASSWORD),
    ).toBeTruthy();

    const finishCount = await UserModel.countDocuments();
    expect(finishCount - startingCount).toEqual(0);
  }, 10000);

  it('gets errors for name length and non matching', async () => {
    const startingCount = await UserModel.count();

    const response = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}${AuthRoutePaths.REGISTER}`)
      .send({
        firstName: '',
        lastName: '',
        email: registerInput.email,
        password: registerInput.password,
        confirmPassword: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.error);
    expect(response.body).toBeInstanceOf(Array);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.NAME_MIN_LENGTH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        response,
        InputFields.AUTH.FIRST_NAME,
      ),
    ).toBeTruthy();

    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DO_NOT_MATCH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(
        response,
        InputFields.AUTH.CONFIRM_PASSWORD,
      ),
    ).toBeTruthy();

    const finishCount = await UserModel.count();
    expect(finishCount - startingCount).toEqual(0);
  });
});
