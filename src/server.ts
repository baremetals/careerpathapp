import dotenv from 'dotenv';
import mongoose from 'mongoose';
import createServer from './index';
import { redisClient } from './services/redis/client';
dotenv.config();
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT ? process.env.PORT : 9500;

const app = createServer();
const DB = process?.env?.DATABASE?.replace(
  '<password>',
  process?.env?.DATABASE_PASSWORD as string,
) as string;

mongoose
  .connect(DB, {
    // ssl: true, // Enable this if your MongoDB server supports SSL
    sslValidate: false,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});

redisClient.on('error', (err: any) => console.log(err));
// redisClient.connect();
redisClient.on('connect', () => console.log('Redis connection successful!'));

const server = app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
  // Attempt to reconnect
  mongoose.connect(DB, {
    // ssl: true,
    sslValidate: true,
  });
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
