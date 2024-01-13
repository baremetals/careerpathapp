import { Application } from 'express';
import Redis from 'ioredis';
import request from 'supertest';
import { AuthRoutePaths } from '../../enums/APIRoutPaths';
import {
  ACCOUNT_CREATION_SESSION_PREFIX,
  InputFields,
} from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
import { UserModel } from '../../models/User';
// import { EmailService } from '../../services/EmailService'
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from '../../utils/test-utils';
import {
  TEST_USER_EMAIL_ALTERNATE,
  TEST_USER_FIRST_NAME,
  TEST_USER_LAST_NAME,
  TEST_USER_PASSWORD,
} from '../../utils/test-utils/constants';
import createTestServer from '../../utils/test-utils/createTestServer';

const registerInput = {
  email: TEST_USER_EMAIL_ALTERNATE,
  password: TEST_USER_PASSWORD,
  confirmPassword: TEST_USER_PASSWORD,
  firstName: TEST_USER_FIRST_NAME,
  lastName: TEST_USER_LAST_NAME,
};

describe('user registration', () => {
  //   let server: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let app: Application | undefined;
  const redis = new Redis();

  beforeAll(async () => {
    process.env.NODE_ENV = 'development';
    app = await createTestServer();
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    // server.close();
  });
  // jest.setTimeout(40000);

  it('given the registration information are valid, sends an account creation verification email and creates an account creation attempt session', async () => {
    await request(app)
      .post(`/api${AuthRoutePaths.ROOT}${AuthRoutePaths.REGISTER}`)
      .send({
        email: TEST_USER_EMAIL_ALTERNATE,
        password: TEST_USER_PASSWORD,
        confirmPassword: TEST_USER_PASSWORD,
        firstName: TEST_USER_FIRST_NAME,
        lastName: TEST_USER_LAST_NAME,
      });

    const registrationAttemptSession = await redis.get(
      ACCOUNT_CREATION_SESSION_PREFIX + TEST_USER_EMAIL_ALTERNATE,
    );
    const parsedSession = JSON.parse(registrationAttemptSession as string);
    expect(parsedSession.firstName).toBe(registerInput.firstName);
    expect(parsedSession.lastName).toBe(registerInput.lastName);
    expect(parsedSession.email).toBe(TEST_USER_EMAIL_ALTERNATE);
    expect(parsedSession.password).toBe(TEST_USER_PASSWORD);
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
        ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH,
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
