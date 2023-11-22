import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
// import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import redis from 'redis-mock';

import path from 'path';
import globalErrorHandler from '../../middleware/errorHandler';
import adminRouter from '../../routes/admin';
import authRouter from '../../routes/auth-route';
import careerPathRouter from '../../routes/careerPaths';
import uiRouter from '../../routes/ui';
import userRouter from '../../routes/users-route';
import AppError from '../../utils/appError';
// import dotenv from 'dotenv';
// dotenv.config();

// This is required to extend the  express-session type.
declare module 'express-session' {
  interface Session {
    userId: string;
    role: string;
    // userName: string;
  }
}

// const app = express();
async function createTestServer() {
  const app = express();

  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static('public'));

  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const client = redis.createClient({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  // const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: client,
  });

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : '*',
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: 'Strict',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24, // 24 hrs
      },
    } as any),
  );
  app.use((req: Request, _res, next) => {
    if (req.headers['x-test-user-id']) {
      req.session.userId = req.headers['x-test-user-id'] as string;
    }
    // req.session.userId = 'Test Nigger'; // Mocked session object
    next();
  });
  // console.log(req.seesion.userId);
  app.use('/', uiRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/careers', careerPathRouter);
  app.use('/api/admin', adminRouter);

  app.all('*', function (req: Request, _res: Response, next: NextFunction) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  // app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  //   const err = new Error(`Route ${req.originalUrl} not found`) as any;
  //   err.status = 404;
  //   next(err);
  // });
  app.use(globalErrorHandler);

  return app;
}

export default createTestServer;
