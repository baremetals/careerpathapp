import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '@/lib/status-codes';
import catchAsync from '../utils/catchAsync';
import { FactoryRepo } from '@/repository/FactoryRepo';
import { IRepository } from '@/repository/IRepository';

export default function getMany<T>(Model: IRepository<T>, filter: object = {}) {
  return catchAsync(async (req: Request, res: Response) => {
    console.log('getMany', Model);
    const factoryRepo = new FactoryRepo();
    const docs = await factoryRepo.getMany(Model, filter, req.query);
    res.status(HTTP_STATUS_CODES.OK).json({
      count: docs.length,
      data: docs,
    });
  });
}
