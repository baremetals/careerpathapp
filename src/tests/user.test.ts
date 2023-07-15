import { Application } from 'express';
import request from 'supertest';
import Redis from 'ioredis';
import createTestServer from '../utils/createTestServer';

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
  describe('given the registration information are valid', () => {
    it('should register the user, create user profile, send welcome email and return message', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(registerInput);
      console.log('===============>', response.status);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
    });
  });
});
