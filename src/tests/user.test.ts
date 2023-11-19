import { Application } from 'express';
import request from 'supertest';
import Redis from 'ioredis';
import createTestServer from '../utils/createTestServer';
import { EmailService } from '../services/EmailService';
import * as argon2 from 'argon2';
import { ACCOUNT_CREATION_SESSION_PREFIX } from 'common/constants';

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

  beforeAll(async () => {
    app = await createTestServer();
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    // server.close();
  });
  describe('given the registration information are valid, sends an account creation verification email and creates an account creation attempt session', async () => {
    it('should register the user, create user profile, send welcome email and return message', async () => {
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
  });
});
