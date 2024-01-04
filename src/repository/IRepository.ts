import { Model } from 'mongoose';
export interface IRepository<T> {
  // insertMany(docs: T[]): Promise<T[]>;
  Model: Model<T>;
}
