import * as argon2 from 'argon2';
import { Application } from 'express';
import Redis from 'ioredis';
import { ACCOUNT_CREATION_SESSION_PREFIX } from 'lib/constants';
import { ERROR_MESSAGES } from 'lib/error-messages';
import { UserModel } from 'models/User';
import request from 'supertest';
import {
  responseBodyIncludesCustomErrorField,
  responseBodyIncludesCustomErrorMessage,
} from 'utils/test-utils';
import { EmailService } from '../../services/EmailService';
import createTestServer from '../../utils/createTestServer';

const registerInput = {
  email: 'verib47907@iturchia.com',
  password: 'Monk£y00',
  confirmPassword: 'Monk£y00',
  firstName: 'Bad',
  lastName: 'Temper',
};

describe('user registration', () => {
  //   let server: any;
  let app: Application | undefined;
  const redis = new Redis();

  const InputFields = {
    AUTH: {
      PASSWORD: 'password',
      PASSWORD_CONFIRM: 'confirmPassword',
      NAME: 'name',
      EMAIL: 'email',
    },
  };

  beforeAll(async () => {
    app = await createTestServer();
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    // server.close();
  });
  it('given the registration information are valid, sends an account creation verification email and creates an account creation attempt session', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(registerInput);
    console.log('===============>', response.status);
    expect(EmailService).toHaveBeenCalled();
    expect(response.status).toBe(200);
    // this session is needed to ensure the email link can not be used after a certain time has passed

    const registrationAttemptSession = await redis.get(
      ACCOUNT_CREATION_SESSION_PREFIX + registerInput.email,
    );
    const parsedSession = JSON.parse(registrationAttemptSession as string);
    expect(parsedSession.firstName).toBe(registerInput.firstName);
    expect(parsedSession.lastName).toBe(registerInput.lastName);
    expect(parsedSession.email).toBe(registerInput.email);
    expect(parsedSession.email).toBe(registerInput.email);

    expect(response.body).toHaveProperty('message');
    const hashedPasswordMatchesUserPassword = await argon2.verify(
      registerInput.password,
      parsedSession.password,
    );
    expect(hashedPasswordMatchesUserPassword).toBeTruthy();
  });

  it('gets errors for missing email or password', async () => {
    const startingCount = await UserModel.count();

    const response = await request(app).post(`/api/auth/register`).send({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.error);
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

    const finishCount = await UserModel.count();
    expect(finishCount - startingCount).toEqual(0);
  });

  it('gets errors for name length and non matching', async () => {
    const startingCount = await UserModel.count();

    const response = await request(app).post(`/api/auth/register`).send({
      firstName: '',
      lastName: '',
      email: registerInput.email,
      password: registerInput.password,
      passwordConfirm: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.error);
    expect(
      responseBodyIncludesCustomErrorMessage(
        response,
        ERROR_MESSAGES.VALIDATION.AUTH.NAME_MIN_LENGTH,
      ),
    ).toBeTruthy();
    expect(
      responseBodyIncludesCustomErrorField(response, InputFields.AUTH.NAME),
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
        InputFields.AUTH.PASSWORD_CONFIRM,
      ),
    ).toBeTruthy();

    const finishCount = await UserModel.count();
    expect(finishCount - startingCount).toEqual(0);
  });
});
