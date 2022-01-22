import 'reflect-metadata';
import { inject } from 'inversify';
import { controller, BaseHttpController, httpPost } from 'inversify-express-utils';
import { Request } from 'express';

import HttpError from '../exception/HttpError';
import { RecordCollection } from '../model/RecordCollection';
import TYPES from '../config/TYPES';
import { isRecordsRequest } from '../validator/ApiV1Records.validator';

@controller('/api/v1/records')
export default class RecordController extends BaseHttpController {
  private recordCollection: RecordCollection;

  constructor(@inject(TYPES.RecordCollection) recordCollection: RecordCollection) {
    super();
    this.recordCollection = recordCollection;
  }

  @httpPost('/')
  public async post(request: Request) {
    const reqBody = request.body;
    if (!isRecordsRequest(reqBody)) {
      return {
        code: 400,
        msg: isRecordsRequest.errors![0].message,
        records: [],
      };
    }
    try {
      return {
        code: 0,
        msg: 'Success',
        records: await this.recordCollection.filterByDateAndCount(reqBody.startDate, reqBody.endDate, reqBody.minCount, reqBody.maxCount),
      };
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        const error = err as HttpError;
        return {
          code: error.responseCode,
          msg: error.message,
          records: [],
        };
      }
      return {
        code: 500,
        msg: 'Internal Server Error',
        records: [],
      };
    }
  }
}
