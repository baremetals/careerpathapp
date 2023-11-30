import { Application } from 'express';
// import Redis from 'ioredis';
import request from 'supertest';
import { AuthRoutePaths, UsersRoutePaths } from '../../enums/APIRoutPaths';
import { CookieNames } from '../../lib/constants';
import { ERROR_MESSAGES } from '../../lib/error-messages';
// import { EmailService } from '../../services/EmailService';
import { TEST_USER_PASSWORD } from '../../utils/test-utils/constants';
import createTestUser from '../../utils/test-utils/create-test-user';
import createTestServer from '../../utils/test-utils/createTestServer';
// const imageFile =
//   '"C:UsersDanielAsanteDesktopProjects\baremetalscareerpathappdatadude.jpg"';

describe('update avatar handler', () => {
  process.env.NODE_ENV = 'development';
  let app: Application | undefined;
  // const redis = new Redis();

  beforeAll(async () => {
    app = await createTestServer();
    // await redis.flushdb();
  });

  afterAll(async () => {
    // await redis.quit();
    // server.close();
  });
  it(`a logged in user should be able to update their profile avatar`, async () => {
    const { user } = await createTestUser();
    const imageFile =
      '"C:UsersDanielAsanteDesktopProjects\baremetalscareerpathappdatadude.jpg"';
    const loginResponse = await request(app)
      .post(`/api${AuthRoutePaths.ROOT}`)
      .send({
        email: user.email,
        password: TEST_USER_PASSWORD,
      });
    expect(loginResponse.status).toBe(201);
    expect(
      loginResponse.headers['set-cookie'][0].includes(CookieNames.ACCESS_TOKEN),
    ).toBeTruthy();
    // Get logged in user details
    const response = await request(app)
      .post(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.UPLOAD_AVATAR}`)
      .set('x-test-user-id', loginResponse.body.user.id)
      .attach('file', __dirname + imageFile);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    console.log(
      'THE LINK TO DO THE UPLOAD ==========================>',
      response.body,
    );
  });

  it(`sends an error if the user doesn't  exist or user doesn't have an active session`, async () => {
    const requestWithoutActiveSessionResponse = await request(app).post(
      `/api${UsersRoutePaths.ROOT}${UsersRoutePaths.UPLOAD_AVATAR}`,
    );
    // .attach('file', imageFile);
    expect(requestWithoutActiveSessionResponse.status).toBe(401);
    expect(requestWithoutActiveSessionResponse.body.message).toBe(
      ERROR_MESSAGES.AUTH.NOT_LOGGED_IN,
    );

    const response = await request(app)
      .post(`/api${UsersRoutePaths.ROOT}${UsersRoutePaths.UPLOAD_AVATAR}`)
      // .attach('file', imageFile)
      .set('x-test-user-id', '64b91f1a220212c122b242ab');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGES.AUTH.NO_USER_EXISTS);
  });
});
