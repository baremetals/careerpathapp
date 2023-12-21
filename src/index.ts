import RedisStore from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import path from 'path';
import {
  AdminRoutePaths,
  AuthRoutePaths,
  CareerRoutePaths,
  UsersRoutePaths,
} from './enums/APIRoutPaths';
import globalErrorHandler from './middleware/errorHandler';
import adminRouter from './routes/admin';
import authRouter from './routes/auth-route';
import careerPathRouter from './routes/careers-route';
import uiRouter from './routes/ui';
import uploadRouter from './routes/uploads';
import userRouter from './routes/users-route';
import AppError from './utils/appError';

// This is required to extend the  express-session type.
declare module 'express-session' {
  interface Session {
    userId: string;
    role: string;
    userName: string;
    profileId: string;
  }
}

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
          url: 'http://localhost:4000',
        },
      ],
    },
    apis: ['src/routes/*/*.ts'],
  };
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  const specs = swaggerJsDoc(options);

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

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
  app.use(`/api${AuthRoutePaths.ROOT}`, authRouter);
  app.use(`/api${UsersRoutePaths.ROOT}`, userRouter);
  app.use(`/api${UsersRoutePaths.UPLOADS}`, uploadRouter);
  app.use(`/api${CareerRoutePaths.ROOT}`, careerPathRouter);
  app.use(`/api${AdminRoutePaths.ROOT}`, adminRouter);

  app.all('*', function (req, _res, next) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  app.use(globalErrorHandler);

  return app;
}

export default createServer;
