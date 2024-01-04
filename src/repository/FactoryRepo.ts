import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import AppError from '@/utils/appError';
// import { ERROR_MESSAGES } from '../lib/error-messages';
// import { Model } from 'mongoose';
import { IRepository } from './IRepository';
import APIQueryFeatures from '@/utils/apiQueryFeatures';
// import mongoose from 'mongoose';
import { QueryParams } from '@/interfaces';
import { UpdateQuery } from 'mongoose';

export class FactoryRepo {
  //   async createManyS<T>(Model: Model<T>, docs: []) {
  //     try {
  //       return await Model.insertMany(docs);
  //     } catch (error) {
  //       console.error(error);
  //       throw new AppError(
  //         'Failed to create the models',
  //         HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
  async createOne<T>(Model: IRepository<T>, doc: T) {
    try {
      return await Model.Model.create(doc);
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Failed to create the model',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOne<T>(Model: IRepository<T>, id: string, doc: UpdateQuery<T>) {
    try {
      return await Model.Model.findByIdAndUpdate(id, doc, {
        new: true,
        runValidators: true,
      }).exec();
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Failed to update the model',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deleteOne<T>(Model: IRepository<T>, id: string) {
    try {
      return await Model.Model.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Failed to delete the model',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createMany<T>(Model: IRepository<T>, docs: T[]) {
    try {
      return await Model.Model.insertMany(docs);
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Failed to create the models',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMany<T>(
    Model: IRepository<T>,
    query: QueryParams,
    filter: object = {},
  ) {
    try {
      const features = new APIQueryFeatures(Model.Model.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      return await features.query.exec();
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Failed to get the models',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
