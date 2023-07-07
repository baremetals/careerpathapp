import mongoose from 'mongoose';
import dotenv from 'dotenv';


process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

import { main, app } from './index';

const port = process.env.PORT ? process.env.PORT : 9500;

dotenv.config();


const DB = process?.env?.DATABASE?.replace(
  '<password>',
  process?.env?.DATABASE_PASSWORD as string,
) as string;

mongoose
  .connect(DB, {
    // ssl: true,
    sslValidate: false,
  })
  .then(() => console.log('DB connection successful!'));

  main();
const server =  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});