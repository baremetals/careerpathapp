interface IBase {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IShared extends IBase {
  createdBy: string;
  lastModifiedBy: string;
}

interface QueryParams {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: any;
}

// interface ICategoryDocument extends IShared {
//   name: string;
//   type: string;
// }

export { IShared, QueryParams };
