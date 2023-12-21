import { QueryParams } from '@/interfaces';
import { Query } from 'mongoose';

class APIQueryFeatures {
  query: Query<any, any>;
  queryString: QueryParams;

  constructor(query: Query<any, any>, queryString: QueryParams) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // const queryObj = { ...this.queryString } as { [key: string]: any };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    const excludedFields = new Set(['page', 'sort', 'limit', 'fields']);
    const queryObj = Object.keys(this.queryString)
      .filter((key) => !excludedFields.has(key))
      .reduce((obj: { [key: string]: any }, key) => {
        obj[key] = this.queryString[key];
        return obj;
      }, {});

    // Advanced filtering (e.g., lt, gt, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page as string) || 1;
    const limit = parseInt(this.queryString.limit as string) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIQueryFeatures;
