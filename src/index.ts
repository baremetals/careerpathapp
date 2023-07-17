import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
// import hbs from 'hbs';

import AppError from './utils/appError';
import globalErrorHandler from './errors/errorHandler';
import careerPathRouter from './routes/careerPaths';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import adminRouter from './routes/admin';
import uiRouter from './routes/ui';
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
function createServer() {
  const app = express();
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Welcome to career paths docs',
        version: '1.0.0',
        description: 'career path application',
      },
      servers: [
        {
          url: 'http://localhost:9500',
        },
      ],
    },
    apis: ['src/routes/*/*.ts'],
  };
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  const specs = swaggerJsDoc(options);

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  // const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: redis,
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
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
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

export default createServer;
