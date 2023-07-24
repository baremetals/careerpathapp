import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
// import Redis from 'ioredis';
import { MongoMemoryServer } from 'mongodb-memory-server';
import redis from 'redis-mock';
import RedisStore from 'connect-redis';
import cors from 'cors';

import AppError from './appError';
import globalErrorHandler from '../errors/errorHandler';
import careerPathRouter from '../routes/careerPaths';
import authRouter from '../routes/auth';
import userRouter from '../routes/users';
import adminRouter from '../routes/admin';
import uiRouter from '../routes/ui';
import path from 'path';
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

  app.use('/', uiRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/careers', careerPathRouter);
  app.use('/api/admin', adminRouter);

  app.all('*', function (req, _res, next) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  app.use(globalErrorHandler);

  return app;
}

export default createTestServer;
